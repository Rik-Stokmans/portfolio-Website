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
      className="cursor-pointer h-full overflow-hidden liquid-glass-card"
      style={{
        borderRadius: 16,
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
      animate={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(255,255,255,0.2)",
      }}
      whileHover={{
        y: -6,
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(255,255,255,0.4)",
      }}
      whileTap={{
        y: -2,
        scale: 0.985,
      }}
      transition={{
        layout: { type: "spring", stiffness: 220, damping: 28 },
        y: { type: "spring", stiffness: 300, damping: 22 },
        boxShadow: { duration: 0.25, ease: "easeOut" },
        scale: { type: "spring", stiffness: 400, damping: 25 },
      }}
    >
      <div className="h-full p-5 flex flex-col" style={{ borderRadius: 16 }}>
        {/* Thumbnail placeholder */}
        <div className="flex-1 min-h-0 rounded-xl bg-gradient-to-br from-slate-50/80 to-slate-100/60 mb-4" />

        {/* Text content pinned to bottom */}
        <div className="shrink-0">
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            {project.title}
          </h3>
          <p className="mt-1.5 text-sm text-slate-500 leading-relaxed line-clamp-2">
            {project.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
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
      </div>
    </motion.div>
  );
}
