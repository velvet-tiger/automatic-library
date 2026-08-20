#!/usr/bin/env node
// Generates manifest.json at the repository root.
//
// Walks skills/, rules/, instructions/, subagents/, hooks/. For every
// content file, records its kind, logical id, path relative to the repo
// root, and sha256. The Automatic app consumes this file to know what
// the library contains without having to walk the extracted tarball.
//
// Usage: node scripts/build-manifest.mjs
// Exit code 0 on success, non-zero on error.

import { createHash } from "node:crypto";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const KIND_ROOTS = [
  { dir: "skills", kind: "skill" },
  { dir: "rules", kind: "rule" },
  { dir: "instructions", kind: "instruction" },
  { dir: "subagents", kind: "subagent" },
  { dir: "hooks", kind: "hook" },
];

// Files that document the directory rather than contribute content.
const SKIP_FILENAMES = new Set(["README.md", ".DS_Store", ".gitkeep"]);

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") return out;
    throw err;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (entry.isFile()) {
      if (SKIP_FILENAMES.has(entry.name)) continue;
      out.push(full);
    }
  }
  return out;
}

async function sha256(path) {
  const bytes = await readFile(path);
  return createHash("sha256").update(bytes).digest("hex");
}

function stripExt(name) {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(0, i) : name;
}

async function buildAssetsForKind({ dir, kind }) {
  const root = join(REPO_ROOT, dir);
  const files = await walk(root);
  if (files.length === 0) return [];

  if (kind === "skill") {
    // A skill is a directory under skills/. Group files by that
    // directory. Standalone files at the top level (e.g. skill.json)
    // become their own asset entry.
    const groups = new Map();
    const standalone = [];
    for (const file of files) {
      const rel = relative(root, file);
      const parts = rel.split(sep);
      if (parts.length === 1) {
        standalone.push(file);
        continue;
      }
      const id = parts[0];
      if (!groups.has(id)) groups.set(id, []);
      groups.get(id).push(file);
    }
    const out = [];
    for (const [id, groupFiles] of [...groups.entries()].sort()) {
      groupFiles.sort();
      const fileEntries = [];
      for (const f of groupFiles) {
        fileEntries.push({
          path: relative(REPO_ROOT, f),
          sha256: await sha256(f),
        });
      }
      out.push({
        kind,
        id,
        root: relative(REPO_ROOT, join(root, id)),
        files: fileEntries,
      });
    }
    for (const file of standalone.sort()) {
      out.push({
        kind: "manifest-fragment",
        id: stripExt(relative(root, file)),
        path: relative(REPO_ROOT, file),
        sha256: await sha256(file),
      });
    }
    return out;
  }

  if (kind === "rule" || kind === "subagent") {
    // rules/{pack}/{name}.md, subagents/{pack}/{name}.md
    const out = [];
    for (const file of files.sort()) {
      const rel = relative(root, file);
      const parts = rel.split(sep);
      if (parts.length !== 2) {
        throw new Error(
          `unexpected layout under ${dir}/: ${rel} (expected {pack}/{name}.ext)`,
        );
      }
      const [pack, filename] = parts;
      out.push({
        kind,
        pack,
        id: stripExt(filename),
        path: relative(REPO_ROOT, file),
        sha256: await sha256(file),
      });
    }
    return out;
  }

  if (kind === "instruction" || kind === "hook") {
    // Flat directory; filename stem is the id.
    const out = [];
    for (const file of files.sort()) {
      const rel = relative(root, file);
      if (rel.includes(sep)) {
        throw new Error(
          `unexpected nesting under ${dir}/: ${rel} (expected flat files)`,
        );
      }
      out.push({
        kind,
        id: stripExt(rel),
        path: relative(REPO_ROOT, file),
        sha256: await sha256(file),
      });
    }
    return out;
  }

  throw new Error(`unhandled kind: ${kind}`);
}

async function main() {
  const version = (await readFile(join(REPO_ROOT, "VERSION"), "utf8")).trim();
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`VERSION must be semver, got: ${version}`);
  }

  const assets = [];
  for (const spec of KIND_ROOTS) {
    assets.push(...(await buildAssetsForKind(spec)));
  }

  const manifest = {
    library_version: version,
    manifest_schema: 1,
    assets,
  };

  const outPath = join(REPO_ROOT, "manifest.json");
  await writeFile(outPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  const st = await stat(outPath);
  console.log(
    `wrote ${relative(REPO_ROOT, outPath)} (${assets.length} assets, ${st.size} bytes)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
