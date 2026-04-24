export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  /** Grid span: "1x1" = default, "1x2" = 1 col 2 rows tall, "2x2" = 2 cols 2 rows */
  gridSize: "1x1" | "1x2" | "2x2";
}

export const projects: Project[] = [
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    description: "This portfolio — a Next.js site with liquid-glass UI and custom cursor morphing.",
    longDescription:
      "A personal portfolio built with Next.js 16, TypeScript, Tailwind CSS v4, and Framer Motion. Features a custom WebGL liquid-glass filter, magnetic cursor that morphs into interactive elements, a bento-grid project gallery with animated overlays, and a dot-grid hero section. Designed to showcase UI craftsmanship while remaining fully accessible.",
    tech: ["Next.js", "TypeScript", "Framer Motion", "Tailwind CSS"],
    liveUrl: "https://rikstokmans.com",
    githubUrl: "https://github.com/Rik-Stokmans/portfolio-Website",
    gridSize: "2x2",
  },
  {
    slug: "munchie",
    title: "Munchie",
    description: "Recipe discovery app with smart ingredient-based search and meal planning.",
    longDescription:
      "A full-stack recipe platform that lets users search by ingredients they already have, save favourites, and auto-generate weekly meal plans. Built with a Next.js frontend and a Node.js/Express API backed by PostgreSQL. Features fuzzy ingredient matching, nutritional breakdowns, and a responsive mobile-first UI.",
    tech: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    githubUrl: "https://github.com/Rik-Stokmans/munchie",
    gridSize: "1x2",
  },
  {
    slug: "boids-simulation",
    title: "Boids Simulation",
    description: "Interactive WebGL flocking simulation with real-time parameter controls.",
    longDescription:
      "A browser-based implementation of Craig Reynolds' Boids algorithm rendered in real time with WebGL. Supports thousands of agents at 60 fps by running separation, alignment, and cohesion rules in parallel on the GPU. Users can tweak every parameter live via a floating control panel and observe emergent flocking behaviour instantly.",
    tech: ["TypeScript", "WebGL", "Canvas API", "Vite"],
    githubUrl: "https://github.com/Rik-Stokmans/boids-simulation",
    gridSize: "1x1",
  },
  {
    slug: "timetable-solver",
    title: "Timetable Solver",
    description: "Constraint-satisfaction timetable generator for university course scheduling.",
    longDescription:
      "A command-line tool and small web UI that generates conflict-free timetables from a set of courses, rooms, and lecturer availability constraints. Uses a backtracking CSP solver with forward-checking and arc-consistency pruning. Exports results as iCal files and supports soft constraints such as preferred time-of-day windows.",
    tech: ["Python", "FastAPI", "React", "TypeScript"],
    githubUrl: "https://github.com/Rik-Stokmans/timetable-solver",
    gridSize: "1x1",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
