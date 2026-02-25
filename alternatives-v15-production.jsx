import { useState, useEffect, useRef, useCallback } from "react";

// ── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
function useIsMobile(breakpoint=768) {
  const [m,setM]=useState(()=>typeof window!=="undefined"?window.innerWidth<breakpoint:false);
  useEffect(()=>{
    const fn=()=>setM(window.innerWidth<breakpoint);
    window.addEventListener("resize",fn);
    return()=>window.removeEventListener("resize",fn);
  },[breakpoint]);
  return m;
}

// ── BRAND IMAGES ──────────────────────────────────────────────────────────────
const BI = {
  cover: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27800%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%238B7355%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%236b5a42%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27800%27%20y2%3D%27552.0%27%20stroke%3D%27%23ffffff%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Cpath%20d%3D%22M304.0%20150.0%20L352.0%20180.0%20L352.0%20390.0%20L448.00000000000006%20390.0%20L448.00000000000006%20180.0%20L496.0%20150.0%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cline%20x1%3D%22352.0%22%20y1%3D%22180.0%22%20x2%3D%22448.00000000000006%22%20y2%3D%22180.0%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221%22%20opacity%3D%220.4%22%2F%3E%0A%3Ctext%20x%3D%27400.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23ffffff%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3EALTERNATIVE%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  editorial: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27800%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23584638%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%233d2f25%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23d4c8b8%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23d4c8b8%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27800%27%20y2%3D%27552.0%27%20stroke%3D%27%23d4c8b8%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Ccircle%20cx%3D%22400.0%22%20cy%3D%22168.00000000000003%22%20r%3D%2242.00000000000001%22%20fill%3D%22none%22%20stroke%3D%22%23d4c8b8%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cpath%20d%3D%22M304.0%20228.0%20Q400.0%20210.0%20496.0%20228.0%20L480.0%20408.00000000000006%20L320.0%20408.00000000000006%20Z%22%20fill%3D%22none%22%20stroke%3D%22%23d4c8b8%22%20stroke-width%3D%221.5%22%20opacity%3D%220.5%22%2F%3E%0A%3Ctext%20x%3D%27400.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23d4c8b8%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3EEDITORIAL%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  bag: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27800%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23b19a7a%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%238d7a5e%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27800%27%20y2%3D%27552.0%27%20stroke%3D%27%23ffffff%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Crect%20x%3D%22280.0%22%20y%3D%22168.00000000000003%22%20width%3D%22240.0%22%20height%3D%22210.0%22%20rx%3D%224%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cpath%20d%3D%22M320.0%20168.00000000000003%20Q320.0%20108.0%20400.0%20108.0%20Q480.0%20108.0%20480.0%20168.00000000000003%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%0A%3Ctext%20x%3D%27400.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23ffffff%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3ELEATHER%20GOODS%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  store: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27800%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23a8a296%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%238a8076%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27800%27%20y2%3D%27552.0%27%20stroke%3D%27%23ffffff%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Crect%20x%3D%22240.0%22%20y%3D%22180.0%22%20width%3D%22320.0%22%20height%3D%22210.0%22%20rx%3D%222%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.5%22%20opacity%3D%220.5%22%2F%3E%3Cline%20x1%3D%22400.0%22%20y1%3D%22180.0%22%20x2%3D%22400.0%22%20y2%3D%22390.0%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221%22%20opacity%3D%220.3%22%2F%3E%3Crect%20x%3D%22240.0%22%20y%3D%22162.0%22%20width%3D%22320.0%22%20height%3D%2236.0%22%20rx%3D%221%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221%22%20opacity%3D%220.4%22%2F%3E%0A%3Ctext%20x%3D%27400.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23ffffff%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3ECONCEPT%20STORE%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  hero_bag: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27800%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23b19a7a%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23967f63%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27800%27%20y2%3D%27552.0%27%20stroke%3D%27%23ffffff%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Crect%20x%3D%22280.0%22%20y%3D%22168.00000000000003%22%20width%3D%22240.0%22%20height%3D%22210.0%22%20rx%3D%224%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cpath%20d%3D%22M320.0%20168.00000000000003%20Q320.0%20108.0%20400.0%20108.0%20Q480.0%20108.0%20480.0%20168.00000000000003%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%0A%3Ctext%20x%3D%27400.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23ffffff%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3ECURATED%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  packaging: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27800%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23d4d0c8%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23bab5ab%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23584638%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23584638%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27800%27%20y2%3D%27552.0%27%20stroke%3D%27%23584638%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Crect%20x%3D%22280.0%22%20y%3D%22168.00000000000003%22%20width%3D%22240.0%22%20height%3D%22210.0%22%20rx%3D%224%22%20fill%3D%22none%22%20stroke%3D%22%23584638%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cpath%20d%3D%22M320.0%20168.00000000000003%20Q320.0%20108.0%20400.0%20108.0%20Q480.0%20108.0%20480.0%20168.00000000000003%22%20fill%3D%22none%22%20stroke%3D%22%23584638%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%0A%3Ctext%20x%3D%27400.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23584638%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3EPACKAGED%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  store_interior: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27800%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23584638%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%2340322a%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23b19a7a%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23b19a7a%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27800%27%20y2%3D%27552.0%27%20stroke%3D%27%23b19a7a%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Crect%20x%3D%22240.0%22%20y%3D%22180.0%22%20width%3D%22320.0%22%20height%3D%22210.0%22%20rx%3D%222%22%20fill%3D%22none%22%20stroke%3D%22%23b19a7a%22%20stroke-width%3D%221.5%22%20opacity%3D%220.5%22%2F%3E%3Cline%20x1%3D%22400.0%22%20y1%3D%22180.0%22%20x2%3D%22400.0%22%20y2%3D%22390.0%22%20stroke%3D%22%23b19a7a%22%20stroke-width%3D%221%22%20opacity%3D%220.3%22%2F%3E%3Crect%20x%3D%22240.0%22%20y%3D%22162.0%22%20width%3D%22320.0%22%20height%3D%2236.0%22%20rx%3D%221%22%20fill%3D%22none%22%20stroke%3D%22%23b19a7a%22%20stroke-width%3D%221%22%20opacity%3D%220.4%22%2F%3E%0A%3Ctext%20x%3D%27400.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23b19a7a%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3EINTERIOR%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  man_editorial: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27800%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%232a2420%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23191919%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23b19a7a%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23b19a7a%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27800%27%20y2%3D%27552.0%27%20stroke%3D%27%23b19a7a%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Ccircle%20cx%3D%22400.0%22%20cy%3D%22168.00000000000003%22%20r%3D%2242.00000000000001%22%20fill%3D%22none%22%20stroke%3D%22%23b19a7a%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cpath%20d%3D%22M304.0%20228.0%20Q400.0%20210.0%20496.0%20228.0%20L480.0%20408.00000000000006%20L320.0%20408.00000000000006%20Z%22%20fill%3D%22none%22%20stroke%3D%22%23b19a7a%22%20stroke-width%3D%221.5%22%20opacity%3D%220.5%22%2F%3E%0A%3Ctext%20x%3D%27400.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23b19a7a%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3EMENSWEAR%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  ribbon: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27800%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23b19a7a%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23c4ae90%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27800%27%20y2%3D%27552.0%27%20stroke%3D%27%23ffffff%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Cpath%20d%3D%22M240.0%20180.0%20Q400.0%20270.0%20560.0%20180.0%20Q400.0%20330.0%20240.0%20360.0%20Q400.0%20420.0%20560.0%20360.0%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%0A%3Ctext%20x%3D%27400.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23ffffff%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3ESILK%20%26%20CASHMERE%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  thankyou: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27800%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23e7e8e1%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23d4d0c8%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23584638%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23584638%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27800%27%20y2%3D%27552.0%27%20stroke%3D%27%23584638%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Crect%20x%3D%22160.0%22%20y%3D%22264.0%22%20width%3D%22480.0%22%20height%3D%2248.0%22%20rx%3D%223%22%20fill%3D%22none%22%20stroke%3D%22%23584638%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Ccircle%20cx%3D%22280.0%22%20cy%3D%22288.0%22%20r%3D%2224.0%22%20fill%3D%22none%22%20stroke%3D%22%23584638%22%20stroke-width%3D%221.2%22%20opacity%3D%220.6%22%2F%3E%0A%3Ctext%20x%3D%27400.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23584638%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3EACCESSORIES%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  logo_page: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27800%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23f4f2ed%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23e7e8e1%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23191919%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23191919%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27800%27%20y2%3D%27552.0%27%20stroke%3D%27%23191919%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Crect%20x%3D%22240.0%22%20y%3D%22180.0%22%20width%3D%22320.0%22%20height%3D%22210.0%22%20rx%3D%222%22%20fill%3D%22none%22%20stroke%3D%22%23191919%22%20stroke-width%3D%221.5%22%20opacity%3D%220.5%22%2F%3E%3Cline%20x1%3D%22400.0%22%20y1%3D%22180.0%22%20x2%3D%22400.0%22%20y2%3D%22390.0%22%20stroke%3D%22%23191919%22%20stroke-width%3D%221%22%20opacity%3D%220.3%22%2F%3E%3Crect%20x%3D%22240.0%22%20y%3D%22162.0%22%20width%3D%22320.0%22%20height%3D%2236.0%22%20rx%3D%221%22%20fill%3D%22none%22%20stroke%3D%22%23191919%22%20stroke-width%3D%221%22%20opacity%3D%220.4%22%2F%3E%0A%3Ctext%20x%3D%27400.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23191919%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3EALTERNATIVE%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  bag_stone: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27800%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27bg%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%270.4%27%20y2%3D%271%27%3E%0A%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23584638%27%2F%3E%0A%3Cstop%20offset%3D%2740%25%27%20stop-color%3D%27%233d2f25%27%2F%3E%0A%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23191919%27%2F%3E%0A%3C%2FlinearGradient%3E%0A%3ClinearGradient%20id%3D%27warm%27%20x1%3D%270.2%27%20y1%3D%270%27%20x2%3D%270.8%27%20y2%3D%271%27%3E%0A%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23b19a7a%27%20stop-opacity%3D%270.18%27%2F%3E%0A%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23584638%27%20stop-opacity%3D%270%27%2F%3E%0A%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27glow%27%20cx%3D%270.65%27%20cy%3D%270.4%27%20r%3D%270.5%27%3E%0A%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23b19a7a%27%20stop-opacity%3D%270.12%27%2F%3E%0A%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23191919%27%20stop-opacity%3D%270%27%2F%3E%0A%3C%2FradialGradient%3E%0A%3ClinearGradient%20id%3D%27stripe%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%270%27%20y2%3D%271%27%3E%0A%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23b19a7a%27%20stop-opacity%3D%270.08%27%2F%3E%0A%3Cstop%20offset%3D%2750%25%27%20stop-color%3D%27%23b19a7a%27%20stop-opacity%3D%270.03%27%2F%3E%0A%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23b19a7a%27%20stop-opacity%3D%270.08%27%2F%3E%0A%3C%2FlinearGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23bg%29%27%2F%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23warm%29%27%2F%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23glow%29%27%2F%3E%0A%0A%3C%21--%20Architectural%20lines%20inspired%20by%20store%20interior%20%28brand%20book%20p7%29%20--%3E%0A%3Cline%20x1%3D%27520%27%20y1%3D%270%27%20x2%3D%27520%27%20y2%3D%27600%27%20stroke%3D%27%23b19a7a%27%20stroke-width%3D%270.5%27%20opacity%3D%270.08%27%2F%3E%0A%3Cline%20x1%3D%27540%27%20y1%3D%270%27%20x2%3D%27540%27%20y2%3D%27600%27%20stroke%3D%27%23b19a7a%27%20stroke-width%3D%270.3%27%20opacity%3D%270.06%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27300%27%20x2%3D%27800%27%20y2%3D%27300%27%20stroke%3D%27%23b19a7a%27%20stroke-width%3D%270.3%27%20opacity%3D%270.05%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27400%27%20x2%3D%27800%27%20y2%3D%27400%27%20stroke%3D%27%23b19a7a%27%20stroke-width%3D%270.3%27%20opacity%3D%270.05%27%2F%3E%0A%0A%3C%21--%20Light%20beam%20effect%20from%20brand%20book%20store%20photos%20--%3E%0A%3Cpolygon%20points%3D%27450%2C0%20650%2C0%20550%2C600%20400%2C600%27%20fill%3D%27%23b19a7a%27%20opacity%3D%270.04%27%2F%3E%0A%3Cpolygon%20points%3D%27500%2C0%20580%2C0%20520%2C600%20460%2C600%27%20fill%3D%27%23e7e8e1%27%20opacity%3D%270.03%27%2F%3E%0A%0A%3C%21--%20Stylized%20figure%20silhouette%20inspired%20by%20editorial%20man%20%28brand%20book%20p3%29%20--%3E%0A%3C%21--%20Head%20--%3E%0A%3Cellipse%20cx%3D%27480%27%20cy%3D%27115%27%20rx%3D%2728%27%20ry%3D%2732%27%20fill%3D%27%232a2118%27%20opacity%3D%270.85%27%2F%3E%0A%3C%21--%20Hat%2Fberet%20--%3E%0A%3Cellipse%20cx%3D%27480%27%20cy%3D%2798%27%20rx%3D%2734%27%20ry%3D%2710%27%20fill%3D%27%233d2f25%27%20opacity%3D%270.9%27%2F%3E%0A%3Cellipse%20cx%3D%27478%27%20cy%3D%2795%27%20rx%3D%2728%27%20ry%3D%2714%27%20fill%3D%27%232a2118%27%20opacity%3D%270.8%27%2F%3E%0A%3C%21--%20Neck%20--%3E%0A%3Crect%20x%3D%27472%27%20y%3D%27145%27%20width%3D%2716%27%20height%3D%2715%27%20fill%3D%27%232a2118%27%20opacity%3D%270.7%27%2F%3E%0A%3C%21--%20Scarf%20--%3E%0A%3Cpath%20d%3D%27M462%20148%20Q480%20165%20498%20148%20Q495%20175%20480%20180%20Q465%20175%20462%20148%27%20fill%3D%27%23a8a296%27%20opacity%3D%270.6%27%2F%3E%0A%0A%3C%21--%20Overcoat%20body%20--%3E%0A%3Cpath%20d%3D%27M435%20160%20L440%20380%20L455%20500%20L505%20500%20L520%20380%20L525%20160%20Q480%20145%20435%20160%27%20fill%3D%27%233d2f25%27%20opacity%3D%270.85%27%2F%3E%0A%3C%21--%20Coat%20lapels%20--%3E%0A%3Cpath%20d%3D%27M450%20160%20L472%20220%20L480%20160%27%20fill%3D%27%234a3828%27%20opacity%3D%270.7%27%2F%3E%0A%3Cpath%20d%3D%27M510%20160%20L488%20220%20L480%20160%27%20fill%3D%27%234a3828%27%20opacity%3D%270.7%27%2F%3E%0A%3C%21--%20Coat%20button%20line%20--%3E%0A%3Cline%20x1%3D%27480%27%20y1%3D%27220%27%20x2%3D%27480%27%20y2%3D%27420%27%20stroke%3D%27%232a2118%27%20stroke-width%3D%271%27%20opacity%3D%270.4%27%2F%3E%0A%3Ccircle%20cx%3D%27480%27%20cy%3D%27260%27%20r%3D%272.5%27%20fill%3D%27%23191919%27%20opacity%3D%270.5%27%2F%3E%0A%3Ccircle%20cx%3D%27480%27%20cy%3D%27310%27%20r%3D%272.5%27%20fill%3D%27%23191919%27%20opacity%3D%270.5%27%2F%3E%0A%3Ccircle%20cx%3D%27480%27%20cy%3D%27360%27%20r%3D%272.5%27%20fill%3D%27%23191919%27%20opacity%3D%270.5%27%2F%3E%0A%0A%3C%21--%20Left%20arm%20holding%20bag%20--%3E%0A%3Cpath%20d%3D%27M435%20175%20L400%20280%20L395%20380%20L410%20380%20L420%20300%20L440%20210%27%20fill%3D%27%233d2f25%27%20opacity%3D%270.8%27%2F%3E%0A%0A%3C%21--%20Duffle%20bag%20--%3E%0A%3Cellipse%20cx%3D%27395%27%20cy%3D%27395%27%20rx%3D%2755%27%20ry%3D%2735%27%20fill%3D%27%23584638%27%20opacity%3D%270.85%27%2F%3E%0A%3Cellipse%20cx%3D%27395%27%20cy%3D%27395%27%20rx%3D%2755%27%20ry%3D%2735%27%20fill%3D%27none%27%20stroke%3D%27%234a3828%27%20stroke-width%3D%271.5%27%20opacity%3D%270.6%27%2F%3E%0A%3Crect%20x%3D%27345%27%20y%3D%27380%27%20width%3D%27100%27%20height%3D%2730%27%20rx%3D%275%27%20fill%3D%27%23584638%27%20opacity%3D%270.9%27%2F%3E%0A%3Cpath%20d%3D%27M365%20380%20Q395%20350%20425%20380%27%20fill%3D%27none%27%20stroke%3D%27%236b5a42%27%20stroke-width%3D%272%27%20opacity%3D%270.7%27%2F%3E%0A%3C%21--%20Bag%20details%20--%3E%0A%3Cline%20x1%3D%27370%27%20y1%3D%27390%27%20x2%3D%27420%27%20y2%3D%27390%27%20stroke%3D%27%236b5a42%27%20stroke-width%3D%270.8%27%20opacity%3D%270.5%27%2F%3E%0A%3Crect%20x%3D%27382%27%20y%3D%27383%27%20width%3D%2726%27%20height%3D%2710%27%20rx%3D%272%27%20fill%3D%27%236b5a42%27%20opacity%3D%270.4%27%2F%3E%0A%0A%3C%21--%20Right%20arm%20--%3E%0A%3Cpath%20d%3D%27M525%20175%20L555%20280%20L550%20420%20L537%20420%20L535%20300%20L520%20210%27%20fill%3D%27%233d2f25%27%20opacity%3D%270.8%27%2F%3E%0A%0A%3C%21--%20Legs%20--%3E%0A%3Cpath%20d%3D%27M455%20490%20L452%20580%20L460%20582%20L467%20500%27%20fill%3D%27%232a2118%27%20opacity%3D%270.8%27%2F%3E%0A%3Cpath%20d%3D%27M505%20490%20L508%20580%20L500%20582%20L493%20500%27%20fill%3D%27%232a2118%27%20opacity%3D%270.8%27%2F%3E%0A%3C%21--%20Shoes%20--%3E%0A%3Cellipse%20cx%3D%27456%27%20cy%3D%27582%27%20rx%3D%2714%27%20ry%3D%275%27%20fill%3D%27%233d2f25%27%20opacity%3D%270.9%27%2F%3E%0A%3Cellipse%20cx%3D%27504%27%20cy%3D%27582%27%20rx%3D%2714%27%20ry%3D%275%27%20fill%3D%27%233d2f25%27%20opacity%3D%270.9%27%2F%3E%0A%0A%3C%21--%20Floor%20reflection%2Fshadow%20--%3E%0A%3Cellipse%20cx%3D%27480%27%20cy%3D%27590%27%20rx%3D%2790%27%20ry%3D%278%27%20fill%3D%27%23191919%27%20opacity%3D%270.3%27%2F%3E%0A%0A%3C%21--%20Brand%20typography%20overlay%20--%3E%0A%3Ctext%20x%3D%2780%27%20y%3D%27480%27%20font-family%3D%27Georgia%2Cserif%27%20font-size%3D%2772%27%20font-style%3D%27italic%27%20fill%3D%27%23e7e8e1%27%20opacity%3D%270.07%27%20letter-spacing%3D%27-2%27%3EAlternative%3C%2Ftext%3E%0A%3Ctext%20x%3D%2780%27%20y%3D%27510%27%20font-family%3D%27Arial%2Csans-serif%27%20font-size%3D%2712%27%20fill%3D%27%23e7e8e1%27%20opacity%3D%270.06%27%20letter-spacing%3D%276%27%3ECONCEPT%20STORE%3C%2Ftext%3E%0A%0A%3C%21--%20Subtle%20A%20monogram%20watermark%20--%3E%0A%3Cpath%20d%3D%27M700%20520%20L680%20580%20h8l4-10h16l4%2010h8L700%20520zm0%2016l6%2018h-12l6-18z%27%20fill%3D%27%23b19a7a%27%20opacity%3D%270.06%27%2F%3E%0A%3Crect%20x%3D%27694%27%20y%3D%27560%27%20width%3D%2712%27%20height%3D%272%27%20fill%3D%27%23b19a7a%27%20opacity%3D%270.05%27%2F%3E%0A%3Crect%20x%3D%27696%27%20y%3D%27565%27%20width%3D%278%27%20height%3D%272%27%20fill%3D%27%23b19a7a%27%20opacity%3D%270.05%27%2F%3E%0A%0A%3C%21--%20Top%20corner%20brand%20accent%20--%3E%0A%3Crect%20x%3D%270%27%20y%3D%270%27%20width%3D%273%27%20height%3D%27100%27%20fill%3D%27%23b19a7a%27%20opacity%3D%270.15%27%2F%3E%0A%3C%2Fsvg%3E",
  story_sneakers: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27800%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23584638%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%2345372c%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23d4c8b8%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23d4c8b8%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27800%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27800%27%20y2%3D%27552.0%27%20stroke%3D%27%23d4c8b8%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Cellipse%20cx%3D%22400.0%22%20cy%3D%22312.0%22%20rx%3D%22144.0%22%20ry%3D%2248.0%22%20fill%3D%22none%22%20stroke%3D%22%23d4c8b8%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cpath%20d%3D%22M256.0%20312.0%20Q280.0%20228.0%20400.0%20210.0%20Q520.0%20228.0%20544.0%20312.0%22%20fill%3D%22none%22%20stroke%3D%22%23d4c8b8%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%0A%3Ctext%20x%3D%27400.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23d4c8b8%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3EFOOTWEAR%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
};


// ── COLORS ────────────────────────────────────────────────────────────────────
const C = {
  black:"#191919", cream:"#e7e8e1", tan:"#b19a7a", brown:"#584638",
  gray:"#a8a296", lgray:"#d4d0c8", offwhite:"#f4f2ed", white:"#ffffff",
  green:"#1a6b3a", red:"#8b2020",
};

// ── GLOBAL CSS ────────────────────────────────────────────────────────────────
const STYLES = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'Jost',sans-serif;background:#e7e8e1;color:#191919;-webkit-font-smoothing:antialiased}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#e7e8e1}::-webkit-scrollbar-thumb{background:#b19a7a}
  button{cursor:pointer;font-family:'Jost',sans-serif}
  input,select,textarea{font-family:'Jost',sans-serif;-webkit-appearance:none}
  img{display:block}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes toastIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes toastOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(16px)}}
  @keyframes spinAnim{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
`;

// ── TRANSLATIONS ─────────────────────────────────────────────────────────────
const LANG_DATA = {
  en: {
    // Nav
    collection:"Collection", howItWorks:"How It Works", about:"About",
    orders:"Orders", signIn:"Sign In", search:"Search",
    // Catalog
    shop:"Shop", theCollection:"The Collection", pieces:"pieces", piece:"piece",
    sortNew:"New First", sortLow:"Price: Low → High", sortHigh:"Price: High → Low",
    allSections:"All", womenswear:"Womenswear", menswear:"Menswear", kidswear:"Kidswear",
    allSub:"All", newIn:"New In", clothing:"Clothing", shoes:"Shoes", bags:"Bags",
    accessories:"Accessories", watches:"Watches", jewellery:"Jewellery", sale:"Sale", brands:"Brands",
    allPrice:"All price", clearFilters:"Clear filters", noItems:"No items found",
    adjustFilters:"Try adjusting your filters or browse all sections.",
    viewItem:"View item →",
    // Product
    reserveNow:"Reserve now (50%)", payDelivery:"Pay on delivery (50%)",
    selectSize:"Select Size", selectSizeWarn:"⚠ Please select a size",
    sizeGuide:"Size guide", sizeFit:"Size & Fit", runSmall:"Runs small",
    trueToSize:"True to size", runsLarge:"Runs large", fullSizeGuide:"Full size guide →",
    videoVerification:"Video Verification", videoDesc:"Our team in Shanghai films your item in full before dispatch and sends it directly to your WhatsApp. See hardware, stitching, material — in motion.",
    videoPrice:"GEL 28 at checkout", itemDetails:"Item Details",
    leadTime:"Lead time", delivery:"Delivery", verified:"Verified",
    verifiedVal:"✓ Liza-checked, Shanghai", deliveryVal:"Tbilisi, Georgia",
    reserve:"Reserve", freeCancellation:"Free cancellation before shipping",
    askWhatsApp:"Ask on WhatsApp", fromCollection:"From the same collection",
    // Preorder
    yourDetails:"Your Details", reviewPay:"Review & Pay", orderConfirmed:"Order Confirmed",
    contactDetails:"Contact Details", fullName:"Full name *", whatsapp:"WhatsApp number *",
    notes:"Notes", notesPlaceholder:"Size questions, color preferences…",
    enterNamePhone:"Please enter your name and WhatsApp number.",
    addVideo:"Add Video Verification — GEL 28",
    videoCheckDesc:"We film your item before shipping and send via WhatsApp. See the real product in motion.",
    orderSummary:"Order Summary", item:"Item", size:"Size",
    depositNow:"Deposit now (50%)", balanceDelivery:"Balance on delivery",
    videoVerif:"Video verification", total:"Total",
    refundNote:"Deposit is fully refundable if you cancel before shipping.",
    videoNote:" Video will be sent to your WhatsApp before dispatch.",
    paymentMethod:"Payment Method", bogTransfer:"BOG / TBC Bank Transfer",
    cardPayment:"Card Payment", recommended:"Recommended",
    contactNote:"We will contact you on WhatsApp at",
    within2h:"within 2 hours to confirm and arrange payment.",
    videoShipping:" A video walkthrough will be sent before shipping.",
    status:"Status", processing:"Processing", depositDue:"Deposit due",
    reviewOrder:"Review Order →", confirmPay:"Confirm & Pay Deposit",
    viewMyOrders:"View My Orders →",
    // Orders
    myOrders:"My Orders", continueShopping:"Continue Shopping",
    depositPaid:"Deposit paid", balanceOnDelivery:"Balance on delivery",
    currentStatus:"Current status", videoIncluded:"Video verification included — will be sent to WhatsApp before dispatch",
    cancelOrder:"Cancel Order (Free)", cancelConfirm:"Cancel this order? Your deposit will be fully refunded.",
    cancelSuccess:"Cancellation request sent. Deposit will be refunded in 3–5 days.",
    // Auth
    signInBtn:"Sign In", createAccount:"Create Account",
    emailLabel:"Email *", passwordLabel:"Password *",
    whatsappLabel:"WhatsApp Number", fullNameLabel:"Full Name *",
    enterEmailPass:"Enter email and password.", allRequired:"All marked fields are required.",
    passwordMin:"Password must be at least 6 characters.", validEmail:"Enter a valid email address.",
    welcomeBack:"Welcome back!", welcomeAdmin:"Welcome, Admin",
    demoHint:"Demo: demo@alternative.ge / demo123",
    adminHint:"Admin: admin@alternative.ge / admin123",
    // Account
    myAccount:"My Account", welcome:"Welcome,",
    adminPanel:"Admin Panel", signOut:"Sign Out",
    recentOrders:"Recent Orders", viewAll:"View all →",
    noOrdersYet:"No orders yet. Start browsing.", exploreCollection:"Explore Collection",
    settings:"Settings", accountSettings:"Account Settings",
    saveChanges:"Save Changes", settingsSaved:"Settings saved.",
    // Cart
    yourReserved:"Your", reservedOrders:"Reserved Orders",
    noReserved:"No reserved orders yet.", totalReserved:"Total Reserved",
    viewAllOrders:"View All Orders", removeItem:"Remove",
    // Search
    searchPlaceholder:"Search items, categories, colors…", noResults:"No results for",
    // Size Guide
    sizingGuide:"Sizing guide", sizes:"Sizes",
    sizeNote:"Measurements are approximate. If between sizes, size up for comfort.",
    // Toasts
    addedWishlist:"Added to wishlist ♡", removedWishlist:"Removed from wishlist",
    removedCart:"Item removed from orders.",
    orderReserved:"Order reserved! Check your orders.",
    // Homepage
    heroSub:"New In — Bottega Veneta, Loro Piana, Max Mara",
    heroBody:"Luxury fashion sourced from verified suppliers. Pay 50% to reserve, receive in 10–18 days. Tbilisi, Georgia.",
    heroCta1:"Shop New In", heroCta2:"How Pre-Order Works",
    editorialLabel:"The Alternative Way",
    editorialTitle:"Fashion curated by people who care.",
    editorialBody:"Every piece verified in Shanghai before it reaches Tbilisi.",
    ourProcess:"Our Process", scroll:"Scroll",
    featuredLabel:"Curated selection", featuredTitle:"Featured This Week",
    viewAll:"View all →", shopBy:"Shop by", collections:"Collections",
    extraService:"Extra Service", videoTitle:"Video verification before every shipment.",
    videoBody:"Add video verification to any order for just GEL 28. Our Shanghai team films a complete walkthrough — hardware, material, stitching — and sends it to your WhatsApp before dispatch.",
    shopAddService:"Shop & Add Service",
    lizaLabel:"Your eyes in Shanghai", lizaTitle:"Liza checks every item before it reaches you.",
    lizaBody:"Our sourcing partner physically handles every piece — checking hardware, stitching, and material quality — before it ships. What she verifies is what arrives.",
    itemsVerified:"Items verified", custSatisfaction:"Customer satisfaction", avgRating:"Average rating",
    // Trust bar
    trust1:"100% Authentic Guaranteed", trust2:"Secure 50% Deposit",
    trust3:"Delivery in 10–18 Days", trust4:"See Before You Buy",
    // Sections grid
    womensSub:"Bags, clothing, shoes & more", mensSub:"Watches, bags, clothing", kidsSub:"Fashion for the little ones",
    // How it works
    ourProcessLabel:"Our process", howOrderingWorks:"How ordering works",
    howSubtitle:"We source directly from verified suppliers and ship with editorial photos. Add optional video verification for complete peace of mind.",
    trackOrder:"Track your order", orderStatusVisible:"Order status — always visible",
    faq:"Frequently asked",
    // About
    ourStory:"Our story", aboutHero:"Built because the market offered two bad options.",
    lizaShanghai:"Liza in Shanghai", yourEyes:"Your eyes at the source.",
    lizaDesc1:"Liza is based in Shanghai. She physically visits our suppliers, handles every item, checks stitching, hardware, and material quality.",
    lizaDesc2:"She is the reason you can trust what arrives at your door.",
    honestPricing:"Honest pricing", honestBody:"Our price reflects actual quality and cost — not a brand tax or a landlord's rent.",
    noSurprises:"No surprises", noSurprisesBody:"The biggest failure of online fashion is the gap between photo and reality. We close it.",
    serviceProduct:"Service is product", serviceBody:"From first message to delivery, every touchpoint is designed to exceed your expectations.",
    // Footer
    footerDesc:"Curated fashion sourced directly from verified suppliers in Shanghai.",
    whatsappUs:"WhatsApp us",
    footerShop:"Shop", footerAccount:"Account", footerAbout:"About",
    newArrivals:"New Arrivals", myOrdersFooter:"My Orders",
    ourStoryFooter:"Our Story", lizaFooter:"Liza in Shanghai", faqFooter:"FAQ", contact:"Contact",
    copyright:"© 2026 Alternative Concept Store · Tbilisi, Georgia",
    // Admin
    adminPanelTitle:"Admin Panel", backToSite:"← Back to Site",
    allOrders:"All Orders", ordersTotal:"orders total",
    productCatalog:"Product Catalog", addProduct:"+ Add Product",
    statistics:"Statistics", updateStatus:"Update Status",
    orderID:"Order ID", customer:"Customer", whatsappCol:"WhatsApp",
    itemCol:"Item", statusCol:"Status", amountCol:"Amount", dateCol:"Date",
    topCategories:"Top Categories", ordersByStatus:"Orders by Status",
    totalOrders:"Total Orders", revenue:"Revenue (GEL)", pending:"Pending", videoOrders:"Video Orders",
    productMgmtSoon:"Product management coming soon",
  },
  ka: {
    collection:"კოლექცია", howItWorks:"როგორ მუშაობს", about:"ჩვენ შესახებ",
    orders:"შეკვეთები", signIn:"შესვლა", search:"ძიება",
    shop:"მაღაზია", theCollection:"კოლექცია", pieces:"ნივთი", piece:"ნივთი",
    sortNew:"ახალი პირველი", sortLow:"ფასი: იაფიდან → ძვირამდე", sortHigh:"ფასი: ძვირიდან → იაფამდე",
    allSections:"ყველა", womenswear:"ქალის", menswear:"მამაკაცის", kidswear:"ბავშვის",
    allSub:"ყველა", newIn:"ახალი", clothing:"ტანსაცმელი", shoes:"ფეხსაცმელი", bags:"ჩანთები",
    accessories:"აქსესუარები", watches:"საათები", jewellery:"სამკაულები", sale:"ფასდაკლება", brands:"ბრენდები",
    allPrice:"ყველა ფასი", clearFilters:"ფილტრის გასუფთავება", noItems:"ნივთი ვერ მოიძებნა",
    adjustFilters:"სცადეთ ფილტრების შეცვლა ან დაათვალიერეთ ყველა სექცია.",
    viewItem:"ნახვა →",
    reserveNow:"დაჯავშნა ახლავე (50%)", payDelivery:"გადახდა მიწოდებისას (50%)",
    selectSize:"ზომის არჩევა", selectSizeWarn:"⚠ გთხოვთ აირჩიოთ ზომა",
    sizeGuide:"ზომების ცხრილი", sizeFit:"ზომა & ჯდომა", runSmall:"პატარა ზომაა",
    trueToSize:"შეესაბამება ზომას", runsLarge:"დიდი ზომაა", fullSizeGuide:"სრული ზომების ცხრილი →",
    videoVerification:"ვიდეო ვერიფიკაცია", videoDesc:"ჩვენი გუნდი შანხაიში გადაიღებს თქვენი ნივთის სრულ ვიდეოს გამოგზავნამდე და გამოგიგზავნით WhatsApp-ზე.",
    videoPrice:"28 ლარი გადახდისას", itemDetails:"ნივთის დეტალები",
    leadTime:"მიწოდების ვადა", delivery:"მიწოდება", verified:"დამოწმებული",
    verifiedVal:"✓ ლიზამ შეამოწმა, შანხაი", deliveryVal:"თბილისი, საქართველო",
    reserve:"დაჯავშნა", freeCancellation:"უფასო გაუქმება გამოგზავნამდე",
    askWhatsApp:"WhatsApp-ზე დაკავშირება",  fromCollection:"ამავე კოლექციიდან",
    yourDetails:"თქვენი მონაცემები", reviewPay:"გადახედვა და გადახდა", orderConfirmed:"შეკვეთა დადასტურებულია",
    contactDetails:"საკონტაქტო ინფორმაცია", fullName:"სახელი გვარი *", whatsapp:"WhatsApp ნომერი *",
    notes:"შენიშვნები", notesPlaceholder:"ზომის კითხვები, ფერის პრეფერენციები…",
    enterNamePhone:"გთხოვთ შეიყვანოთ სახელი და WhatsApp ნომერი.",
    addVideo:"ვიდეო ვერიფიკაციის დამატება — 28 ლარი",
    videoCheckDesc:"გამოგზავნამდე ვიღებთ ნივთის ვიდეოს და გამოგიგზავნით WhatsApp-ზე.",
    orderSummary:"შეკვეთის შეჯამება", item:"ნივთი", size:"ზომა",
    depositNow:"ბე ახლა (50%)", balanceDelivery:"ნაშთი მიწოდებისას",
    videoVerif:"ვიდეო ვერიფიკაცია", total:"სულ",
    refundNote:"ბე სრულად დაბრუნდება გამოგზავნამდე გაუქმების შემთხვევაში.",
    videoNote:" ვიდეო გამოგზავნამდე გამოიგზავნება WhatsApp-ზე.",
    paymentMethod:"გადახდის მეთოდი", bogTransfer:"BOG / TBC გადარიცხვა",
    cardPayment:"ბარათით გადახდა", recommended:"რეკომენდებული",
    contactNote:"დაგიკავშირდებით WhatsApp-ზე ნომერზე",
    within2h:"2 საათის განმავლობაში გადახდის მოსაწყობად.",
    videoShipping:" ვიდეო გამოიგზავნება გამოგზავნამდე.",
    status:"სტატუსი", processing:"დამუშავება", depositDue:"ბე გადასახდელი",
    reviewOrder:"შეკვეთის გადახედვა →", confirmPay:"ბეს გადახდის დადასტურება",
    viewMyOrders:"ჩემი შეკვეთები →",
    myOrders:"ჩემი შეკვეთები", continueShopping:"შოპინგის გაგრძელება",
    depositPaid:"გადახდილი ბე", balanceOnDelivery:"ნაშთი მიწოდებისას",
    currentStatus:"მიმდინარე სტატუსი", videoIncluded:"ვიდეო ვერიფიკაცია — WhatsApp-ზე გამოიგზავნება გამოგზავნამდე",
    cancelOrder:"შეკვეთის გაუქმება (უფასო)", cancelConfirm:"გაუუქმოთ შეკვეთა? ბე სრულად დაბრუნდება.",
    cancelSuccess:"გაუქმების მოთხოვნა გაიგზავნა. ბე დაბრუნდება 3–5 დღეში.",
    signInBtn:"შესვლა", createAccount:"ანგარიშის შექმნა",
    emailLabel:"ელ-ფოსტა *", passwordLabel:"პაროლი *",
    whatsappLabel:"WhatsApp ნომერი", fullNameLabel:"სახელი გვარი *",
    enterEmailPass:"შეიყვანეთ ელ-ფოსტა და პაროლი.", allRequired:"ყველა სავალდებულო ველი შევსებული უნდა იყოს.",
    passwordMin:"პაროლი მინიმუმ 6 სიმბოლო უნდა იყოს.", validEmail:"შეიყვანეთ სწორი ელ-ფოსტა.",
    welcomeBack:"კეთილი იყოს დაბრუნება!", welcomeAdmin:"მოგესალმებით, ადმინ",
    demoHint:"დემო: demo@alternative.ge / demo123",
    adminHint:"ადმინ: admin@alternative.ge / admin123",
    myAccount:"ჩემი ანგარიში", welcome:"გამარჯობა,",
    adminPanel:"ადმინ პანელი", signOut:"გასვლა",
    recentOrders:"ბოლო შეკვეთები", viewAll:"ყველა →",
    noOrdersYet:"შეკვეთები არ გაქვთ. დაიწყეთ შოპინგი.", exploreCollection:"კოლექციის დათვალიერება",
    settings:"პარამეტრები", accountSettings:"ანგარიშის პარამეტრები",
    saveChanges:"ცვლილებების შენახვა", settingsSaved:"პარამეტრები შენახულია.",
    yourReserved:"თქვენი", reservedOrders:"დაჯავშნული შეკვეთები",
    noReserved:"ჯერ დაჯავშნული შეკვეთები არ არის.", totalReserved:"სულ დაჯავშნული",
    viewAllOrders:"ყველა შეკვეთა", removeItem:"წაშლა",
    searchPlaceholder:"ნივთების, კატეგორიების, ფერების ძიება…", noResults:"შედეგი ვერ მოიძებნა",
    sizingGuide:"ზომების ცხრილი", sizes:"ზომები",
    sizeNote:"გაზომვები სავარაუდოა. თუ ორ ზომას შორის ხართ, აირჩიეთ დიდი.",
    addedWishlist:"სასურველებში დაემატა ♡", removedWishlist:"სასურველებიდან წაიშალა",
    removedCart:"ნივთი წაიშალა შეკვეთებიდან.",
    orderReserved:"შეკვეთა დაჯავშნულია! შეამოწმეთ შეკვეთები.",
    heroSub:"ახალი — Bottega Veneta, Loro Piana, Max Mara",
    heroBody:"ლუქსი მოდა დამოწმებული მომწოდებლებისგან. გადაიხადე 50% რეზერვაციისთვის, მიიღე 10–18 დღეში.",
    heroCta1:"ახალი კოლექცია", heroCta2:"როგორ მუშაობს პრე-ორდერი",
    editorialLabel:"Alternative-ის გზა",
    editorialTitle:"მოდა, შექმნილი მზრუნველი ადამიანების მიერ.",
    editorialBody:"ყველა ნივთი შემოწმდება შანხაიში, სანამ თბილისს მიაღწევს.",
    ourProcess:"ჩვენი პროცესი", scroll:"გადახვევა",
    featuredLabel:"კურირებული შერჩევა", featuredTitle:"ამ კვირის ფეატჩი",
    viewAll:"ყველა →", shopBy:"შოპინგი კატეგორიებით", collections:"კოლექციები",
    extraService:"დამატებითი სერვისი", videoTitle:"ვიდეო ვერიფიკაცია გამოგზავნამდე.",
    videoBody:"დაამატეთ ვიდეო ვერიფიკაცია ნებისმიერ შეკვეთას 28 ლარად. ჩვენი გუნდი შანხაიში გადაიღებს სრულ ვიდეოს — ფიტინგი, მასალა, ნაკერები — და WhatsApp-ზე გამოგიგზავნით.",
    shopAddService:"შოპინგი და სერვისის დამატება",
    lizaLabel:"თქვენი თვალები შანხაიში", lizaTitle:"ლიზა ამოწმებს ყოველ ნივთს.",
    lizaBody:"ჩვენი წყაროს პარტნიორი ფიზიკურად ამოწმებს ყოველ ნივთს — ფიტინგს, ნაკერებს, მასალის ხარისხს — გამოგზავნამდე.",
    itemsVerified:"შემოწმებული ნივთი", custSatisfaction:"მომხმარებლის კმაყოფილება", avgRating:"საშუალო შეფასება",
    trust1:"100% ავთენტიკურობის გარანტია", trust2:"უსაფრთხო 50% დეპოზიტი",
    trust3:"მიწოდება 10–18 დღეში", trust4:"ნახე შეძენამდე",
    womensSub:"ჩანთები, ტანსაცმელი, ფეხსაცმელი", mensSub:"საათები, ჩანთები, ტანსაცმელი", kidsSub:"მოდა პატარებისთვის",
    ourProcessLabel:"ჩვენი პროცესი", howOrderingWorks:"როგორ ხდება შეკვეთა",
    howSubtitle:"ვსაქმიანობთ პირდაპირ დამოწმებულ მომწოდებლებთან. დამატებითი სიმშვიდისთვის ვიდეო ვერიფიკაციის სერვისი ხელმისაწვდომია.",
    trackOrder:"შეკვეთის თვალყურის დევნება", orderStatusVisible:"შეკვეთის სტატუსი — ყოველთვის ხილვადი",
    faq:"ხშირად დასმული კითხვები",
    ourStory:"ჩვენი ამბავი", aboutHero:"შევქმენით, რადგან ბაზარი ორ ცუდ ვარიანტს გვთავაზობდა.",
    lizaShanghai:"ლიზა შანხაიში", yourEyes:"თქვენი თვალები წყაროსთან.",
    lizaDesc1:"ლიზა შანხაიში ცხოვრობს. ის ფიზიკურად სტუმრობს ჩვენს მომწოდებლებს, ამოწმებს ყოველ ნივთს.",
    lizaDesc2:"ის არის მიზეზი, რომ შეგიძლიათ ენდოთ იმას, რაც კართან მოდის.",
    honestPricing:"გამჭვირვალე ფასები", honestBody:"ჩვენი ფასი ასახავს რეალურ ხარისხს — არა ბრენდის საფასურს.",
    noSurprises:"სიურპრიზების გარეშე", noSurprisesBody:"ონლაინ მოდის ყველაზე დიდი ჩავარდნა ფოტოსა და რეალობას შორის შეუსაბამობაა. ჩვენ ამ სხვაობას ვხურავთ.",
    serviceProduct:"სერვისი არის პროდუქტი", serviceBody:"პირველი შეტყობინებიდან მიწოდებამდე, ყოველი შეხება შექმნილია თქვენი მოლოდინების გადასაჭარბებლად.",
    footerDesc:"კურირებული მოდა პირდაპირ შანხაის დამოწმებული მომწოდებლებისგან.",
    whatsappUs:"WhatsApp-ზე დაგვიკავშირდით",
    footerShop:"მაღაზია", footerAccount:"ანგარიში", footerAbout:"ჩვენ შესახებ",
    newArrivals:"ახალი ჩამოსვლები", myOrdersFooter:"ჩემი შეკვეთები",
    ourStoryFooter:"ჩვენი ამბავი", lizaFooter:"ლიზა შანხაიში", faqFooter:"FAQ", contact:"კონტაქტი",
    copyright:"© 2026 Alternative Concept Store · თბილისი, საქართველო",
    adminPanelTitle:"ადმინ პანელი", backToSite:"← საიტზე დაბრუნება",
    allOrders:"ყველა შეკვეთა", ordersTotal:"შეკვეთა სულ",
    productCatalog:"პროდუქტების კატალოგი", addProduct:"+ პროდუქტის დამატება",
    statistics:"სტატისტიკა", updateStatus:"სტატუსის განახლება",
    orderID:"შეკვეთის ID", customer:"მომხმარებელი", whatsappCol:"WhatsApp",
    itemCol:"ნივთი", statusCol:"სტატუსი", amountCol:"თანხა", dateCol:"თარიღი",
    topCategories:"საუკეთესო კატეგორიები", ordersByStatus:"შეკვეთები სტატუსების მიხედვით",
    totalOrders:"სულ შეკვეთები", revenue:"შემოსავალი (GEL)", pending:"მომლოდინე", videoOrders:"ვიდეო შეკვეთები",
    productMgmtSoon:"პროდუქტების მართვა მალე",
  },
  ru: {
    collection:"Коллекция", howItWorks:"Как это работает", about:"О нас",
    orders:"Заказы", signIn:"Войти", search:"Поиск",
    shop:"Магазин", theCollection:"Коллекция", pieces:"товаров", piece:"товар",
    sortNew:"Сначала новые", sortLow:"Цена: по возрастанию", sortHigh:"Цена: по убыванию",
    allSections:"Все", womenswear:"Женское", menswear:"Мужское", kidswear:"Детское",
    allSub:"Все", newIn:"Новинки", clothing:"Одежда", shoes:"Обувь", bags:"Сумки",
    accessories:"Аксессуары", watches:"Часы", jewellery:"Украшения", sale:"Распродажа", brands:"Бренды",
    allPrice:"Любая цена", clearFilters:"Сбросить фильтры", noItems:"Товары не найдены",
    adjustFilters:"Измените фильтры или просмотрите все разделы.",
    viewItem:"Смотреть →",
    reserveNow:"Зарезервировать (50%)", payDelivery:"Оплата при доставке (50%)",
    selectSize:"Выбрать размер", selectSizeWarn:"⚠ Пожалуйста, выберите размер",
    sizeGuide:"Таблица размеров", sizeFit:"Размер & Посадка", runSmall:"Маломерит",
    trueToSize:"Соответствует размеру", runsLarge:"Большемерит", fullSizeGuide:"Полная таблица размеров →",
    videoVerification:"Видео верификация", videoDesc:"Наша команда в Шанхае снимает полное видео вашего товара перед отправкой и присылает вам в WhatsApp.",
    videoPrice:"28 GEL при оформлении", itemDetails:"Описание товара",
    leadTime:"Срок доставки", delivery:"Доставка", verified:"Проверено",
    verifiedVal:"✓ Проверено Лизой, Шанхай", deliveryVal:"Тбилиси, Грузия",
    reserve:"Зарезервировать", freeCancellation:"Бесплатная отмена до отправки",
    askWhatsApp:"Написать в WhatsApp", fromCollection:"Из той же коллекции",
    yourDetails:"Ваши данные", reviewPay:"Проверка и оплата", orderConfirmed:"Заказ подтверждён",
    contactDetails:"Контактные данные", fullName:"Имя Фамилия *", whatsapp:"Номер WhatsApp *",
    notes:"Примечания", notesPlaceholder:"Вопросы по размеру, предпочтения по цвету…",
    enterNamePhone:"Введите имя и номер WhatsApp.",
    addVideo:"Добавить видео верификацию — 28 GEL",
    videoCheckDesc:"Снимаем товар перед отправкой и отправляем в WhatsApp. Видите реальный товар.",
    orderSummary:"Сводка заказа", item:"Товар", size:"Размер",
    depositNow:"Депозит сейчас (50%)", balanceDelivery:"Остаток при доставке",
    videoVerif:"Видео верификация", total:"Итого",
    refundNote:"Депозит полностью возвращается при отмене до отправки.",
    videoNote:" Видео будет отправлено в WhatsApp до отправки.",
    paymentMethod:"Способ оплаты", bogTransfer:"Банковский перевод BOG / TBC",
    cardPayment:"Оплата картой", recommended:"Рекомендуем",
    contactNote:"Свяжемся с вами в WhatsApp по номеру",
    within2h:"в течение 2 часов для подтверждения и оплаты.",
    videoShipping:" Видео будет отправлено до отправки заказа.",
    status:"Статус", processing:"Обработка", depositDue:"Депозит к оплате",
    reviewOrder:"Проверить заказ →", confirmPay:"Подтвердить и оплатить депозит",
    viewMyOrders:"Мои заказы →",
    myOrders:"Мои заказы", continueShopping:"Продолжить покупки",
    depositPaid:"Оплаченный депозит", balanceOnDelivery:"Остаток при доставке",
    currentStatus:"Текущий статус", videoIncluded:"Видео верификация — будет отправлена в WhatsApp до отправки",
    cancelOrder:"Отменить заказ (бесплатно)", cancelConfirm:"Отменить заказ? Депозит будет полностью возвращён.",
    cancelSuccess:"Запрос на отмену отправлен. Депозит вернётся в течение 3–5 дней.",
    signInBtn:"Войти", createAccount:"Создать аккаунт",
    emailLabel:"Email *", passwordLabel:"Пароль *",
    whatsappLabel:"Номер WhatsApp", fullNameLabel:"Имя Фамилия *",
    enterEmailPass:"Введите email и пароль.", allRequired:"Все обязательные поля должны быть заполнены.",
    passwordMin:"Пароль должен содержать не менее 6 символов.", validEmail:"Введите корректный email.",
    welcomeBack:"С возвращением!", welcomeAdmin:"Добро пожаловать, Администратор",
    demoHint:"Демо: demo@alternative.ge / demo123",
    adminHint:"Админ: admin@alternative.ge / admin123",
    myAccount:"Мой аккаунт", welcome:"Добро пожаловать,",
    adminPanel:"Панель администратора", signOut:"Выйти",
    recentOrders:"Последние заказы", viewAll:"Все →",
    noOrdersYet:"Заказов пока нет. Начните покупки.", exploreCollection:"Изучить коллекцию",
    settings:"Настройки", accountSettings:"Настройки аккаунта",
    saveChanges:"Сохранить изменения", settingsSaved:"Настройки сохранены.",
    yourReserved:"Ваши", reservedOrders:"зарезервированные заказы",
    noReserved:"Зарезервированных заказов пока нет.", totalReserved:"Итого зарезервировано",
    viewAllOrders:"Все заказы", removeItem:"Удалить",
    searchPlaceholder:"Поиск товаров, категорий, цветов…", noResults:"Нет результатов для",
    sizingGuide:"Таблица размеров", sizes:"Размеры",
    sizeNote:"Размеры приблизительные. Если между размерами — берите больший.",
    addedWishlist:"Добавлено в избранное ♡", removedWishlist:"Удалено из избранного",
    removedCart:"Товар удалён из заказов.",
    orderReserved:"Заказ зарезервирован! Проверьте заказы.",
    heroSub:"Новинки — Bottega Veneta, Loro Piana, Max Mara",
    heroBody:"Люксовая мода от проверенных поставщиков. Оплатите 50% для резерва, получите за 10–18 дней.",
    heroCta1:"Новые поступления", heroCta2:"Как работает предзаказ",
    editorialLabel:"Путь Alternative",
    editorialTitle:"Мода, созданная людьми, которые заботятся.",
    editorialBody:"Каждая вещь проверяется в Шанхае, прежде чем попасть в Тбилиси.",
    ourProcess:"Наш процесс", scroll:"Прокрутка",
    featuredLabel:"Кураторский выбор", featuredTitle:"В фокусе этой недели",
    viewAll:"Все →", shopBy:"Покупки по категориям", collections:"Коллекции",
    extraService:"Дополнительный сервис", videoTitle:"Видео верификация перед каждой отправкой.",
    videoBody:"Добавьте видео верификацию к любому заказу за 28 GEL. Наша команда в Шанхае снимает полный обзор товара и отправляет вам в WhatsApp до отправки.",
    shopAddService:"Купить и добавить сервис",
    lizaLabel:"Ваши глаза в Шанхае", lizaTitle:"Лиза проверяет каждый товар до вас.",
    lizaBody:"Наш партнёр по источникам лично проверяет каждую вещь — фурнитуру, швы, качество материала — до отправки.",
    itemsVerified:"Товаров проверено", custSatisfaction:"Удовлетворённость клиентов", avgRating:"Средний рейтинг",
    trust1:"100% Гарантия подлинности", trust2:"Безопасный депозит 50%",
    trust3:"Доставка за 10–18 дней", trust4:"Смотри перед покупкой",
    womensSub:"Сумки, одежда, обувь и многое другое", mensSub:"Часы, сумки, одежда", kidsSub:"Мода для малышей",
    ourProcessLabel:"Наш процесс", howOrderingWorks:"Как сделать заказ",
    howSubtitle:"Работаем напрямую с проверенными поставщиками. Доступна видео верификация для вашего спокойствия.",
    trackOrder:"Отслеживание заказа", orderStatusVisible:"Статус заказа — всегда виден",
    faq:"Часто задаваемые вопросы",
    ourStory:"Наша история", aboutHero:"Создан потому, что рынок предлагал два плохих варианта.",
    lizaShanghai:"Лиза в Шанхае", yourEyes:"Ваши глаза у источника.",
    lizaDesc1:"Лиза живёт в Шанхае. Она лично посещает наших поставщиков, проверяет каждую вещь.",
    lizaDesc2:"Она — причина, по которой вы можете доверять тому, что приходит к вашей двери.",
    honestPricing:"Честные цены", honestBody:"Наша цена отражает реальное качество и стоимость — не налог на бренд.",
    noSurprises:"Без сюрпризов", noSurprisesBody:"Главная проблема онлайн-моды — разрыв между фото и реальностью. Мы его закрываем.",
    serviceProduct:"Сервис — это продукт", serviceBody:"От первого сообщения до доставки, каждое касание разработано для превышения ваших ожиданий.",
    footerDesc:"Кураторская мода напрямую от проверенных поставщиков в Шанхае.",
    whatsappUs:"Написать в WhatsApp",
    footerShop:"Магазин", footerAccount:"Аккаунт", footerAbout:"О нас",
    newArrivals:"Новинки", myOrdersFooter:"Мои заказы",
    ourStoryFooter:"Наша история", lizaFooter:"Лиза в Шанхае", faqFooter:"FAQ", contact:"Контакты",
    copyright:"© 2026 Alternative Concept Store · Тбилиси, Грузия",
    adminPanelTitle:"Панель администратора", backToSite:"← Вернуться на сайт",
    allOrders:"Все заказы", ordersTotal:"заказов всего",
    productCatalog:"Каталог товаров", addProduct:"+ Добавить товар",
    statistics:"Статистика", updateStatus:"Обновить статус",
    orderID:"ID заказа", customer:"Клиент", whatsappCol:"WhatsApp",
    itemCol:"Товар", statusCol:"Статус", amountCol:"Сумма", dateCol:"Дата",
    topCategories:"Топ категорий", ordersByStatus:"Заказы по статусам",
    totalOrders:"Всего заказов", revenue:"Выручка (GEL)", pending:"В ожидании", videoOrders:"Видео заказы",
    productMgmtSoon:"Управление товарами — скоро",
  },
};

// Context — global lang accessor (no React context needed, we pass L as prop)
const GEO_FLAG = () => (
  <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
    <rect width="20" height="14" fill="white"/>
    <rect x="8" width="4" height="14" fill="#FF0000"/>
    <rect y="5" width="20" height="4" fill="#FF0000"/>
    <rect x="1" y="1" width="3" height="3" rx="0.3" fill="#FF0000"/>
    <rect x="16" y="1" width="3" height="3" rx="0.3" fill="#FF0000"/>
    <rect x="1" y="10" width="3" height="3" rx="0.3" fill="#FF0000"/>
    <rect x="16" y="10" width="3" height="3" rx="0.3" fill="#FF0000"/>
  </svg>
);
const RUS_FLAG = () => (
  <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
    <rect width="20" height="4.67" fill="white"/>
    <rect y="4.67" width="20" height="4.67" fill="#0039A6"/>
    <rect y="9.33" width="20" height="4.67" fill="#D52B1E"/>
  </svg>
);
const ENG_FLAG = () => (
  <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
    <rect width="20" height="14" fill="#012169"/>
    <path d="M0 0L20 14M20 0L0 14" stroke="white" strokeWidth="2.5"/>
    <path d="M0 0L20 14M20 0L0 14" stroke="#C8102E" strokeWidth="1.5"/>
    <rect x="8.5" width="3" height="14" fill="white"/>
    <rect y="5.5" width="20" height="3" fill="white"/>
    <rect x="9" width="2" height="14" fill="#C8102E"/>
    <rect y="6" width="20" height="2" fill="#C8102E"/>
  </svg>
);

// ── TYPOGRAPHY ────────────────────────────────────────────────────────────────
const T = {
  displayXL:{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(52px,8vw,104px)",fontWeight:300,lineHeight:0.92,letterSpacing:"-1px"},
  displayLg:{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(36px,5.5vw,68px)",fontWeight:300,lineHeight:1.0},
  displayMd:{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(26px,3.5vw,44px)",fontWeight:300,lineHeight:1.1},
  displaySm:{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(20px,2.5vw,32px)",fontWeight:300,lineHeight:1.2},
  heading:{fontFamily:"'Jost',sans-serif",fontSize:"15px",fontWeight:500,letterSpacing:"0.04em"},
  label:{fontFamily:"'Jost',sans-serif",fontSize:"11px",fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase"},
  labelSm:{fontFamily:"'Jost',sans-serif",fontSize:"9px",fontWeight:500,letterSpacing:"0.18em",textTransform:"uppercase"},
  body:{fontFamily:"'Jost',sans-serif",fontSize:"15px",fontWeight:300,lineHeight:1.75},
  bodySm:{fontFamily:"'Jost',sans-serif",fontSize:"13px",fontWeight:300,lineHeight:1.65},
};

// ── LOGO ──────────────────────────────────────────────────────────────────────
const LogoMark = ({color=C.black,size=1}) => (
  <svg width={28*size} height={28*size} viewBox="0 0 40 40" fill="none">
    <path d="M20 2L4 38h6.5l3-6.8h13l3 6.8H36L20 2zm0 11.2L27.1 28H12.9L20 13.2z" fill={color}/>
    <rect x="15" y="29" width="10" height="1.8" fill={color}/>
    <rect x="16" y="32" width="8" height="1.8" fill={color}/>
  </svg>
);
const Logo = ({color=C.black,size=1}) => (
  <svg width={160*size} height={44*size} viewBox="0 0 160 44" fill="none">
    <text x="0" y="32" fontFamily="'Cormorant Garamond',Georgia,serif" fontSize="30" fontWeight="600" fill={color} letterSpacing="-0.5">Alternative</text>
    <text x="2" y="42" fontFamily="'Jost',sans-serif" fontSize="8.5" fontWeight="400" fill={color} letterSpacing="3">CONCEPT STORE</text>
  </svg>
);

// ── PRODUCT DATA ──────────────────────────────────────────────────────────────
const SIZES_CLOTHING = ["XS","S","M","L","XL","XXL"];
const SIZES_SHOES = ["36","37","38","39","40","41","42","43","44","45"];
const SIZES_BAGS = ["One Size"];
const SIZES_ACC = ["One Size"];

const PI = {
  tote: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27600%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23c4a882%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23a8906e%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27600%27%20y2%3D%27552.0%27%20stroke%3D%27%23ffffff%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Crect%20x%3D%22210.0%22%20y%3D%22168.00000000000003%22%20width%3D%22180.0%22%20height%3D%22210.0%22%20rx%3D%224%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cpath%20d%3D%22M240.0%20168.00000000000003%20Q240.0%20108.0%20300.0%20108.0%20Q360.0%20108.0%20360.0%20168.00000000000003%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%0A%3Ctext%20x%3D%27300.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23ffffff%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3ESTRUCTURED%20TOTE%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  quilted: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27600%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%232a2420%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23191919%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23b19a7a%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23b19a7a%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27600%27%20y2%3D%27552.0%27%20stroke%3D%27%23b19a7a%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Crect%20x%3D%22210.0%22%20y%3D%22168.00000000000003%22%20width%3D%22180.0%22%20height%3D%22210.0%22%20rx%3D%224%22%20fill%3D%22none%22%20stroke%3D%22%23b19a7a%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cpath%20d%3D%22M240.0%20168.00000000000003%20Q240.0%20108.0%20300.0%20108.0%20Q360.0%20108.0%20360.0%20168.00000000000003%22%20fill%3D%22none%22%20stroke%3D%22%23b19a7a%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%0A%3Ctext%20x%3D%27300.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23b19a7a%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3EQUILTED%20BAG%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  scarf: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27600%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23e7ddd0%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23d4c8b8%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%238B7355%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%238B7355%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27600%27%20y2%3D%27552.0%27%20stroke%3D%27%238B7355%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Cpath%20d%3D%22M180.0%20180.0%20Q300.0%20270.0%20420.0%20180.0%20Q300.0%20330.0%20180.0%20360.0%20Q300.0%20420.0%20420.0%20360.0%22%20fill%3D%22none%22%20stroke%3D%22%238B7355%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%0A%3Ctext%20x%3D%27300.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%238B7355%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3ESILK%20SCARF%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  mule: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27600%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23d4c2a8%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23bfad91%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23584638%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23584638%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27600%27%20y2%3D%27552.0%27%20stroke%3D%27%23584638%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Cellipse%20cx%3D%22300.0%22%20cy%3D%22312.0%22%20rx%3D%22108.0%22%20ry%3D%2248.0%22%20fill%3D%22none%22%20stroke%3D%22%23584638%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cpath%20d%3D%22M192.0%20312.0%20Q210.0%20228.0%20300.0%20210.0%20Q390.0%20228.0%20408.00000000000006%20312.0%22%20fill%3D%22none%22%20stroke%3D%22%23584638%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%0A%3Ctext%20x%3D%27300.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23584638%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3EBLOCK%20HEEL%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  cashmere: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27600%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23c4b99a%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23b0a484%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27600%27%20y2%3D%27552.0%27%20stroke%3D%27%23ffffff%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Cpath%20d%3D%22M180.0%20180.0%20Q300.0%20270.0%20420.0%20180.0%20Q300.0%20330.0%20180.0%20360.0%20Q300.0%20420.0%20420.0%20360.0%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%0A%3Ctext%20x%3D%27300.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23ffffff%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3ECASHMERE%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  crossbody: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27600%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%236b2832%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%2352202a%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23e7d8c8%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23e7d8c8%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27600%27%20y2%3D%27552.0%27%20stroke%3D%27%23e7d8c8%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Crect%20x%3D%22210.0%22%20y%3D%22168.00000000000003%22%20width%3D%22180.0%22%20height%3D%22210.0%22%20rx%3D%224%22%20fill%3D%22none%22%20stroke%3D%22%23e7d8c8%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cpath%20d%3D%22M240.0%20168.00000000000003%20Q240.0%20108.0%20300.0%20108.0%20Q360.0%20108.0%20360.0%20168.00000000000003%22%20fill%3D%22none%22%20stroke%3D%22%23e7d8c8%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%0A%3Ctext%20x%3D%27300.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23e7d8c8%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3ECROSSBODY%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  blazer: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27600%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23b8a488%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%239e8c70%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27600%27%20y2%3D%27552.0%27%20stroke%3D%27%23ffffff%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Cpath%20d%3D%22M228.0%20150.0%20L264.0%20180.0%20L264.0%20390.0%20L336.00000000000006%20390.0%20L336.00000000000006%20180.0%20L372.0%20150.0%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cline%20x1%3D%22264.0%22%20y1%3D%22180.0%22%20x2%3D%22336.00000000000006%22%20y2%3D%22180.0%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221%22%20opacity%3D%220.4%22%2F%3E%0A%3Ctext%20x%3D%27300.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23ffffff%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3EWOOL%20BLAZER%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  belt: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27600%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%238B6942%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23725636%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23e7e0d4%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23e7e0d4%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27600%27%20y2%3D%27552.0%27%20stroke%3D%27%23e7e0d4%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Crect%20x%3D%22120.0%22%20y%3D%22264.0%22%20width%3D%22360.0%22%20height%3D%2248.0%22%20rx%3D%223%22%20fill%3D%22none%22%20stroke%3D%22%23e7e0d4%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Ccircle%20cx%3D%22210.0%22%20cy%3D%22288.0%22%20r%3D%2224.0%22%20fill%3D%22none%22%20stroke%3D%22%23e7e0d4%22%20stroke-width%3D%221.2%22%20opacity%3D%220.6%22%2F%3E%0A%3Ctext%20x%3D%27300.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23e7e0d4%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3ELEATHER%20BELT%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  watch1: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27600%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23c8c8cc%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23a8a8b0%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23191919%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23191919%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27600%27%20y2%3D%27552.0%27%20stroke%3D%27%23191919%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Ccircle%20cx%3D%22300.0%22%20cy%3D%22270.0%22%20r%3D%2290.0%22%20fill%3D%22none%22%20stroke%3D%22%23191919%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cline%20x1%3D%22300.0%22%20y1%3D%22270.0%22%20x2%3D%22300.0%22%20y2%3D%22210.0%22%20stroke%3D%22%23191919%22%20stroke-width%3D%221.2%22%20opacity%3D%220.6%22%2F%3E%3Cline%20x1%3D%22300.0%22%20y1%3D%22270.0%22%20x2%3D%22336.00000000000006%22%20y2%3D%22288.0%22%20stroke%3D%22%23191919%22%20stroke-width%3D%221.2%22%20opacity%3D%220.6%22%2F%3E%3Crect%20x%3D%22288.0%22%20y%3D%22168.00000000000003%22%20width%3D%2224.0%22%20height%3D%2224.0%22%20rx%3D%221%22%20fill%3D%22none%22%20stroke%3D%22%23191919%22%20stroke-width%3D%221%22%20opacity%3D%220.4%22%2F%3E%0A%3Ctext%20x%3D%27300.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23191919%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3EAUTOMATIC%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  watch2: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27600%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23c4a44a%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23a88a38%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27600%27%20y2%3D%27552.0%27%20stroke%3D%27%23ffffff%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Ccircle%20cx%3D%22300.0%22%20cy%3D%22270.0%22%20r%3D%2290.0%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cline%20x1%3D%22300.0%22%20y1%3D%22270.0%22%20x2%3D%22300.0%22%20y2%3D%22210.0%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.2%22%20opacity%3D%220.6%22%2F%3E%3Cline%20x1%3D%22300.0%22%20y1%3D%22270.0%22%20x2%3D%22336.00000000000006%22%20y2%3D%22288.0%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.2%22%20opacity%3D%220.6%22%2F%3E%3Crect%20x%3D%22288.0%22%20y%3D%22168.00000000000003%22%20width%3D%2224.0%22%20height%3D%2224.0%22%20rx%3D%221%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221%22%20opacity%3D%220.4%22%2F%3E%0A%3Ctext%20x%3D%27300.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23ffffff%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3EGOLD%20WATCH%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  loafer: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27600%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%231a1a1a%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%232d2d2d%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23b19a7a%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23b19a7a%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27600%27%20y2%3D%27552.0%27%20stroke%3D%27%23b19a7a%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Cellipse%20cx%3D%22300.0%22%20cy%3D%22312.0%22%20rx%3D%22108.0%22%20ry%3D%2248.0%22%20fill%3D%22none%22%20stroke%3D%22%23b19a7a%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cpath%20d%3D%22M192.0%20312.0%20Q210.0%20228.0%20300.0%20210.0%20Q390.0%20228.0%20408.00000000000006%20312.0%22%20fill%3D%22none%22%20stroke%3D%22%23b19a7a%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%0A%3Ctext%20x%3D%27300.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23b19a7a%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3ELOAFER%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  duffle: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27600%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23a88968%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%238d7352%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23ffffff%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27600%27%20y2%3D%27552.0%27%20stroke%3D%27%23ffffff%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Crect%20x%3D%22210.0%22%20y%3D%22168.00000000000003%22%20width%3D%22180.0%22%20height%3D%22210.0%22%20rx%3D%224%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cpath%20d%3D%22M240.0%20168.00000000000003%20Q240.0%20108.0%20300.0%20108.0%20Q360.0%20108.0%20360.0%20168.00000000000003%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%0A%3Ctext%20x%3D%27300.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23ffffff%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3EDUFFLE%20BAG%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  overcoat: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27600%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%233a3838%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23252424%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23b19a7a%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23b19a7a%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27600%27%20y2%3D%27552.0%27%20stroke%3D%27%23b19a7a%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Cpath%20d%3D%22M228.0%20150.0%20L264.0%20180.0%20L264.0%20390.0%20L336.00000000000006%20390.0%20L336.00000000000006%20180.0%20L372.0%20150.0%22%20fill%3D%22none%22%20stroke%3D%22%23b19a7a%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cline%20x1%3D%22264.0%22%20y1%3D%22180.0%22%20x2%3D%22336.00000000000006%22%20y2%3D%22180.0%22%20stroke%3D%22%23b19a7a%22%20stroke-width%3D%221%22%20opacity%3D%220.4%22%2F%3E%0A%3Ctext%20x%3D%27300.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23b19a7a%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3EOVERCOAT%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  dresswatch: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27600%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23f0ede8%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23ddd8d0%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23191919%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23191919%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27600%27%20y2%3D%27552.0%27%20stroke%3D%27%23191919%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Ccircle%20cx%3D%22300.0%22%20cy%3D%22270.0%22%20r%3D%2290.0%22%20fill%3D%22none%22%20stroke%3D%22%23191919%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cline%20x1%3D%22300.0%22%20y1%3D%22270.0%22%20x2%3D%22300.0%22%20y2%3D%22210.0%22%20stroke%3D%22%23191919%22%20stroke-width%3D%221.2%22%20opacity%3D%220.6%22%2F%3E%3Cline%20x1%3D%22300.0%22%20y1%3D%22270.0%22%20x2%3D%22336.00000000000006%22%20y2%3D%22288.0%22%20stroke%3D%22%23191919%22%20stroke-width%3D%221.2%22%20opacity%3D%220.6%22%2F%3E%3Crect%20x%3D%22288.0%22%20y%3D%22168.00000000000003%22%20width%3D%2224.0%22%20height%3D%2224.0%22%20rx%3D%221%22%20fill%3D%22none%22%20stroke%3D%22%23191919%22%20stroke-width%3D%221%22%20opacity%3D%220.4%22%2F%3E%0A%3Ctext%20x%3D%27300.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23191919%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3EDRESS%20WATCH%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  puffer: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27600%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23e8e4dc%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23d8d2c8%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%238B7355%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%238B7355%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27600%27%20y2%3D%27552.0%27%20stroke%3D%27%238B7355%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Cpath%20d%3D%22M240.0%20150.0%20L210.0%20390.0%20L390.0%20390.0%20L360.0%20150.0%20Z%22%20fill%3D%22none%22%20stroke%3D%22%238B7355%22%20stroke-width%3D%221.5%22%20opacity%3D%220.5%22%2F%3E%3Ccircle%20cx%3D%22300.0%22%20cy%3D%22132.0%22%20r%3D%223%22%20fill%3D%22%238B7355%22%20opacity%3D%220.5%22%2F%3E%0A%3Ctext%20x%3D%27300.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%238B7355%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3EPUFFER%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
  sneaker: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27600%27%20height%3D%27600%27%3E%0A%3Cdefs%3E%0A%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23f0ede8%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23ddd8d0%27%2F%3E%3C%2FlinearGradient%3E%0A%3CradialGradient%20id%3D%27r%27%20cx%3D%270.3%27%20cy%3D%270.3%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23584638%27%20stop-opacity%3D%270.08%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23584638%27%20stop-opacity%3D%270%27%2F%3E%3C%2FradialGradient%3E%0A%3C%2Fdefs%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23g%29%27%2F%3E%0A%3Crect%20width%3D%27600%27%20height%3D%27600%27%20fill%3D%27url%28%23r%29%27%2F%3E%0A%3Cline%20x1%3D%270%27%20y1%3D%27552.0%27%20x2%3D%27600%27%20y2%3D%27552.0%27%20stroke%3D%27%23584638%27%20stroke-width%3D%270.5%27%20opacity%3D%270.15%27%2F%3E%0A%3Cellipse%20cx%3D%22300.0%22%20cy%3D%22312.0%22%20rx%3D%22108.0%22%20ry%3D%2248.0%22%20fill%3D%22none%22%20stroke%3D%22%23584638%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%3Cpath%20d%3D%22M192.0%20312.0%20Q210.0%20228.0%20300.0%20210.0%20Q390.0%20228.0%20408.00000000000006%20312.0%22%20fill%3D%22none%22%20stroke%3D%22%23584638%22%20stroke-width%3D%221.5%22%20opacity%3D%220.6%22%2F%3E%0A%3Ctext%20x%3D%27300.0%27%20y%3D%27491.99999999999994%27%20text-anchor%3D%27middle%27%20font-family%3D%27serif%27%20font-size%3D%2711%27%20fill%3D%27%23584638%27%20opacity%3D%270.45%27%20letter-spacing%3D%273%27%3ESNEAKER%3C%2Ftext%3E%0A%3C%2Fsvg%3E",
};
const PRODUCTS = [
  {id:1,name:"Arco Tote",section:"Womenswear",cat:"Bags",sub:"Bags",color:"Camel",price:320,sale:null,lead:"10–14 days",tag:"New",img:PI.tote,sizes:SIZES_BAGS,fit:{fit:"One Size",notes:"Dimensions: 34×25×12cm. Suitable for A4 documents."},brand:"Bottega Veneta",desc:"Intreccio lambskin. Gold-tone brass hardware. Interior suede lining with zip pocket."},
  {id:2,name:"Classic Flap Bag",section:"Womenswear",cat:"Bags",sub:"Bags",color:"Black",price:280,sale:null,lead:"12–16 days",tag:"",img:PI.quilted,sizes:SIZES_BAGS,fit:{fit:"One Size",notes:"Chain length: 120cm. Can be worn cross-body or on shoulder."},brand:"Saint Laurent",desc:"Diamond-quilted calfskin. Silver-tone chain strap. YSL turn-lock closure."},
  {id:3,name:"Silk Twill Scarf 90×90",section:"Womenswear",cat:"Accessories",sub:"Accessories",color:"Ivory",price:95,sale:75,lead:"8–10 days",tag:"Sale",img:PI.scarf,sizes:SIZES_ACC,fit:{fit:"One Size",notes:"90×90cm. Can be worn as headscarf, belt or bag accessory."},brand:"Loewe",desc:"100% silk twill. Hand-rolled edges. Signature Anagram print."},
  {id:4,name:"Block Heel Mule",section:"Womenswear",cat:"Shoes",sub:"Shoes",color:"Nude",price:190,sale:null,lead:"10–12 days",tag:"",img:PI.mule,sizes:SIZES_SHOES,fit:{fit:"True to size",notes:"We recommend ordering your usual size. Leather stretches slightly."},brand:"Chloé",desc:"Full-grain leather upper. 6cm block heel. Scalloped edge detail."},
  {id:5,name:"Cashmere Scarf",section:"Womenswear",cat:"Accessories",sub:"Accessories",color:"Camel",price:130,sale:null,lead:"8–10 days",tag:"New",img:PI.cashmere,sizes:SIZES_ACC,fit:{fit:"One Size",notes:"200×70cm. Generous oversized length."},brand:"Brunello Cucinelli",desc:"100% cashmere. Brushed finish. Monili detail."},
  {id:6,name:"Mini Puzzle Bag",section:"Womenswear",cat:"Bags",sub:"Bags",color:"Burgundy",price:195,sale:null,lead:"10–14 days",tag:"",img:PI.crossbody,sizes:SIZES_BAGS,fit:{fit:"One Size",notes:"18×14×6cm. Chain length adjustable."},brand:"Loewe",desc:"Soft pebbled calfskin. Signature puzzle geometric panels. Gold chain."},
  {id:7,name:"Tailored Wool Blazer",section:"Womenswear",cat:"Clothing",sub:"Clothing",color:"Camel",price:380,sale:null,lead:"12–16 days",tag:"New",img:PI.blazer,sizes:SIZES_CLOTHING,fit:{fit:"Relaxed fit",notes:"Model is 175cm wearing size S. Size down for tailored look."},brand:"Max Mara",desc:"80% wool, 20% cashmere. Structured shoulder. Satin lining."},
  {id:8,name:"Leather Belt — 25mm",section:"Womenswear",cat:"Accessories",sub:"Accessories",color:"Cognac",price:115,sale:null,lead:"8–10 days",tag:"",img:PI.belt,sizes:["70cm","75cm","80cm","85cm","90cm"],fit:{fit:"True to size",notes:"Measure your waist and choose the corresponding length."},brand:"Valentino",desc:"Vegetable-tanned calfskin. V-Logo signature buckle."},
  {id:9,name:"Automatic Mesh Watch",section:"Menswear",cat:"Watches",sub:"Watches",color:"Silver",price:480,sale:null,lead:"14–18 days",tag:"Popular",img:PI.watch1,sizes:SIZES_ACC,fit:{fit:"One Size",notes:"Case diameter: 40mm. Adjustable mesh strap."},brand:"Tom Ford",desc:"Sapphire crystal glass. Swiss automatic movement. 5ATM water resistance."},
  {id:10,name:"Gold Bracelet Watch",section:"Menswear",cat:"Watches",sub:"Watches",color:"Gold",price:420,sale:null,lead:"14–18 days",tag:"",img:PI.watch2,sizes:SIZES_ACC,fit:{fit:"One Size",notes:"Case diameter: 38mm. Adjustable bracelet."},brand:"Cartier",desc:"PVD gold-tone case. Brushed bracelet. Day-date complication."},
  {id:11,name:"Horsebit Loafer",section:"Menswear",cat:"Shoes",sub:"Shoes",color:"Black",price:220,sale:180,lead:"10–12 days",tag:"Sale",img:PI.loafer,sizes:SIZES_SHOES,fit:{fit:"True to size",notes:"Runs true. Full leather lining softens with wear."},brand:"Gucci",desc:"Smooth calfskin. Signature horsebit hardware. Blake-stitched leather sole."},
  {id:12,name:"Weekender Duffle",section:"Menswear",cat:"Bags",sub:"Bags",color:"Tan",price:350,sale:null,lead:"12–16 days",tag:"New",img:PI.duffle,sizes:SIZES_BAGS,fit:{fit:"One Size",notes:"48×28×25cm. Weekend bag capacity."},brand:"Loro Piana",desc:"Full-grain leather. Removable shoulder strap. Interior zip compartment."},
  {id:13,name:"Double-Breasted Overcoat",section:"Menswear",cat:"Clothing",sub:"Clothing",color:"Charcoal",price:520,sale:null,lead:"14–18 days",tag:"",img:PI.overcoat,sizes:SIZES_CLOTHING,fit:{fit:"Oversized fit",notes:"Model is 185cm wearing size M. True to size for relaxed silhouette."},brand:"The Row",desc:"90% virgin wool. Double-breasted. Structured shoulder. Fully lined."},
  {id:14,name:"Ceramic Dress Watch",section:"Menswear",cat:"Watches",sub:"Watches",color:"White",price:390,sale:null,lead:"14–18 days",tag:"Limited",img:PI.dresswatch,sizes:SIZES_ACC,fit:{fit:"One Size",notes:"Case diameter: 39mm. Alligator leather strap."},brand:"Tom Ford",desc:"Ceramic bezel. Swiss quartz movement. Sapphire crystal."},
  {id:15,name:"Mini Puffer Jacket",section:"Kidswear",cat:"Clothing",sub:"Clothing",color:"Cream",price:145,sale:null,lead:"10–14 days",tag:"New",img:PI.puffer,sizes:["2Y","4Y","6Y","8Y","10Y","12Y"],fit:{fit:"True to age",notes:"Comfortable fit, not oversized. Machine washable at 30°."},brand:"Moncler",desc:"Lightweight goose-down fill. Snap-button closure. Machine washable."},
  {id:16,name:"Canvas Sneaker",section:"Kidswear",cat:"Shoes",sub:"Shoes",color:"White",price:85,sale:null,lead:"8–10 days",tag:"",img:PI.sneaker,sizes:["27","28","29","30","31","32","33","34","35"],fit:{fit:"True to size",notes:"Rubber sole. Recommended to measure foot length before ordering."},brand:"Golden Goose",desc:"Canvas upper. Signature star. Rubber sole. Velcro closure."},
];

const ORDER_STATUSES = [
  {key:"reserved",label:"Reserved",desc:"Reservation confirmed. We are processing your order now.",color:C.brown},
  {key:"sourcing",label:"Sourcing",desc:"Your item is being prepared by our supplier in Shanghai.",color:C.tan},
  {key:"confirmed",label:"Confirmed",desc:"Item confirmed in stock and being packaged.",color:"#1a5c8b"},
  {key:"shipped",label:"Shipped",desc:"In transit from Shanghai. Estimated arrival 3–5 days.",color:C.green},
  {key:"delivered",label:"Delivered",desc:"Order delivered. Enjoy!",color:C.gray},
];

// ── TOAST SYSTEM ──────────────────────────────────────────────────────────────
function ToastContainer({toasts,mobile}) {
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:1000,display:"flex",flexDirection:"column",gap:0,pointerEvents:"none"}}>
      {toasts.map(t=>(
        <div key={t.id} style={{
          background:t.type==="error"?C.red:C.black,
          color:C.white,padding:"16px 20px",display:"flex",alignItems:"center",gap:12,
          width:"100%",boxShadow:"0 -4px 24px rgba(0,0,0,0.15)",
          animation:`toastIn 0.3s ease`,
        }}>
          <span style={{fontSize:16}}>{t.type==="error"?"✗":"✓"}</span>
          <span style={{...T.bodySm,color:C.white}}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ── HOVER BUTTON ──────────────────────────────────────────────────────────────
function HoverBtn({onClick,variant="primary",children,style={},disabled=false}) {
  const [h,setH]=useState(false);
  const base={display:"inline-flex",alignItems:"center",justifyContent:"center",...T.label,border:"none",transition:"all 0.25s",letterSpacing:"0.14em",opacity:disabled?0.5:1,cursor:disabled?"not-allowed":"pointer"};
  const vs={
    primary:{...base,padding:"14px 40px",background:h&&!disabled?C.brown:C.black,color:C.cream},
    secondary:{...base,padding:"13px 39px",background:h&&!disabled?C.black:"transparent",color:h&&!disabled?C.cream:C.black,border:`1px solid ${C.black}`},
    tan:{...base,padding:"14px 40px",background:h&&!disabled?C.brown:C.tan,color:C.white},
    ghost:{...base,padding:"10px 24px",background:"transparent",color:h?C.black:C.gray,border:`1px solid ${C.lgray}`,fontSize:10},
    white:{...base,padding:"13px 39px",background:h?"rgba(255,255,255,0.15)":"transparent",color:C.white,border:"1px solid rgba(255,255,255,0.5)"},
    danger:{...base,padding:"11px 24px",background:h?"#6b1818":C.red,color:C.white,fontSize:10},
  };
  return <button onClick={disabled?undefined:onClick} style={{...vs[variant],...style}} disabled={disabled}
    onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>{children}</button>;
}

// ── SEARCH OVERLAY ────────────────────────────────────────────────────────────
function SearchOverlay({onClose,setPage,setSelected,L,mobile}) {
  const [q,setQ]=useState("");
  const ref=useRef(null);
  useEffect(()=>{ref.current?.focus();},[]);
  const results=q.length>1?PRODUCTS.filter(p=>
    p.name.toLowerCase().includes(q.toLowerCase())||
    p.cat.toLowerCase().includes(q.toLowerCase())||
    p.section.toLowerCase().includes(q.toLowerCase())||
    p.color.toLowerCase().includes(q.toLowerCase())
  ):[];
  return (
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(25,25,25,0.85)",display:"flex",flexDirection:"column",alignItems:"center",paddingTop:mobile?70:120}}>
      <div onClick={onClose} style={{position:"absolute",inset:0}}/>
      <div style={{position:"relative",width:"100%",maxWidth:680,padding:"0 24px"}}>
        <div style={{display:"flex",alignItems:"center",background:C.cream,padding:"16px 20px",gap:14}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input ref={ref} value={q} onChange={e=>setQ(e.target.value)}
            placeholder={L&&L.searchPlaceholder||"Search…"}
            style={{flex:1,border:"none",background:"transparent",fontSize:18,color:C.black,outline:"none",...T.body}}/>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.gray,fontSize:22,lineHeight:1}}>×</button>
        </div>
        {results.length>0&&(
          <div style={{background:C.cream,borderTop:`1px solid ${C.lgray}`,maxHeight:400,overflow:"auto"}}>
            {results.map(p=>(
              <div key={p.id} onClick={()=>{setSelected(p);setPage("product");onClose();}}
                style={{display:"flex",gap:14,padding:"14px 20px",cursor:"pointer",transition:"background 0.15s",borderBottom:`1px solid ${C.lgray}`}}
                onMouseEnter={e=>e.currentTarget.style.background=C.offwhite}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <img src={p.img} alt={p.name} style={{width:48,height:48,objectFit:"cover",flexShrink:0}}/>
                <div>
                  <p style={{...T.heading,color:C.black,marginBottom:3,fontSize:13}}>{p.name}</p>
                  <p style={{...T.labelSm,color:C.gray,fontSize:9}}>{p.section} · {p.cat} · GEL {p.sale||p.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {q.length>1&&results.length===0&&(
          <div style={{background:C.cream,padding:"28px 20px",textAlign:"center"}}>
            <p style={{...T.bodySm,color:C.gray}}>{L&&L.noResults||"No results for"} "{q}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── CART DRAWER ───────────────────────────────────────────────────────────────
function CartDrawer({cart,onClose,setPage,removeFromCart,L,mobile}) {
  const total=cart.reduce((s,o)=>s+(o.sale||o.price),0);
  return (
    <div style={{position:"fixed",inset:0,zIndex:350,display:"flex"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.6)"}}/>
      <div style={{position:"relative",marginLeft:"auto",width:"100%",maxWidth:440,background:C.cream,height:"100%",overflow:"auto",animation:"slideRight 0.3s ease",boxShadow:"-12px 0 50px rgba(0,0,0,0.15)"}}>
        <div style={{padding:"24px 28px",borderBottom:`1px solid ${C.lgray}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.cream,zIndex:2}}>
          <div>
            <p style={{...T.labelSm,color:C.tan,marginBottom:4,fontSize:9}}>{L&&L.yourReserved||"Your"}</p>
            <p style={{...T.heading,color:C.black}}>{L&&L.reservedOrders||"Reserved Orders"} ({cart.length})</p>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.gray,fontSize:22}}>×</button>
        </div>
        <div style={{padding:"20px 28px",flex:1}}>
          {cart.length===0?(
            <div style={{textAlign:"center",padding:"60px 0"}}>
              <p style={{...T.bodySm,color:C.gray,marginBottom:24}}>{L&&L.noReserved||"No reserved orders yet."}</p>
              <HoverBtn onClick={()=>{setPage("catalog");onClose();}} variant="primary">{L&&L.exploreCollection||"Explore Collection"}</HoverBtn>
            </div>
          ):cart.map((o,i)=>(
            <div key={o.orderId||i} style={{display:"flex",gap:14,padding:"16px 0",borderBottom:`1px solid ${C.lgray}`}}>
              <img src={o.img} alt={o.name} style={{width:64,height:64,objectFit:"cover",flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <p style={{...T.heading,color:C.black,fontSize:12,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.name}</p>
                <p style={{...T.labelSm,color:C.gray,fontSize:9,marginBottom:6}}>{o.color}{o.selectedSize&&o.selectedSize!=="One Size"?" · "+o.selectedSize:""}</p>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:C.black}}>GEL {o.sale||o.price}</span>
                  <button onClick={()=>removeFromCart(i)} style={{background:"none",border:"none",...T.labelSm,color:C.gray,fontSize:9}}>{L&&L.removeItem||"Remove"}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length>0&&(
          <div style={{position:"sticky",bottom:0,background:C.cream,borderTop:`1px solid ${C.lgray}`,padding:"20px 28px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
              <span style={{...T.label,color:C.black,fontSize:11}}>{L&&L.totalReserved||"Total Reserved"}</span>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:C.black}}>GEL {total}</span>
            </div>
            <HoverBtn onClick={()=>{setPage("orders");onClose();}} variant="primary" style={{width:"100%"}}>{L&&L.viewAllOrders||"View All Orders"}</HoverBtn>
          </div>
        )}
      </div>
    </div>
  );
}

// ── SIZE GUIDE MODAL ──────────────────────────────────────────────────────────
function SizeGuideModal({onClose,category,L}) {
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

// ── SIZE FIT WIDGET ───────────────────────────────────────────────────────────
function SizeFitWidget({product,onGuide,L}) {
  const [open,setOpen]=useState(false);
  if (!product.fit) return null;
  const {fit,notes}=product.fit;
  const isSmall=fit.toLowerCase().includes("small")||fit.toLowerCase().includes("slim");
  const isLarge=fit.toLowerCase().includes("large")||fit.toLowerCase().includes("oversized")||fit.toLowerCase().includes("relaxed");
  const isTrue=fit.toLowerCase().includes("true");
  const pos=isSmall?1:isLarge?3:isTrue?2:2;
  return (
    <div style={{marginBottom:20}}>
      <button onClick={()=>setOpen(!open)} style={{background:"none",border:`1px solid ${open?C.tan:C.lgray}`,padding:"11px 16px",width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",transition:"border-color 0.2s"}}
        onMouseEnter={e=>e.currentTarget.style.borderColor=C.tan} onMouseLeave={e=>{if(!open)e.currentTarget.style.borderColor=C.lgray}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5">
            <circle cx="12" cy="7" r="4"/><path d="M6 21v-2a4 4 0 018 0v2"/>
          </svg>
          <span style={{...T.labelSm,color:C.black,fontSize:10}}>{L&&L.sizeFit||"Size & Fit"}</span>
          <span style={{...T.bodySm,color:C.tan,fontSize:12,fontStyle:"italic"}}>{fit}</span>
        </div>
        <span style={{color:C.gray,fontSize:11,transition:"transform 0.2s",display:"inline-block",transform:open?"rotate(180deg)":"none"}}>▼</span>
      </button>
      {open&&(
        <div style={{border:`1px solid ${C.tan}`,borderTop:"none",padding:"18px 16px",background:C.offwhite,animation:"slideDown 0.2s ease"}}>
          <div style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",...T.labelSm,color:C.gray,fontSize:8,marginBottom:8}}>
              <span>{L&&L.runSmall||"Runs small"}</span><span>{L&&L.trueToSize||"True to size"}</span><span>{L&&L.runsLarge||"Runs large"}</span>
            </div>
            <div style={{position:"relative",height:4,background:C.lgray,borderRadius:2}}>
              <div style={{position:"absolute",left:`${(pos-1)*50}%`,top:"50%",transform:"translate(-50%,-50%)",width:13,height:13,borderRadius:"50%",background:C.tan,border:`2px solid ${C.cream}`}}/>
            </div>
          </div>
          <p style={{...T.bodySm,color:C.gray,lineHeight:1.7,marginBottom:12}}>{notes}</p>
          <button onClick={onGuide} style={{background:"none",border:"none",...T.labelSm,color:C.tan,fontSize:9,padding:0,textDecoration:"underline"}}>{L&&L.fullSizeGuide||'Full size guide →'}</button>
        </div>
      )}
    </div>
  );
}

// ── PRODUCT CARD ──────────────────────────────────────────────────────────────
function ProductCard({product:p,onSelect,wishlist,onWishlist,L,mobile}) {
  const [h,setH]=useState(false);
  const wished=wishlist?.includes(p.id);
  const deposit=Math.round((p.sale||p.price)*0.5);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onSelect}
      style={{cursor:"pointer",background:C.offwhite,overflow:"hidden",position:"relative"}}>
      <div style={{height:mobile?280:340,overflow:"hidden",position:"relative"}}>
        <img src={p.img} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",transform:h?"scale(1.04)":"scale(1)",transition:"transform 0.6s ease"}}/>
        <div style={{position:"absolute",top:10,left:10,display:"flex",gap:5,flexWrap:"wrap"}}>
          {p.tag==="Sale"&&<span style={{...T.labelSm,color:C.white,background:C.red,padding:"4px 10px",fontSize:8}}>SALE</span>}
          {p.tag==="New"&&<span style={{...T.labelSm,color:C.white,background:C.black,padding:"4px 10px",fontSize:8}}>NEW</span>}
          {p.tag==="Popular"&&<span style={{...T.labelSm,color:C.white,background:C.brown,padding:"4px 10px",fontSize:8}}>POPULAR</span>}
          {p.tag==="Limited"&&<span style={{...T.labelSm,color:C.white,background:C.tan,padding:"4px 10px",fontSize:8}}>LIMITED</span>}
        </div>
        {onWishlist&&(
          <button onClick={e=>{e.stopPropagation();onWishlist(p.id);}}
            style={{position:"absolute",top:8,right:8,background:wished?"rgba(177,154,122,0.9)":"rgba(255,255,255,0.85)",border:"none",width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={wished?C.white:"none"} stroke={wished?C.white:C.gray} strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>
        )}
      </div>
      <div style={{padding:"14px 14px 16px",borderTop:`1px solid ${C.lgray}`}}>
        <p style={{...T.labelSm,color:C.tan,marginBottom:4,fontSize:9}}>{p.brand}</p>
        <p style={{...T.heading,color:C.black,marginBottom:3,fontSize:13}}>{p.name}</p>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginTop:6}}>
          <div>
            {p.sale?(
              <span style={{display:"flex",alignItems:"baseline",gap:8}}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:C.red,lineHeight:1}}>GEL {p.sale}</span>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:13,color:C.gray,textDecoration:"line-through"}}>GEL {p.price}</span>
              </span>
            ):(
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:C.black,lineHeight:1}}>GEL {p.price}</span>
            )}
          </div>
          <span style={{...T.labelSm,color:C.lgray,fontSize:8}}>from GEL {deposit}</span>
        </div>
      </div>
    </div>
  );
}

// ── CATALOG PAGE ──────────────────────────────────────────────────────────────
function CatalogPage({setPage,setSelected,wishlist,onWishlist,initSection,initSub,L,toast,user,setUser,mobile}) {
  const [section,setSection]=useState(initSection||"Womenswear");
  const [subCat,setSubCat]=useState("All");
  const [price,setPrice]=useState("all");
  const [sortBy,setSortBy]=useState("picks");
  const [refineOpen,setRefineOpen]=useState(false);

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
            <span style={{...T.labelSm,color:C.gray,fontSize:9}}>{filtered.length} {L.pieces}</span>
              {!mobile&&<select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{...T.labelSm,fontSize:9,padding:"8px 12px",border:`1px solid ${C.lgray}`,background:C.cream,color:C.black,cursor:"pointer",outline:"none",appearance:"none",paddingRight:28,backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a8a296' strokeWidth='1.2'/%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 10px center"}}>
                <option value="picks">Our Picks</option>
                <option value="new">Newest first</option>
                <option value="high">Price: high to low</option>
                <option value="low">Price: low to high</option>
              </select>}
          </div>
          {!mobile&&(
            <div style={{display:"flex",alignItems:"center",gap:16,padding:"10px 0",marginBottom:8}}>
              <span style={{...T.labelSm,color:C.tan,fontSize:8}}>PRE-ORDER MODEL</span>
              <span style={{width:1,height:14,background:C.lgray}}/>
              <span style={{...T.bodySm,color:C.gray,fontSize:11}}>Reserve with 50% deposit · Sourced & verified · Delivered in 10–18 days to Tbilisi</span>
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
            {filtered.map(p=><ProductCard key={p.id} product={p} wishlist={wishlist} onWishlist={onWishlist} L={L}
              onSelect={()=>{setSelected(p);setPage("product");}}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ── PRODUCT PAGE ──────────────────────────────────────────────────────────────
function ProductPage({mobile,product:p,setPage,setSelected,addToCart,toast,wishlist,onWishlist,L}) {
  const [selectedSize,setSelectedSize]=useState(null);
  const [showModal,setShowModal]=useState(false);
  const [sizeError,setSizeError]=useState(false);
  const [activeImg,setActiveImg]=useState(0);
  const [showGuide,setShowGuide]=useState(false);

  // All hooks must run before early return
  const imgs=p?[p.img,BI.bag_stone,BI.packaging,BI.ribbon]:[];
  const effectivePrice=p?(p.sale||p.price):0;
  const deposit=p?Math.round(effectivePrice*0.5):0;
  const related=p?PRODUCTS.filter(x=>x.section===p.section&&x.cat===p.cat&&x.id!==p.id).slice(0,4):[];

  useEffect(()=>{setSelectedSize(null);setSizeError(false);setActiveImg(0);},[p?.id]);

  if (!p) return (
    <div style={{paddingTop:180,textAlign:"center",minHeight:"100vh",background:C.cream}}>
      <p style={{...T.displaySm,color:C.gray,marginBottom:24}}>Product not found</p>
      <HoverBtn onClick={()=>setPage("catalog")} variant="primary">Back to Collection</HoverBtn>
    </div>
  );

  const handleReserve=()=>{
    if (p.sizes.length>1&&p.sizes[0]!=="One Size"&&!selectedSize){setSizeError(true);return;}
    setSizeError(false);
    setShowModal(true);
  };

  const wished=wishlist?.includes(p.id);
  const guideCategory=p.sub==="Shoes"?"Shoes":p.sub==="Bags"?"Bags":"Clothing";

  return (
    <div style={{paddingTop:80,background:C.cream}}>
      <div style={{maxWidth:1360,margin:"0 auto",padding:"20px 40px 0",display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
        {[["Home","home"],[p.section,"catalog"],[p.name,null]].map(([l,pg],i,arr)=>(
          <span key={i} style={{display:"flex",alignItems:"center",gap:6}}>
            {pg?<button onClick={()=>setPage(pg)} style={{background:"none",border:"none",...T.labelSm,color:C.gray,fontSize:8}}>{l}</button>
              :<span style={{...T.labelSm,color:C.black,fontSize:8,overflow:"hidden",textOverflow:"ellipsis",maxWidth:200,whiteSpace:"nowrap"}}>{l}</span>}
            {i<arr.length-1&&<span style={{color:C.lgray,fontSize:8,flexShrink:0}}>→</span>}
          </span>
        ))}
      </div>

      <div style={{maxWidth:1360,margin:"0 auto",padding:mobile?"16px 16px 60px":"28px 40px 80px",display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?28:72,alignItems:"start"}}>
        <div style={{position:mobile?"relative":"sticky",top:mobile?"auto":96}}>
          <div style={{height:mobile?380:520,overflow:"hidden",marginBottom:3,position:"relative"}}>
            <img src={imgs[activeImg]} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            {p.sale&&<div style={{position:"absolute",top:14,left:14,background:C.red,padding:"5px 12px"}}><span style={{...T.label,color:C.white,fontSize:9}}>Sale</span></div>}
            <button onClick={()=>onWishlist&&onWishlist(p.id)}
              style={{position:"absolute",top:14,right:14,background:wished?"rgba(177,154,122,0.9)":"rgba(255,255,255,0.85)",border:"none",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={wished?C.white:"none"} stroke={wished?C.white:C.gray} strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:3}}>
            {imgs.map((src,i)=>(
              <div key={i} onClick={()=>setActiveImg(i)} style={{height:78,overflow:"hidden",cursor:"pointer",border:`2px solid ${i===activeImg?C.tan:"transparent"}`,transition:"border-color 0.2s"}}>
                <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p style={{...T.labelSm,color:C.tan,marginBottom:6,fontSize:10,letterSpacing:"0.2em"}}>{p.brand}</p>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:mobile?30:38,fontWeight:300,color:C.black,lineHeight:1.15,marginBottom:6}}>{p.name}</h1>
          <p style={{...T.bodySm,color:C.gray,marginBottom:20,fontSize:13}}>{p.color} · {p.section}</p>

          <div style={{marginBottom:24,display:"flex",alignItems:"baseline",gap:12}}>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,color:p.sale?C.red:C.black,lineHeight:1}}>GEL {effectivePrice}</span>
            {p.sale&&<span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:C.gray,textDecoration:"line-through"}}>GEL {p.price}</span>}
          </div>

          <div style={{padding:"16px 18px",background:C.offwhite,marginBottom:20,borderLeft:`3px solid ${C.tan}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{...T.labelSm,color:C.gray,fontSize:9}}>Reserve now (50%)</span>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:C.black}}>GEL {deposit}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",paddingTop:7,borderTop:`1px solid ${C.lgray}`}}>
              <span style={{...T.labelSm,color:C.gray,fontSize:9}}>Pay on delivery (50%)</span>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.gray}}>GEL {effectivePrice-deposit}</span>
            </div>
          </div>

          {p.sizes&&p.sizes.length>1&&p.sizes[0]!=="One Size"&&(
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <p style={{...T.label,color:sizeError?C.red:C.black,fontSize:11}}>{sizeError?"⚠ Please select a size":"Select Size"}</p>
                <button onClick={()=>setShowGuide(true)} style={{background:"none",border:"none",...T.labelSm,color:C.tan,fontSize:9,textDecoration:"underline"}}>Size guide</button>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {p.sizes.map(sz=>(
                  <button key={sz} onClick={()=>{setSelectedSize(sz);setSizeError(false);}} style={{
                    padding:"9px 14px",border:`1px solid ${selectedSize===sz?C.black:C.lgray}`,
                    background:selectedSize===sz?C.black:"transparent",
                    color:selectedSize===sz?C.white:C.black,
                    ...T.labelSm,fontSize:10,transition:"all 0.15s",
                  }}>{sz}</button>
                ))}
              </div>
            </div>
          )}

          <SizeFitWidget product={p} onGuide={()=>setShowGuide(true)} L={L}/>

          <div style={{marginBottom:20,padding:"18px",border:`1.5px solid ${C.tan}`,background:`rgba(177,154,122,0.05)`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,right:0,background:C.tan,padding:"3px 10px"}}>
              <span style={{...T.labelSm,color:C.white,fontSize:7}}>RECOMMENDED</span>
            </div>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:C.black,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:15}}>📹</span>
              </div>
              <div style={{flex:1}}>
                <p style={{...T.label,color:C.black,fontSize:11,marginBottom:4}}>See This Item Before It Ships</p>
                <p style={{...T.bodySm,color:C.gray,lineHeight:1.7,marginBottom:6}}>Our team video-calls you on WhatsApp to show the exact item — hardware, stitching, material, in motion.</p>
                <span style={{...T.label,color:C.tan,fontSize:10}}>+ GEL 15 at checkout</span>
              </div>
            </div>
          </div>

          {/* PRE-ORDER EXPLAINER */}
          <div style={{padding:"14px 16px",background:"rgba(177,154,122,0.06)",marginBottom:16}}>
            <p style={{...T.labelSm,color:C.tan,fontSize:8,marginBottom:10}}>HOW PRE-ORDER WORKS</p>
            <div style={{display:"flex",gap:mobile?8:16}}>
              {[["1","Reserve 50%"],["2","We source & verify"],["3","Pay rest on delivery"]].map(([n,t])=>(
                <div key={n} style={{display:"flex",alignItems:"center",gap:6,flex:1}}>
                  <span style={{width:20,height:20,borderRadius:"50%",background:C.black,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",...T.labelSm,fontSize:8,flexShrink:0}}>{n}</span>
                  <span style={{...T.bodySm,color:C.brown,fontSize:mobile?9:11,lineHeight:1.3}}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TRUST GUARANTEES */}
          <div style={{display:"flex",flexDirection:"column",gap:0,marginBottom:20}}>
            {[
              {icon:"✓",text:"100% Authenticity Guaranteed — or full refund"},
              {icon:"🔒",text:"Secure payment. Full refund if item unavailable"},
              {icon:"📦",text:`Estimated delivery: ${p.lead}`},
            ].map((g,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<2?`1px solid ${C.lgray}`:"none"}}>
                <span style={{fontSize:13,flexShrink:0}}>{g.icon}</span>
                <span style={{...T.bodySm,color:C.gray,fontSize:12}}>{g.text}</span>
              </div>
            ))}
          </div>

          {/* DELIVERY TIMELINE */}
          <div style={{marginBottom:24,padding:"16px",background:C.offwhite}}>
            <p style={{...T.labelSm,color:C.tan,fontSize:8,marginBottom:14}}>DELIVERY TIMELINE</p>
            <div style={{display:"flex",alignItems:"flex-start",gap:0}}>
              {[{l:"Reserve",d:"Today"},{l:"Source",d:"2–3d"},{l:"Verify",d:"1–2d"},{l:"Ship",d:"5–10d"},{l:"Receive",d:p.lead}].map((step,i,arr)=>(
                <div key={i} style={{flex:1,textAlign:"center",position:"relative"}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:i===0?C.tan:C.lgray,margin:"0 auto 6px",position:"relative",zIndex:1}}/>
                  {i<arr.length-1&&<div style={{position:"absolute",top:4,left:"55%",width:"90%",height:1,background:C.lgray}}/>}
                  <p style={{...T.labelSm,fontSize:7,color:i===0?C.black:C.gray,lineHeight:1.2}}>{step.l}</p>
                  <p style={{...T.labelSm,fontSize:6,color:C.lgray,marginTop:2}}>{step.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{marginBottom:24}}>
            <p style={{...T.label,color:C.black,marginBottom:10,fontSize:11}}>Item Details</p>
            <p style={{...T.body,color:C.gray,lineHeight:1.85}}>{p.desc}</p>
          </div>

          <div style={{marginBottom:28}}>
            {[["Lead time",p.lead],["Delivery","Tbilisi, Georgia"],["Verified","✓ Liza-checked, Shanghai"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.lgray}`}}>
                <span style={{...T.labelSm,color:C.gray,fontSize:9}}>{k}</span>
                <span style={{...T.bodySm,color:C.black}}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{display:"flex",gap:10,marginBottom:10}}>
            <HoverBtn onClick={handleReserve} variant="primary" style={{flex:1,padding:"16px 20px",fontSize:11}}>
              Reserve Now — GEL {deposit} Deposit
            </HoverBtn>
            <a href="https://wa.me/995500000000" target="_blank" rel="noopener noreferrer"
              style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"15px 20px",border:`1px solid ${C.lgray}`,background:"transparent",color:C.black,...T.labelSm,fontSize:10,textDecoration:"none",transition:"all 0.2s",whiteSpace:"nowrap"}}
              onMouseEnter={e=>{e.currentTarget.style.background=C.black;e.currentTarget.style.color=C.white;e.currentTarget.style.borderColor=C.black;}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.black;e.currentTarget.style.borderColor=C.lgray;}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
              </svg>
              Ask on WhatsApp
            </a>
          </div>
          <p style={{...T.labelSm,color:C.gray,fontSize:9,textAlign:"center"}}>Free cancellation before shipping</p>
        </div>
      </div>

      {related.length>0&&(
        <div style={{borderTop:`1px solid ${C.lgray}`,padding:"64px 0",background:C.offwhite}}>
          <div style={{maxWidth:1360,margin:"0 auto",padding:"0 40px"}}>
            <p style={{...T.labelSm,color:C.tan,marginBottom:10}}>From the same collection</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:3}}>
              {related.map(item=><ProductCard key={item.id} product={item} wishlist={wishlist} onWishlist={onWishlist} L={L}
                onSelect={()=>{setSelected(item);window.scrollTo({top:0,behavior:"smooth"});}}/>)}
            </div>
          </div>
        </div>
      )}

      {showModal&&<PreorderModal product={p} selectedSize={selectedSize||"One Size"} L={L} onClose={()=>setShowModal(false)}
        onComplete={data=>{addToCart(data);setShowModal(false);toast(L&&L.orderReserved||"Order reserved!","success");}}/>}
      {showGuide&&<SizeGuideModal onClose={()=>setShowGuide(false)} category={guideCategory} L={L}/>}
    </div>
  );
}

// ── PREORDER MODAL ────────────────────────────────────────────────────────────
function PreorderModal({product:p,selectedSize,onClose,onComplete,L}) {
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({name:"",phone:"",notes:""});
  const [wantVideo,setWantVideo]=useState(false);
  const [payMethod,setPayMethod]=useState("BOG");
  const [formError,setFormError]=useState("");
  const effectivePrice=p.sale||p.price;
  const deposit=Math.round(effectivePrice*0.5);
  const videoGEL=28; // ~€10

  const handleNext=()=>{
    if (step===1){
      if (!form.name.trim()||!form.phone.trim()){setFormError(L&&L.enterNamePhone||'Enter name and WhatsApp.');return;}
      setFormError("");
      setStep(2);
    } else if (step===2){
      setStep(3);
    } else {
      const orderId="ALT-2026-"+String(Math.floor(Math.random()*9000)+1000);
      onComplete({...p,orderId,status:"reserved",depositPaid:deposit,selectedSize,wantVideo,customerName:form.name,phone:form.phone});
    }
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.75)"}}/>
      <div style={{position:"relative",marginLeft:"auto",width:"100%",maxWidth:500,background:C.cream,height:"100%",overflow:"auto",animation:"slideRight 0.3s ease",boxShadow:"-12px 0 50px rgba(0,0,0,0.2)"}}>
        <div style={{padding:"24px 32px",borderBottom:`1px solid ${C.lgray}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.cream,zIndex:2}}>
          <div>
            <p style={{...T.labelSm,color:C.tan,fontSize:9,marginBottom:4}}>Step {step} of 3</p>
            <p style={{...T.heading,color:C.black}}>{step===1?(L&&L.yourDetails||'Your Details'):step===2?(L&&L.reviewPay||'Review & Pay'):(L&&L.orderConfirmed||'Order Confirmed')}</p>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.gray,fontSize:22}}>×</button>
        </div>
        <div style={{display:"flex"}}>
          {[1,2,3].map(n=><div key={n} style={{flex:1,height:3,background:step>=n?C.tan:C.lgray,transition:"background 0.3s",marginRight:n<3?1:0}}/>)}
        </div>

        <div style={{padding:"28px 32px"}}>
          <div style={{display:"flex",gap:12,padding:14,background:C.offwhite,marginBottom:24}}>
            <img src={p.img} alt={p.name} style={{width:56,height:56,objectFit:"cover",flexShrink:0}}/>
            <div>
              <p style={{...T.heading,color:C.black,fontSize:13,marginBottom:2}}>{p.name}</p>
              <p style={{...T.labelSm,color:C.gray,fontSize:9,marginBottom:5}}>{p.color}{selectedSize&&selectedSize!=="One Size"?" · "+selectedSize:""}</p>
              <p style={{...T.bodySm,color:C.tan}}>GEL {effectivePrice} total</p>
            </div>
          </div>

          {step===1&&(
            <>
              <p style={{...T.label,color:C.black,fontSize:11,marginBottom:16}}>{L&&L.contactDetails||'Contact Details'}</p>
              {formError&&<p style={{...T.bodySm,color:C.red,marginBottom:14}}>{formError}</p>}
              {[[L&&L.fullName||"Full name *","name","text","Your full name"],[L&&L.whatsapp||"WhatsApp *","phone","tel","+995 5XX XXX XXX"],[L&&L.notes||"Notes","notes","text",L&&L.notesPlaceholder||"Notes…"]].map(([label,key,type,ph])=>(
                <div key={key} style={{marginBottom:16}}>
                  <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{label}</label>
                  <input type={type} placeholder={ph} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}
                    style={{width:"100%",padding:"12px 14px",border:`1px solid ${(key==="name"||key==="phone")&&formError&&!form[key].trim()?C.red:C.lgray}`,background:C.white,fontSize:14,color:C.black,outline:"none"}}/>
                </div>
              ))}
              <p style={{...T.labelSm,color:C.tan,fontSize:8,marginBottom:8,marginTop:8}}>VIDEO VERIFICATION</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <button type="button" onClick={()=>setWantVideo(false)}
                  style={{padding:"14px 10px",background:!wantVideo?C.black:"transparent",border:`1.5px solid ${!wantVideo?C.black:C.lgray}`,cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
                  <p style={{...T.label,fontSize:10,color:!wantVideo?C.white:C.black,marginBottom:2}}>Standard</p>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:!wantVideo?C.white:C.black}}>GEL {deposit}</p>
                </button>
                <button type="button" onClick={()=>setWantVideo(true)}
                  style={{padding:"14px 10px",background:wantVideo?C.black:"transparent",border:`1.5px solid ${wantVideo?C.tan:C.lgray}`,cursor:"pointer",textAlign:"center",position:"relative",transition:"all 0.2s"}}>
                  {<div style={{position:"absolute",top:-1,right:-1,background:C.tan,padding:"2px 8px"}}><span style={{...T.labelSm,color:C.white,fontSize:6}}>RECOMMENDED</span></div>}
                  <p style={{...T.label,fontSize:10,color:wantVideo?C.white:C.black,marginBottom:2}}>📹 With Video</p>
                  <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:wantVideo?C.white:C.black}}>GEL {deposit+videoGEL}</p>
                </button>
              </div>
            </>
          )}

          {step===2&&(
            <>
              <p style={{...T.label,color:C.black,fontSize:11,marginBottom:16}}>{L&&L.orderSummary||"Order Summary"}</p>
              {[
                [L&&L.item||"Item",p.name],[L&&L.size||"Size",selectedSize||"One Size"],[L&&L.leadTime||"Lead time",p.lead],
                [L&&L.depositNow||"Deposit now (50%)",`GEL ${deposit}`],
                [L&&L.balanceDelivery||"Balance on delivery",`GEL ${effectivePrice-deposit}`],
                ...(wantVideo?[[L&&L.videoVerif||"Video verification",`GEL ${videoGEL}`]]:[]),
                [L&&L.total||"Total",`GEL ${effectivePrice+(wantVideo?videoGEL:0)}`],
              ].map(([k,v],i,arr)=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.lgray}`,fontWeight:i===arr.length-1?500:300}}>
                  <span style={{...T.labelSm,color:i===arr.length-1?C.black:C.gray,fontSize:9}}>{k}</span>
                  <span style={{...T.bodySm,color:i===arr.length-1?C.black:C.gray,fontWeight:i===arr.length-1?500:300}}>{v}</span>
                </div>
              ))}
              <div style={{padding:"14px 16px",background:C.offwhite,margin:"16px 0",borderLeft:`3px solid ${C.tan}`}}>
                <p style={{...T.bodySm,color:C.brown,lineHeight:1.7,fontSize:12}}>
                  {L&&L.refundNote||'Deposit is fully refundable before shipping.'}{wantVideo?" Video will be sent to your WhatsApp before dispatch.":""}
                </p>
              </div>
              <p style={{...T.label,color:C.black,fontSize:11,marginBottom:12}}>{L&&L.paymentMethod||"Payment Method"}</p>
              {[["BOG",L&&L.bogTransfer||"BOG / TBC Bank Transfer",L&&L.recommended||"Recommended"],["card",L&&L.cardPayment||"Card Payment",""]].map(([v,m,tag])=>(
                <div key={v} onClick={()=>setPayMethod(v)} style={{display:"flex",alignItems:"center",gap:12,padding:12,border:`1px solid ${payMethod===v?C.tan:C.lgray}`,marginBottom:8,cursor:"pointer",transition:"border-color 0.2s"}}>
                  <div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${payMethod===v?C.tan:C.lgray}`,background:payMethod===v?C.tan:"transparent",transition:"all 0.2s",flexShrink:0}}/>
                  <span style={{...T.bodySm,color:C.black}}>{m}</span>
                  {tag&&<span style={{...T.labelSm,color:C.tan,fontSize:9,marginLeft:"auto"}}>{tag}</span>}
                </div>
              ))}
            </>
          )}

          {step===3&&(
            <div style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{width:56,height:56,borderRadius:"50%",border:`2px solid ${C.tan}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:22,color:C.tan}}>✓</div>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300,color:C.black,marginBottom:12}}>{L&&L.orderConfirmed||"Order Confirmed"}</h3>
              <p style={{...T.body,color:C.gray,marginBottom:24,lineHeight:1.8}}>
{L&&L.contactNote||"We will contact you on WhatsApp at"} <strong>{form.phone}</strong> {L&&L.within2h||"within 2 hours."}
{wantVideo&&(L&&L.videoShipping||" Video will be sent before shipping.")}
              </p>
              <div style={{background:C.offwhite,padding:16,textAlign:"left",marginBottom:24}}>
                {[[L&&L.status||"Status",L&&L.processing||"Processing"],[L&&L.leadTime||"Lead time",p.lead],[L&&L.depositDue||"Deposit due",`GEL ${deposit}`]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.lgray}`}}>
                    <span style={{...T.labelSm,color:C.gray,fontSize:9}}>{k}</span>
                    <span style={{...T.bodySm,color:C.black}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <HoverBtn onClick={handleNext} variant="primary" style={{width:"100%",padding:"15px 24px"}}>
{step===1?(L&&L.reviewOrder||"Review Order →"):step===2?`${L&&L.confirmPay||"Confirm & Pay Deposit"} — GEL ${deposit}`:(L&&L.viewMyOrders||"View My Orders →")}
          </HoverBtn>
        </div>
      </div>
    </div>
  );
}

// ── ORDERS PAGE ───────────────────────────────────────────────────────────────
function OrdersPage({mobile,orders,setPage,toast,L}) {
  const demoOrders=[
    {id:101,name:"Structured lambskin tote",section:"Womenswear",cat:"Bags",color:"Camel",price:320,sale:null,img:BI.bag_stone,orderId:"ALT-2026-156",status:"sourcing",depositPaid:160,lead:"10–14 days",selectedSize:"One Size",wantVideo:false},
    {id:102,name:"Mesh dial automatic watch",section:"Menswear",cat:"Watches",color:"Silver",price:480,sale:null,img:BI.man_editorial,orderId:"ALT-2026-138",status:"shipped",depositPaid:240,lead:"14–18 days",selectedSize:"One Size",wantVideo:true},
  ];
  const allOrders=orders.length>0?orders:demoOrders;
  const [active,setActive]=useState(allOrders[0]);

  useEffect(()=>{if(allOrders.length>0&&!active)setActive(allOrders[0]);},[allOrders.length]);

  const current=active||allOrders[0];
  const si=ORDER_STATUSES.findIndex(s=>s.key===current?.status);

  const handleCancel=()=>{
    if(window.confirm&&window.confirm(L&&L.cancelConfirm||"Cancel this order? Deposit will be refunded.")){
      toast(L&&L.cancelSuccess||"Cancellation request sent.","success");
    }
  };

  return (
    <div style={{paddingTop:80,minHeight:"100vh",background:C.cream}}>
      <div style={{padding:"32px 0 20px",borderBottom:`1px solid ${C.lgray}`}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:"0 40px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div>
            <p style={{...T.labelSm,color:C.tan,marginBottom:8}}>{L&&L.myAccount||'Account'}</p>
            <h1 style={{...T.displayMd,color:C.black}}>{L&&L.myOrders||'My Orders'}</h1>
          </div>
          <HoverBtn onClick={()=>setPage("catalog")} variant="secondary" style={{padding:"10px 24px",fontSize:10}}>{L&&L.continueShopping||"Continue Shopping"}</HoverBtn>
        </div>
      </div>

      <div style={{maxWidth:1360,margin:"0 auto",padding:"32px 40px 80px",display:"grid",gridTemplateColumns:mobile?"1fr":"300px 1fr",gap:mobile?20:32}}>
        <div>
          {allOrders.map(o=>{
            const osi=ORDER_STATUSES.findIndex(s=>s.key===o.status);
            const isA=current?.orderId===o.orderId;
            return (
              <div key={o.orderId} onClick={()=>setActive(o)} style={{padding:16,marginBottom:2,cursor:"pointer",background:isA?C.offwhite:C.cream,border:isA?`1px solid ${C.tan}`:"1px solid transparent",transition:"all 0.2s"}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <img src={o.img} alt="" style={{width:48,height:48,objectFit:"cover",flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{...T.heading,color:C.black,fontSize:12,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.name}</p>
                    <p style={{...T.labelSm,color:C.gray,fontSize:8,marginBottom:6}}>{o.orderId}</p>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:ORDER_STATUSES[osi]?.color||C.tan,flexShrink:0}}/>
                      <span style={{...T.labelSm,fontSize:8,color:C.black}}>{ORDER_STATUSES[osi]?.label}</span>
                      {o.wantVideo&&<span style={{...T.labelSm,fontSize:7,color:C.tan,padding:"1px 6px",border:`1px solid ${C.tan}`}}>VIDEO</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {current&&(
          <div>
            <div style={{marginBottom:28}}>
              <div style={{display:"flex",marginBottom:8,gap:2}}>
                {ORDER_STATUSES.map((s,i)=><div key={i} style={{flex:1,height:3,background:i<=si?s.color:C.lgray,transition:"background 0.3s"}}/>)}
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                {ORDER_STATUSES.map((s,i)=>(
                  <span key={i} style={{...T.labelSm,fontSize:8,color:i===si?s.color:C.gray,fontWeight:i===si?500:300}}>{s.label}</span>
                ))}
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
              <img src={current.img} alt={current.name} style={{width:"100%",height:220,objectFit:"cover"}}/>
              <div>
                <p style={{...T.labelSm,color:C.tan,fontSize:9,marginBottom:6}}>{current.orderId}</p>
                <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:300,color:C.black,lineHeight:1.2,marginBottom:6}}>{current.name}</h2>
                <p style={{...T.bodySm,color:C.gray,marginBottom:18}}>{current.color}{current.selectedSize&&current.selectedSize!=="One Size"?" · "+current.selectedSize:""}</p>
                <div style={{padding:16,background:C.offwhite,borderLeft:`3px solid ${ORDER_STATUSES[si]?.color||C.tan}`,marginBottom:14}}>
                  <p style={{...T.labelSm,color:ORDER_STATUSES[si]?.color||C.tan,marginBottom:5,fontSize:9}}>Current status</p>
                  <p style={{...T.label,color:C.black,fontSize:11,marginBottom:4}}>{ORDER_STATUSES[si]?.label}</p>
                  <p style={{...T.bodySm,color:C.gray,lineHeight:1.7,fontSize:12}}>{ORDER_STATUSES[si]?.desc}</p>
                </div>
                {current.wantVideo&&(
                  <div style={{padding:"10px 14px",background:`rgba(177,154,122,0.08)`,border:`1px solid ${C.tan}`,marginBottom:14}}>
                    <p style={{...T.labelSm,color:C.tan,fontSize:9}}>▷ Video verification included — will be sent to WhatsApp before dispatch</p>
                  </div>
                )}
                {[["Deposit paid",`GEL ${current.depositPaid}`],["Balance on delivery",`GEL ${(current.sale||current.price)-current.depositPaid}`],["Total",`GEL ${current.sale||current.price}`]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.lgray}`}}>
                    <span style={{...T.labelSm,color:C.gray,fontSize:9}}>{k}</span>
                    <span style={{...T.bodySm,color:C.black}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {(current.status==="reserved"||current.status==="sourcing")&&(
              <HoverBtn onClick={handleCancel} variant="danger" style={{padding:"10px 24px",fontSize:10}}>
                {L&&L.cancelOrder||"Cancel Order (Free)"}
              </HoverBtn>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── AUTH PAGE ─────────────────────────────────────────────────────────────────
function AuthPage({mobile,setPage,setUser,toast,L}) {
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({name:"",email:"",phone:"",password:""});
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  const handleSubmit=()=>{
    setError("");
    if (mode==="login"){
      if (!form.email||!form.password){setError("Enter email and password.");return;}
      setLoading(true);
      setTimeout(()=>{
        setLoading(false);
        if (form.email==="demo@alternative.ge"&&form.password==="demo123"){
          setUser({name:"Demo User",email:form.email,isAdmin:false});
          toast(L&&L.welcomeBack||"Welcome back!","success");
          setPage("account");
        } else if (form.email==="admin@alternative.ge"&&form.password==="admin123"){
          setUser({name:"Admin",email:form.email,isAdmin:true});
          toast(L&&L.welcomeAdmin||"Welcome, Admin","success");
          setPage("admin");
        } else {
          setError("Incorrect email or password.");
        }
      },600);
    } else {
      if (!form.name||!form.email||!form.password){setError("All marked fields are required.");return;}
      if (form.password.length<6){setError("Password must be at least 6 characters.");return;}
      if (!form.email.includes("@")){setError("Enter a valid email address.");return;}
      setLoading(true);
      setTimeout(()=>{
        setLoading(false);
        setUser({name:form.name,email:form.email,isAdmin:false});
        toast("Account created! Welcome to Alternative.","success");
        setPage("account");
      },800);
    }
  };

  return (
    <div style={{paddingTop:mobile?52:80,minHeight:"100vh",background:C.cream,display:"flex",alignItems:"center",justifyContent:"center",padding:mobile?"60px 16px 40px":"80px 20px 40px"}}>
      <div style={{width:"100%",maxWidth:420,padding:"48px 44px",background:C.white}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <Logo color={C.black} size={0.8}/>
          <div style={{marginTop:24,display:"flex",background:C.offwhite}}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setError("");}} style={{flex:1,padding:"11px",background:mode===m?C.black:"transparent",color:mode===m?C.white:C.gray,...T.labelSm,fontSize:9,border:"none",transition:"all 0.2s"}}>
{m==="login"?(L&&L.signInBtn||"Sign In"):(L&&L.createAccount||"Create Account")}
              </button>
            ))}
          </div>
        </div>

        {error&&<div style={{padding:"11px 14px",background:"#fff5f5",border:`1px solid ${C.red}`,marginBottom:18}}><p style={{...T.bodySm,color:C.red,fontSize:12}}>{error}</p></div>}

        {mode==="register"&&(
          <div style={{marginBottom:14}}>
            <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{L&&L.fullNameLabel||"Full Name *"}</label>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your full name"
              style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,fontSize:14,color:C.black,outline:"none"}}/>
          </div>
        )}
        <div style={{marginBottom:14}}>
          <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{L&&L.emailLabel||"Email *"}</label>
          <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com"
            onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
            style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,fontSize:14,color:C.black,outline:"none"}}/>
        </div>
        {mode==="register"&&(
          <div style={{marginBottom:14}}>
            <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{L&&L.whatsappLabel||"WhatsApp Number"}</label>
            <input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+995 5XX XXX XXX"
              style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,fontSize:14,color:C.black,outline:"none"}}/>
          </div>
        )}
        <div style={{marginBottom:22}}>
          <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{L&&L.passwordLabel||"Password *"}</label>
          <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••"
            onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
            style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,fontSize:14,color:C.black,outline:"none"}}/>
        </div>
        <HoverBtn onClick={handleSubmit} variant="primary" style={{width:"100%",padding:"15px"}} disabled={loading}>
          {loading?<span style={{display:"inline-block",width:16,height:16,border:`2px solid rgba(255,255,255,0.3)`,borderTop:`2px solid ${C.white}`,borderRadius:"50%",animation:"spinAnim 0.7s linear infinite"}}/>:mode==="login"?(L&&L.signInBtn||"Sign In"):(L&&L.createAccount||"Create Account")}
        </HoverBtn>
        {mode==="login"&&(
          <p style={{...T.bodySm,color:C.gray,textAlign:"center",marginTop:14,fontSize:11,lineHeight:1.8}}>
            Demo: demo@alternative.ge / demo123<br/>
            <span style={{color:C.tan}}>Admin: admin@alternative.ge / admin123</span>
          </p>
        )}
      </div>
    </div>
  );
}

// ── ACCOUNT PAGE ──────────────────────────────────────────────────────────────
function AccountPage({mobile,user,setUser,setPage,orders,toast,L}) {
  const [tab,setTab]=useState("orders"); // orders | wishlist | settings

  useEffect(()=>{if(!user)setPage("auth");},[user]);
  if (!user) return null;

  return (
    <div style={{paddingTop:mobile?52:80,minHeight:"100vh",background:C.cream}}>
      <div style={{borderBottom:`1px solid ${C.lgray}`,padding:"36px 0 24px"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:"0 40px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div>
            <p style={{...T.labelSm,color:C.tan,marginBottom:8}}>{L&&L.myAccount||"My Account"}</p>
            <h1 style={{...T.displayMd,color:C.black}}>{L&&L.welcome||"Welcome,"} {user.name.split(" ")[0]}</h1>
          </div>
          <div style={{display:"flex",gap:10}}>
            {user.isAdmin&&<HoverBtn onClick={()=>setPage("admin")} variant="tan" style={{padding:"10px 20px",fontSize:10}}>{L&&L.adminPanel||"Admin Panel"}</HoverBtn>}
            <HoverBtn onClick={()=>{setUser(null);toast("","");setPage("home");}} variant="secondary" style={{padding:"10px 20px",fontSize:10}}>{L&&L.signOut||"Sign Out"}</HoverBtn>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1360,margin:"0 auto",padding:"36px 40px",display:"grid",gridTemplateColumns:mobile?"1fr":"220px 1fr",gap:mobile?20:48}}>
        <div>
          <div style={{padding:"18px",background:C.offwhite,marginBottom:20,borderLeft:`3px solid ${C.tan}`}}>
            <p style={{...T.label,color:C.black,fontSize:12,marginBottom:3}}>{user.name}</p>
            <p style={{...T.bodySm,color:C.gray}}>{user.email}</p>
          </div>
          {[["orders",L&&L.myOrders||"My Orders"],["settings",L&&L.settings||"Settings"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{display:"block",width:"100%",textAlign:"left",padding:"12px 0",background:"none",border:"none",borderBottom:`1px solid ${C.lgray}`,...T.bodySm,color:tab===k?C.black:C.gray,fontWeight:tab===k?500:300}}>
              {l}
            </button>
          ))}
        </div>

        <div>
          {tab==="orders"&&(
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <p style={{...T.label,color:C.black,fontSize:12}}>Recent Orders</p>
                <button onClick={()=>setPage("orders")} style={{background:"none",border:"none",...T.labelSm,color:C.tan,fontSize:9,textDecoration:"underline"}}>{L.viewAll}</button>
              </div>
              {orders.length===0?(
                <div style={{padding:"48px 32px",textAlign:"center",background:C.offwhite}}>
                  <p style={{...T.body,color:C.gray,marginBottom:20}}>No orders yet. Start browsing.</p>
                  <HoverBtn onClick={()=>setPage("catalog")} variant="primary">Explore Collection</HoverBtn>
                </div>
              ):orders.map(o=>(
                <div key={o.orderId} style={{display:"flex",gap:14,padding:"14px",background:C.offwhite,marginBottom:2,cursor:"pointer",transition:"background 0.15s"}}
                  onClick={()=>setPage("orders")}
                  onMouseEnter={e=>e.currentTarget.style.background=C.lgray}
                  onMouseLeave={e=>e.currentTarget.style.background=C.offwhite}>
                  <img src={o.img} alt={o.name} style={{width:60,height:60,objectFit:"cover",flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{...T.heading,color:C.black,fontSize:12,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.name}</p>
                    <p style={{...T.labelSm,color:C.gray,fontSize:8,marginBottom:5}}>{o.orderId}</p>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:C.tan}}/>
                      <span style={{...T.labelSm,fontSize:8,color:C.tan}}>Processing</span>
                    </div>
                  </div>
                  <p style={{...T.bodySm,color:C.black,flexShrink:0}}>GEL {o.sale||o.price}</p>
                </div>
              ))}
            </>
          )}
          {tab==="settings"&&(
            <div style={{maxWidth:480}}>
              <p style={{...T.label,color:C.black,fontSize:12,marginBottom:20}}>Account Settings</p>
              {[["Full Name",user.name],["Email",user.email],["WhatsApp","Not set"]].map(([label,val])=>(
                <div key={label} style={{marginBottom:14}}>
                  <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{label}</label>
                  <div style={{display:"flex",gap:10}}>
                    <input defaultValue={val} style={{flex:1,padding:"11px 14px",border:`1px solid ${C.lgray}`,background:C.white,fontSize:14,color:C.black,outline:"none"}}/>
                    <HoverBtn variant="ghost" style={{padding:"11px 18px",fontSize:9}}>Edit</HoverBtn>
                  </div>
                </div>
              ))}
              <HoverBtn onClick={()=>toast("Settings saved.","success")} variant="primary" style={{marginTop:8,padding:"13px 32px"}}>Save Changes</HoverBtn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ADMIN PANEL ───────────────────────────────────────────────────────────────
function AdminPanel({mobile,user,setPage,orders,toast,L}) {
  const [tab,setTab]=useState("orders");
  const [orderList,setOrderList]=useState([
    {orderId:"ALT-2026-156",customer:"Nino G.",phone:"+995 599 123 456",item:"Structured lambskin tote",status:"reserved",amount:320,date:"2026-02-24",wantVideo:true},
    {orderId:"ALT-2026-155",customer:"Tamara K.",phone:"+995 577 234 567",item:"Wool overcoat",status:"sourcing",amount:520,date:"2026-02-23",wantVideo:false},
    {orderId:"ALT-2026-154",customer:"Giorgi M.",phone:"+995 599 345 678",item:"Mesh dial watch",status:"shipped",amount:480,date:"2026-02-22",wantVideo:false},
    {orderId:"ALT-2026-153",customer:"Ana B.",phone:"+995 555 456 789",item:"Silk scarf",status:"delivered",amount:95,date:"2026-02-21",wantVideo:false},
    ...orders.map(o=>({orderId:o.orderId,customer:o.customerName||"Customer",phone:o.phone||"—",item:o.name,status:o.status||"reserved",amount:o.sale||o.price,date:"2026-02-24",wantVideo:o.wantVideo})),
  ]);

  useEffect(()=>{if(!user?.isAdmin)setPage("home");},[user]);
  if (!user?.isAdmin) return null;

  const updateStatus=(orderId,newStatus)=>{
    setOrderList(prev=>prev.map(o=>o.orderId===orderId?{...o,status:newStatus}:o));
    toast(`Order ${orderId} updated to "${newStatus}"`,"success");
  };

  const statusColor={reserved:C.brown,sourcing:C.tan,confirmed:"#1a5c8b",shipped:C.green,delivered:C.gray};
  const totalRevenue=orderList.reduce((s,o)=>s+o.amount,0);
  const stats=[
    {label:"Total Orders",value:orderList.length},
    {label:"Revenue (GEL)",value:totalRevenue.toLocaleString()},
    {label:"Pending",value:orderList.filter(o=>["reserved","sourcing"].includes(o.status)).length},
    {label:"Video Orders",value:orderList.filter(o=>o.wantVideo).length},
  ];

  return (
    <div style={{paddingTop:80,minHeight:"100vh",background:C.offwhite}}>
      <div style={{borderBottom:`1px solid ${C.lgray}`,padding:"20px 0",background:C.cream}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:"0 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <Logo color={C.black} size={0.7}/>
            <span style={{width:1,height:18,background:C.lgray}}/>
            <p style={{...T.label,color:C.black,fontSize:10}}>{L&&L.adminPanelTitle||"Admin Panel"}</p>
          </div>
          <HoverBtn onClick={()=>setPage("home")} variant="secondary" style={{padding:"9px 20px",fontSize:10}}>{L&&L.backToSite||"← Back to Site"}</HoverBtn>
        </div>
      </div>

      <div style={{maxWidth:1360,margin:"0 auto",padding:"0 40px"}}>
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(4,1fr)",gap:3,margin:"28px 0"}}>
          {stats.map((s,i)=>(
            <div key={i} style={{padding:"22px",background:C.cream,borderBottom:`3px solid ${i===0?C.tan:i===2?C.red:C.lgray}`}}>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:300,color:C.black,marginBottom:3,lineHeight:1}}>{s.value}</p>
              <p style={{...T.labelSm,color:C.gray,fontSize:9}}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{display:"flex",borderBottom:`1px solid ${C.lgray}`,marginBottom:28,background:C.cream}}>
          {[["orders","Orders"],["products","Products"],["stats","Statistics"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{...T.label,fontSize:10,padding:"14px 22px",background:"none",border:"none",color:tab===k?C.black:C.gray,borderBottom:tab===k?`2px solid ${C.tan}`:"2px solid transparent",transition:"all 0.2s"}}>
              {l}
            </button>
          ))}
        </div>

        {tab==="orders"&&(
          <div style={{background:C.cream}}>
            <div style={{display:"flex",justifyContent:"space-between",padding:"16px 20px",borderBottom:`1px solid ${C.lgray}`}}>
              <p style={{...T.label,color:C.black,fontSize:11}}>All Orders</p>
              <p style={{...T.labelSm,color:C.gray,fontSize:9}}>{orderList.length} orders total</p>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{borderBottom:`1px solid ${C.lgray}`,background:C.offwhite}}>
                  {["Order ID","Customer","WhatsApp","Item","Status","Update Status","Amount","Date"].map(h=>(
                    <th key={h} style={{...T.labelSm,color:C.gray,fontSize:8,padding:"10px 14px",textAlign:"left",fontWeight:500}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orderList.map((o,i)=>(
                  <tr key={i} style={{borderBottom:`1px solid ${C.lgray}`}}
                    onMouseEnter={e=>e.currentTarget.style.background=C.offwhite}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{...T.labelSm,color:C.tan,padding:"12px 14px",fontSize:9}}>{o.orderId}{o.wantVideo&&<span style={{marginLeft:6,...T.labelSm,fontSize:7,color:C.tan,padding:"1px 5px",border:`1px solid ${C.tan}`}}>VID</span>}</td>
                    <td style={{...T.bodySm,color:C.black,padding:"12px 14px"}}>{o.customer}</td>
                    <td style={{...T.bodySm,color:C.gray,padding:"12px 14px",fontSize:12}}>{o.phone}</td>
                    <td style={{...T.bodySm,color:C.black,padding:"12px 14px",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.item}</td>
                    <td style={{padding:"12px 14px"}}>
                      <span style={{...T.labelSm,fontSize:8,padding:"3px 8px",background:statusColor[o.status]||C.gray,color:C.white}}>{o.status}</span>
                    </td>
                    <td style={{padding:"12px 14px"}}>
                      <select value={o.status} onChange={e=>updateStatus(o.orderId,e.target.value)}
                        style={{...T.labelSm,fontSize:8,padding:"5px 8px",border:`1px solid ${C.lgray}`,background:C.cream,color:C.black,cursor:"pointer",outline:"none"}}>
                        {ORDER_STATUSES.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}
                      </select>
                    </td>
                    <td style={{...T.bodySm,color:C.black,padding:"12px 14px"}}>GEL {o.amount}</td>
                    <td style={{...T.labelSm,color:C.gray,padding:"12px 14px",fontSize:8}}>{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab==="products"&&(
          <div style={{background:C.cream}}>
            <div style={{display:"flex",justifyContent:"space-between",padding:"16px 20px",borderBottom:`1px solid ${C.lgray}`}}>
              <p style={{...T.label,color:C.black,fontSize:11}}>Product Catalog ({PRODUCTS.length} items)</p>
              <HoverBtn onClick={()=>toast("Product management coming soon","info")} variant="tan" style={{padding:"8px 18px",fontSize:9}}>+ Add Product</HoverBtn>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{borderBottom:`1px solid ${C.lgray}`,background:C.offwhite}}>
                  {["","Name","Section","Category","Price","Sale","Sizes","Tag"].map(h=>(
                    <th key={h} style={{...T.labelSm,color:C.gray,fontSize:8,padding:"10px 12px",textAlign:"left",fontWeight:500}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map(p=>(
                  <tr key={p.id} style={{borderBottom:`1px solid ${C.lgray}`,transition:"background 0.15s"}}
                    onMouseEnter={e=>e.currentTarget.style.background=C.offwhite}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"8px 12px"}}><img src={p.img} alt={p.name} style={{width:36,height:36,objectFit:"cover"}}/></td>
                    <td style={{...T.bodySm,color:C.black,padding:"8px 12px",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</td>
                    <td style={{...T.labelSm,color:C.tan,padding:"8px 12px",fontSize:8}}>{p.section}</td>
                    <td style={{...T.bodySm,color:C.gray,padding:"8px 12px"}}>{p.cat}</td>
                    <td style={{...T.bodySm,color:C.black,padding:"8px 12px"}}>GEL {p.price}</td>
                    <td style={{...T.bodySm,color:p.sale?C.red:C.lgray,padding:"8px 12px"}}>{p.sale?`GEL ${p.sale}`:"—"}</td>
                    <td style={{...T.bodySm,color:C.gray,padding:"8px 12px",fontSize:11}}>{p.sizes.join(", ")}</td>
                    <td style={{padding:"8px 12px"}}>
                      {p.tag&&<span style={{...T.labelSm,fontSize:7,padding:"2px 7px",background:p.tag==="Sale"?C.red:p.tag==="New"?C.black:C.tan,color:C.white}}>{p.tag}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab==="stats"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,marginBottom:3}}>
            {[
              {title:"Top Categories",items:[["Bags","5 items","GEL 1,345"],["Watches","3 items","GEL 1,290"],["Clothing","3 items","GEL 1,045"],["Shoes","3 items","GEL 495"],["Accessories","3 items","GEL 340"]]},
              {title:"Orders by Status",items:ORDER_STATUSES.map(s=>[s.label,`${orderList.filter(o=>o.status===s.key).length} orders`,""])},
            ].map((block,i)=>(
              <div key={i} style={{background:C.cream,padding:24}}>
                <p style={{...T.label,color:C.black,fontSize:11,marginBottom:18}}>{block.title}</p>
                {block.items.map(([name,val,extra])=>(
                  <div key={name} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.lgray}`,alignItems:"center"}}>
                    <span style={{...T.bodySm,color:C.black}}>{name}</span>
                    <div style={{textAlign:"right"}}>
                      <span style={{...T.label,color:C.tan,fontSize:10}}>{val}</span>
                      {extra&&<span style={{...T.labelSm,color:C.gray,display:"block",fontSize:8}}>{extra}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── LANGUAGE SWITCHER ─────────────────────────────────────────────────────────
function LangSwitcher({lang,setLang}) {
  const [open,setOpen]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    const fn=(e)=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("mousedown",fn);
    return()=>document.removeEventListener("mousedown",fn);
  },[]);
  const opts=[{code:"en",label:"EN",Flag:ENG_FLAG},{code:"ka",label:"KA",Flag:GEO_FLAG},{code:"ru",label:"RU",Flag:RUS_FLAG}];
  const current=opts.find(o=>o.code===lang)||opts[0];
  return (
    <div ref={ref} style={{position:"relative"}}>
      <button onClick={()=>setOpen(!open)} style={{background:"none",border:`1px solid ${C.lgray}`,padding:"5px 9px",display:"flex",alignItems:"center",gap:7,cursor:"pointer",transition:"border-color 0.2s"}}
        onMouseEnter={e=>e.currentTarget.style.borderColor=C.tan} onMouseLeave={e=>{if(!open)e.currentTarget.style.borderColor=C.lgray}}>
        <current.Flag/>
        <span style={{...T.labelSm,color:C.black,fontSize:9}}>{current.label}</span>
        <span style={{fontSize:7,color:C.gray,display:"inline-block",transform:open?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▼</span>
      </button>
      {open&&(
        <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,background:C.cream,border:`1px solid ${C.lgray}`,zIndex:300,minWidth:100,boxShadow:"0 8px 24px rgba(0,0,0,0.1)",animation:"slideDown 0.15s ease"}}>
          {opts.map(o=>(
            <button key={o.code} onClick={()=>{setLang(o.code);setOpen(false);}}
              style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 14px",background:lang===o.code?C.offwhite:"transparent",border:"none",cursor:"pointer",borderBottom:`1px solid ${C.lgray}`,transition:"background 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.background=C.offwhite}
              onMouseLeave={e=>e.currentTarget.style.background=lang===o.code?C.offwhite:"transparent"}>
              <o.Flag/>
              <span style={{...T.labelSm,color:lang===o.code?C.black:C.gray,fontSize:9}}>{o.label}</span>
              {lang===o.code&&<span style={{marginLeft:"auto",color:C.tan,fontSize:10}}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────
function Nav({page,setPage,cartCount,user,setUser,onSearch,onCart,wishlistCount,lang,setLang,L,mobile}) {
  const [scrolled,setScrolled]=useState(false);
  const [megaOpen,setMegaOpen]=useState(false);
  const [mobileMenuOpen,setMobileMenuOpen]=useState(false);
  const [mobileTab,setMobileTab]=useState("Womenswear");

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>60);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  useEffect(()=>{setMegaOpen(false);setMobileMenuOpen(false);},[page]);

  const onMegaLink=(section,sub)=>{
    if(sub===L.brands||sub==="Brands"){setPage("brands");} 
    else {setPage("catalog");}
    setMegaOpen(false);
    setMobileMenuOpen(false);
  };

  const megaCols = [
    {key:"Womenswear",label:L.womenswear,items:[L.newIn,L.clothing,L.shoes,L.bags,L.accessories,L.jewellery,L.sale]},
    {key:"Menswear",label:L.menswear,items:[L.newIn,L.clothing,L.shoes,L.bags,L.accessories,L.watches,L.sale]},
    {key:"Kidswear",label:L.kidswear,items:[L.newIn,L.clothing,L.shoes,L.accessories]},
    {key:"Browse",label:"Browse By",items:[L.newIn,L.brands,L.sale]},
  ];

  if (mobile) {
    return (
      <>
        <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:"rgba(231,232,225,0.98)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.lgray}`}}>
          <div style={{padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <button onClick={()=>{setMobileMenuOpen(!mobileMenuOpen);setMegaOpen(false);}} style={{background:"none",border:"none",padding:4,lineHeight:1}}>
              {mobileMenuOpen?(
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              ):(
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              )}
            </button>
            <button onClick={()=>{setPage("home");setMobileMenuOpen(false);}} style={{background:"none",border:"none",padding:0,lineHeight:1,position:"absolute",left:"50%",transform:"translateX(-50%)"}}>
              <Logo color={C.black} size={0.7}/>
            </button>
            <div style={{display:"flex",gap:2,alignItems:"center"}}>
              <button onClick={onSearch} style={{background:"none",border:"none",width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              </button>
              <button onClick={()=>{setPage("account");setMobileMenuOpen(false);}} style={{background:"none",border:"none",width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                {wishlistCount>0&&<span style={{position:"absolute",top:2,right:2,background:C.black,color:C.white,borderRadius:"50%",width:14,height:14,fontSize:7,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{wishlistCount}</span>}
              </button>
              <button onClick={onCart} style={{background:"none",border:"none",width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                {cartCount>0&&<span style={{position:"absolute",top:2,right:2,background:C.black,color:C.white,borderRadius:"50%",width:14,height:14,fontSize:7,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</span>}
              </button>
            </div>
          </div>
        </nav>
        {mobileMenuOpen&&(
          <div style={{position:"fixed",top:52,left:0,right:0,bottom:0,zIndex:199,background:C.cream,overflow:"auto",WebkitOverflowScrolling:"touch"}}>
            {/* Top bar: Logo + Close */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:`1px solid ${C.lgray}`}}>
              <LogoMark color={C.black} size={1.1}/>
              <button onClick={()=>setMobileMenuOpen(false)} style={{background:"none",border:"none",padding:4}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Section tabs: WOMENSWEAR | MENSWEAR | KIDSWEAR */}
            <div style={{display:"flex",borderBottom:`1px solid ${C.lgray}`}}>
              {[{k:"Womenswear",l:L.womenswear},{k:"Menswear",l:L.menswear},{k:"Kidswear",l:L.kidswear}].map(tab=>(
                <button key={tab.k} onClick={()=>setMobileTab(tab.k)}
                  style={{flex:1,padding:"14px 8px",background:"none",border:"none",borderBottom:mobileTab===tab.k?`2px solid ${C.black}`:"2px solid transparent",...T.labelSm,fontSize:9,color:mobileTab===tab.k?C.black:C.gray,transition:"all 0.2s"}}>
                  {tab.l}
                </button>
              ))}
            </div>
            <div>
              {({
                Womenswear:[L.newIn,L.brands,L.clothing,L.shoes,L.bags,L.accessories,L.jewellery,L.sale],
                Menswear:[L.newIn,L.brands,L.clothing,L.shoes,L.bags,L.accessories,L.watches,L.sale],
                Kidswear:[L.newIn,L.clothing,L.shoes,L.accessories],
              }[mobileTab]||[]).map((item,i)=>(
                <button key={i} onClick={()=>{
                    if(item===L.brands||item==="Brands"){setPage("brands");}
                    else{setPage("catalog");window.__initSection=mobileTab;window.__initSub=item;}
                    setMobileMenuOpen(false);
                  }}
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"16px 20px",background:"none",border:"none",borderBottom:`1px solid ${C.lgray}`,textAlign:"left",...T.body,color:item===L.sale?C.red:C.black,fontSize:15,fontWeight:300}}>
                  <span>{item}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              ))}
            </div>

            {/* How It Works + About links */}
            <div style={{borderTop:`6px solid ${C.offwhite}`,borderBottom:`6px solid ${C.offwhite}`}}>
              {[
                {label:L.howItWorks,pg:"how"},
                {label:L.about,pg:"about"},
              ].map(item=>(
                <button key={item.pg} onClick={()=>{setPage(item.pg);setMobileMenuOpen(false);}}
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"16px 20px",background:"none",border:"none",borderBottom:`1px solid ${C.lgray}`,textAlign:"left",...T.body,color:C.black,fontSize:15,fontWeight:300}}>
                  <span>{item.label}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              ))}
            </div>

            {/* My Account section */}
            <div style={{padding:"28px 20px"}}>
              <h3 style={{...T.displaySm,color:C.black,marginBottom:20,fontSize:22,fontWeight:300}}>
                {user?(L.welcome||"Welcome,")+" "+user.name.split(" ")[0]:(L.myAccount||"My Account")}
              </h3>
              {user?(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <HoverBtn onClick={()=>{setPage("orders");setMobileMenuOpen(false);}} variant="primary" style={{width:"100%",padding:"14px"}}>{L.myOrders||"My Orders"}</HoverBtn>
                  <HoverBtn onClick={()=>{setPage("account");setMobileMenuOpen(false);}} variant="secondary" style={{width:"100%",padding:"14px"}}>{L.myAccount||"My Account"}</HoverBtn>
                  {user.isAdmin&&<HoverBtn onClick={()=>{setPage("admin");setMobileMenuOpen(false);}} variant="tan" style={{width:"100%",padding:"14px"}}>{L.adminPanel||"Admin Panel"}</HoverBtn>}
                  <button onClick={()=>{setUser(null);setPage("home");setMobileMenuOpen(false);}}
                    style={{background:"none",border:"none",...T.bodySm,color:C.gray,padding:"8px 0",textAlign:"left"}}>{L.signOut||"Sign Out"}</button>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <HoverBtn onClick={()=>{setPage("auth");setMobileMenuOpen(false);}} variant="primary" style={{width:"100%",padding:"14px"}}>{L.signInBtn||"Sign In"}</HoverBtn>
                  <HoverBtn onClick={()=>{setPage("auth");setMobileMenuOpen(false);}} variant="secondary" style={{width:"100%",padding:"14px"}}>{L.createAccount||"Register"}</HoverBtn>
                </div>
              )}
            </div>

            {/* Language section */}
            <div style={{padding:"0 20px 32px"}}>
              <h3 style={{...T.displaySm,color:C.black,marginBottom:16,fontSize:18,fontWeight:300}}>
                {lang==="ka"?"ენა":"Language"}
              </h3>
              {[{code:"en",label:"English",Flag:ENG_FLAG},{code:"ka",label:"ქართული",Flag:GEO_FLAG},{code:"ru",label:"Русский",Flag:RUS_FLAG}].map(opt=>(
                <button key={opt.code} onClick={()=>setLang(opt.code)}
                  style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"14px 0",background:"none",border:"none",borderBottom:`1px solid ${C.lgray}`,textAlign:"left"}}>
                  <opt.Flag/>
                  <span style={{...T.body,color:lang===opt.code?C.black:C.gray,fontSize:15,fontWeight:lang===opt.code?400:300}}>{opt.label}</span>
                  {lang===opt.code&&<span style={{marginLeft:"auto",color:C.tan,fontSize:14}}>✓</span>}
                  {lang!==opt.code&&<svg style={{marginLeft:"auto"}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>}
                </button>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:scrolled||megaOpen?"rgba(231,232,225,0.98)":"transparent",backdropFilter:scrolled||megaOpen?"blur(16px)":"none",borderBottom:scrolled||megaOpen?`1px solid ${C.lgray}`:"none",transition:"all 0.3s ease"}}>
      <div style={{maxWidth:1360,margin:"0 auto",padding:`${scrolled?"12px":"20px"} 40px`,display:"flex",alignItems:"center",justifyContent:"space-between",transition:"padding 0.3s"}}>

        {/* LEFT — Logo */}
        <button onClick={()=>setPage("home")} style={{background:"none",border:"none",padding:0,lineHeight:1,flexShrink:0}}>
          <Logo color={C.black} size={0.85}/>
        </button>

        {/* CENTER — Nav links */}
        <div style={{display:"flex",gap:32,alignItems:"center"}}>
          <button onClick={()=>setMegaOpen(!megaOpen)} style={{background:"none",border:"none",...T.labelSm,color:page==="catalog"?C.tan:C.black,transition:"color 0.2s",display:"flex",alignItems:"center",gap:5}}>
            {L.collection} <span style={{fontSize:8,opacity:0.5,display:"inline-block",transform:megaOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▼</span>
          </button>
          <button onClick={()=>setPage("how")} style={{background:"none",border:"none",...T.labelSm,color:page==="how"?C.tan:C.black,transition:"color 0.2s"}}>{L.howItWorks}</button>
          <button onClick={()=>setPage("about")} style={{background:"none",border:"none",...T.labelSm,color:page==="about"?C.tan:C.black,transition:"color 0.2s"}}>{L.about}</button>
        </div>

        {/* RIGHT — Lang + 4 icons */}
        <div style={{display:"flex",gap:6,alignItems:"center"}}>

          {/* Language switcher */}
          <LangSwitcher lang={lang} setLang={setLang}/>

          <span style={{width:1,height:18,background:C.lgray,margin:"0 6px"}}/>

          {/* Search icon */}
          <button onClick={onSearch} title={L.search}
            style={{background:"none",border:"none",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",transition:"opacity 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.opacity="0.6"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>

          {/* Profile icon */}
          <button onClick={()=>setPage(user?"account":"auth")} title={user?user.name:L.signIn}
            style={{background:"none",border:"none",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",transition:"opacity 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.opacity="0.6"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={user?C.tan:C.black} strokeWidth="1.5">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            {user&&<span style={{position:"absolute",bottom:4,right:4,width:6,height:6,borderRadius:"50%",background:C.tan,border:`1.5px solid ${C.cream}`}}/>}
          </button>

          {/* Wishlist / Heart icon */}
          <button onClick={()=>setPage("account")} title="Wishlist"
            style={{background:"none",border:"none",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",transition:"opacity 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.opacity="0.6"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill={wishlistCount>0?C.tan:"none"} stroke={wishlistCount>0?C.tan:C.black} strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            {wishlistCount>0&&(
              <span style={{position:"absolute",top:3,right:3,background:C.tan,color:C.white,borderRadius:"50%",width:14,height:14,fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",border:`1.5px solid ${C.cream}`}}>{wishlistCount}</span>
            )}
          </button>

          {/* Cart / Bag icon */}
          <button onClick={onCart} title={L.orders}
            style={{background:"none",border:"none",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",transition:"opacity 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.opacity="0.6"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount>0&&(
              <span style={{position:"absolute",top:2,right:2,background:C.black,color:C.white,borderRadius:"50%",width:15,height:15,fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",border:`1.5px solid ${C.cream}`}}>{cartCount}</span>
            )}
          </button>

        </div>
      </div>

      {/* MEGA MENU */}
      {megaOpen&&(
        <div style={{background:"rgba(231,232,225,0.99)",borderTop:`1px solid ${C.lgray}`,animation:"slideDown 0.2s ease",position:"relative"}}>
          <div style={{maxWidth:1360,margin:"0 auto",padding:"36px 40px 44px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:36}}>
            {megaCols.map((col,i)=>(
              <div key={i}>
                <p style={{...T.labelSm,color:C.tan,marginBottom:14,fontSize:9}}>{col.label}</p>
                {col.items.map((item,j)=>(
                  <button key={j} onClick={()=>onMegaLink(col.key,item)}
                    style={{display:"block",background:"none",border:"none",...T.body,color:C.black,fontSize:14,marginBottom:9,padding:0,textAlign:"left",transition:"color 0.2s"}}
                    onMouseEnter={e=>e.target.style.color=C.tan}
                    onMouseLeave={e=>e.target.style.color=C.black}>
                    {item}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <button onClick={()=>setMegaOpen(false)} style={{position:"absolute",top:16,right:40,background:"none",border:"none",color:C.gray,fontSize:22}}>×</button>
        </div>
      )}
    </nav>
  );
}

// ── HOMEPAGE ──────────────────────────────────────────────────────────────────
function HomePage({setPage,setSelected,L,mobile}) {
  const [vis,setVis]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setVis(true),80);return()=>clearTimeout(t);},[]);
  const f=(d)=>({opacity:vis?1:0,transform:vis?"none":"translateY(22px)",transition:`all 0.9s ease ${d}s`});
  const px=mobile?"16px":"40px";

  return (
    <div style={{background:C.cream}}>
      <section style={mobile?{minHeight:"100vh",display:"flex",flexDirection:"column",overflow:"hidden",position:"relative",paddingTop:60}:{height:"100vh",display:"grid",gridTemplateColumns:"1fr 1fr",overflow:"hidden",minHeight:600,position:"relative"}}>
        {mobile&&(
          <div style={{height:280,overflow:"hidden",flexShrink:0}}>
            <img src={BI.bag_stone} alt="Alternative" style={{width:"100%",height:"100%",objectFit:"cover",opacity:vis?1:0,transition:"opacity 1.2s ease"}}/>
            <div style={{position:"absolute",top:60,left:0,right:0,height:280,background:"rgba(25,25,25,0.06)"}}/>
          </div>
        )}
        <div style={{display:"flex",flexDirection:"column",justifyContent:mobile?"flex-start":"flex-end",padding:mobile?"32px 20px 40px":"0 60px 80px",position:"relative",zIndex:1,flex:mobile?1:undefined}}>
          <div style={{...f(0)}}><p style={{...T.labelSm,color:C.tan,marginBottom:mobile?16:24,display:"flex",alignItems:"center",gap:10,fontSize:mobile?8:undefined}}><span style={{display:"inline-block",width:24,height:1,background:C.tan}}/>{L.heroSub}</p></div>
          <div style={f(0.15)}>
            <h1 style={{...T.displayXL,color:C.black,marginBottom:8,fontSize:mobile?"clamp(36px,10vw,52px)":undefined}}>Always</h1>
            <h1 style={{...T.displayXL,color:C.black,marginBottom:8,fontStyle:"italic",fontSize:mobile?"clamp(36px,10vw,52px)":undefined}}>Choose</h1>
            <h1 style={{...T.displayXL,color:C.tan,marginBottom:mobile?28:44,fontSize:mobile?"clamp(36px,10vw,52px)":undefined}}>Alternative.</h1>
          </div>
          <div style={f(0.3)}><p style={{...T.body,color:C.brown,maxWidth:380,marginBottom:mobile?28:44,fontSize:mobile?14:15,lineHeight:1.9}}>{L.heroBody}</p></div>
          <div style={{...f(0.45),display:"flex",gap:mobile?10:14,flexDirection:mobile?"column":"row"}}>
            <HoverBtn onClick={()=>setPage("catalog")} variant="primary" style={mobile?{width:"100%"}:{}}>{L.heroCta1}</HoverBtn>
            <HoverBtn onClick={()=>setPage("how")} variant="secondary" style={mobile?{width:"100%"}:{}}>{L.heroCta2}</HoverBtn>
          </div>
        </div>
        {!mobile&&(
          <div style={{position:"relative",overflow:"hidden"}}>
            <img src={BI.bag_stone} alt="Alternative" style={{width:"100%",height:"100%",objectFit:"cover",opacity:vis?1:0,transform:vis?"scale(1)":"scale(1.04)",transition:"opacity 1.2s ease, transform 1.4s ease"}}/>
            <div style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.06)"}}/>
          </div>
        )}
        {!mobile&&<div style={{position:"absolute",bottom:36,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:8,opacity:0.35,zIndex:2,pointerEvents:"none"}}>
          <span style={{...T.labelSm,fontSize:8,color:C.black}}>Scroll</span>
          <div style={{width:1,height:36,background:C.black,animation:"pulse 2s infinite"}}/>
        </div>}
      </section>

      <section style={{background:C.black}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`}}>
          <div style={mobile?{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}:{display:"grid",gridTemplateColumns:"repeat(4,1fr)"}}>
            {[{i:"✓",t:L&&L.trust1||"100% Authentic Guaranteed"},{i:"🔒",t:L&&L.trust2||"Secure 50% Deposit"},{i:"📦",t:L&&L.trust3||"Delivery in 10–18 Days"},{i:"📹",t:L&&L.trust4||"See Before You Buy"}].map((item,i)=>(
              <div key={i} style={{padding:mobile?"14px 12px":"22px 20px",borderRight:mobile?(i%2===0?`1px solid rgba(177,154,122,0.12)`:"none"):(i<3?`1px solid rgba(177,154,122,0.12)`:"none"),borderBottom:mobile&&i<2?`1px solid rgba(177,154,122,0.12)`:"none",display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:C.tan,fontSize:mobile?12:14,flexShrink:0}}>{item.i}</span>
                <span style={{...T.bodySm,color:C.lgray,lineHeight:1.5,fontSize:mobile?10:12}}>{item.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:mobile?"32px 0 28px":"64px 0 56px"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:mobile?28:44}}>
            <div><p style={{...T.labelSm,color:C.tan,marginBottom:10}}>{L.featuredLabel}</p><h2 style={{...T.displayMd,color:C.black,fontSize:mobile?"clamp(22px,6vw,32px)":undefined}}>{L.featuredTitle}</h2></div>
            <button onClick={()=>setPage("catalog")} style={{background:"none",border:"none",...T.bodySm,color:C.gray,textDecoration:"underline",cursor:"pointer",fontSize:mobile?11:undefined}}>View all →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(3,1fr)",gap:3}}>
            {PRODUCTS.slice(0,mobile?4:3).map(p=><ProductCard key={p.id} product={p} onSelect={()=>{setSelected(p);setPage("product");}} L={L} mobile={mobile}/>)}
          </div>
        </div>
      </section>

      <section style={{padding:mobile?"0 0 48px":"0 0 88px"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`}}>
          <p style={{...T.labelSm,color:C.tan,marginBottom:10}}>{L.shopBy}</p>
          <h2 style={{...T.displayMd,color:C.black,marginBottom:mobile?28:44,fontSize:mobile?"clamp(22px,6vw,32px)":undefined}}>{L.collections}</h2>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:3}}>
            {[{name:L.womenswear,src:BI.bag_stone,sub:L.womensSub},{name:L.menswear,src:BI.man_editorial,sub:L.mensSub},{name:L.kidswear,src:BI.packaging,sub:L.kidsSub}].map((cat,i)=>(
              <div key={i} onClick={()=>setPage("catalog")} style={{position:"relative",height:mobile?200:340,cursor:"pointer",overflow:"hidden"}}>
                <img src={cat.src} alt={cat.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(25,25,25,0.62) 0%, transparent 52%)"}}/>
                <div style={{position:"absolute",bottom:mobile?16:24,left:mobile?16:24}}>
                  <p style={{...T.displaySm,color:C.white,marginBottom:4,fontSize:mobile?18:undefined}}>{cat.name}</p>
                  <p style={{...T.labelSm,color:"rgba(255,255,255,0.65)",fontSize:8}}>{cat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{background:C.black,padding:mobile?"48px 0":"72px 0"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?32:72,alignItems:"center"}}>
          <div style={{position:"relative",height:mobile?220:380,overflow:"hidden",order:mobile?1:0}}>
            <img src={BI.store_interior} alt="Video service" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.28)"}}/>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:50,height:50,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.8)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
          <div style={{order:mobile?0:1}}>
            <span style={{...T.labelSm,display:"inline-block",color:C.tan,marginBottom:mobile?12:18,padding:"4px 12px",border:`1px solid ${C.tan}`,fontSize:9}}>{L.extraService}</span>
            <h2 style={{...T.displayMd,color:C.white,marginBottom:mobile?14:20,lineHeight:1.2,fontSize:mobile?"clamp(20px,5vw,28px)":undefined}}>{L.videoTitle}</h2>
            <p style={{...T.body,color:C.lgray,lineHeight:1.9,marginBottom:mobile?24:36,fontSize:mobile?13:undefined}}>{L.videoBody}</p>
            <HoverBtn onClick={()=>setPage("catalog")} variant="tan">{L.shopAddService}</HoverBtn>
          </div>
        </div>
      </section>

      <section style={{background:C.black,padding:mobile?"48px 0":"72px 0",borderTop:`1px solid rgba(177,154,122,0.1)`}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?32:72,alignItems:"center"}}>
          <div>
            <p style={{...T.labelSm,color:C.tan,marginBottom:mobile?14:20}}>{L.lizaLabel}</p>
            <h2 style={{...T.displayMd,color:C.white,marginBottom:mobile?16:24,lineHeight:1.2,fontSize:mobile?"clamp(20px,5vw,28px)":undefined}}>{L.lizaTitle}</h2>
            <p style={{...T.body,color:C.lgray,lineHeight:1.9,marginBottom:mobile?24:36,fontSize:mobile?13:undefined}}>{L.lizaBody}</p>
            <div style={{display:"flex",gap:mobile?24:40}}>
              {[["500+",L.itemsVerified],["98%",L.custSatisfaction],["4.9",L.avgRating]].map(([n,l])=>(
                <div key={n}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:mobile?24:30,fontWeight:300,color:C.tan,lineHeight:1}}>{n}</p><p style={{...T.labelSm,color:C.lgray,marginTop:5,fontSize:8}}>{l}</p></div>
              ))}
            </div>
          </div>
          <div style={{height:mobile?220:380,overflow:"hidden",position:"relative"}}>
            <img src={BI.bag_stone} alt="Shanghai sourcing" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.15)"}}/>
          </div>
        </div>
      </section>

      <Footer setPage={setPage} L={L} mobile={mobile}/>
    </div>
  );
}

// ── HOW IT WORKS ──────────────────────────────────────────────────────────────
function HowItWorksPage({setPage,L,mobile}) {
  const [openFaq,setOpenFaq]=useState(null);
  const faqs=[
    ["Can I cancel my order?","Yes — before your item ships you can cancel at any time for a full deposit refund. No questions asked."],
    ["What if my item arrives damaged?","Contact us within 48 hours with photos. We will arrange a replacement or full refund."],
    ["What payment methods do you accept?","BOG / TBC bank transfer (recommended), or card payment via secure link."],
    ["How does video verification work?","Add it at checkout for GEL 28. We film your item before shipping and send the full video directly to your WhatsApp number."],
    ["How long does shipping take?","10–18 business days from order confirmation, depending on item. Lead time is shown on each product page."],
    ["Do you ship outside Tbilisi?","Currently we deliver to Tbilisi. Nationwide shipping coming soon."],
  ];
  return (
    <div style={{paddingTop:mobile?52:80,background:C.cream}}>
      <div style={{background:C.black,padding:mobile?"48px 0":"72px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:mobile?"0 16px":"0 40px",textAlign:"center"}}>
          <p style={{...T.labelSm,color:C.tan,marginBottom:18}}>{L&&L.ourProcessLabel||'Our process'}</p>
          <h1 style={{...T.displayLg,color:C.white,marginBottom:20}}>{L&&L.howOrderingWorks||'How ordering works'}</h1>
          <p style={{...T.body,color:C.lgray,maxWidth:480,margin:"0 auto",lineHeight:1.9}}>{L&&L.howSubtitle||'We source directly from verified suppliers.'}</p>
        </div>
      </div>
      <div style={{padding:"88px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"0 40px"}}>
          {[
            {n:"01",t:"Browse & Reserve",body:"Find your item, select your size, and place your order. Pay 50% deposit to confirm. Free cancellation before shipping.",note:"Deposit is fully refundable before dispatch."},
            {n:"02",t:"We Source & Prepare",body:"We contact our verified suppliers in Shanghai. Your item is sourced, quality-checked by Liza, packaged in our branded tissue paper, and photographed with editorial styling.",note:"Lead time: 10–18 days depending on item."},
            {n:"03",t:"Optional Video Check",body:"If you added Video Verification, our Shanghai team films a complete walkthrough — hardware, stitching, material — and sends it to your WhatsApp before the item ships. You approve before dispatch.",note:"Video verification: GEL 28 — add at checkout."},
            {n:"04",t:"Ships to Tbilisi",body:"Your item ships directly from Shanghai. We handle customs. You receive WhatsApp updates at every stage, including a tracking number.",note:"Delivery: 3–5 days from Shanghai dispatch."},
            {n:"05",t:"Delivered",body:"Your order arrives in premium Alternative branded packaging. Any issue on arrival? Contact us within 48 hours and we will resolve it fully.",note:"Support: info@alternative.ge"},
          ].map((s,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:mobile?"48px 1fr":"72px 1fr",gap:mobile?20:44,marginBottom:56,paddingBottom:56,borderBottom:i<4?`1px solid ${C.lgray}`:"none"}}>
              <div style={{textAlign:"right",paddingTop:4}}><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:48,fontWeight:300,color:C.tan,lineHeight:1}}>{s.n}</span></div>
              <div>
                <h3 style={{...T.heading,color:C.black,marginBottom:12,fontSize:16}}>{s.t}</h3>
                <p style={{...T.body,color:C.gray,marginBottom:12,lineHeight:1.9}}>{s.body}</p>
                <div style={{padding:"11px 14px",background:C.offwhite,borderLeft:`2px solid ${C.tan}`}}>
                  <p style={{...T.bodySm,color:C.brown,fontSize:12}}>{s.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:C.offwhite,padding:"64px 0"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:"0 40px"}}>
          <div style={{textAlign:"center",marginBottom:44}}>
            <p style={{...T.labelSm,color:C.tan,marginBottom:10}}>{L&&L.trackOrder||'Track your order'}</p>
            <h2 style={{...T.displayMd,color:C.black}}>{L&&L.orderStatusVisible||'Order status — always visible'}</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(5,1fr)",gap:3}}>
            {ORDER_STATUSES.map((s,i)=>(
              <div key={i} style={{background:C.cream,padding:"20px 16px"}}>
                <div style={{height:3,background:s.color,marginBottom:16}}/>
                <p style={{...T.label,color:C.black,marginBottom:7,fontSize:10}}>{s.label}</p>
                <p style={{...T.bodySm,color:C.gray,fontSize:11,lineHeight:1.6}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{padding:"64px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:mobile?"0 16px":"0 40px"}}>
          <h2 style={{...T.displayMd,color:C.black,marginBottom:mobile?24:40,fontSize:mobile?"clamp(22px,6vw,32px)":undefined}}>{L&&L.faq||"Frequently asked"}</h2>
          {faqs.map(([q,a],i)=>(
            <div key={i} style={{borderBottom:`1px solid ${C.lgray}`}}>
              <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 0",background:"none",border:"none",textAlign:"left",cursor:"pointer"}}>
                <span style={{...T.label,color:C.black,fontSize:12}}>{q}</span>
                <span style={{color:C.tan,fontSize:14,flexShrink:0,marginLeft:20,transform:openFaq===i?"rotate(180deg)":"none",transition:"transform 0.2s",display:"inline-block"}}>▼</span>
              </button>
              {openFaq===i&&<p style={{...T.body,color:C.gray,lineHeight:1.85,paddingBottom:20,animation:"slideDown 0.2s ease"}}>{a}</p>}
            </div>
          ))}
        </div>
      </div>
      <Footer setPage={setPage} L={L} mobile={mobile}/>
    </div>
  );
}

// ── ABOUT PAGE ────────────────────────────────────────────────────────────────
function AboutPage({setPage,L,mobile}) {
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
          <div style={{height:400,overflow:"hidden"}}><img src={BI.bag_stone} alt="Shanghai" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
          <div>
            <p style={{...T.labelSm,color:C.tan,marginBottom:16}}>{L&&L.lizaShanghai||'Liza in Shanghai'}</p>
            <h2 style={{...T.displayMd,color:C.black,marginBottom:20}}>{L&&L.yourEyes||'Your eyes at the source.'}</h2>
            <p style={{...T.body,color:C.gray,lineHeight:1.9,marginBottom:16}}>Liza is based in Shanghai. She physically visits our suppliers, handles every item, checks stitching, hardware, and material quality.</p>
            <p style={{...T.body,color:C.gray,lineHeight:1.9,marginBottom:32}}>She is the reason you can trust what arrives at your door.</p>
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

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer({setPage,L,mobile}) {
  const px=mobile?"16px":"40px";
  const [email,setEmail]=useState("");
  const [subscribed,setSubscribed]=useState(false);

  const onSubscribe=(e)=>{
    e&&e.preventDefault&&e.preventDefault();
    if(email.includes("@")){setSubscribed(true);setTimeout(()=>setSubscribed(false),4000);}
  };

  return (
    <footer style={{background:C.black}}>

      {/* NEWSLETTER SECTION */}
      <div style={{borderBottom:`1px solid rgba(168,162,150,0.12)`,padding:mobile?"40px 0":"56px 0"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?24:64,alignItems:"start"}}>
          <div>
            <h3 style={{...T.displaySm,color:C.white,marginBottom:12,fontSize:mobile?20:24}}>Never miss a thing</h3>
            <p style={{...T.body,color:C.gray,lineHeight:1.8,fontSize:mobile?13:14}}>Sign up for promotions, tailored new arrivals, stock updates and more — straight to your inbox</p>
          </div>
          <div>
            <p style={{...T.labelSm,color:C.lgray,marginBottom:12,fontSize:9}}>GET UPDATES BY</p>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:18,height:18,borderRadius:3,border:`1.5px solid ${C.tan}`,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent"}}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span style={{...T.bodySm,color:C.lgray,fontSize:13}}>Email</span>
              </div>
            </div>
            <div style={{display:"flex",gap:0}}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email address"
                style={{flex:1,padding:"13px 16px",background:"transparent",border:`1px solid rgba(168,162,150,0.3)`,borderRight:"none",color:C.white,...T.body,fontSize:13,outline:"none"}}/>
              <button onClick={onSubscribe}
                style={{padding:"13px 24px",background:C.white,border:"none",color:C.black,...T.labelSm,fontSize:9,cursor:"pointer",flexShrink:0,transition:"all 0.2s"}}>
                {subscribed?"SUBSCRIBED ✓":"SUBSCRIBE"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER GRID */}
      <div style={{padding:mobile?"32px 0":"48px 0",borderBottom:`1px solid rgba(168,162,150,0.12)`}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"2fr 1fr 1fr 1fr 1fr",gap:mobile?24:32}}>
          {/* Brand column */}
          <div style={mobile?{gridColumn:"1 / -1"}:{}}>
            <div style={{marginBottom:16}}><Logo color={C.white} size={mobile?0.7:0.85}/></div>
            <p style={{...T.bodySm,color:C.gray,lineHeight:1.8,maxWidth:240,marginBottom:18,fontSize:mobile?12:13}}>{L&&L.footerDesc||"Curated fashion sourced directly from verified suppliers. Shipped to Tbilisi."}</p>
            <a href="https://wa.me/995500000000" target="_blank" rel="noopener noreferrer" style={{...T.labelSm,color:C.tan,fontSize:9,display:"flex",alignItems:"center",gap:6,textDecoration:"none",marginBottom:16}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
              {L&&L.whatsappUs||"WhatsApp us"}
            </a>
          </div>

          {/* Shop column */}
          <div>
            <p style={{...T.labelSm,color:C.lgray,marginBottom:mobile?10:16,fontSize:9}}>SHOP</p>
            {[["Collection","catalog"],["How It Works","how"],["New Arrivals","catalog"],["Womenswear","catalog"],["Menswear","catalog"],["Kidswear","catalog"]].map(([l,pg])=>(
              <button key={l} onClick={()=>setPage(pg)} style={{display:"block",background:"none",border:"none",...T.bodySm,color:C.gray,marginBottom:7,padding:0,textAlign:"left",fontSize:mobile?12:13,cursor:"pointer"}}>{l}</button>
            ))}
          </div>

          {/* Account column */}
          <div>
            <p style={{...T.labelSm,color:C.lgray,marginBottom:mobile?10:16,fontSize:9}}>ACCOUNT</p>
            {[["My Orders","orders"],["Wishlist","account"],["Sign In","auth"],["Register","auth"]].map(([l,pg])=>(
              <button key={l} onClick={()=>setPage(pg)} style={{display:"block",background:"none",border:"none",...T.bodySm,color:C.gray,marginBottom:7,padding:0,textAlign:"left",fontSize:mobile?12:13,cursor:"pointer"}}>{l}</button>
            ))}
          </div>

          {/* Discounts & Membership column */}
          <div>
            <p style={{...T.labelSm,color:C.lgray,marginBottom:mobile?10:16,fontSize:9}}>DISCOUNTS & MEMBERSHIP</p>
            {["Affiliate Program","Refer a Friend","Alternative Membership"].map(l=>(
              <button key={l} onClick={()=>{}} style={{display:"block",background:"none",border:"none",...T.bodySm,color:C.gray,marginBottom:7,padding:0,textAlign:"left",fontSize:mobile?12:13,cursor:"pointer"}}>{l}</button>
            ))}
          </div>

          {/* About column */}
          <div>
            <p style={{...T.labelSm,color:C.lgray,marginBottom:mobile?10:16,fontSize:9}}>ABOUT</p>
            {[["Our Story","about"],["FAQ","how"],["Contact","how"]].map(([l,pg])=>(
              <button key={l} onClick={()=>setPage(pg)} style={{display:"block",background:"none",border:"none",...T.bodySm,color:C.gray,marginBottom:7,padding:0,textAlign:"left",fontSize:mobile?12:13,cursor:"pointer"}}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* FOLLOW US + APP DOWNLOAD */}
      <div style={{padding:mobile?"28px 0":"36px 0",borderBottom:`1px solid rgba(168,162,150,0.12)`}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?28:40,alignItems:"start"}}>
          {/* Follow us */}
          <div>
            <p style={{...T.labelSm,color:C.lgray,marginBottom:14,fontSize:9}}>FOLLOW US</p>
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              {/* Instagram */}
              <a href="https://instagram.com/alternative.ge" target="_blank" rel="noopener noreferrer" style={{width:40,height:40,borderRadius:"50%",border:`1px solid rgba(168,162,150,0.25)`,display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none"}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.lgray} strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill={C.lgray} stroke="none"/></svg>
              </a>
              {/* Facebook */}
              <a href="https://facebook.com/alternative.ge" target="_blank" rel="noopener noreferrer" style={{width:40,height:40,borderRadius:"50%",border:`1px solid rgba(168,162,150,0.25)`,display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none"}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.lgray} strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              {/* TikTok */}
              <a href="https://tiktok.com/@alternative.ge" target="_blank" rel="noopener noreferrer" style={{width:40,height:40,borderRadius:"50%",border:`1px solid rgba(168,162,150,0.25)`,display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={C.lgray}><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.89 2.89 2.89 0 012.88-2.89c.28 0 .55.04.81.11V9.01a6.32 6.32 0 00-.81-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.79a8.18 8.18 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.22z"/></svg>
              </a>
            </div>
          </div>

          {/* BUSINESS INFO */}
          <div>
            <p style={{...T.labelSm,color:C.lgray,marginBottom:14,fontSize:9}}>CONTACT & INFO</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <p style={{...T.bodySm,color:C.gray,fontSize:12,lineHeight:1.6}}>Tbilisi, Georgia</p>
              <a href="tel:+995555999555" style={{...T.bodySm,color:C.gray,fontSize:12,textDecoration:"none"}}>+995 555 999 555</a>
              <a href="mailto:info@alternative.ge" style={{...T.bodySm,color:C.gray,fontSize:12,textDecoration:"none"}}>info@alternative.ge</a>
              <p style={{...T.labelSm,color:"rgba(168,162,150,0.5)",fontSize:8,marginTop:8}}>Mon–Sat 10:00–20:00</p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR: Legal + Copyright */}
      <div style={{padding:mobile?"20px 0":"24px 0"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`}}>
          <div style={{display:"flex",gap:mobile?12:24,flexWrap:"wrap",marginBottom:14}}>
            {["Privacy Policy","Terms & Conditions","Returns & Refunds","Shipping Info","Accessibility"].map(l=>(
              <button key={l} onClick={()=>{}} style={{background:"none",border:"none",...T.labelSm,color:C.gray,fontSize:8,padding:0,cursor:"pointer",textDecoration:"underline",textUnderlineOffset:2}}>{l}</button>
            ))}
          </div>
          {/* Payment methods */}
          <div style={{display:"flex",gap:12,marginBottom:14,alignItems:"center"}}>
            <span style={{...T.labelSm,color:"rgba(168,162,150,0.4)",fontSize:8}}>ACCEPTED PAYMENTS:</span>
            {["VISA","MC","BOG","TBC"].map(m=>(
              <span key={m} style={{padding:"3px 8px",border:"1px solid rgba(168,162,150,0.2)",borderRadius:3,...T.labelSm,color:"rgba(168,162,150,0.5)",fontSize:7}}>{m}</span>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <p style={{...T.labelSm,color:"rgba(168,162,150,0.5)",fontSize:8}}>{L&&L.copyright||'© 2026 Alternative Concept Store. All rights reserved.'}</p>
            <p style={{...T.labelSm,color:"rgba(168,162,150,0.5)",fontSize:8}}>Tbilisi, Georgia · info@alternative.ge</p>
          </div>
        </div>
      </div>
    </footer>
  );
}


// ── BRANDS PAGE ──────────────────────────────────────────────────────────────
function BrandsPage({setPage,setSelected,L,mobile}) {
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
      <div style={{maxWidth:1360,margin:"0 auto",padding:`${mobile?"24px":"48px"} ${px} 0`}}>
        <p style={{...T.labelSm,color:C.red||"#c0392b",marginBottom:mobile?32:48,fontSize:mobile?12:14,letterSpacing:2}}>DESIGNERS</p>
        
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:mobile?"0 20px":"0 64px"}}>
          {[col1,col2].map((col,ci)=>(
            <div key={ci}>
              {col.map(brand=>(
                <button key={brand} onClick={()=>setPage("catalog")}
                  style={{display:"block",background:"none",border:"none",padding:`${mobile?"10px":"12px"} 0`,textAlign:"left",cursor:"pointer",width:"100%"}}>
                  <span style={{...T.label,color:C.black,fontSize:mobile?12:13,fontWeight:500,textTransform:"uppercase",letterSpacing:mobile?0.5:1,textDecoration:"underline",textUnderlineOffset:3,textDecorationColor:C.black}}>
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

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page,setPage]=useState("home");
  const [selected,setSelected]=useState(null);
  const [cart,setCart]=useState([]);
  const [user,setUser]=useState(null);
  const [wishlist,setWishlist]=useState([]);
  const [showSearch,setShowSearch]=useState(false);
  const [showCart,setShowCart]=useState(false);
  const [toasts,setToasts]=useState([]);
  const [lang,setLang]=useState("en");
  const mobile = useIsMobile();

  // Active translation object
  const L = LANG_DATA[lang] || LANG_DATA.en;

  useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"});},[page]);

  const toast=useCallback((message,type="info")=>{
    const id=Date.now();
    setToasts(p=>[...p,{id,message,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3200);
  },[]);

  const addToCart=useCallback((item)=>{
    setCart(p=>[item,...p]);
  },[]);

  const removeFromCart=useCallback((i)=>{
    setCart(p=>p.filter((_,idx)=>idx!==i));
    toast(L.removedCart,"");
  },[L]);

  const onWishlist=useCallback((id)=>{
    setWishlist(prev=>{
      if (prev.includes(id)){
        toast(L.removedWishlist,"");
        return prev.filter(x=>x!==id);
      }
      toast(L.addedWishlist,"success");
      return [...prev,id];
    });
  },[L]);

  const commonProps={setPage,toast,user,setUser,L};

  const pages={
    home:    <HomePage setPage={setPage} setSelected={setSelected} L={L} mobile={mobile}/>,
    catalog: <CatalogPage {...commonProps} setSelected={setSelected} wishlist={wishlist} onWishlist={onWishlist} mobile={mobile}/>,
    product: <ProductPage {...commonProps} product={selected} setSelected={setSelected} addToCart={addToCart} wishlist={wishlist} onWishlist={onWishlist} mobile={mobile}/>,
    how:     <HowItWorksPage setPage={setPage} L={L} mobile={mobile}/>,
    about:   <AboutPage setPage={setPage} L={L} mobile={mobile}/>,
    orders:  <OrdersPage orders={cart} setPage={setPage} toast={toast} L={L} mobile={mobile}/>,
    auth:    <AuthPage setPage={setPage} setUser={setUser} toast={toast} L={L} mobile={mobile}/>,
    account: <AccountPage {...commonProps} orders={cart} mobile={mobile}/>,
    admin:   <AdminPanel {...commonProps} orders={cart} mobile={mobile}/>,
    brands:  <BrandsPage setPage={setPage} setSelected={setSelected} L={L} mobile={mobile}/>,
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      <style>{STYLES}</style>
      <Nav page={page} setPage={setPage} cartCount={cart.length}
        user={user} setUser={setUser}
        onSearch={()=>setShowSearch(true)} onCart={()=>setShowCart(true)}
        wishlistCount={wishlist.length}
        lang={lang} setLang={setLang} L={L} mobile={mobile}/>
      {pages[page]||pages.home}
      {showSearch&&<SearchOverlay onClose={()=>setShowSearch(false)} setPage={setPage} setSelected={setSelected} L={L} mobile={mobile}/>}
      {showCart&&<CartDrawer cart={cart} onClose={()=>setShowCart(false)} setPage={setPage} removeFromCart={removeFromCart} L={L} mobile={mobile}/>}
      {/* FLOATING WHATSAPP */}
      {page!=="admin"&&(
        <a href="https://wa.me/995555999555" target="_blank" rel="noopener noreferrer"
          style={{position:"fixed",bottom:mobile?72:32,right:mobile?16:32,zIndex:999,width:56,height:56,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(37,211,102,0.4)",textDecoration:"none",transition:"transform 0.2s"}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
      )}

      <ToastContainer toasts={toasts} mobile={mobile}/>
    </>
  );
}
