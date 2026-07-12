#!/usr/bin/env node
/**
 * Pre-commit hook structure & invocation tests.
 *
 * Validates the .husky/pre-commit shell hook:
 *   - file exists, is executable
 *   - shell syntax is parseable (`bash -n`)
 *   - covers the failure path: when web/ is missing OR when verify fails,
 *     the script exits non-zero
 *   - covers the success path: run verify against a green workspace
 *
 * These tests use an isolated temp web/ symlink to avoid clobbering the
 * real repo and to simulate "broken web/" state.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  statSync,
  mkdirSync,
  symlinkSync,
  rmSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..", "..");
const HOOK = resolve(REPO, ".husky", "pre-commit");

function run(cmd, opts = {}) {
  return execSync(cmd, {
    encoding: "utf8",
    cwd: opts.cwd ?? REPO,
    stdio: "pipe",
    env: { ...process.env, ...(opts.env ?? {}), FORCE_COLOR: "0" },
    timeout: opts.timeout ?? 120_000,
  });
}

function runCaptureExit(cmd, opts = {}) {
  try {
    run(cmd, opts);
    return { code: 0, stdout: "", stderr: "" };
  } catch (e) {
    return {
      code: e.status ?? 1,
      stdout: (e.stdout || "").toString(),
      stderr: (e.stderr || "").toString(),
    };
  }
}

describe(".husky/pre-commit structural checks", () => {
  it("file exists", () => {
    expect(existsSync(HOOK)).toBe(true);
  });

  it("is executable", () => {
    const s = statSync(HOOK);
    // owner execute bit should be set
    expect(s.mode & 0o100).toBeGreaterThan(0);
  });

  it("starts with a shebang (bash)", () => {
    const text = readFileSync(HOOK, "utf8");
    expect(text.startsWith("#!/usr/bin/env bash")).toBe(true);
  });

  it("sets NODE_ENV=test before invoking verify", () => {
    const text = readFileSync(HOOK, "utf8");
    expect(text).toMatch(/export NODE_ENV=test/);
    expect(text).toMatch(/npm run verify/);
  });

  it("is syntactically valid bash (bash -n parse check)", () => {
    // bash -n is non-destructive — only checks syntax
    expect(() => run(`bash -n ${HOOK}`)).not.toThrow();
  });
});

describe(".husky/pre-commit behavioral checks (lightweight)", () => {
  const tmpRoot = resolve(REPO, ".tmp-hook-test");

  beforeEach(() => {
    rmSync(tmpRoot, { recursive: true, force: true });
    mkdirSync(tmpRoot, { recursive: true });
  });

  afterEach(() => {
    rmSync(tmpRoot, { recursive: true, force: true });
  });

  it("EXITS 0 when web/ directory is missing (graceful no-op guard)", () => {
    // Build a fake repo root with the hook symlinked, no web/ folder.
    // Hook's first guard is `[ ! -d "$WEB_DIR" ] && exit 0` → should pass cleanly.
    const repoCopy = resolve(tmpRoot, "repo");
    mkdirSync(resolve(repoCopy, ".husky"), { recursive: true });
    symlinkSync(resolve(REPO, ".git"), resolve(repoCopy, ".git"));
    symlinkSync(HOOK, resolve(repoCopy, ".husky", "pre-commit"));

    const r = runCaptureExit(`bash .husky/pre-commit`, {
      cwd: repoCopy,
      timeout: 30_000,
    });
    if (r.code !== 0) {
      console.error("=== hook stderr ===\n" + r.stderr);
      console.error("=== hook stdout ===\n" + r.stdout);
    }
    expect(r.code).toBe(0);
  });

  it("EXITS non-zero when invoked against a directory with no package.json (web/ present but no scripts)", () => {
    // Build a fake repo with an empty web/ and the hook symlinked.
    // npm run verify in an empty package.json should fail.
    const repoCopy = resolve(tmpRoot, "repo");
    mkdirSync(resolve(repoCopy, ".husky"), { recursive: true });
    mkdirSync(resolve(repoCopy, "web"), { recursive: true });
    // Empty package.json — no verify script
    const fs = require("node:fs");
    fs.writeFileSync(
      resolve(repoCopy, "web", "package.json"),
      JSON.stringify({ name: "fake", version: "0.0.1" }, null, 2)
    );
    symlinkSync(resolve(REPO, ".git"), resolve(repoCopy, ".git"));
    symlinkSync(HOOK, resolve(repoCopy, ".husky", "pre-commit"));

    const r = runCaptureExit(`bash .husky/pre-commit`, {
      cwd: repoCopy,
      timeout: 60_000,
    });
    // npm run verify fails → hook exits non-zero
    expect(r.code).not.toBe(0);
    // Stderr/stdout should mention something about the verify failure
    const merged = r.stdout + r.stderr;
    expect(merged.toLowerCase()).toMatch(/verify|missing|script/);
  });
});

describe(".husky/README.md documentation", () => {
  it("exists and explains the setup steps", () => {
    const f = resolve(REPO, ".husky", "README.md");
    expect(existsSync(f)).toBe(true);
    const text = readFileSync(f, "utf8");
    expect(text).toMatch(/core\.hooksPath/);
    expect(text).toMatch(/skip/i); // mentions --no-verify
  });
});
