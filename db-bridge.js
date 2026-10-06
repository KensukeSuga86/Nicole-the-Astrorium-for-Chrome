const LEGACY_DSO_CONSTELLATIONS={"M1":"Tau","M2":"Aqr","M3":"Boo","M4":"Sco","M5":"Ser","M6":"Sco","M7":"CrA","M8":"Sgr","M11":"Sct","M13":"Her","M15":"Equ","M16":"Sct","M17":"Sct","M20":"Sgr","M22":"Sgr","M27":"Vul","M31":"And","M33":"Tri","M35":"Gem","M36":"Aur","M37":"Aur","M38":"Aur","M41":"CMa","M42":"Ori","M44":"Cnc","M45":"Tau","M51":"CVn","M57":"Lyr","M63":"CVn","M64":"Com","M65":"Leo","M66":"Leo","M81":"UMa","M82":"UMa","M87":"Com","M92":"Her","M101":"CVn","M104":"Crv","NGC869":"Cas","NGC4565":"Com","NGC6543":"Dra","NGC6992":"Cyg","NGC7000":"Cyg","NGC7293":"PsA","NGC7789":"Cas","NGC3628":"Leo","IC434":"Ori"};
const APP_ONLY_ASTERISMS=[];
function commonDbToAstrorium(db){
  const constellations=(db.constellations||[]).map(c=>({
    id:c.id,
    name:c.name?.ja||c.id,
    en:c.name?.en||"",
    abbr:c.name?.abbr||c.id,
    ra:Number(c.representative_position?.ra_deg),
    dec:Number(c.representative_position?.dec_deg),
    season:c.season||"",
    months:c.visible_months_legacy||[],
    stars:c.main_stars_text||"",
    story:c.legacy_story||c.explanation?.science||"",
    science:c.explanation?.science||"",
    myth:c.explanation?.myth||""
  }));
  const stars=(db.stars||[]).map(s=>({
    id:s.id,
    name:s.name?.ja_full||s.name?.ja||s.id,
    display_name:s.name?.ja||s.id,
    ra:Number(s.position?.ra_deg), dec:Number(s.position?.dec_deg),
    mag:s.magnitude_v==null?99:Number(s.magnitude_v),
    constellation:s.constellation_id||null,
    type:"star", icon:s.icon||"⭐", cat:s.catalog_category||"恒星",
    dist:s.distance_text||"", size:s.size_text||"", scope:s.recommended_magnification||"",
    highlight:s.highlight||"", months:s.visible_months_legacy||[],
    story:s.explanation?.raw_html||storyHtml(s.explanation),
    bv:s.photometry?.bv??null,
    spectral_type:s.photometry?.spectral_type??null,
    display_color_hex:s.photometry?.display_color_hex??null, colorLabel:s.photometry?.color_label_ja??null
  })).filter(s=>Number.isFinite(s.ra)&&Number.isFinite(s.dec));
  const dsos=(db.deep_sky||[]).map(o=>({
    id:o.id,name:o.name?.ja||o.id,type:o.type,icon:o.icon||"✦",cat:o.catalog_category||"",
    ra:Number(o.position?.ra_deg),dec:Number(o.position?.dec_deg),mag:o.magnitude_v==null?99:Number(o.magnitude_v),
    dist:o.distance_text||"",size:o.size_text||"",scope:o.recommended_magnification||"",highlight:o.highlight||"",
    months:o.visible_months_legacy||[],story:o.explanation?.raw_html||storyHtml(o.explanation),
    constellation:o.constellation_id||LEGACY_DSO_CONSTELLATIONS[o.id]||null, aliases:o.aliases||[], messier_number:o.messier_number||null, catalog_metadata:o.catalog_metadata||null, angular_size:o.angular_size||null
  })).filter(o=>Number.isFinite(o.ra)&&Number.isFinite(o.dec));
  const planetsInfo=(db.planets||[]).map(o=>({
    id:o.id,name:o.name?.ja||o.id,type:"planet",icon:o.icon||"●",cat:o.catalog_category||"惑星",
    planet:o.position?.planet_key||o.id,mag:o.magnitude_v==null?99:Number(o.magnitude_v),
    dist:o.distance_text||"",size:o.size_text||"",scope:o.recommended_magnification||"",highlight:o.highlight||"",
    months:o.visible_months_legacy||[],story:o.explanation?.raw_html||storyHtml(o.explanation),
    physical_diameter_km:o.physical_diameter_km??null, rendering:o.rendering||null
  }));
  const asterisms=(db.asterisms||[]).map(a=>({
    id:normalizeAsterismId(a.id),name:normalizeAsterismName(a.name?.ja||a.id),stars:a.star_ids||[],
    lines:(a.lines||[]).map(x=>[x.from,x.to])
  }));
  for(const a of APP_ONLY_ASTERISMS)if(!asterisms.some(x=>x.id===a.id))asterisms.splice(1,0,a);
  const solarSystem=(db.solar_system||[]).map(o=>({...o}));
  const constellationStandard=(db.constellation_standard||[]).map(c=>({
    id:c.id,abbr:c.name?.abbr||c.id,name:c.name?.ja||c.id,
    lines:(c.line?.segments||[]).map(x=>[x.from,x.to]),
    starIds:c.line?.star_ids||[],sourceMode:c.line?.source_mode||"",
    art:c.art||null,provenance:c.provenance||null
  }));
  const constellationLineStars=(db.constellation_line_stars||[]).map(x=>({
    id:x.id,hip:x.hip??null,name:x.name||null,
    ra:x.ra_deg==null?null:Number(x.ra_deg),dec:x.dec_deg==null?null:Number(x.dec_deg),mag:x.magnitude_v==null?6:Number(x.magnitude_v),
    coordinateStatus:x.coordinate_status||"",coordinateSource:x.coordinate_source||"",
    sourceUrls:x.source_urls||[]
  }));
  return {constellations,stars,dsos,planetsInfo,asterisms,solarSystem,constellationStandard,constellationLineStars};
}
function normalizeAsterismId(id){
  const m={big_dipper:"bigdipper",summer_triangle:"summertriangle",winter_triangle:"wintertriangle",winter_diamond:"winterdiamond",spring_arc:"springarc",spring_triangle:"springtriangle",autumn_great_square:"greatsquare",orion_belt:"orionbelt",northern_cross:"northerncross"};
  return m[id]||id;
}
function normalizeAsterismName(name){return name==="ペガススの四辺形（秋の四辺形）"?"秋の四辺形":name}
function storyHtml(e){
  if(!e)return"";
  const parts=[["概要",e.overview],["観測のポイント",e.observing],["天文学的な見どころ",e.science],["歴史・名前",e.history]].filter(x=>x[1]);
  return parts.map(([h,p])=>`<div class="story-topic"><h4>${esc(h)}</h4><p>${esc(p)}</p></div>`).join("");
}
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

window.commonDbToAstrorium=commonDbToAstrorium;
