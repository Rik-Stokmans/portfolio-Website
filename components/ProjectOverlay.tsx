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
