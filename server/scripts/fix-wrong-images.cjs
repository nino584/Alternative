const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const DB_PATH = path.join(__dirname, '..', 'db', 'data.json');

const FIXES = [
  {
    index: 18,
    name: "Hermès Constance 18 Gold",
    queries: [
      "Hermes Constance 18 gold epsom leather bag",
      "Hermes Constance 18 gold taurillon bag product"
    ]
  },
  {
    index: 69,
    name: "Celine Ava Bag Tan Leather",
    queries: [
      "Celine Ava bag tan smooth calfskin leather",
      "Celine Ava hobo bag tan leather product photo"
    ]
  },
  {
    index: 51,
    name: "Tom Ford TF5147 Black Frames",
    queries: [
      "Tom Ford TF5147 eyeglasses black frame product",
      "Tom Ford FT5147 glasses black acetate"
    ]
  }
];

function fetchWithRedirects(url, maxRedirects) {
  maxRedirects = maxRedirects || 5;
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects'));
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchWithRedirects(res.headers.location, maxRedirects - 1).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function searchGoogleImages(query) {
  const url = 'https://www.google.com/search?q=' + encodeURIComponent(query) + '&udm=2';
  const html = await fetchWithRedirects(url);

  const fullSizePattern = /\["(https?:\/\/[^"]+)",(\d+),(\d+)\]/g;
  let match;
  const urls = [];
  const seen = new Set();

  while ((match = fullSizePattern.exec(html)) !== null) {
    let u = match[1]
      .replace(/\\u003d/g, '=')
      .replace(/\\u0026/g, '&')
      .replace(/\\\\u003d/g, '=')
      .replace(/\\\\u0026/g, '&');
    const w = parseInt(match[2]);
    const h = parseInt(match[3]);

    if (w > 300 && h > 300 &&
        !u.includes('encrypted-tbn') &&
        !u.includes('gstatic.com') &&
        !u.includes('google.com') &&
        !seen.has(u)) {
      seen.add(u);
      urls.push(u);
    }
  }

  return urls.slice(0, 8);
}

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/*',
        'Referer': 'https://www.google.com/'
      },
      timeout: 10000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        if (buffer.length < 3000) return reject(new Error('Too small: ' + buffer.length));
        resolve(buffer);
      });
    }).on('error', reject).on('timeout', () => reject(new Error('Timeout')));
  });
}

async function compressImage(buffer) {
  try {
    return await sharp(buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 75 })
      .toBuffer();
  } catch (e) {
    return buffer;
  }
}

async function fetchImageForProduct(fix) {
  console.log('\n  Fixing: ' + fix.name);

  for (const query of fix.queries) {
    console.log('  Query: "' + query + '"');
    try {
      const imageUrls = await searchGoogleImages(query);
      console.log('  Found ' + imageUrls.length + ' full-size URLs');

      for (let i = 0; i < Math.min(imageUrls.length, 5); i++) {
        try {
          console.log('    Trying: ' + imageUrls[i].substring(0, 80) + '...');
          let buffer = await downloadImage(imageUrls[i]);
          console.log('    Downloaded: ' + Math.round(buffer.length / 1024) + 'KB');
          buffer = await compressImage(buffer);
          console.log('    Compressed: ' + Math.round(buffer.length / 1024) + 'KB');

          if (buffer.length > 3000) {
            return 'data:image/jpeg;base64,' + buffer.toString('base64');
          }
        } catch (e) {
          console.log('    Failed: ' + e.message);
        }
      }
    } catch (e) {
      console.log('  Search error: ' + e.message);
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  return null;
}

async function main() {
  console.log('=== Fixing Wrong Product Images ===\n');

  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const products = db.products;
  let fixedCount = 0;

  for (const fix of FIXES) {
    const p = products[fix.index];
    console.log('Product ' + (fix.index + 1) + ': ' + p.brand + ' - ' + p.name + ' (' + p.color + ')');

    const newImage = await fetchImageForProduct(fix);
    if (newImage) {
      p.img = newImage;
      if (p.images && p.images.length > 0) p.images[0] = newImage;
      else p.images = [newImage];
      fixedCount++;
      console.log('  ✅ Updated!');
    } else {
      console.log('  ❌ No replacement found');
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  if (fixedCount > 0) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    console.log('\n✅ Saved ' + fixedCount + ' fixed images');
  } else {
    console.log('\n❌ No images fixed');
  }
  console.log('=== Done ===');
}

main().catch(console.error);
