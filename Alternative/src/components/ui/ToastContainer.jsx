import { C, T } from '../../constants/theme.js';
import { IconCheck, IconCross } from '../icons/Icons.jsx';

// ── TOAST SYSTEM ──────────────────────────────────────────────────────────────
export default function ToastContainer({toasts,mobile}) {
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:1000,display:"flex",flexDirection:"column",gap:0,pointerEvents:"none"}}>
      {toasts.map(t=>(
        <div key={t.id} style={{
          background:t.type==="error"?C.red:t.type==="success"?C.green:C.black,
          color:C.white,padding:"16px 20px",display:"flex",alignItems:"center",gap:12,
          width:"100%",boxShadow:"0 -4px 24px rgba(0,0,0,0.15)",
          animation:`toastIn 0.3s ease`,
        }}>
          {t.type==="error"?<IconCross size={18} color={C.white} stroke={2}/>:<IconCheck size={18} color={C.white} stroke={2}/>}
          <span style={{...T.bodySm,color:C.white}}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
