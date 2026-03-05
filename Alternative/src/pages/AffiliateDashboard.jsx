import { useState, useEffect } from 'react';
import { C, T } from '../constants/theme.js';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import Footer from '../components/layout/Footer.jsx';
import SEO from '../components/SEO.jsx';
import { api } from '../api.js';

export default function AffiliateDashboard({ setPage, L, mobile }) {
  const px = mobile ? "16px" : "40px";
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem('affiliate_session')); } catch { return null; }
  });
  const [loginForm, setLoginForm] = useState({ code: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    if (session) loadDashboard(session.code, session.email);
  }, []);

  const loadDashboard = (code, email) => {
    setLoading(true);
    api.affiliateLogin(code, email)
      .then(res => {
        setData(res);
        const s = { code, email };
        setSession(s);
        localStorage.setItem('affiliate_session', JSON.stringify(s));
      })
      .catch(err => {
        setError(err.message || 'Login failed');
        setSession(null);
        localStorage.removeItem('affiliate_session');
      })
      .finally(() => setLoading(false));
  };

  const handleLogin = () => {
    if (!loginForm.code.trim() || !loginForm.email.trim()) {
      setError(L.affFillAll || 'Please fill in all fields');
      return;
    }
    setError('');
    loadDashboard(loginForm.code.trim(), loginForm.email.trim());
  };

  const handleLogout = () => {
    setSession(null);
    setData(null);
    localStorage.removeItem('affiliate_session');
  };

  const statCard = (label, value, accent) => (
    <div style={{ background: C.offwhite, padding: mobile ? '20px 16px' : '28px 24px', textAlign: 'center' }}>
      <p style={{ ...T.labelSm, color: C.gray, fontSize: 9, letterSpacing: '0.12em', marginBottom: 10 }}>{label}</p>
      <p style={{ fontFamily: "'Alido',serif", fontSize: mobile ? 28 : 36, color: accent ? C.tan : C.black }}>{value}</p>
    </div>
  );

  return (
    <>
      <SEO title={L.affDashTitle || "Affiliate Dashboard"} />

      <section style={{ background: C.black, padding: mobile ? '80px 0 40px' : '100px 0 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: `0 ${px}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ ...T.labelSm, color: C.tan, marginBottom: 8, fontSize: 10 }}>{L.affiliateProgram || "AFFILIATE PROGRAM"}</p>
            <h1 style={{ ...T.displaySm, color: C.white }}>{L.affDashTitle || "პარტნიორის დაშბორდი"}</h1>
          </div>
          {session && data && (
            <button onClick={handleLogout}
              style={{ ...T.labelSm, background: 'none', border: `1px solid rgba(255,255,255,0.2)`, color: 'rgba(255,255,255,0.6)', padding: '10px 20px', cursor: 'pointer', fontSize: 10, letterSpacing: '0.1em', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
              {L.logout || "გასვლა"}
            </button>
          )}
        </div>
      </section>

      <section style={{ padding: mobile ? '32px 0 48px' : '48px 0 80px', minHeight: 400 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: `0 ${px}` }}>

          {/* LOGIN FORM */}
          {!session && !data && (
            <div style={{ maxWidth: 400, margin: '0 auto' }}>
              <p style={{ ...T.bodySm, color: C.gray, textAlign: 'center', marginBottom: 24, lineHeight: 1.7 }}>
                {L.affDashLoginDesc || "შეიყვანე შენი კოდი და ელ.ფოსტა"}
              </p>
              <div style={{ marginBottom: 16 }}>
                <input value={loginForm.code} onChange={e => setLoginForm(p => ({ ...p, code: e.target.value }))}
                  placeholder={L.affFormCode || "შენი კოდი"} onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  style={{ width: '100%', padding: '14px 16px', border: `1px solid ${C.lgray}`, background: C.offwhite, color: C.black, fontSize: 14, fontFamily: "'TT Interphases Pro',sans-serif", outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <input type="email" value={loginForm.email} onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                  placeholder={L.affFormEmail || "ელ.ფოსტა"} onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  style={{ width: '100%', padding: '14px 16px', border: `1px solid ${C.lgray}`, background: C.offwhite, color: C.black, fontSize: 14, fontFamily: "'TT Interphases Pro',sans-serif", outline: 'none', boxSizing: 'border-box' }} />
              </div>
              {error && <p style={{ ...T.bodySm, color: '#c0392b', fontSize: 12, marginBottom: 16 }}>{error}</p>}
              <HoverBtn onClick={handleLogin} variant="tan" style={{ width: '100%' }} disabled={loading}>
                {loading ? '...' : (L.affDashLogin || 'შესვლა')}
              </HoverBtn>
              <p style={{ ...T.bodySm, color: C.gray, fontSize: 11, textAlign: 'center', marginTop: 16 }}>
                {L.affNoAccount || "არ გაქვს ანგარიში?"}{' '}
                <span onClick={() => setPage('affiliate')} style={{ color: C.tan, cursor: 'pointer', textDecoration: 'underline' }}>
                  {L.affApplyNow || "გაიარე რეგისტრაცია"}
                </span>
              </p>
            </div>
          )}

          {/* LOADING */}
          {loading && session && (
            <p style={{ ...T.bodySm, color: C.gray, textAlign: 'center', padding: '60px 0' }}>{L.loading || "იტვირთება..."}</p>
          )}

          {/* DASHBOARD */}
          {data && !loading && (
            <>
              {/* Code badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <span style={{ ...T.labelSm, color: C.gray, fontSize: 10 }}>{L.affYourCode || "შენი კოდი"}:</span>
                <span style={{ background: C.black, color: C.tan, padding: '8px 20px', fontFamily: "'TT Interphases Pro',sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: '0.08em' }}>
                  {data.affiliate.code}
                </span>
                <span style={{ ...T.bodySm, color: C.gray, fontSize: 12 }}>
                  {L.affCommission || "კომისია"}: {data.affiliate.commission_rate}%
                </span>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: mobile ? 8 : 16, marginBottom: 40 }}>
                {statCard(L.affClicks || 'კლიკები', data.stats.totalClicks)}
                {statCard(L.affConversions || 'კონვერსიები', data.stats.totalConversions)}
                {statCard(L.affPending || 'მოლოდინში (GEL)', data.stats.pendingEarnings, true)}
                {statCard(L.affTotalEarned || 'სულ მიღებული (GEL)', data.stats.totalEarned)}
              </div>

              {/* Min payout info */}
              {data.affiliate.pending_earnings > 0 && data.affiliate.pending_earnings < 50 && (
                <div style={{ background: C.offwhite, padding: '16px 20px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  <p style={{ ...T.bodySm, color: C.gray, fontSize: 12 }}>
                    {L.affMinPayout || "გადახდის მინიმალური ზღვარი"}: <strong>GEL 50</strong>
                  </p>
                </div>
              )}

              {/* Recent conversions */}
              <div>
                <p style={{ ...T.labelSm, color: C.black, fontSize: 11, letterSpacing: '0.12em', marginBottom: 16 }}>
                  {L.affRecentConversions || "ბოლო კონვერსიები"}
                </p>
                {data.recentConversions.length === 0 ? (
                  <p style={{ ...T.bodySm, color: C.gray, padding: '32px 0' }}>{L.affNoConversions || "ჯერ არ გაქვს კონვერსიები"}</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'TT Interphases Pro',sans-serif" }}>
                      <thead>
                        <tr style={{ borderBottom: `2px solid ${C.lgray}` }}>
                          <th style={{ textAlign: 'left', padding: '10px 12px', ...T.labelSm, fontSize: 9, color: C.gray }}>{L.date || "თარიღი"}</th>
                          <th style={{ textAlign: 'left', padding: '10px 12px', ...T.labelSm, fontSize: 9, color: C.gray }}>{L.orderId || "შეკვეთა"}</th>
                          <th style={{ textAlign: 'right', padding: '10px 12px', ...T.labelSm, fontSize: 9, color: C.gray }}>{L.amount || "თანხა"}</th>
                          <th style={{ textAlign: 'right', padding: '10px 12px', ...T.labelSm, fontSize: 9, color: C.gray }}>{L.affCommission || "კომისია"}</th>
                          <th style={{ textAlign: 'right', padding: '10px 12px', ...T.labelSm, fontSize: 9, color: C.gray }}>{L.status || "სტატუსი"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentConversions.map(c => (
                          <tr key={c.id} style={{ borderBottom: `1px solid ${C.lgray}` }}>
                            <td style={{ padding: '12px', color: C.gray, fontSize: 12 }}>{new Date(c.created_at).toLocaleDateString('ka-GE')}</td>
                            <td style={{ padding: '12px', color: C.black, fontSize: 12 }}>{c.order_id || '—'}</td>
                            <td style={{ padding: '12px', textAlign: 'right', color: C.black }}>GEL {c.order_amount}</td>
                            <td style={{ padding: '12px', textAlign: 'right', color: C.tan, fontWeight: 500 }}>GEL {c.commission}</td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>
                              <span style={{
                                ...T.labelSm, fontSize: 9, padding: '4px 10px',
                                background: c.status === 'paid' ? 'rgba(46,125,50,0.1)' : 'rgba(201,169,110,0.15)',
                                color: c.status === 'paid' ? '#2e7d32' : C.tan,
                              }}>
                                {c.status === 'paid' ? (L.paid || 'გადახდილი') : (L.pending || 'მოლოდინში')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer setPage={setPage} L={L} mobile={mobile} />
    </>
  );
}
