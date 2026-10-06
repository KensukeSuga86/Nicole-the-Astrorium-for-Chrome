(()=>{"use strict";
const DB_NAME="nicole-astrorium-art-images",DB_VERSION=1,STORE="images",BACKUP="backup";
let dbPromise=null;const urls=new Map();
function db(){if(dbPromise)return dbPromise;dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,DB_VERSION);r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains(STORE))d.createObjectStore(STORE,{keyPath:"id"});if(!d.objectStoreNames.contains(BACKUP))d.createObjectStore(BACKUP,{keyPath:"id"})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return dbPromise}
async function request(store,mode,fn){const d=await db();return new Promise((resolve,reject)=>{const tx=d.transaction(store,mode),os=tx.objectStore(store);let out;try{out=fn(os)}catch(e){reject(e);return}tx.oncomplete=()=>resolve(out?.result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}
const get=(id,store=STORE)=>request(store,"readonly",os=>os.get(id));
const list=(store=STORE)=>request(store,"readonly",os=>os.getAll());
const put=(id,blob,name,store=STORE)=>request(store,"readwrite",os=>os.put({id:String(id),blob,name:name||`${id}.png`,type:blob?.type||"image/png",updatedAt:new Date().toISOString()}));
const remove=(id,store=STORE)=>request(store,"readwrite",os=>os.delete(String(id)));
const clear=(store=STORE)=>request(store,"readwrite",os=>os.clear());
function setUrl(A,id,blob){const old=urls.get(id);if(old)URL.revokeObjectURL(old);if(!blob){urls.delete(id);A?.setArtImageOverride?.(id,null);return null}const url=URL.createObjectURL(blob);urls.set(id,url);A?.setArtImageOverride?.(id,url);return url}
async function applyOne(A,id){const rec=await get(id);setUrl(A,id,rec?.blob||null);return rec||null}
async function applyAll(A){const recs=await list(),ids=new Set(recs.map(r=>String(r.id)));for(const id of [...urls.keys()])if(!ids.has(String(id)))setUrl(A,id,null);for(const rec of recs)setUrl(A,rec.id,rec.blob);return recs}
async function saveAndApply(A,id,file){if(!file||file.type!=="image/png")throw new Error("透過PNG（image/png）を選択してください。");await put(id,file,file.name);const rec=await get(id);setUrl(A,id,rec.blob);return rec}
async function removeAndApply(A,id){await remove(id);setUrl(A,id,null)}
function blobToDataURL(blob){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.readAsDataURL(blob)})}
async function dataURLToBlob(dataUrl){const r=await fetch(dataUrl);return r.blob()}
async function exportData(){const out={};for(const rec of await list())out[rec.id]={name:rec.name||`${rec.id}.png`,type:rec.type||"image/png",updatedAt:rec.updatedAt||null,dataUrl:await blobToDataURL(rec.blob)};return out}
async function replaceFromExport(A,data){await clear();for(const[id,x]of Object.entries(data&&typeof data==="object"?data:{})){if(!x?.dataUrl)continue;const blob=await dataURLToBlob(x.dataUrl);await put(id,blob,x.name||`${id}.png`)}return applyAll(A)}
async function backupAll(){await clear(BACKUP);for(const rec of await list(STORE))await request(BACKUP,"readwrite",os=>os.put(rec))}
async function restoreBackup(A){await clear(STORE);for(const rec of await list(BACKUP))await request(STORE,"readwrite",os=>os.put(rec));return applyAll(A)}
async function meta(){const out={};for(const rec of await list())out[rec.id]={name:rec.name,type:rec.type,updatedAt:rec.updatedAt,size:rec.blob?.size||0};return out}
window.AstroriumArtImageStore={get,list,put,remove,clear,applyOne,applyAll,saveAndApply,removeAndApply,exportData,replaceFromExport,backupAll,restoreBackup,meta};
})();
