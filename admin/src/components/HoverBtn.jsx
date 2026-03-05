import { useState } from 'react';
import { C, T } from '../constants/theme.js';

export default function HoverBtn({onClick,variant="primary",children,style={},disabled=false}) {
  const [h,setH]=useState(false);
  const base={display:"inline-flex",alignItems:"center",justifyContent:"center",...T.label,border:"none",transition:"all 0.25s",letterSpacing:"0.14em",opacity:disabled?0.5:1,cursor:disabled?"not-allowed":"pointer"};
  const vs={
    primary:{...base,padding:"14px 40px",background:h&&!disabled?C.brown:C.black,color:C.cream},
    secondary:{...base,padding:"13px 39px",background:h&&!disabled?C.black:"transparent",color:h&&!disabled?C.cream:C.black,border:`1px solid ${C.black}`},
    tan:{...base,padding:"14px 40px",background:h&&!disabled?C.brown:C.tan,color:C.white},
    ghost:{...base,padding:"10px 24px",background:"transparent",color:h?C.black:C.gray,border:`1px solid ${C.lgray}`,fontSize:10},
    danger:{...base,padding:"11px 24px",background:h?"#6b1818":C.red,color:C.white,fontSize:10},
  };
  return <button type="button" onClick={disabled?undefined:onClick} style={{...vs[variant],...style}} disabled={disabled}
    onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>{children}</button>;
}
