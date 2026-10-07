# Nicole 2E — Phase E0

Base: Chrome v1.1.0, main e6a983108877b5c990bdf06e169c99727599344d.

## Architecture and changed files

- `index.html`: Education Home; school-stage selection and eight lesson entries.
- `education-sky.html`: separate simplified Free Sky UI; original Presenter retained at `presenter.html`.
- `education/education-app.js`: edition identifier, quality policy, session API wrapping the existing engine and renderer.
- `education/education-home.js`: accessible stage selection and lesson navigation.
- `education/education-lessons.js`: placeholder catalog; all lessons show この教材は現在準備中です. Stage selection currently presents the same eight discovery entries; no curriculum alignment is claimed.
- `education/education-sky.js`: local date/time, location, azimuth, altitude, FOV, six layer toggles and 30fps target scheduling; no original settings or editing state imported.
- `education/education.css`: responsive Home and Free Sky layout.
- `manifest.webmanifest`: education name and PWA metadata.
- `sw.js`: new cache version, education entry points precached, only Astrorium caches cleaned, failed non-navigation requests no longer receive HTML.
- `tests/education-e0.cjs`: Home, placeholders, GPU diagnostics, offline reload, legacy Presenter and forced Canvas smoke checks.
- `EDUCATION-E0.md`: implementation and validation report.

## Existing functionality

`presenter.html`, `presenter-app.js`, `engine.js`, `renderer-adapter.js`, `scene-state.js`, `database/` and `assets/` are unchanged. The engine exports `Astrorium`; bootstrap converts the bundled DB and loads the original engine, SceneState and renderer. The education session calls `makeState`, `command`, `targetPosition`, `altaz` and the original renderer. No external server or CDN is required; static hosting or a local static server provides the existing PWA delivery model. Installation/offline use requires one successful initial load in a service-worker-compatible browser context.

Free Sky exposes only the requested basic controls. Advanced rendering layers are disabled in its new session; no advanced panels or shortcuts are mounted. Original advanced code remains available in legacy Presenter. Home is lightweight and loads no DB or rendering engine. Free Sky uses the unchanged bundled dataset, DPR cap 1 and a 30fps target. This is a target, not a measured guarantee on school hardware.

## Validation

Passed: JavaScript syntax, service-worker precache file existence, git diff whitespace checks; shared engine, renderer, SceneState and database unchanged. Browser checks passed in headless Chromium 153 with SwiftShader: school selection and eight lesson placeholders, Free Sky navigation, six basic layer controls, location updates, clock play/pause, solar-body layer pixel differences, WebGL rendering with no fallback frames, forced GPU context loss switching to Canvas, startup with WebGL disabled, offline Home/Free Sky reload, original Presenter self-check, and 390px mobile layout without horizontal overflow. No page errors or console errors were captured. An additional native Canvas 2D render and Sun/Moon/Jupiter coordinate calculation completed successfully. This software GPU environment does not verify physical GPU behavior or Chromebook performance.

Install Playwright and its Chromium browser, then run `node tests/education-e0.cjs`. The test starts its own local static server. Optional environment variables `E0_BROWSER_EXECUTABLE` and `E0_BROWSER_ARGS` allow an alternate Chromium runtime.

## Next steps

Run physical Chromebook performance measurements and hardware GPU checks; refine quality profiles and suspend unnecessary rendering; verify Edge/Safari; design grade-specific curriculum mapping against official learning guidelines and implement each lesson. Keep the DB-provider/session boundary when introducing a compact dataset. Audit dependencies before deleting any legacy code. Existing manual is for the legacy version; education-specific instructions currently appear directly in Free Sky.
