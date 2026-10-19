#!/usr/bin/env node
/**
 * Fails if raw colors or raw px/rem for spacing/radius/type/shadow/border
 * appear outside token files, unless allowlisted with a reason.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const allowlist = JSON.parse(fs.readFileSync(path.join(__dirname, 'tokens-allowlist.json'), 'utf8'));

const TOKEN_DIRS = [path.join(root, 'src/tokens')];
const SCAN_EXTS = new Set(['.css', '.tsx', '.ts', '.jsx', '.js']);
const IGNORE_DIRS = new Set(['node_modules', 'dist', '.vite', 'scripts', 'design-mode']);

const COLOR_RE = /#(?:[0-9a-fA-F]{3,8})\b|rgba?\(\s*[^)]+\)|hsla?\(\s*[^)]+\)/g;

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (SCAN_EXTS.has(path.extname(ent.name))) out.push(p);
  }
  return out;
}

function isTokenFile(file) {
  const abs = path.resolve(file);
  return TOKEN_DIRS.some((d) => abs.startsWith(d + path.sep));
}

function allowlisted(file, match, line) {
  const rel = path.relative(root, file).split(path.sep).join('/');
  return allowlist.some((entry) => {
    if (entry.file !== rel) return false;
    try {
      const re = new RegExp(entry.pattern);
      return re.test(match) || re.test(line);
    } catch {
      return false;
    }
  });
}

function stripBlockComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

function stripLineComments(src, ext) {
  if (ext === '.css') return src;
  return src.replace(/(^|[^:])\/\/.*$/gm, '$1');
}

const files = walk(path.join(root, 'src'));
const violations = [];

for (const file of files) {
  if (isTokenFile(file)) continue;
  const ext = path.extname(file);
  let src = fs.readFileSync(file, 'utf8');
  src = stripLineComments(stripBlockComments(src), ext);
  const lines = src.split('\n');
  const rel = path.relative(root, file).split(path.sep).join('/');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('data:image/svg+xml')) continue;

    for (const m of line.matchAll(COLOR_RE)) {
      if (allowlisted(file, m[0], line)) continue;
      violations.push({ file: rel, line: i + 1, kind: 'color', match: m[0], text: line.trim().slice(0, 140) });
    }

    if (!/\d+(?:\.\d+)?(?:px|rem)\b/.test(line)) continue;
    // Ignore lines that only reference measures inside var()/calc() of vars
    const withoutVars = line
      .replace(/var\([^)]*\)/g, '')
      .replace(/calc\([^;]*?\)/g, '');
    for (const m of withoutVars.matchAll(/\d+(?:\.\d+)?(?:px|rem)\b/g)) {
      const match = m[0];
      if (match === '0px' || match === '0rem') continue;
      if (allowlisted(file, match, line)) continue;
      violations.push({ file: rel, line: i + 1, kind: 'measure', match, text: line.trim().slice(0, 140) });
    }
  }
}

if (violations.length) {
  console.error(`tokens:check failed — ${violations.length} violation(s):\n`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line} [${v.kind}] ${v.match}`);
    console.error(`    ${v.text}`);
  }
  console.error('\nAdd a justified entry to scripts/tokens-allowlist.json or replace with a token.');
  process.exit(1);
}

console.log(`tokens:check passed (${files.length} files scanned, ${allowlist.length} allowlist rules).`);
