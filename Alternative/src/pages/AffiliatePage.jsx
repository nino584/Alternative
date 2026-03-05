import { useState, useRef } from 'react';
import { C, T } from '../constants/theme.js';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import Footer from '../components/layout/Footer.jsx';
import SEO from '../components/SEO.jsx';
import { api } from '../api.js';

const NICHES = [
  { value: '', label: '' },
  { value: 'fashion', label: 'Fashion / მოდა' },
  { value: 'beauty', label: 'Beauty / სილამაზე' },
  { value: 'lifestyle', label: 'Lifestyle / ცხოვრების სტილი' },
  { value: 'fitness', label: 'Fitness / ფიტნესი' },
  { value: 'travel', label: 'Travel / მოგზაურობა' },
  { value: 'luxury', label: 'Luxury / ლუქსი' },
  { value: 'other', label: 'Other / სხვა' },
];

const AUDIENCE_SIZES = [
  { value: '', label: '' },
  { value: '1k-5k', label: '1K – 5K' },
  { value: '5k-10k', label: '5K – 10K' },
  { value: '10k-50k', label: '10K – 50K' },
  { value: '50k-100k', label: '50K – 100K' },
  { value: '100k+', label: '100K+' },
];

export default function AffiliatePage({ setPage, L, mobile }) {
  const px = mobile ? "16px" : "40px";
  const formRef = useRef(null);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    instagram: '', tiktok: '',
    niche: '', audienceSize: '',
    code: '', description: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.code.trim()) {
      setError(L.affFillAll || 'შეავსეთ ყველა სავალდებულო ველი');
      return;
    }
    if (!form.instagram.trim() && !form.tiktok.trim()) {
      setError(L.affNeedSocial || 'მიუთითეთ მინიმუმ ერთი სოციალური ქსელი');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError(L.validEmail || 'შეიყვანეთ სწორი ელ.ფოსტა');
      return;
    }
    if (!/^[A-Za-z0-9_]+$/.test(form.code)) {
      setError(L.affCodeAlphanumeric || 'კოდი უნდა შეიცავდეს მხოლოდ ასოებს, ციფრებს და _');
      return;
    }
    setLoading(true);
    setError('');
    // Combine name for backend compatibility
    const payload = {
      name: `${form.firstName.trim()} ${form.lastName.trim()}`,
      email: form.email.trim(),
      instagram: form.instagram.trim(),
      tiktok: form.tiktok.trim(),
      niche: form.niche,
      audienceSize: form.audienceSize,
      code: form.code.trim(),
      description: form.description.trim(),
    };
    api.applyAffiliate(payload)
      .then(() => setSuccess(true))
      .catch(err => setError(err.message || 'დაფიქსირდა შეცდომა'))
      .finally(() => setLoading(false));
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', border: `1px solid ${C.lgray}`,
    background: C.offwhite, color: C.black, fontSize: 14,
    fontFamily: "'TT Interphases Pro',sans-serif", outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
  };

  const labelStyle = { ...T.labelSm, color: C.gray, fontSize: 9, letterSpacing: '0.12em', display: 'block', marginBottom: 8 };

  const field = (key, label, placeholder, type = 'text') => (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder} style={inputStyle}
        onFocus={e => e.target.style.borderColor = C.tan}
        onBlur={e => e.target.style.borderColor = C.lgray} />
    </div>
  );

  const selectField = (key, label, options) => (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      <select value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 40, cursor: 'pointer' }}
        onFocus={e => e.target.style.borderColor = C.tan}
        onBlur={e => e.target.style.borderColor = C.lgray}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label || (L.affSelectPlaceholder || 'აირჩიეთ...')}</option>)}
      </select>
    </div>
  );

  return (
    <>
      <SEO title={L.affiliateProgram || "Affiliate Program"} description={L.affHeroSub || "Partner with Alternative"} />

      {/* HERO */}
      <section style={{ background: C.black, padding: mobile ? '80px 0 60px' : '120px 0 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: `0 ${px}` }}>
          <p style={{ ...T.labelSm, color: C.tan, marginBottom: 16, letterSpacing: '0.16em', fontSize: 10 }}>
            {L.earnWithUs || "EARN WITH US"}
          </p>
          <h1 style={{ ...T.displayMd, color: C.white, marginBottom: 20, lineHeight: 1.2 }}>
            {L.affHero || "გახდი ALTERNATIVE-ის პარტნიორი"}
          </h1>
          <p style={{ ...T.body, color: 'rgba(255,255,255,0.6)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.8 }}>
            {L.affHeroSub || "გაუზიარე შენი უნიკალური კოდი მიმდევრებს და მიიღე 10% კომისია ყოველი შეკვეთიდან"}
          </p>
          <button onClick={scrollToForm} style={{
            background: 'transparent', border: `1px solid ${C.tan}`, color: C.tan,
            padding: '14px 40px', fontFamily: "'TT Interphases Pro',sans-serif", fontSize: 12,
            fontWeight: 500, letterSpacing: '0.12em', cursor: 'pointer', transition: 'all 0.3s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = C.tan; e.currentTarget.style.color = C.white; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.tan; }}>
            {L.affApplyNow || "გაიარე რეგისტრაცია"}
          </button>
        </div>
      </section>

      {/* BENEFITS */}
      <section style={{ padding: mobile ? '48px 0' : '80px 0', borderBottom: `1px solid ${C.lgray}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: `0 ${px}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr 1fr', gap: mobile ? 24 : 40 }}>
            {[
              { n: '10%', t: L.affBenefit1Title || 'კომისია', d: L.affBenefit1Desc || 'მიიღე 10% კომისია ყოველი წარმატებული შეკვეთიდან, რომელიც შენი კოდით განხორციელდა' },
              { n: 'GEL', t: L.affBenefit2Title || 'ყოველთვიური გადახდა', d: L.affBenefit2Desc || 'კომისია ირიცხება ყოველთვიურად, მინიმალური ზღვარი 50 ლარი' },
              { n: 'VIP', t: L.affBenefit3Title || 'ექსკლუზიური წვდომა', d: L.affBenefit3Desc || 'მიიღე წინასწარი წვდომა ახალ კოლექციებზე და სპეციალური ფასდაკლებები' },
            ].map(b => (
              <div key={b.n} style={{ textAlign: 'center', padding: mobile ? '24px 16px' : '40px 24px', background: C.offwhite }}>
                <p style={{ fontFamily: "'Alido',serif", fontSize: 32, color: C.tan, marginBottom: 12 }}>{b.n}</p>
                <p style={{ ...T.heading, color: C.black, fontSize: 14, marginBottom: 10 }}>{b.t}</p>
                <p style={{ ...T.bodySm, color: C.gray, lineHeight: 1.7 }}>{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: mobile ? '48px 0' : '80px 0', borderBottom: `1px solid ${C.lgray}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: `0 ${px}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 28 : 64, alignItems: 'center' }}>
            <div>
              <p style={{ ...T.labelSm, color: C.tan, marginBottom: 14, fontSize: 10 }}>{L.howItWorks || "როგორ მუშაობს"}</p>
              <h2 style={{ ...T.displaySm, color: C.black, marginBottom: 24 }}>{L.affStepsTitle || "3 მარტივი ნაბიჯი"}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { n: '01', t: L.affStep1 || 'გაიარე რეგისტრაცია', d: L.affStep1Desc || 'შეავსე განაცხადი და მიუთითე სასურველი კოდი' },
                  { n: '02', t: L.affStep2 || 'მიიღე დადასტურება', d: L.affStep2Desc || 'ჩვენი გუნდი განიხილავს შენს განაცხადს 24 საათში' },
                  { n: '03', t: L.affStep3 || 'დაიწყე შემოსავალი', d: L.affStep3Desc || 'გაუზიარე კოდი და მიიღე კომისია ყოველი შეკვეთიდან' },
                ].map(step => (
                  <div key={step.n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <span style={{ ...T.labelSm, color: C.tan, fontSize: 12, flexShrink: 0, paddingTop: 2 }}>{step.n}</span>
                    <div>
                      <p style={{ ...T.heading, color: C.black, fontSize: 13, marginBottom: 4 }}>{step.t}</p>
                      <p style={{ ...T.bodySm, color: C.gray, lineHeight: 1.7 }}>{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Commission structure */}
            <div style={{ background: C.offwhite, padding: mobile ? '28px 24px' : '40px 32px' }}>
              <p style={{ ...T.labelSm, color: C.tan, marginBottom: 20, fontSize: 10 }}>{L.commissionStructure || "საკომისიო სტრუქტურა"}</p>
              {[
                [L.standardRate || 'სტანდარტული კომისია', L.standardRateVal || '10%'],
                [L.topAffiliates || 'ტოპ პარტნიორები', L.topAffiliatesVal || '15%'],
                [L.cookieDuration || 'Cookie ხანგრძლივობა', L.cookieDurationVal || '30 დღე'],
                [L.minimumPayout || 'მინიმალური გადახდა', L.minimumPayoutVal || 'GEL 50'],
                [L.paymentSchedule || 'გადახდის გრაფიკი', L.paymentScheduleVal || 'ყოველთვიური'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${C.lgray}` }}>
                  <span style={{ ...T.bodySm, color: C.gray, fontSize: 13 }}>{k}</span>
                  <span style={{ ...T.label, color: C.black, fontSize: 11 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section ref={formRef} style={{ padding: mobile ? '48px 0' : '80px 0' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: `0 ${px}` }}>
          <p style={{ ...T.labelSm, color: C.tan, marginBottom: 14, fontSize: 10, textAlign: 'center' }}>{L.affApply || "განაცხადი"}</p>
          <h2 style={{ ...T.displaySm, color: C.black, marginBottom: 8, textAlign: 'center' }}>{L.affFormTitle || "შეავსე განაცხადი"}</h2>
          <p style={{ ...T.bodySm, color: C.gray, textAlign: 'center', marginBottom: 32, lineHeight: 1.6 }}>
            {L.affFormSubtitle || "შევსებას 2 წუთი სჭირდება. ჩვენ განვიხილავთ თქვენს განაცხადს 24 საათში."}
          </p>

          {success ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: C.offwhite }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5" style={{ marginBottom: 20 }}>
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p style={{ ...T.heading, color: C.black, fontSize: 16, marginBottom: 10 }}>{L.affSuccess || "განაცხადი მიღებულია!"}</p>
              <p style={{ ...T.bodySm, color: C.gray, lineHeight: 1.7 }}>{L.affSuccessDesc || "ჩვენი გუნდი განიხილავს თქვენს განაცხადს და დაგიკავშირდებათ 24 საათში."}</p>
            </div>
          ) : (
            <>
              {/* Personal Info */}
              <p style={{ ...T.labelSm, color: C.tan, fontSize: 9, letterSpacing: '0.14em', marginBottom: 16 }}>
                {L.affSectionPersonal || "პირადი ინფორმაცია"}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 0 : 12 }}>
                {field('firstName', L.affFormFirstName || 'სახელი *', L.affFormFirstNamePh || 'ნინო')}
                {field('lastName', L.affFormLastName || 'გვარი *', L.affFormLastNamePh || 'ნიჯარაძე')}
              </div>
              {field('email', L.affFormEmail || 'ელ.ფოსტა *', L.affFormEmailPh || 'your@email.com', 'email')}

              {/* Social Media */}
              <p style={{ ...T.labelSm, color: C.tan, fontSize: 9, letterSpacing: '0.14em', marginBottom: 16, marginTop: 24 }}>
                {L.affSectionSocial || "სოციალური ქსელები"}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 0 : 12 }}>
                {field('instagram', 'Instagram', '@username')}
                {field('tiktok', 'TikTok', '@username')}
              </div>

              {/* Niche & Audience */}
              <p style={{ ...T.labelSm, color: C.tan, fontSize: 9, letterSpacing: '0.14em', marginBottom: 16, marginTop: 24 }}>
                {L.affSectionDetails || "დეტალები"}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 0 : 12 }}>
                {selectField('niche', L.affFormNiche || 'სფერო / ნიშა', NICHES)}
                {selectField('audienceSize', L.affFormAudience || 'აუდიტორიის ზომა', AUDIENCE_SIZES)}
              </div>

              {/* Promo Code */}
              <p style={{ ...T.labelSm, color: C.tan, fontSize: 9, letterSpacing: '0.14em', marginBottom: 16, marginTop: 24 }}>
                {L.affSectionCode || "თქვენი კოდი"}
              </p>
              {field('code', L.affFormCode || 'სასურველი პრომო კოდი *', L.affFormCodePh || 'მაგ: NINO10')}
              <p style={{ ...T.bodySm, color: C.gray, fontSize: 11, marginTop: -10, marginBottom: 16, lineHeight: 1.5 }}>
                {L.affCodeHint || "ეს კოდი მიიღებენ თქვენი მიმდევრები. გამოიყენეთ ასოები, ციფრები ან _"}
              </p>

              {/* Motivation */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>{L.affFormDesc || 'რატომ გსურთ პარტნიორობა?'}</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder={L.affFormDescPh || 'მოკლედ აღწერეთ რატომ გსურთ ALTERNATIVE-ის პარტნიორობა...'}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = C.tan}
                  onBlur={e => e.target.style.borderColor = C.lgray} />
              </div>

              {error && <p style={{ ...T.bodySm, color: '#c0392b', fontSize: 12, marginBottom: 16 }}>{error}</p>}

              <HoverBtn onClick={handleSubmit} variant="tan" style={{ width: '100%' }} disabled={loading}>
                {loading ? '...' : (L.affSubmit || 'განაცხადის გაგზავნა')}
              </HoverBtn>

              <p style={{ ...T.bodySm, color: C.gray, fontSize: 11, textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
                {L.affAlreadyHave || "უკვე გაქვს ანგარიში?"}{' '}
                <span onClick={() => setPage('affiliate/dashboard')} style={{ color: C.tan, cursor: 'pointer', textDecoration: 'underline' }}>
                  {L.affGoToDash || "გახსენი დაშბორდი"}
                </span>
              </p>
            </>
          )}
        </div>
      </section>

      <Footer setPage={setPage} L={L} mobile={mobile} />
    </>
  );
}
