import { C, T } from '../../constants/theme.js';

// ── SIZE GUIDE MODAL ──────────────────────────────────────────────────────────
export default function SizeGuideModal({onClose,category,L}) {
  const guides = {
    Clothing:{
      headers:["Size","Chest (cm)","Waist (cm)","Hips (cm)"],
      rows:[["XS","82–85","64–67","88–91"],["S","86–89","68–71","92–95"],["M","90–93","72–75","96–99"],["L","94–97","76–79","100–103"],["XL","98–102","80–84","104–108"],["XXL","103–108","85–90","109–114"]],
    },
    Shoes:{
      headers:["EU","UK","US","Foot Length (cm)"],
      rows:[["36","3.5","6","22.5"],["37","4","6.5","23"],["38","5","7.5","24"],["39","5.5","8","24.5"],["40","6.5","9","25.5"],["41","7","9.5","26"],["42","8","10.5","27"],["43","9","11.5","28"]],
    },
    Bags:{
      headers:["Size","Dimensions","Best for"],
      rows:[["Mini","< 18cm","Evening, essentials only"],["Small","18–25cm","Phone, cards, keys"],["Medium","25–35cm","Daily essentials"],["Large","35cm+","Work, travel"]],
    },
  };
  const guide=guides[category]||guides.Clothing;
  return (
    <div style={{position:"fixed",inset:0,zIndex:400,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.75)"}}/>
      <div style={{position:"relative",background:C.cream,width:"100%",maxWidth:560,padding:"40px",maxHeight:"80vh",overflow:"auto",animation:"fadeIn 0.25s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
          <div>
            <p style={{...T.labelSm,color:C.tan,marginBottom:6,fontSize:9}}>{L&&L.sizingGuide||"Sizing guide"}</p>
            <h3 style={{...T.displaySm,color:C.black}}>{category} {L&&L.sizes||"Sizes"}</h3>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.gray,fontSize:24}}>×</button>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{borderBottom:`2px solid ${C.lgray}`}}>
              {guide.headers.map(h=><th key={h} style={{...T.labelSm,color:C.gray,fontSize:9,padding:"8px 12px",textAlign:"left",fontWeight:500}}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {guide.rows.map((row,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${C.lgray}`,background:i%2===0?"transparent":C.offwhite}}>
                {row.map((cell,j)=><td key={j} style={{...T.bodySm,color:j===0?C.black:C.gray,padding:"10px 12px",fontWeight:j===0?500:300}}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{...T.labelSm,color:C.gray,fontSize:9,marginTop:20}}>{L&&L.sizeNote||'Measurements are approximate.'}</p>
      </div>
    </div>
  );
}
