import { C, T } from '../constants/theme.js';
import Footer from '../components/layout/Footer.jsx';
import SEO from '../components/SEO.jsx';
import { pageMeta, breadcrumbSchema } from '../utils/seo.js';

// ── ENGLISH CONTENT ──────────────────────────────────────────────────────────
const EN = {
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
  'seller-agreement': {
    label: "Legal",
    title: "Seller Agreement",
    updated: "March 2026",
    sections: [
      {heading:"Article 1 — Platform Status",body:"ALTERNATIVE (\u201CPlatform\u201D) is a technology intermediary that enables sellers to list products and buyers to purchase them. The platform is not a seller, manufacturer, or brand representative. ALTERNATIVE operates as an intermediary e-commerce platform under Georgian Law on Electronic Commerce (2023). The platform is NOT the seller. All responsibility for product authenticity, legality, and IP compliance rests solely with the individual seller."},
      {heading:"Article 2 — Seller Obligations",body:"Sellers must: (a) list only original, authentic products; (b) provide proof of purchase or authenticity documentation for luxury brand products; (c) maintain a minimum price of ₾100 GEL; (d) respond to all customer complaints within 48 hours; (e) accept full legal responsibility for any brand's IP rights when using brand names, logos, or trademarks in their listings."},
      {heading:"Article 3 — Liability Limitation",body:"ALTERNATIVE is not responsible for the authenticity, quality, or legality of products listed by sellers. The platform is exempt from liability under the Georgian E-Commerce Law safe harbor provision, provided that: (a) the platform did not interfere with the seller's content; (b) the platform responded appropriately within 48 hours of receiving a notice. ALTERNATIVE's maximum liability in any case is limited to the specific transaction fee."},
      {heading:"Article 4 — Account Suspension",body:"ALTERNATIVE reserves the right to immediately and without notice suspend or terminate any seller's account if: (a) counterfeit or non-original products are discovered; (b) an IP infringement notice is received from a brand or authorized party; (c) pricing is set below ₾100 by circumventing the system; (d) 3 or more verified customer complaints regarding authenticity are received."},
      {heading:"Seller Confirmation",body:"By electronically confirming this agreement, the seller commits to: 1) list only original products; 2) possess the authorization to use the brand; 3) accept full responsibility in case of IP infringement; 4) agree to the ₾100 minimum price; 5) agree to ALTERNATIVE's right to remove listings or suspend accounts; 6) be of legal age and have the legal right to conduct business operations."},
      {heading:"Electronic Acceptance",body:"Under Article 327 of the Georgian Civil Code, electronic confirmation constitutes a legally binding contract and is enforceable in court. Upon confirmation, the following is recorded: seller ID, timestamp (UTC), IP address, and agreement version."},
    ],
  },
  'ip-policy': {
    label: "Legal",
    title: "Intellectual Property Policy",
    updated: "March 2026",
    sections: [
      {heading:"Our Position",body:"ALTERNATIVE respects all brands' intellectual property rights and cooperates with any brand that contacts us regarding IP infringement."},
      {heading:"Step 1 — Notice Received",body:"IP rights holders may submit a takedown notice to legal@alternative.ge. The notice must include: brand name, URL of the infringing listing, and the basis of the IP right claim."},
      {heading:"Step 2 — Confirmation (24 hours)",body:"ALTERNATIVE will confirm receipt of the takedown notice within 24 hours of submission."},
      {heading:"Step 3 — Under Review (48 hours)",body:"The reported listing will be placed under review within 48 hours. During review, the listing is hidden from the public marketplace and displays as \"temporarily unavailable\". This 48-hour response window is critical for maintaining safe harbor status."},
      {heading:"Step 4 — Seller Response (72 hours)",body:"The seller is notified and given 72 hours to provide proof of authenticity or authorization for the disputed listing."},
      {heading:"Step 5 — Resolution (120 hours)",body:"If the seller fails to provide sufficient proof within the allotted time, the listing is permanently removed and the account may be suspended. The total process completes within 120 hours (5 days)."},
      {heading:"Repeat Offenders",body:"Sellers who receive multiple IP takedown notices may have their accounts permanently terminated. All takedown actions are logged with timestamps for legal documentation."},
      {heading:"Contact",body:"To submit an IP infringement notice, contact us at legal@alternative.ge with the required documentation. For general inquiries: info@alternative.ge or +995 555 999 555."},
    ],
  },
};

// ── GEORGIAN CONTENT ─────────────────────────────────────────────────────────
const KA = {
  privacy: {
    label: "იურიდიული",
    title: "კონფიდენციალურობის პოლიტიკა",
    updated: "თებერვალი 2026",
    sections: [
      {heading:"ინფორმაცია, რომელსაც ვაგროვებთ",body:"ჩვენ ვაგროვებთ პერსონალურ ინფორმაციას, რომელსაც თქვენ გვაწვდით ანგარიშის შექმნისას, შეკვეთის განთავსებისას ან ჩვენთან დაკავშირებისას. ეს მოიცავს თქვენს სახელს, ელ-ფოსტას, ტელეფონის ნომერს (WhatsApp), მიწოდების მისამართს და გადახდის ინფორმაციას. ასევე ვაგროვებთ ბრაუზინგის მონაცემებს ქუქი-ფაილების მეშვეობით."},
      {heading:"როგორ ვიყენებთ თქვენს ინფორმაციას",body:"თქვენი პერსონალური მონაცემები გამოიყენება შეკვეთების დამუშავებისა და მიწოდებისთვის, შეკვეთის განახლებების კომუნიკაციისთვის WhatsApp-ისა და ელ-ფოსტის მეშვეობით, მომხმარებელთა მხარდაჭერისთვის, სარეკლამო მასალების გაგზავნისთვის (თქვენი თანხმობით) და ჩვენი სერვისების გაუმჯობესებისთვის. ჩვენ არასოდეს ვყიდით თქვენს მონაცემებს მესამე მხარეებისთვის."},
      {heading:"მონაცემთა გაზიარება",body:"ჩვენ ვუზიარებთ თქვენს ინფორმაციას მხოლოდ: ჩვენს ვერიფიცირებულ პარტნიორებს (მხოლოდ შეკვეთის დეტალები), თბილისში მოქმედ საკურიერო სერვისებს, გადახდის პროცესორებს (BOG/TBC) და WhatsApp-ს შეკვეთის კომუნიკაციისთვის."},
      {heading:"მონაცემთა უსაფრთხოება",body:"ჩვენ ვიყენებთ ინდუსტრიული სტანდარტის უსაფრთხოების ზომებს თქვენი პერსონალური ინფორმაციის დასაცავად. გადახდის მონაცემები მუშავდება უსაფრთხო, დაშიფრული არხებით. ჩვენ არ ვინახავთ სრულ ბარათის მონაცემებს ჩვენს სერვერებზე."},
      {heading:"თქვენი უფლებები",body:"თქვენ გაქვთ უფლება ნებისმიერ დროს მოიხილოთ, შეასწოროთ ან წაშალოთ თქვენი პერსონალური მონაცემები. ასევე შეგიძლიათ გააუქმოთ თანხმობა სარეკლამო კომუნიკაციებზე. ამ უფლებების გამოსაყენებლად დაგვიკავშირდით: info@alternative.ge."},
      {heading:"ქუქი-ფაილები",body:"ჩვენ ვიყენებთ აუცილებელ ქუქი-ფაილებს საიტის ფუნქციონირებისთვის და ანალიტიკურ ქუქი-ფაილებს ვიზიტორთა ქცევის გასაგებად. ქუქი-ფაილების პარამეტრების მართვა შეგიძლიათ ბრაუზერის პარამეტრებიდან."},
      {heading:"კონტაქტი",body:"კონფიდენციალურობასთან დაკავშირებული შეკითხვებისთვის დაგვიკავშირდით: info@alternative.ge ან WhatsApp: +995 555 999 555."},
    ],
  },
  terms: {
    label: "იურიდიული",
    title: "წესები და პირობები",
    updated: "თებერვალი 2026",
    sections: [
      {heading:"ზოგადი",body:"ეს წესები და პირობები არეგულირებს Alternative Concept Store-ის (alternative.ge) გამოყენებას და ნებისმიერ შენაძენს, რომელიც განხორციელდა ჩვენი პლატფორმის მეშვეობით. საიტის გამოყენებით ან შეკვეთის განთავსებით თქვენ ეთანხმებით ამ პირობებს."},
      {heading:"პრე-ორდერის მოდელი",body:"Alternative მუშაობს პრე-ორდერის მოდელით. შეკვეთის განთავსებისას თქვენ იხდით სრულ თანხას წინასწარ. ფასები მითითებულია ქართულ ლარში (GEL) და მოიცავს სორსინგს და ხარისხის ვერიფიკაციას."},
      {heading:"შეკვეთის დადასტურება",body:"შეკვეთის განთავსების შემდეგ თქვენ მიიღებთ დადასტურებას WhatsApp-ისა და ელ-ფოსტის მეშვეობით. ჩვენი გუნდი დაგიკავშირდებათ 2 საათის განმავლობაში სამუშაო საათებში (ორშ–შაბ, 10:00–20:00) შეკვეთის დეტალების დასადასტურებლად."},
      {heading:"ვიდეო ვერიფიკაცია",body:"ვიდეო ვერიფიკაცია არის დამატებითი სერვისი (₾28). არჩევის შემთხვევაში, თქვენს ნივთს ამოწმებს ჩვენი ვერიფიკაციის გუნდი გაგზავნამდე. ფოტო და ვიდეო მასალები იგზავნება თქვენს WhatsApp-ზე დასადასტურებლად. გაგზავნა ხდება მხოლოდ თქვენი დადასტურების შემდეგ."},
      {heading:"გაუქმება",body:"თქვენ შეგიძლიათ გააუქმოთ შეკვეთა უფასოდ ნებისმიერ დროს, სანამ ნივთი საქართველოში გაიგზავნება. თქვენი გადახდა სრულად დაბრუნდება საწყის გადახდის მეთოდზე 5–7 სამუშაო დღის განმავლობაში."},
      {heading:"ინტელექტუალური საკუთრება",body:"ამ ვებსაიტის ყველა კონტენტი — მათ შორის სურათები, ტექსტი, ლოგოები და დიზაინი — არის Alternative Concept Store-ის საკუთრება და არ შეიძლება გამოყენებულ იქნას წერილობითი ნებართვის გარეშე."},
      {heading:"პასუხისმგებლობის შეზღუდვა",body:"Alternative მოქმედებს როგორც სორსინგის შუამავალი. მიუხედავად იმისა, რომ ჩვენ ვამოწმებთ პროდუქტის ხარისხს, ჩვენ არ ვართ მწარმოებელი. ჩვენი პასუხისმგებლობა შეზღუდულია ნივთის შესყიდვის ფასით. ჩვენ ვიძლევით ყველა გაყიდული პროდუქტის ხარისხის გარანტიას."},
      {heading:"მოქმედი კანონმდებლობა",body:"ეს პირობები რეგულირდება საქართველოს კანონმდებლობით. ნებისმიერი დავა გადაწყდება თბილისის სასამართლოებში."},
    ],
  },
  returns: {
    label: "მომხმარებლის სერვისი",
    title: "დაბრუნება და ანაზღაურება",
    updated: "თებერვალი 2026",
    sections: [
      {heading:"გაუქმება გაგზავნამდე",body:"შეკვეთის გაუქმება შესაძლებელია უფასოდ ნებისმიერ დროს, სანამ ნივთი საქართველოში გაიგზავნება. თქვენი გადახდა სრულად დაბრუნდება საწყის გადახდის მეთოდზე 5–7 სამუშაო დღის განმავლობაში."},
      {heading:"დაზიანებული ან დეფექტიანი ნივთები",body:"თუ თქვენი ნივთი მოვიდა დაზიანებული ან დეფექტიანი, დაგვიკავშირდით მიწოდებიდან 24 საათის განმავლობაში დაზიანების ფოტოებით. ჩვენ მოვაწყობთ სრულ შეცვლას ან სრულ ანაზღაურებას, მიწოდების ხარჯების ჩათვლით."},
      {heading:"ნივთი არ შეესაბამება აღწერას",body:"თუ ნივთი მნიშვნელოვნად განსხვავდება პროდუქტის აღწერისგან ან ფოტოებისგან, დაგვიკავშირდით 24 საათის განმავლობაში. ჩვენ განვიხილავთ თქვენს მოთხოვნას და შემოგთავაზებთ შეცვლას ან სრულ ანაზღაურებას."},
      {heading:"ვიდეო ვერიფიკაციის დაბრუნება",body:"თუ აირჩიეთ ვიდეო ვერიფიკაცია და უარყავით ნივთი, ვიდეო ვერიფიკაციის საფასური არ ბრუნდება. თუმცა, პროდუქტის გადახდა სრულად ანაზღაურდება, ან შეგვიძლია მოვძებნოთ ალტერნატიული ნივთი."},
      {heading:"ანაზღაურების პროცესი",body:"დამტკიცებული ანაზღაურება მუშავდება 5–7 სამუშაო დღის განმავლობაში. საბანკო გადარიცხვები (BOG/TBC) ბრუნდება იმავე ანგარიშზე. ბარათით გადახდები ბრუნდება ორიგინალ ბარათზე. დადასტურებას მიიღებთ WhatsApp-ით."},
      {heading:"არადაბრუნებადი ნივთები",body:"ვიდეო ვერიფიკაციის სერვისის საფასური არ ბრუნდება ვერიფიკაციის დასრულებისა და მასალების გაგზავნის შემდეგ. პერსონალიზებული შეკვეთები არ ბრუნდება, თუ არ არის დეფექტიანი."},
      {heading:"დაგვიკავშირდით",body:"დაბრუნების და ანაზღაურების მოთხოვნებისთვის დაგვიკავშირდით: info@alternative.ge ან WhatsApp: +995 555 999 555. გთხოვთ მიუთითოთ შეკვეთის ნომერი და ფოტოები."},
    ],
  },
  shipping: {
    label: "მომხმარებლის სერვისი",
    title: "მიწოდების ინფორმაცია",
    updated: "თებერვალი 2026",
    sections: [
      {heading:"მიწოდების არეალი",body:"ამჟამად ვაწვდით თბილისში, საქართველო. სხვა ქალაქებში მიწოდება მალე დაემატება. ამჟამად არ ვაწვდით საერთაშორისო დონეზე."},
      {heading:"მიწოდების ვადა",body:"სტანდარტული მიწოდება 10–18 სამუშაო დღეს მოითხოვს შეკვეთის დადასტურებიდან. სავარაუდო ვადა მითითებულია პროდუქტის გვერდზე. ვიდეო ვერიფიკაციით შეკვეთებს შეიძლება 2–3 დამატებითი დღე დასჭირდეს."},
      {heading:"მიწოდების ღირებულება",body:"ყველა ბაჟი და გადასახადი ჩართულია პროდუქტის ფასში. თბილისში მიწოდების საფასური გადაიხდება საქართველოში ჩამოსვლისას. მიწოდების საფასური შეკვეთის დადასტურებამდე გეცნობებათ."},
      {heading:"მიწოდების ვარიანტები",body:"სახლში მიწოდება — ვაწვდით პირდაპირ თქვენს კართან პრემიუმ Alternative ბრენდირებული შეფუთვით. საფოსტო პუნქტი — შეგიძლიათ აიღოთ შეკვეთა მითითებულ საფოსტო ლოკაციაზე. მიწოდების სასურველი მეთოდი აირჩიეთ გადახდისას."},
      {heading:"შეკვეთის თვალყურის დევნება",body:"შეკვეთის სტატუსის თვალყურის დევნება შეგიძლიათ ნებისმიერ დროს თქვენი ანგარიშიდან. ასევე ვაგზავნით სტატუსის განახლებებს WhatsApp-ით ყოველ ეტაპზე: დაჯავშნილი → სორსინგი → დადასტურებული → გაგზავნილი → მიწოდებული."},
      {heading:"შეფუთვა",body:"ყველა ნივთი საგულდაგულოდ შეფუთულია პრემიუმ Alternative ბრენდირებული შეფუთვით უსაფრთხო მიწოდებისთვის. ნივთები შეფუთულია დამცავი მასალებით ტრანზიტის დროს დაზიანების თავიდან ასაცილებლად."},
      {heading:"გამოტოვებული მიწოდება",body:"თუ გამოტოვებთ მიწოდების მცდელობას, ჩვენი კურიერი დაგიკავშირდებათ WhatsApp-ით გადანიშვნისთვის. ნივთები ინახება 7 დღის განმავლობაში ჩვენს საწყობში დაბრუნებამდე."},
    ],
  },
  accessibility: {
    label: "კომპანია",
    title: "ხელმისაწვდომობა",
    updated: "თებერვალი 2026",
    sections: [
      {heading:"ჩვენი ვალდებულება",body:"Alternative Concept Store ვალდებულია უზრუნველყოს ციფრული ხელმისაწვდომობა ყველა მომხმარებლისთვის. ჩვენ მუდმივად ვმუშაობთ ყველასთვის მომხმარებლის გამოცდილების გაუმჯობესებაზე."},
      {heading:"ხელმისაწვდომობის ფუნქციები",body:"ჩვენი ვებსაიტი მოიცავს: კლავიატურით ნავიგაციის მხარდაჭერას, საკმარის ფერთა კონტრასტს, რესპონსიულ დიზაინს, მკაფიო ნავიგაციის სტრუქტურას, სურათების აღწერილობით ტექსტს და მასშტაბირებად ტექსტს."},
      {heading:"მიმდინარე ძალისხმევა",body:"ჩვენ რეგულარულად ვამოწმებთ და ვაახლებთ ჩვენს ვებსაიტს ხელმისაწვდომობის პრობლემების მოსაგვარებლად. ჩვენი გუნდი ტესტავს საიტს დამხმარე ტექნოლოგიებით."},
      {heading:"ალტერნატიული საკონტაქტო მეთოდები",body:"თუ გიჭირთ ჩვენი ვებსაიტის გამოყენება, შეგიძლიათ დაგვიკავშირდეთ: WhatsApp +995 555 999 555, ელ-ფოსტა info@alternative.ge, ტელეფონი +995 555 999 555. ჩვენი გუნდი ხელმისაწვდომია ორშ–შაბ, 10:00–20:00."},
      {heading:"უკუკავშირი",body:"მოგესალმებით თქვენი გამოხმაურება ჩვენი ვებსაიტის ხელმისაწვდომობაზე. თუ შეხვდებით ბარიერებს ან გაქვთ წინადადებები, დაგვიკავშირდით: info@alternative.ge. პასუხს გაგცემთ 2 სამუშაო დღის განმავლობაში."},
    ],
  },
  'seller-agreement': {
    label: "იურიდიული",
    title: "გამყიდველის ხელშეკრულება",
    updated: "მარტი 2026",
    sections: [
      {heading:"მუხლი 1 — პლატფორმის სტატუსი",body:"ALTERNATIVE (\u201Eპლატფორმა\u201C) არის ტექნოლოგიური შუამავალი, რომელიც გამყიდველებს საშუალებას აძლევს განათავსონ პროდუქცია და მყიდველებს \u2014 შეიძინონ იგი. პლატფორმა არ არის გამყიდველი, მწარმოებელი ან სავაჭრო ბრენდის წარმომადგენელი. ALTERNATIVE მოქმედებს \u201Eელექტრონული კომერციის შესახებ\u201C საქართველოს კანონის (2023 წ.) მე-8 და მე-9 მუხლების შესაბამისად, რომელიც ანიჭებს შუალედური მომსახურების მიმწოდებელს პასუხისმგებლობისგან განთავისუფლებას."},
      {heading:"მუხლი 2 — გამყიდველთა ვალდებულებები",body:"გამყიდველი ვალდებულია: ა) განათავსოს მხოლოდ ორიგინალური, ავთენტური პროდუქცია; ბ) ლუქსური ბრენდის პროდუქტის შემთხვევაში წარმოადგინოს შესყიდვის ან ავთენტურობის დამადასტურებელი დოკუმენტი; გ) დაიცვას მინიმალური ფასი ₾100 GEL; დ) პასუხი აგოს მომხმარებელთა ყველა ჩივილზე 48 საათის განმავლობაში; ე) ნებისმიერი ბრენდის სახელის, ლოგოს ან სასაქონლო ნიშნის გამოყენება მის ლისტინგში ნიშნავს, რომ გამყიდველი იღებს სრულ იურიდიულ პასუხისმგებლობას ამ ბრენდის IP უფლებების მიმართ."},
      {heading:"მუხლი 3 — პლატფორმის პასუხისმგებლობის შეზღუდვა",body:"ALTERNATIVE არ აგებს პასუხს გამყიდველთა მიერ განთავსებული პროდუქციის ავთენტურობაზე, ხარისხზე ან კანონიერებაზე. პლატფორმა განთავისუფლებულია პასუხისმგებლობისგან \u201Eელექტრონული კომერციის შესახებ\u201C კანონის შესაბამისად, იმ პირობით, რომ: ა) პლატფორმამ არ განახორციელა ჩარევა გამყიდველის კონტენტის შინაარსში; ბ) პლატფორმამ შეტყობინებისთანავე — 48 საათის განმავლობაში — მოახდინა სათანადო რეაქცია. ALTERNATIVE-ს მაქსიმალური პასუხისმგებლობა ნებისმიერ საქმეში შეზღუდულია კონკრეტული ტრანზაქციის საფასურით."},
      {heading:"მუხლი 4 — ანგარიშის შეჩერება",body:"ALTERNATIVE-ს უფლება აქვს დაუყოვნებლივ და შეტყობინების გარეშე შეაჩეროს ან გააუქმოს ნებისმიერი გამყიდველის ანგარიში, თუ: ა) გამოვლინდა ყალბი ან არაორიგინალური პროდუქციის განთავსება; ბ) IP დარღვევის notice მიღებულ იქნა ბრენდისგან ან უფლებამოსილი მხარისგან; გ) ფასი განთავსდა ₾100-ზე ქვემოთ სისტემის გვერდის ავლით; დ) მომხმარებელთა 3 ან მეტი დადასტურებული ჩივილი ავთენტურობასთან დაკავშირებით."},
      {heading:"გამყიდველის დადასტურება",body:"ამ ხელშეკრულების ელექტრონული დადასტურებით გამყიდველი ვალდებულია: 1) განათავსოს მხოლოდ ორიგინალური პროდუქცია; 2) ფლობდეს ბრენდის გამოყენების უფლებამოსილებას; 3) IP დარღვევის შემთხვევაში იღებს სრულ პასუხისმგებლობას; 4) ეთანხმება ₾100 მინიმალურ ფასს; 5) ეთანხმება ALTERNATIVE-ის უფლებას ლისტინგი წაშალოს ან ანგარიში შეაჩეროს; 6) არის სრულწლოვანი და ბიზნეს ოპერაციების სამართლებრივი უფლება აქვს."},
      {heading:"ელექტრონული დადასტურება",body:"საქართველოს სამოქალაქო კოდექსის 327-ე მუხლის მიხედვით, ელექტრონული დადასტურება სრულფასოვანი ხელშეკრულების ფორმაა და სასამართლოში ძალაში შესვლადია. დადასტურებისას ჩაიწერება: seller ID, timestamp (UTC), IP მისამართი და ხელშეკრულების ვერსია."},
    ],
  },
  'ip-policy': {
    label: "იურიდიული",
    title: "ინტელექტუალური საკუთრების პოლიტიკა",
    updated: "მარტი 2026",
    sections: [
      {heading:"ALTERNATIVE-ის პოზიცია",body:"ALTERNATIVE პატივს სცემს ყველა ბრენდის ინტელექტუალური საკუთრების უფლებებს. პლატფორმა ითანამშრომლებს ნებისმიერ ბრენდთან, რომელიც ჩვენთან დაუკავშირდება IP დარღვევის გამოსასწორებლად."},
      {heading:"ნაბიჯი 1 — შეტყობინების მიღება",body:"IP უფლებების მფლობელებმა შეუძლიათ გაგზავნონ takedown notice legal@alternative.ge-ზე. შეტყობინება უნდა შეიცავდეს: ბრენდის სახელს, დარღვევის ლისტინგის URL-ს და IP უფლების საფუძველს."},
      {heading:"ნაბიჯი 2 — დადასტურება (24 საათი)",body:"ALTERNATIVE ადასტურებს takedown notice-ის მიღებას 24 საათის განმავლობაში."},
      {heading:"ნაბიჯი 3 — განხილვა (48 საათი)",body:"მოხსენებილი ლისტინგი გადადის განხილვის სტატუსში 48 საათის განმავლობაში. განხილვის დროს ლისტინგი დამალულია საჯარო მარკეტპლეისიდან და ჩანს როგორც \u201Eდროებით მიუწვდომელი\u201C. ეს 48-საათიანი response window კრიტიკულია safe harbor სტატუსისთვის."},
      {heading:"ნაბიჯი 4 — გამყიდველის პასუხი (72 საათი)",body:"გამყიდველს ეცნობება და ეძლევა 72 საათი ავთენტურობის ან ავტორიზაციის მტკიცებულების წარმოსადგენად სადავო ლისტინგისთვის."},
      {heading:"ნაბიჯი 5 — გადაწყვეტა (120 საათი)",body:"თუ გამყიდველი ვერ წარმოადგენს საკმარის მტკიცებულებას მითითებულ დროში, ლისტინგი სამუდამოდ წაიშლება და ანგარიში შეიძლება შეჩერდეს. მთლიანი პროცესი სრულდება 120 საათში (5 დღე)."},
      {heading:"განმეორებითი დარღვევა",body:"გამყიდველებს, რომლებიც იღებენ რამდენიმე IP takedown notice-ს, შეიძლება სამუდამოდ გაუუქმდეთ ანგარიში. ყველა takedown მოქმედება ჩაიწერება დროის ანაბეჭდებით იურიდიული დოკუმენტაციისთვის."},
      {heading:"კონტაქტი",body:"IP დარღვევის შეტყობინების გასაგზავნად დაგვიკავშირდით: legal@alternative.ge საჭირო დოკუმენტაციით. ზოგადი შეკითხვებისთვის: info@alternative.ge ან +995 555 999 555."},
    ],
  },
};

// ── RUSSIAN CONTENT ──────────────────────────────────────────────────────────
const RU = {
  privacy: {
    label: "Юридическое",
    title: "Политика конфиденциальности",
    updated: "Февраль 2026",
    sections: [
      {heading:"Информация, которую мы собираем",body:"Мы собираем личную информацию, которую вы предоставляете при создании аккаунта, оформлении заказа или обращении к нам. Это включает ваше имя, электронную почту, номер телефона (WhatsApp), адрес доставки и платёжную информацию. Мы также собираем данные о просмотрах через файлы cookie."},
      {heading:"Как мы используем вашу информацию",body:"Ваши персональные данные используются для обработки и доставки заказов, коммуникации через WhatsApp и электронную почту, поддержки клиентов, отправки рекламных материалов (с вашего согласия) и улучшения наших услуг. Мы никогда не продаём ваши данные третьим лицам."},
      {heading:"Обмен данными",body:"Мы делимся вашей информацией только с: нашими проверенными партнёрами (только детали заказа), курьерскими службами в Тбилиси, платёжными процессорами (BOG/TBC) и WhatsApp для коммуникации по заказам."},
      {heading:"Безопасность данных",body:"Мы применяем стандартные меры безопасности для защиты вашей личной информации. Платёжные данные обрабатываются через защищённые, зашифрованные каналы. Мы не храним полные данные карт на наших серверах."},
      {heading:"Ваши права",body:"Вы имеете право в любое время просмотреть, исправить или удалить свои персональные данные. Вы также можете отозвать согласие на маркетинговые коммуникации. Для реализации этих прав свяжитесь с нами: info@alternative.ge."},
      {heading:"Файлы cookie",body:"Мы используем необходимые файлы cookie для функционирования сайта и аналитические cookie для понимания поведения посетителей. Вы можете управлять настройками cookie через настройки браузера."},
      {heading:"Контакт",body:"По вопросам конфиденциальности свяжитесь с нами: info@alternative.ge или WhatsApp: +995 555 999 555."},
    ],
  },
  terms: {
    label: "Юридическое",
    title: "Условия и положения",
    updated: "Февраль 2026",
    sections: [
      {heading:"Общее",body:"Эти Условия и положения регулируют использование Alternative Concept Store (alternative.ge) и любые покупки, совершённые через нашу платформу. Используя наш сайт или оформляя заказ, вы соглашаетесь с этими условиями."},
      {heading:"Модель предзаказа",body:"Alternative работает по модели предзаказа. При оформлении заказа вы оплачиваете полную сумму авансом. Цены указаны в грузинских лари (GEL) и включают сорсинг и проверку качества."},
      {heading:"Подтверждение заказа",body:"После оформления заказа вы получите подтверждение через WhatsApp и электронную почту. Наша команда свяжется с вами в течение 2 часов в рабочее время (Пн–Сб, 10:00–20:00) для подтверждения деталей заказа."},
      {heading:"Видеоверификация",body:"Видеоверификация — это дополнительная услуга (₾28). При выборе ваш товар проверяется нашей командой перед отправкой. Фото- и видеоматериалы отправляются в ваш WhatsApp для утверждения. Отправка производится только после вашего подтверждения."},
      {heading:"Отмена",body:"Вы можете бесплатно отменить заказ в любое время до отправки товара в Грузию. Ваш платёж будет полностью возвращён на исходный способ оплаты в течение 5–7 рабочих дней."},
      {heading:"Интеллектуальная собственность",body:"Весь контент на этом сайте — включая изображения, текст, логотипы и дизайн — является собственностью Alternative Concept Store и не может быть воспроизведён без письменного разрешения."},
      {heading:"Ограничение ответственности",body:"Alternative действует как посредник по сорсингу. Хотя мы проверяем качество продукции, мы не являемся производителем. Наша ответственность ограничена покупной ценой товара. Мы гарантируем качество всех проданных товаров."},
      {heading:"Применимое право",body:"Эти условия регулируются законодательством Грузии. Любые споры разрешаются в судах Тбилиси."},
    ],
  },
  returns: {
    label: "Обслуживание клиентов",
    title: "Возвраты и возмещения",
    updated: "Февраль 2026",
    sections: [
      {heading:"Отмена до отправки",body:"Заказы могут быть отменены бесплатно в любое время до отправки товара в Грузию. Ваш платёж будет полностью возвращён на исходный способ оплаты в течение 5–7 рабочих дней."},
      {heading:"Повреждённые или дефектные товары",body:"Если ваш товар прибыл повреждённым или дефектным, свяжитесь с нами в течение 24 часов после доставки с фотографиями повреждений. Мы организуем полную замену или полный возврат средств, включая стоимость доставки."},
      {heading:"Товар не соответствует описанию",body:"Если товар существенно отличается от описания или фотографий, свяжитесь с нами в течение 24 часов. Мы рассмотрим вашу претензию и предложим замену или полный возврат средств."},
      {heading:"Возврат с видеоверификацией",body:"Если вы выбрали видеоверификацию и отклонили товар, плата за видеоверификацию не возвращается. Однако оплата за товар будет полностью возвращена, или мы можем найти альтернативный товар."},
      {heading:"Процесс возврата средств",body:"Одобренные возвраты обрабатываются в течение 5–7 рабочих дней. Банковские переводы (BOG/TBC) возвращаются на тот же счёт. Платежи картой возвращаются на оригинальную карту. Подтверждение получите через WhatsApp."},
      {heading:"Невозвратные товары",body:"Плата за услугу видеоверификации не возвращается после завершения верификации и отправки материалов. Персонализированные заказы не подлежат возврату, если не дефектные."},
      {heading:"Свяжитесь с нами",body:"Для запросов на возврат свяжитесь: info@alternative.ge или WhatsApp: +995 555 999 555. Пожалуйста, укажите номер заказа и фотографии."},
    ],
  },
  shipping: {
    label: "Обслуживание клиентов",
    title: "Информация о доставке",
    updated: "Февраль 2026",
    sections: [
      {heading:"Зона доставки",body:"В настоящее время мы доставляем по Тбилиси, Грузия. Доставка в другие города скоро будет доступна. Международная доставка пока не осуществляется."},
      {heading:"Сроки доставки",body:"Стандартная доставка занимает 10–18 рабочих дней с момента подтверждения заказа. Предполагаемые сроки указаны на странице каждого товара. Заказы с видеоверификацией могут потребовать 2–3 дополнительных дня."},
      {heading:"Стоимость доставки",body:"Все пошлины и налоги включены в цену товара. Доставка по Тбилиси оплачивается по прибытии в Грузию. Стоимость доставки сообщается до подтверждения заказа."},
      {heading:"Варианты доставки",body:"Доставка на дом — мы доставляем прямо к вашей двери в премиальной брендированной упаковке Alternative. Пункт выдачи — заберите заказ в указанном почтовом отделении. Предпочтительный способ доставки выбирается при оформлении заказа."},
      {heading:"Отслеживание заказа",body:"Вы можете отслеживать статус заказа в любое время через свой аккаунт. Мы также отправляем обновления через WhatsApp на каждом этапе: Забронирован → Сорсинг → Подтверждён → Отправлен → Доставлен."},
      {heading:"Упаковка",body:"Все товары тщательно упакованы в премиальную брендированную упаковку Alternative для безопасной доставки. Товары обёрнуты защитными материалами для предотвращения повреждений при транспортировке."},
      {heading:"Пропущенная доставка",body:"Если вы пропустили попытку доставки, наш курьер свяжется с вами через WhatsApp для перенаzначения. Товары хранятся до 7 дней до возврата на наш склад."},
    ],
  },
  accessibility: {
    label: "Компания",
    title: "Доступность",
    updated: "Февраль 2026",
    sections: [
      {heading:"Наше обязательство",body:"Alternative Concept Store стремится обеспечить цифровую доступность для всех пользователей. Мы постоянно работаем над улучшением пользовательского опыта для каждого."},
      {heading:"Функции доступности",body:"Наш сайт включает: поддержку навигации с клавиатуры, достаточный цветовой контраст, адаптивный дизайн, понятную навигационную структуру, описательный текст для изображений и масштабируемый текст."},
      {heading:"Текущие усилия",body:"Мы регулярно проверяем и обновляем наш сайт для устранения проблем доступности. Наша команда тестирует сайт с помощью вспомогательных технологий."},
      {heading:"Альтернативные способы связи",body:"Если вам сложно пользоваться нашим сайтом, вы можете связаться с нами: WhatsApp +995 555 999 555, email info@alternative.ge, телефон +995 555 999 555. Наша команда доступна Пн–Сб, 10:00–20:00."},
      {heading:"Обратная связь",body:"Мы приветствуем ваши отзывы о доступности нашего сайта. Если вы столкнулись с барьерами или имеете предложения, свяжитесь: info@alternative.ge. Мы ответим в течение 2 рабочих дней."},
    ],
  },
  'seller-agreement': {
    label: "Юридическое",
    title: "Соглашение продавца",
    updated: "Март 2026",
    sections: [
      {heading:"Статья 1 — Статус платформы",body:"ALTERNATIVE («Платформа») является технологическим посредником, позволяющим продавцам размещать продукцию, а покупателям — приобретать её. Платформа не является продавцом, производителем или представителем торговой марки. ALTERNATIVE действует в соответствии со статьями 8 и 9 Закона Грузии «Об электронной коммерции» (2023 г.), который предоставляет освобождение от ответственности провайдерам промежуточных услуг."},
      {heading:"Статья 2 — Обязанности продавцов",body:"Продавец обязан: а) размещать только оригинальную, аутентичную продукцию; б) для продуктов люксовых брендов предоставлять документ, подтверждающий покупку или аутентичность; в) соблюдать минимальную цену ₾100 GEL; г) отвечать на все жалобы клиентов в течение 48 часов; д) использование любого бренда, логотипа или товарного знака в листинге означает, что продавец принимает полную юридическую ответственность за IP-права этого бренда."},
      {heading:"Статья 3 — Ограничение ответственности платформы",body:"ALTERNATIVE не несёт ответственности за аутентичность, качество или законность продукции, размещённой продавцами. Платформа освобождена от ответственности в соответствии с Законом «Об электронной коммерции» при условии, что: а) платформа не вмешивалась в содержание контента продавца; б) платформа отреагировала надлежащим образом в течение 48 часов после получения уведомления."},
      {heading:"Статья 4 — Приостановка аккаунта",body:"ALTERNATIVE вправе немедленно и без уведомления приостановить или аннулировать аккаунт любого продавца, если: а) обнаружено размещение поддельной или неоригинальной продукции; б) получено уведомление о нарушении IP от бренда или уполномоченной стороны; в) цена установлена ниже ₾100 путём обхода системы; г) получены 3 или более подтверждённых жалобы клиентов на аутентичность."},
      {heading:"Подтверждение продавца",body:"Электронным подтверждением данного соглашения продавец обязуется: 1) размещать только оригинальную продукцию; 2) обладать правом на использование бренда; 3) принять полную ответственность в случае нарушения IP; 4) согласиться с минимальной ценой ₾100; 5) согласиться с правом ALTERNATIVE удалять листинги или приостанавливать аккаунты; 6) быть совершеннолетним и иметь законное право на ведение бизнеса."},
      {heading:"Электронное подтверждение",body:"Согласно статье 327 Гражданского кодекса Грузии, электронное подтверждение является полноценной формой договора и подлежит исполнению в суде. При подтверждении фиксируется: ID продавца, временная метка (UTC), IP-адрес и версия соглашения."},
    ],
  },
  'ip-policy': {
    label: "Юридическое",
    title: "Политика интеллектуальной собственности",
    updated: "Март 2026",
    sections: [
      {heading:"Наша позиция",body:"ALTERNATIVE уважает права интеллектуальной собственности всех брендов и сотрудничает с любым брендом, обратившимся к нам по поводу нарушения IP."},
      {heading:"Шаг 1 — Получение уведомления",body:"Правообладатели IP могут отправить уведомление о снятии (takedown notice) на legal@alternative.ge. Уведомление должно содержать: название бренда, URL нарушающего листинга и основание IP-права."},
      {heading:"Шаг 2 — Подтверждение (24 часа)",body:"ALTERNATIVE подтвердит получение уведомления о снятии в течение 24 часов."},
      {heading:"Шаг 3 — Проверка (48 часов)",body:"Указанный листинг будет помещён на проверку в течение 48 часов. Во время проверки листинг скрыт от публичного маркетплейса и отображается как «временно недоступен». Это 48-часовое окно ответа критически важно для поддержания статуса safe harbor."},
      {heading:"Шаг 4 — Ответ продавца (72 часа)",body:"Продавец уведомляется и получает 72 часа для предоставления доказательств аутентичности или авторизации для спорного листинга."},
      {heading:"Шаг 5 — Решение (120 часов)",body:"Если продавец не предоставит достаточных доказательств в отведённое время, листинг будет окончательно удалён, а аккаунт может быть приостановлен. Весь процесс завершается в течение 120 часов (5 дней)."},
      {heading:"Повторные нарушения",body:"Продавцы, получающие множественные IP takedown notice, могут быть окончательно заблокированы. Все действия по takedown фиксируются с временными метками для юридической документации."},
      {heading:"Контакт",body:"Для отправки уведомления о нарушении IP свяжитесь: legal@alternative.ge с необходимой документацией. Общие вопросы: info@alternative.ge или +995 555 999 555."},
    ],
  },
};

// ── LANGUAGE MAP ─────────────────────────────────────────────────────────────
const CONTENT_BY_LANG = { en: EN, ka: KA, ru: RU };

// ── LEGAL PAGE ───────────────────────────────────────────────────────────────
export default function LegalPage({type, setPage, L, lang, mobile}) {
  const langContent = CONTENT_BY_LANG[lang] || CONTENT_BY_LANG.en;
  const content = langContent[type] || EN[type] || EN.privacy;
  const px = mobile ? "16px" : "40px";

  return (
    <div style={{paddingTop:mobile?78:104,background:C.cream}}>
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
              {lang === 'ka' ? <>კითხვები? დაგვიკავშირდით <strong>info@alternative.ge</strong> ან WhatsApp: <strong>+995 555 999 555</strong></> :
               lang === 'ru' ? <>Вопросы? Свяжитесь с нами: <strong>info@alternative.ge</strong> или WhatsApp: <strong>+995 555 999 555</strong></> :
               <>Questions? Contact us at <strong>info@alternative.ge</strong> or via WhatsApp at <strong>+995 555 999 555</strong></>}
            </p>
          </div>
        </div>
      </div>

      <Footer setPage={setPage} L={L} mobile={mobile}/>
    </div>
  );
}
