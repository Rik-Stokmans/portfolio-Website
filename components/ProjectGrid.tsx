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

  // Handle browser back button
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
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Projects
      </motion.h2>

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
              className={`${project.gridSize === "2x1" ? "md:col-span-2" : ""} ${project.gridSize === "1x2" ? "md:row-span-2" : ""}`}
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
