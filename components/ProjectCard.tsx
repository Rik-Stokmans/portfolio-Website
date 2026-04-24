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
      className="glass card-hover rounded-2xl p-5 cursor-pointer h-full flex flex-col"
      style={{ borderRadius: 16 }}
      transition={{ layout: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }}
    >
      {/* Thumbnail placeholder — takes remaining space */}
      <div className="flex-1 min-h-0 rounded-xl bg-gradient-to-br from-slate-50/80 to-slate-100/60 mb-4" />

      {/* Text content pinned to bottom */}
      <div className="shrink-0">
        <h3 className="text-lg font-bold text-slate-900 leading-tight">
          {project.title}
        </h3>
        <p className="mt-1.5 text-sm text-slate-500 leading-relaxed line-clamp-2">
          {project.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 3).map((t) => (
            <TechPill key={t} label={t} />
          ))}
          {project.tech.length > 3 && (
            <span className="text-xs text-slate-400 self-center">
              +{project.tech.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
