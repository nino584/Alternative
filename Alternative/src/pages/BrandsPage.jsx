import { C, T } from '../constants/theme.js';
import Footer from '../components/layout/Footer.jsx';
import SEO from '../components/SEO.jsx';
import { pageMeta, breadcrumbSchema } from '../utils/seo.js';

// ── BRANDS PAGE ──────────────────────────────────────────────────────────────
export default function BrandsPage({setPage,setSelected,L,mobile}) {
  const px=mobile?"16px":"40px";

  const BRANDS = [
    "Acne Studios","Ahlem","Alaia","Alessandra Rich","Alexander McQueen",
    "Alexander Wang","Ami Paris","Amina Muaddi","Balenciaga","Baziszt",
    "Bernadette","Blumarine","Bottega Veneta","Brioni","Brunello Cucinelli",
    "Burberry","Cartier","Celine","Cesare Attolini","Chloé",
    "Christian Louboutin","Diesel","Dior","District Vision","Dita",
    "Dolce & Gabbana","Dries Van Noten","Dsquared2","Fendi","Givenchy",
    "Golden Goose","Gucci","Jacquemus","Jimmy Choo","Kuboraum",
    "Lardini","LBM","Loewe","Loro Piana","Magda Butrym",
    "Maison Margiela","Manzoni 24","Max Mara","Miu Miu","Moncler",
    "Moschino","Off-White","Palm Angels","Phoebe Philo","Prada",
    "R13","Rick Owens","Saint Laurent","Salvatore Ferragamo","Sato",
    "Seraphine","Simonetta Ravizza","Stone Island","T Henri","The Row",
    "Thom Browne","Tod's","Tom Ford","Valentino","Versace",
    "Vetements","Wardrobe NYC","Zegna"
  ];

  // Split into 2 columns
  const mid = Math.ceil(BRANDS.length / 2);
  const col1 = BRANDS.slice(0, mid);
  const col2 = BRANDS.slice(mid);

  return (
    <div style={{paddingTop:mobile?52:80,minHeight:"100vh",background:C.white||"#fff"}}>
      <SEO {...pageMeta("brands")} schema={breadcrumbSchema([{name:"Home",url:"/"},{name:"Designers"}])} />
      <div style={{maxWidth:1360,margin:"0 auto",padding:`${mobile?"24px":"48px"} ${px} 0`}}>
        <p style={{...T.labelSm,color:C.tan,marginBottom:mobile?32:48,fontSize:mobile?12:14,letterSpacing:2}}>DESIGNERS</p>
        
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:mobile?"0 20px":"0 64px"}}>
          {[col1,col2].map((col,ci)=>(
            <div key={ci}>
              {col.map(brand=>(
                <button key={brand} onClick={()=>{window.__initBrand=brand;setPage("catalog");}}
                  onMouseEnter={e=>e.currentTarget.querySelector("span").style.color=C.tan}
                  onMouseLeave={e=>e.currentTarget.querySelector("span").style.color=C.black}
                  style={{display:"block",background:"none",border:"none",padding:`${mobile?"10px":"12px"} 0`,textAlign:"left",cursor:"pointer",width:"100%"}}>
                  <span style={{...T.label,color:C.black,fontSize:mobile?12:13,fontWeight:500,textTransform:"uppercase",letterSpacing:mobile?0.5:1,textDecoration:"underline",textUnderlineOffset:3,textDecorationColor:C.black,transition:"color 0.2s"}}>
                    {brand}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"64px 0 0"}}>
        <Footer setPage={setPage} L={L} mobile={mobile}/>
      </div>
    </div>
  );
}
