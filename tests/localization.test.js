"use strict";

const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");

function loadLocalization(stored=null){
  const generatedSource=fs.readFileSync(path.join(__dirname,"..","src","localization.generated.js"),"utf8");
  const source=fs.readFileSync(path.join(__dirname,"..","src","localization.js"),"utf8");
  const attrs={};
  const nodes=new Map();
  for(const id of ["entry-gate","entry-loading","profile-name","profile-help","entry-play","language-toggle","social-x"]){
    nodes.set(id,{setAttribute:(key,value)=>{attrs[id+":"+key]=value;},textContent:"",placeholder:""});
  }
  const label={textContent:""};
  let saved=stored;
  const document={
    documentElement:{lang:""},
    getElementById:id=>nodes.get(id)||null,
    querySelector:selector=>selector==='label[for="profile-name"]'?label:null,
    createElement:()=>({getContext:()=>({font:"",measureText:text=>({width:Array.from(text).length*7.25})})})
  };
  const context=vm.createContext({
    window:{},document,
    localStorage:{getItem:()=>saved,setItem:(_key,value)=>{saved=value;}},
    dispatchEvent:()=>{},CustomEvent:function(type,options){this.type=type;this.detail=options.detail;}
  });
  vm.runInContext(generatedSource,context,{filename:"src/localization.generated.js"});
  vm.runInContext(source,context,{filename:"src/localization.js"});
  return {i18n:context.window.STONK_I18N,context,document,nodes,label,attrs,get saved(){return saved;}};
}

test("Chinese is the default and the dock toggle persists English",()=>{
  const app=loadLocalization();
  assert.equal(app.i18n.locale,"zh-CN");
  assert.equal(app.document.documentElement.lang,"zh-CN");
  assert.equal(app.i18n.translate("PREPARANDO EL MUNDO"),"正在准备世界");
  assert.equal(app.i18n.logicalWidth("PREPARANDO EL MUNDO"),44);
  assert.equal(app.i18n.translate("TOCA FUERA PARA SALIR"),"点击外部退出");
  assert.equal(app.i18n.translate("SIMON"),"SIMON");
  assert.equal(app.i18n.translate("¡HA NACIDO!"),"宠物诞生了！");
  assert.notEqual(app.i18n.translate("CARGANDO..."),"CARGANDO...");
  assert.notEqual(app.i18n.translate("¡VICTORIA!"),"¡VICTORIA!");
  app.context.G={profileName:"ASTRO",pets:[{nick:"MIRU"}]};
  assert.doesNotMatch(app.i18n.translate("MIRU SE CURO CON LA MEDICINA"),/[A-Z]{3,}(?:\s+[A-Z]{3,})/);
  app.context.G.pets[0].nick="VICTORIA";
  assert.equal(app.i18n.translate("ASTRO"),"ASTRO");
  assert.equal(app.i18n.translate("VICTORIA"),"VICTORIA");
  assert.match(app.i18n.translate("DESTINO PARA ASTRO"),/ASTRO/);
  assert.match(app.i18n.translate("¡DUELO: VICTORIA!"),/VICTORIA/);
  app.context.G.pets[0].nick="TOCA";
  assert.equal(app.i18n.translate("TOCA JUSTO ANTES DEL GOLPE"),"攻击命中前点击");
  app.i18n.toggle();
  assert.equal(app.i18n.locale,"en");
  assert.equal(app.saved,"en");
  assert.equal(app.document.documentElement.lang,"en");
  assert.equal(app.i18n.translate("PREPARANDO EL MUNDO"),"PREPARING THE WORLD");
  assert.equal(app.attrs["language-toggle:aria-label"],"Switch to Chinese");
});

test("official X control is a secure link to StonkGotchi",()=>{
  const html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
  assert.match(html,/id="social-x"[^>]+href="https:\/\/x\.com\/StonkGotchi"/);
  assert.match(html,/id="social-x"[^>]+target="_blank"/);
  assert.match(html,/id="social-x"[^>]+rel="noopener noreferrer"/);
  assert.match(html,/id="language-toggle"/);
  assert.doesNotMatch(html,/id="vault-open"/);
  assert.doesNotMatch(html,/PERFIL LOCAL|ONCHAIN \/ DB POR DEFINIR/);
});
