"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadEconomy(lock){
  const source = fs.readFileSync(path.join(__dirname,"..","src","game","economy.js"),"utf8");
  const relevantSource = source.split("function energyRate")[0];
  const context = vm.createContext({
    window:{STONK_VAULT:{position:moduleId=>lock&&lock.module===moduleId?lock:null}},
    Date,
    Math
  });
  vm.runInContext(relevantSource,context,{filename:"src/game/economy.js"});
  return (moduleId,startAt,endAt,activeMultiplier)=>
    vm.runInContext(`vaultWindowMultiplier(${JSON.stringify(moduleId)},${startAt},${endAt},${activeMultiplier})`,context);
}

test("Vault multiplier uses the exact active fraction inside an offline window",()=>{
  const multiplier=loadEconomy({module:"feeder",lockedAt:1000,unlockAt:2000});

  assert.equal(multiplier("feeder",900,1100,0.85),0.925);
  assert.equal(multiplier("feeder",1500,2500,0.85),0.925);
  assert.equal(multiplier("feeder",1000,2000,0.85),0.85);
  assert.equal(multiplier("feeder",2000,3000,0.85),1);
  assert.equal(multiplier("yield",1000,2000,1.10),1);
  assert.equal(multiplier("feeder",1000,1000,0.85),1);
});

test("Yield bonus is prorated across the exact unlock boundary",()=>{
  const multiplier=loadEconomy({module:"yield",lockedAt:1000,unlockAt:2000});
  assert.equal(multiplier("yield",1500,2500,1.10),1.05);
});

function runOffline(moduleId){
  const economySource = fs.readFileSync(path.join(__dirname,"..","src","game","economy.js"),"utf8");
  const offlineSource = fs.readFileSync(path.join(__dirname,"..","src","game","offline.js"),"utf8");
  const now=1_900_000_000_000, elapsed=60*60*1000, lockDuration=7*24*60*60*1000;
  const amounts={feeder:100,care:180,yield:250};
  const activeMs=elapsed/2+30*1000;
  const lock=moduleId?{
    uid:"partial-"+moduleId,module:moduleId,amount:amounts[moduleId],
    lockedAt:now-elapsed+activeMs-lockDuration,unlockAt:now-elapsed+activeMs
  }:null;
  const pet={
    stage:3,exped:null,sleeping:true,energy:0,hunger:100,happy:100,
    hygiene:100,weight:10,level:8,xp:0,xpAcc:0,sick:false,zone:"prado",
    hungerZeroSince:null,line:"pradera",trait:""
  };
  const G={
    pets:[pet],sel:0,motas:0,totalMotas:0,poops:[],up:{comedero:0},
    stockVault:{version:1,locks:lock?[lock]:[]}
  };
  const context=vm.createContext({
    window:{STONK_VAULT:{
      position:id=>lock&&lock.module===id?lock:null,
      isActiveAt:(id,at)=>!!lock&&lock.module===id&&at>=lock.lockedAt&&at<lock.unlockAt
    }},
    Date:{now:()=>now},Math,Number,
    OFFLINE_CAP:14*60*60*1000,STAGES:{EGG:0,BABY:1,CHILD:2,ADULT:3},
    G,COST_MEAL:5,EVO_LEVEL:{child:3,adult:6},XP_TRICKLE_MS:0,
    RUNAWAY_AFTER:14*60*60*1000,LINES:{pradera:{names:{adultA:"PET"}}},
    resolveExpedition:()=>{},sleepRegen:()=>0,energyRate:()=>0,poopEvery:()=>Infinity,
    xpNeed:()=>Infinity,petRate:()=>1,hygMult:()=>1,toast:()=>{},spawnEgg:()=>{},
    checkEvolution:()=>{}
  });
  vm.runInContext(economySource.split("function petName")[0],context,{filename:"src/game/economy.js"});
  vm.runInContext("hungerBaseRate=()=>1/600000; happyDecayBaseRate=()=>1/600000; ratePerMs=()=>0;",context);
  vm.runInContext(offlineSource,context,{filename:"src/game/offline.js"});
  vm.runInContext(`applyElapsed(${elapsed})`,context);
  return {
    hungerLoss:100-pet.hunger,
    happyLoss:100-pet.happy,
    gain:vm.runInContext("offlineReport.motas",context)
  };
}

function closeTo(actual,expected){
  assert.ok(Math.abs(actual-expected)<1e-12,`${actual} != ${expected}`);
}

test("applyElapsed prorates every Vault effect across an internal unlock boundary",()=>{
  const base=runOffline(null);
  const feeder=runOffline("feeder");
  const care=runOffline("care");
  const yieldResult=runOffline("yield");

  const activeFraction=(30*60+30)/(60*60);
  closeTo(feeder.hungerLoss/base.hungerLoss,1-0.15*activeFraction);
  closeTo(care.happyLoss/base.happyLoss,1-0.15*activeFraction);
  closeTo(yieldResult.gain/base.gain,1+0.10*activeFraction);
});
