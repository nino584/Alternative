import { useState, useEffect } from "react";

export default function useIsMobile(breakpoint=768) {
  const [m,setM]=useState(()=>typeof window!=="undefined"?window.innerWidth<breakpoint:false);
  useEffect(()=>{
    const fn=()=>setM(window.innerWidth<breakpoint);
    window.addEventListener("resize",fn);
    return()=>window.removeEventListener("resize",fn);
  },[breakpoint]);
  return m;
}
