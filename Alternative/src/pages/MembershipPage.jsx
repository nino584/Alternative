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
          <p style={{...T.labelSm,color:C.tan,marginBottom:18}}>{L.rewardsLabel}</p>
          <h1 style={{...T.displayLg,color:C.white,marginBottom:20}}>{L.discountsMembership}</h1>
          <p style={{...T.body,color:C.lgray,maxWidth:560,margin:"0 auto",lineHeight:1.9}}>
            {L.membershipJoinBody}
          </p>
        </div>
      </div>

      {/* ALTERNATIVE MEMBERSHIP */}
      <div style={{padding:mobile?"48px 0":"80px 0",borderBottom:`1px solid ${C.lgray}`}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:`0 ${px}`}}>
          <div style={{textAlign:"center",marginBottom:mobile?32:48}}>
            <p style={{...T.labelSm,color:C.tan,marginBottom:10}}>{L.exclusiveAccess}</p>
            <h2 style={{...T.displayMd,color:C.black,marginBottom:16}}>{L.membershipTitle}</h2>
            <p style={{...T.body,color:C.gray,maxWidth:520,margin:"0 auto",lineHeight:1.9}}>
              {L.membershipCreateDesc}
            </p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:3,marginBottom:mobile?32:48}}>
            {[
              {title:L.earlyAccess,desc:L.earlyAccessDesc},
              {title:L.memberPricing,desc:L.memberPricingDesc},
              {title:L.birthdayReward,desc:L.birthdayRewardDesc},
              {title:L.orderPriority,desc:L.orderPriorityDesc},
              {title:L.freeVideoVerif,desc:L.freeVideoVerifDesc},
              {title:L.exclusiveEvents,desc:L.exclusiveEventsDesc},
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
              {L.createFreeAccount}
            </HoverBtn>
            <p style={{...T.bodySm,color:C.gray,marginTop:12,fontSize:12}}>{L.alreadyMember} <button onClick={()=>setPage("auth")} style={{background:"none",border:"none",color:C.tan,cursor:"pointer",...T.bodySm,fontSize:12,textDecoration:"underline"}}>{L.signInBtn}</button></p>
          </div>
        </div>
      </div>

      {/* AFFILIATE PROGRAM */}
      <div id="affiliate" style={{padding:mobile?"48px 0":"80px 0",borderBottom:`1px solid ${C.lgray}`}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:`0 ${px}`}}>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?28:64,alignItems:"center"}}>
            <div>
              <p style={{...T.labelSm,color:C.tan,marginBottom:14}}>{L.earnWithUs}</p>
              <h2 style={{...T.displayMd,color:C.black,marginBottom:16,lineHeight:1.2}}>{L.affiliateProgram}</h2>
              <p style={{...T.body,color:C.gray,lineHeight:1.9,marginBottom:24}}>
                {L.affiliateDesc}
              </p>
              <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:28}}>
                {[
                  {n:"01",t:L.affStep1,desc:L.affStep1Desc},
                  {n:"02",t:L.affStep2,desc:L.affStep2Desc},
                  {n:"03",t:L.affStep3,desc:L.affStep3Desc},
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
              <p style={{...T.labelSm,color:C.tan,marginBottom:20,fontSize:10}}>{L.commissionStructure}</p>
              {[
                [L.standardRate,L.standardRateVal],
                [L.topAffiliates,L.topAffiliatesVal],
                [L.cookieDuration,L.cookieDurationVal],
                [L.minimumPayout,L.minimumPayoutVal],
                [L.paymentSchedule,L.paymentScheduleVal],
              ].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.lgray}`}}>
                  <span style={{...T.bodySm,color:C.gray,fontSize:13}}>{k}</span>
                  <span style={{...T.label,color:C.black,fontSize:11}}>{v}</span>
                </div>
              ))}
              <div style={{marginTop:24}}>
                <HoverBtn onClick={()=>setPage("auth")} variant="tan" style={{width:"100%"}}>{L.applyNow}</HoverBtn>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REFER A FRIEND */}
      <div id="refer" style={{padding:mobile?"48px 0":"80px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:`0 ${px}`,textAlign:"center"}}>
          <p style={{...T.labelSm,color:C.tan,marginBottom:14}}>{L.shareExperience}</p>
          <h2 style={{...T.displayMd,color:C.black,marginBottom:16}}>{L.referFriend}</h2>
          <p style={{...T.body,color:C.gray,maxWidth:520,margin:"0 auto",lineHeight:1.9,marginBottom:mobile?32:48}}>
            {L.referDesc}
          </p>

          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:3,marginBottom:mobile?32:48}}>
            {[
              {step:"1",title:L.referStep1,desc:L.referStep1Desc},
              {step:"2",title:L.referStep2,desc:L.referStep2Desc},
              {step:"3",title:L.referStep3,desc:L.referStep3Desc},
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
            {L.getReferralLink}
          </HoverBtn>
          <p style={{...T.labelSm,color:C.gray,marginTop:14,fontSize:9}}>{L.referRegistered}</p>
        </div>
      </div>

      <Footer setPage={setPage} L={L} mobile={mobile}/>
    </div>
  );
}
