import { useState } from 'react';
import { C, T } from '../constants/theme.js';
import { Logo } from '../components/layout/Logo.jsx';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import { api } from '../api.js';

// ── AUTH PAGE ─────────────────────────────────────────────────────────────────
export default function AuthPage({mobile,setPage,setUser,toast,L}) {
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({name:"",email:"",phone:"",password:""});
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  const handleSubmit=async()=>{
    setError("");
    if (mode==="login"){
      if (!form.email||!form.password){setError(L?.enterEmailPass||"Enter email and password.");return;}
      setLoading(true);
      try {
        const data = await api.login(form.email, form.password);
        setUser(data.user);
        toast(data.user.role==="admin"?(L?.welcomeAdmin||"Welcome, Admin"):(L?.welcomeBack||"Welcome back!"),"success");
        setPage("account");
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
        setPage("account");
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

  return (
    <div style={{paddingTop:mobile?52:80,minHeight:"100vh",background:C.cream,display:"flex",alignItems:"center",justifyContent:"center",padding:mobile?"60px 16px 40px":"80px 20px 40px"}}>
      <div style={{width:"100%",maxWidth:420,padding:"48px 44px",background:C.white}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <Logo size={0.8}/>
          <div style={{marginTop:24,display:"flex",background:C.offwhite}}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setError("");}} style={{flex:1,padding:"11px",background:mode===m?C.black:"transparent",color:mode===m?C.white:C.gray,...T.labelSm,fontSize:9,border:"none",transition:"all 0.2s",cursor:"pointer"}}>
                {m==="login"?(L?.signInBtn||"Sign In"):(L?.createAccount||"Create Account")}
              </button>
            ))}
          </div>
        </div>

        {error&&<div style={{padding:"11px 14px",background:"#fff5f5",border:`1px solid ${C.red}`,marginBottom:18}}><p style={{...T.bodySm,color:C.red,fontSize:12}}>{error}</p></div>}

        {mode==="register"&&(
          <div style={{marginBottom:14}}>
            <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{L?.fullNameLabel||"Full Name *"}</label>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your full name" maxLength={100}
              style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,fontSize:14,color:C.black,outline:"none"}}/>
          </div>
        )}
        <div style={{marginBottom:14}}>
          <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{L?.emailLabel||"Email *"}</label>
          <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com"
            onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
            style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,fontSize:14,color:C.black,outline:"none"}}/>
        </div>
        {mode==="register"&&(
          <div style={{marginBottom:14}}>
            <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{L?.whatsappLabel||"WhatsApp Number *"}</label>
            <input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+995 5XX XXX XXX"
              style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,fontSize:14,color:C.black,outline:"none"}}/>
          </div>
        )}
        <div style={{marginBottom:22}}>
          <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{L?.passwordLabel||"Password *"}</label>
          <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••"
            onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
            style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,fontSize:14,color:C.black,outline:"none"}}/>
          {mode==="register"&&<p style={{...T.bodySm,color:C.gray,fontSize:9,marginTop:6}}>Min 8 chars: uppercase, lowercase, number, special character</p>}
        </div>
        <HoverBtn onClick={handleSubmit} variant="primary" style={{width:"100%",padding:"15px"}} disabled={loading}>
          {loading?<span style={{display:"inline-block",width:16,height:16,border:`2px solid rgba(255,255,255,0.3)`,borderTop:`2px solid ${C.white}`,borderRadius:"50%",animation:"spinAnim 0.7s linear infinite"}}/>:mode==="login"?(L?.signInBtn||"Sign In"):(L?.createAccount||"Create Account")}
        </HoverBtn>
      </div>
    </div>
  );
}
