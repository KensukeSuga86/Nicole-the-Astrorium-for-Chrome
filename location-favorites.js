(()=>{"use strict";
const KEY="astrorium_location_favorites_v2",LEGACY="astrorium_favorites_v1";
const clean=n=>Number.isFinite(Number(n))?Number(n):0;
function normalize(x,i=0){if(!x)return null;const lat=Number(x.lat),lon=Number(x.lon);if(!Number.isFinite(lat)||lat<-90||lat>90||!Number.isFinite(lon)||lon<-180||lon>180)return null;return{id:String(x.id||`fav-${Date.now()}-${i}-${Math.random().toString(36).slice(2,7)}`),name:String(x.name||"お気に入り地点"),lat,lon,alt:clean(x.alt)};}
function readRaw(key){try{const v=JSON.parse(localStorage.getItem(key)||"[]");return Array.isArray(v)?v:[]}catch(_){return[]}}
function list(){let arr=readRaw(KEY).map(normalize).filter(Boolean);if(!arr.length){const legacy=readRaw(LEGACY).map(normalize).filter(Boolean);if(legacy.length){arr=legacy;write(arr)}}return arr;}
function write(arr){localStorage.setItem(KEY,JSON.stringify((arr||[]).map(normalize).filter(Boolean)));window.dispatchEvent(new CustomEvent("astrorium-favorites-changed"));return listNoMigrate();}
function listNoMigrate(){return readRaw(KEY).map(normalize).filter(Boolean)}
function save(place){const x=normalize(place);if(!x)throw new Error("緯度経度が正しくありません");const arr=list();const same=arr.findIndex(y=>y.id===x.id||y.name===x.name);if(same>=0){x.id=arr[same].id;arr[same]=x}else arr.push(x);write(arr);return x;}
function remove(id){const arr=list().filter(x=>x.id!==String(id));write(arr);return arr;}
function get(id){return list().find(x=>x.id===String(id))||null;}
window.addEventListener("storage",e=>{if(e.key===KEY)window.dispatchEvent(new CustomEvent("astrorium-favorites-changed"))});window.AstroriumLocationFavorites={KEY,list,save,remove,get};
})();
