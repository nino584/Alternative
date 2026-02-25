import { C, T } from '../constants/theme.js';
import { BI } from '../constants/images.js';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import Footer from '../components/layout/Footer.jsx';

// ── ABOUT PAGE ────────────────────────────────────────────────────────────────
export default function AboutPage({setPage,L,mobile}) {
  return (
    <div style={{paddingTop:mobile?52:80,background:C.cream}}>
      <div style={{position:"relative",height:mobile?280:460,overflow:"hidden"}}>
        <img src={BI.store_interior} alt="Alternative" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        <div style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.5)"}}/>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:mobile?"0 20px 28px":"0 80px 60px"}}>
          <p style={{...T.labelSm,color:C.tan,marginBottom:12}}>{L&&L.ourStory||'Our story'}</p>
          <h1 style={{...T.displayLg,color:C.white,maxWidth:560,lineHeight:1.05}}>{L&&L.aboutHero||'Built because the market offered two bad options.'}</h1>
        </div>
      </div>
      <div style={{padding:"64px 0",borderBottom:`1px solid ${C.lgray}`}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:mobile?"0 16px":"0 40px",display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?20:52}}>
          <p style={{...T.body,color:C.gray,lineHeight:1.9}}>Walk into a Georgian shop and you pay for the shopkeeper's rent. Order online from an unverified source and receive something that looked premium in the photo but felt wrong in your hands.</p>
          <p style={{...T.body,color:C.gray,lineHeight:1.9}}>Neither option respected the customer. ALTERNATIVES was built to offer exactly that — a simple, honest alternative to a market that had stopped trying.</p>
        </div>
      </div>
      <div style={{padding:"64px 0",background:C.offwhite}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:mobile?"0 16px":"0 40px",display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?28:64,alignItems:"center"}}>
          <div style={{height:400,overflow:"hidden"}}><img src={BI.bag_stone} alt="Quality assurance" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
          <div>
            <p style={{...T.labelSm,color:C.tan,marginBottom:16}}>{L&&L.qualityAssurance||'Quality Assurance'}</p>
            <h2 style={{...T.displayMd,color:C.black,marginBottom:20}}>{L&&L.yourEyes||'Your eyes at the source.'}</h2>
            <p style={{...T.body,color:C.gray,lineHeight:1.9,marginBottom:16}}>{L&&L.qaDesc1||'We work with a dedicated verification team that physically inspects every item — checking stitching, hardware, and material quality.'}</p>
            <p style={{...T.body,color:C.gray,lineHeight:1.9,marginBottom:32}}>{L&&L.qaDesc2||'This is the reason you can trust what arrives at your door.'}</p>
            <HoverBtn onClick={()=>setPage("how")} variant="primary">Our Process →</HoverBtn>
          </div>
        </div>
      </div>
      <div style={{padding:"64px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"0 40px"}}>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(3,1fr)",gap:mobile?28:48}}>
            {[{t:"Honest pricing",b:"Our price reflects actual quality and cost — not a brand tax or a landlord's rent."},{t:"No surprises",b:"The biggest failure of online fashion is the gap between photo and reality. We close it."},{t:"Service is product",b:"From first message to delivery, every touchpoint is designed to exceed your expectations."}].map((v,i)=>(
              <div key={i}><div style={{width:36,height:1,background:C.tan,marginBottom:20}}/><h3 style={{...T.label,color:C.black,fontSize:12,marginBottom:10}}>{v.t}</h3><p style={{...T.bodySm,color:C.gray,lineHeight:1.8}}>{v.b}</p></div>
            ))}
          </div>
        </div>
      </div>
      <Footer setPage={setPage} L={L} mobile={mobile}/>
    </div>
  );
}
