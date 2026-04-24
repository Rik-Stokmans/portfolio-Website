"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import TechPill from "./TechPill";
import GlassButton from "./GlassButton";

interface ProjectOverlayProps {
  project: Project;
  onClose: () => void;
}

const contentVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.25 },
  },
  exit: {
    transition: { duration: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export default function ProjectOverlay({
  project,
  onClose,
}: ProjectOverlayProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 bg-white/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />

      {/* Expanded card — shares layoutId with ProjectCard for morph */}
      <motion.div
        layoutId={`card-${project.slug}`}
        className="fixed inset-4 sm:inset-8 md:inset-12 z-50 glass rounded-3xl overflow-y-auto"
        style={{ borderRadius: 24 }}
        transition={{ layout: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }}
      >
        {/* Back button */}
        <div className="sticky top-0 z-10 p-4 sm:p-6">
          <motion.button
            onClick={onClose}
            className="glass rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15, duration: 0.2 }}
          >
            &larr; Back
          </motion.button>
        </div>

        {/* Detail content */}
        <motion.div
          className="px-6 sm:px-12 pb-12 max-w-3xl mx-auto"
          variants={contentVariants}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight"
          >
            {project.title}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg text-slate-500 leading-relaxed"
          >
            {project.longDescription}
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <TechPill key={t} label={t} />
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8 flex gap-4">
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
            variants={itemVariants}
            className="mt-12 w-full h-64 sm:h-80 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100"
          />
        </motion.div>
      </motion.div>
    </>
  );
}
