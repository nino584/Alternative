import { Helmet } from 'react-helmet-async';

// ── SEO HEAD COMPONENT ───────────────────────────────────────────────────────
// Renders dynamic <title>, <meta>, <link>, and JSON-LD schema in <head>
export default function SEO({ title, description, canonical, og = {}, schema, lang = "en" }) {
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {og.type && <meta property="og:type" content={og.type} />}
      {og.image && <meta property="og:image" content={og.image} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content="Alternative" />
      <meta property="og:locale" content={lang === "ka" ? "ka_GE" : lang === "ru" ? "ru_RU" : "en_US"} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {og.image && <meta name="twitter:image" content={og.image} />}

      {/* Product-specific OG */}
      {og["product:price:amount"] && <meta property="product:price:amount" content={og["product:price:amount"]} />}
      {og["product:price:currency"] && <meta property="product:price:currency" content={og["product:price:currency"]} />}

      {/* Language */}
      <html lang={lang} />

      {/* JSON-LD Schema */}
      {schema && (
        Array.isArray(schema)
          ? schema.map((s, i) => (
              <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
            ))
          : <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
