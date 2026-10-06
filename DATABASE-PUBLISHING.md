# Nicole Astronomy Database integration — Nicole the Astrorium v0.15.5

Nicole the Astrorium v0.15.5 is **LOCAL-first** and bundles the consumer data subset of **Nicole Astronomy Database v0.3.3**.

## Ownership rule

Nicole Astronomy Database is the authoritative shared astronomy database.

Shared descriptions for constellations, curated stars, planets and deep-sky objects are edited only in **Nicole Astronomy Database Editor**. Nicole the Astrorium displays those descriptions but does not maintain a parallel description editor or apply application-local description overrides.

## Runtime load order

1. Bundled `./database/` v0.3.3
2. Online fallback `/online-db/versions/0.3.3/`
3. Direct GitHub Pages fallback for v0.3.3
4. Embedded legacy fallback only if the shared database cannot be loaded

The application does not automatically adopt a newly published database version. A new database version must be explicitly selected in a future Astrorium release.

## Editing routes

- Shared description → Nicole Astronomy Database Editor → Formal Database Update Package → reviewed GitHub publication
- Constellation line/artwork visual work → Nicole the Astrorium specialized editor → reviewed promotion into Nicole Astronomy Database
- UI/layout/scripts/media/runtime state → Nicole the Astrorium local application state; never promoted automatically

The bundled database intentionally omits the database Editor shell. This prevents a second shared-description editing path inside Astrorium.
