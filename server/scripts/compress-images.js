import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'db', 'data.json');

// Target: max ~80KB decoded per image
const MAX_DECODED_BYTES = 80_000;
const MAX_DIMENSION = 800; // Max width or height

async function compressBase64Image(dataUri) {
  const match = dataUri.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!match) return dataUri;

  const buffer = Buffer.from(match[2], 'base64');
  const decoded = buffer.length;

  if (decoded <= MAX_DECODED_BYTES) return dataUri; // Already small enough

  try {
    const compressed = await sharp(buffer)
      .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 70, progressive: true })
      .toBuffer();

    const newUri = `data:image/jpeg;base64,${compressed.toString('base64')}`;
    return newUri;
  } catch (e) {
    console.log(`    sharp error: ${e.message}`);
    return dataUri;
  }
}

async function main() {
  const data = JSON.parse(readFileSync(DB_PATH, 'utf-8'));
  const origSize = readFileSync(DB_PATH).length;
  let compressed = 0;
  let totalSavedKB = 0;

  for (const p of data.products) {
    let changed = false;

    // Compress main img
    if (p.img && p.img.startsWith('data:')) {
      const oldLen = p.img.length;
      const b64 = p.img.split(',')[1] || '';
      const decodedKB = Math.round(b64.length * 3 / 4 / 1024);

      if (decodedKB > MAX_DECODED_BYTES / 1024) {
        p.img = await compressBase64Image(p.img);
        const newB64 = p.img.split(',')[1] || '';
        const newKB = Math.round(newB64.length * 3 / 4 / 1024);
        const saved = decodedKB - newKB;
        if (saved > 0) {
          console.log(`[${p.id}] ${p.brand} ${p.name}: ${decodedKB}KB → ${newKB}KB (saved ${saved}KB)`);
          totalSavedKB += saved;
          compressed++;
          changed = true;
        }
      }
    }

    // Compress images array
    if (p.images && p.images.length > 0) {
      for (let i = 0; i < p.images.length; i++) {
        if (p.images[i] && p.images[i].startsWith('data:')) {
          const b64 = p.images[i].split(',')[1] || '';
          const decodedKB = Math.round(b64.length * 3 / 4 / 1024);
          if (decodedKB > MAX_DECODED_BYTES / 1024) {
            p.images[i] = await compressBase64Image(p.images[i]);
            changed = true;
          }
        }
      }
    }
  }

  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  const newSize = readFileSync(DB_PATH).length;

  console.log(`\n═══ COMPRESSION COMPLETE ═══`);
  console.log(`Compressed: ${compressed} images`);
  console.log(`Total saved: ${totalSavedKB}KB`);
  console.log(`DB size: ${Math.round(origSize / 1024 / 1024)}MB → ${Math.round(newSize / 1024 / 1024)}MB`);
}

main().catch(console.error);
