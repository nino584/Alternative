import { useState, useRef, useEffect } from 'react';
import { C, T } from '../../constants/theme.js';
import { PRODUCTS } from '../../constants/data.js';

// ── AI PERSONAL STYLIST CHAT ─────────────────────────────────────────────────
// Rule-based conversational stylist. No external API needed.

const OCCASIONS = {
  casual:   { en:"Casual / Everyday",   ka:"ყოველდღიური",         ru:"Повседневный" },
  business: { en:"Business / Meeting",   ka:"ბიზნეს / შეხვედრა",  ru:"Деловой / Встреча" },
  evening:  { en:"Evening / Party",      ka:"საღამო / წვეულება",   ru:"Вечерний / Вечеринка" },
  travel:   { en:"Travel / Weekend",     ka:"მოგზაურობა / დასვენება", ru:"Путешествие / Выходные" },
};

// Map occasion → preferred categories
const OCCASION_CATS = {
  casual:   ["Shoes","Bags","Accessories"],
  business: ["Clothing","Bags","Watches"],
  evening:  ["Clothing","Bags","Accessories"],
  travel:   ["Bags","Shoes","Clothing"],
};

function getRecommendations(occasion, section) {
  const cats = OCCASION_CATS[occasion] || ["Bags","Shoes","Clothing"];
  const pool = PRODUCTS.filter(p => !section || p.section === section);
  const picks = [];
  const used = new Set();
  for (const cat of cats) {
    if (picks.length >= 3) break;
    const c = pool.filter(x => x.cat === cat && !used.has(x.id));
    if (c.length > 0) {
      const pick = c[Math.floor(Math.random() * c.length)];
      picks.push(pick);
      used.add(pick.id);
    }
  }
  return picks;
}

function getTrackingInfo(orders) {
  if (!orders || orders.length === 0) return null;
  return orders;
}

// Chat translations
const CT = {
  en: {
    greeting: "Hi! 👋 I'm your Alternative stylist. How can I help you today?",
    styleMe: "💃 Style me",
    trackOrder: "📦 Track order",
    askQuestion: "❓ Ask a question",
    occasionAsk: "Where are you headed? Pick an occasion and I'll suggest the perfect look:",
    casualBtn: "🌿 Casual",
    businessBtn: "💼 Business",
    eveningBtn: "🌙 Evening",
    travelBtn: "✈️ Travel",
    sectionAsk: "Who are we styling?",
    womenBtn: "Womenswear",
    menBtn: "Menswear",
    kidsBtn: "Kidswear",
    allBtn: "All",
    hereIsLook: "Here's what I'd put together for you:",
    tryAnother: "🔄 Try another look",
    styleSomethingElse: "💃 Style again",
    viewProduct: "View →",
    totalLook: "Total look:",
    trackAsk: "Let me check your orders...",
    noOrders: "I don't see any orders yet. Once you place an order, I can track it for you here! Would you like to browse the collection?",
    browseCollection: "🛍️ Browse collection",
    orderStatus: "Order",
    statusLabel: "Status:",
    faqPrompt: "What would you like to know?",
    faqShipping: "📦 Shipping & Delivery",
    faqReturns: "↩️ Returns",
    faqPayment: "💳 Payment",
    faqSizing: "📏 Sizing",
    faqOther: "💬 Something else",
    answerShipping: "We deliver to Tbilisi in 10–18 days. Items are sourced from verified suppliers in Europe and shipped directly to Georgia. You'll get status updates at every step.",
    answerReturns: "Free cancellation before shipping — full refund guaranteed. If the item arrives damaged or not as described, return within 24 hours of delivery for a full refund. Contact us to start a return.",
    answerPayment: "We accept bank transfers (BOG/TBC), card payments (Visa/Mastercard), and cryptocurrency (BTC/ETH/USDT). Payment details are sent via WhatsApp after order confirmation.",
    answerSizing: "Each product page has a Size & Fit guide. Generally: order your usual size. Leather items stretch slightly with wear. If between sizes, size up for comfort.",
    handoffMsg: "Great question! Let me connect you with our team for a detailed answer.",
    handoffContact: "📧 info@alternative.ge\n📞 +995 555 999 555\n🕐 Mon–Sat 10:00–20:00",
    handoffNote: "We'll get back to you very soon!",
    typeMessage: "Type a message...",
    poweredBy: "AI Stylist",
    backToMenu: "← Back to menu",
    uploadPhoto: "📷 Upload a photo",
    photoAnalysis: "Nice style! Based on what I see, here are some pieces that would complement your look:",
  },
  ka: {
    greeting: "გამარჯობა! 👋 მე ვარ Alternative-ის სტილისტი. როგორ დაგეხმარო?",
    styleMe: "💃 სტილის შერჩევა",
    trackOrder: "📦 შეკვეთის თრექინგი",
    askQuestion: "❓ შეკითხვა",
    occasionAsk: "სად მიდიხარ? აირჩიე შემთხვევა და შენთვის look-ს შევარჩევ:",
    casualBtn: "🌿 ყოველდღიური",
    businessBtn: "💼 ბიზნესი",
    eveningBtn: "🌙 საღამო",
    travelBtn: "✈️ მოგზაურობა",
    sectionAsk: "ვის ვარჩევთ სტილს?",
    womenBtn: "ქალი",
    menBtn: "კაცი",
    kidsBtn: "ბავშვი",
    allBtn: "ყველა",
    hereIsLook: "აი რას შეგირჩევდი:",
    tryAnother: "🔄 სხვა ვარიანტი",
    styleSomethingElse: "💃 თავიდან",
    viewProduct: "ნახვა →",
    totalLook: "სრული look:",
    trackAsk: "ვამოწმებ შენს შეკვეთებს...",
    noOrders: "ჯერ შეკვეთები არ გაქვს. როცა შეკვეთას გააფორმებ, აქ შეძლებ თრექინგს! გინდა კოლექცია ნახო?",
    browseCollection: "🛍️ კოლექცია",
    orderStatus: "შეკვეთა",
    statusLabel: "სტატუსი:",
    faqPrompt: "რა გაინტერესებს?",
    faqShipping: "📦 მიწოდება",
    faqReturns: "↩️ დაბრუნება",
    faqPayment: "💳 გადახდა",
    faqSizing: "📏 ზომები",
    faqOther: "💬 სხვა",
    answerShipping: "თბილისში მიწოდება 10–18 დღეში. ნივთები ევროპის ვერიფიცირებული მომწოდებლებიდან მოდის. ყოველ ეტაპზე სტატუსის განახლებას მიიღებ.",
    answerReturns: "უფასო გაუქმება გაგზავნამდე — სრული თანხის დაბრუნება. თუ ნივთი დაზიანებულია ან აღწერას არ ემთხვევა — 24 საათში დაბრუნება სრული რეფანდით.",
    answerPayment: "ვიღებთ საბანკო გადარიცხვას (BOG/TBC), ბარათს (Visa/Mastercard) და კრიპტოვალუტას (BTC/ETH/USDT). გადახდის დეტალებს WhatsApp-ზე მიიღებ.",
    answerSizing: "ყოველ პროდუქტის გვერდზე Size & Fit გაიდი არის. ზოგადად: შენი ჩვეული ზომა შეუკვეთე. ტყავის ნივთები ოდნავ იჭიმება.",
    handoffMsg: "კარგი შეკითხვაა! ამაზე ჩვენი გუნდი უკეთ გიპასუხებს.",
    handoffContact: "📧 info@alternative.ge\n📞 +995 555 999 555\n🕐 ორშ–შაბ 10:00–20:00",
    handoffNote: "ძალიან მალე გიპასუხებთ!",
    typeMessage: "დაწერე შეტყობინება...",
    poweredBy: "AI სტილისტი",
    backToMenu: "← მენიუ",
    uploadPhoto: "📷 ფოტოს ატვირთვა",
    photoAnalysis: "მაგარი სტილი! აი რა შეგიწყობდა ხელს:",
  },
  ru: {
    greeting: "Привет! 👋 Я стилист Alternative. Чем могу помочь?",
    styleMe: "💃 Подобрать стиль",
    trackOrder: "📦 Отследить заказ",
    askQuestion: "❓ Задать вопрос",
    occasionAsk: "Куда собираетесь? Выберите случай — подберу идеальный образ:",
    casualBtn: "🌿 Повседневный",
    businessBtn: "💼 Деловой",
    eveningBtn: "🌙 Вечерний",
    travelBtn: "✈️ Путешествие",
    sectionAsk: "Для кого подбираем?",
    womenBtn: "Женщина",
    menBtn: "Мужчина",
    kidsBtn: "Ребёнок",
    allBtn: "Все",
    hereIsLook: "Вот что я бы подобрал(а) для вас:",
    tryAnother: "🔄 Другой вариант",
    styleSomethingElse: "💃 Заново",
    viewProduct: "Смотреть →",
    totalLook: "Весь образ:",
    trackAsk: "Проверяю ваши заказы...",
    noOrders: "Пока заказов нет. Когда оформите заказ, здесь можно будет отследить! Хотите посмотреть коллекцию?",
    browseCollection: "🛍️ Коллекция",
    orderStatus: "Заказ",
    statusLabel: "Статус:",
    faqPrompt: "Что хотите узнать?",
    faqShipping: "📦 Доставка",
    faqReturns: "↩️ Возврат",
    faqPayment: "💳 Оплата",
    faqSizing: "📏 Размеры",
    faqOther: "💬 Другое",
    answerShipping: "Доставка в Тбилиси за 10–18 дней. Вещи от проверенных поставщиков из Европы. На каждом этапе — обновление статуса.",
    answerReturns: "Бесплатная отмена до отправки — полный возврат. Если товар повреждён или не соответствует описанию — возврат в течение 24 часов после получения.",
    answerPayment: "Принимаем банковский перевод (BOG/TBC), карты (Visa/Mastercard) и криптовалюту (BTC/ETH/USDT). Реквизиты придут в WhatsApp.",
    answerSizing: "На каждой странице есть гид по размерам. В целом: заказывайте свой обычный размер. Кожа немного растягивается.",
    handoffMsg: "Хороший вопрос! На него лучше ответит наша команда.",
    handoffContact: "📧 info@alternative.ge\n📞 +995 555 999 555\n🕐 Пн–Сб 10:00–20:00",
    handoffNote: "Мы ответим очень скоро!",
    typeMessage: "Напишите сообщение...",
    poweredBy: "AI Стилист",
    backToMenu: "← Меню",
    uploadPhoto: "📷 Загрузить фото",
    photoAnalysis: "Отличный стиль! Вот что отлично дополнит ваш образ:",
  },
};

// ── COMPONENT ────────────────────────────────────────────────────────────────
export default function StylistChat({ mobile, lang, setPage, L }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [flow, setFlow] = useState(null); // null | "style" | "track" | "faq"
  const [styleSection, setStyleSection] = useState(null);
  const chatRef = useRef(null);
  const fileRef = useRef(null);

  const t = CT[lang] || CT.en;

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, typing]);

  // Greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      addBot(t.greeting, [
        { label: t.styleMe, action: "style" },
        { label: t.trackOrder, action: "track" },
        { label: t.askQuestion, action: "faq" },
      ]);
    }
  }, [open]);

  function addBot(text, buttons, products) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: "bot", text, buttons, products }]);
    }, 600 + Math.random() * 400);
  }

  function addUser(text) {
    setMessages(prev => [...prev, { from: "user", text }]);
  }

  function resetToMenu() {
    setFlow(null);
    setStyleSection(null);
    addBot(t.greeting, [
      { label: t.styleMe, action: "style" },
      { label: t.trackOrder, action: "track" },
      { label: t.askQuestion, action: "faq" },
    ]);
  }

  function handleAction(action) {
    if (action === "style") {
      addUser(t.styleMe);
      setFlow("style");
      addBot(t.sectionAsk, [
        { label: t.womenBtn, action: "sec_Womenswear" },
        { label: t.menBtn, action: "sec_Menswear" },
        { label: t.kidsBtn, action: "sec_Kidswear" },
        { label: t.allBtn, action: "sec_all" },
      ]);
    } else if (action.startsWith("sec_")) {
      const sec = action === "sec_all" ? null : action.replace("sec_", "");
      setStyleSection(sec);
      addUser(sec || t.allBtn);
      addBot(t.occasionAsk, [
        { label: t.casualBtn, action: "occ_casual" },
        { label: t.businessBtn, action: "occ_business" },
        { label: t.eveningBtn, action: "occ_evening" },
        { label: t.travelBtn, action: "occ_travel" },
      ]);
    } else if (action.startsWith("occ_")) {
      const occ = action.replace("occ_", "");
      addUser(OCCASIONS[occ]?.[lang] || occ);
      const recs = getRecommendations(occ, styleSection);
      const total = recs.reduce((s, p) => s + (p.sale || p.price), 0);
      addBot(t.hereIsLook, [
        { label: t.tryAnother, action: "occ_" + occ },
        { label: t.styleSomethingElse, action: "style" },
        { label: t.backToMenu, action: "menu" },
      ], recs);
    } else if (action === "track") {
      addUser(t.trackOrder);
      setFlow("track");
      const stored = JSON.parse(localStorage.getItem("alternative_orders") || "[]");
      if (stored.length === 0) {
        addBot(t.noOrders, [
          { label: t.browseCollection, action: "browse" },
          { label: t.backToMenu, action: "menu" },
        ]);
      } else {
        const lines = stored.map((o, i) =>
          `${t.orderStatus} #${o.orderId || i + 1}: ${L?.localNames?.[o.items?.[0]?.name] || o.items?.[0]?.name || "Item"} — ${o.status || "Processing"}`
        ).join("\n");
        addBot(t.trackAsk + "\n\n" + lines, [
          { label: t.backToMenu, action: "menu" },
        ]);
      }
    } else if (action === "faq") {
      addUser(t.askQuestion);
      setFlow("faq");
      addBot(t.faqPrompt, [
        { label: t.faqShipping, action: "ans_shipping" },
        { label: t.faqReturns, action: "ans_returns" },
        { label: t.faqPayment, action: "ans_payment" },
        { label: t.faqSizing, action: "ans_sizing" },
        { label: t.faqOther, action: "handoff" },
      ]);
    } else if (action === "ans_shipping") {
      addUser(t.faqShipping);
      addBot(t.answerShipping, [
        { label: t.askQuestion, action: "faq" },
        { label: t.backToMenu, action: "menu" },
      ]);
    } else if (action === "ans_returns") {
      addUser(t.faqReturns);
      addBot(t.answerReturns, [
        { label: t.askQuestion, action: "faq" },
        { label: t.backToMenu, action: "menu" },
      ]);
    } else if (action === "ans_payment") {
      addUser(t.faqPayment);
      addBot(t.answerPayment, [
        { label: t.askQuestion, action: "faq" },
        { label: t.backToMenu, action: "menu" },
      ]);
    } else if (action === "ans_sizing") {
      addUser(t.faqSizing);
      addBot(t.answerSizing, [
        { label: t.askQuestion, action: "faq" },
        { label: t.backToMenu, action: "menu" },
      ]);
    } else if (action === "handoff") {
      addUser(t.faqOther);
      addBot(t.handoffMsg + "\n\n" + t.handoffContact + "\n\n" + t.handoffNote, [
        { label: t.backToMenu, action: "menu" },
      ]);
    } else if (action === "browse") {
      setOpen(false);
      setPage("catalog");
    } else if (action === "menu") {
      resetToMenu();
    } else if (action === "upload") {
      fileRef.current?.click();
    }
  }

  function handleSend() {
    if (!input.trim()) return;
    const msg = input.trim();
    setInput("");
    addUser(msg);
    // Simple keyword matching
    const low = msg.toLowerCase();
    if (low.includes("track") || low.includes("order") || low.includes("შეკვეთ") || low.includes("заказ")) {
      handleAction("track");
    } else if (low.includes("return") || low.includes("refund") || low.includes("დაბრუნ") || low.includes("возврат")) {
      handleAction("ans_returns");
    } else if (low.includes("ship") || low.includes("deliver") || low.includes("მიწოდ") || low.includes("доставк")) {
      handleAction("ans_shipping");
    } else if (low.includes("pay") || low.includes("გადახდ") || low.includes("оплат")) {
      handleAction("ans_payment");
    } else if (low.includes("size") || low.includes("ზომ") || low.includes("размер")) {
      handleAction("ans_sizing");
    } else if (low.includes("style") || low.includes("outfit") || low.includes("look") || low.includes("სტილ") || low.includes("стиль") || low.includes("wear")) {
      handleAction("style");
    } else {
      // Handoff for unknown questions
      addBot(t.handoffMsg + "\n\n" + t.handoffContact + "\n\n" + t.handoffNote, [
        { label: t.backToMenu, action: "menu" },
      ]);
    }
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    addUser("📷 " + file.name);
    // Recommend random items as "matching"
    const recs = getRecommendations("casual", null);
    addBot(t.photoAnalysis, [
      { label: t.tryAnother, action: "style" },
      { label: t.backToMenu, action: "menu" },
    ], recs);
    e.target.value = "";
  }

  function goToProduct(product) {
    setOpen(false);
    setPage("product", product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── STYLES ──
  const chatWindow = {
    position: "fixed", bottom: mobile ? 0 : 100, right: mobile ? 0 : 32,
    width: mobile ? "100%" : 380, height: mobile ? "100%" : 560,
    background: C.cream, borderRadius: mobile ? 0 : 16,
    boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
    display: "flex", flexDirection: "column", zIndex: 1001,
    overflow: "hidden", border: mobile ? "none" : `1px solid rgba(168,162,150,0.15)`,
  };

  return (
    <>
      {/* ── CHAT BUBBLE ── */}
      <button onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: mobile ? 16 : 32, right: mobile ? 16 : 32,
          zIndex: 1000, width: 56, height: 56, borderRadius: "50%",
          background: C.black, border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          cursor: "pointer", transition: "transform 0.2s",
        }}>
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="1.5">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
            <circle cx="12" cy="12" r="1" fill={C.white}/>
            <circle cx="8" cy="12" r="1" fill={C.white}/>
            <circle cx="16" cy="12" r="1" fill={C.white}/>
          </svg>
        )}
      </button>

      {/* ── CHAT WINDOW ── */}
      {open && (
        <div style={chatWindow}>
          {/* Header */}
          <div style={{
            padding: "16px 20px", background: C.black,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(177,154,122,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ ...T.label, color: C.white, fontSize: 12, marginBottom: 1 }}>Alternative</p>
              <p style={{ ...T.labelSm, color: C.tan, fontSize: 10, letterSpacing: "0.1em" }}>{t.poweredBy}</p>
            </div>
            {mobile && (
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>

          {/* Messages */}
          <div ref={chatRef} style={{
            flex: 1, overflowY: "auto", padding: "16px",
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.from === "user" ? "flex-end" : "flex-start", gap: 6 }}>
                {/* Message bubble */}
                <div style={{
                  maxWidth: "85%", padding: "10px 14px",
                  background: msg.from === "user" ? C.black : C.white,
                  color: msg.from === "user" ? C.white : C.black,
                  borderRadius: msg.from === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  ...T.bodySm, fontSize: 13, lineHeight: 1.6,
                  whiteSpace: "pre-line",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}>
                  {msg.text}
                </div>

                {/* Product cards */}
                {msg.products && msg.products.length > 0 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxWidth: "90%" }}>
                    {msg.products.map(p => (
                      <div key={p.id} onClick={() => goToProduct(p)}
                        style={{
                          width: 100, cursor: "pointer", background: C.white,
                          borderRadius: 8, overflow: "hidden",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                          transition: "transform 0.2s",
                        }}>
                        <img src={p.img} alt={p.name} loading="lazy" width="100" height="90" style={{ width: "100%", height: 90, objectFit: "cover" }} />
                        <div style={{ padding: "6px 8px" }}>
                          <p style={{ ...T.labelSm, color: C.tan, fontSize: 9, letterSpacing: "0.08em" }}>{p.brand}</p>
                          <p style={{ ...T.bodySm, color: C.black, fontSize: 9, lineHeight: 1.2, marginBottom: 2 }}>
                            {L?.localNames?.[p.name] || p.name}
                          </p>
                          <p style={{ fontFamily: "'Alido',serif", fontSize: 10, color: p.sale ? C.red : C.black }}>
                            GEL {p.sale || p.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick reply buttons */}
                {msg.buttons && msg.buttons.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", maxWidth: "90%" }}>
                    {msg.buttons.map((btn, j) => (
                      <button key={j} onClick={() => handleAction(btn.action)}
                        style={{
                          padding: "7px 14px", border: `1px solid ${C.lgray}`,
                          borderRadius: 20, background: C.white, color: C.black,
                          ...T.labelSm, fontSize: 10, cursor: "pointer",
                          transition: "all 0.15s", whiteSpace: "nowrap",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.black; e.currentTarget.style.color = C.white; e.currentTarget.style.borderColor = C.black; }}
                        onMouseLeave={e => { e.currentTarget.style.background = C.white; e.currentTarget.style.color = C.black; e.currentTarget.style.borderColor = C.lgray; }}>
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div style={{ display: "flex", gap: 4, padding: "10px 14px", background: C.white, borderRadius: "14px 14px 14px 4px", width: "fit-content", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: "50%", background: C.lgray,
                    animation: `typingDot 1.2s infinite ${i * 0.2}s`,
                  }} />
                ))}
              </div>
            )}
          </div>

          {/* Input area */}
          <div style={{
            padding: "12px 16px", borderTop: `1px solid rgba(168,162,150,0.12)`,
            background: C.white, display: "flex", gap: 8, alignItems: "center",
          }}>
            <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
            <button onClick={() => fileRef.current?.click()}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.lgray} strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </button>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
              placeholder={t.typeMessage}
              style={{
                flex: 1, padding: "10px 0", border: "none", outline: "none",
                ...T.body, fontSize: 13, color: C.black, background: "transparent",
              }} />
            <button onClick={handleSend}
              style={{
                background: input.trim() ? C.black : "transparent",
                border: "none", cursor: input.trim() ? "pointer" : "default",
                width: 32, height: 32, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s", flexShrink: 0,
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={input.trim() ? C.white : C.lgray} strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>

          {/* Typing animation CSS */}
          <style>{`
            @keyframes typingDot {
              0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
              30% { opacity: 1; transform: translateY(-3px); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
