/**
 * Deploy dist/ to a Bunny storage zone.
 *
 *   node scripts/deploy.mjs                # purge the zone, then upload
 *   node scripts/deploy.mjs --no-purge     # upload/overwrite only
 *   DRY_RUN=1 node scripts/deploy.mjs      # report actions, touch nothing
 *
 * Env:
 *   BUNNY_STORAGE_ZONE  e.g. 5starlimoocdotcom
 *   BUNNY_ACCESS_KEY    the write (password) key
 */
import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative, sep } from 'node:path';

const ZONE = process.env.BUNNY_STORAGE_ZONE;
const KEY = process.env.BUNNY_ACCESS_KEY;
const BASE = `https://storage.bunnycdn.com/${ZONE}`;
const ROOT = 'dist';

const PURGE = !process.argv.includes('--no-purge');
const DRY = process.env.DRY_RUN === '1';
const CONCURRENCY = 8;

if (!ZONE || !KEY) {
  console.error('Set BUNNY_STORAGE_ZONE and BUNNY_ACCESS_KEY.');
  process.exit(1);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.webmanifest': 'application/manifest+json',
};

const typeFor = (p) => MIME[extname(p).toLowerCase()] ?? 'application/octet-stream';

const headers = (extra = {}) => ({ AccessKey: KEY, ...extra });

/**
 * Every object currently in the zone.
 *
 * The Storage API's list response gives each entry the Path of its *parent*,
 * not its own, so directories are expanded using the path we requested rather
 * than the returned field.
 */
async function listAll() {
  const out = [];
  const queue = [''];

  while (queue.length) {
    const path = queue.shift();
    // NB: the Storage API requires a trailing slash to list a directory.
    const res = await fetch(`${BASE}/${path}/`, { headers: headers() });
    // A directory marker with nothing inside lists as 404 — that's just empty.
    if (res.status === 404) continue;
    if (!res.ok) throw new Error(`list /${path} -> ${res.status} ${await res.text()}`);
    const items = await res.json();
    if (!Array.isArray(items)) throw new Error(`list /${path} -> unexpected response`);
    for (const it of items) {
      const child = path ? `${path}/${it.ObjectName}` : it.ObjectName;
      if (it.IsDirectory) queue.push(child);
      else out.push({ ...it, key: child });
    }
  }
  return out;
}

/** Local dist files as zone-relative keys, using forward slashes. */
async function localFiles(dir = ROOT, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await localFiles(full, acc);
    else acc.push(relative(ROOT, full).split(sep).join('/'));
  }
  return acc;
}

async function runPool(items, limit, worker) {
  let i = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const item = items[i++];
      await worker(item);
    }
  });
  await Promise.all(runners);
}

// ---------------------------------------------------------------- purge
if (PURGE) {
  const remote = await listAll();
  const bytes = remote.reduce((n, o) => n + o.Length, 0);
  console.log(`zone ${ZONE}: ${remote.length} objects, ${(bytes / 1048576).toFixed(1)} MB — purging`);

  if (!DRY) {
    let done = 0;
    let failed = 0;
    await runPool(remote, CONCURRENCY, async (o) => {
      const res = await fetch(`${BASE}/${o.key}`, { method: 'DELETE', headers: headers() });
      if (!res.ok) {
        failed++;
        console.error(`  DELETE FAIL ${o.ObjectName} -> ${res.status} ${await res.text()}`);
      }
      done++;
      if (done % 50 === 0 || done === remote.length) console.log(`  deleted ${done}/${remote.length}`);
    });
    if (failed) {
      console.error(`${failed} objects could not be deleted — aborting before upload.`);
      process.exit(1);
    }
  } else {
    console.log('DRY RUN: would delete the above.');
  }
}

// ---------------------------------------------------------------- upload
const files = (await localFiles()).sort();
console.log(`\nuploading ${files.length} files from ${ROOT}/`);

let ok = 0;
let bad = 0;
let uploadedBytes = 0;

await runPool(files, CONCURRENCY, async (key) => {
  const buf = await readFile(join(ROOT, key));
  if (DRY) {
    ok++;
    uploadedBytes += buf.length;
    return;
  }
  const res = await fetch(`${BASE}/${key}`, {
    method: 'PUT',
    headers: headers({ 'Content-Type': typeFor(key) }),
    body: buf,
  });
  if (!res.ok) {
    bad++;
    console.error(`  UPLOAD FAIL ${key} -> ${res.status} ${await res.text()}`);
    return;
  }
  ok++;
  uploadedBytes += buf.length;
  if (ok % 50 === 0 || ok === files.length)
    console.log(`  uploaded ${ok}/${files.length} (${(uploadedBytes / 1048576).toFixed(1)} MB)`);
});

console.log(`\ndone: ${ok} uploaded, ${bad} failed, ${(uploadedBytes / 1048576).toFixed(1)} MB`);
if (bad) process.exit(1);
