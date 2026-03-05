// ── BRAND IMAGES ─────────────────────────────────────────────────────────────
// Static images live in public/images/. Hero: place hero.jpg (or hero.png / hero.webp) there.
const BASE = import.meta.env.BASE_URL;
export const IMAGES_DIR = BASE + "images";
export const HERO_IMAGE = `${IMAGES_DIR}/hero.jpg`;

export const BI = {
  bag_stone:       `${IMAGES_DIR}/womenswear.jpg`,
  man_editorial:   `${IMAGES_DIR}/menswear.jpg`,
  packaging:       `${IMAGES_DIR}/kidswear.jpg`,
  store_interior:  `${IMAGES_DIR}/store-interior.jpg`,
  cover:           `${IMAGES_DIR}/womenswear.jpg`,
  editorial:       `${IMAGES_DIR}/menswear.jpg`,
  bag:             `${IMAGES_DIR}/womenswear.jpg`,
  store:           `${IMAGES_DIR}/store-interior.jpg`,
  hero_bag:        `${IMAGES_DIR}/womenswear.jpg`,
  ribbon:          `${IMAGES_DIR}/kidswear.jpg`,
  thankyou:        `${IMAGES_DIR}/store-interior.jpg`,
  logo_page:       `${IMAGES_DIR}/store-interior.jpg`,
  story_sneakers:  `${IMAGES_DIR}/kidswear.jpg`,
};

// ── PRODUCT PLACEHOLDER IMAGES ───────────────────────────────────────────────
const PRODUCTS_DIR = `${IMAGES_DIR}/products`;
export const PI = {
  tote:      `${PRODUCTS_DIR}/tote.jpg`,
  quilted:   `${PRODUCTS_DIR}/quilted.jpg`,
  scarf:     `${PRODUCTS_DIR}/scarf.jpg`,
  mule:      `${PRODUCTS_DIR}/mule.jpg`,
  cashmere:  `${PRODUCTS_DIR}/cashmere.jpg`,
  crossbody: `${PRODUCTS_DIR}/crossbody.jpg`,
  blazer:    `${PRODUCTS_DIR}/blazer.jpg`,
  belt:      `${PRODUCTS_DIR}/belt.jpg`,
  watch1:    `${PRODUCTS_DIR}/watch1.jpg`,
  watch2:    `${PRODUCTS_DIR}/watch2.jpg`,
  loafer:    `${PRODUCTS_DIR}/loafer.jpg`,
  duffle:    `${PRODUCTS_DIR}/duffle.jpg`,
  overcoat:  `${PRODUCTS_DIR}/overcoat.jpg`,
  dresswatch:`${PRODUCTS_DIR}/dresswatch.jpg`,
  puffer:    `${PRODUCTS_DIR}/puffer.jpg`,
  sneaker:   `${PRODUCTS_DIR}/sneaker.jpg`,
};
