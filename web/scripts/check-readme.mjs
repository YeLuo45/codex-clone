#!/usr/bin/env node
/**
 * README command auditor.
 *
 * Scans ../README.md for every bash code block (```bash ... ```), extracts
 * commands that look like `npm run <name>` / `npm <name>`, and ensures each
 * one matches an entry in package.json's "scripts" block.
 *
 * Catches: stale README commands pointing to a deleted script, new scripts
 * never documented, or renamed scripts that still show under their old name.
 *
 * Exit 0 = pass. Exit 1 = at least one command is documented but missing
 * from package.json (or vice versa — every script referenced in README must
 * exist; every public-facing script should ideally be documented).
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const README = join(ROOT, "README.md");
const PKG = join(__dirname, "..", "package.json");

if (!existsSync(README)) {
  console.error(`[check-readme] FAIL — README not found at ${README}`);
  process.exit(1);
}
if (!existsSync(PKG)) {
  console.error(`[check-readme] FAIL — package.json not found at ${PKG}`);
  process.exit(1);
}

const readme = readFileSync(README, "utf8");
const pkg = JSON.parse(readFileSync(PKG, "utf8"));
const scripts = pkg.scripts || {};

// 1. Extract all `bash` code blocks
const bashBlocks = [...readme.matchAll(/```bash\n([\s\S]*?)```/g)].map((m) => m[1]);
if (bashBlocks.length === 0) {
  console.error("[check-readme] FAIL — README contains no ```bash code blocks");
  process.exit(1);
}

// 2. From each block, find candidate npm commands. Skip lines starting with #.
//    Some lines have comments after a `\  # comment` continuation; tolerate that
//    by stripping any trailing # comment.
const cmdRe = /^\s*npm\s+(?:run\s+)?([a-zA-Z0-9_:.-]+)/;
const documented = new Set();
const undocumented = new Set();

for (const block of bashBlocks) {
  for (let rawLine of block.split("\n")) {
    const hashIdx = rawLine.indexOf("#");
    if (hashIdx >= 0 && rawLine.trimStart().startsWith("#") === false) {
      rawLine = rawLine.slice(0, hashIdx);
    }
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(cmdRe);
    if (m) {
      const cmd = m[1];
      // Skip subcommands like `install`, `ci` — they're valid without a script entry
      if (["install", "ci", "fund", "test", "ls"].includes(cmd)) continue;
      documented.add(cmd);
    }
  }
}

// 3. Cross-check against package.json scripts
const scriptNames = new Set(Object.keys(scripts));
const failures = [];
for (const cmd of documented) {
  if (!scriptNames.has(cmd)) {
    failures.push(`README references "npm run ${cmd}" but package.json does not define it`);
  }
}

// 4. Heuristic: public-facing scripts should ideally appear in README
const publicScripts = ["dev", "build", "preview", "test", "typecheck", "coverage", "verify"];
const missingDocs = [];
for (const s of publicScripts) {
  if (scriptNames.has(s) && !documented.has(s)) {
    missingDocs.push(s);
  }
}

if (failures.length === 0) {
  console.log(`[check-readme] PASS — ${documented.size} npm commands documented in README, all match package.json scripts`);
  if (missingDocs.length > 0) {
    console.log(`  (note: ${missingDocs.length} public scripts not yet in README: ${missingDocs.join(", ")})`);
  }
  process.exit(0);
} else {
  console.error(`[check-readme] FAIL`);
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
