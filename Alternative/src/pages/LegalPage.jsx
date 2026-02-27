import { C, T } from '../constants/theme.js';
import Footer from '../components/layout/Footer.jsx';
import SEO from '../components/SEO.jsx';
import { pageMeta, breadcrumbSchema } from '../utils/seo.js';

const LEGAL_CONTENT = {
  privacy: {
    label: "Legal",
    title: "Privacy Policy",
    updated: "February 2026",
    sections: [
      {heading:"Information We Collect",body:"We collect personal information that you provide when creating an account, placing an order, or contacting us. This includes your name, email address, phone number (WhatsApp), delivery address, and payment information. We also collect browsing data through cookies to improve your experience."},
      {heading:"How We Use Your Information",body:"Your personal data is used to process and deliver orders, communicate order updates via WhatsApp and email, provide customer support, send promotional materials (with your consent), and improve our services. We never sell your data to third parties."},
      {heading:"Data Sharing",body:"We share your information only with: our verified sourcing partners (order details only), delivery services operating in Tbilisi, payment processors (BOG/TBC), and WhatsApp for order communication. All partners are bound by data protection agreements."},
      {heading:"Data Security",body:"We implement industry-standard security measures to protect your personal information. Payment data is processed through secure, encrypted channels. We do not store full card details on our servers."},
      {heading:"Your Rights",body:"You have the right to access, correct, or delete your personal data at any time. You may also withdraw consent for marketing communications. To exercise these rights, contact us at info@alternative.ge."},
      {heading:"Cookies",body:"We use essential cookies for site functionality and analytics cookies to understand how visitors use our site. You can manage cookie preferences through your browser settings."},
      {heading:"Contact",body:"For privacy-related inquiries, contact us at info@alternative.ge or via WhatsApp at +995 555 999 555."},
    ],
  },
  terms: {
    label: "Legal",
    title: "Terms & Conditions",
    updated: "February 2026",
    sections: [
      {heading:"General",body:"These Terms & Conditions govern your use of Alternative Concept Store (alternative.ge) and any purchases made through our platform. By using our website or placing an order, you agree to these terms."},
      {heading:"Pre-Order Model",body:"Alternative operates on a pre-order model. When you place an order, you pay the full amount upfront. Prices are listed in Georgian Lari (GEL) and include sourcing and quality verification."},
      {heading:"Order Confirmation",body:"After placing an order, you will receive confirmation via WhatsApp and email. Our team will contact you within 2 hours during business hours (Mon–Sat, 10:00–20:00) to confirm your order details."},
      {heading:"Video Verification",body:"Video Verification is an optional add-on service (GEL 28). When selected, your item is inspected by our verification team before shipping. Photo and video materials are sent to your WhatsApp for approval. Shipping proceeds only after your confirmation."},
      {heading:"Cancellation",body:"You may cancel your order free of charge at any time before the item ships to Georgia. Your payment will be fully refunded to the original payment method within 5–7 business days."},
      {heading:"Intellectual Property",body:"All content on this website — including images, text, logos, and design — is the property of Alternative Concept Store and may not be reproduced without written permission."},
      {heading:"Limitation of Liability",body:"Alternative acts as a sourcing intermediary. While we verify product quality through our supply chain, we are not the manufacturer. Our liability is limited to the purchase price of the item. We guarantee the quality of all products sold."},
      {heading:"Governing Law",body:"These terms are governed by the laws of Georgia. Any disputes shall be resolved in the courts of Tbilisi."},
    ],
  },
  returns: {
    label: "Customer Service",
    title: "Returns & Refunds",
    updated: "February 2026",
    sections: [
      {heading:"Cancellation Before Shipping",body:"Orders can be cancelled free of charge at any time before the item ships to Georgia. Your payment will be fully refunded to the original payment method within 5–7 business days. No questions asked."},
      {heading:"Damaged or Defective Items",body:"If your item arrives damaged or defective, contact us within 24 hours of delivery with photos of the damage. We will arrange either a full replacement or a complete refund including shipping costs."},
      {heading:"Item Not As Described",body:"If the item significantly differs from the product description or photos shown on our website, contact us within 24 hours. We will review your claim and offer a replacement or full refund."},
      {heading:"Video Verification Returns",body:"If you selected Video Verification and rejected the item after review, the Video Verification fee is non-refundable. However, your product payment will be fully refunded, or we can source an alternative item for you."},
      {heading:"Refund Process",body:"Approved refunds are processed within 5–7 business days. Bank transfers (BOG/TBC) are refunded to the same account. Card payments are refunded to the original card. You will receive confirmation via WhatsApp once processed."},
      {heading:"Non-Refundable Items",body:"The Video Verification service fee is non-refundable once the verification has been completed and media has been sent to you. Custom or personalized orders cannot be returned unless defective."},
      {heading:"Contact Us",body:"For returns and refund requests, contact us at info@alternative.ge or via WhatsApp at +995 555 999 555. Please include your order number and photos if applicable."},
    ],
  },
  shipping: {
    label: "Customer Service",
    title: "Shipping Information",
    updated: "February 2026",
    sections: [
      {heading:"Delivery Area",body:"We currently deliver to Tbilisi, Georgia. Nationwide shipping to other cities in Georgia is coming soon. We do not ship internationally at this time."},
      {heading:"Delivery Timeline",body:"Standard delivery takes 10–18 business days from order confirmation, depending on the item. The estimated lead time is displayed on each product page. Orders with Video Verification may take 2–3 additional days for the inspection process."},
      {heading:"Shipping Cost",body:"All duties and taxes are included in the product price. Shipping to Tbilisi is paid upon arrival in Georgia. The shipping fee is communicated before order confirmation."},
      {heading:"Delivery Options",body:"Home Delivery — we deliver directly to your door in premium Alternative branded packaging. Post Office Pickup — collect your order from the designated postal location. Your preferred delivery method is selected during checkout."},
      {heading:"Order Tracking",body:"You can track your order status at any time through your account on our website. We also send status updates via WhatsApp at each stage: Reserved → Sourcing → Confirmed → Shipped → Delivered."},
      {heading:"Packaging",body:"All items are carefully packaged in premium Alternative branded packaging to ensure safe delivery. Items are wrapped in protective materials to prevent damage during transit."},
      {heading:"Missed Delivery",body:"If you miss a delivery attempt, our courier will contact you via WhatsApp to reschedule. Items are held for up to 7 days before being returned to our facility."},
    ],
  },
  accessibility: {
    label: "Company",
    title: "Accessibility",
    updated: "February 2026",
    sections: [
      {heading:"Our Commitment",body:"Alternative Concept Store is committed to ensuring digital accessibility for all users. We continuously work to improve the user experience for everyone and apply the relevant accessibility standards."},
      {heading:"Accessibility Features",body:"Our website includes: keyboard navigation support, sufficient color contrast ratios, responsive design that works across devices and screen sizes, clear and consistent navigation structure, descriptive image alt text, and scalable text that responds to browser zoom."},
      {heading:"Ongoing Efforts",body:"We regularly review and update our website to address accessibility issues. Our team tests the site with assistive technologies and incorporates feedback from users to improve accessibility."},
      {heading:"Alternative Contact Methods",body:"If you have difficulty using our website, you can reach us through alternative channels: WhatsApp at +995 555 999 555, email at info@alternative.ge, or phone at +995 555 999 555. Our team is available Mon–Sat, 10:00–20:00 to assist you with browsing, ordering, or any questions."},
      {heading:"Feedback",body:"We welcome your feedback on the accessibility of our website. If you encounter any barriers or have suggestions for improvement, please contact us at info@alternative.ge. We aim to respond to accessibility feedback within 2 business days."},
    ],
  },
};

// ── LEGAL PAGE ───────────────────────────────────────────────────────────────
export default function LegalPage({type,setPage,L,mobile}) {
  const content = LEGAL_CONTENT[type] || LEGAL_CONTENT.privacy;
  const px=mobile?"16px":"40px";

  return (
    <div style={{paddingTop:mobile?52:80,background:C.cream}}>
      <SEO {...pageMeta(type)} schema={breadcrumbSchema([{name:"Home",url:"/"},{name:content.title}])} />
      {/* HEADER */}
      <div style={{borderBottom:`1px solid ${C.lgray}`,padding:mobile?"28px 0":"40px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:`0 ${px}`}}>
          <p style={{...T.labelSm,color:C.tan,marginBottom:10}}>{content.label}</p>
          <h1 style={{...T.displayMd,color:C.black,marginBottom:8}}>{content.title}</h1>
          <p style={{...T.labelSm,color:C.gray,fontSize:9}}>Last updated: {content.updated}</p>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{padding:mobile?"32px 0 48px":"48px 0 80px"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:`0 ${px}`}}>
          {content.sections.map((s,i)=>(
            <div key={i} style={{marginBottom:mobile?28:36}}>
              <h2 style={{...T.heading,color:C.black,fontSize:15,marginBottom:10}}>{s.heading}</h2>
              <p style={{...T.body,color:C.gray,lineHeight:1.9}}>{s.body}</p>
            </div>
          ))}

          <div style={{padding:"20px 24px",background:C.offwhite,borderLeft:`3px solid ${C.tan}`,marginTop:mobile?32:48}}>
            <p style={{...T.bodySm,color:C.brown,lineHeight:1.8}}>
              Questions? Contact us at <strong>info@alternative.ge</strong> or via WhatsApp at <strong>+995 555 999 555</strong>
            </p>
          </div>
        </div>
      </div>

      <Footer setPage={setPage} L={L} mobile={mobile}/>
    </div>
  );
}
