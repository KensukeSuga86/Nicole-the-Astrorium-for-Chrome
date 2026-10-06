(()=>{"use strict";
const SCHEMA="nicole-astrorium-scene-state";
const VERSION=2;
function clone(v){return JSON.parse(JSON.stringify(v));}
function build(A,state,clock={},meta={}){
  const serial=JSON.parse(A.serial(state));
  return {
    schema:SCHEMA,
    version:VERSION,
    appVersion:String(meta.appVersion||""),
    generatedAtMs:Date.now(),
    time:{
      timeMs:Number(clock.timeMs ?? state.time?.getTime?.() ?? Date.now()),
      running:!!(clock.running ?? state.running),
      rate:Number(clock.rate ?? state.rate ?? 1)||1
    },
    observer:clone(serial.location||{}),
    camera:clone(serial.camera||{}),
    projection:serial.projection||"perspective",
    layers:clone(serial.global||{}),
    display:clone(serial.display||{}),
    constellations:clone(serial.constellations||{}),
    asterisms:clone(serial.asterisms||{}),
    highlights:clone(serial.highlights||{}),
    labels:clone(serial.labels||{}),
    annotations:clone(serial.annotations||[]),
    media:clone(serial.media||{}),
    // Compatibility payload. Renderer replacements can progressively stop depending on it.
    engineState:serial
  };
}
function isScene(v){return !!v&&v.schema===SCHEMA&&Number(v.version)===VERSION&&v.engineState;}
function revive(A,scene){if(!isScene(scene))return null;return A.revive(scene.engineState);}
window.AstroriumSceneState={SCHEMA,VERSION,build,isScene,revive};
})();
