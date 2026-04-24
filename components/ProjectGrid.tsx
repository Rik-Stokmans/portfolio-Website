"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
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
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function gridClasses(size: string): string {
  switch (size) {
    case "1x2":
      return "md:row-span-2";
    case "2x2":
      return "md:col-span-2 md:row-span-2";
    default:
      return "";
  }
}

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

  useEffect(() => {
    function onPopState() {
      if (window.location.pathname === "/") {
        setSelected(null);
      }
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <section id="projects" className="px-6 pb-24 max-w-6xl mx-auto">
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Selected work
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Projects</h2>
      </motion.div>

      <LayoutGroup>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px]"
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.slug}
              variants={gridItem}
              className={gridClasses(project.gridSize)}
            >
              <ProjectCard project={project} onClick={() => openProject(project)} />
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {selected && (
            <ProjectOverlay project={selected} onClose={closeProject} />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </section>
  );
}
