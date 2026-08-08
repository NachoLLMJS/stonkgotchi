"use strict";
/* =========================================================
   BITXO — core/canvas: lienzo, escalado pixel-perfect y px()
   ========================================================= */
const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const wrapEl = document.getElementById('wrap');
let SCALE = 2;
function resize(){
  /* área útil: el visual viewport menos las zonas seguras (notch,
     barra de inicio), que #wrap reserva con padding env() */
  const cs = getComputedStyle(wrapEl);
  const vv = window.visualViewport;
  const w = (vv ? vv.width  : window.innerWidth)  - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const h = (vv ? vv.height : window.innerHeight) - parseFloat(cs.paddingTop)  - parseFloat(cs.paddingBottom);
  /* La copia local aprovecha todo el alto/ancho disponible sin deformar
     la resolución lógica del juego. El fondo ambiental completa el viewport. */
  SCALE = Math.max(1, Math.min(w/LW, h/LH));
  cv.width = LW; cv.height = LH;
  cv.style.width = (LW*SCALE)+'px';
  cv.style.height = (LH*SCALE)+'px';
  ctx.imageSmoothingEnabled = false;
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', resize);
if(window.visualViewport) window.visualViewport.addEventListener('resize', resize);
resize();

function px(x,y,w,h,c){ ctx.fillStyle=c; ctx.fillRect(Math.round(x),Math.round(y),w,h); }
