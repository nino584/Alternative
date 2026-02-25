import { useState, useEffect } from 'react';
import { C, T } from '../constants/theme.js';
import { BI } from '../constants/images.js';
import { PRODUCTS } from '../constants/data.js';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import ProductCard from '../components/ui/ProductCard.jsx';

// ── CATALOG PAGE ──────────────────────────────────────────────────────────────
export default function CatalogPage({setPage,setSelected,wishlist,onWishlist,initSection,initSub,L,toast,user,setUser,mobile}) {
  const [section,setSection]=useState(initSection||"Womenswear");
  const [subCat,setSubCat]=useState("All");
  const [price,setPrice]=useState("all");
  const [sortBy,setSortBy]=useState("picks");
  const [refineOpen,setRefineOpen]=useState(false);

  // Sync from nav when opening catalog via Collection menu (window.__initSection / __initSub)
  useEffect(()=>{
    if (typeof window==="undefined") return;
    const s=window.__initSection;
    const sub=window.__initSub;
    if (s) setSection(s);
    if (sub) setSubCat(sub);
    delete window.__initSection;
    delete window.__initSub;
  },[]);

  // [label, englishKey] pairs - label for display, englishKey for filtering
  const subCats={
    All:[[L.newIn,"New In"],[L.clothing,"Clothing"],[L.shoes,"Shoes"],[L.bags,"Bags"],[L.accessories,"Accessories"],[L.watches,"Watches"],[L.jewellery,"Jewellery"],[L.sale,"Sale"],[L.brands,"Brands"]],
    Womenswear:[[L.newIn,"New In"],[L.clothing,"Clothing"],[L.shoes,"Shoes"],[L.bags,"Bags"],[L.accessories,"Accessories"],[L.jewellery,"Jewellery"],[L.sale,"Sale"]],
    Menswear:[[L.newIn,"New In"],[L.clothing,"Clothing"],[L.shoes,"Shoes"],[L.bags,"Bags"],[L.accessories,"Accessories"],[L.watches,"Watches"],[L.sale,"Sale"]],
    Kidswear:[[L.newIn,"New In"],[L.clothing,"Clothing"],[L.shoes,"Shoes"],[L.accessories,"Accessories"]],
  };

  let filtered=[...PRODUCTS];
  if (section!=="All") filtered=filtered.filter(p=>p.section===section);
  if (subCat==="New In") filtered=filtered.filter(p=>p.tag==="New");
  else if (subCat==="Sale") filtered=filtered.filter(p=>p.sale||p.tag==="Sale");
  else if (subCat==="Brands") { /* handled by navigation */ }
  else if (subCat!=="All") filtered=filtered.filter(p=>p.sub===subCat||p.cat===subCat);
  if (price==="under200") filtered=filtered.filter(p=>(p.sale||p.price)<200);
  else if (price==="200-400") filtered=filtered.filter(p=>{const ep=p.sale||p.price;return ep>=200&&ep<=400;});
  else if (price==="over400") filtered=filtered.filter(p=>(p.sale||p.price)>400);
  if (sortBy==="new") filtered.sort((a,b)=>(b.tag==="New"?1:0)-(a.tag==="New"?1:0));
  else if (sortBy==="low") filtered.sort((a,b)=>(a.sale||a.price)-(b.sale||b.price));
  else if (sortBy==="high") filtered.sort((a,b)=>(b.sale||b.price)-(a.sale||a.price));

  const sectionBgs={Womenswear:BI.bag_stone,Menswear:BI.man_editorial,Kidswear:BI.packaging};

  return (
    <div style={{paddingTop:mobile?52:80,minHeight:"100vh",background:C.cream}}>
      <div style={{padding:mobile?"20px 0 0":"40px 0 0",borderBottom:`1px solid ${C.lgray}`}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:mobile?"0 16px":"0 40px"}}>
          <p style={{...T.labelSm,color:C.tan,marginBottom:10}}>{L.shop}</p>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:mobile?12:20}}>
            <h1 style={{...T.displayMd,color:C.black,fontSize:mobile?"clamp(22px,6vw,30px)":undefined}}>{L.theCollection}</h1>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{...T.labelSm,color:C.gray,fontSize:9}}>{filtered.length} {L.pieces}</span>
              {!mobile&&<select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{...T.labelSm,fontSize:9,padding:"8px 12px",border:`1px solid ${C.lgray}`,background:C.cream,color:C.black,cursor:"pointer",outline:"none",appearance:"none",paddingRight:28,backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a8a296' strokeWidth='1.2'/%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 10px center"}}>
                <option value="picks">Our Picks</option>
                <option value="new">Newest first</option>
                <option value="high">Price: high to low</option>
                <option value="low">Price: low to high</option>
              </select>}
            </div>
          </div>
          {!mobile&&(
            <div style={{display:"flex",alignItems:"center",gap:16,padding:"10px 0",marginBottom:8}}>
              <span style={{...T.labelSm,color:C.tan,fontSize:8}}>PRE-ORDER MODEL</span>
              <span style={{width:1,height:14,background:C.lgray}}/>
              <span style={{...T.bodySm,color:C.gray,fontSize:11}}>Order & pay · Sourced & verified · Delivered in 10–18 days to Tbilisi</span>
            </div>
          )}
          {!mobile&&(
            <div style={{display:"flex",gap:0,borderBottom:"none"}}>
              {[{k:"Womenswear",l:L.womenswear},{k:"Menswear",l:L.menswear},{k:"Kidswear",l:L.kidswear}].map(({k:s,l:sl})=>(
                <button key={s} onClick={()=>{setSection(s);setSubCat("All");}} style={{...T.label,fontSize:11,padding:"12px 22px",background:"none",border:"none",color:section===s?C.black:C.gray,borderBottom:section===s?`2px solid ${C.tan}`:"2px solid transparent",transition:"all 0.2s",whiteSpace:"nowrap"}}>
                  {sl}
                </button>
              ))}
            </div>
          )}
          {mobile&&(
            <div style={{display:"flex",gap:0,overflowX:"auto",WebkitOverflowScrolling:"touch",msOverflowStyle:"none",scrollbarWidth:"none",marginBottom:-1}}>
              {[{k:"Womenswear",l:L.womenswear},{k:"Menswear",l:L.menswear},{k:"Kidswear",l:L.kidswear}].map(({k:s,l:sl})=>(
                <button key={s} onClick={()=>{setSection(s);setSubCat("All");}} style={{...T.label,fontSize:10,padding:"12px 16px",background:"none",border:"none",color:section===s?C.black:C.gray,borderBottom:section===s?`2px solid ${C.tan}`:"2px solid transparent",transition:"all 0.2s",whiteSpace:"nowrap",flexShrink:0}}>
                  {sl}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* STICKY BAR: Desktop=subcats+price, Mobile=Refine button */}
      <div style={{position:"sticky",top:mobile?52:68,background:`rgba(231,232,225,0.97)`,backdropFilter:"blur(10px)",zIndex:50,borderBottom:`1px solid ${C.lgray}`}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:mobile?"0":"0 40px"}}>
          {mobile?(
            <div style={{display:"flex",alignItems:"center"}}>
              <button onClick={()=>setRefineOpen(true)}
                style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 16px",background:"none",border:"none",borderRight:`1px solid ${C.lgray}`,...T.labelSm,fontSize:10,color:C.black,cursor:"pointer"}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5"><path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>
                REFINE
              </button>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{flex:1,padding:"14px 16px",border:"none",background:"transparent",...T.labelSm,fontSize:10,color:C.black,cursor:"pointer",outline:"none",textAlign:"center",appearance:"none",WebkitAppearance:"none"}}>
                <option value="picks">SORT: OUR PICKS</option>
                <option value="new">SORT: NEWEST</option>
                <option value="high">SORT: PRICE ↓</option>
                <option value="low">SORT: PRICE ↑</option>
              </select>
            </div>
          ):(
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",overflowX:"auto",gap:0,msOverflowStyle:"none",scrollbarWidth:"none"}}>
                {(subCats[section]||subCats.All).map(([lbl,key])=>(
                  <button key={key} onClick={()=>{if(key==="Brands"){setPage("brands");}else{setSubCat(key);}}} style={{...T.labelSm,fontSize:9,padding:"13px 14px",background:"none",border:"none",color:subCat===key?C.black:C.gray,borderBottom:subCat===key?`2px solid ${C.tan}`:"2px solid transparent",transition:"all 0.2s",whiteSpace:"nowrap",cursor:"pointer"}}>
                    {lbl}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",gap:0,flexShrink:0,borderLeft:`1px solid ${C.lgray}`,paddingLeft:16}}>
                {[["all","All price"],["under200","< 200"],["200-400","200–400"],["over400","400+"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setPrice(v)} style={{...T.labelSm,fontSize:8,padding:"13px 10px",background:"none",border:"none",color:price===v?C.black:C.gray,cursor:"pointer",whiteSpace:"nowrap",borderBottom:price===v?`2px solid ${C.tan}`:"2px solid transparent"}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE REFINE OVERLAY */}
      {mobile&&refineOpen&&(
        <div style={{position:"fixed",inset:0,zIndex:300,background:C.cream,overflow:"auto",WebkitOverflowScrolling:"touch"}}>
          {/* Close button */}
          <div style={{display:"flex",justifyContent:"flex-end",padding:"16px 20px"}}>
            <button onClick={()=>setRefineOpen(false)} style={{background:"none",border:"none",padding:4}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* SORT BY */}
          <div style={{padding:"0 20px 28px"}}>
            <h3 style={{...T.label,color:C.black,fontSize:13,marginBottom:20,fontWeight:600}}>SORT BY</h3>
            {[{v:"picks",l:"Our Picks"},{v:"new",l:"Newest first"},{v:"high",l:"Price: high to low"},{v:"low",l:"Price: low to high"}].map((opt,i)=>(
              <button key={i} onClick={()=>setSortBy(opt.v)}
                style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"16px 0",background:"none",border:"none",textAlign:"left",borderBottom:i<3?`1px solid ${C.lgray}`:"none"}}>
                <div style={{width:22,height:22,borderRadius:"50%",border:`2px solid ${sortBy===opt.v?C.black:C.lgray}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {sortBy===opt.v&&<div style={{width:12,height:12,borderRadius:"50%",background:C.black}}/>}
                </div>
                <span style={{...T.body,color:C.black,fontSize:15,fontWeight:300}}>{opt.l}</span>
              </button>
            ))}
          </div>

          {/* FILTERS */}
          <div style={{padding:"0 20px 28px",borderTop:`6px solid ${C.offwhite}`,paddingTop:28}}>
            <h3 style={{...T.label,color:C.black,fontSize:13,marginBottom:16,fontWeight:600}}>FILTERS</h3>

            {/* Category */}
            <div style={{marginBottom:20}}>
              <p style={{...T.body,color:C.black,fontSize:15,fontWeight:300,marginBottom:12}}>Category</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {(subCats[section]||subCats.All).map(([lbl,key])=>(
                  <button key={key} onClick={()=>{if(key==="Brands"){setPage("brands");setRefineOpen(false);}else{setSubCat(key);}}}
                    style={{padding:"8px 16px",borderRadius:20,border:`1px solid ${subCat===key?C.black:C.lgray}`,background:subCat===key?C.black:"transparent",color:subCat===key?C.white:C.black,...T.bodySm,fontSize:12,cursor:"pointer"}}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Section */}
            <div style={{marginBottom:20}}>
              <p style={{...T.body,color:C.black,fontSize:15,fontWeight:300,marginBottom:12}}>Section</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {[{k:"Womenswear",l:L.womenswear},{k:"Menswear",l:L.menswear},{k:"Kidswear",l:L.kidswear}].map(({k,l})=>(
                  <button key={k} onClick={()=>{setSection(k);setSubCat("All");}}
                    style={{padding:"8px 16px",borderRadius:20,border:`1px solid ${section===k?C.black:C.lgray}`,background:section===k?C.black:"transparent",color:section===k?C.white:C.black,...T.bodySm,fontSize:12,cursor:"pointer"}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div style={{marginBottom:20}}>
              <p style={{...T.body,color:C.black,fontSize:15,fontWeight:300,marginBottom:12}}>Price</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {[["all","All prices"],["under200","Under GEL 200"],["200-400","GEL 200 – 400"],["over400","Over GEL 400"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setPrice(v)}
                    style={{padding:"8px 16px",borderRadius:20,border:`1px solid ${price===v?C.black:C.lgray}`,background:price===v?C.black:"transparent",color:price===v?C.white:C.black,...T.bodySm,fontSize:12,cursor:"pointer"}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Show results button - fixed at bottom */}
          <div style={{position:"sticky",bottom:0,padding:"16px 20px",background:C.cream,borderTop:`1px solid ${C.lgray}`}}>
            <button onClick={()=>setRefineOpen(false)}
              style={{width:"100%",padding:"16px",background:C.black,color:C.white,border:"none",...T.label,fontSize:12,cursor:"pointer",letterSpacing:1}}>
              Show {filtered.length} Result{filtered.length!==1?"s":""}
            </button>
          </div>
        </div>
      )}

      {section!=="All"&&sectionBgs[section]&&(
        <div style={{position:"relative",height:160,overflow:"hidden"}}>
          <img src={sectionBgs[section]} alt={section} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 35%"}}/>
          <div style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.48)"}}/>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",padding:"0 56px"}}>
            <h2 style={{...T.displaySm,color:C.white}}>{section}</h2>
          </div>
        </div>
      )}

      <div style={{maxWidth:1360,margin:"0 auto",padding:mobile?"20px 16px 60px":"32px 40px 80px"}}>
        {filtered.length===0?(
          <div style={{padding:"80px 0",textAlign:"center"}}>
            <p style={{...T.displaySm,color:C.lgray,marginBottom:16}}>{L.noItems}</p>
            <p style={{...T.bodySm,color:C.gray,marginBottom:28}}>{L.adjustFilters}</p>
            <HoverBtn onClick={()=>{setSection("All");setSubCat("All");setPrice("all");}} variant="secondary">{L.clearFilters}</HoverBtn>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(4,1fr)",gap:3}}>
            {filtered.map(p=><ProductCard key={p.id} product={p} wishlist={wishlist} onWishlist={onWishlist} L={L} mobile={mobile}
              onSelect={()=>{setPage("product",p);}}/>)}
          </div>
        )}
      </div>
    </div>
  );
}
