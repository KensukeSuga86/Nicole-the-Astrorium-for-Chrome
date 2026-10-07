(()=>{"use strict";
const area=document.getElementById("lessons"),heading=document.getElementById("lesson-heading"),notice=document.getElementById("notice");
document.querySelectorAll("[data-school]").forEach(button=>button.addEventListener("click",()=>{
 document.querySelectorAll("[data-school]").forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
 heading.textContent=button.textContent+"の学習テーマ";area.replaceChildren();notice.textContent="";
 for(const lesson of NicoleEducationLessons){const b=document.createElement("button");b.textContent=lesson.title;b.addEventListener("click",()=>{notice.textContent=lesson.title+"：この教材は現在準備中です";});area.append(b);}
 document.getElementById("lesson-section").hidden=false;
}));})();
