import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { C, T } from '../constants/theme.js';
import { Logo } from '../components/layout/Logo.jsx';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import { api } from '../api.js';

// ── Social Login Config ──────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || "";

// ── AUTH PAGE ─────────────────────────────────────────────────────────────────
export default function AuthPage({mobile,setPage,setUser,toast,L}) {
  const location = useLocation();
  const goAfterAuth=useCallback(()=>{
    const ret=location.state?.returnAfterAuth;
    if(ret){setPage(ret);}
    else{setPage("account");}
  },[location.state,setPage]);
  const [mode,setMode]=useState("login"); // login | register | forgot
  const [form,setForm]=useState({name:"",email:"",phone:"",password:""});
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const [socialLoading,setSocialLoading]=useState(null);
  const [forgotSent,setForgotSent]=useState(false);

  // ── Google Sign-In SDK ──
  useEffect(()=>{
    if (!GOOGLE_CLIENT_ID) return;
    if (document.getElementById("google-gsi-script")) return;
    const s=document.createElement("script");
    s.id="google-gsi-script";
    s.src="https://accounts.google.com/gsi/client";
    s.async=true;
    s.defer=true;
    document.head.appendChild(s);
  },[]);

  // ── Facebook SDK ──
  useEffect(()=>{
    if (!FACEBOOK_APP_ID) return;
    if (document.getElementById("facebook-jssdk")) return;
    window.fbAsyncInit=function(){window.FB.init({appId:FACEBOOK_APP_ID,cookie:true,xfbml:false,version:"v18.0"});};
    const s=document.createElement("script");
    s.id="facebook-jssdk";
    s.src="https://connect.facebook.net/en_US/sdk.js";
    s.async=true;
    s.defer=true;
    document.head.appendChild(s);
  },[]);

  const handleSocialLogin = useCallback(async (provider, token) => {
    setSocialLoading(provider);
    setError("");
    try {
      const data = await api.socialLogin(provider, token);
      setUser(data.user);
      toast(L?.welcomeBack||"Welcome!","success");
      goAfterAuth();
    } catch (err) {
      setError(err.message||`${provider} login failed.`);
    } finally {
      setSocialLoading(null);
    }
  },[setUser,toast,L,goAfterAuth]);

  const handleGoogle=useCallback(()=>{
    if (!GOOGLE_CLIENT_ID) { toast(L?.comingSoon||"Google login — coming soon!","info"); return; }
    if (!window.google?.accounts?.id) { setError("Google SDK not loaded yet. Please try again."); return; }
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => { if (response.credential) handleSocialLogin("google", response.credential); },
    });
    window.google.accounts.id.prompt();
  },[handleSocialLogin,toast,L]);

  const handleFacebook=useCallback(()=>{
    if (!FACEBOOK_APP_ID) { toast(L?.comingSoon||"Facebook login — coming soon!","info"); return; }
    if (!window.FB) { setError("Facebook SDK not loaded yet. Please try again."); return; }
    window.FB.login((response)=>{
      if (response.authResponse?.accessToken) handleSocialLogin("facebook", response.authResponse.accessToken);
    },{scope:"email,public_profile"});
  },[handleSocialLogin,toast,L]);

  const handleSubmit=async()=>{
    setError("");
    if (mode==="login"){
      if (!form.email||!form.password){setError(L?.enterEmailPass||"Enter email and password.");return;}
      setLoading(true);
      try {
        const data = await api.login(form.email, form.password);
        setUser(data.user);
        toast(data.user.role==="admin"?(L?.welcomeAdmin||"Welcome, Admin"):(L?.welcomeBack||"Welcome back!"),"success");
        goAfterAuth();
      } catch (err) {
        setError(err.message||L?.enterEmailPass||"Incorrect email or password.");
      } finally {
        setLoading(false);
      }
    } else {
      if (!form.name||!form.email||!form.password){setError(L?.allRequired||"All marked fields are required.");return;}
      if (form.password.length<8||!/[A-Z]/.test(form.password)||!/[a-z]/.test(form.password)||!/[0-9]/.test(form.password)||!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)){setError(L?.passwordMin||"Min 8 chars with uppercase, lowercase, number, and special character (!@#$%...).");return;}
      if (!form.email.includes("@")){setError(L?.validEmail||"Enter a valid email address.");return;}
      setLoading(true);
      try {
        const data = await api.register({name:form.name,email:form.email,phone:form.phone,password:form.password});
        setUser(data.user);
        toast(L?.accountCreated||"Account created! Welcome to Alternative.","success");
        goAfterAuth();
      } catch (err) {
        if (err.details) {
          setError(err.details.map(d=>d.message).join(". "));
        } else {
          setError(err.message||"Registration failed.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const socialBtnBase={width:"100%",padding:"13px 16px",border:`1px solid ${C.lgray}`,background:C.white,display:"flex",alignItems:"center",justifyContent:"center",gap:10,cursor:"pointer",transition:"all 0.2s",fontSize:13,fontWeight:500,fontFamily:"'TT Interphases Pro',sans-serif",letterSpacing:"0.01em"};

  return (
    <div style={{minHeight:"100vh",background:C.cream,display:"flex",alignItems:"center",justifyContent:"center",padding:mobile?"78px 16px 40px":"104px 20px 40px"}}>
      <style>{`@keyframes spinAnim{to{transform:rotate(360deg)}}`}</style>
      <div style={{width:"100%",maxWidth:420,padding:mobile?"36px 28px":"48px 44px",background:C.white}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <Logo size={0.8}/>
          <div style={{marginTop:24,display:"flex",background:C.offwhite}}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setError("");}} style={{flex:1,padding:"11px",background:mode===m?C.black:"transparent",color:mode===m?C.white:C.gray,...T.labelSm,fontSize:9,border:"none",transition:"all 0.2s",cursor:"pointer"}}>
                {m==="login"?(L?.signInBtn||"Sign In"):(L?.createAccount||"Create Account")}
              </button>
            ))}
          </div>
        </div>

        {error&&<div style={{padding:"11px 14px",background:"rgba(88,70,56,0.06)",border:`1px solid ${C.red}`,marginBottom:18}}><p style={{...T.bodySm,color:C.red,fontSize:12}}>{error}</p></div>}

        {/* ── EMAIL & PASSWORD FORM ── */}
        {mode==="register"&&(
          <div style={{marginBottom:14}}>
            <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{L?.fullNameLabel||"Full Name *"}</label>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your full name" maxLength={100}
              style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,fontSize:14,color:C.black,outline:"none"}}/>
          </div>
        )}
        {mode!=="forgot"&&(
          <>
            <div style={{marginBottom:14}}>
              <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{L?.emailLabel||"Email *"}</label>
              <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com"
                onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
                style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,fontSize:14,color:C.black,outline:"none"}}/>
            </div>
            {mode==="register"&&(
              <div style={{marginBottom:14}}>
                <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{L?.phoneLabel||"Phone Number"}</label>
                <input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+995 5XX XXX XXX"
                  style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,fontSize:14,color:C.black,outline:"none"}}/>
              </div>
            )}
            <div style={{marginBottom:22}}>
              <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{L?.passwordLabel||"Password *"}</label>
              <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••"
                onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
                style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,fontSize:14,color:C.black,outline:"none"}}/>
              {mode==="register"&&<p style={{...T.bodySm,color:C.gray,fontSize:9,marginTop:6}}>{L?.passwordHint||"Min 8 chars: uppercase, lowercase, number, special character"}</p>}
            </div>
          </>
        )}
        {mode==="forgot"?(
          <>
            {forgotSent?(
              <div style={{padding:"16px",background:"rgba(177,154,122,0.08)",border:`1px solid ${C.tan}`,textAlign:"center",marginBottom:16}}>
                <p style={{...T.bodySm,color:C.tan,fontSize:13}}>{L?.resetEmailSent||"If an account exists with that email, we've sent a password reset link."}</p>
              </div>
            ):(
              <>
                <p style={{...T.bodySm,color:C.gray,fontSize:12,marginBottom:16}}>{L?.forgotDesc||"Enter your email and we'll send you a reset link."}</p>
                <div style={{marginBottom:14}}>
                  <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{L?.emailLabel||"Email *"}</label>
                  <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com"
                    onKeyDown={e=>{if(e.key==="Enter"){setLoading(true);api.forgotPassword(form.email).then(()=>setForgotSent(true)).catch(err=>setError(err.message||"Failed")).finally(()=>setLoading(false));}}}
                    style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,fontSize:14,color:C.black,outline:"none"}}/>
                </div>
                <HoverBtn onClick={()=>{setLoading(true);api.forgotPassword(form.email).then(()=>setForgotSent(true)).catch(err=>setError(err.message||"Failed")).finally(()=>setLoading(false));}} variant="primary" style={{width:"100%",padding:"15px"}} disabled={loading}>
                  {loading?<span style={{display:"inline-block",width:16,height:16,border:`2px solid rgba(255,255,255,0.3)`,borderTop:`2px solid ${C.white}`,borderRadius:"50%",animation:"spinAnim 0.7s linear infinite"}}/>:(L?.sendResetLink||"Send Reset Link")}
                </HoverBtn>
              </>
            )}
            <button onClick={()=>{setMode("login");setError("");setForgotSent(false);}} style={{width:"100%",marginTop:16,background:"none",border:"none",...T.labelSm,color:C.tan,fontSize:10,cursor:"pointer",textDecoration:"underline",textUnderlineOffset:3}}>
              {L?.backToLogin||"Back to Sign In"}
            </button>
          </>
        ):(
          <>
            <HoverBtn onClick={handleSubmit} variant="primary" style={{width:"100%",padding:"15px"}} disabled={loading}>
              {loading?<span style={{display:"inline-block",width:16,height:16,border:`2px solid rgba(255,255,255,0.3)`,borderTop:`2px solid ${C.white}`,borderRadius:"50%",animation:"spinAnim 0.7s linear infinite"}}/>:mode==="login"?(L?.signInBtn||"Sign In"):(L?.createAccount||"Create Account")}
            </HoverBtn>
            {mode==="login"&&(
              <button onClick={()=>{setMode("forgot");setError("");}} style={{width:"100%",marginTop:14,background:"none",border:"none",...T.labelSm,color:C.gray,fontSize:9,cursor:"pointer"}}>
                {L?.forgotPassword||"Forgot your password?"}
              </button>
            )}
          </>
        )}

        {/* ── DIVIDER ── */}
        <div style={{display:"flex",alignItems:"center",gap:14,margin:"20px 0"}}>
          <div style={{flex:1,height:1,background:C.lgray}}/>
          <span style={{...T.labelSm,color:C.gray,fontSize:9,letterSpacing:"0.1em"}}>{L?.orLabel||"OR"}</span>
          <div style={{flex:1,height:1,background:C.lgray}}/>
        </div>

        {/* ── SOCIAL LOGIN BUTTONS ── */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <button onClick={handleGoogle} disabled={socialLoading==="google"}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.black;e.currentTarget.style.background=C.offwhite;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.lgray;e.currentTarget.style.background=C.white;}}
            style={{...socialBtnBase,color:C.black,opacity:socialLoading==="google"?0.6:1}}>
            {socialLoading==="google"?<span style={{display:"inline-block",width:16,height:16,border:"2px solid rgba(0,0,0,0.15)",borderTop:"2px solid #4285f4",borderRadius:"50%",animation:"spinAnim 0.7s linear infinite"}}/>:(
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {L?.continueGoogle||"Continue with Google"}
          </button>

          <button onClick={handleFacebook} disabled={socialLoading==="facebook"}
            onMouseEnter={e=>{e.currentTarget.style.background="#1565c0";}}
            onMouseLeave={e=>{e.currentTarget.style.background="#1877F2";}}
            style={{...socialBtnBase,background:"#1877F2",color:"#fff",borderColor:"#1877F2",opacity:socialLoading==="facebook"?0.6:1}}>
            {socialLoading==="facebook"?<span style={{display:"inline-block",width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spinAnim 0.7s linear infinite"}}/>:(
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            )}
            {L?.continueFacebook||"Continue with Facebook"}
          </button>
        </div>
      </div>
    </div>
  );
}
