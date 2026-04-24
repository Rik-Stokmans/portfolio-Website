# Liquid Glass Refraction — Design Spec

**Date:** 2026-04-24  
**Status:** Approved

## Problem

The current liquid glass effect applies displacement via `filter: url(#id)` on `::before` pseudo-elements. This distorts the element's own rendering (the tinted overlay), not the background content behind it. Real glass refracts what you see *through* it — the background — which the current approach cannot simulate.

## Goal

Replace the canvas-generated displacement map with an SVG `feTurbulence` filter applied via `backdrop-filter: url(#id)`, so the content behind each glass element visually warps like light bending through glass. All glass elements in the portfolio receive this treatment: ProjectCard, ProjectOverlay, TechPill, GlassButton.

## Reference

`https://github.com/polidario/Frontend-Projects/tree/main/liquid-glass-vue`  
Core technique: `backdrop-filter: brightness(1.1) blur(2px) url(#displacementFilter)` with `feTurbulence` → `feDisplacementMap`.

## Architecture

### SVG Filters (`LiquidGlassFilter.tsx`)

Replace the canvas-drawn displacement map with two static `feTurbulence` filters:

```svg
<!-- Cards, overlay — larger scale for visible refraction -->
<filter id="lg-card" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
  <feTurbulence type="turbulence" baseFrequency="0.012 0.008" numOctaves="3" seed="5" result="turb"/>
  <feDisplacementMap in="SourceGraphic" in2="turb" scale="55" xChannelSelector="R" yChannelSelector="G"/>
</filter>

<!-- Buttons, pills — smaller scale to avoid chaos on small elements -->
<filter id="lg-btn" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
  <feTurbulence type="turbulence" baseFrequency="0.012 0.008" numOctaves="3" seed="5" result="turb"/>
  <feDisplacementMap in="SourceGraphic" in2="turb" scale="30" xChannelSelector="R" yChannelSelector="G"/>
</filter>
```

No canvas, no JavaScript image generation. The component renders a hidden `<svg>` with these two filters.

### CSS (`globals.css`)

**`.liquid-glass-card`** (ProjectCard, ProjectOverlay, TechPill modal):
- Remove `::before` pseudo-element that applied `filter: url(#liquid-glass)` 
- Move distortion to `backdrop-filter` on the element itself:
  ```css
  backdrop-filter: brightness(1.12) saturate(180%) blur(1px) url(#lg-card);
  -webkit-backdrop-filter: brightness(1.12) saturate(180%) blur(1px) url(#lg-card);
  ```
- Keep `::after` specular gradient border highlight
- Keep inset box-shadows for depth

**`.glass-button`** (GlassButton):
- Same pattern with the smaller filter:
  ```css
  backdrop-filter: brightness(1.1) blur(1px) url(#lg-btn);
  -webkit-backdrop-filter: brightness(1.1) blur(1px) url(#lg-btn);
  ```

### Browser Support

| Browser | Support |
|---------|---------|
| Chrome 76+ | Full |
| Edge 79+ | Full |
| Safari 18+ | Full |
| Firefox | Fallback — `url()` in `backdrop-filter` unsupported; gets plain blur |

Fallback is graceful: Firefox users see standard glass morphism without refraction distortion.

## Components Affected

| Component | File | Filter ID |
|-----------|------|-----------|
| ProjectCard | `components/ProjectCard.tsx` | `#lg-card` (via CSS class) |
| ProjectOverlay | `components/ProjectOverlay.tsx` | `#lg-card` (via CSS class) |
| TechPill | `components/TechPill.tsx` | `#lg-card` (via CSS class) |
| GlassButton | `components/GlassButton.tsx` | `#lg-btn` (via CSS class) |

No changes needed to component `.tsx` files — the effect is entirely CSS-driven. Only `LiquidGlassFilter.tsx` and `globals.css` change.

## What Does NOT Change

- Framer Motion animations on ProjectCard and TechPill
- The `::after` specular gradient highlight border
- Inset box-shadows
- Background `rgba` tint on cards
- `GlassButton` hover/active states

## Files to Change

1. `src/components/LiquidGlassFilter.tsx` — replace canvas filter generation with `feTurbulence` SVG filters
2. `app/globals.css` — update `backdrop-filter` on `.liquid-glass-card` and `.glass-button`; remove `::before` displacement layer
