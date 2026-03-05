// ── ADD LAUNCH LIST PRODUCTS ──────────────────────────────────────────────
// Run: node scripts/add-launch-products.js

const API = 'http://localhost:3001/api';
let cookies = '';

async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@alternative.ge', password: 'Admin@2026!' }),
  });
  const setCookie = res.headers.getSetCookie?.() || [];
  cookies = setCookie.map(c => c.split(';')[0]).join('; ');
  const data = await res.json();
  console.log('Logged in as:', data.user?.name);
}

async function addProduct(product) {
  const res = await fetch(`${API}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookies },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error(`  FAIL: ${product.name} — ${err.error || res.status}`);
    return false;
  }
  console.log(`  OK: ${product.name} (${product.brand}) — ${product.price} GEL`);
  return true;
}

const IMG = '/images/products/';

const PRODUCTS = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. THE ICONS — Hermès & Chanel
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "Birkin 25", brand: "Hermès", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Gold", price: 3200, sale: null, lead: "21–28 days", tag: "Limited",
    img: IMG + "hermes-birkin25.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "25×20×13cm. Interior zip pocket with clochette and lock." },
    desc: "Togo calfskin leather. Palladium-plated hardware. Hand-stitched saddle stitch. Interior chevre leather lining."
  },
  {
    name: "Kelly 28 Sellier", brand: "Hermès", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 3600, sale: null, lead: "21–28 days", tag: "Limited",
    img: IMG + "hermes-kelly28.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "28×22×10cm. Removable shoulder strap included." },
    desc: "Epsom calfskin. Palladium hardware. Sellier construction with visible stitching. Turn-lock closure with padlock."
  },
  {
    name: "Constance 18", brand: "Hermès", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Gold", price: 1800, sale: null, lead: "21–28 days", tag: "New",
    img: IMG + "hermes-constance18.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "18×15×5cm. Adjustable shoulder strap for crossbody wear." },
    desc: "Epsom leather. Signature H buckle closure. Snap button closure under flap. Interior flat pocket."
  },
  {
    name: "Oran Sandal", brand: "Hermès", section: "Womenswear", cat: "Shoes", sub: "Shoes",
    color: "Gold", price: 280, sale: null, lead: "14–18 days", tag: "Popular",
    img: IMG + "hermes-oran.jpg",
    sizes: ["35","36","37","38","39","40","41","42"],
    fit: { fit: "True to size", notes: "Calfskin upper. Runs true, order your usual EU size." },
    desc: "Calfskin leather with iconic H cutout. Leather sole with rubber insert. Minimalist slip-on design."
  },
  {
    name: "Chypre Sandal", brand: "Hermès", section: "Womenswear", cat: "Shoes", sub: "Shoes",
    color: "Black", price: 340, sale: null, lead: "14–18 days", tag: "New",
    img: IMG + "hermes-chypre.jpg",
    sizes: ["35","36","37","38","39","40","41","42"],
    fit: { fit: "True to size", notes: "Adjustable buckle strap. Technical rubber sole for comfort." },
    desc: "Calfskin leather upper. Anatomical rubber sole. Adjustable ankle strap with palladium buckle. Permabrass hardware."
  },
  {
    name: "Classic Flap Medium", brand: "Chanel", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 2400, sale: null, lead: "18–24 days", tag: "Popular",
    img: IMG + "chanel-classic-flap.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "25.5×15.5×6.5cm. Interwoven chain strap for shoulder or crossbody." },
    desc: "Lambskin leather. Gold-tone metal hardware. Diamond quilted pattern. Signature CC turn-lock closure."
  },
  {
    name: "22 Bag", brand: "Chanel", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 1900, sale: null, lead: "18–24 days", tag: "New",
    img: IMG + "chanel-22.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "35×37×7cm. Oversized slouchy silhouette with chain handles." },
    desc: "Shiny calfskin. Gold-tone metal hardware. Oversized CC logo. Drawstring closure with chain shoulder straps."
  },
  {
    name: "Dad Sandals", brand: "Chanel", section: "Womenswear", cat: "Shoes", sub: "Shoes",
    color: "Black", price: 380, sale: null, lead: "14–18 days", tag: "",
    img: IMG + "chanel-dad-sandals.jpg",
    sizes: ["35","36","37","38","39","40","41"],
    fit: { fit: "True to size", notes: "Cord and lambskin. Adjustable velcro strap." },
    desc: "Lambskin with cord detailing. CC logo on strap. Comfortable padded footbed. Rubber outsole."
  },
  {
    name: "Ballerinas", brand: "Chanel", section: "Womenswear", cat: "Shoes", sub: "Shoes",
    color: "Black", price: 320, sale: null, lead: "14–18 days", tag: "Popular",
    img: IMG + "chanel-ballerinas.jpg",
    sizes: ["35","36","37","38","39","40","41"],
    fit: { fit: "Runs small", notes: "Lambskin with grosgrain. Size up half if between sizes." },
    desc: "Lambskin leather upper. Grosgrain ribbon trim. CC logo on toe cap. Leather sole. Iconic two-tone design."
  },
  {
    name: "Coco Handle Large", brand: "Chanel", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 2100, sale: null, lead: "18–24 days", tag: "",
    img: IMG + "chanel-coco-handle.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "33×24×15cm. Top handle with detachable shoulder chain." },
    desc: "Grained calfskin. Gold-tone hardware. Quilted flap with lizard handle. Interior zip and patch pockets."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. QUIET LUXURY — Cucinelli, Zegna, Loro Piana, Kiton
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "Cashmere Hoodie", brand: "Brunello Cucinelli", section: "Menswear", cat: "Clothing", sub: "Clothing",
    color: "Beige", price: 520, sale: null, lead: "12–16 days", tag: "New",
    img: IMG + "cucinelli-hoodie.jpg",
    sizes: ["XS","S","M","L","XL","XXL"],
    fit: { fit: "Relaxed fit", notes: "Model is 185cm wearing size M. 100% cashmere, very soft hand feel." },
    desc: "100% cashmere. Ribbed cuffs and hem. Drawstring hood. Kangaroo pocket. Made in Italy."
  },
  {
    name: "Monili Sneakers", brand: "Brunello Cucinelli", section: "Womenswear", cat: "Shoes", sub: "Shoes",
    color: "White", price: 340, sale: null, lead: "10–14 days", tag: "",
    img: IMG + "cucinelli-sneakers.jpg",
    sizes: ["35","36","37","38","39","40","41"],
    fit: { fit: "True to size", notes: "Premium leather upper. Signature Monili bead detailing on heel." },
    desc: "Full-grain leather upper. Monili chain embellishment. Rubber outsole. Padded insole. Made in Italy."
  },
  {
    name: "Triple Stitch Sneakers", brand: "Zegna", section: "Menswear", cat: "Shoes", sub: "Shoes",
    color: "White", price: 280, sale: null, lead: "10–14 days", tag: "Popular",
    img: IMG + "zegna-triple-stitch.jpg",
    sizes: ["39","40","41","42","43","44","45","46"],
    fit: { fit: "True to size", notes: "Slip-on design with triple cross-stitch. Lightweight construction." },
    desc: "Premium leather and technical fabric. Signature triple cross-stitch closure. XL EXTRALIGHT rubber sole."
  },
  {
    name: "Linen Overshirt", brand: "Zegna", section: "Menswear", cat: "Clothing", sub: "Clothing",
    color: "Navy", price: 290, sale: null, lead: "10–14 days", tag: "",
    img: IMG + "zegna-overshirt.jpg",
    sizes: ["S","M","L","XL","XXL"],
    fit: { fit: "Regular fit", notes: "Can be worn as a shirt or lightweight jacket. Premium Oasi linen." },
    desc: "100% Oasi linen. Chest patch pocket. Mother-of-pearl buttons. Relaxed collar. Made in Italy."
  },
  {
    name: "Summer Walk Loafers", brand: "Loro Piana", section: "Menswear", cat: "Shoes", sub: "Shoes",
    color: "Brown", price: 380, sale: null, lead: "12–16 days", tag: "Popular",
    img: IMG + "loropiana-summer-walk.jpg",
    sizes: ["39","40","41","42","43","44","45"],
    fit: { fit: "True to size", notes: "Storm System water-resistant fabric. Flexible rubber sole." },
    desc: "Walk Suede upper with Storm System technology. Leather lining. Gommini rubber pebble sole. Made in Italy."
  },
  {
    name: "Open Walk Ankle Boot", brand: "Loro Piana", section: "Menswear", cat: "Shoes", sub: "Shoes",
    color: "Charcoal", price: 480, sale: null, lead: "12–16 days", tag: "New",
    img: IMG + "loropiana-open-walk.jpg",
    sizes: ["39","40","41","42","43","44","45"],
    fit: { fit: "True to size", notes: "Storm System water-resistant. Desert boot silhouette." },
    desc: "Suede upper with Storm System protection. Wish wool lining. Natural latex rubber sole. Lace-up closure."
  },
  {
    name: "Extra Pocket L19 Bag", brand: "Loro Piana", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Taupe", price: 680, sale: null, lead: "12–16 days", tag: "",
    img: IMG + "loropiana-extra-pocket.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "19×16×6cm. Detachable crossbody strap included." },
    desc: "Extra Pocket design in soft grain calfskin. Magnetic flap closure. Interior suede lining with card slots."
  },
  {
    name: "K-Jacket Unstructured", brand: "Kiton", section: "Menswear", cat: "Clothing", sub: "Clothing",
    color: "Navy", price: 890, sale: null, lead: "14–18 days", tag: "New",
    img: IMG + "kiton-k-jacket.jpg",
    sizes: ["48","50","52","54","56"],
    fit: { fit: "Relaxed fit", notes: "Unstructured shoulder. Neapolitan construction, no padding." },
    desc: "100% cashmere blend. Unstructured shoulders. Patch pockets. Half-lined for breathability. Handmade in Naples."
  },
  {
    name: "Knit Sneakers", brand: "Kiton", section: "Menswear", cat: "Shoes", sub: "Shoes",
    color: "White", price: 420, sale: null, lead: "12–16 days", tag: "",
    img: IMG + "kiton-sneakers.jpg",
    sizes: ["39","40","41","42","43","44","45"],
    fit: { fit: "True to size", notes: "Lightweight knit upper with leather trim." },
    desc: "Technical knit upper with calfskin leather details. Rubber outsole. Padded insole. Handcrafted in Italy."
  },
  {
    name: "Cotton Polo Shirt", brand: "Kiton", section: "Menswear", cat: "Clothing", sub: "Clothing",
    color: "Navy", price: 280, sale: null, lead: "10–14 days", tag: "",
    img: IMG + "kiton-polo.jpg",
    sizes: ["S","M","L","XL","XXL"],
    fit: { fit: "Regular fit", notes: "Premium cotton piqué. Mother-of-pearl buttons." },
    desc: "100% cotton piqué. Three-button placket. Ribbed collar and cuffs. Embroidered logo. Made in Italy."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. YSL, PRADA, & FERRAGAMO
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "Bea Tote", brand: "Saint Laurent", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 480, sale: null, lead: "12–16 days", tag: "New",
    img: IMG + "ysl-bea.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "33×28×17cm. Interior zip pocket. Suede lining." },
    desc: "Supple suede body with leather trim. YSL monogram hardware. Magnetic snap closure. Adjustable shoulder strap."
  },
  {
    name: "Le 5 à 7 Shoulder Bag", brand: "Saint Laurent", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 560, sale: null, lead: "12–16 days", tag: "Popular",
    img: IMG + "ysl-le5a7.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "23×16×6.5cm. Adjustable leather shoulder strap." },
    desc: "Smooth suede leather. Cassandre YSL lock closure. Interior zip pocket. Gold-tone hardware."
  },
  {
    name: "Icare Maxi Shopping Bag", brand: "Saint Laurent", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 620, sale: null, lead: "14–18 days", tag: "",
    img: IMG + "ysl-icare.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "58×43×8cm. Oversized tote with magnetic snap." },
    desc: "Quilted lambskin leather. Embossed YSL logo. Magnetic snap closure. Interior zip pocket. Dual top handles."
  },
  {
    name: "Le Loafer Monogram", brand: "Saint Laurent", section: "Womenswear", cat: "Shoes", sub: "Shoes",
    color: "Black", price: 260, sale: null, lead: "10–14 days", tag: "New",
    img: IMG + "ysl-le-loafer.jpg",
    sizes: ["35","36","37","38","39","40","41"],
    fit: { fit: "True to size", notes: "Smooth calfskin with penny strap and YSL logo." },
    desc: "Smooth calfskin leather. Gold-tone YSL logo on penny strap. Leather sole. 15mm heel."
  },
  {
    name: "Chocolate Loafers", brand: "Prada", section: "Womenswear", cat: "Shoes", sub: "Shoes",
    color: "Black", price: 280, sale: null, lead: "10–14 days", tag: "Popular",
    img: IMG + "prada-chocolate-loafer.jpg",
    sizes: ["35","36","37","38","39","40","41"],
    fit: { fit: "True to size", notes: "Chunky rubber sole. Brushed leather with high shine." },
    desc: "Brushed calfskin with glossy finish. Triangle logo. Chunky rubber lug sole. Leather lining."
  },
  {
    name: "Re-Edition 2005 Nylon Bag", brand: "Prada", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 480, sale: null, lead: "12–16 days", tag: "Popular",
    img: IMG + "prada-re-edition.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "22×18×6cm. Detachable nylon pouch and shoulder strap." },
    desc: "Regenerated Re-Nylon fabric. Triangle enameled logo. Detachable pouch. Adjustable leather shoulder strap."
  },
  {
    name: "Galleria Saffiano Medium", brand: "Prada", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 720, sale: null, lead: "14–18 days", tag: "",
    img: IMG + "prada-galleria.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "33×24.5×16cm. Double handles with removable shoulder strap." },
    desc: "Saffiano leather with cross-grain texture. Metal triangle logo. Double compartment. Metal feet on base."
  },
  {
    name: "Re-Nylon Medium Backpack", brand: "Prada", section: "Menswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 580, sale: null, lead: "12–16 days", tag: "",
    img: IMG + "prada-backpack.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "32×29×13cm. Padded adjustable shoulder straps." },
    desc: "Regenerated Re-Nylon fabric. Triangle enameled logo. Front zip pocket. Interior organizer. Nylon lining."
  },
  {
    name: "Hug Bag", brand: "Ferragamo", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 460, sale: null, lead: "12–16 days", tag: "New",
    img: IMG + "ferragamo-hug.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "28×18×10cm. Top handle with detachable crossbody strap." },
    desc: "Smooth calfskin leather. Interlocking Gancini closure. Curved body shape. Suede interior lining."
  },
  {
    name: "Gancini Loafers", brand: "Ferragamo", section: "Menswear", cat: "Shoes", sub: "Shoes",
    color: "Black", price: 240, sale: null, lead: "10–14 days", tag: "Popular",
    img: IMG + "ferragamo-gancini.jpg",
    sizes: ["39","40","41","42","43","44","45","46"],
    fit: { fit: "True to size", notes: "Signature Gancini bit hardware. Leather sole with rubber insert." },
    desc: "Polished calfskin leather. Signature double Gancini hardware. Leather sole. Bologna construction."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. TOM FORD, VALENTINO, & LOUBOUTIN
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "Kate 100 Pump", brand: "Christian Louboutin", section: "Womenswear", cat: "Shoes", sub: "Shoes",
    color: "Black", price: 320, sale: null, lead: "10–14 days", tag: "Popular",
    img: IMG + "louboutin-kate100.jpg",
    sizes: ["35","36","37","38","39","40","41"],
    fit: { fit: "Runs small", notes: "Size up half size. 100mm heel height." },
    desc: "Patent leather upper. Iconic red lacquered sole. 100mm stiletto heel. Pointed toe. Made in Italy."
  },
  {
    name: "So Kate 120 Pump", brand: "Christian Louboutin", section: "Womenswear", cat: "Shoes", sub: "Shoes",
    color: "Black", price: 340, sale: null, lead: "10–14 days", tag: "",
    img: IMG + "louboutin-sokate120.jpg",
    sizes: ["35","36","37","38","39","40","41"],
    fit: { fit: "Runs small", notes: "Size up half size. 120mm heel. Sharp pointed toe." },
    desc: "Patent leather upper. Signature red sole. 120mm stiletto heel. Ultra-pointed toe silhouette."
  },
  {
    name: "Louis Junior Sneakers", brand: "Christian Louboutin", section: "Menswear", cat: "Shoes", sub: "Shoes",
    color: "Black", price: 380, sale: null, lead: "10–14 days", tag: "New",
    img: IMG + "louboutin-louis-junior.jpg",
    sizes: ["39","40","41","42","43","44","45"],
    fit: { fit: "True to size", notes: "Low-top silhouette. Signature red rubber sole." },
    desc: "Smooth calfskin leather. Red rubber sole. Flat cotton laces. Embossed logo on tongue. Made in Italy."
  },
  {
    name: "Buckley Duffel", brand: "Tom Ford", section: "Menswear", cat: "Bags", sub: "Bags",
    color: "Brown", price: 880, sale: null, lead: "14–18 days", tag: "",
    img: IMG + "tomford-buckley.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "48×30×25cm. Weekend travel capacity. Detachable shoulder strap." },
    desc: "Full-grain leather. Burnished brass hardware. Interior zip pocket. Cotton twill lining. Double zip closure."
  },
  {
    name: "Jennifer Shoulder Bag", brand: "Tom Ford", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 680, sale: null, lead: "14–18 days", tag: "",
    img: IMG + "tomford-jennifer.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "28×19×8cm. Adjustable chain and leather strap." },
    desc: "Smooth calfskin. Signature TF logo clasp. Chain link shoulder strap. Interior suede lining."
  },
  {
    name: "TF5147 Optical Frames", brand: "Tom Ford", section: "Menswear", cat: "Accessories", sub: "Accessories",
    color: "Black", price: 180, sale: null, lead: "8–10 days", tag: "",
    img: IMG + "tomford-eyewear.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "52mm lens width. Integrated nose pads." },
    desc: "Acetate frame. Signature T-hinge design. Demo lenses (ready for prescription). Includes branded case."
  },
  {
    name: "Rockstud Spike Bag", brand: "Valentino", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 780, sale: null, lead: "14–18 days", tag: "New",
    img: IMG + "valentino-rockstud.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "25×16×8cm. Detachable chain strap for crossbody wear." },
    desc: "Quilted nappa leather. Platinum-finish Rockstud hardware. Twist-lock closure. Interior card slots."
  },
  {
    name: "VLogo Reversible Belt", brand: "Valentino", section: "Womenswear", cat: "Accessories", sub: "Accessories",
    color: "Black", price: 240, sale: null, lead: "8–10 days", tag: "",
    img: IMG + "valentino-vlogo-belt.jpg",
    sizes: ["70cm","75cm","80cm","85cm","90cm"],
    fit: { fit: "True to size", notes: "Reversible: black/brown. Measure waist to choose size." },
    desc: "Smooth calfskin. Reversible black-to-brown. Signature VLogo buckle in shiny gold-tone metal. 30mm width."
  },
  {
    name: "VLogo Signature Pumps", brand: "Valentino", section: "Womenswear", cat: "Shoes", sub: "Shoes",
    color: "Black", price: 360, sale: null, lead: "10–14 days", tag: "",
    img: IMG + "valentino-vlogo-pumps.jpg",
    sizes: ["35","36","37","38","39","40","41"],
    fit: { fit: "True to size", notes: "80mm heel. Tonal VLogo hardware on heel." },
    desc: "Shiny calfskin leather. VLogo Signature hardware on heel. 80mm stiletto heel. Pointed toe. Leather sole."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. THE ROW, MARGIELA, & AVANT-GARDE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "Margaux 15", brand: "The Row", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 1480, sale: null, lead: "18–24 days", tag: "New",
    img: IMG + "therow-margaux15.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "38×26×17cm. Structured tote with top zip closure." },
    desc: "Soft calfskin leather. Top zip closure. Dual rolled handles. Suede interior with zip pocket. Metal feet."
  },
  {
    name: "N/S Park Tote", brand: "The Row", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 580, sale: null, lead: "14–18 days", tag: "",
    img: IMG + "therow-park-tote.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "37×34×14cm. North-south silhouette. Open top." },
    desc: "Grained calfskin. Unlined interior with detachable zip pouch. Long shoulder straps. Minimal branding."
  },
  {
    name: "Banana Bag", brand: "The Row", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 720, sale: null, lead: "14–18 days", tag: "",
    img: IMG + "therow-banana.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "42×19×10cm. Curved banana shape with magnetic closure." },
    desc: "Slouchy nappa leather. Curved crescent silhouette. Magnetic snap closure. Interior suede lining."
  },
  {
    name: "Ginza Sandals", brand: "The Row", section: "Womenswear", cat: "Shoes", sub: "Shoes",
    color: "Black", price: 380, sale: null, lead: "12–16 days", tag: "",
    img: IMG + "therow-ginza.jpg",
    sizes: ["35","36","37","38","39","40","41"],
    fit: { fit: "True to size", notes: "Flat sandal. Leather sole with rubber tread." },
    desc: "Smooth calfskin leather. Flat sole. Thong strap design. Leather lining. Made in Italy."
  },
  {
    name: "Tabi Boots", brand: "Maison Margiela", section: "Womenswear", cat: "Shoes", sub: "Shoes",
    color: "Black", price: 520, sale: null, lead: "12–16 days", tag: "Popular",
    img: IMG + "margiela-tabi.jpg",
    sizes: ["35","36","37","38","39","40","41"],
    fit: { fit: "True to size", notes: "Iconic split-toe design. 60mm block heel." },
    desc: "Calfskin leather. Iconic split-toe silhouette. Side zip closure. 60mm block heel. Leather sole."
  },
  {
    name: "5AC Classique Medium", brand: "Maison Margiela", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 680, sale: null, lead: "14–18 days", tag: "",
    img: IMG + "margiela-5ac.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "27×16×12cm. Detachable crossbody strap." },
    desc: "Smooth calfskin. Signature four white stitches. Zippered top closure. Adjustable leather strap."
  },
  {
    name: "Replica Sneakers", brand: "Maison Margiela", section: "Menswear", cat: "Shoes", sub: "Shoes",
    color: "White", price: 240, sale: null, lead: "10–14 days", tag: "New",
    img: IMG + "margiela-replica.jpg",
    sizes: ["39","40","41","42","43","44","45"],
    fit: { fit: "True to size", notes: "Vintage-inspired design. Suede and leather upper." },
    desc: "Leather and suede upper. Signature four white stitches on heel. Rubber outsole. Cotton laces."
  },
  {
    name: "De Coeur Cardigan", brand: "AMI Paris", section: "Menswear", cat: "Clothing", sub: "Clothing",
    color: "Black", price: 220, sale: null, lead: "10–14 days", tag: "New",
    img: IMG + "ami-cardigan.jpg",
    sizes: ["XS","S","M","L","XL"],
    fit: { fit: "Oversized", notes: "Oversized fit. Model is 185cm wearing size M." },
    desc: "Merino wool blend. Embroidered Ami de Coeur logo. Button-front closure. Ribbed hem and cuffs."
  },
  {
    name: "Boxy Blazer", brand: "AMI Paris", section: "Menswear", cat: "Clothing", sub: "Clothing",
    color: "Black", price: 320, sale: null, lead: "10–14 days", tag: "",
    img: IMG + "ami-blazer.jpg",
    sizes: ["XS","S","M","L","XL"],
    fit: { fit: "Boxy fit", notes: "Relaxed boxy silhouette. Single-breasted two-button." },
    desc: "Virgin wool blend. Boxy relaxed silhouette. Two-button front. Patch pockets. Partially lined."
  },
  {
    name: "Granny Frame Purse", brand: "Vivienne Westwood", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 180, sale: null, lead: "8–12 days", tag: "",
    img: IMG + "vw-granny-purse.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "17×12×5cm. Compact clutch with frame closure." },
    desc: "Saffiano leather. Signature Orb logo emboss. Gold-tone frame closure. Interior card slots."
  },
  {
    name: "Bas Relief Choker", brand: "Vivienne Westwood", section: "Womenswear", cat: "Jewellery", sub: "Jewellery",
    color: "Silver", price: 95, sale: null, lead: "6–8 days", tag: "Popular",
    img: IMG + "vw-choker.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "Adjustable chain length. Lobster clasp closure." },
    desc: "Silver-tone brass. Swarovski crystal Orb pendant. Adjustable chain. Lobster clasp closure."
  },
  {
    name: "Balloon Pants", brand: "Yohji Yamamoto", section: "Menswear", cat: "Clothing", sub: "Clothing",
    color: "Black", price: 380, sale: null, lead: "14–18 days", tag: "",
    img: IMG + "yamamoto-balloon.jpg",
    sizes: ["1","2","3","4","5"],
    fit: { fit: "Oversized", notes: "Japanese sizing: 1=XS, 2=S, 3=M, 4=L, 5=XL. Voluminous silhouette." },
    desc: "Wool-gabardine blend. Voluminous silhouette with gathered cuffs. Elastic waistband. Side pockets."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. CELINE, MIU MIU, & BALENCIAGA
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "Triomphe Belt", brand: "Celine", section: "Womenswear", cat: "Accessories", sub: "Accessories",
    color: "Tan", price: 240, sale: null, lead: "8–10 days", tag: "Popular",
    img: IMG + "celine-triomphe-belt.jpg",
    sizes: ["70cm","75cm","80cm","85cm","90cm"],
    fit: { fit: "True to size", notes: "25mm width. Measure waist to choose correct size." },
    desc: "Smooth calfskin. Gold-finish Triomphe buckle. 25mm width. Adjustable prong closure."
  },
  {
    name: "Triomphe Shoulder Bag", brand: "Celine", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Tan", price: 920, sale: null, lead: "14–18 days", tag: "New",
    img: IMG + "celine-triomphe-bag.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "20×15×4cm. Adjustable leather shoulder strap." },
    desc: "Shiny calfskin. Iconic Triomphe clasp closure. Adjustable shoulder strap. Interior flat pocket."
  },
  {
    name: "Ava Bag", brand: "Celine", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Tan", price: 680, sale: null, lead: "14–18 days", tag: "",
    img: IMG + "celine-ava.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "23×17×8cm. Triomphe canvas with calfskin trim." },
    desc: "Triomphe canvas body with calfskin leather trim. Zip closure. Adjustable crossbody strap. Interior pockets."
  },
  {
    name: "Arcadie Bag", brand: "Miu Miu", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 780, sale: null, lead: "14–18 days", tag: "New",
    img: IMG + "miumiu-arcadie.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "30×20×10cm. Top handle with detachable strap." },
    desc: "Smooth nappa leather. Miu Miu lettering logo. Magnetic flap closure. Interior zip compartment."
  },
  {
    name: "Wander Matelassé Bag", brand: "Miu Miu", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 720, sale: null, lead: "14–18 days", tag: "",
    img: IMG + "miumiu-wander.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "29×19×7cm. Hobo style with adjustable strap." },
    desc: "Matelassé nappa leather. Magnetic snap closure. Adjustable leather shoulder strap. Interior zip pocket."
  },
  {
    name: "Crystal Ballet Flats", brand: "Miu Miu", section: "Womenswear", cat: "Shoes", sub: "Shoes",
    color: "Black", price: 420, sale: null, lead: "12–16 days", tag: "Popular",
    img: IMG + "miumiu-ballet.jpg",
    sizes: ["35","36","37","38","39","40","41"],
    fit: { fit: "True to size", notes: "Satin upper with crystal embellishment. Leather sole." },
    desc: "Satin upper with allover crystal detailing. Leather sole. Pointed toe. Bow detail at toe."
  },
  {
    name: "Le City Medium Bag", brand: "Balenciaga", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 680, sale: null, lead: "14–18 days", tag: "",
    img: IMG + "balenciaga-le-city.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "38×24×10cm. Dual handles with detachable mirror." },
    desc: "Arena lambskin leather. Aged brass hardware. Front zip pocket. Detachable shoulder strap and mirror."
  },
  {
    name: "Hourglass Small Bag", brand: "Balenciaga", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 780, sale: null, lead: "14–18 days", tag: "New",
    img: IMG + "balenciaga-hourglass.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "23×10×14cm. Curved hourglass silhouette. Top handle." },
    desc: "Shiny calfskin. Magnetic B logo closure. Hourglass-shaped body. Interior zip pocket. Detachable strap."
  },
  {
    name: "Rodeo Medium Bag", brand: "Balenciaga", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 840, sale: null, lead: "14–18 days", tag: "",
    img: IMG + "balenciaga-rodeo.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "38×27×12cm. Slouchy body with front buckle." },
    desc: "Soft calfskin leather. Front buckle closure. Adjustable shoulder strap. Interior zip compartment."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. GOLDEN GOOSE, TRAVEL, & ACCESSORIES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "Super-Star Sneakers", brand: "Golden Goose", section: "Menswear", cat: "Shoes", sub: "Shoes",
    color: "White", price: 260, sale: null, lead: "8–12 days", tag: "Popular",
    img: IMG + "gg-superstar.jpg",
    sizes: ["39","40","41","42","43","44","45"],
    fit: { fit: "True to size", notes: "Signature star patch. Intentional distressed finish." },
    desc: "White leather upper. Black leather heel tab. Signature star patch. Rubber outsole. Pre-distressed finish."
  },
  {
    name: "Ball Star Sneakers", brand: "Golden Goose", section: "Menswear", cat: "Shoes", sub: "Shoes",
    color: "White", price: 240, sale: null, lead: "8–12 days", tag: "",
    img: IMG + "gg-ballstar.jpg",
    sizes: ["39","40","41","42","43","44","45"],
    fit: { fit: "True to size", notes: "Vintage basketball-inspired design." },
    desc: "Leather upper with crackle leather star. Padded ankle collar. Rubber outsole. Vintage-inspired look."
  },
  {
    name: "Original Cabin (Silver)", brand: "Rimowa", section: "Menswear", cat: "Accessories", sub: "Accessories",
    color: "Silver", price: 540, sale: null, lead: "10–14 days", tag: "New",
    img: IMG + "rimowa-cabin.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "55×40×23cm. Carry-on size. TSA-approved locks." },
    desc: "Anodized aluminum shell. Signature grooves. Multi-wheel system. TSA-approved locks. Flex-divider system."
  },
  {
    name: "Check-In L (Silver)", brand: "Rimowa", section: "Menswear", cat: "Accessories", sub: "Accessories",
    color: "Silver", price: 680, sale: null, lead: "10–14 days", tag: "",
    img: IMG + "rimowa-checkin.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "79×51×27cm. Large check-in capacity." },
    desc: "Anodized aluminum shell. Signature grooves. Multi-wheel system. TSA-approved locks. Height-adjustable handle."
  },
  {
    name: "Saint Louis PM Tote", brand: "Goyard", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 620, sale: null, lead: "18–24 days", tag: "Limited",
    img: IMG + "goyard-saint-louis.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "46×27×14cm. Includes detachable mini pouch." },
    desc: "Goyardine coated canvas. Chevron hand-painted print. Leather trim and handles. Detachable pochette."
  },
  {
    name: "Keepall 55 Monogram", brand: "Louis Vuitton", section: "Menswear", cat: "Bags", sub: "Bags",
    color: "Brown", price: 780, sale: null, lead: "14–18 days", tag: "Popular",
    img: IMG + "lv-keepall55.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "55×31×24cm. Detachable shoulder strap. Padlock and keys." },
    desc: "Monogram coated canvas. Natural cowhide leather trim. Brass hardware. Padlock closure. Textile lining."
  },
  {
    name: "Tank Must Watch", brand: "Cartier", section: "Menswear", cat: "Watches", sub: "Watches",
    color: "Silver", price: 980, sale: null, lead: "14–18 days", tag: "New",
    img: IMG + "cartier-tank-must.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "33.7×25.5mm case. Interchangeable leather strap." },
    desc: "Stainless steel case. SolarBeat photovoltaic movement. Roman numeral dial. Blue cabochon crown."
  },
  {
    name: "Submariner No-Date", brand: "Rolex", section: "Menswear", cat: "Watches", sub: "Watches",
    color: "Black", price: 4200, sale: null, lead: "28–42 days", tag: "Limited",
    img: IMG + "rolex-submariner.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "41mm case. Oystersteel. 300m water resistance." },
    desc: "Oystersteel case and bracelet. Cerachrom bezel insert. Calibre 3230 movement. Chromalight display."
  },
  {
    name: "Datejust 41 (Wimbledon)", brand: "Rolex", section: "Menswear", cat: "Watches", sub: "Watches",
    color: "Gold", price: 5800, sale: null, lead: "28–42 days", tag: "Limited",
    img: IMG + "rolex-datejust.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "41mm case. Oystersteel and yellow gold. Jubilee bracelet." },
    desc: "Oystersteel and 18k yellow gold. Slate green Roman dial. Jubilee bracelet. Calibre 3235 movement."
  },
  {
    name: "Puzzle Bag Small", brand: "Loewe", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Tan", price: 920, sale: null, lead: "14–18 days", tag: "Popular",
    img: IMG + "loewe-puzzle.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "24×16.5×10.5cm. Can be worn 3 ways: crossbody, shoulder, clutch." },
    desc: "Soft grained calfskin. Geometric paneled construction. Detachable adjustable strap. Herringbone cotton lining."
  },
  {
    name: "Lotus Tote", brand: "Khaite", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 620, sale: null, lead: "12–16 days", tag: "New",
    img: IMG + "khaite-lotus.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "38×32×16cm. Slouchy structure with top handles." },
    desc: "Soft calfskin leather. Slouchy unstructured body. Dual top handles. Magnetic snap closure. Unlined."
  },
  {
    name: "Fishnet Flats", brand: "Alaïa", section: "Womenswear", cat: "Shoes", sub: "Shoes",
    color: "Black", price: 360, sale: null, lead: "10–14 days", tag: "",
    img: IMG + "alaia-fishnet.jpg",
    sizes: ["35","36","37","38","39","40","41"],
    fit: { fit: "True to size", notes: "Signature laser-cut leather mesh. Leather sole." },
    desc: "Laser-cut calfskin creating fishnet pattern. Leather sole. Almond toe. Elastic back for easy on/off."
  },
  {
    name: "Le Bambino Bag", brand: "Jacquemus", section: "Womenswear", cat: "Bags", sub: "Bags",
    color: "Black", price: 280, sale: null, lead: "8–12 days", tag: "Popular",
    img: IMG + "jacquemus-bambino.jpg",
    sizes: ["One Size"],
    fit: { fit: "One Size", notes: "18×7×12cm. Mini baguette shape with long strap." },
    desc: "Smooth calfskin leather. Jacquemus logo buckle. Magnetic flap closure. Detachable crossbody strap."
  },
  {
    name: "Cemetery Ring", brand: "Chrome Hearts", section: "Menswear", cat: "Jewellery", sub: "Jewellery",
    color: "Silver", price: 480, sale: null, lead: "18–24 days", tag: "Limited",
    img: IMG + "chrome-hearts-ring.jpg",
    sizes: ["6","7","8","9","10","11","12"],
    fit: { fit: "True to size", notes: "Measure finger circumference. 925 sterling silver." },
    desc: "925 sterling silver. Cross and cemetery motif engraving. Handcrafted in Los Angeles. Polished finish."
  }
];

async function main() {
  console.log(`\n═══ ALTERNATIVE LAUNCH LIST — Adding ${PRODUCTS.length} products ═══\n`);
  await login();

  let ok = 0, fail = 0;
  for (const p of PRODUCTS) {
    const success = await addProduct(p);
    if (success) ok++; else fail++;
  }

  console.log(`\n═══ DONE: ${ok} added, ${fail} failed ═══\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
