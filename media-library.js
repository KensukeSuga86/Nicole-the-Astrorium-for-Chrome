(()=>{"use strict";
const DB_NAME="nicole-astrorium-media-library",STORE="media",VER=1;
function db(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,VER);r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains(STORE)){const s=d.createObjectStore(STORE,{keyPath:"id"});s.createIndex("createdAt","createdAt")}};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function addFiles(files){const d=await db(),tx=d.transaction(STORE,"readwrite"),st=tx.objectStore(STORE),out=[];for(const f of files){if(!/^image\//.test(f.type)&&!/^video\//.test(f.type))continue;const id=`media-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;const rec={id,name:f.name,type:f.type||"application/octet-stream",size:f.size,createdAt:Date.now(),blob:f};st.put(rec);out.push({...rec,blob:undefined})}await new Promise((res,rej)=>{tx.oncomplete=res;tx.onerror=()=>rej(tx.error)});return out}
async function list(){const d=await db(),tx=d.transaction(STORE,"readonly"),st=tx.objectStore(STORE);const a=await new Promise((res,rej)=>{const r=st.getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>rej(r.error)});return a.sort((x,y)=>y.createdAt-x.createdAt).map(({blob,...m})=>m)}
async function get(id){const d=await db(),tx=d.transaction(STORE,"readonly"),st=tx.objectStore(STORE);return await new Promise((res,rej)=>{const r=st.get(id);r.onsuccess=()=>res(r.result||null);r.onerror=()=>rej(r.error)})}
async function remove(id){const d=await db(),tx=d.transaction(STORE,"readwrite");tx.objectStore(STORE).delete(id);return await new Promise((res,rej)=>{tx.oncomplete=()=>res(true);tx.onerror=()=>rej(tx.error)})}
async function clear(){const d=await db(),tx=d.transaction(STORE,"readwrite");tx.objectStore(STORE).clear();return await new Promise((res,rej)=>{tx.oncomplete=()=>res(true);tx.onerror=()=>rej(tx.error)})}
window.AstroriumMediaLibrary={addFiles,list,get,remove,clear,dbName:DB_NAME};
})();
