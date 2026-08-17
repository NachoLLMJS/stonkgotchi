"use strict";
/* Fullscreen entry gate drawn with STONKGOTCHI's bitmap font and pixel UI.
   The DOM form is only an accessible keyboard/hitbox layer. */
(function initEntryGate(){
  const gate=document.getElementById('entry-gate');
  const canvas=document.getElementById('entry-scene');
  const loading=document.getElementById('entry-loading');
  const percent=document.getElementById('entry-percent');
  const progressBar=document.getElementById('entry-progress');
  const form=document.getElementById('entry-profile');
  const input=document.getElementById('profile-name');
  const play=document.getElementById('entry-play');
  if(!gate||!canvas||!form||!input||!play) return;

  const c=canvas.getContext('2d',{alpha:false});
  c.imageSmoothingEnabled=false;
  let W=0,H=0,unit=3,panelRect=null,inputRect=null,playRect=null;
  let started=false,done=false,ready=false,startAt=0,raf=0,touched=false;
  const MIN_LOAD_MS=1800;

  function pixel(x,y,w,h,col){ c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h)); }
  function text(s,x,y,col='#1a1428',scale=1){ drawTextAt(c,String(s),Math.round(x),Math.round(y),col,scale); }
  function textWidth(s,scale=1){ return (window.STONK_I18N?window.STONK_I18N.logicalWidth(s):Math.max(0,String(s).length*4-1))*scale; }
  function textC(s,x,y,col='#1a1428',scale=1){ text(s,x-textWidth(s,scale)/2,y,col,scale); }

  function panel(x,y,w,h){
    pixel(x+2,y+3,w,h,'rgba(26,20,40,.42)');
    pixel(x,y,w,h,'#1a1428');
    pixel(x+1,y+1,w-2,h-2,'#f6efe0');
    pixel(x+2,y+2,w-4,1,'#fff8e8');
    pixel(x+2,y+h-4,w-4,3,'#7ac74f');
    pixel(x,y,2,2,'#fff8e8'); pixel(x+w-2,y,2,2,'#fff8e8');
    pixel(x,y+h-2,2,2,'#fff8e8'); pixel(x+w-2,y+h-2,2,2,'#fff8e8');
  }
  function card(x,y,w,h,accent='#ffd94a',disabled=false){
    pixel(x+1,y+2,w,h,'rgba(26,20,40,.28)');
    pixel(x,y,w,h,'#1a1428');
    pixel(x+1,y+1,w-2,h-2,disabled?'#d0c8b0':'#fff8e8');
    pixel(x+2,y+h-4,w-4,2,disabled?'#aaa397':accent);
  }

  function layout(){
    unit=innerWidth>=900?3:2;
    W=Math.max(160,Math.ceil(innerWidth/unit));
    H=Math.max(180,Math.ceil(innerHeight/unit));
    if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;c.imageSmoothingEnabled=false;}
    const wide=W/H>1.15;
    const pw=wide?Math.min(142,Math.floor(W*.46)):W-16;
    const ph=104;
    panelRect={x:Math.floor((W-pw)/2),y:Math.floor((H-ph)/2),w:pw,h:ph,wide};
    inputRect={x:panelRect.x+10,y:panelRect.y+48,w:panelRect.w-20,h:18};
    playRect={x:panelRect.x+10,y:panelRect.y+78,w:panelRect.w-20,h:18};
    positionHitboxes();
  }

  function cssRect(r){
    const b=canvas.getBoundingClientRect();
    return {left:b.left+r.x/W*b.width,top:b.top+r.y/H*b.height,width:r.w/W*b.width,height:r.h/H*b.height};
  }
  function positionHitboxes(){
    if(!inputRect||form.hidden) return;
    const ir=cssRect(inputRect),br=cssRect(playRect);
    Object.assign(input.style,{left:ir.left+'px',top:ir.top+'px',width:ir.width+'px',height:ir.height+'px'});
    Object.assign(play.style,{left:br.left+'px',top:br.top+'px',width:br.width+'px',height:br.height+'px'});
  }

  function cloud(x,y,w){
    pixel(x,y+2,w,3,'#fff8e8'); pixel(x+Math.floor(w*.22),y,w*.34,5,'#fff8e8');
  }
  function drawWorld(now){
    const sky=Math.max(48,panelRect.y+2),focus=Math.floor(W/2);
    pixel(0,0,W,H,'#75c5df');
    pixel(0,Math.floor(sky*.34),W,Math.floor(sky*.28),'#91d2e7');
    pixel(0,Math.floor(sky*.62),W,Math.ceil(sky*.38),'#b9e4ed');
    const sunX=Math.max(20,focus+Math.floor(W*.20)),sunY=Math.max(12,Math.floor(H*.08));
    pixel(sunX-4,sunY,9,9,'#ffd94a'); pixel(sunX-6,sunY+2,13,5,'#ffd94a');
    const drift=(now/90)%W;
    cloud((18+drift*.12)%W,Math.floor(H*.12),15);
    cloud((focus+28+drift*.07)%W,Math.floor(H*.20),12);
    cloud((W-45+drift*.05)%W,Math.floor(H*.09),18);
    pixel(0,sky-18,W,18,'#4c8f59');
    for(let x=0;x<W;x+=18){
      const h=5+((x*7)%13); pixel(x,sky-18-h,24,h+1,'#4c8f59');
    }
    pixel(0,sky,W,H-sky,'#61ad69');
    for(let y=sky+8;y<H;y+=11){
      for(let x=(y%22);x<W;x+=27) pixel(x,y,2,1,(x+y)%3?'#6dbc73':'#4c8f59');
    }
    const lines=[LINE_KEYS[0],LINE_KEYS[1],LINE_KEYS[2]];
    const spread=panelRect.wide?52:38;
    const xs=[focus-spread,focus,focus+spread];
    const petBase=Math.min(H-10,panelRect.y+panelRect.h+24);
    for(let i=0;i<3;i++){
      const frames=SPR[lines[i]+'_babyA'];
      if(!frames||!frames.length) continue;
      const spr=frames[Math.floor(now/620+i)%frames.length];
      const bob=matchMedia('(prefers-reduced-motion: reduce)').matches?0:(Math.floor(now/330+i)%2);
      const by=petBase-bob;
      pixel(xs[i]-7,by,14,2,'rgba(26,20,40,.25)');
      c.drawImage(spr,Math.round(xs[i]-spr.width/2),Math.round(by-spr.height));
    }
    if(Math.floor(now/280)%2===0){
      pixel(focus-spread-17,petBase-9,2,2,'#ffd94a');
      pixel(focus+spread+15,petBase+3,1,2,'#fff8e8');
      pixel(focus+7,petBase+9,2,1,'#e8578a');
    }
  }

  const PROFILE_SEGMENTER=typeof Intl.Segmenter==='function' ? new Intl.Segmenter(undefined,{granularity:'grapheme'}) : null;
  function profileChars(value){
    const text=String(value||'');
    return PROFILE_SEGMENTER ? Array.from(PROFILE_SEGMENTER.segment(text),part=>part.segment) : Array.from(text);
  }
  function cleanName(value){
    const safe=String(value||'').normalize('NFKC').replace(/[\p{Cc}\p{Cf}\p{Cs}]/gu,'').replace(/\s+/gu,' ').trim();
    return profileChars(safe).slice(0,16).join('');
  }
  function validName(){ return profileChars(cleanName(input.value)).length>=2; }
  function updateInput(){
    const valid=validName();
    play.disabled=!ready||!valid;
    input.setAttribute('aria-invalid',touched&&!valid?'true':'false');
  }

  function drawPanel(now,progress){
    const p=panelRect;
    panel(p.x,p.y,p.w,p.h);
    textC('STONKGOTCHI',p.x+p.w/2,p.y+13,'#1a1428',2);
    textC('TOKENIZED STOCKS PET WORLD',p.x+p.w/2,p.y+31,'#6f6878');
    if(!ready){
      text('PREPARANDO EL MUNDO',p.x+10,p.y+49,'#1a1428');
      text(Math.round(progress*100)+'%',p.x+p.w-10-textWidth(Math.round(progress*100)+'%'),p.y+49,'#8a6a10');
      card(p.x+10,p.y+59,p.w-20,15,'#ffd94a');
      pixel(p.x+13,p.y+63,Math.round((p.w-26)*progress),7,'#ffd94a');
      textC('REUNIENDO MASCOTAS Y PAISAJE',p.x+p.w/2,p.y+83,'#6f6878');
      return;
    }
    text('NOMBRE DE PERFIL',inputRect.x,inputRect.y-9,'#1a1428');
    card(inputRect.x,inputRect.y,inputRect.w,inputRect.h,'#ffd94a');
    const value=cleanName(input.value).toUpperCase();
    const shown=value||'ESCRIBE TU NOMBRE';
    text(shown,inputRect.x+5,inputRect.y+6,value?'#1a1428':'#8f8897');
    if(document.activeElement===input && Math.floor(now/460)%2===0){
      const caretX=Math.min(inputRect.x+inputRect.w-5,inputRect.x+5+textWidth(shown));
      pixel(caretX,inputRect.y+5,1,7,'#1a1428');
    }
    const valid=validName();
    if(touched&&!valid) textC('USA ENTRE 2 Y 16 CARACTERES',p.x+p.w/2,p.y+70,'#e8574c');
    card(playRect.x,playRect.y,playRect.w,playRect.h,'#7ac74f',!valid);
    textC('JUGAR',playRect.x+playRect.w/2,playRect.y+6,valid?'#1a1428':'#6f6878');
  }

  function frame(now){
    if(done) return;
    layout();
    const progress=Math.max(0,Math.min(1,(now-startAt)/MIN_LOAD_MS));
    if(!ready&&progress>=1){
      ready=true;
      loading.hidden=true;
      form.hidden=false;
      positionHitboxes();
      updateInput();
    }
    loading.setAttribute('aria-valuenow',String(Math.round(progress*100)));
    percent.textContent=Math.round(progress*100)+'%';
    progressBar.style.width=Math.round(progress*100)+'%';
    drawWorld(now);
    drawPanel(now,progress);
    raf=requestAnimationFrame(frame);
  }

  function start(){
    if(started) return;
    started=true;startAt=performance.now();
    input.value=cleanName(G&&G.profileName);
    layout();updateInput();
    raf=requestAnimationFrame(frame);
  }

  input.addEventListener('input',()=>{
    touched=true;
    const safe=cleanName(input.value);
    if(input.value!==safe) input.value=safe;
    updateInput();
  });
  input.addEventListener('blur',()=>{input.value=cleanName(input.value);updateInput();});
  form.addEventListener('submit',ev=>{
    ev.preventDefault();touched=true;updateInput();
    if(!ready||!validName()||!G) return;
    const name=cleanName(input.value);
    input.value=name;G.profileName=name;saveGame();
    audio();SFX.yay();
    gate.classList.add('is-leaving');
    document.body.classList.remove('is-entry');
    setTimeout(()=>{done=true;cancelAnimationFrame(raf);gate.hidden=true;},360);
  });
  addEventListener('resize',layout,{passive:true});

  window.STONK_ENTRY=Object.freeze({start,cleanName,profileName:()=>G&&G.profileName||''});
})();
