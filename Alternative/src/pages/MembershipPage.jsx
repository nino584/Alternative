import { useEffect } from 'react';
import { C, T } from '../constants/theme.js';
import { IconCheck } from '../components/icons/Icons.jsx';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import Footer from '../components/layout/Footer.jsx';

// ── MEMBERSHIP PAGE ──────────────────────────────────────────────────────────
export default function MembershipPage({setPage,L,mobile}) {
  const px=mobile?"16px":"40px";
  useEffect(()=>{
    if(window.__initMembershipScroll){
      const id=window.__initMembershipScroll;
      delete window.__initMembershipScroll;
      setTimeout(()=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});},100);
    }
  },[]);
  return (
    <div style={{paddingTop:mobile?52:80,background:C.cream}}>
      {/* HERO */}
      <div style={{background:C.black,padding:mobile?"48px 0":"72px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:`0 ${px}`,textAlign:"center"}}>
          <p style={{...T.labelSm,color:C.tan,marginBottom:18}}>Rewards & Benefits</p>
          <h1 style={{...T.displayLg,color:C.white,marginBottom:20}}>Discounts & Membership</h1>
          <p style={{...T.body,color:C.lgray,maxWidth:560,margin:"0 auto",lineHeight:1.9}}>
            Join Alternative to unlock exclusive benefits, earn rewards on every purchase, and share the experience with friends.
          </p>
        </div>
      </div>

      {/* ALTERNATIVE MEMBERSHIP */}
      <div style={{padding:mobile?"48px 0":"80px 0",borderBottom:`1px solid ${C.lgray}`}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:`0 ${px}`}}>
          <div style={{textAlign:"center",marginBottom:mobile?32:48}}>
            <p style={{...T.labelSm,color:C.tan,marginBottom:10}}>Exclusive Access</p>
            <h2 style={{...T.displayMd,color:C.black,marginBottom:16}}>Alternative Membership</h2>
            <p style={{...T.body,color:C.gray,maxWidth:520,margin:"0 auto",lineHeight:1.9}}>
              Create a free account and become an Alternative member. Unlock exclusive perks from your very first order.
            </p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:3,marginBottom:mobile?32:48}}>
            {[
              {title:"Early Access",desc:"Be the first to shop new arrivals and limited drops before anyone else."},
              {title:"Member Pricing",desc:"Exclusive prices on selected items available only to registered members."},
              {title:"Birthday Reward",desc:"Receive a special discount during your birthday month as our gift to you."},
              {title:"Order Priority",desc:"Your orders are sourced and processed with priority over guest orders."},
              {title:"Free Video Verification",desc:"After 3 orders, Video Verification is included free on all future purchases."},
              {title:"Exclusive Events",desc:"Invitations to private sales, new collection previews, and member-only events."},
            ].map((item,i)=>(
              <div key={i} style={{background:C.offwhite,padding:mobile?"20px":"28px 24px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:C.black,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <IconCheck size={14} color={C.tan} stroke={2}/>
                  </div>
                  <h3 style={{...T.heading,color:C.black,fontSize:13}}>{item.title}</h3>
                </div>
                <p style={{...T.bodySm,color:C.gray,lineHeight:1.7}}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{textAlign:"center"}}>
            <HoverBtn onClick={()=>setPage("auth")} variant="primary" style={{padding:"15px 40px",fontSize:12}}>
              Create Free Account
            </HoverBtn>
            <p style={{...T.bodySm,color:C.gray,marginTop:12,fontSize:12}}>Already a member? <button onClick={()=>setPage("auth")} style={{background:"none",border:"none",color:C.tan,cursor:"pointer",...T.bodySm,fontSize:12,textDecoration:"underline"}}>Sign in</button></p>
          </div>
        </div>
      </div>

      {/* AFFILIATE PROGRAM */}
      <div id="affiliate" style={{padding:mobile?"48px 0":"80px 0",borderBottom:`1px solid ${C.lgray}`}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:`0 ${px}`}}>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?28:64,alignItems:"center"}}>
            <div>
              <p style={{...T.labelSm,color:C.tan,marginBottom:14}}>Earn With Us</p>
              <h2 style={{...T.displayMd,color:C.black,marginBottom:16,lineHeight:1.2}}>Affiliate Program</h2>
              <p style={{...T.body,color:C.gray,lineHeight:1.9,marginBottom:24}}>
                Partner with Alternative and earn commission on every sale you drive. Share your unique link with your audience and get rewarded for every successful purchase.
              </p>
              <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:28}}>
                {[
                  {n:"01",t:"Apply",desc:"Fill out the application form and tell us about your platform or audience."},
                  {n:"02",t:"Get Approved",desc:"Our team reviews your application. Approved affiliates receive a unique tracking link."},
                  {n:"03",t:"Share & Earn",desc:"Share your link on social media, blog, or website. Earn commission on every sale."},
                ].map((step)=>(
                  <div key={step.n} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                    <span style={{...T.labelSm,color:C.tan,fontSize:12,flexShrink:0,paddingTop:2}}>{step.n}</span>
                    <div>
                      <p style={{...T.heading,color:C.black,fontSize:13,marginBottom:3}}>{step.t}</p>
                      <p style={{...T.bodySm,color:C.gray,lineHeight:1.7}}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:C.offwhite,padding:mobile?"28px 24px":"40px 32px"}}>
              <p style={{...T.labelSm,color:C.tan,marginBottom:20,fontSize:10}}>COMMISSION STRUCTURE</p>
              {[
                ["Standard Rate","8% per sale"],
                ["Top Affiliates","12% per sale"],
                ["Cookie Duration","30 days"],
                ["Minimum Payout","GEL 50"],
                ["Payment","Monthly bank transfer"],
              ].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.lgray}`}}>
                  <span style={{...T.bodySm,color:C.gray,fontSize:13}}>{k}</span>
                  <span style={{...T.label,color:C.black,fontSize:11}}>{v}</span>
                </div>
              ))}
              <div style={{marginTop:24}}>
                <HoverBtn onClick={()=>setPage("auth")} variant="tan" style={{width:"100%"}}>Apply Now</HoverBtn>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REFER A FRIEND */}
      <div id="refer" style={{padding:mobile?"48px 0":"80px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:`0 ${px}`,textAlign:"center"}}>
          <p style={{...T.labelSm,color:C.tan,marginBottom:14}}>Share the Experience</p>
          <h2 style={{...T.displayMd,color:C.black,marginBottom:16}}>Refer a Friend</h2>
          <p style={{...T.body,color:C.gray,maxWidth:520,margin:"0 auto",lineHeight:1.9,marginBottom:mobile?32:48}}>
            Love Alternative? Share your referral link with friends. When they make their first purchase, you both get rewarded.
          </p>

          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:3,marginBottom:mobile?32:48}}>
            {[
              {step:"1",title:"Share Your Link",desc:"Get your unique referral link from your account dashboard and share it with friends."},
              {step:"2",title:"Friend Orders",desc:"Your friend signs up using your link and places their first order on Alternative."},
              {step:"3",title:"Both Get Rewarded",desc:"You receive GEL 20 credit and your friend gets 10% off their first purchase."},
            ].map((item)=>(
              <div key={item.step} style={{background:C.offwhite,padding:mobile?"24px 20px":"32px 24px",textAlign:"center"}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:C.black,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
                  <span style={{...T.label,color:C.white,fontSize:14}}>{item.step}</span>
                </div>
                <h3 style={{...T.heading,color:C.black,marginBottom:8,fontSize:14}}>{item.title}</h3>
                <p style={{...T.bodySm,color:C.gray,lineHeight:1.7}}>{item.desc}</p>
              </div>
            ))}
          </div>

          <HoverBtn onClick={()=>setPage("auth")} variant="primary" style={{padding:"15px 40px",fontSize:12}}>
            Get Your Referral Link
          </HoverBtn>
          <p style={{...T.labelSm,color:C.gray,marginTop:14,fontSize:9}}>You must be a registered member to access your referral link.</p>
        </div>
      </div>

      <Footer setPage={setPage} L={L} mobile={mobile}/>
    </div>
  );
}
