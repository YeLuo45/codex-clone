import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execSync } from "node:child_process";
import {
  mkdirSync,
  writeFileSync,
  rmSync,
  existsSync,
  readFileSync,
  renameSync,
  unlinkSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(__dirname, "..");
const REPO = resolve(WEB, "..");
const DIST = resolve(WEB, "dist");

function run(cmd: string, options: { cwd?: string } = {}) {
  return execSync(cmd, {
    encoding: "utf8",
    cwd: options.cwd ?? WEB,
    stdio: "pipe",
  });
}

describe("scripts/check-readme.mjs", () => {
  it("passes against the current README + package.json", () => {
    const out = run("node scripts/check-readme.mjs");
    expect(out).toMatch(/\[check-readme\] PASS/);
    expect(out).toMatch(/npm commands documented in README/);
  });

  it("FAILS when README references a non-existent npm script", () => {
    // Snapshot the real README so we can restore it after this test
    const readmePath = resolve(REPO, "README.md");
    const real = readFileSync(readmePath, "utf8");
    const tampered =
      real +
      "\n```bash\nnpm run absolutely-nonexistent-script-xyz123\n```\n";

    const tmpDir = resolve(REPO, ".tmp-readme-test");
    rmSync(tmpDir, { recursive: true, force: true });
    mkdirSync(tmpDir, { recursive: true });
    const tmpReadme = resolve(tmpDir, "README.md");
    writeFileSync(tmpReadme, tampered);

    // Move real README, symlink ours, run check, restore
    const backup = resolve(tmpDir, "README.md.real");
    renameSync(readmePath, backup);
    try {
      renameSync(tmpReadme, readmePath);
      let exitCode = 0;
      try {
        run("node scripts/check-readme.mjs");
      } catch (e: any) {
        exitCode = e.status ?? 1;
      }
      expect(exitCode).toBe(1);
    } finally {
      // Restore the real README
      if (existsSync(readmePath)) unlinkSync(readmePath);
      renameSync(backup, readmePath);
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});

describe("scripts/check-dist.mjs", () => {
  beforeAll(() => {
    // Ensure dist/ exists for the green-path test
    if (!existsSync(DIST)) {
      try {
        run("npm run build");
      } catch {
        /* ignore */
      }
    }
  });

  it("passes after a successful build", () => {
    const out = run("node scripts/check-dist.mjs");
    expect(out).toMatch(/\[check-dist\] PASS/);
    expect(out).toMatch(/sitemap\.xml\(7 routes\)/);
    expect(out).toMatch(/2 lazy chunks/);
  });

  it("FAILS when dist/index.html is missing", () => {
    const moved: string[] = [];
    for (const file of ["index.html", "sitemap.xml", "robots.txt"]) {
      const p = resolve(DIST, file);
      if (existsSync(p)) {
        renameSync(p, resolve(DIST, file + ".bak"));
        moved.push(file);
      }
    }

    try {
      let exitCode = 0;
      try {
        run("node scripts/check-dist.mjs");
      } catch (e: any) {
        exitCode = e.status ?? 1;
      }
      expect(exitCode).toBe(1);
    } finally {
      for (const file of moved) {
        const tmp = resolve(DIST, file + ".bak");
        const real = resolve(DIST, file);
        if (existsSync(tmp)) {
          if (existsSync(real)) unlinkSync(real);
          renameSync(tmp, real);
        }
      }
    }
  });

  afterAll(() => {
    if (!existsSync(DIST)) {
      try {
        run("npm run build");
      } catch {
        /* leave it */
      }
    }
  });
});
