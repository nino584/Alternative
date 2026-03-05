import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'db', 'data.json');

// ── Google Images search to find product photos ──────────────────────────────
async function searchGoogleImages(query) {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&safe=active`;
  try {
    const resp = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const html = await resp.text();

    // Google image search embeds image URLs in the page as ["url",width,height]
    const regex = /\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)(?:\?[^"]*)?)",(\d+),(\d+)\]/g;
    const results = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      const url = match[1].replace(/\\u003d/g, '=').replace(/\\u0026/g, '&');
      const w = parseInt(match[2]);
      const h = parseInt(match[3]);
      // Filter for reasonable product image dimensions (not tiny icons)
      if (w >= 200 && h >= 200) {
        results.push({ url, w, h });
      }
    }
    return results;
  } catch (e) {
    console.log(`  Search error: ${e.message}`);
    return [];
  }
}

// ── Download image and convert to base64 JPEG ──────────────────────────────
async function downloadImage(url) {
  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "image/*",
        "Referer": "https://www.google.com/",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });

    if (!resp.ok) return null;

    const contentType = resp.headers.get('content-type') || '';
    if (!contentType.includes('image')) return null;

    const buffer = Buffer.from(await resp.arrayBuffer());
    if (buffer.length < 1000) return null; // Too small, probably error

    // Convert to base64 data URI
    const mimeType = contentType.includes('png') ? 'image/png' :
                     contentType.includes('webp') ? 'image/webp' : 'image/jpeg';
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
  } catch (e) {
    return null;
  }
}

// ── Search queries for each product ──────────────────────────────────────────
function getSearchQuery(product) {
  const { brand, name, cat, color } = product;
  // Build a specific search query for the product
  return `${brand} ${name} ${color || ''} ${cat} product photo official white background`.trim();
}

function getBackupQuery(product) {
  return `${product.brand} ${product.name} luxury fashion product`;
}

// ── Main processing ──────────────────────────────────────────────────────────
async function processProduct(product, index, total) {
  const label = `[${index + 1}/${total}] ${product.brand} ${product.name}`;

  // Skip products that already have base64 images
  if (product.img && product.img.startsWith('data:')) {
    console.log(`${label} — already has image, skipping`);
    return null;
  }

  console.log(`${label} — searching...`);

  // Primary search
  const query = getSearchQuery(product);
  let results = await searchGoogleImages(query);

  // Filter out thumbnails and low quality
  results = results.filter(r => r.w >= 300 && r.h >= 300);

  if (results.length === 0) {
    // Backup search with simpler query
    console.log(`  No results, trying backup query...`);
    results = await searchGoogleImages(getBackupQuery(product));
    results = results.filter(r => r.w >= 300 && r.h >= 300);
  }

  // Try to download from the first few results
  for (let i = 0; i < Math.min(5, results.length); i++) {
    const imgUrl = results[i].url;
    console.log(`  Trying image ${i + 1}: ${imgUrl.substring(0, 80)}...`);
    const dataUri = await downloadImage(imgUrl);

    if (dataUri) {
      const sizeKB = Math.round(dataUri.length * 3 / 4 / 1024);
      console.log(`  ✓ Downloaded (${sizeKB} KB)`);
      return dataUri;
    }
  }

  console.log(`  ✗ No downloadable image found`);
  return null;
}

async function main() {
  const data = JSON.parse(readFileSync(DB_PATH, 'utf-8'));
  const products = data.products;

  console.log(`\nTotal products: ${products.length}`);
  console.log(`Products needing images: ${products.filter(p => !p.img || !p.img.startsWith('data:')).length}\n`);

  let updated = 0;
  let failed = 0;

  // Process in small batches to avoid rate limiting
  const BATCH_SIZE = 3;
  const DELAY = 2000; // 2 seconds between batches

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const promises = batch.map((p, j) => processProduct(p, i + j, products.length));
    const results = await Promise.all(promises);

    for (let j = 0; j < results.length; j++) {
      if (results[j]) {
        const product = products[i + j];
        product.img = results[j];
        product.images = [results[j]];
        updated++;
      } else if (!products[i + j].img || !products[i + j].img.startsWith('data:')) {
        failed++;
      }
    }

    // Save progress after each batch
    if (results.some(Boolean)) {
      writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`  [saved progress: ${updated} updated, ${failed} failed]\n`);
    }

    // Rate limiting delay
    if (i + BATCH_SIZE < products.length) {
      await new Promise(r => setTimeout(r, DELAY));
    }
  }

  // Final save
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`\n═══ COMPLETE ═══`);
  console.log(`Updated: ${updated}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${products.length}`);
}

main().catch(console.error);
