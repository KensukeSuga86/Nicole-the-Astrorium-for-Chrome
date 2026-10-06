# Nicole the Astrorium — Shared Data Ownership Integration

**Application:** Nicole the Astrorium  
**Application version:** v0.15.5  
**Shared database:** Nicole Astronomy Database v0.3.3  
**Mode:** LOCAL-first

## Principle

Nicole Astronomy Database is the source of truth for shared astronomical records. Nicole the Astrorium is a consumer and specialized visual editor, not a parallel source of truth.

## Shared descriptions

The following shared fields are read-only in Astrorium:

- constellation `legacy_story`, `explanation.science`, `explanation.myth`
- curated-star `highlight`, `recommended_magnification`, `explanation.*`
- planet `highlight`, `recommended_magnification`, `explanation.*`
- deep-sky `highlight`, `recommended_magnification`, `explanation.*`

To edit them, Astrorium opens **Nicole Astronomy Database Editor**. When an editable object is selected, its `kind` and `id` are included in the Editor URL so that the same object opens directly.

Astrorium does not apply `nicole0_description_overrides_v1` to runtime database content. The key may still exist in a browser from previous versions; when the authoritative Editor is opened, v0.15.5 can offer to export that old payload as a migration backup.

## Specialized structural editing retained in Astrorium

Astrorium may continue to originate:

- constellation line topology
- constellation line-star additions/exclusions
- constellation artwork replacement
- artwork placement / rotation / flip / opacity
- constellation editing workflow metadata

These are application editing outputs until explicitly reviewed and promoted into Nicole Astronomy Database. Exporting a constellation project does not itself update the authoritative database.

## Application-owned data

Astrorium remains the owner of runtime/user state including observer location/time, camera/FOV, layers, Presenter/Projector state, annotations, scripts, media, UI layout and temporary editing workspace.

## Database adoption

v0.15.5 is pinned to Nicole Astronomy Database v0.3.3. It does not automatically switch to a later database release. Later versions must be deliberately adopted and bundled/tested.
