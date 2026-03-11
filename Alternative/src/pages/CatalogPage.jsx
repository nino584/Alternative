import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { C, T } from '../constants/theme.js';
import { PRODUCTS } from '../constants/data.js';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import ProductCard from '../components/ui/ProductCard.jsx';
import Footer from '../components/layout/Footer.jsx';
import SEO from '../components/SEO.jsx';

import { SkeletonProductGrid } from '../components/ui/SkeletonLoader.jsx';
import { pageMeta, collectionSchema } from '../utils/seo.js';

// ── CATALOG PAGE ── LuisaViaRoma-style sidebar layout ──────────────────────────
export default function CatalogPage({setPage,wishlist,onWishlist,onQuickView,L,toast,user,setUser,mobile,products:productsProp,topOffset=0}) {
  const location = useLocation();
  const navState = location.state;
  const [section,setSection]=useState(navState?.initSection||"Womenswear");
  const [subCat,setSubCat]=useState(navState?.initSub||"All");
  const [price,setPrice]=useState("all");
  const [sortBy,setSortBy]=useState("picks");
  const [refineOpen,setRefineOpen]=useState(false);
  const [typeFilter,setTypeFilter]=useState("All");
  const [colorFilter,setColorFilter]=useState("All");
  const [sizeFilter,setSizeFilter]=useState([]);
  const [brandFilter,setBrandFilter]=useState(navState?.initBrand||"All");
  const [brandSearch,setBrandSearch]=useState("");
  const [kidsGender,setKidsGender]=useState("All");
  const [expanded,setExpanded]=useState(navState?.initBrand?{brand:true}:{});

  useEffect(()=>{setTypeFilter("All");setColorFilter("All");setSizeFilter([]);setBrandFilter("All");setBrandSearch("");},[subCat]);
  useEffect(()=>{if(section!=="Kidswear")setKidsGender("All");},[section]);
  // Scroll to top when switching sections or subcategories
  useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[section]);
  useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[subCat]);

  // Handle navigate state changes (e.g. Nav menu clicks while already on /catalog)
  useEffect(()=>{
    if (!navState) return;
    if (navState.initSection) setSection(navState.initSection);
    if (navState.initSub) setSubCat(navState.initSub);
    if (navState.initBrand) { setBrandFilter(navState.initBrand); setExpanded(prev=>({...prev,brand:true})); }
    let raf2;
    const raf1=requestAnimationFrame(()=>{raf2=requestAnimationFrame(()=>window.scrollTo(0,0));});
    return ()=>{cancelAnimationFrame(raf1);if(raf2)cancelAnimationFrame(raf2);};
  },[navState]);

  const subCats={
    All:[[L.newIn,"New In"],[L.clothing,"Clothing"],[L.shoes,"Shoes"],[L.bags,"Bags"],[L.accessories,"Accessories"],[L.watches,"Watches"],[L.jewellery,"Jewellery"],[L.sale,"Sale"],[L.brands,"Brands"]],
    Womenswear:[[L.newIn,"New In"],[L.clothing,"Clothing"],[L.shoes,"Shoes"],[L.bags,"Bags"],[L.accessories,"Accessories"],[L.jewellery,"Jewellery"],[L.sale,"Sale"]],
    Menswear:[[L.newIn,"New In"],[L.clothing,"Clothing"],[L.shoes,"Shoes"],[L.bags,"Bags"],[L.accessories,"Accessories"],[L.watches,"Watches"],[L.sale,"Sale"]],
    Kidswear:[[L.newIn,"New In"],[L.clothing,"Clothing"],[L.shoes,"Shoes"],[L.accessories,"Accessories"]],
  };

  const clothingTypes = section==="Menswear"
    ? [[L.typeBlazers,"Blazers"],[L.typeCoats,"Coats"],[L.typeJackets,"Jackets"],[L.typeTops,"Tops"],[L.typePants,"Pants"],[L.typeKnits,"Knits"],[L.typeDenim,"Denim"]]
    : [[L.typeBlazers,"Blazers"],[L.typeCoats,"Coats"],[L.typeJackets,"Jackets"],[L.typeDresses,"Dresses"],[L.typeTops,"Tops"],[L.typePants,"Pants"],[L.typeKnits,"Knits"],[L.typeDenim,"Denim"]];
  const typeChips={
    Clothing:clothingTypes,
    Shoes:section==="Menswear"
      ?[[L.typeSneakers,"Sneakers"],[L.typeLoafers,"Loafers"],[L.typeBoots,"Boots"]]
      :[[L.typeSneakers,"Sneakers"],[L.typeLoafers,"Loafers"],[L.typeMules,"Mules"],[L.typeBoots,"Boots"],[L.typeHeels,"Heels"]],
    Bags:section==="Menswear"
      ?[[L.typeTotes,"Totes"],[L.typeCrossbody,"Crossbody"],[L.typeDuffle,"Duffle"]]
      :[[L.typeTotes,"Totes"],[L.typeCrossbody,"Crossbody"],[L.typeShoulderBags,"Shoulder Bags"],[L.typeDuffle,"Duffle"],[L.typeClutch,"Clutch"]],
    Accessories:[[L.typeScarves,"Scarves"],[L.typeBelts,"Belts"],[L.typeSunglasses,"Sunglasses"],[L.typeHats,"Hats"]],
    Watches:[[L.typeAutomatic,"Automatic"],[L.typeBracelet,"Bracelet"],[L.typeDress,"Dress"]],
    Jewellery:[[L.typeRings,"Rings"],[L.typeNecklaces,"Necklaces"],[L.typeBracelets,"Bracelets"],[L.typeEarrings,"Earrings"]],
  };
  const showTypeChips=!["All","New In","Sale","Brands"].includes(subCat)&&typeChips[subCat];

  const ALL_PRODUCTS = productsProp || PRODUCTS;

  const allColors = useMemo(()=>[...new Set(ALL_PRODUCTS.map(p=>p.color))].sort(),[ALL_PRODUCTS]);

  const availableSizes = useMemo(()=>{
    let pool=[...ALL_PRODUCTS];
    if (section!=="All") pool=pool.filter(p=>p.section===section);
    if (subCat&&!["All","New In","Sale","Brands"].includes(subCat)) pool=pool.filter(p=>p.sub===subCat||p.cat===subCat);
    return [...new Set(pool.flatMap(p=>p.sizes||[]))].filter(s=>s!=="One Size");
  },[ALL_PRODUCTS,section,subCat]);

  const availableBrands = useMemo(()=>{
    let pool=[...ALL_PRODUCTS];
    if (section!=="All") pool=pool.filter(p=>p.section===section);
    if (subCat&&!["All","New In","Sale","Brands"].includes(subCat)) pool=pool.filter(p=>p.sub===subCat||p.cat===subCat);
    return [...new Set(pool.map(p=>p.brand))].filter(Boolean).sort();
  },[ALL_PRODUCTS,section,subCat]);

  const filtered = useMemo(() => {
    let result=[...ALL_PRODUCTS];
    if (section!=="All") result=result.filter(p=>p.section===section);
    if (section==="Kidswear"&&kidsGender!=="All") result=result.filter(p=>p.kidsGender===kidsGender);
    if (subCat==="New In") { /* show all, sorted newest-first below */ }
    else if (subCat==="Sale") result=result.filter(p=>p.sale||p.tag==="Sale");
    else if (subCat==="Brands") { /* handled by navigation */ }
    else if (subCat!=="All") result=result.filter(p=>p.sub===subCat||p.cat===subCat);
    if (typeFilter!=="All") result=result.filter(p=>p.type===typeFilter);
    if (colorFilter!=="All") result=result.filter(p=>p.color===colorFilter);
    if (sizeFilter.length>0) result=result.filter(p=>p.sizes&&sizeFilter.some(s=>p.sizes.includes(s)));
    if (brandFilter!=="All") result=result.filter(p=>p.brand===brandFilter);
    if (price==="under200") result=result.filter(p=>(p.sale??p.price)<200);
    else if (price==="200-400") result=result.filter(p=>{const ep=p.sale??p.price;return ep>=200&&ep<=400;});
    else if (price==="over400") result=result.filter(p=>(p.sale??p.price)>400);
    if (subCat==="New In") result.sort((a,b)=>b.id-a.id);
    else if (sortBy==="new") result.sort((a,b)=>b.id-a.id);
    else if (sortBy==="low") result.sort((a,b)=>(a.sale??a.price)-(b.sale??b.price));
    else if (sortBy==="high") result.sort((a,b)=>(b.sale??b.price)-(a.sale??a.price));
    return result;
  }, [ALL_PRODUCTS, section, subCat, kidsGender, typeFilter, colorFilter, sizeFilter, brandFilter, price, sortBy]);

  const activeFilters = [subCat!=="All",typeFilter!=="All",colorFilter!=="All",sizeFilter.length>0,brandFilter!=="All",price!=="all",kidsGender!=="All"].filter(Boolean).length;

  const colorMap={"Black":"#1a1a1a","Camel":"#c4a66a","Ivory":"#f5f0e8","Nude":"#d4b5a0","Burgundy":"#6b1d3a","Cognac":"#8b4513","Silver":"#b8b8b8","Gold":"#c9a94e","Tan":"#c19a6b","Charcoal":"#4a4a4a","Cream":"#f5f0dc","White":"#fafafa"};
  const toggleExp = (key) => setExpanded(prev=>({...prev,[key]:!prev[key]}));
  const clearAll = ()=>{setSubCat("All");setTypeFilter("All");setColorFilter("All");setSizeFilter([]);setBrandFilter("All");setPrice("all");setBrandSearch("");setKidsGender("All");};

  const catalogMeta = pageMeta("catalog", { section: section !== "All" ? section : null, cat: subCat !== "All" ? subCat : null });
  const catalogSchema = collectionSchema(filtered, section !== "All" ? `${section} Collection` : "All Products", "/catalog");

  // Labels
  const sectionLabel = section==="Womenswear"?L.womenswear:section==="Menswear"?L.menswear:L.kidswear;
  const subCatLabel = subCat==="All"?(L.allSub||"All"):(subCats[section]||subCats.All).find(([_,k])=>k===subCat)?.[0]||subCat;
  const typeFilterLabel = typeFilter==="All"?(L.allSub||"All"):(showTypeChips||[]).find(([_,k])=>k===typeFilter)?.[0]||typeFilter;
  const priceFilterLabel = price==="all"?(L.allSub||"All"):price==="under200"?L.underGel200:price==="200-400"?L.gel200to400:L.overGel400;

  // Page title
  const kidsGenderLabel = kidsGender==="Girl"?(L.kidsGirl||"Girl"):kidsGender==="Boy"?(L.kidsBoy||"Boy"):kidsGender==="Baby"?(L.kidsBaby||"Baby"):"";
  const pageTitle = section==="Kidswear"&&kidsGender!=="All"
    ? (subCat!=="All"&&subCat!=="New In"&&subCat!=="Sale"?`${kidsGenderLabel} · ${subCatLabel}`:`${sectionLabel} · ${kidsGenderLabel}`)
    : (subCat!=="All"&&subCat!=="New In"&&subCat!=="Sale"&&subCat!=="Brands"
    ? `${sectionLabel} · ${subCatLabel}` : sectionLabel);

  // Active filter chips
  const filterChips=[];
  if (subCat!=="All") filterChips.push({label:subCatLabel,clear:()=>setSubCat("All")});
  if (typeFilter!=="All") filterChips.push({label:typeFilterLabel,clear:()=>setTypeFilter("All")});
  if (brandFilter!=="All") filterChips.push({label:brandFilter,clear:()=>setBrandFilter("All")});
  if (colorFilter!=="All") filterChips.push({label:colorFilter,clear:()=>setColorFilter("All")});
  if (sizeFilter.length>0) filterChips.push({label:sizeFilter.join(", "),clear:()=>setSizeFilter([])});
  if (price!=="all") filterChips.push({label:priceFilterLabel,clear:()=>setPrice("all")});
  if (kidsGender!=="All") filterChips.push({label:kidsGender==="Girl"?(L.kidsGirl||"Girl"):kidsGender==="Boy"?(L.kidsBoy||"Boy"):(L.kidsBaby||"Baby"),clear:()=>setKidsGender("All")});

  // Mobile pill style
  const pillStyle=(active)=>({
    padding:"10px 18px",borderRadius:24,
    border:`1px solid ${active?C.black:C.lgray}`,
    background:active?C.black:"transparent",
    color:active?C.white:C.black,
    ...T.bodySm,fontSize:13,cursor:"pointer",
    transition:"all 0.2s ease",
  });

  // Sidebar option style
  const optStyle=(active)=>({
    display:"block",width:"100%",textAlign:"left",
    padding:"7px 0",background:"none",border:"none",
    ...T.bodySm,fontSize:13,
    color:active?C.black:C.gray,
    fontWeight:active?600:400,
    cursor:"pointer",transition:"color 0.15s",
  });

  // Sidebar accordion section
  const SidebarSection=({title,value,sKey,children})=>(
    <div style={{borderBottom:`1px solid rgba(200,200,190,0.4)`}}>
      <button onClick={()=>toggleExp(sKey)}
        style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 0",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          <span style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:15,fontWeight:600,color:C.black,letterSpacing:"0.01em"}}>{title}</span>
          <span style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:12,color:C.gray,fontWeight:400}}>{value}</span>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.8"
          style={{transition:"transform 0.25s ease",transform:expanded[sKey]?"rotate(90deg)":"rotate(0deg)",flexShrink:0}}>
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
      {expanded[sKey]&&(
        <div style={{paddingBottom:16}}>{children}</div>
      )}
    </div>
  );

  return (
    <div style={{paddingTop:(mobile?78:104)+topOffset,minHeight:"100vh",background:C.cream}}>
      <SEO {...catalogMeta} schema={catalogSchema} />

      {/* ── SECTION TABS (sticky) ── */}
      <div style={{position:"sticky",top:(mobile?78:88)+topOffset,background:C.cream,zIndex:50,borderBottom:`1px solid ${C.lgray}`}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:mobile?"0 16px":"0 40px"}}>
          {!mobile?(
            <div style={{display:"flex",gap:0}}>
              {[{k:"Womenswear",l:L.womenswear},{k:"Menswear",l:L.menswear},{k:"Kidswear",l:L.kidswear}].map(({k:s,l:sl})=>(
                <button key={s} onClick={()=>{setSection(s);clearAll();}}
                  onMouseEnter={e=>{if(section!==s)e.currentTarget.style.color=C.black;}}
                  onMouseLeave={e=>{if(section!==s)e.currentTarget.style.color=C.gray;}}
                  style={{...T.label,fontSize:11,padding:"14px 24px",background:"none",border:"none",color:section===s?C.black:C.gray,borderBottom:section===s?`2px solid ${C.black}`:"2px solid transparent",transition:"all 0.25s ease",whiteSpace:"nowrap",cursor:"pointer",letterSpacing:"0.08em"}}>
                  {sl}
                </button>
              ))}
            </div>
          ):(
            <div style={{display:"flex",gap:0,justifyContent:"center",overflowX:"auto",WebkitOverflowScrolling:"touch",msOverflowStyle:"none",scrollbarWidth:"none"}}>
              {[{k:"Womenswear",l:L.womenswear},{k:"Menswear",l:L.menswear},{k:"Kidswear",l:L.kidswear}].map(({k:s,l:sl})=>(
                <button key={s} onClick={()=>{setSection(s);clearAll();}}
                  style={{...T.label,fontSize:10,padding:"12px 16px",background:"none",border:"none",color:section===s?C.black:C.gray,borderBottom:section===s?`2px solid ${C.black}`:"2px solid transparent",transition:"all 0.25s ease",whiteSpace:"nowrap",flexShrink:0,cursor:"pointer"}}>
                  {sl}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Kidswear gender tabs */}
        {section==="Kidswear"&&(
          <div style={{maxWidth:1360,margin:"0 auto",padding:mobile?"0 16px":"0 40px",borderTop:`1px solid rgba(200,200,190,0.3)`}}>
            <div style={{display:"flex",gap:0,overflowX:"auto"}}>
              {[{k:"All",l:L.allSub||"All"},{k:"Girl",l:L.kidsGirl||"Girl"},{k:"Boy",l:L.kidsBoy||"Boy"},{k:"Baby",l:L.kidsBaby||"Baby"}].map(({k,l})=>(
                <button key={k} onClick={()=>setKidsGender(k)}
                  style={{...T.bodySm,fontSize:mobile?11:12,fontWeight:kidsGender===k?600:400,padding:mobile?"10px 14px":"10px 20px",background:"none",border:"none",color:kidsGender===k?C.black:C.gray,borderBottom:kidsGender===k?`2px solid ${C.tan}`:"2px solid transparent",transition:"all 0.2s ease",whiteSpace:"nowrap",cursor:"pointer",flexShrink:0}}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE: STICKY REFINE + SORT ── */}
      {mobile&&(
        <div style={{position:"sticky",top:(mobile?110:130)+topOffset,background:`rgba(231,232,225,0.97)`,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",zIndex:49,borderBottom:`1px solid ${C.lgray}`}}>
          <div style={{display:"flex",alignItems:"center"}}>
            <button onClick={()=>setRefineOpen(true)}
              style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 16px",background:"none",border:"none",borderRight:`1px solid ${C.lgray}`,...T.labelSm,fontSize:10,color:C.black,cursor:"pointer",letterSpacing:"0.1em",position:"relative"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5"><path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>
              {L.refine}
              {activeFilters>0&&<span style={{position:"absolute",top:8,right:"calc(50% - 36px)",width:16,height:16,borderRadius:"50%",background:C.black,color:C.white,fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",...T.labelSm}}>{activeFilters}</span>}
            </button>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{flex:1,padding:"14px 16px",border:"none",background:"transparent",...T.labelSm,fontSize:10,color:C.black,cursor:"pointer",outline:"none",textAlign:"center",appearance:"none",WebkitAppearance:"none",letterSpacing:"0.06em"}}>
              <option value="picks">{L.sortOurPicksShort}</option>
              <option value="new">{L.sortNewestShort}</option>
              <option value="low">{L.sortPriceLowShort}</option>
              <option value="high">{L.sortPriceHighShort}</option>
            </select>
          </div>
        </div>
      )}

      {/* ── DESKTOP: PAGE HEADER ── */}
      {!mobile&&(
        <div style={{maxWidth:1360,margin:"0 auto",padding:"14px 40px 0"}}>
          <h1 style={{...T.displayMd,color:C.black,textAlign:"center",marginBottom:4,fontSize:"clamp(28px, 3vw, 42px)"}}>{pageTitle}</h1>
          <p style={{...T.bodySm,fontSize:12,color:C.gray,textAlign:"center",marginBottom:14}}>
            {sectionLabel}{subCat!=="All"&&<> &nbsp;/&nbsp; {subCatLabel}</>}{typeFilter!=="All"&&<> &nbsp;/&nbsp; {typeFilterLabel}</>}
          </p>

          {/* Filter bar: count + active chips + sort */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderTop:`1px solid ${C.lgray}`,borderBottom:`1px solid ${C.lgray}`}}>
            <span style={{...T.bodySm,fontSize:13,color:C.black,fontWeight:500,flexShrink:0}}>{filtered.length} {L.pieces||"items"}</span>

            {filterChips.length>0&&(
              <div style={{display:"flex",alignItems:"center",gap:8,flex:1,justifyContent:"center",flexWrap:"wrap"}}>
                {filterChips.map((chip,i)=>(
                  <button key={i} onClick={chip.clear}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=C.black}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=C.lgray}
                    style={{display:"flex",alignItems:"center",gap:6,padding:"6px 14px",border:`1px solid ${C.lgray}`,background:"transparent",cursor:"pointer",...T.bodySm,fontSize:12,color:C.black,transition:"border-color 0.2s"}}>
                    {chip.label}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                ))}
                <button onClick={clearAll}
                  onMouseEnter={e=>e.currentTarget.style.opacity="0.6"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="1"}
                  style={{background:"none",border:"none",...T.bodySm,fontSize:12,color:C.black,cursor:"pointer",fontWeight:500,textDecoration:"underline",textUnderlineOffset:2,transition:"opacity 0.2s"}}>
                  {L.clearFilters||"Clear All"}
                </button>
              </div>
            )}

            <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
              <span style={{...T.bodySm,fontSize:12,color:C.gray}}>{L.sortLabel||"Sort by:"}</span>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
                style={{...T.bodySm,fontSize:13,fontWeight:500,padding:"8px 30px 8px 12px",border:`1px solid ${C.lgray}`,background:"transparent",color:C.black,cursor:"pointer",outline:"none",appearance:"none",
                backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a8a296' strokeWidth='1.2'/%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 10px center"}}>
                <option value="picks">{L.sortOurPicks}</option>
                <option value="new">{L.sortNewest}</option>
                <option value="low">{L.sortPriceLow}</option>
                <option value="high">{L.sortPriceHigh}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT: SIDEBAR + GRID ── */}
      <div style={{maxWidth:1360,margin:"0 auto",padding:mobile?0:"0 40px",display:"flex",alignItems:"flex-start"}}>

        {/* ── DESKTOP SIDEBAR ── */}
        {!mobile&&(
          <div style={{width:220,flexShrink:0,position:"sticky",top:140+topOffset,alignSelf:"flex-start",maxHeight:`calc(100vh - ${150+topOffset}px)`,overflowY:"auto",overflowX:"hidden",scrollbarWidth:"thin",paddingRight:24,paddingTop:8}}>

            {/* Categories */}
            <SidebarSection title={L.categoryLabel||"Categories"} value={subCatLabel} sKey="categories">
              <button onClick={()=>setSubCat("All")}
                onMouseEnter={e=>e.currentTarget.style.color=C.black}
                onMouseLeave={e=>{if(subCat!=="All")e.currentTarget.style.color=C.gray;}}
                style={optStyle(subCat==="All")}>{L.allSub||"All"}</button>
              {(subCats[section]||subCats.All).filter(([_,k])=>k!=="Brands").map(([lbl,key])=>(
                <button key={key} onClick={()=>{if(key==="Brands"){setPage("brands");}else{setSubCat(key);}}}
                  onMouseEnter={e=>e.currentTarget.style.color=C.black}
                  onMouseLeave={e=>{if(subCat!==key)e.currentTarget.style.color=C.gray;}}
                  style={optStyle(subCat===key)}>{lbl}</button>
              ))}
            </SidebarSection>

            {/* Type (dynamic, named after current subcategory) */}
            {showTypeChips&&(
              <SidebarSection title={subCatLabel} value={typeFilterLabel} sKey="type">
                <button onClick={()=>setTypeFilter("All")}
                  onMouseEnter={e=>e.currentTarget.style.color=C.black}
                  onMouseLeave={e=>{if(typeFilter!=="All")e.currentTarget.style.color=C.gray;}}
                  style={optStyle(typeFilter==="All")}>{L.allSub||"All"}</button>
                {showTypeChips.map(([lbl,key])=>(
                  <button key={key} onClick={()=>setTypeFilter(key)}
                    onMouseEnter={e=>e.currentTarget.style.color=C.black}
                    onMouseLeave={e=>{if(typeFilter!==key)e.currentTarget.style.color=C.gray;}}
                    style={optStyle(typeFilter===key)}>{lbl}</button>
                ))}
              </SidebarSection>
            )}

            {/* Brand */}
            <SidebarSection title={L.brandLabel||"Brand"} value={brandFilter==="All"?(L.allSub||"All"):brandFilter} sKey="brand">
              <input value={brandSearch} onChange={e=>setBrandSearch(e.target.value)}
                placeholder={L.searchBrand||"Search"}
                style={{width:"100%",padding:"8px 10px",border:`1px solid ${C.lgray}`,background:"transparent",outline:"none",...T.bodySm,fontSize:12,color:C.black,marginBottom:8,boxSizing:"border-box"}}/>
              <button onClick={()=>setBrandFilter("All")}
                onMouseEnter={e=>e.currentTarget.style.color=C.black}
                onMouseLeave={e=>{if(brandFilter!=="All")e.currentTarget.style.color=C.gray;}}
                style={optStyle(brandFilter==="All")}>{L.allSub||"All"}</button>
              {availableBrands.filter(b=>!brandSearch||b.toLowerCase().includes(brandSearch.toLowerCase())).map(b=>(
                <button key={b} onClick={()=>setBrandFilter(b)}
                  onMouseEnter={e=>e.currentTarget.style.color=C.black}
                  onMouseLeave={e=>{if(brandFilter!==b)e.currentTarget.style.color=C.gray;}}
                  style={optStyle(brandFilter===b)}>{b}</button>
              ))}
            </SidebarSection>

            {/* Price */}
            <SidebarSection title={L.priceLabel||"Price"} value={priceFilterLabel} sKey="price">
              {[["all",L.allPrices||"All"],["under200",L.underGel200],["200-400",L.gel200to400],["over400",L.overGel400]].map(([v,l])=>(
                <button key={v} onClick={()=>setPrice(v)}
                  onMouseEnter={e=>e.currentTarget.style.color=C.black}
                  onMouseLeave={e=>{if(price!==v)e.currentTarget.style.color=C.gray;}}
                  style={optStyle(price===v)}>{l}</button>
              ))}
            </SidebarSection>

            {/* Color */}
            <SidebarSection title={L.colorLabel||"Color"} value={colorFilter==="All"?(L.allSub||"All"):colorFilter} sKey="color">
              <button onClick={()=>setColorFilter("All")}
                onMouseEnter={e=>e.currentTarget.style.color=C.black}
                onMouseLeave={e=>{if(colorFilter!=="All")e.currentTarget.style.color=C.gray;}}
                style={optStyle(colorFilter==="All")}>{L.allSub||"All"}</button>
              {allColors.map(c=>(
                <button key={c} onClick={()=>setColorFilter(c)}
                  onMouseEnter={e=>e.currentTarget.style.color=C.black}
                  onMouseLeave={e=>{if(colorFilter!==c)e.currentTarget.style.color=C.gray;}}
                  style={{...optStyle(colorFilter===c),display:"flex",alignItems:"center",gap:10}}>
                  <span style={{width:14,height:14,borderRadius:"50%",background:colorMap[c]||C.gray,border:"1px solid rgba(0,0,0,0.1)",flexShrink:0}}/>
                  {c}
                </button>
              ))}
            </SidebarSection>

            {/* Size (multi-select) */}
            {availableSizes.length>0&&(
              <SidebarSection title={L.sizeLabel||"Size"} value={sizeFilter.length===0?(L.allSub||"All"):sizeFilter.join(", ")} sKey="size">
                <button onClick={()=>setSizeFilter([])}
                  onMouseEnter={e=>e.currentTarget.style.color=C.black}
                  onMouseLeave={e=>{if(sizeFilter.length>0)e.currentTarget.style.color=C.gray;}}
                  style={optStyle(sizeFilter.length===0)}>{L.allSub||"All"}</button>
                {availableSizes.map(s=>{
                  const active=sizeFilter.includes(s);
                  return(
                    <button key={s} onClick={()=>setSizeFilter(prev=>active?prev.filter(x=>x!==s):[...prev,s])}
                      onMouseEnter={e=>e.currentTarget.style.color=C.black}
                      onMouseLeave={e=>{if(!active)e.currentTarget.style.color=C.gray;}}
                      style={{...optStyle(active),display:"flex",alignItems:"center",gap:8}}>
                      <span style={{width:15,height:15,border:`1.5px solid ${active?C.black:C.lgray}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
                        {active&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                      </span>
                      {s}
                    </button>
                  );
                })}
              </SidebarSection>
            )}

            {/* Clear all */}
            {activeFilters>0&&(
              <div style={{padding:"16px 0"}}>
                <button onClick={clearAll}
                  onMouseEnter={e=>e.currentTarget.style.opacity="0.6"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="1"}
                  style={{...T.labelSm,fontSize:11,color:C.black,background:"none",border:"none",cursor:"pointer",textDecoration:"underline",textUnderlineOffset:3,letterSpacing:"0.04em",transition:"opacity 0.2s"}}>
                  {L.clearFilters||"Clear filters"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCT GRID ── */}
        <div style={{flex:1,padding:mobile?"20px 16px 60px":"24px 0 80px 32px",minWidth:0}}>
          {filtered.length===0 && activeFilters===0 && ALL_PRODUCTS.length===0 ? (
            <SkeletonProductGrid count={8} mobile={mobile} />
          ) : filtered.length===0 ? (
            <div style={{padding:"80px 0",textAlign:"center"}}>
              <p style={{...T.displaySm,color:C.lgray,marginBottom:16}}>{L.noItems}</p>
              <p style={{...T.bodySm,color:C.gray,marginBottom:28}}>{L.adjustFilters}</p>
              <HoverBtn onClick={()=>{setSection("Womenswear");clearAll();}} variant="secondary">{L.clearFilters}</HoverBtn>
            </div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(4,1fr)",gap:mobile?10:3}}>
              {filtered.map(p=><ProductCard key={p.id} product={p} wishlist={wishlist} onWishlist={onWishlist} onQuickView={onQuickView} L={L} mobile={mobile}
                onSelect={()=>{setPage("product",p);}}/>)}
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE REFINE OVERLAY ── */}
      {refineOpen&&mobile&&(
        <div style={{position:"fixed",inset:0,zIndex:300,background:C.cream,overflow:"auto",WebkitOverflowScrolling:"touch"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px",borderBottom:`1px solid ${C.lgray}`}}>
            <h2 style={{...T.label,color:C.black,fontSize:14,fontWeight:600,letterSpacing:"0.12em"}}>{L.refine}</h2>
            <button onClick={()=>setRefineOpen(false)} style={{background:"none",border:"none",padding:6,cursor:"pointer"}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div style={{padding:"24px"}}>
            {/* SORT BY */}
            <div style={{marginBottom:28}}>
              <p style={{...T.labelSm,color:C.black,fontSize:11,letterSpacing:"0.12em",marginBottom:14}}>{L.sortLabel}</p>
              {[{v:"picks",l:L.sortOurPicks},{v:"new",l:L.sortNewest},{v:"low",l:L.sortPriceLow},{v:"high",l:L.sortPriceHigh}].map((opt,i)=>(
                <button key={i} onClick={()=>setSortBy(opt.v)}
                  style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"12px 0",background:"none",border:"none",textAlign:"left",borderBottom:i<3?`1px solid rgba(200,200,190,0.4)`:"none",cursor:"pointer"}}>
                  <div style={{width:18,height:18,borderRadius:"50%",border:`1.5px solid ${sortBy===opt.v?C.black:C.lgray}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {sortBy===opt.v&&<div style={{width:9,height:9,borderRadius:"50%",background:C.black}}/>}
                  </div>
                  <span style={{...T.body,color:sortBy===opt.v?C.black:C.gray,fontSize:14,fontWeight:sortBy===opt.v?500:300}}>{opt.l}</span>
                </button>
              ))}
            </div>
            <div style={{height:1,background:C.lgray,marginBottom:24}}/>

            {/* SECTION */}
            <div style={{marginBottom:24}}>
              <p style={{...T.labelSm,color:C.black,fontSize:11,letterSpacing:"0.12em",marginBottom:14}}>{L.sectionLabel}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {[{k:"Womenswear",l:L.womenswear},{k:"Menswear",l:L.menswear},{k:"Kidswear",l:L.kidswear}].map(({k,l})=>(
                  <button key={k} onClick={()=>{setSection(k);clearAll();}} style={pillStyle(section===k)}>{l}</button>
                ))}
              </div>
            </div>

            {/* KIDSWEAR GENDER */}
            {section==="Kidswear"&&(
              <div style={{marginBottom:24}}>
                <p style={{...T.labelSm,color:C.black,fontSize:11,letterSpacing:"0.12em",marginBottom:14}}>{L.kidswear||"KIDSWEAR"}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {[{k:"All",l:L.allSub||"All"},{k:"Girl",l:L.kidsGirl||"Girl"},{k:"Boy",l:L.kidsBoy||"Boy"},{k:"Baby",l:L.kidsBaby||"Baby"}].map(({k,l})=>(
                    <button key={k} onClick={()=>setKidsGender(k)} style={pillStyle(kidsGender===k)}>{l}</button>
                  ))}
                </div>
              </div>
            )}

            {/* CATEGORY */}
            <div style={{marginBottom:24}}>
              <p style={{...T.labelSm,color:C.black,fontSize:11,letterSpacing:"0.12em",marginBottom:14}}>{L.categoryLabel}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {(subCats[section]||subCats.All).map(([lbl,key])=>(
                  <button key={key} onClick={()=>{if(key==="Brands"){setPage("brands");setRefineOpen(false);}else{setSubCat(key);}}} style={pillStyle(subCat===key)}>{lbl}</button>
                ))}
              </div>
            </div>

            {/* TYPE */}
            {showTypeChips&&(
              <div style={{marginBottom:24}}>
                <p style={{...T.labelSm,color:C.black,fontSize:11,letterSpacing:"0.12em",marginBottom:14}}>{subCatLabel}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  <button onClick={()=>setTypeFilter("All")} style={pillStyle(typeFilter==="All")}>{L.allSub}</button>
                  {showTypeChips.map(([lbl,key])=>(
                    <button key={key} onClick={()=>setTypeFilter(key)} style={pillStyle(typeFilter===key)}>{lbl}</button>
                  ))}
                </div>
              </div>
            )}

            {/* BRAND */}
            <div style={{marginBottom:24}}>
              <p style={{...T.labelSm,color:C.black,fontSize:11,letterSpacing:"0.12em",marginBottom:14}}>{L.brandLabel||"BRAND"}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                <button onClick={()=>setBrandFilter("All")} style={pillStyle(brandFilter==="All")}>{L.allSub}</button>
                {availableBrands.map(b=>(
                  <button key={b} onClick={()=>setBrandFilter(b)} style={pillStyle(brandFilter===b)}>{b}</button>
                ))}
              </div>
            </div>

            {/* SIZE */}
            {availableSizes.length>0&&(
              <div style={{marginBottom:24}}>
                <p style={{...T.labelSm,color:C.black,fontSize:11,letterSpacing:"0.12em",marginBottom:14}}>{L.sizeLabel||"SIZE"}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  <button onClick={()=>setSizeFilter([])} style={pillStyle(sizeFilter.length===0)}>{L.allSub}</button>
                  {availableSizes.map(s=>{
                    const active=sizeFilter.includes(s);
                    return <button key={s} onClick={()=>setSizeFilter(prev=>active?prev.filter(x=>x!==s):[...prev,s])} style={pillStyle(active)}>{s}</button>;
                  })}
                </div>
              </div>
            )}

            {/* COLOR */}
            <div style={{marginBottom:24}}>
              <p style={{...T.labelSm,color:C.black,fontSize:11,letterSpacing:"0.12em",marginBottom:14}}>{L.colorLabel||"COLOR"}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                <button onClick={()=>setColorFilter("All")} style={{...pillStyle(colorFilter==="All"),display:"flex",alignItems:"center",gap:6}}>{L.allSub}</button>
                {allColors.map(c=>(
                  <button key={c} onClick={()=>setColorFilter(colorFilter===c?"All":c)}
                    style={{...pillStyle(colorFilter===c),display:"flex",alignItems:"center",gap:8}}>
                    <span style={{width:14,height:14,borderRadius:"50%",background:colorMap[c]||C.gray,border:"1px solid rgba(0,0,0,0.12)",flexShrink:0}}/>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* PRICE */}
            <div style={{marginBottom:24}}>
              <p style={{...T.labelSm,color:C.black,fontSize:11,letterSpacing:"0.12em",marginBottom:14}}>{L.priceLabel}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {[["all",L.allPrices],["under200",L.underGel200],["200-400",L.gel200to400],["over400",L.overGel400]].map(([v,l])=>(
                  <button key={v} onClick={()=>setPrice(v)} style={pillStyle(price===v)}>{l}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky bottom */}
          <div style={{position:"sticky",bottom:0,padding:"16px 24px",background:C.cream,borderTop:`1px solid ${C.lgray}`,display:"flex",gap:12}}>
            {activeFilters>0&&(
              <button onClick={clearAll}
                style={{flex:0,padding:"16px 20px",background:"transparent",color:C.black,border:`1px solid ${C.lgray}`,...T.labelSm,fontSize:11,cursor:"pointer",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>
                {L.clearFilters}
              </button>
            )}
            <button onClick={()=>setRefineOpen(false)}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}
              style={{flex:1,padding:"16px",background:C.black,color:C.white,border:"none",...T.label,fontSize:12,cursor:"pointer",letterSpacing:"0.08em",transition:"opacity 0.2s"}}>
              {L.showResults||"Show"} {filtered.length} {filtered.length!==1?(L.results||"results"):(L.result||"result")}
            </button>
          </div>
        </div>
      )}

      <Footer setPage={setPage} L={L} mobile={mobile}/>
    </div>
  );
}
