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
    slug: "cloud-dashboard",
    title: "Cloud Dashboard",
    description: "Real-time infrastructure monitoring with interactive visualizations.",
    longDescription:
      "A comprehensive cloud infrastructure monitoring dashboard built for DevOps teams. Features real-time metrics, interactive charts, alerting, and multi-cloud support. Handles thousands of data points per second with smooth 60fps rendering.",
    tech: ["React", "TypeScript", "D3.js", "WebSocket"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    gridSize: "2x2",
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
    gridSize: "1x2",
  },
  {
    slug: "design-system",
    title: "Design System",
    description: "A component library with accessibility and theming built in.",
    longDescription:
      "A comprehensive design system with 40+ components, full WCAG 2.1 AA compliance, and runtime theme switching. Supports light/dark modes and custom brand themes. Published as an npm package with tree-shaking support.",
    tech: ["React", "Storybook", "CSS Variables", "Jest"],
    githubUrl: "https://github.com",
    gridSize: "1x1",
  },
  {
    slug: "task-engine",
    title: "Task Engine",
    description: "Distributed task queue with retry logic and observability.",
    longDescription:
      "A high-throughput distributed task processing engine. Supports delayed execution, retries with exponential backoff, dead letter queues, and real-time observability via OpenTelemetry. Processes 10k+ tasks per minute.",
    tech: ["Go", "Redis", "gRPC", "Prometheus"],
    githubUrl: "https://github.com",
    gridSize: "1x1",
  },
  {
    slug: "markdown-editor",
    title: "Markdown Editor",
    description: "Live-preview editor with collaboration and plugin support.",
    longDescription:
      "A real-time collaborative Markdown editor with live preview, syntax highlighting, and a plugin system. Supports custom renderers, keyboard shortcuts, and exports to PDF/HTML. Built with operational transforms for conflict-free editing.",
    tech: ["TypeScript", "ProseMirror", "Node.js", "Y.js"],
    liveUrl: "https://example.com",
    gridSize: "1x1",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
