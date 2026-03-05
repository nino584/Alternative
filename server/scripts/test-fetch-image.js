// Test fetching product images from various accessible sources

async function testGoogle(query) {
  // Google Shopping / Images often have accessible image URLs
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&safe=active`;
  try {
    const resp = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html",
      },
      redirect: "follow"
    });
    const html = await resp.text();
    console.log(`Google Images "${query}": status=${resp.status}, length=${html.length}`);

    // Google image search embeds image URLs in the page
    // Look for patterns like ["https://...jpg",width,height]
    const imgUrls = [];
    const regex = /\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)(?:\?[^"]*)?)",\d+,\d+\]/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      imgUrls.push(match[1]);
    }

    // Also try data-src patterns
    const dataSrc = html.match(/data-src="(https?:\/\/[^"]+)"/g) || [];
    console.log(`  Found ${imgUrls.length} direct images, ${dataSrc.length} data-src`);
    if (imgUrls.length > 0) console.log("  First image:", imgUrls[0].substring(0, 150));

    return imgUrls[0] || null;
  } catch (e) {
    console.log(`Error: ${e.message}`);
    return null;
  }
}

async function testDuckDuckGo(query) {
  // Try DuckDuckGo image search
  const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`;
  try {
    const resp = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "text/html",
      },
      redirect: "follow"
    });
    const html = await resp.text();
    console.log(`\nDDG "${query}": status=${resp.status}, length=${html.length}`);

    // DDG uses vqd tokens for API calls
    const vqd = html.match(/vqd=([^&'"]+)/);
    if (vqd) console.log("  VQD token found");

    return null;
  } catch (e) {
    console.log(`Error: ${e.message}`);
    return null;
  }
}

// Try Lyst.com which aggregates luxury products
async function testLyst(query) {
  const url = `https://www.lyst.com/search/?q=${encodeURIComponent(query)}`;
  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html",
      },
      redirect: "follow"
    });
    const html = await resp.text();
    console.log(`\nLyst "${query}": status=${resp.status}, length=${html.length}`);

    // Look for product images
    const imgs = html.match(/https?:\/\/[^"'\s]+(?:\.jpg|\.jpeg|\.png|\.webp)[^"'\s]*/gi);
    if (imgs) {
      const product = imgs.filter(i => i.includes('product') || i.includes('media') || i.includes('images'));
      console.log(`  Found ${product.length} product-like images`);
      if (product[0]) console.log("  First:", product[0].substring(0, 150));
      return product[0] || null;
    }
    return null;
  } catch (e) {
    console.log(`Error: ${e.message}`);
    return null;
  }
}

async function main() {
  await testGoogle("Hermès Birkin 25 Gold Togo bag product photo");
  await testGoogle("Prada Re-Edition 2005 nylon bag black");
  await testLyst("hermes birkin 25");
}

main();
