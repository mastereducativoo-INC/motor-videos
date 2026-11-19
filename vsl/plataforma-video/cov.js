const {chromium}=require('playwright'); const path=require('path');
const FS=path.resolve(__dirname,'../pdf/node_modules/@fontsource');
const ff=(f,d,w)=>`@font-face{font-family:'${f}';font-weight:${w};src:url(file://${FS}/${d}/files/${d}-latin-${w}-normal.woff2)}`;
const css=[ff('Montserrat','montserrat',600),ff('Montserrat','montserrat',800),ff('Montserrat','montserrat',900)].join('');
const IC={
 play:'<path d="M9 6.5v11l9-5.5z" fill="currentColor"/>',
 libro:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 8h8M8 11.5h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
 capas:'<path d="M12 3l9 5-9 5-9-5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 12.5l9 5 9-5M3 17l9 5 9-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
 caja:'<path d="M3 7l9-4 9 4v10l-9 4-9-4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 7l9 4 9-4M12 11v10" fill="none" stroke="currentColor" stroke-width="1.6"/>',
 corona:'<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
};
const C=[
 ['curso','#0d0b14','#2a2134','#f2c35b','#ffe3a1','play','TU CURSO','Curso principal'],
 ['c1','#06231f','#0e4a40','#5ee6c4','#c8fff0','libro','GUÍA PRÁCTICA','Complemento'],
 ['c2','#2a0d14','#5c1b2a','#ff8fa3','#ffd9e0','capas','PLANTILLAS','Complemento'],
 ['c3','#0a1630','#143064','#79a8ff','#d6e4ff','caja','RECURSOS EXTRA','Complemento'],
 ['c4','#241a05','#5a430c','#ffcc4d','#fff0c2','libro','EJERCICIOS','Complemento'],
 ['sp','#140b2c','#3b2490','#cbbcff','#ffffff','corona','SÚPER PACK','Siguiente nivel'],
];
(async()=>{const b=await chromium.launch(); const p=await b.newPage({viewport:{width:600,height:600}});
for(const [id,a,c,acc,acc2,ic,t,s] of C){
 require('fs').writeFileSync(__dirname+'/cov/t.html',`<style>${css}*{margin:0;box-sizing:border-box}body{width:600px;height:600px;font-family:Montserrat;overflow:hidden}
 .c{position:relative;width:600px;height:600px;background:radial-gradient(90% 70% at 50% 30%,${c},${a} 75%);display:grid;place-items:center;overflow:hidden}
 .c::before{content:"";position:absolute;inset:-20%;background:conic-gradient(from 200deg at 50% 40%,transparent 0 30%,${acc}22 40%,transparent 50%,${acc}18 70%,transparent 80%)}
 .c::after{content:"";position:absolute;inset:18px;border-radius:26px;border:1.5px solid ${acc}55}
 .in{position:relative;display:grid;justify-items:center;gap:22px;text-align:center}
 .ic{width:150px;height:150px;border-radius:44px;display:grid;place-items:center;color:${acc2};background:linear-gradient(160deg,${acc}40,${acc}10);border:1.5px solid ${acc}80;box-shadow:0 30px 60px -20px #000,0 0 80px -10px ${acc}90}
 .ic svg{width:84px;height:84px}
 small{font-size:22px;font-weight:600;letter-spacing:.32em;color:${acc};text-transform:uppercase}
 h1{font-size:${t.length>12?58:72}px;font-weight:900;letter-spacing:-.02em;line-height:1;color:#fff;max-width:520px}
 .me{position:absolute;bottom:44px;left:0;right:0;text-align:center;font-size:17px;font-weight:800;letter-spacing:.38em;color:#fff;opacity:.85}.me i{font-style:normal;color:${acc}}
 </style><div class="c"><div class="in"><div class="ic"><svg viewBox="0 0 24 24">${IC[ic]}</svg></div><small>${s}</small><h1>${t}</h1></div><div class="me">MASTER <i>EDUCATIVO</i></div></div>`); await p.goto('file://'+__dirname+'/cov/t.html');
 await p.waitForTimeout(250); await p.screenshot({path:`cov/${id}.png`}); }
await b.close();})();
