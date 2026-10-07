(()=>{"use strict";
const $=id=>document.getElementById(id),A=Astrorium,session=NicoleEducation.createSession(A,$("sky")),s=session.state;
const pad=n=>String(n).padStart(2,"0"),localDate=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
function syncTime(){if(document.activeElement!==$("date"))$("date").value=localDate(s.time);}
function evening(){const sunset=A.sunsetForDate(new Date(s.time),s.location.lat,s.location.lon);if(sunset){session.command({type:"time",value:sunset.getTime()-1800000});syncTime();}else $("inputStatus").textContent="この日・地点では日没時刻を取得できません。日時を直接指定してください。";}
evening();
for(const [id,value] of Object.entries({lat:s.location.lat,lon:s.location.lon,az:s.camera.az,alt:s.camera.alt,fov:s.camera.fov}))$(id).value=value;
$("date").onchange=()=>{const d=new Date($("date").value);if(Number.isFinite(d.getTime()))session.command({type:"time",value:d});else syncTime();};
$("now").onclick=()=>{session.command({type:"time",value:new Date()});syncTime();};$("sunset").onclick=evening;
$("play").onclick=()=>{session.command({type:"run",value:!s.running});$("play").textContent=s.running?"Ⅱ 止める":"▶ 動かす";$("play").setAttribute("aria-pressed",String(s.running));};
$("rate").onchange=()=>session.command({type:"rate",value:$("rate").value});
for(const id of ["lat","lon","az","alt","fov"]){$(id).onchange=()=>{const input=$(id),value=Number(input.value);if(!input.value||!input.checkValidity()||!Number.isFinite(value)){input.value=id in s.camera?s.camera[id]:s.location[id];$("inputStatus").textContent="入力できる範囲の数値を指定してください。";return;}$("inputStatus").textContent="";session.command({type:id in s.camera?"camera":"location",value:{[id]:value}});};}
$("place").onchange=()=>session.command({type:"location",value:{name:$("place").value}});
for(const [key,title] of [["stars","恒星"],["names","星座名"],["lines","星座線"],["sun","太陽"],["moon","月"],["planets","惑星"]]){const label=document.createElement("label"),input=document.createElement("input");input.type="checkbox";input.checked=!!s.global[key];input.dataset.layer=key;input.onchange=()=>session.command({type:"global",key,value:input.checked});label.append(input,document.createTextNode(title));$("toggles").append(label);}
let previous=performance.now(),nextFrame=0;
function loop(now){requestAnimationFrame(loop);const elapsed=now-previous;previous=now;if(document.hidden)return;if(s.running)s.time=new Date(s.time.getTime()+elapsed*s.rate);if(now<nextFrame)return;nextFrame=Math.max(nextFrame+1000/NicoleEducation.quality.targetFps,now);session.render();syncTime();}
$("bootStatus").textContent="Nicole 2E · 自由星空";requestAnimationFrame(loop);
window.NicoleEducationDiagnostics={edition:NicoleEducation.edition,state:()=>JSON.parse(A.serial(s)),renderer:session.diagnostics,position:session.position,altaz:session.altaz};
// The browser releases contexts on unload; retain the session for back/forward cache restoration.
})();
