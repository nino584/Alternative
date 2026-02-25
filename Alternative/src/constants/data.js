import { C } from './theme.js';
import { PI } from './images.js';

// ── SIZES ─────────────────────────────────────────────────────────────────────
export const SIZES_CLOTHING = ["XS","S","M","L","XL","XXL"];
export const SIZES_SHOES = ["36","37","38","39","40","41","42","43","44","45"];
export const SIZES_BAGS = ["One Size"];
export const SIZES_ACC = ["One Size"];

// ── PRODUCTS ──────────────────────────────────────────────────────────────────
export const PRODUCTS = [
  {id:1,name:"Arco Tote",section:"Womenswear",cat:"Bags",sub:"Bags",color:"Camel",price:320,sale:null,lead:"10–14 days",tag:"New",img:PI.tote,sizes:SIZES_BAGS,fit:{fit:"One Size",notes:"Dimensions: 34×25×12cm. Suitable for A4 documents."},brand:"Bottega Veneta",desc:"Intreccio lambskin. Gold-tone brass hardware. Interior suede lining with zip pocket."},
  {id:2,name:"Classic Flap Bag",section:"Womenswear",cat:"Bags",sub:"Bags",color:"Black",price:280,sale:null,lead:"12–16 days",tag:"",img:PI.quilted,sizes:SIZES_BAGS,fit:{fit:"One Size",notes:"Chain length: 120cm. Can be worn cross-body or on shoulder."},brand:"Saint Laurent",desc:"Diamond-quilted calfskin. Silver-tone chain strap. YSL turn-lock closure."},
  {id:3,name:"Silk Twill Scarf 90×90",section:"Womenswear",cat:"Accessories",sub:"Accessories",color:"Ivory",price:95,sale:75,lead:"8–10 days",tag:"Sale",img:PI.scarf,sizes:SIZES_ACC,fit:{fit:"One Size",notes:"90×90cm. Can be worn as headscarf, belt or bag accessory."},brand:"Loewe",desc:"100% silk twill. Hand-rolled edges. Signature Anagram print."},
  {id:4,name:"Block Heel Mule",section:"Womenswear",cat:"Shoes",sub:"Shoes",color:"Nude",price:190,sale:null,lead:"10–12 days",tag:"",img:PI.mule,sizes:SIZES_SHOES,fit:{fit:"True to size",notes:"We recommend ordering your usual size. Leather stretches slightly."},brand:"Chloé",desc:"Full-grain leather upper. 6cm block heel. Scalloped edge detail."},
  {id:5,name:"Cashmere Scarf",section:"Womenswear",cat:"Accessories",sub:"Accessories",color:"Camel",price:130,sale:null,lead:"8–10 days",tag:"New",img:PI.cashmere,sizes:SIZES_ACC,fit:{fit:"One Size",notes:"200×70cm. Generous oversized length."},brand:"Brunello Cucinelli",desc:"100% cashmere. Brushed finish. Monili detail."},
  {id:6,name:"Mini Puzzle Bag",section:"Womenswear",cat:"Bags",sub:"Bags",color:"Burgundy",price:195,sale:null,lead:"10–14 days",tag:"",img:PI.crossbody,sizes:SIZES_BAGS,fit:{fit:"One Size",notes:"18×14×6cm. Chain length adjustable."},brand:"Loewe",desc:"Soft pebbled calfskin. Signature puzzle geometric panels. Gold chain."},
  {id:7,name:"Tailored Wool Blazer",section:"Womenswear",cat:"Clothing",sub:"Clothing",color:"Camel",price:380,sale:null,lead:"12–16 days",tag:"New",img:PI.blazer,sizes:SIZES_CLOTHING,fit:{fit:"Relaxed fit",notes:"Model is 175cm wearing size S. Size down for tailored look."},brand:"Max Mara",desc:"80% wool, 20% cashmere. Structured shoulder. Satin lining."},
  {id:8,name:"Leather Belt — 25mm",section:"Womenswear",cat:"Accessories",sub:"Accessories",color:"Cognac",price:115,sale:null,lead:"8–10 days",tag:"",img:PI.belt,sizes:["70cm","75cm","80cm","85cm","90cm"],fit:{fit:"True to size",notes:"Measure your waist and choose the corresponding length."},brand:"Valentino",desc:"Vegetable-tanned calfskin. V-Logo signature buckle."},
  {id:9,name:"Automatic Mesh საათი",section:"Menswear",cat:"Watches",sub:"Watches",color:"Silver",price:480,sale:null,lead:"14–18 days",tag:"Popular",img:PI.watch1,sizes:SIZES_ACC,fit:{fit:"One Size",notes:"Case diameter: 40mm. Adjustable mesh strap."},brand:"Tom Ford",desc:"Sapphire crystal glass. Swiss automatic movement. 5ATM water resistance."},
  {id:10,name:"Gold Bracelet საათი",section:"Menswear",cat:"Watches",sub:"Watches",color:"Gold",price:420,sale:null,lead:"14–18 days",tag:"",img:PI.watch2,sizes:SIZES_ACC,fit:{fit:"One Size",notes:"Case diameter: 38mm. Adjustable bracelet."},brand:"Cartier",desc:"PVD gold-tone case. Brushed bracelet. Day-date complication."},
  {id:11,name:"Horsebit Loafer",section:"Menswear",cat:"Shoes",sub:"Shoes",color:"Black",price:220,sale:180,lead:"10–12 days",tag:"Sale",img:PI.loafer,sizes:SIZES_SHOES,fit:{fit:"True to size",notes:"Runs true. Full leather lining softens with wear."},brand:"Gucci",desc:"Smooth calfskin. Signature horsebit hardware. Blake-stitched leather sole."},
  {id:12,name:"Weekender Duffle",section:"Menswear",cat:"Bags",sub:"Bags",color:"Tan",price:350,sale:null,lead:"12–16 days",tag:"New",img:PI.duffle,sizes:SIZES_BAGS,fit:{fit:"One Size",notes:"48×28×25cm. Weekend bag capacity."},brand:"Loro Piana",desc:"Full-grain leather. Removable shoulder strap. Interior zip compartment."},
  {id:13,name:"Double-Breasted Overcoat",section:"Menswear",cat:"Clothing",sub:"Clothing",color:"Charcoal",price:520,sale:null,lead:"14–18 days",tag:"",img:PI.overcoat,sizes:SIZES_CLOTHING,fit:{fit:"Oversized fit",notes:"Model is 185cm wearing size M. True to size for relaxed silhouette."},brand:"The Row",desc:"90% virgin wool. Double-breasted. Structured shoulder. Fully lined."},
  {id:14,name:"Ceramic Dress საათი",section:"Menswear",cat:"Watches",sub:"Watches",color:"White",price:390,sale:null,lead:"14–18 days",tag:"Limited",img:PI.dresswatch,sizes:SIZES_ACC,fit:{fit:"One Size",notes:"Case diameter: 39mm. Alligator leather strap."},brand:"Tom Ford",desc:"Ceramic bezel. Swiss quartz movement. Sapphire crystal."},
  {id:15,name:"Mini Puffer Jacket",section:"Kidswear",cat:"Clothing",sub:"Clothing",color:"Cream",price:145,sale:null,lead:"10–14 days",tag:"New",img:PI.puffer,sizes:["2Y","4Y","6Y","8Y","10Y","12Y"],fit:{fit:"True to age",notes:"Comfortable fit, not oversized. Machine washable at 30°."},brand:"Moncler",desc:"Lightweight goose-down fill. Snap-button closure. Machine washable."},
  {id:16,name:"Canvas Sneaker",section:"Kidswear",cat:"Shoes",sub:"Shoes",color:"White",price:85,sale:null,lead:"8–10 days",tag:"",img:PI.sneaker,sizes:["27","28","29","30","31","32","33","34","35"],fit:{fit:"True to size",notes:"Rubber sole. Recommended to measure foot length before ordering."},brand:"Golden Goose",desc:"Canvas upper. Signature star. Rubber sole. Velcro closure."},
];

// ── ORDER STATUSES ────────────────────────────────────────────────────────────
export const ORDER_STATUSES = [
  {key:"reserved",label:"Reserved",desc:"Reservation confirmed. We are processing your order now.",color:C.brown},
  {key:"sourcing",label:"Sourcing",desc:"Your item is being sourced from our verified supplier network.",color:C.tan},
  {key:"confirmed",label:"Confirmed",desc:"Item confirmed in stock and being packaged.",color:"#1a5c8b"},
  {key:"shipped",label:"Shipped",desc:"In transit to Georgia. Estimated arrival 3–5 days.",color:C.green},
  {key:"delivered",label:"Delivered",desc:"Order delivered. Enjoy!",color:C.gray},
];
