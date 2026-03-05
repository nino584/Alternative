import { useState, useRef } from 'react';
import { C, T } from '../constants/theme.js';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import Footer from '../components/layout/Footer.jsx';
import { api } from '../api.js';

export default function BecomeSupplierPage({ setPage, L, mobile }) {
  const px = mobile ? "16px" : "40px";
  const formRef = useRef(null);
  const [form, setForm] = useState({
    companyName: '', contactName: '', email: '', phone: '',
    description: '', instagram: '', website: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!form.companyName.trim() || !form.contactName.trim() || !form.email.trim() || !form.phone.trim()) {
      setError(L?.supFillAll || 'შეავსეთ ყველა სავალდებულო ველი');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError(L?.supInvalidEmail || 'მიუთითეთ სწორი ელ-ფოსტა');
      return;
    }
    if (form.description.trim().length < 10) {
      setError(L?.supDescriptionMin || 'აღწერა მინიმუმ 10 სიმბოლო');
      return;
    }

    setError('');
    setLoading(true);

    api.applySupplier({
      companyName: form.companyName.trim(),
      contactName: form.contactName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      description: form.description.trim(),
      instagram: form.instagram.trim(),
      website: form.website.trim(),
    })
      .then(() => setSuccess(true))
      .catch(err => setError(err.message || L?.supSubmitError || 'შეცდომა. სცადეთ ხელახლა.'))
      .finally(() => setLoading(false));
  };

  const inputStyle = {
    width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.06)",
    border: `1px solid rgba(177,154,122,0.3)`, color: C.white, fontSize: 14,
    fontFamily: "'TT Interphases Pro',sans-serif", outline: "none",
    transition: "border 0.2s",
  };

  const labelStyle = { ...T.labelSm, fontSize: 10, color: C.tan, display: "block", marginBottom: 8, letterSpacing: "0.12em" };

  return (
    <div style={{ background: C.black, minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ padding: `${mobile ? 60 : 100}px ${px} 60px`, textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <p style={{ ...T.labelSm, fontSize: 10, color: C.tan, letterSpacing: "0.2em", marginBottom: 16 }}>
          {L?.supPreTitle || "MARKETPLACE"}
        </p>
        <h1 style={{ ...T.displayLg, color: C.white, fontSize: mobile ? 28 : 42, marginBottom: 20 }}>
          {L?.supHero || "გახდი ALTERNATIVE-ის მომწოდებელი"}
        </h1>
        <p style={{ ...T.body, color: "rgba(255,255,255,0.6)", fontSize: mobile ? 14 : 16, maxWidth: 550, margin: "0 auto", lineHeight: 1.7 }}>
          {L?.supHeroSub || "შემოუერთდი საქართველოს პრემიუმ მოდის მარკეტპლეისს. გაყიდე შენი პროდუქცია პრე-ორდერის მოდელით — ინვენტარის რისკი არ არის."}
        </p>
      </section>

      {/* Benefits */}
      <section style={{ padding: `40px ${px} 60px`, maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: 20 }}>
          {[
            { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>, title: L?.supBenefit1Title || "პრემიუმ აუდიტორია", desc: L?.supBenefit1Desc || "მიიღე წვდომა Alternative-ის მაღალი ხარისხის მომხმარებლებთან, რომლებიც ეძებენ ექსკლუზიურ პროდუქციას." },
            { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>, title: L?.supBenefit2Title || "პრე-ორდერის მოდელი", desc: L?.supBenefit2Desc || "არ გჭირდება ინვენტარის შენახვა. პროდუქტი იყიდება მანამ, სანამ მომხმარებელი შეკვეთას გააფორმებს." },
            { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>, title: L?.supBenefit3Title || "სრული დეშბორდი", desc: L?.supBenefit3Desc || "თვალყური ადევნე გაყიდვებს, შემოსავალს და პროდუქტებს პერსონალური პანელიდან." },
          ].map((b, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", padding: 28, border: `1px solid rgba(177,154,122,0.15)` }}>
              <div style={{ marginBottom: 14 }}>{b.icon}</div>
              <h3 style={{ ...T.label, color: C.white, fontSize: 14, marginBottom: 10 }}>{b.title}</h3>
              <p style={{ ...T.bodySm, color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: `40px ${px} 60px`, maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ ...T.displaySm, color: C.white, fontSize: mobile ? 22 : 28, textAlign: "center", marginBottom: 40 }}>
          {L?.supHowTitle || "როგორ მუშაობს"}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 20 }}>
          {[
            { step: "01", title: L?.supStep1Title || "გააგზავნე განაცხადი", desc: L?.supStep1Desc || "შეავსე ქვემოთ მოცემული ფორმა შენი კომპანიის ინფორმაციით." },
            { step: "02", title: L?.supStep2Title || "დამტკიცება", desc: L?.supStep2Desc || "ჩვენი გუნდი განიხილავს განაცხადს და დაგიკავშირდება." },
            { step: "03", title: L?.supStep3Title || "დაამატე პროდუქტები", desc: L?.supStep3Desc || "შედი Master Panel-ში და დაამატე შენი პროდუქცია." },
            { step: "04", title: L?.supStep4Title || "გამოიმუშავე", desc: L?.supStep4Desc || "მიიღე შემოსავალი ყოველი გაყიდული პროდუქტიდან." },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 16, padding: 20, background: "rgba(255,255,255,0.02)" }}>
              <div style={{ ...T.displaySm, color: C.tan, fontSize: 24, minWidth: 36 }}>{s.step}</div>
              <div>
                <h4 style={{ ...T.label, color: C.white, fontSize: 13, marginBottom: 6 }}>{s.title}</h4>
                <p style={{ ...T.bodySm, color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section ref={formRef} style={{ padding: `60px ${px} 80px`, maxWidth: 600, margin: "0 auto" }}>
        <h2 style={{ ...T.displaySm, color: C.white, fontSize: mobile ? 22 : 28, textAlign: "center", marginBottom: 12 }}>
          {L?.supFormTitle || "განაცხადის ფორმა"}
        </h2>
        <p style={{ ...T.bodySm, color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 32 }}>
          {L?.supFormSub || "შეავსე ინფორმაცია და გამოგვიგზავნე"}
        </p>

        {success ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(46,125,50,0.08)", border: `1px solid rgba(46,125,50,0.3)` }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
            <h3 style={{ ...T.heading, color: C.white, fontSize: 20, marginBottom: 12 }}>
              {L?.supSuccess || "განაცხადი წარმატებით გაიგზავნა!"}
            </h3>
            <p style={{ ...T.bodySm, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
              {L?.supSuccessSub || "ჩვენი გუნდი განიხილავს თქვენს განაცხადს და მალე დაგიკავშირდებათ. დამტკიცების შემდეგ მიიღებთ წვდომას Master Panel-ზე."}
            </p>
          </div>
        ) : (
          <div>
            {error && (
              <div style={{ padding: "12px 16px", background: "rgba(198,40,40,0.1)", border: `1px solid rgba(198,40,40,0.3)`, marginBottom: 20 }}>
                <p style={{ ...T.bodySm, color: "#e57373", fontSize: 13 }}>{error}</p>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>{L?.supLabelCompany || "კომპანიის სახელი"} *</label>
                <input value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{L?.supLabelContact || "საკონტაქტო პირი"} *</label>
                <input value={form.contactName} onChange={e => setForm(p => ({ ...p, contactName: e.target.value }))} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>{L?.supLabelEmail || "ელ-ფოსტა"} *</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{L?.supLabelPhone || "ტელეფონი"} *</label>
                <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>{L?.supLabelInsta || "Instagram"} <span style={{ opacity: 0.5, fontWeight: 300 }}>({L?.supOptionalHint || "if available"})</span></label>
                <input value={form.instagram} onChange={e => setForm(p => ({ ...p, instagram: e.target.value }))} style={inputStyle} placeholder="@username" />
              </div>
              <div>
                <label style={labelStyle}>{L?.supLabelWebsite || "ვებსაიტი"} <span style={{ opacity: 0.5, fontWeight: 300 }}>({L?.supOptionalHint || "if available"})</span></label>
                <input value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} style={inputStyle} placeholder="https://" />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>{L?.supLabelDesc || "აღწერა"} *</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4}
                style={{ ...inputStyle, resize: "vertical" }} placeholder={L?.supDescPlaceholder || "მოგვიყევით თქვენი ბიზნესის შესახებ..."} />
            </div>

            <HoverBtn onClick={handleSubmit} variant="shimmer" style={{ width: "100%", padding: "16px" }} disabled={loading}>
              {loading ? (
                <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spinAnim 0.7s linear infinite" }} />
              ) : (L?.supSubmitBtn || "განაცხადის გაგზავნა")}
            </HoverBtn>
          </div>
        )}
      </section>

      <Footer setPage={setPage} L={L} mobile={mobile} />
    </div>
  );
}
