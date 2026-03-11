// ── SEO UTILITIES ────────────────────────────────────────────────────────────
const SITE_NAME = "Alternative";
const SITE_URL = "https://alternative.store";
const SITE_DESC = "Curated designer fashion sourced from verified European suppliers. Pre-order luxury bags, shoes, clothing and watches — shipped to Tbilisi, Georgia.";
const OG_IMAGE = SITE_URL + "/images/store-interior.jpg";

// ── Slug generation ──────────────────────────────────────────────────────────
export function toSlug(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[—–]/g, "-")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function productSlug(product) {
  return toSlug(`${product.brand}-${product.name}`);
}

export function productUrl(product) {
  return `/product/${product.id}-${productSlug(product)}`;
}

export function categoryUrl(section, cat) {
  if (!section && !cat) return "/catalog";
  const parts = ["/catalog"];
  if (section) parts.push(toSlug(section));
  if (cat) parts.push(toSlug(cat));
  return parts.join("/");
}

// ── Meta tag templates ───────────────────────────────────────────────────────
export function pageMeta(page, data = {}) {
  switch (page) {
    case "home":
      return {
        title: `${SITE_NAME} — Curated Designer Fashion | Tbilisi Concept Store`,
        description: SITE_DESC,
        canonical: SITE_URL + "/",
        og: { type: "website", image: OG_IMAGE },
      };
    case "catalog":
      return {
        title: data.section
          ? `${data.section} Collection — Designer ${data.cat || "Fashion"} | ${SITE_NAME}`
          : `Shop All — Curated Designer Collection | ${SITE_NAME}`,
        description: data.section
          ? `Shop curated ${data.section.toLowerCase()} ${(data.cat || "fashion").toLowerCase()} from top European designers. Pre-order with free cancellation. ${SITE_NAME} Tbilisi.`
          : `Browse our curated collection of luxury bags, shoes, clothing & watches from verified European suppliers. ${SITE_NAME} Tbilisi.`,
        canonical: SITE_URL + "/catalog",
        og: { type: "website", image: OG_IMAGE },
      };
    case "product": {
      const p = data.product;
      if (!p) return { title: `Product | ${SITE_NAME}`, description: SITE_DESC, canonical: SITE_URL, og: {} };
      const price = p.sale ?? p.price;
      return {
        title: `${p.name} by ${p.brand} — ${p.color} | ${SITE_NAME}`,
        description: `${p.brand} ${p.name} in ${p.color}. ${p.desc} Pre-order for GEL ${price} with free cancellation. Delivery ${p.lead}.`,
        canonical: SITE_URL + productUrl(p),
        og: {
          type: "product",
          image: p.img?.startsWith("http") ? p.img : SITE_URL + p.img,
          "product:price:amount": price,
          "product:price:currency": "GEL",
        },
      };
    }
    case "about":
      return {
        title: `About ${SITE_NAME} — Our Story | Curated Fashion from Verified Suppliers`,
        description: `${SITE_NAME} is a Tbilisi concept store sourcing curated designer fashion from verified European suppliers. Quality guaranteed, honest pricing, no surprises.`,
        canonical: SITE_URL + "/about",
        og: { type: "website", image: OG_IMAGE },
      };
    case "how":
      return {
        title: `How It Works — Pre-Order Process & FAQ | ${SITE_NAME}`,
        description: "Learn how to pre-order designer fashion at Alternative. Reserve your item, we source from verified suppliers, optional video verification, delivered to Tbilisi in 10-18 days.",
        canonical: SITE_URL + "/how",
        og: { type: "website", image: OG_IMAGE },
      };
    case "brands":
      return {
        title: `Designers & Brands — 60+ Luxury Labels | ${SITE_NAME}`,
        description: "Browse our curated selection of 60+ luxury designers including Bottega Veneta, Gucci, Loewe, Max Mara, Cartier, Moncler and more. All sourced from verified European suppliers.",
        canonical: SITE_URL + "/brands",
        og: { type: "website", image: OG_IMAGE },
      };
    case "contact":
      return {
        title: `Contact Us — ${SITE_NAME} | WhatsApp, Email, Visit`,
        description: `Get in touch with ${SITE_NAME} Tbilisi. WhatsApp, email or visit us. Mon-Sat 10:00-20:00. Customer support for orders, returns and inquiries.`,
        canonical: SITE_URL + "/contact",
        og: { type: "website", image: OG_IMAGE },
      };
    case "membership":
      return {
        title: `Membership & Affiliate Program | ${SITE_NAME}`,
        description: `Join ${SITE_NAME} membership for exclusive discounts, early access and rewards. Earn commissions with our affiliate program.`,
        canonical: SITE_URL + "/membership",
        og: { type: "website", image: OG_IMAGE },
      };
    case "video-verification":
      return {
        title: `Video Verification Service — See Before You Buy | ${SITE_NAME}`,
        description: "Add video verification to any order for GEL 28. Our team films a complete walkthrough of your item and sends it to WhatsApp before shipping.",
        canonical: SITE_URL + "/video-verification",
        og: { type: "website", image: OG_IMAGE },
      };
    case "privacy":
      return {
        title: `Privacy Policy | ${SITE_NAME}`,
        description: `${SITE_NAME} privacy policy. How we collect, use and protect your personal data.`,
        canonical: SITE_URL + "/privacy",
        og: { type: "website" },
      };
    case "terms":
      return {
        title: `Terms & Conditions | ${SITE_NAME}`,
        description: `${SITE_NAME} terms of service. Pre-order terms, payment, cancellation and return policies.`,
        canonical: SITE_URL + "/terms",
        og: { type: "website" },
      };
    case "returns":
      return {
        title: `Returns & Refund Policy | ${SITE_NAME}`,
        description: `${SITE_NAME} returns policy. Free cancellation before shipping. Returns within 24 hours of delivery for damaged or incorrect items.`,
        canonical: SITE_URL + "/returns",
        og: { type: "website" },
      };
    case "shipping":
      return {
        title: `Shipping & Delivery Information | ${SITE_NAME}`,
        description: "Delivery to Tbilisi, Georgia in 10-18 days. Tracked shipping from verified European suppliers. Free cancellation before dispatch.",
        canonical: SITE_URL + "/shipping",
        og: { type: "website" },
      };
    case "accessibility":
      return {
        title: `Accessibility Statement | ${SITE_NAME}`,
        description: `${SITE_NAME} accessibility statement. Our commitment to making our website accessible to all users.`,
        canonical: SITE_URL + "/accessibility",
        og: { type: "website" },
      };
    case "seller-agreement":
      return {
        title: `Seller Agreement | ${SITE_NAME}`,
        description: `${SITE_NAME} seller agreement. Terms and conditions for suppliers and sellers on our platform.`,
        canonical: SITE_URL + "/seller-agreement",
        og: { type: "website" },
      };
    case "ip-policy":
      return {
        title: `Intellectual Property Policy | ${SITE_NAME}`,
        description: `${SITE_NAME} intellectual property policy. How we handle IP rights, counterfeits, and trademark complaints.`,
        canonical: SITE_URL + "/ip-policy",
        og: { type: "website" },
      };
    default:
      return {
        title: `${SITE_NAME} — Curated Designer Fashion`,
        description: SITE_DESC,
        canonical: SITE_URL,
        og: { type: "website", image: OG_IMAGE },
      };
  }
}

// ── Schema.org JSON-LD generators ────────────────────────────────────────────
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: SITE_URL + "/images/logo.png",
    description: SITE_DESC,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tbilisi",
      addressCountry: "GE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Georgian", "Russian"],
    },
    sameAs: [
      "https://www.instagram.com/alternative.ge",
      "https://www.facebook.com/alternative.ge",
      "https://www.tiktok.com/@alternative.ge",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: SITE_URL + "/catalog?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productSchema(product) {
  const price = product.sale ?? product.price;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.brand} ${product.name}`,
    description: product.desc,
    image: product.img?.startsWith("http") ? product.img : SITE_URL + product.img,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    color: product.color,
    category: `${product.section} > ${product.cat}`,
    offers: {
      "@type": "Offer",
      url: SITE_URL + productUrl(product),
      priceCurrency: "GEL",
      price: price,
      availability: "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "GE",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 10,
            maxValue: 18,
            unitCode: "DAY",
          },
        },
      },
    },
  };
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: SITE_URL + item.url, url: SITE_URL + item.url } : {}),
    })),
  };
}

export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function collectionSchema(products, name, url) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: name,
    url: SITE_URL + url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: SITE_URL + productUrl(p),
        name: `${p.brand} ${p.name}`,
      })),
    },
  };
}

// ── Image alt text generator ─────────────────────────────────────────────────
export function productAlt(product) {
  return `${product.brand} ${product.name} in ${product.color} — ${product.cat} | ${SITE_NAME}`;
}

export function productThumbAlt(product) {
  return `${product.color} ${product.name} by ${product.brand}`;
}
