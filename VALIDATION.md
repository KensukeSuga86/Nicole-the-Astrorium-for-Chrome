# Nicole the Astrorium v0.15.5 validation

- Base: v0.15.0 Safari/WebCore edition
- Bundled Nicole Astronomy Database: v0.3.3 / LOCAL-first
- Shared-description ownership: Nicole Astronomy Database Editor only
- Astrorium local description overrides: no longer applied at runtime
- Embedded shared-description editor: removed from the Astrorium bundle
- External authoritative editor: GitHub Pages Nicole Astronomy Database Editor
- Deep link: selected constellation / star / planet / deep-sky ID is passed with `kind` + `id`
- Legacy local description edits: optional backup export offered before opening the authoritative Editor
- Constellation line/artwork editing remains available as a specialized Astrorium workflow; output is not authoritative until reviewed DB promotion
- Presenter/Projector realtime channel and fallback key: unchanged from v0.15.0
- Database pin: v0.3.3; no automatic adoption of later DB versions
- JavaScript syntax / JSON parse / duplicate HTML IDs / local HTTP smoke / ZIP integrity: validated during build
- Mac + Safari + external projector two-screen hardware test: not performed in this build environment
