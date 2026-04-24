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
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
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
