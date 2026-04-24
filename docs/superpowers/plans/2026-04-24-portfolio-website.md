# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimalist, animation-rich portfolio website with Apple liquid glass aesthetic, featuring a bento grid project showcase and card-morph page transitions.

**Architecture:** Next.js 15 App Router with client-side overlay pattern for card-morph transitions. Framer Motion handles all animations (layout, scroll-triggered, page transitions). Tailwind CSS v4 provides styling with custom glass utility classes. Project data lives in a TypeScript array.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, Inter font via next/font

---

## File Structure

```
app/
  layout.tsx              — root layout: fonts, global styles, mesh gradient background
  page.tsx                — landing page: composes Hero + ProjectGrid
  globals.css             — Tailwind directives + custom glass utilities + scroll indicator keyframes
  projects/
    [slug]/
      page.tsx            — direct-navigation fallback for project detail (no morph)
components/
  Navbar.tsx              — frosted glass fixed navigation bar
  Hero.tsx                — hero section with staggered fade-up intro text
  ScrollIndicator.tsx     — animated scroll-down chevron
  ProjectGrid.tsx         — bento grid container with scroll-triggered stagger
  ProjectCard.tsx         — individual glass card with layoutId + hover effects
  ProjectOverlay.tsx      — full-screen overlay for card morph detail view
  ProjectDetail.tsx       — project detail content (title, description, tech, links)
  TechPill.tsx            — frosted glass tech tag pill
  GlassButton.tsx         — frosted glass link button
lib/
  projects.ts             — Project type + placeholder data array
```

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

- [ ] **Step 1: Initialize Next.js with TypeScript and Tailwind**

Run:
```bash
cd "/Users/rikstokmans/Claude/Portfolio Website"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src=false --import-alias="@/*" --use-npm --yes
```

Expected: Project scaffolded with `app/` directory, `package.json`, `tailwind.config.ts`, etc.

- [ ] **Step 2: Install Framer Motion**

Run:
```bash
npm install framer-motion
```

Expected: `framer-motion` added to `package.json` dependencies.

- [ ] **Step 3: Install Inter font (verify next/font availability)**

Inter is included via `next/font/google` — no extra install needed. Verify by checking that `next` is in dependencies.

- [ ] **Step 4: Verify dev server starts**

Run:
```bash
npm run dev
```

Expected: Dev server starts on `http://localhost:3000` with no errors.

- [ ] **Step 5: Commit**

```bash
git init
echo "node_modules/\n.next/\n.superpowers/" > .gitignore
git add -A
git commit -m "chore: scaffold Next.js project with Tailwind and Framer Motion"
```

---

### Task 2: Global Styles and Mesh Gradient Background

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace globals.css with custom styles**

Replace the contents of `app/globals.css` with:

```css
@import "tailwindcss";

@layer base {
  body {
    background-color: #f8fafc;
    background-image:
      radial-gradient(ellipse at 20% 30%, rgba(129, 140, 248, 0.4) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(251, 146, 160, 0.35) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, rgba(96, 165, 250, 0.35) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 60%, rgba(192, 132, 252, 0.3) 0%, transparent 40%);
    background-attachment: fixed;
    min-height: 100vh;
    color: #0f172a;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@layer components {
  .glass {
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1.5px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  }

  .glass-hover {
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .glass-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.65);
  }
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}
```

- [ ] **Step 2: Update layout.tsx with Inter font and clean markup**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Software developer portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Replace page.tsx with a placeholder to verify styles**

Replace `app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="glass rounded-2xl p-8">
        <h1 className="text-4xl font-bold">Portfolio</h1>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Verify in browser**

Run: `npm run dev` (if not already running)
Open: `http://localhost:3000`
Expected: See a frosted glass card with "Portfolio" text centered on a colorful mesh gradient background.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx app/page.tsx
git commit -m "feat: add mesh gradient background and glass utility styles"
```

---

### Task 3: Project Data

**Files:**
- Create: `lib/projects.ts`

- [ ] **Step 1: Create project type and placeholder data**

Create `lib/projects.ts`:

```typescript
export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: "cloud-dashboard",
    title: "Cloud Dashboard",
    description: "Real-time infrastructure monitoring with interactive visualizations.",
    longDescription:
      "A comprehensive cloud infrastructure monitoring dashboard built for DevOps teams. Features real-time metrics, interactive charts, alerting, and multi-cloud support. Handles thousands of data points per second with smooth 60fps rendering.",
    tech: ["React", "TypeScript", "D3.js", "WebSocket"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
  },
  {
    slug: "ai-code-review",
    title: "AI Code Review",
    description: "Automated pull request analysis powered by large language models.",
    longDescription:
      "An AI-powered code review tool that integrates with GitHub. Analyzes pull requests for bugs, security vulnerabilities, and style issues. Provides inline suggestions with explanations and confidence scores.",
    tech: ["Python", "FastAPI", "LangChain", "PostgreSQL"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
  },
  {
    slug: "design-system",
    title: "Design System",
    description: "A component library with accessibility and theming built in.",
    longDescription:
      "A comprehensive design system with 40+ components, full WCAG 2.1 AA compliance, and runtime theme switching. Supports light/dark modes and custom brand themes. Published as an npm package with tree-shaking support.",
    tech: ["React", "Storybook", "CSS Variables", "Jest"],
    githubUrl: "https://github.com",
    featured: false,
  },
  {
    slug: "task-engine",
    title: "Task Engine",
    description: "Distributed task queue with retry logic and observability.",
    longDescription:
      "A high-throughput distributed task processing engine. Supports delayed execution, retries with exponential backoff, dead letter queues, and real-time observability via OpenTelemetry. Processes 10k+ tasks per minute.",
    tech: ["Go", "Redis", "gRPC", "Prometheus"],
    githubUrl: "https://github.com",
    featured: false,
  },
  {
    slug: "markdown-editor",
    title: "Markdown Editor",
    description: "Live-preview editor with collaboration and plugin support.",
    longDescription:
      "A real-time collaborative Markdown editor with live preview, syntax highlighting, and a plugin system. Supports custom renderers, keyboard shortcuts, and exports to PDF/HTML. Built with operational transforms for conflict-free editing.",
    tech: ["TypeScript", "ProseMirror", "Node.js", "Y.js"],
    liveUrl: "https://example.com",
    featured: false,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/projects.ts
git commit -m "feat: add project data types and placeholder content"
```

---

### Task 4: Navbar Component

**Files:**
- Create: `components/Navbar.tsx`

- [ ] **Step 1: Create the frosted glass navbar**

Create `components/Navbar.tsx`:

```tsx
"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-t-0 border-x-0 rounded-none">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-slate-900">
          Rik Stokmans
        </Link>
        <div className="flex gap-6">
          <a
            href="#projects"
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            Projects
          </a>
          <a
            href="#contact"
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat: add frosted glass navbar component"
```

---

### Task 5: Hero Component

**Files:**
- Create: `components/Hero.tsx`
- Create: `components/ScrollIndicator.tsx`

- [ ] **Step 1: Create the scroll indicator**

Create `components/ScrollIndicator.tsx`:

```tsx
"use client";

export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-slate-400"
        style={{ animation: "bounce-subtle 1.5s ease-in-out infinite" }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Create the hero with staggered animations**

Create `components/Hero.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import ScrollIndicator from "./ScrollIndicator";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <motion.div
        className="text-center max-w-2xl"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          variants={item}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight"
        >
          Rik Stokmans
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-6 text-lg sm:text-xl text-slate-500 font-light"
        >
          Software developer.
        </motion.p>
        <motion.p
          variants={item}
          className="mt-2 text-lg sm:text-xl text-slate-500 font-light"
        >
          Building clean, thoughtful software.
        </motion.p>
        <motion.p
          variants={item}
          className="mt-2 text-lg sm:text-xl text-slate-500 font-light"
        >
          Based in the Netherlands.
        </motion.p>
      </motion.div>
      <ScrollIndicator />
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx components/ScrollIndicator.tsx
git commit -m "feat: add hero section with staggered fade-up animation"
```

---

### Task 6: TechPill and GlassButton Components

**Files:**
- Create: `components/TechPill.tsx`
- Create: `components/GlassButton.tsx`

- [ ] **Step 1: Create TechPill**

Create `components/TechPill.tsx`:

```tsx
export default function TechPill({ label }: { label: string }) {
  return (
    <span className="glass rounded-lg px-3 py-1 text-xs font-medium text-slate-600">
      {label}
    </span>
  );
}
```

- [ ] **Step 2: Create GlassButton**

Create `components/GlassButton.tsx`:

```tsx
import Link from "next/link";

interface GlassButtonProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

export default function GlassButton({
  href,
  children,
  external,
}: GlassButtonProps) {
  const className =
    "glass glass-hover rounded-xl px-5 py-2.5 text-sm font-medium text-slate-700 inline-block";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/TechPill.tsx components/GlassButton.tsx
git commit -m "feat: add TechPill and GlassButton shared components"
```

---

### Task 7: ProjectCard Component

**Files:**
- Create: `components/ProjectCard.tsx`

- [ ] **Step 1: Create the glass project card with layoutId**

Create `components/ProjectCard.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import TechPill from "./TechPill";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <motion.div
      layoutId={`card-${project.slug}`}
      onClick={onClick}
      className={`glass glass-hover rounded-2xl p-6 cursor-pointer ${
        project.featured ? "md:col-span-2" : ""
      }`}
      style={{ borderRadius: 16 }}
    >
      <motion.div layoutId={`card-content-${project.slug}`}>
        {/* Thumbnail placeholder */}
        <div className="w-full h-32 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 mb-4" />
        <motion.h3
          layoutId={`card-title-${project.slug}`}
          className="text-xl font-bold text-slate-900"
        >
          {project.title}
        </motion.h3>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <TechPill key={t} label={t} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ProjectCard.tsx
git commit -m "feat: add ProjectCard with glass styling and Framer layoutId"
```

---

### Task 8: ProjectDetail Component

**Files:**
- Create: `components/ProjectDetail.tsx`

- [ ] **Step 1: Create the project detail content**

Create `components/ProjectDetail.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import TechPill from "./TechPill";
import GlassButton from "./GlassButton";

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.4 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <motion.div
      className="max-w-3xl mx-auto"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.h1
        layoutId={`card-title-${project.slug}`}
        className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight"
      >
        {project.title}
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="mt-6 text-lg text-slate-500 leading-relaxed"
      >
        {project.longDescription}
      </motion.p>

      <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <TechPill key={t} label={t} />
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="mt-8 flex gap-4">
        {project.liveUrl && (
          <GlassButton href={project.liveUrl} external>
            Live Site
          </GlassButton>
        )}
        {project.githubUrl && (
          <GlassButton href={project.githubUrl} external>
            GitHub
          </GlassButton>
        )}
      </motion.div>

      {/* Screenshot placeholder */}
      <motion.div
        variants={fadeUp}
        className="mt-12 w-full h-64 sm:h-80 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200"
      />
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ProjectDetail.tsx
git commit -m "feat: add ProjectDetail with staggered content reveal"
```

---

### Task 9: ProjectOverlay (Card Morph Transition)

**Files:**
- Create: `components/ProjectOverlay.tsx`

- [ ] **Step 1: Create the full-screen overlay with morph animation**

Create `components/ProjectOverlay.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import ProjectDetail from "./ProjectDetail";

interface ProjectOverlayProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectOverlay({
  project,
  onClose,
}: ProjectOverlayProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 bg-slate-50/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Expanded card */}
      <motion.div
        layoutId={`card-${project.slug}`}
        className="fixed inset-4 sm:inset-8 md:inset-12 z-50 glass rounded-3xl overflow-y-auto"
        style={{ borderRadius: 24 }}
      >
        {/* Back button */}
        <div className="sticky top-0 z-10 p-4 sm:p-6">
          <button
            onClick={onClose}
            className="glass rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            &larr; Back
          </button>
        </div>

        {/* Detail content */}
        <div className="px-6 sm:px-12 pb-12">
          <ProjectDetail project={project} />
        </div>
      </motion.div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ProjectOverlay.tsx
git commit -m "feat: add ProjectOverlay with card morph layoutId transition"
```

---

### Task 10: ProjectGrid Component

**Files:**
- Create: `components/ProjectGrid.tsx`

- [ ] **Step 1: Create the bento grid with scroll-triggered stagger and overlay state**

Create `components/ProjectGrid.tsx`:

```tsx
"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/lib/projects";
import ProjectCard from "./ProjectCard";
import ProjectOverlay from "./ProjectOverlay";
import type { Project } from "@/lib/projects";

const gridContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const gridItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function ProjectGrid() {
  const [selected, setSelected] = useState<Project | null>(null);

  const openProject = useCallback((project: Project) => {
    setSelected(project);
    window.history.pushState({}, "", `/projects/${project.slug}`);
  }, []);

  const closeProject = useCallback(() => {
    setSelected(null);
    window.history.pushState({}, "", "/");
  }, []);

  return (
    <section id="projects" className="px-6 pb-24 max-w-6xl mx-auto">
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Projects
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={gridContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {projects.map((project) => (
          <motion.div key={project.slug} variants={gridItem}>
            <ProjectCard project={project} onClick={() => openProject(project)} />
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selected && (
          <ProjectOverlay project={selected} onClose={closeProject} />
        )}
      </AnimatePresence>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ProjectGrid.tsx
git commit -m "feat: add ProjectGrid with bento layout, scroll stagger, and overlay state"
```

---

### Task 11: Assemble Landing Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Compose the landing page from all components**

Replace `app/page.tsx` with:

```tsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProjectGrid />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Verify in browser**

Run: `npm run dev` (if not already running)
Open: `http://localhost:3000`

Expected:
- Frosted glass navbar fixed at top
- Hero section with name and intro text fading in on load
- Scroll indicator chevron bouncing at bottom of hero
- Scrolling down reveals "Projects" heading and bento grid cards staggering in
- First 2 cards (featured) span 2 columns on desktop
- Hovering a card lifts it with shadow
- Clicking a card opens the overlay with morph animation
- Clicking "Back" or the backdrop closes with reverse morph

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble landing page with hero and project grid"
```

---

### Task 12: Direct Navigation Fallback Page

**Files:**
- Create: `app/projects/[slug]/page.tsx`

- [ ] **Step 1: Create the fallback project detail page**

This page handles direct URL navigation to `/projects/[slug]` (no morph animation).

Create `app/projects/[slug]/page.tsx`:

```tsx
import { projects, getProject } from "@/lib/projects";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProjectDetailFallback from "./ProjectDetailFallback";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 px-6 pb-24 min-h-screen">
        <ProjectDetailFallback project={project} />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Create the fallback detail component (no layoutId)**

Create `app/projects/[slug]/ProjectDetailFallback.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import TechPill from "@/components/TechPill";
import GlassButton from "@/components/GlassButton";

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function ProjectDetailFallback({
  project,
}: {
  project: Project;
}) {
  return (
    <motion.div
      className="max-w-3xl mx-auto glass rounded-3xl p-8 sm:p-12"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <GlassButton href="/">&larr; Back</GlassButton>

      <motion.h1
        variants={fadeUp}
        className="mt-8 text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight"
      >
        {project.title}
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="mt-6 text-lg text-slate-500 leading-relaxed"
      >
        {project.longDescription}
      </motion.p>

      <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <TechPill key={t} label={t} />
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="mt-8 flex gap-4">
        {project.liveUrl && (
          <GlassButton href={project.liveUrl} external>
            Live Site
          </GlassButton>
        )}
        {project.githubUrl && (
          <GlassButton href={project.githubUrl} external>
            GitHub
          </GlassButton>
        )}
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="mt-12 w-full h-64 sm:h-80 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200"
      />
    </motion.div>
  );
}
```

- [ ] **Step 3: Verify in browser**

Open: `http://localhost:3000/projects/cloud-dashboard` directly.

Expected: Project detail page renders in a glass container with staggered fade-in, back button links to home. No morph animation (that's only from the grid).

- [ ] **Step 4: Commit**

```bash
git add app/projects/
git commit -m "feat: add direct-navigation fallback for project detail pages"
```

---

### Task 13: Polish and Final Verification

**Files:**
- Possibly tweak any of the above files

- [ ] **Step 1: Full flow test in browser**

Open: `http://localhost:3000`

Test checklist:
1. Hero text fades in with stagger on load
2. Scroll indicator bounces at bottom of hero
3. Scrolling reveals "Projects" heading with fade-in
4. Project cards stagger in as they enter viewport
5. Hovering a card lifts it with stronger shadow
6. Clicking a featured card (Cloud Dashboard) opens overlay with morph
7. Detail content fades in after morph completes
8. Clicking "Back" reverses the morph animation
9. Clicking a non-featured card also works
10. Direct navigation to `/projects/cloud-dashboard` shows fallback page
11. Back button on fallback page returns to home
12. Responsive: resize to tablet (2 cols) and mobile (1 col)
13. Navbar stays fixed and frosted on scroll

- [ ] **Step 2: Fix any issues found**

Address any visual or animation bugs discovered during testing.

- [ ] **Step 3: Build check**

Run:
```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: polish and verify full portfolio site"
```
