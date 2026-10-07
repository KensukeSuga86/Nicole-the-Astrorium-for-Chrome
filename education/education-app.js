(()=>{"use strict";
// Edition policy and the narrow boundary between teaching UI and the shared engine.
window.NicoleEducation=Object.freeze({edition:"education",version:"0.1.0",quality:Object.freeze({targetFps:30,dprCap:1}),
 createSession(A,canvas){const state=A.makeState();Object.assign(state.global,{naturalDeepSky:false,milkyWay:false,arts:false,dso:false,smallBodies:false,aurora:false,meteors:false,sporadicMeteors:false,showerMeteors:false});
 const renderer=AstroriumRenderer.createRenderer(canvas,A,{backend:"auto"});
 return {state,command:c=>A.command(state,c),render:()=>renderer.render(state,{dprCap:1}),diagnostics:()=>renderer.diagnostics(),
 position:(id,date=state.time)=>A.targetPosition(id,date),altaz:(ra,dec,date=state.time)=>A.altaz(ra,dec,date,state.location.lat,state.location.lon),dispose:()=>renderer.dispose()};}
});})();
