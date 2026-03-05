import { useState, useEffect, useCallback } from 'react';
import { STYLES, C, T } from './constants/theme.js';
import { LANG_DATA } from './constants/translations.js';
import { api, setSessionExpiredHandler } from './api.js';
import { Logo } from './components/Logo.jsx';
import HoverBtn from './components/HoverBtn.jsx';
import useIsMobile from './hooks/useIsMobile.js';
import AdminDashboard from './pages/AdminDashboard.jsx';

// ── ADMIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Force re-login when session expires
  useEffect(() => {
    setSessionExpiredHandler(() => setUser(null));
    return () => setSessionExpiredHandler(null);
  }, []);
  const [lang, setLangState] = useState(() => {
    try { const v = localStorage.getItem("alternative_lang"); return ["en","ka","ru"].includes(v) ? v : "en"; } catch { return "en"; }
  });
  const setLang = (code) => {
    setLangState(code);
    try { localStorage.setItem("alternative_lang", code); } catch {}
  };
  const mobile = useIsMobile();
  const L = LANG_DATA[lang] || LANG_DATA.en;

  // Restore session on mount
  useEffect(() => {
    api.me()
      .then(data => {
        if (data?.user?.role === 'admin' || data?.user?.role === 'supplier') setUser(data.user);
        else setUser(null);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = useCallback(async () => {
    try { await api.logout(); } catch (_) {}
    setUser(null);
  }, []);

  if (loading) {
    return (
      <>
        <style>{STYLES}</style>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:C.cream}}>
          <div style={{textAlign:"center"}}>
            <Logo size={1.2}/>
            <p style={{...T.bodySm,color:C.gray,marginTop:16}}>Loading…</p>
          </div>
        </div>
      </>
    );
  }

  // Check for invite token in URL
  const inviteToken = new URLSearchParams(window.location.search).get('invite');

  if (!user && inviteToken) {
    return (
      <>
        <style>{STYLES}</style>
        <InviteSetup token={inviteToken} L={L} lang={lang} setLang={setLang} mobile={mobile}/>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <style>{STYLES}</style>
        <AdminLogin setUser={setUser} L={L} lang={lang} setLang={setLang} mobile={mobile}/>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <AdminDashboard user={user} onLogout={handleLogout} L={L} lang={lang} setLang={setLang} mobile={mobile}/>
    </>
  );
}

// ── ADMIN LOGIN ───────────────────────────────────────────────────────────────
function AdminLogin({ setUser, L, lang, setLang, mobile }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    if (!email || !password) { setError(L?.enterEmailPass||'Enter email and password.'); return; }
    setBusy(true);
    try {
      const data = await api.login(email, password);
      if (!data?.user || (data.user.role !== 'admin' && data.user.role !== 'supplier')) {
        await api.logout();
        setError(L?.accessDenied||'Access denied. Admin or supplier account required.');
        setBusy(false);
        return;
      }
      setUser(data.user);
    } catch (err) {
      setError(err.message || L?.invalidCredentials||'Invalid credentials.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:C.cream,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:400,background:C.white,padding:mobile?"36px 28px":"48px 44px"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <Logo size={0.9}/>
          <div style={{marginTop:16,padding:"8px 16px",background:C.black,display:"inline-block"}}>
            <span style={{...T.labelSm,color:C.white,fontSize:9}}>MASTER PANEL</span>
          </div>
        </div>

        {error && (
          <div style={{padding:"11px 14px",background:"rgba(88,70,56,0.06)",border:`1px solid ${C.red}`,marginBottom:18}}>
            <p style={{...T.bodySm,color:C.red,fontSize:12}}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:14}}>
            <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>EMAIL</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@example.com" autoComplete="email"
              style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,fontSize:14,color:C.black,outline:"none",fontFamily:"'TT Interphases Pro',sans-serif"}}/>
          </div>
          <div style={{marginBottom:22}}>
            <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>PASSWORD</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password"
                style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,fontSize:14,color:C.black,outline:"none",fontFamily:"'TT Interphases Pro',sans-serif"}}/>
          </div>
          <HoverBtn onClick={handleSubmit} variant="primary" style={{width:"100%",padding:"15px"}} disabled={busy}>
            {busy ? <span style={{display:"inline-block",width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spinAnim 0.7s linear infinite"}}/> : "Sign In"}
          </HoverBtn>
        </form>

        <div style={{marginTop:20,display:"flex",justifyContent:"center",gap:12}}>
          {["en","ka","ru"].map(code=>(
            <button key={code} onClick={()=>setLang(code)}
              style={{background:"none",border:"none",...T.bodySm,color:lang===code?C.tan:C.gray,fontSize:11,cursor:"pointer",fontWeight:lang===code?500:300}}>
              {code==="en"?"EN":code==="ka"?"KA":"RU"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── INVITE SETUP (Set Password) ──────────────────────────────────────────────
function InviteSetup({ token, L, lang, setLang, mobile }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    if (!password || password.length < 8) {
      setError(L?.invitePassMin || 'Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      setError(L?.invitePassMismatch || 'Passwords do not match');
      return;
    }
    setBusy(true);
    try {
      await api.setupPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err.message || L?.inviteError || 'Invalid or expired invite link');
    } finally {
      setBusy(false);
    }
  };

  const goToLogin = () => {
    window.history.replaceState({}, '', window.location.pathname);
    window.location.reload();
  };

  const inputStyle = {width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,fontSize:14,color:C.black,outline:"none",fontFamily:"'TT Interphases Pro',sans-serif"};

  return (
    <div style={{minHeight:"100vh",background:C.cream,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:400,background:C.white,padding:mobile?"36px 28px":"48px 44px"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <Logo size={0.9}/>
          <div style={{marginTop:16,padding:"8px 16px",background:C.black,display:"inline-block"}}>
            <span style={{...T.labelSm,color:C.white,fontSize:9}}>MASTER PANEL</span>
          </div>
        </div>

        {done ? (
          <div style={{textAlign:"center"}}>
            <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(46,125,50,0.1)",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
              <span style={{color:"#2e7d32",fontSize:24}}>&#10003;</span>
            </div>
            <h3 style={{...T.heading,color:C.black,fontSize:18,marginBottom:8}}>
              {L?.inviteSuccess || 'Password set successfully!'}
            </h3>
            <p style={{...T.bodySm,color:C.gray,fontSize:13,marginBottom:24}}>
              {L?.inviteSuccessDesc || 'You can now log in with your email and password.'}
            </p>
            <HoverBtn onClick={goToLogin} variant="primary" style={{width:"100%",padding:"15px"}}>
              {L?.inviteGoLogin || 'Go to Login'}
            </HoverBtn>
          </div>
        ) : (
          <>
            <h3 style={{...T.heading,color:C.black,fontSize:18,textAlign:"center",marginBottom:6}}>
              {L?.inviteSetupTitle || 'Set Your Password'}
            </h3>
            <p style={{...T.bodySm,color:C.gray,fontSize:12,textAlign:"center",marginBottom:24}}>
              {L?.inviteSetupDesc || 'Create a password to access your supplier dashboard'}
            </p>

            {error && (
              <div style={{padding:"11px 14px",background:"rgba(88,70,56,0.06)",border:`1px solid ${C.red}`,marginBottom:18}}>
                <p style={{...T.bodySm,color:C.red,fontSize:12}}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{marginBottom:14}}>
                <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>
                  {L?.inviteNewPass || 'NEW PASSWORD'}
                </label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
                  placeholder="min. 8 characters" autoComplete="new-password" style={inputStyle}/>
              </div>
              <div style={{marginBottom:22}}>
                <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>
                  {L?.inviteConfirmPass || 'CONFIRM PASSWORD'}
                </label>
                <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)}
                  placeholder="repeat password" autoComplete="new-password" style={inputStyle}/>
              </div>
              <HoverBtn onClick={handleSubmit} variant="primary" style={{width:"100%",padding:"15px"}} disabled={busy}>
                {busy ? <span style={{display:"inline-block",width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spinAnim 0.7s linear infinite"}}/> : (L?.inviteSetBtn || 'Set Password')}
              </HoverBtn>
            </form>
          </>
        )}

        <div style={{marginTop:20,display:"flex",justifyContent:"center",gap:12}}>
          {["en","ka","ru"].map(code=>(
            <button key={code} onClick={()=>setLang(code)}
              style={{background:"none",border:"none",...T.bodySm,color:lang===code?C.tan:C.gray,fontSize:11,cursor:"pointer",fontWeight:lang===code?500:300}}>
              {code==="en"?"EN":code==="ka"?"KA":"RU"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
