# Liquid Glass Refraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the canvas-generated displacement filter with an SVG `feTurbulence` filter applied via `backdrop-filter: url(#id)` so cards warp the background content behind them — authentic light refraction through glass.

**Architecture:** Two static SVG filters (`#lg-card`, `#lg-btn`) rendered globally. CSS `backdrop-filter` references them directly on `.liquid-glass-card` and `.glass-button`. No canvas, no React state, no client JS.

**Tech Stack:** React (Next.js), SVG filters (`feTurbulence`, `feDisplacementMap`), CSS `backdrop-filter`

---

## Files

| File | Action | What changes |
|------|--------|-------------|
| `components/LiquidGlassFilter.tsx` | Modify | Replace canvas pipeline with two static `feTurbulence` filters; remove `useEffect`/`useState`/`"use client"` |
| `app/globals.css` | Modify | Remove duplicate `.liquid-glass-card` block; update `backdrop-filter` to reference `#lg-card`; remove `::before` displacement layer; update `.glass-button` to reference `#lg-btn` |

---

## Task 1: Rewrite LiquidGlassFilter.tsx

**Files:**
- Modify: `components/LiquidGlassFilter.tsx`

The current component uses `useEffect` + `useState` to generate a canvas PNG displacement map at runtime and inject it via `feImage`. We're replacing this with a pure server component that renders two static `feTurbulence` → `feDisplacementMap` filter chains. No canvas, no client JS, no hydration.

- [ ] **Step 1: Replace the file contents**

Write the following to `components/LiquidGlassFilter.tsx` (completely replacing existing content):

```tsx
export default function LiquidGlassFilter() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute", pointerEvents: "none" }}
      aria-hidden="true"
    >
      <defs>
        {/*
          lg-card: used by .liquid-glass-card (ProjectCard, ProjectOverlay, TechPill)
          Higher scale (55) gives visible refraction on larger elements.
        */}
        <filter
          id="lg-card"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="turbulence"
            baseFrequency="0.012 0.008"
            numOctaves="3"
            seed="5"
            result="turb"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turb"
            scale="55"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/*
          lg-btn: used by .glass-button (GlassButton)
          Lower scale (30) avoids chaos on small button elements.
        */}
        <filter
          id="lg-btn"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="turbulence"
            baseFrequency="0.012 0.008"
            numOctaves="3"
            seed="5"
            result="turb"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turb"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
```

- [ ] **Step 2: Verify the dev server compiles without errors**

Run: `npm run dev` (or check existing terminal)  
Expected: No TypeScript errors, no missing import warnings. The component now has no imports at all.

- [ ] **Step 3: Commit**

```bash
git add components/LiquidGlassFilter.tsx
git commit -m "refactor: replace canvas displacement map with feTurbulence SVG filters"
```

---

## Task 2: Update globals.css — liquid-glass-card

**Files:**
- Modify: `app/globals.css`

The CSS currently has **two** `.liquid-glass-card` declarations (lines 70–118 and 139–230). The second one overrides most of the first, so it's the active definition. We need to:

1. Delete the first (stale, duplicate) block entirely (lines 64–118 including the comment header)
2. On the remaining block, change `backdrop-filter` to reference `#lg-card` — this is the key change that makes the background warp through the glass
3. Remove the `::before` pseudo-element (its job was applying the old `filter: url(#liquid-glass)` — now displacement happens in `backdrop-filter` directly)
4. Keep `::after` (specular gradient border) unchanged
5. Update hover `backdrop-filter` to also reference `#lg-card`

- [ ] **Step 1: Remove the first duplicate `.liquid-glass-card` block**

In `app/globals.css`, delete lines 64–118 (from the comment `/* ── Liquid Glass Card ──` down through the closing `}` of the second `.liquid-glass-card::after` block). The CSS block to remove is:

```css
  /* ── Liquid Glass Card ───────────────────────────────────────────────
     Two-layer approach:
     - ::before  → backdrop blur + SVG displacement filter (the "glass pane")
     - ::after   → gradient border for edge refraction highlight
     - element   → specular top highlight via box-shadow, transparent bg
  ──────────────────────────────────────────────────────────────────── */
  .liquid-glass-card {
    background: rgba(255, 255, 255, 0.12);
    border: 1.5px solid rgba(255, 255, 255, 0.45);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.85),
      inset 0 -1px 0 rgba(255, 255, 255, 0.2);
    position: relative;
    isolation: isolate;
  }

  /* Glass pane: backdrop blur + saturation + lens displacement */
  .liquid-glass-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    backdrop-filter: blur(24px) saturate(180%) url(#liquid-glass);
    z-index: -1;
    pointer-events: none;
  }

  /* Edge refraction highlight — gradient visible only in the border ring */
  .liquid-glass-card::after {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    padding: 1.5px;
    background: linear-gradient(
      160deg,
      rgba(255, 255, 255, 0.85) 0%,
      rgba(255, 255, 255, 0.35) 25%,
      rgba(255, 255, 255, 0.08) 55%,
      rgba(255, 255, 255, 0.15) 80%,
      rgba(255, 255, 255, 0.5) 100%
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
    z-index: 2;
  }

  /* Hover: brighter edge highlight + lift shadow */
  .liquid-glass-card:hover::after {
    background: linear-gradient(
      160deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0.5) 25%,
      rgba(255, 255, 255, 0.12) 55%,
      rgba(255, 255, 255, 0.2) 80%,
      rgba(255, 255, 255, 0.65) 100%
    );
  }
```

- [ ] **Step 2: Update the `.liquid-glass-card` base rule**

Replace the remaining `.liquid-glass-card` base rule (the comment block plus the rule itself) with:

```css
  /* ── Liquid Glass Card ───────────────────────────────────────────────
     feTurbulence backdrop-filter approach:
     backdrop-filter references #lg-card SVG filter, distorting background
     content seen through the glass — authentic light refraction.
     ::after provides specular gradient border highlight.
  ──────────────────────────────────────────────────────────────────── */
  .liquid-glass-card {
    background: rgba(255, 255, 255, 0.18);
    backdrop-filter: brightness(1.12) saturate(180%) blur(1px) url(#lg-card);
    -webkit-backdrop-filter: brightness(1.12) saturate(180%) blur(1px) url(#lg-card);
    border: 1.5px solid rgba(255, 255, 255, 0.5);
    box-shadow:
      0 8px 40px rgba(0, 0, 0, 0.08),
      0 2px 8px rgba(0, 0, 0, 0.04),
      inset 0 1.5px 0 rgba(255, 255, 255, 0.9),
      inset 0 -1px 0 rgba(255, 255, 255, 0.25);
    position: relative;
    isolation: isolate;
    overflow: hidden;
  }
```

- [ ] **Step 3: Remove the `::before` pseudo-element block**

Delete the entire `::before` block and its comment (the lens distortion layer — it applied `filter: url(#liquid-glass)` which is now handled by `backdrop-filter`):

```css
  /*
    Lens distortion layer — applies the SVG displacement filter to a
    semi-transparent overlay so the refraction bends the card's own
    backdrop content rather than disappearing behind it.
    Note: SVG filter url() is NOT supported in backdrop-filter; we apply
    it via the regular `filter` property on a pseudo-element overlay that
    sits above the blurred background but below card content.
  */
  .liquid-glass-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    /* Light frosted glass tint — the SVG filter warps this layer */
    background: rgba(240, 245, 255, 0.10);
    filter: url(#liquid-glass);
    z-index: 0;
    pointer-events: none;
  }
```

- [ ] **Step 4: Update the hover rule**

Replace the `.liquid-glass-card:hover` block with:

```css
  /* Hover: stronger refraction + lift */
  .liquid-glass-card:hover {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: brightness(1.15) saturate(220%) blur(1px) url(#lg-card);
    -webkit-backdrop-filter: brightness(1.15) saturate(220%) blur(1px) url(#lg-card);
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.12),
      0 4px 12px rgba(0, 0, 0, 0.06),
      inset 0 1.5px 0 rgba(255, 255, 255, 1),
      inset 0 -1px 0 rgba(255, 255, 255, 0.4);
  }
```

- [ ] **Step 5: Verify the `::after` and `.liquid-glass-card > *` rules are untouched**

Confirm these blocks remain exactly as they were:

```css
  /* Specular highlight — gradient border ring that simulates light refraction */
  .liquid-glass-card::after {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    padding: 1.5px;
    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 255, 255, 0.55) 20%,
      rgba(200, 220, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.10) 65%,
      rgba(255, 255, 255, 0.45) 85%,
      rgba(255, 255, 255, 0.75) 100%
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
    z-index: 3;
  }

  /* Inner specular: top-left bright "hotspot" simulating transmitted light */
  .liquid-glass-card > * {
    position: relative;
    z-index: 1;
  }
```

- [ ] **Step 6: Verify hover::after is untouched**

Confirm this block remains exactly as it was:

```css
  .liquid-glass-card:hover::after {
    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0.7) 20%,
      rgba(200, 220, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.12) 65%,
      rgba(255, 255, 255, 0.55) 85%,
      rgba(255, 255, 255, 0.9) 100%
    );
  }
```

- [ ] **Step 7: Commit**

```bash
git add app/globals.css
git commit -m "feat: apply feTurbulence backdrop refraction to liquid-glass-card"
```

---

## Task 3: Update globals.css — glass-button

**Files:**
- Modify: `app/globals.css`

Update `.glass-button` and its hover/active states to use `backdrop-filter: url(#lg-btn)`.

- [ ] **Step 1: Replace the `.glass-button` base rule**

Replace:

```css
  .glass-button {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.04),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
    transition: background 0.2s ease, box-shadow 0.2s ease;
  }
```

With:

```css
  .glass-button {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: brightness(1.1) blur(1px) url(#lg-btn);
    -webkit-backdrop-filter: brightness(1.1) blur(1px) url(#lg-btn);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.04),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
    transition: background 0.2s ease, box-shadow 0.2s ease;
  }
```

- [ ] **Step 2: Replace the `.glass-button:hover` rule**

Replace:

```css
  .glass-button:hover {
    background: rgba(255, 255, 255, 0.45);
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }
```

With:

```css
  .glass-button:hover {
    background: rgba(255, 255, 255, 0.45);
    backdrop-filter: brightness(1.15) blur(1px) url(#lg-btn);
    -webkit-backdrop-filter: brightness(1.15) blur(1px) url(#lg-btn);
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }
```

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: apply feTurbulence backdrop refraction to glass-button"
```

---

## Task 4: Verify in browser

**Files:** None

- [ ] **Step 1: Open the dev server**

Navigate to `http://localhost:3000` in Chrome or Edge (not Firefox — Firefox doesn't support `url()` in `backdrop-filter`).

- [ ] **Step 2: Check ProjectCard**

Scroll to the Projects section. Each card should show visible background distortion through the glass — the gradient/content behind the card warps organically at the edges. The specular highlight border (`::after`) should still be visible.

- [ ] **Step 3: Check ProjectOverlay**

Click a project card to open the overlay. The overlay panel should show refraction distortion of the page content behind it.

- [ ] **Step 4: Check TechPill**

Click a TechPill. The info modal panel should show refraction.

- [ ] **Step 5: Check GlassButton**

Hover a glass button (e.g., "View Project"). The button should show subtle refraction on the background behind it.

- [ ] **Step 6: Check Firefox fallback**

Open `http://localhost:3000` in Firefox. Cards should display as normal frosted glass (backdrop blur, border, shadow) without turbulence distortion — graceful degradation, no broken layout.

- [ ] **Step 7: Final commit if tuning needed**

If any values need adjusting (scale too strong/weak), edit the `scale` attribute in `LiquidGlassFilter.tsx`:
- Increase `scale` (e.g., `70`) for stronger refraction
- Decrease (e.g., `35`) for subtler effect

```bash
git add components/LiquidGlassFilter.tsx app/globals.css
git commit -m "chore: tune liquid glass refraction scale"
```
