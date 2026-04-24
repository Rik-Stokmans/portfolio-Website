# Portfolio Website — Design Spec

## Overview

A minimalist, animation-rich portfolio website for a software developer. Inspired by Apple's liquid glass aesthetic — light, airy, frosted glass UI elements over a mesh gradient background. Two page types: a landing page with hero + bento grid projects section, and a project detail template page with a card-morph transition.

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Framer Motion** — layout animations, scroll-triggered entrances, card morph transition
- **Tailwind CSS v4** — utility-first styling, glass effects
- **TypeScript** throughout
- **Deploy target:** Vercel

## Pages

### 1. Landing Page (`/`)

Two sections stacked vertically:

#### Hero Section
- Full viewport height, content vertically and horizontally centered
- **Name** in large bold type
- **2-3 short intro sentences** below the name, lighter weight
- Staggered fade-up animation on page load (each line delays ~0.1s after the previous)
- Subtle scroll indicator at the bottom (animated chevron)
- **Top navigation bar:** name/logo left, "Projects" and "Contact" links right, frosted glass background, fixed position

#### Projects Section
- Section heading ("Projects" or "Selected Work"), fades in on scroll
- **Bento grid layout** using CSS Grid:
  - 3 columns on desktop, 2 on tablet, 1 on mobile
  - First 2 projects are featured: span 2 columns or 2 rows
  - Remaining projects are standard 1×1 tiles
- **Each card contains:**
  - Frosted glass background
  - Project title
  - Short description (1-2 lines)
  - Tech stack tags (small pills)
  - Placeholder area for thumbnail/screenshot
- **Card interactions:**
  - Hover: subtle lift (translateY -4px), stronger shadow, slight opacity increase on glass
  - Scroll entrance: cards stagger in as they enter viewport (fade up + slight translateY)
  - Click: triggers card morph transition to project detail page

### 2. Project Detail Page (`/projects/[slug]`)

#### Card Morph Transition
- Uses Framer Motion `layoutId` shared between the bento card and the detail page overlay
- **Implementation note:** The project detail is rendered as a full-screen overlay on the landing page (not a separate Next.js route navigation), so both the card and the expanded view live in the same React tree. The URL updates via `window.history.pushState` (or Next.js `useRouter`) to `/projects/[slug]` for shareability, but the DOM transition is client-side. Direct navigation to `/projects/[slug]` renders the detail page without the morph animation.
- On click, the card expands from its grid position to fill the viewport (~0.5s ease)
- Background mesh gradient remains consistent for visual continuity
- On back navigation, the reverse morph plays — page shrinks back into its card position

#### Page Content (revealed after morph completes)
Content fades/slides in with staggered timing:
1. Project title — large, bold
2. Description — one or more paragraphs
3. Tech stack — frosted glass pill tags
4. Links — "Live Site" and "GitHub" as glass-style buttons
5. Screenshot/image placeholder area

#### Back Navigation
- Frosted glass back button, top-left position
- Triggers reverse morph animation back to landing page

#### Template Structure
- All project pages share the same layout
- Content is driven by a TypeScript data array
- Adding a new project = adding an object to the array with: slug, title, description, tech stack, links, featured flag

## Visual Design System

### Background
- Base color: `#f8fafc`
- Mesh gradient applied to full page, using overlapping radial gradients:
  - Indigo: `rgba(129, 140, 248, 0.4)` at 20% 30%
  - Pink: `rgba(251, 146, 160, 0.35)` at 80% 20%
  - Blue: `rgba(96, 165, 250, 0.35)` at 50% 80%
  - Purple: `rgba(192, 132, 252, 0.3)` at 70% 60%

### Glass Effect
- Background: `rgba(255, 255, 255, 0.5)` to `rgba(255, 255, 255, 0.7)`
- `backdrop-filter: blur(20px)`
- Border: `1.5px solid rgba(255, 255, 255, 0.7)` to `rgba(255, 255, 255, 0.9)`
- Shadow: `0 8px 32px rgba(0, 0, 0, 0.06)`
- Border radius: `16px` for cards, `24px` for larger containers, `8px` for small elements like pills

### Typography
- Font: Inter (via `next/font`) with system font fallback
- Headings: bold weight, slate-900 (`#0f172a`), fluid sizing via `clamp()`
- Body: regular/light weight, slate-500 (`#475569`)
- Hero name: ~4rem–6rem fluid
- Section headings: ~2rem–3rem fluid
- Body text: ~1rem–1.125rem

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `bg-base` | `#f8fafc` | Page background |
| `text-heading` | `#0f172a` | Headings, name |
| `text-body` | `#475569` | Body text, descriptions |
| `text-muted` | `#94a3b8` | Subtle text, scroll indicator |
| `glass-fill` | `rgba(255,255,255,0.5–0.7)` | Glass card backgrounds |
| `glass-border` | `rgba(255,255,255,0.7–0.9)` | Glass card borders |
| `glass-shadow` | `rgba(0,0,0,0.06)` | Card shadows |

### Animations Inventory
| # | Animation | Trigger | Duration | Implementation |
|---|-----------|---------|----------|----------------|
| 1 | Hero text staggered fade-up | Page load | 0.6s per line, 0.1s stagger | Framer Motion `variants` with `staggerChildren` |
| 2 | Scroll indicator pulse | Page load (delayed) | Loop, 1.5s | CSS keyframe animation |
| 3 | Section heading fade-in | Scroll into view | 0.5s | Framer Motion `whileInView` |
| 4 | Card staggered entrance | Scroll into view | 0.5s per card, 0.1s stagger | Framer Motion `whileInView` + `staggerChildren` |
| 5 | Card hover lift | Mouse enter | 0.2s | Framer Motion `whileHover` or CSS transition |
| 6 | Card morph to detail page | Click | 0.5s ease | Framer Motion `layoutId` + `AnimatePresence` |
| 7 | Detail content staggered reveal | After morph completes | 0.4s per element, 0.1s stagger | Framer Motion `variants` with delay |
| 8 | Reverse morph on back | Back button click | 0.5s ease | Framer Motion `layoutId` reverse |

## Project Data Structure

```typescript
interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean; // featured projects get larger bento tiles
  thumbnail?: string; // path to screenshot/image
}
```

Placeholder projects will be included for visual testing, to be replaced with real data later.

## File Structure

```
app/
  layout.tsx          — root layout, fonts, global styles, mesh gradient bg
  page.tsx            — landing page (hero + projects section)
  projects/
    [slug]/
      page.tsx        — project detail template
components/
  Navbar.tsx          — frosted glass navigation bar
  Hero.tsx            — hero section with animated intro text
  ProjectGrid.tsx     — bento grid container
  ProjectCard.tsx     — individual glass card (carries layoutId)
  ProjectDetail.tsx   — project detail content (after morph)
  ScrollIndicator.tsx — animated scroll hint
  GlassButton.tsx     — reusable frosted glass button
  TechPill.tsx        — tech stack tag pill
lib/
  projects.ts         — project data array + type definitions
```

## Responsive Behavior

| Breakpoint | Grid Columns | Hero Text Size | Navigation |
|------------|-------------|----------------|------------|
| Mobile (<640px) | 1 column | ~2.5rem name | Hamburger or simplified |
| Tablet (640–1024px) | 2 columns | ~3.5rem name | Full nav bar |
| Desktop (>1024px) | 3 columns | ~5rem name | Full nav bar |

Featured projects span 2 columns on tablet+, full width on mobile.

## Out of Scope

- CMS integration (data is hardcoded for now)
- Contact form
- Blog
- Dark mode (light only for now)
- Analytics
- SEO optimization beyond basic meta tags
