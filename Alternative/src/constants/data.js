import { C } from './theme.js';
import { PI } from './images.js';

// ── SIZES ─────────────────────────────────────────────────────────────────────
export const SIZES_CLOTHING = ["XS","S","M","L","XL","XXL"];
export const SIZES_CLOTHING_W = ["XXS","XS","S","M","L","XL","XXL","XXXL"];
export const SIZES_CLOTHING_M = ["XS","S","M","L","XL","XXL","XXXL"];
export const SIZES_SHOES = ["36","37","38","39","40","41","42","43","44","45"];
export const SIZES_SHOES_W = ["35","36","37","38","39","40","41"];
export const SIZES_SHOES_M = ["39","40","41","42","43","44","45","46","47"];
export const SIZES_BAGS = ["One Size"];
export const SIZES_ACC = ["One Size"];

// ── PRODUCTS ──────────────────────────────────────────────────────────────────
export const PRODUCTS = [
  {id:1,name:"Arco Tote",section:"Womenswear",cat:"Bags",sub:"Bags",type:"Totes",color:"Camel",price:320,sale:null,lead:"10–14 days",tag:"New",img:PI.tote,sizes:SIZES_BAGS,fit:{fit:"One Size",notes:"Dimensions: 34×25×12cm. Suitable for A4 documents."},brand:"Bottega Veneta",desc:"Intreccio lambskin. Gold-tone brass hardware. Interior suede lining with zip pocket.",
    details:{code:"ALT-BV001",composition:"100% Lambskin",madeIn:"Italy",dimensions:"H: 25cm  W: 34cm  D: 12cm",features:["Intreccio weave pattern","Gold-tone brass hardware","Interior suede lining","Interior zip pocket","Open top design"]}},
  {id:2,name:"Classic Flap Bag",section:"Womenswear",cat:"Bags",sub:"Bags",type:"Shoulder Bags",color:"Black",price:280,sale:null,lead:"12–16 days",tag:"",img:PI.quilted,sizes:SIZES_BAGS,fit:{fit:"One Size",notes:"Chain length: 120cm. Can be worn cross-body or on shoulder."},brand:"Saint Laurent",desc:"Diamond-quilted calfskin. Silver-tone chain strap. YSL turn-lock closure.",
    details:{code:"ALT-SL002",composition:"100% Calfskin",madeIn:"Italy",dimensions:"H: 20cm  W: 28cm  D: 8cm",features:["Diamond-quilted pattern","Silver-tone chain strap","YSL turn-lock closure","Interior card slots","Chain length: 120cm"]}},
  {id:3,name:"Silk Twill Scarf 90×90",section:"Womenswear",cat:"Accessories",sub:"Accessories",type:"Scarves",color:"Ivory",price:95,sale:75,lead:"8–10 days",tag:"Sale",img:PI.scarf,sizes:SIZES_ACC,fit:{fit:"One Size",notes:"90×90cm. Can be worn as headscarf, belt or bag accessory."},brand:"Loewe",desc:"100% silk twill. Hand-rolled edges. Signature Anagram print.",
    details:{code:"ALT-LW003",composition:"100% Silk twill",madeIn:"Spain",dimensions:"90 × 90cm",features:["Hand-rolled edges","Signature Anagram print","Versatile styling: headscarf, belt or bag accessory"]}},
  {id:4,name:"Block Heel Mule",section:"Womenswear",cat:"Shoes",sub:"Shoes",type:"Mules",color:"Nude",price:190,sale:null,lead:"10–12 days",tag:"",img:PI.mule,sizes:SIZES_SHOES_W,fit:{fit:"True to size",notes:"We recommend ordering your usual size. Leather stretches slightly."},brand:"Chloé",desc:"Full-grain leather upper. 6cm block heel. Scalloped edge detail.",
    details:{code:"ALT-CH004",composition:"Upper: 100% Calfskin. Sole: Leather",madeIn:"Italy",features:["Full-grain leather upper","6cm block heel","Scalloped edge detail","Leather lining","Leather sole"]}},
  {id:5,name:"Cashmere Scarf",section:"Womenswear",cat:"Accessories",sub:"Accessories",type:"Scarves",color:"Camel",price:130,sale:null,lead:"8–10 days",tag:"New",img:PI.cashmere,sizes:SIZES_ACC,fit:{fit:"One Size",notes:"200×70cm. Generous oversized length."},brand:"Brunello Cucinelli",desc:"100% cashmere. Brushed finish. Monili detail.",
    details:{code:"ALT-BC005",composition:"100% Cashmere",madeIn:"Italy",dimensions:"200 × 70cm",features:["Brushed finish","Monili bead detail","Generous oversized length","Dry clean only"]}},
  {id:6,name:"Mini Puzzle Bag",section:"Womenswear",cat:"Bags",sub:"Bags",type:"Crossbody",color:"Burgundy",price:195,sale:null,lead:"10–14 days",tag:"",img:PI.crossbody,sizes:SIZES_BAGS,fit:{fit:"One Size",notes:"18×14×6cm. Chain length adjustable."},brand:"Loewe",desc:"Soft pebbled calfskin. Signature puzzle geometric panels. Gold chain.",
    details:{code:"ALT-LW006",composition:"100% Calfskin",madeIn:"Spain",dimensions:"H: 14cm  W: 18cm  D: 6cm",features:["Soft pebbled texture","Signature puzzle geometric panels","Gold chain strap","Adjustable chain length","Zip closure"]}},
  {id:7,name:"Tailored Wool Blazer",section:"Womenswear",cat:"Clothing",sub:"Clothing",type:"Blazers",color:"Camel",price:380,sale:null,lead:"12–16 days",tag:"New",img:PI.blazer,sizes:SIZES_CLOTHING_W,fit:{fit:"Relaxed fit",notes:"Model is 175cm wearing size S. Size down for tailored look."},brand:"Max Mara",desc:"80% wool, 20% cashmere. Structured shoulder. Satin lining.",
    details:{code:"ALT-MM007",composition:"80% Wool, 20% Cashmere. Lining: 100% Viscose",madeIn:"Italy",features:["Structured shoulder","Full satin lining","Single-breasted closure","Relaxed fit","Notch lapel"]}},
  {id:8,name:"Leather Belt — 25mm",section:"Womenswear",cat:"Accessories",sub:"Accessories",type:"Belts",color:"Cognac",price:115,sale:null,lead:"8–10 days",tag:"",img:PI.belt,sizes:["70cm","75cm","80cm","85cm","90cm"],fit:{fit:"True to size",notes:"Measure your waist and choose the corresponding length."},brand:"Valentino",desc:"Vegetable-tanned calfskin. V-Logo signature buckle.",
    details:{code:"ALT-VL008",composition:"100% Calfskin",madeIn:"Italy",features:["Vegetable-tanned leather","V-Logo signature buckle","Gold-tone hardware","Width: 25mm","5-hole adjustable closure"]}},
  {id:9,name:"Automatic Mesh Watch",section:"Menswear",cat:"Watches",sub:"Watches",type:"Automatic",color:"Silver",price:480,sale:null,lead:"14–18 days",tag:"Popular",img:PI.watch1,sizes:SIZES_ACC,fit:{fit:"One Size",notes:"Case diameter: 40mm. Adjustable mesh strap."},brand:"Tom Ford",desc:"Sapphire crystal glass. Swiss automatic movement. 5ATM water resistance.",
    details:{code:"ALT-TF009",composition:"Stainless Steel, Sapphire Crystal",madeIn:"Switzerland",dimensions:"Case diameter: 40mm",features:["Swiss automatic movement","Sapphire crystal glass","Mesh bracelet strap","5ATM water resistance","Case diameter: 40mm"]}},
  {id:10,name:"Gold Bracelet Watch",section:"Menswear",cat:"Watches",sub:"Watches",type:"Bracelet",color:"Gold",price:420,sale:null,lead:"14–18 days",tag:"",img:PI.watch2,sizes:SIZES_ACC,fit:{fit:"One Size",notes:"Case diameter: 38mm. Adjustable bracelet."},brand:"Cartier",desc:"PVD gold-tone case. Brushed bracelet. Day-date complication.",
    details:{code:"ALT-CT010",composition:"PVD Gold-tone Stainless Steel",madeIn:"Switzerland",dimensions:"Case diameter: 38mm",features:["PVD gold-tone finish","Brushed bracelet","Day-date complication","Adjustable bracelet","Case diameter: 38mm"]}},
  {id:11,name:"Horsebit Loafer",section:"Menswear",cat:"Shoes",sub:"Shoes",type:"Loafers",color:"Black",price:220,sale:180,lead:"10–12 days",tag:"Sale",img:PI.loafer,sizes:SIZES_SHOES_M,fit:{fit:"True to size",notes:"Runs true. Full leather lining softens with wear."},brand:"Gucci",desc:"Smooth calfskin. Signature horsebit hardware. Blake-stitched leather sole.",
    details:{code:"ALT-GC011",composition:"Upper: 100% Calfskin. Sole: Leather",madeIn:"Italy",features:["Smooth calfskin upper","Signature horsebit hardware","Blake-stitched construction","Full leather lining","Leather sole"]}},
  {id:12,name:"Weekender Duffle",section:"Menswear",cat:"Bags",sub:"Bags",type:"Duffle",color:"Tan",price:350,sale:null,lead:"12–16 days",tag:"New",img:PI.duffle,sizes:SIZES_BAGS,fit:{fit:"One Size",notes:"48×28×25cm. Weekend bag capacity."},brand:"Loro Piana",desc:"Full-grain leather. Removable shoulder strap. Interior zip compartment.",
    details:{code:"ALT-LP012",composition:"100% Full-grain Leather. Lining: Cotton",madeIn:"Italy",dimensions:"H: 28cm  W: 48cm  D: 25cm",features:["Removable shoulder strap","Interior zip compartment","Cotton lining","Double zip closure","Weekend bag capacity"]}},
  {id:13,name:"Double-Breasted Overcoat",section:"Menswear",cat:"Clothing",sub:"Clothing",type:"Coats",color:"Charcoal",price:520,sale:null,lead:"14–18 days",tag:"",img:PI.overcoat,sizes:SIZES_CLOTHING_M,fit:{fit:"Oversized fit",notes:"Model is 185cm wearing size M. True to size for relaxed silhouette."},brand:"The Row",desc:"90% virgin wool. Double-breasted. Structured shoulder. Fully lined.",
    details:{code:"ALT-TR013",composition:"90% Virgin Wool, 10% Cashmere. Lining: 100% Cupro",madeIn:"Italy",features:["Double-breasted closure","Structured shoulder","Full cupro lining","Oversized silhouette","Two front welt pockets"]}},
  {id:14,name:"Ceramic Dress Watch",section:"Menswear",cat:"Watches",sub:"Watches",type:"Dress",color:"White",price:390,sale:null,lead:"14–18 days",tag:"Limited",img:PI.dresswatch,sizes:SIZES_ACC,fit:{fit:"One Size",notes:"Case diameter: 39mm. Alligator leather strap."},brand:"Tom Ford",desc:"Ceramic bezel. Swiss quartz movement. Sapphire crystal.",
    details:{code:"ALT-TF014",composition:"Ceramic, Stainless Steel, Sapphire Crystal",madeIn:"Switzerland",dimensions:"Case diameter: 39mm",features:["Ceramic bezel","Swiss quartz movement","Sapphire crystal glass","Alligator leather strap","Case diameter: 39mm"]}},
  {id:15,name:"Mini Puffer Jacket",section:"Kidswear",cat:"Clothing",sub:"Clothing",type:"Jackets",color:"Cream",price:145,sale:null,lead:"10–14 days",tag:"New",img:PI.puffer,sizes:["2Y","4Y","6Y","8Y","10Y","12Y"],fit:{fit:"True to age",notes:"Comfortable fit, not oversized. Machine washable at 30°."},brand:"Moncler",desc:"Lightweight goose-down fill. Snap-button closure. Machine washable.",
    details:{code:"ALT-MC015",composition:"Shell: 100% Polyamide. Fill: 90% Goose Down, 10% Feather",madeIn:"Romania",features:["Lightweight goose-down fill","Snap-button closure","Machine washable at 30°","Hooded design","Elastic cuffs"]}},
  {id:16,name:"Canvas Sneaker",section:"Kidswear",cat:"Shoes",sub:"Shoes",type:"Sneakers",color:"White",price:85,sale:null,lead:"8–10 days",tag:"",img:PI.sneaker,sizes:["27","28","29","30","31","32","33","34","35"],fit:{fit:"True to size",notes:"Rubber sole. Recommended to measure foot length before ordering."},brand:"Golden Goose",desc:"Canvas upper. Signature star. Rubber sole. Velcro closure.",
    details:{code:"ALT-GG016",composition:"Upper: 100% Canvas. Sole: Rubber",madeIn:"Italy",features:["Signature star appliqué","Rubber sole","Velcro closure","Padded insole","Reinforced toe cap"]}},
];

// ── ORDER STATUSES ────────────────────────────────────────────────────────────
export const ORDER_STATUSES = [
  {key:"reserved",label:"Reserved",desc:"Reservation confirmed. We are processing your order now.",color:C.brown},
  {key:"sourcing",label:"Sourcing",desc:"Your item is being sourced from our verified supplier network.",color:C.tan},
  {key:"confirmed",label:"Confirmed",desc:"Item confirmed in stock and being packaged.",color:"#1a5c8b"},
  {key:"shipped",label:"Shipped",desc:"In transit to Georgia. Estimated arrival 3–5 days.",color:C.green},
  {key:"delivered",label:"Delivered",desc:"Order delivered. Enjoy!",color:C.gray},
];
