"use strict";
/* STONKGOTCHI bilingual UI. English is the default; the dock toggles Chinese. */
(function initLocalization(){
  const STORAGE_KEY='stonkgotchi-language-v1';
  const DEFAULT_LOCALE='en';

  const EN=[
    ['ABRACE AL RIVAL!','HUG YOUR OPPONENT!'],['O DESLIZA PARA ESQUIVAR','OR SWIPE TO DODGE'],['¡QUE NO TOQUE EL SUELO!','KEEP IT OFF THE GROUND!'],['¡REPETE LA SECUENCIA!','REPEAT THE SEQUENCE!'],['TOCA CON LA AGUJA EN LO DORADO','TAP WHEN THE NEEDLE IS GOLD'],['CLAVADO AL IMPACTO: ¡PARADA!','TAP ON IMPACT: STOP!'],
    ['JEFE: CARGA CADA 3 TURNOS','BOSS: CHARGES EVERY 3 TURNS'],['JEFE: ESPORAS TE ACELERAN','BOSS: SPORES SPEED YOU UP'],['SU CHISPAZO TE RALENTIZA','ITS SPARK SLOWS YOU DOWN'],
    ['ACARICIALO: TOCA A TU BITXO','PET IT: TAP YOUR PET'],['EN BRAZOS: TOCA EL SUELO PARA DEJARLO','CARRYING: TAP THE GROUND TO PUT IT DOWN'],
    ['TOCA JUSTO ANTES DEL GOLPE','TAP JUST BEFORE THE HIT'],['¡¡BLOQUEA: TOCA YA!!','BLOCK: TAP NOW!'],['TOCA CUANDO PIQUE','TAP WHEN THE FISH BITES'],['¡TOCA CUANDO EL ARO','TAP WHEN THE RING'],
    ['TOCA PARA MOVERTE','TAP TO MOVE'],['TOCA PARA PONER O QUITAR','TAP TO EQUIP OR REMOVE'],['TOCA PARA SALTAR','TAP TO JUMP'],['TOCA PARA SALIR','TAP TO EXIT'],['TOCA UNA LINEA: SU ARBOL','TAP A LINE: ITS TREE'],['TOCA: TENSION EN VERDE','TAP IN THE GREEN ZONE'],
    ['¡TOCA AL SALVAJE PARA LUCHAR!','TAP THE WILD CREATURE TO FIGHT!'],['¡TOCA CON LA AGUJA EN LO DORADO!','TAP WHEN THE NEEDLE IS GOLD!'],['¡TOCA LOS VAULT POINTS!','TAP THE VAULT POINTS!'],['¡TOCA!','TAP!'],
    ['¿QUE LE PASA A ','WHAT IS HAPPENING TO '],['¡VICTORIA!','VICTORY!'],['DERROTA...','DEFEAT...'],['CARGANDO...','LOADING...'],['TOCA CUANDO LLEGUE','TAP WHEN IT ARRIVES'],
    ['¡HA NACIDO!','IT WAS BORN!'],['TOCA PARA CUIDARLO','TAP TO CARE FOR IT'],['CARACTER:','TRAIT:'],['LINEA ','LINE '],
    ['COME MAS Y MEJOR','EATS MORE AND BETTER'],['PEGA UN 25% MAS','DEALS 25% MORE DAMAGE'],['DUERME DE LUJO','SLEEPS EXCELLENTLY'],['GANA MAS XP JUGANDO','EARNS MORE XP PLAYING'],['VP EN CALMA','VP WHILE CALM'],['APRENDE X2 DE CHISPAS','LEARNS X2 FROM SPARKS'],
    ['PRADERA','MEADOW'],['BRASA','EMBER'],['MAREA','TIDE'],['FUNGO','FUNGUS'],['PETREA','STONE'],['VOLTIO','VOLT'],['ASTRO','ASTRAL'],['CURIOSO','CURIOUS'],['GLOTON','GLUTTON'],['VALIENTE','BRAVE'],['DORMILON','SLEEPY'],['JUGUETON','PLAYFUL'],['TIMIDO','SHY'],
    ['TOKENIZED STOCKS PET WORLD','TOKENIZED STOCKS PET WORLD'],['PREPARANDO EL MUNDO','PREPARING THE WORLD'],['REUNIENDO MASCOTAS Y PAISAJE','GATHERING PETS AND SCENERY'],
    ['NOMBRE DE PERFIL','PROFILE NAME'],['ESCRIBE TU NOMBRE','ENTER YOUR NAME'],['USA ENTRE 2 Y 16 CARACTERES','USE 2 TO 16 CHARACTERS'],['JUGAR','PLAY'],
    ['TOCA FUERA PARA SALIR','TAP OUTSIDE TO EXIT'],['TOCA PARA VOLVER','TAP TO RETURN'],['TOCA PARA SEGUIR','TAP TO CONTINUE'],['TOCA UN MODULO','TAP A MODULE'],['TOCA PARA BLOQUEAR','TAP TO LOCK'],['TOCA PARA RECUPERAR PRINCIPAL','TAP TO CLAIM PRINCIPAL'],
    ['SIMULACION LOCAL - SIN WALLET','LOCAL SIMULATION - NO WALLET'],['SIN FONDOS REALES NI CONTRATOS','NO REAL FUNDS OR CONTRACTS'],['PRINCIPAL COMPLETO AL VENCER','FULL PRINCIPAL AT MATURITY'],['PROXIMAMENTE','COMING SOON'],
    ['MIENTRAS NO ESTABAS','WHILE YOU WERE AWAY'],['VERSION NUEVA: TOCA','NEW VERSION: TAP'],['AUN ES UN HUEVO','STILL AN EGG'],['ESTA DE EXPEDICION','AWAY ON EXPEDITION'],['SHHH... DUERME','SHHH... SLEEPING'],
    ['NO TIENE HAMBRE','NOT HUNGRY'],['TODO LIMPIO','ALL CLEAN'],['SIN ENERGIA','NO ENERGY'],['FALTAN VAULT POINTS','NEED MORE VAULT POINTS'],['FALTAN VP','NEED MORE VP'],['YA LO TIENES','ALREADY OWNED'],
    ['STOCKS VAULT COMPLETO','STOCKS VAULT FULL'],['PRINCIPAL LISTO PARA CLAIM','PRINCIPAL READY TO CLAIM'],['MODULO YA BLOQUEADO','MODULE ALREADY LOCKED'],['POSICION AUN BLOQUEADA','POSITION STILL LOCKED'],['PRINCIPAL RECUPERADO','PRINCIPAL CLAIMED'],['PRINCIPAL BLOQUEADO','PRINCIPAL LOCKED'],['ACTIVO HASTA EL DESBLOQUEO','ACTIVE UNTIL UNLOCK'],
    ['VAULT MARKET','VAULT MARKET'],['VAULT TOWER','VAULT TOWER'],['VAULT YARD LOG','VAULT YARD LOG'],['VAULT YARD','VAULT YARD'],['STOCKS VAULT','STOCKS VAULT'],['BNB CHAIN','BNB CHAIN'],
    ['PERSONALIZA TU VAULT YARD','CUSTOMIZE YOUR VAULT YARD'],['LOCK 7 DIAS','LOCK 7 DAYS'],['3 MODULOS LISTOS','3 MODULES READY'],['MODULOS LISTOS','MODULES READY'],['CUENTA OFICIAL','OFFICIAL ACCOUNT'],
    ['¿ASCENDER A ','ASCEND TO '],['SE CONVERTIRA EN','WILL BECOME'],['ESTRELLA ETERNA','ETERNAL STAR'],['SE VA, LO DEMAS SE QUEDA','IT LEAVES; ALL ELSE STAYS'],
    ['¿ABRIR EL PARQUE?','OPEN THE PARK?'],['¿ABRIR LA HUERTA?','OPEN THE GARDEN?'],['LOS JUGUETES DE JUGAR','PLAY TOYS'],['SE MUDAN ALLI','MOVE THERE'],['¿QUIEN VIENE?','WHO IS COMING?'],['VOY YO SOLO','I WILL GO ALONE'],
    ['DESPENSA','PANTRY'],['¿QUE HACEIS?','WHAT SHALL WE DO?'],['PREMIOS Y RECORDS','PRIZES AND RECORDS'],['TESOROS LEJANOS','DISTANT TREASURES'],['RETO DE 5 PISOS','5-FLOOR CHALLENGE'],
    ['5 COMBATES SEGUIDOS','5 BATTLES IN A ROW'],['LA VIDA NO SE CURA','HP DOES NOT HEAL'],['SOLO UN RESPIRO','ONLY A SHORT REST'],['ENTRE PISOS','BETWEEN FLOORS'],['PISO 3: VAULT POINTS','FLOOR 3: VAULT POINTS'],['PISO 5: RELIQUIA','FLOOR 5: RELIC'],['Y EL LAUREL','AND THE LAUREL'],['VIDA COMPLETA','FULL HP'],['SI PIERDES','IF YOU LOSE'],['ESTAS FUERA','YOU ARE OUT'],
    ['AUN NADIE HA ASCENDIDO','NO ONE HAS ASCENDED YET'],['CRIA UN ADULTO AL NIVEL 8','RAISE AN ADULT TO LEVEL 8'],['SU LUZ GUIA A LOS QUE VIENEN','THEIR LIGHT GUIDES THE NEXT'],
    ['SALA DE JUEGOS','GAME ROOM'],['LOS JUEGOS TAMBIEN ENTRENAN','GAMES ALSO TRAIN'],['DESTINO PARA ','DESTINATION FOR '],['VIAJE TRANQUILO','PEACEFUL TRIP'],['EXPLORA Y VENCE JEFES','EXPLORE AND DEFEAT BOSSES'],
    ['COMIO SOLO','ATE AUTOMATICALLY'],['CRECIO','GREW'],['CACAS NUEVAS','NEW POOPS'],['EVOLUCION A LA VISTA','EVOLUTION IN SIGHT'],['DIARIAS NUEVAS CADA DIA','NEW DAILIES EVERY DAY'],
    ['EL BUHONERO','THE PEDDLER'],['RAREZAS DE PASO','TRAVELING RARITIES'],['SE VA EN','LEAVES IN'],['ELIGE DISCO Y A BAILAR','CHOOSE A RECORD AND DANCE'],['TOCA ♥ PARA OIRLO ANTES','TAP ♥ TO PREVIEW'],
    ['UN SECRETO POR DESCUBRIR','A SECRET TO DISCOVER'],['TU BITXO','YOUR PET'],['TOCA FORMAS · < > CAMBIA LINEA','TAP FORMS · < > CHANGE LINE'],['SIN NOMBRE (ESPECIE)','NO NAME (SPECIES)'],['MAX 8 LETRAS','MAX 8 LETTERS'],['TOCA FUERA PARA CANCELAR','TAP OUTSIDE TO CANCEL'],
    ['AUN NO HAY RECUERDOS','NO MEMORIES YET'],['VIVE Y SE ESCRIBIRAN SOLOS','LIVE AND THEY WILL WRITE THEMSELVES'],['NADIE ENFERMO','NO ONE IS SICK'],['¡LO CURA!','HEALS THEM!'],
    ['HUEVO','EGG'],['BEBE','BABY'],['JOVEN','YOUNG'],['ADULTO','ADULT'],['ETAPA','STAGE'],['CARACTER','TRAIT'],['EDAD','AGE'],['NIVEL','LEVEL'],['PESO','WEIGHT'],['JUEGOS','GAMES'],['FALLOS','MISTAKES'],['AMISTAD','FRIENDSHIP'],['TOTALES','TOTAL'],['ESTRELLAS','STARS'],
    ['HAMBRE','HUNGER'],['ANIMO','MOOD'],['PILAS','ENERGY'],['LIMPIO','CLEAN'],['COMER','FEED'],['LIMPIAR','CLEAN'],['LUZ','LIGHT'],['DATOS','STATS'],['MEJORA','UPGRADE'],['JUGUETE','TOY'],['JUGUETES','TOYS'],['GORROS','HATS'],['BASE','BASE'],
    ['ALBUM','ALBUM'],['LOGRO','ACHIEVEMENT'],['LOGROS','ACHIEVEMENTS'],['RELIQ','RELICS'],['RELIQUIAS','RELICS'],['BESTIA','BEASTS'],['BESTIARIO','BESTIARY'],['DIARIO','JOURNAL'],['MISIONES','MISSIONS'],['SEMANAL','WEEKLY'],
    ['ASCENDER','ASCEND'],['ASCENSO','ASCENSION'],['EVOLUCIONA','EVOLVES'],['ECLOSIONA','HATCHES'],['CRECERA','WILL GROW'],['TEN PACIENCIA','BE PATIENT'],['RUMBO','HEADING'],['COPIA','COPY'],['CARGA','LOAD'],['FOTO','PHOTO'],['ARO','RING'],
    ['TUYO','OWNED'],['PUESTO','EQUIPPED'],['COMPRAR','BUY'],['VENDIDO','SOLD'],['HECHA','DONE'],['COBRAR','CLAIM'],['ACTIVO','ACTIVE'],['LISTOS','READY'],['PRONTO','SOON'],['BAILAR','DANCE'],['RECORD','RECORD'],['SIN REC','NO RECORD'],
    ['EXPEDICION','EXPEDITION'],['EXPLORACION','EXPLORATION'],['COMBATES','BATTLES'],['COMBATE','BATTLE'],['ENTRENA','TRAIN'],['FUERZA','STRENGTH'],['DEFENSA','DEFENSE'],['VELOCIDAD','SPEED'],['MEDICINA','MEDICINE'],['DINASTIA','DYNASTY'],['BAUTIZO','NAMING'],
    ['PRADO','MEADOW'],['PARQUE','PARK'],['HUERTA','GARDEN'],['SENDERO','PATH'],['TORRE','TOWER'],['PISO','FLOOR'],['VIDA','HP'],['ENTRAR','ENTER'],['RENDIRSE','GIVE UP'],['ABRE EN','OPENS IN'],['DIAS','DAYS'],['DIA','DAY'],
    ['AUN NO','NOT YET'],['SI','YES'],['NO','NO'],['MAS','MORE'],['PARA','FOR'],['FUERA','OUTSIDE'],['NUEVO','NEW'],['ABIERTO','OPEN'],['ABIERTA','OPEN'],['CUESTA','COST'],['FALTAN','NEED'],['TODO','ALL'],['NADIE','NO ONE'],['SOLO','ALONE']
  ];

  const ZH=[
    ['ABRACE AL RIVAL!','拥抱对手！'],['O DESLIZA PARA ESQUIVAR','或滑动躲避'],['¡QUE NO TOQUE EL SUELO!','不要让它落地！'],['¡REPETE LA SECUENCIA!','重复刚才的顺序！'],['TOCA CON LA AGUJA EN LO DORADO','指针进入金色区域时点击'],['CLAVADO AL IMPACTO: ¡PARADA!','命中瞬间点击：停！'],
    ['JEFE: CARGA CADA 3 TURNOS','首领每3回合蓄力一次'],['JEFE: ESPORAS TE ACELERAN','首领的孢子会让你加速'],['SU CHISPAZO TE RALENTIZA','它的电击会让你减速'],
    ['ACARICIALO: TOCA A TU BITXO','点击宠物来抚摸它'],['EN BRAZOS: TOCA EL SUELO PARA DEJARLO','抱起中：点击地面放下'],
    ['TOCA JUSTO ANTES DEL GOLPE','攻击命中前点击'],['¡¡BLOQUEA: TOCA YA!!','格挡：立即点击！'],['TOCA CUANDO PIQUE','鱼儿咬钩时点击'],['¡TOCA CUANDO EL ARO','圆环到位时点击'],
    ['TOCA PARA MOVERTE','点击移动'],['TOCA PARA PONER O QUITAR','点击装备或取下'],['TOCA PARA SALTAR','点击跳跃'],['TOCA PARA SALIR','点击退出'],['TOCA UNA LINEA: SU ARBOL','点击谱系查看进化树'],['TOCA: TENSION EN VERDE','指针进入绿色区域时点击'],
    ['¡TOCA AL SALVAJE PARA LUCHAR!','点击野生怪物开始战斗！'],['¡TOCA CON LA AGUJA EN LO DORADO!','指针进入金色区域时点击！'],['¡TOCA LOS VAULT POINTS!','点击金库点数！'],['¡TOCA!','点击！'],
    ['¿QUE LE PASA A ','发生了什么：'],['¡VICTORIA!','胜利！'],['DERROTA...','战败……'],['CARGANDO...','加载中……'],['TOCA CUANDO LLEGUE','到达时点击'],
    ['¡HA NACIDO!','宠物诞生了！'],['TOCA PARA CUIDARLO','点击开始照顾它'],['CARACTER:','性格：'],['LINEA ','谱系：'],
    ['COME MAS Y MEJOR','吃得更多，成长更快'],['PEGA UN 25% MAS','攻击伤害提高25%'],['DUERME DE LUJO','睡眠恢复效果更好'],['GANA MAS XP JUGANDO','游戏获得更多经验'],['VP EN CALMA','平静时获得更多VP'],['APRENDE X2 DE CHISPAS','从火花获得双倍成长'],
    ['PRADERA','草原系'],['BRASA','火焰系'],['MAREA','潮汐系'],['FUNGO','菌菇系'],['PETREA','岩石系'],['VOLTIO','雷电系'],['ASTRO','星辰系'],['CURIOSO','好奇'],['GLOTON','贪吃'],['VALIENTE','勇敢'],['DORMILON','爱睡'],['JUGUETON','爱玩'],['TIMIDO','害羞'],
    ['TOKENIZED STOCKS PET WORLD','代币化股票宠物世界'],['PREPARANDO EL MUNDO','正在准备世界'],['REUNIENDO MASCOTAS Y PAISAJE','正在召集宠物与场景'],
    ['NOMBRE DE PERFIL','玩家名称'],['ESCRIBE TU NOMBRE','输入你的名字'],['USA ENTRE 2 Y 16 CARACTERES','请输入2至16个字符'],['JUGAR','开始游戏'],
    ['TOCA FUERA PARA SALIR','点击外部退出'],['TOCA PARA VOLVER','点击返回'],['TOCA PARA SEGUIR','点击继续'],['TOCA UN MODULO','点击一个模块'],['TOCA PARA BLOQUEAR','点击锁定'],['TOCA PARA RECUPERAR PRINCIPAL','点击取回本金'],
    ['SIMULACION LOCAL - SIN WALLET','本地模拟 · 无需钱包'],['SIN FONDOS REALES NI CONTRATOS','无真实资金或合约'],['PRINCIPAL COMPLETO AL VENCER','到期返还全部本金'],['PROXIMAMENTE','即将推出'],
    ['MIENTRAS NO ESTABAS','离线期间'],['VERSION NUEVA: TOCA','发现新版本：点击更新'],['AUN ES UN HUEVO','它还是一颗蛋'],['ESTA DE EXPEDICION','正在远征'],['SHHH... DUERME','嘘……正在睡觉'],
    ['NO TIENE HAMBRE','现在不饿'],['TODO LIMPIO','已经很干净'],['SIN ENERGIA','能量不足'],['FALTAN VAULT POINTS','金库点数不足'],['FALTAN VP','VP不足'],['YA LO TIENES','已经拥有'],
    ['STOCKS VAULT COMPLETO','股票金库已满'],['PRINCIPAL LISTO PARA CLAIM','本金可领取'],['MODULO YA BLOQUEADO','模块已锁定'],['POSICION AUN BLOQUEADA','仓位仍在锁定'],['PRINCIPAL RECUPERADO','本金已取回'],['PRINCIPAL BLOQUEADO','本金已锁定'],['ACTIVO HASTA EL DESBLOQUEO','解锁前持续生效'],
    ['VAULT MARKET','金库市场'],['VAULT TOWER','金库之塔'],['VAULT YARD LOG','金库庭院日志'],['VAULT YARD','金库庭院'],['STOCKS VAULT','股票金库'],['BNB CHAIN','BNB链'],
    ['PERSONALIZA TU VAULT YARD','装饰你的金库庭院'],['LOCK 7 DIAS','锁定7天'],['3 MODULOS LISTOS','3个模块可用'],['MODULOS LISTOS','模块可用'],['CUENTA OFICIAL','官方账号'],
    ['¿ASCENDER A ','进阶为'],['SE CONVERTIRA EN','将化为'],['ESTRELLA ETERNA','永恒之星'],['SE VA, LO DEMAS SE QUEDA','宠物离开，其他内容保留'],
    ['¿ABRIR EL PARQUE?','开启公园？'],['¿ABRIR LA HUERTA?','开启花园？'],['LOS JUGUETES DE JUGAR','玩耍类玩具'],['SE MUDAN ALLI','将搬到那里'],['¿QUIEN VIENE?','谁要同行？'],['VOY YO SOLO','我独自前往'],
    ['DESPENSA','食品仓'],['¿QUE HACEIS?','要做什么？'],['PREMIOS Y RECORDS','奖励与纪录'],['TESOROS LEJANOS','远方宝藏'],['RETO DE 5 PISOS','五层挑战'],
    ['5 COMBATES SEGUIDOS','连续五场战斗'],['LA VIDA NO SE CURA','生命不会自动恢复'],['SOLO UN RESPIRO','只有短暂休息'],['ENTRE PISOS','每层之间'],['PISO 3: VAULT POINTS','第3层：金库点数'],['PISO 5: RELIQUIA','第5层：遗物'],['Y EL LAUREL','以及桂冠'],['VIDA COMPLETA','生命值全满'],['SI PIERDES','如果失败'],['ESTAS FUERA','挑战结束'],
    ['AUN NADIE HA ASCENDIDO','还没有宠物完成进阶'],['CRIA UN ADULTO AL NIVEL 8','把成年宠物培养到8级'],['SU LUZ GUIA A LOS QUE VIENEN','它们的光芒指引后来者'],
    ['SALA DE JUEGOS','游戏室'],['LOS JUEGOS TAMBIEN ENTRENAN','小游戏也能训练属性'],['DESTINO PARA ','远征目的地：'],['VIAJE TRANQUILO','轻松旅程'],['EXPLORA Y VENCE JEFES','探索并击败首领'],
    ['COMIO SOLO','自动进食'],['CRECIO','成长'],['CACAS NUEVAS','新增便便'],['EVOLUCION A LA VISTA','即将进化'],['DIARIAS NUEVAS CADA DIA','每日刷新任务'],
    ['EL BUHONERO','旅行商人'],['RAREZAS DE PASO','旅途中的稀有物品'],['SE VA EN','离开倒计时'],['ELIGE DISCO Y A BAILAR','选择唱片开始跳舞'],['TOCA ♥ PARA OIRLO ANTES','点击♥试听'],
    ['UN SECRETO POR DESCUBRIR','等待发现的秘密'],['TU BITXO','你的宠物'],['TOCA FORMAS · < > CAMBIA LINEA','点击形态 · < > 切换谱系'],['SIN NOMBRE (ESPECIE)','未命名（物种名）'],['MAX 8 LETRAS','最多8个字母'],['TOCA FUERA PARA CANCELAR','点击外部取消'],
    ['AUN NO HAY RECUERDOS','还没有回忆'],['VIVE Y SE ESCRIBIRAN SOLOS','一起生活，故事会自行记录'],['NADIE ENFERMO','没有宠物生病'],['¡LO CURA!','可以治愈！'],
    ['HUEVO','蛋'],['BEBE','幼体'],['JOVEN','青年'],['ADULTO','成年'],['ETAPA','阶段'],['CARACTER','性格'],['EDAD','年龄'],['NIVEL','等级'],['PESO','体重'],['JUEGOS','游戏'],['FALLOS','失误'],['AMISTAD','亲密度'],['TOTALES','总计'],['ESTRELLAS','星星'],
    ['HAMBRE','饱食'],['ANIMO','心情'],['PILAS','能量'],['LIMPIO','清洁'],['COMER','喂食'],['LIMPIAR','清理'],['LUZ','灯光'],['DATOS','资料'],['MEJORA','升级'],['JUGUETE','玩具'],['JUGUETES','玩具'],['GORROS','帽子'],['BASE','基地'],
    ['ALBUM','图鉴'],['LOGRO','成就'],['LOGROS','成就'],['RELIQ','遗物'],['RELIQUIAS','遗物'],['BESTIA','野兽'],['BESTIARIO','怪物图鉴'],['DIARIO','日志'],['MISIONES','任务'],['SEMANAL','每周任务'],
    ['ASCENDER','进阶'],['ASCENSO','进阶'],['EVOLUCIONA','进化'],['ECLOSIONA','孵化'],['CRECERA','将会成长'],['TEN PACIENCIA','请耐心等待'],['RUMBO','目标'],['COPIA','备份'],['CARGA','载入'],['FOTO','照片'],['ARO','光环'],
    ['TUYO','已拥有'],['PUESTO','已装备'],['COMPRAR','购买'],['VENDIDO','已售出'],['HECHA','已完成'],['COBRAR','领取'],['ACTIVO','生效中'],['LISTOS','可用'],['PRONTO','即将开放'],['BAILAR','跳舞'],['RECORD','纪录'],['SIN REC','暂无纪录'],
    ['EXPEDICION','远征'],['EXPLORACION','探索'],['COMBATES','战斗'],['COMBATE','战斗'],['ENTRENA','训练'],['FUERZA','力量'],['DEFENSA','防御'],['VELOCIDAD','速度'],['MEDICINA','药品'],['DINASTIA','王朝'],['BAUTIZO','命名'],
    ['PRADO','草原'],['PARQUE','公园'],['HUERTA','花园'],['SENDERO','小径'],['TORRE','高塔'],['PISO','层'],['VIDA','生命'],['ENTRAR','进入'],['RENDIRSE','放弃'],['ABRE EN','开放倒计时'],['DIAS','天'],['DIA','天'],
    ['AUN NO','暂时不'],['SI','是'],['NO','否'],['MAS','更多'],['PARA','用于'],['FUERA','外部'],['NUEVO','新'],['ABIERTO','已开放'],['ABIERTA','已开放'],['CUESTA','花费'],['FALTAN','还需'],['TODO','全部'],['NADIE','没有人'],['SOLO','独自']
  ];

  function normalizeLocale(value){ return value==='zh-CN'?'zh-CN':'en'; }
  let locale=DEFAULT_LOCALE;
  try{ locale=normalizeLocale(localStorage.getItem(STORAGE_KEY)); }catch(error){}

  const CURATED={
    en:EN.slice().sort((a,b)=>b[0].length-a[0].length),
    zh:ZH.slice().sort((a,b)=>b[0].length-a[0].length)
  };
  const GENERATED={
    en:Object.entries((window.STONK_AUTO_TRANSLATIONS&&window.STONK_AUTO_TRANSLATIONS.en)||{}).sort((a,b)=>b[0].length-a[0].length),
    zh:Object.entries((window.STONK_AUTO_TRANSLATIONS&&window.STONK_AUTO_TRANSLATIONS.zh)||{}).sort((a,b)=>b[0].length-a[0].length)
  };
  const CURATED_MAP={en:new Map(EN),zh:new Map(ZH)};
  const GENERATED_MAP={
    en:new Map(Object.entries((window.STONK_AUTO_TRANSLATIONS&&window.STONK_AUTO_TRANSLATIONS.en)||{})),
    zh:new Map(Object.entries((window.STONK_AUTO_TRANSLATIONS&&window.STONK_AUTO_TRANSLATIONS.zh)||{}))
  };
  const CACHE={en:new Map(),zh:new Map()};
  function replacePairs(source,pairs){
    let out=source;
    for(const pair of pairs){
      if(/^[A-ZÁÉÍÓÚÜÑ]+$/.test(pair[0])){
        const escaped=pair[0].replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
        out=out.replace(new RegExp('\\b'+escaped+'\\b','g'),pair[1]);
      }else out=out.split(pair[0]).join(pair[1]);
    }
    return out;
  }
  function translate(value){
    let out=String(value==null?'':value);
    const protectedValues=[];
    try{
      if(typeof G!=='undefined'&&G){
        if(G.profileName) protectedValues.push(String(G.profileName));
        if(Array.isArray(G.pets)) G.pets.forEach(p=>{ if(p&&p.nick) protectedValues.push(String(p.nick)); });
      }
    }catch(error){}
    if(protectedValues.includes(out)) return out;
    const localeKey=locale==='en'?'en':'zh';
    if(CURATED_MAP[localeKey].has(out)) return CURATED_MAP[localeKey].get(out);
    if(GENERATED_MAP[localeKey].has(out)) return GENERATED_MAP[localeKey].get(out);
    protectedValues.sort((a,b)=>b.length-a.length).forEach((name,index)=>{
      const marker='\uE000'+index+'\uE001';
      out=out.split(name).join(marker);
    });
    const protectedSource=out;
    if(CACHE[localeKey].has(protectedSource)) out=CACHE[localeKey].get(protectedSource);
    else{
      out=replacePairs(protectedSource,GENERATED[localeKey]);
      out=replacePairs(out,CURATED[localeKey]);
      CACHE[localeKey].set(protectedSource,out);
    }
    protectedValues.forEach((name,index)=>{
      const marker='\uE000'+index+'\uE001';
      if(locale==='en') out=out.replace(new RegExp('([A-Z0-9])'+marker,'g'),'$1 '+marker);
      out=out.split(marker).join(name);
    });
    return out;
  }
  function logicalWidth(value){
    const out=translate(value);
    if(locale==='zh-CN'&&document&&typeof document.createElement==='function'){
      if(!logicalWidth.context){
        const canvas=document.createElement('canvas');
        logicalWidth.context=canvas.getContext('2d');
      }
      if(logicalWidth.context){
        logicalWidth.context.font='bold 7px "Microsoft YaHei","Noto Sans SC",sans-serif';
        return Math.ceil(logicalWidth.context.measureText(out).width);
      }
    }
    let width=0;
    for(const ch of Array.from(out)) width+=(/[\u3400-\u9fff\uf900-\ufaff]/.test(ch)?7:4);
    return Math.max(0,width-1);
  }
  function applyDocument(){
    document.documentElement.lang=locale;
    const copy=locale==='en'?{
      gate:'STONKGOTCHI entry',loading:'Preparing STONKGOTCHI',label:'Profile name',placeholder:'Enter your name',help:'',play:'Play',toggle:'Switch to Chinese',x:'Open the official STONKGOTCHI account on X'
    }:{
      gate:'进入STONKGOTCHI',loading:'正在准备STONKGOTCHI',label:'玩家名称',placeholder:'输入你的名字',help:'',play:'开始游戏',toggle:'切换为英语',x:'在X打开STONKGOTCHI官方账号'
    };
    const gate=document.getElementById('entry-gate'); if(gate) gate.setAttribute('aria-label',copy.gate);
    const loading=document.getElementById('entry-loading'); if(loading) loading.setAttribute('aria-label',copy.loading);
    const label=document.querySelector('label[for="profile-name"]'); if(label) label.textContent=copy.label;
    const input=document.getElementById('profile-name'); if(input) input.placeholder=copy.placeholder;
    const help=document.getElementById('profile-help'); if(help) help.textContent=copy.help;
    const play=document.getElementById('entry-play'); if(play) play.textContent=copy.play;
    const toggle=document.getElementById('language-toggle'); if(toggle){toggle.setAttribute('aria-label',copy.toggle);toggle.title=copy.toggle;}
    const x=document.getElementById('social-x'); if(x){x.setAttribute('aria-label',copy.x);x.title=copy.x;}
  }
  function setLocale(next){
    locale=normalizeLocale(next);
    CACHE.en.clear(); CACHE.zh.clear();
    try{ localStorage.setItem(STORAGE_KEY,locale); }catch(error){}
    applyDocument();
    dispatchEvent(new CustomEvent('stonk-languagechange',{detail:{locale}}));
    return locale;
  }
  function toggle(){ return setLocale(locale==='en'?'zh-CN':'en'); }

  window.STONK_I18N=Object.freeze({translate,logicalWidth,setLocale,toggle,get locale(){return locale;},defaultLocale:DEFAULT_LOCALE});
  applyDocument();
})();
