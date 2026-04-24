"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import TechPill from "./TechPill";
import GlassButton from "./GlassButton";

interface ProjectOverlayProps {
  project: Project;
  onClose: () => void;
}

const STAGGER = 0.06;
const ITEM_DURATION = 0.3;
const DELAY_BASE = 0.3;

// Content wrapper: fades in staggered on open, fades out all at once on close
const contentVariants = {
  open: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER,
      delayChildren: DELAY_BASE,
    },
  },
  closed: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: ITEM_DURATION, ease: "easeOut" as const },
  },
  closed: {
    opacity: 0,
    y: 12,
  },
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
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />

      {/* Morphing shell — as lightweight as possible for smooth transforms */}
      <motion.div
        layoutId={`card-${project.slug}`}
        className="fixed inset-4 sm:inset-8 md:inset-12 z-50 overflow-hidden liquid-glass-card"
        style={{
          borderRadius: 24,
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
        transition={{ layout: { type: "spring", stiffness: 220, damping: 28 } }}
      >
        {/* Content layer — fades independently from morph */}
        <motion.div
          className="h-full overflow-y-auto"
          style={{ borderRadius: 24 }}
          variants={contentVariants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          {/* Back button */}
          <div className="sticky top-0 z-10 p-4 sm:p-6">
            <motion.button
              variants={itemVariants}
              onClick={onClose}
              className="glass-button rounded-xl px-4 py-2 text-sm font-medium text-slate-600 cursor-pointer"
            >
              &larr; Back
            </motion.button>
          </div>

          {/* Detail content */}
          <div className="px-6 sm:px-12 pb-12 max-w-3xl mx-auto">
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

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap gap-2"
            >
              {project.tech.map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex gap-4"
            >
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
              variants={itemVariants}
              className="mt-12 w-full h-64 sm:h-80 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100"
            />
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
