"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TECH_DESCRIPTIONS: Record<string, string> = {
  "React": "A declarative, component-based JavaScript library for building user interfaces. Maintained by Meta, it powers everything from simple widgets to full-scale SPAs.",
  "TypeScript": "A typed superset of JavaScript that compiles to plain JS. Catches bugs at compile-time and makes large codebases dramatically easier to navigate and refactor.",
  "Next.js": "A React framework with file-based routing, server-side rendering, static generation, and API routes built in. The go-to choice for production React apps.",
  "D3.js": "A data-driven document manipulation library that binds data to SVG elements. Used for custom, interactive charts and visualizations that CSS charts can't handle.",
  "WebSocket": "A persistent, full-duplex TCP protocol that lets browsers and servers push data to each other in real time — essential for live dashboards and multiplayer features.",
  "Python": "A high-level, dynamically typed language celebrated for its readability. Dominant in data science, machine learning, scripting, and rapid backend prototyping.",
  "FastAPI": "A modern Python web framework built on Starlette and Pydantic. Generates OpenAPI docs automatically and is one of the fastest Python frameworks available.",
  "LangChain": "A framework for composing LLM calls, retrieval pipelines, agents, and tools into coherent applications. Simplifies prompt management and model orchestration.",
  "PostgreSQL": "A powerful open-source relational database with full ACID compliance, JSON support, and an extensive extension ecosystem. The reliable backbone of most production backends.",
  "Storybook": "An isolated component development environment. Lets you build, document, and visually test UI components without running your whole app.",
  "CSS Variables": "Native custom properties in CSS that enable runtime theming, dynamic values, and design token systems without any build step or JavaScript dependency.",
  "Jest": "A zero-config JavaScript testing framework with built-in mocking, snapshot testing, and code coverage. The standard for testing React and Node.js projects.",
  "Go": "A statically typed, compiled language from Google designed for simplicity and performance. Excels at concurrent systems, CLIs, and high-throughput microservices.",
  "Redis": "An in-memory data structure store used as a cache, message broker, or session store. Microsecond-latency reads make it indispensable for performance-critical paths.",
  "gRPC": "A high-performance RPC framework that uses Protocol Buffers for serialisation. Strongly typed contracts and streaming support make it ideal for internal microservice comms.",
  "Prometheus": "An open-source metrics collection and alerting toolkit. Uses a pull model to scrape time-series data and integrates natively with Grafana dashboards.",
  "ProseMirror": "A low-level toolkit for building rich-text editors with a strict document schema. Powers collaborative editing via operational transforms or CRDT integrations.",
  "Node.js": "A server-side JavaScript runtime built on V8. Enables sharing code between frontend and backend and has a vast ecosystem via npm.",
  "Y.js": "A CRDT (Conflict-free Replicated Data Type) framework for shared data structures. Enables real-time collaborative editing without a central coordination server.",
  "Vue": "A progressive JavaScript framework for building UIs. Approachable for beginners, with a gentle learning curve and an optional Composition API for advanced patterns.",
  "Tailwind CSS": "A utility-first CSS framework that applies small, single-purpose classes directly in markup. Eliminates style conflicts and speeds up iteration significantly.",
  "Framer Motion": "A production-ready React animation library with a spring-physics engine, layout animations, and gesture support. Makes complex UI transitions straightforward.",
  "Docker": "A containerisation platform that packages apps and their dependencies into portable images. Guarantees consistent behaviour from dev to production.",
};

const TECH_CATEGORIES: Record<string, string> = {
  "React": "Frontend",
  "TypeScript": "Language",
  "Next.js": "Framework",
  "D3.js": "Visualisation",
  "WebSocket": "Protocol",
  "Python": "Language",
  "FastAPI": "Backend",
  "LangChain": "AI / ML",
  "PostgreSQL": "Database",
  "Storybook": "Tooling",
  "CSS Variables": "Styling",
  "Jest": "Testing",
  "Go": "Language",
  "Redis": "Infrastructure",
  "gRPC": "Protocol",
  "Prometheus": "Observability",
  "ProseMirror": "Editor",
  "Node.js": "Runtime",
  "Y.js": "Collaboration",
  "Vue": "Frontend",
  "Tailwind CSS": "Styling",
  "Framer Motion": "Animation",
  "Docker": "Infrastructure",
};

interface TechPillProps {
  label: string;
  interactive?: boolean;
}

export default function TechPill({ label, interactive = false }: TechPillProps) {
  const [open, setOpen] = useState(false);
  const description = TECH_DESCRIPTIONS[label] ?? "A tool used in this project.";
  const category = TECH_CATEGORIES[label] ?? "Tool";

  if (!interactive) {
    return (
      <span className="glass rounded-lg px-3 py-1 text-xs font-medium text-slate-600">
        {label}
      </span>
    );
  }

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="glass rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 cursor-pointer flex items-center gap-1.5 transition-all hover:bg-white/50 active:scale-95"
        style={{
          border: "1px solid rgba(255,255,255,0.5)",
        }}
      >
        {label}
        <svg
          className="w-3 h-3 text-slate-400 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed z-[61] left-1/2 top-1/2 liquid-glass-card"
              style={{
                width: "min(360px, calc(100vw - 48px))",
                borderRadius: 20,
                translateX: "-50%",
                translateY: "-50%",
              }}
              initial={{ opacity: 0, scale: 0.92, y: "-46%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%" }}
              exit={{ opacity: 0, scale: 0.92, y: "-46%" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                      {label}
                    </h3>
                    <span className="mt-1.5 inline-block glass rounded-full px-2.5 py-0.5 text-xs font-medium text-slate-500">
                      {category}
                    </span>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="flex-shrink-0 w-7 h-7 rounded-full glass flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {description}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
