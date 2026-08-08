"use strict";
/* STONKGOTCHI Stocks Vault.
   Local game mechanic only: no wallet, network, contracts or real funds. */
(function initStockVault(){
  const LEGACY_KEY = 'stonkgotchi-vault-v1';
  const MODULES = Object.freeze({
    feeder:Object.freeze({id:'feeder',name:'FEEDER CORE',amount:100,effect:'HAMBRE -15%',accent:'#e2574c'}),
    care:Object.freeze({id:'care',name:'CARE DRONE',amount:180,effect:'ANIMO -15%',accent:'#f0a04b'}),
    yield:Object.freeze({id:'yield',name:'YIELD AMP',amount:250,effect:'VP +10%',accent:'#7ac74f'})
  });
  const MODULE_IDS = Object.freeze(Object.keys(MODULES));
  let normalizedFor = null;
  let migratedLegacy = false;

  const dockCanvas = document.getElementById('chain-dock-art');
  const dockCtx = dockCanvas.getContext('2d');
  const openButton = document.getElementById('vault-open');
  const socialLink = document.getElementById('social-x');

  function validLock(lock){
    return !!lock && typeof lock.uid==='string' && lock.uid.length<=96 &&
      !!MODULES[lock.module] && lock.amount===MODULES[lock.module].amount &&
      Number.isFinite(lock.lockedAt) && Number.isFinite(lock.unlockAt) &&
      lock.unlockAt>lock.lockedAt &&
      lock.unlockAt-lock.lockedAt===STONKGOTCHI_CONFIG.vaultLockMs;
  }

  function cleanLocks(rawLocks){
    const seen = new Set();
    const clean = [];
    for(const lock of Array.isArray(rawLocks)?rawLocks:[]){
      if(clean.length>=MODULE_IDS.length || !validLock(lock) || seen.has(lock.module)) continue;
      seen.add(lock.module);
      clean.push({uid:lock.uid,module:lock.module,amount:lock.amount,lockedAt:lock.lockedAt,unlockAt:lock.unlockAt});
    }
    return clean;
  }

  function readLegacyLocks(){
    if(migratedLegacy) return [];
    migratedLegacy = true;
    try{
      const parsed = JSON.parse(localStorage.getItem(LEGACY_KEY)||'null');
      return cleanLocks(parsed && parsed.locks);
    }catch(error){ return []; }
  }

  function state(){
    if(!G) return {version:1,locks:[]};
    if(normalizedFor===G && G.stockVault) return G.stockVault;
    let source = G.stockVault && G.stockVault.locks;
    const legacy = readLegacyLocks();
    if(!Array.isArray(source) || (source.length===0 && legacy.length)) source = legacy;
    G.stockVault = {version:1,locks:cleanLocks(source)};
    normalizedFor = G;
    try{ localStorage.removeItem(LEGACY_KEY); }catch(error){}
    saveGame();
    return G.stockVault;
  }

  function position(moduleId){
    return state().locks.find(lock=>lock.module===moduleId)||null;
  }

  function isActiveAt(moduleId,at){
    const lock = position(moduleId);
    return !!lock && Number.isFinite(at) && at>=lock.lockedAt && at<lock.unlockAt;
  }

  function isActive(moduleId){
    return isActiveAt(moduleId,Date.now());
  }

  function isClaimable(moduleId){
    const lock = position(moduleId);
    return !!lock && Date.now()>=lock.unlockAt;
  }

  function makeUid(moduleId){
    const random = globalThis.crypto && crypto.getRandomValues ?
      crypto.getRandomValues(new Uint32Array(1))[0].toString(36) :
      Math.random().toString(36).slice(2);
    return moduleId+'-'+Date.now().toString(36)+'-'+random;
  }

  function lockModule(moduleId){
    const module = MODULES[moduleId];
    if(!module || !G) return false;
    if(position(moduleId)){
      toast(isClaimable(moduleId)?'PRINCIPAL LISTO PARA CLAIM':'MODULO YA BLOQUEADO');
      return false;
    }
    if(state().locks.length>=MODULE_IDS.length){ toast('STOCKS VAULT COMPLETO'); return false; }
    if(G.motas<module.amount){ toast('FALTAN '+module.amount+' VP'); SFX.nope(); return false; }
    const lockedAt = Date.now();
    G.motas -= module.amount;
    state().locks.push({
      uid:makeUid(moduleId),module:moduleId,amount:module.amount,
      lockedAt,unlockAt:lockedAt+STONKGOTCHI_CONFIG.vaultLockMs
    });
    saveGame();
    SFX.buy(); vibrate(20);
    toast(module.name+' ACTIVO · 7 DIAS',2800);
    renderDock();
    return true;
  }

  function claimModule(moduleId){
    if(!G) return false;
    const locks = state().locks;
    const index = locks.findIndex(lock=>lock.module===moduleId);
    if(index<0) return false;
    const lock = locks[index];
    if(Date.now()<lock.unlockAt){ toast('POSICION AUN BLOQUEADA'); SFX.nope(); return false; }
    G.motas += lock.amount;
    locks.splice(index,1);
    saveGame();
    SFX.buy(); vibrate([20,30,45]);
    toast('PRINCIPAL RECUPERADO · '+lock.amount+' VP',3000);
    renderDock();
    return true;
  }

  function tapModule(moduleId){
    if(isClaimable(moduleId)) return claimModule(moduleId);
    if(position(moduleId)){ toast('ACTIVO HASTA EL DESBLOQUEO'); SFX.tap(); return false; }
    return lockModule(moduleId);
  }

  function remainingText(unlockAt){
    const totalMinutes = Math.max(0,Math.ceil((unlockAt-Date.now())/60000));
    const days = Math.floor(totalMinutes/1440);
    const hours = Math.floor((totalMinutes%1440)/60);
    if(days>0) return days+'D '+hours+'H';
    const minutes = totalMinutes%60;
    if(hours>0) return hours+'H '+minutes+'M';
    return minutes+'M';
  }

  function view(){
    return MODULE_IDS.map(id=>{
      const lock = position(id);
      return {
        id,name:MODULES[id].name,amount:MODULES[id].amount,effect:MODULES[id].effect,accent:MODULES[id].accent,
        lock:lock?{uid:lock.uid,lockedAt:lock.lockedAt,unlockAt:lock.unlockAt}:null,
        active:!!lock&&Date.now()<lock.unlockAt,
        claimable:!!lock&&Date.now()>=lock.unlockAt
      };
    });
  }

  function dockPx(x,y,w,h,col){ dockCtx.fillStyle=col; dockCtx.fillRect(x,y,w,h); }
  function dockCard(x,y,w,h,bg,accent){
    dockPx(x+1,y,w-2,h,bg); dockPx(x,y+1,w,h-2,bg);
    dockPx(x+1,y,w-2,1,'#1a1428'); dockPx(x+1,y+h-1,w-2,1,'#1a1428');
    dockPx(x,y+1,1,h-2,'#1a1428'); dockPx(x+w-1,y+1,1,h-2,'#1a1428');
    dockPx(x+1,y+1,w-2,1,'#fffaf0');
    if(accent) dockPx(x+2,y+h-3,w-4,2,accent);
  }
  function dockBnbMark(cx,cy){
    dockPx(cx,cy-3,3,3,'#ffd94a'); dockPx(cx-3,cy,3,3,'#ffd94a');
    dockPx(cx+3,cy,3,3,'#ffd94a'); dockPx(cx,cy+3,3,3,'#ffd94a');
    dockPx(cx+1,cy+1,1,1,'#1a1428');
  }
  function dockVaultIcon(x,y){
    dockPx(x,y,10,10,'#3b3552'); dockPx(x+1,y+1,8,8,'#f6efe0');
    dockPx(x+3,y+3,4,4,'#ffd94a'); dockPx(x+4,y+2,2,6,'#8a6a10'); dockPx(x+2,y+4,6,2,'#8a6a10');
  }
  function dockStatus(){
    const rows=view();
    const claim=rows.filter(row=>row.claimable).length;
    const active=rows.filter(row=>row.active).length;
    if(claim) return claim+' CLAIM';
    if(active) return active+' ACTIVO'+(active>1?'S':'');
    return '3 MODULOS LISTOS';
  }

  function renderDock(){
    const mobile=matchMedia('(max-width:760px)').matches;
    dockCanvas.width=122; dockCanvas.height=mobile?26:68;
    dockCtx.imageSmoothingEnabled=false;
    dockCtx.clearRect(0,0,dockCanvas.width,dockCanvas.height);
    if(mobile){
      dockCard(0,0,24,26,'#3b3552','#ffd94a'); dockBnbMark(10,10);
      dockCard(27,0,67,26,'#f6efe0','#f0a04b'); dockVaultIcon(31,5);
      drawTextAt(dockCtx,'STOCKS VAULT',44,5,'#1a1428',1);
      const compactStatus=dockStatus()==='3 MODULOS LISTOS'?'3 LISTOS':dockStatus();
      drawTextAt(dockCtx,compactStatus,44,14,'#8a6a10',1);
      dockCard(97,0,25,26,'#d0c8b0','#8a6ae8');
      drawTextAt(dockCtx,'X',106,6,'#3b3552',1); drawTextAt(dockCtx,'PRONTO',98,15,'#6f6878',1);
      return;
    }
    dockCard(0,0,122,20,'#3b3552','#ffd94a'); dockBnbMark(10,7);
    drawTextAt(dockCtx,'BNB CHAIN',21,4,'#ffe9a8',1); drawTextAt(dockCtx,'VAULT YARD',21,12,'#d8d4e8',1);
    dockCard(0,23,122,21,'#f6efe0','#f0a04b'); dockVaultIcon(6,28);
    drawTextAt(dockCtx,'STOCKS VAULT',22,27,'#1a1428',1); drawTextAt(dockCtx,dockStatus(),22,35,'#8a6a10',1);
    dockCard(0,47,122,21,'#d0c8b0','#8a6ae8');
    drawTextAt(dockCtx,'X',8,53,'#3b3552',1); drawTextAt(dockCtx,'X PRONTO',22,51,'#3b3552',1); drawTextAt(dockCtx,'CUENTA OFICIAL',22,59,'#6f6878',1);
  }

  function configureSocial(){
    const url=STONKGOTCHI_CONFIG.socialXUrl;
    if(typeof url==='string' && /^https:\/\/(x\.com|twitter\.com)\/[A-Za-z0-9_]+\/?$/i.test(url)){
      socialLink.href=url; socialLink.target='_blank'; socialLink.rel='noopener noreferrer';
      socialLink.removeAttribute('aria-disabled'); socialLink.removeAttribute('tabindex');
      socialLink.classList.remove('is-disabled'); socialLink.title='Abrir la cuenta oficial de STONKGOTCHI';
    }else socialLink.addEventListener('click',event=>event.preventDefault());
  }

  window.STONK_VAULT=Object.freeze({
    isActive,isActiveAt,isClaimable,position,view,tapModule,lockModule,claimModule,remainingText
  });

  openButton.addEventListener('click',()=>{
    if(!G) return;
    UI.mode='vault'; SFX.tap();
    if(!navigator.userActivation || navigator.userActivation.isActive) vibrate(10);
  });
  configureSocial(); renderDock();
  addEventListener('resize',renderDock,{passive:true});
  setInterval(renderDock,1000);
})();
