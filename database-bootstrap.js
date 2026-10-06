(function(){
function loadClassic(src){return new Promise((res,rej)=>{const s=document.createElement("script");s.src=src;s.async=false;s.onload=()=>res();s.onerror=()=>rej(new Error("script load failed: "+src));document.body.appendChild(s)})}
function applyArt(db){
  const art=window.ASTRORIUM_CONSTELLATION_ART,data=window.NICOLE_ART_DATA||{},rows=db&&db.constellation_standard;
  if(!art)return;
  if(Array.isArray(rows)&&rows.length===88){
    for(const row of rows){const p=(row.art&&row.art.placement)||{},id=row.id;if(!id||!art[id])continue;
      art[id]=Object.assign({},art[id],{name:(row.name&&row.name.ja)||art[id].name,src:data[id]||art[id].src,ra:Number(p.ra_deg),dec:Number(p.dec_deg),widthDeg:Number(p.width_deg),heightDeg:Number(p.height_deg),rotationDeg:Number(p.rotation_deg)||0,flipX:!!p.flip_x,flipY:!!p.flip_y,opacity:Number.isFinite(Number(p.opacity))?Number(p.opacity):art[id].opacity})}
  }else{for(const id in art)if(data[id])art[id].src=data[id]}
  window.ASTRORIUM_CONSTELLATION_ART_DEFAULTS=JSON.parse(JSON.stringify(art));
}
window.bootAstrorium=async function(appScript){
  const boot=document.getElementById("bootStatus");if(boot)boot.textContent="DB読込中…";
  try{
    const db=window.__NICOLE_DB__;if(!db||!db.manifest)throw new Error("database/db-bundle.js がありません");
    if(!Array.isArray(db.constellations)||db.constellations.length!==88)throw new Error("DBが88星座ではありません");
    window.ASTRORIUM_DATA=window.commonDbToAstrorium(db);window.AstroriumDatabase=db;
    window.AstroriumDatabaseMeta={source:"bundled-offline",base:"./database/",version:db.manifest.database_version,manifest:db.manifest,fallback:false};
  }catch(error){
    console.error("DB load failed; using embedded fallback",error);
    await loadClassic("./data-fallback.js");window.AstroriumDatabase=null;
    window.AstroriumDatabaseMeta={source:"embedded-fallback",base:"./data-fallback.js",version:"v0.6 legacy",fallback:true,error:String(error&&error.message||error)};
  }
  await loadClassic("./constellation-art.js");applyArt(window.AstroriumDatabase);
  await loadClassic("./engine.js");await loadClassic("./scene-state.js");await loadClassic("./renderer-adapter.js");await loadClassic(appScript);
};
})();
