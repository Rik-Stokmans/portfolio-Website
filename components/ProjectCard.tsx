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
      className={`glass glass-hover rounded-2xl p-6 cursor-pointer ${
        project.featured ? "md:col-span-2" : ""
      }`}
      style={{ borderRadius: 16 }}
    >
      <motion.div layoutId={`card-content-${project.slug}`}>
        {/* Thumbnail placeholder */}
        <div className="w-full h-32 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 mb-4" />
        <motion.h3
          layoutId={`card-title-${project.slug}`}
          className="text-xl font-bold text-slate-900"
        >
          {project.title}
        </motion.h3>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <TechPill key={t} label={t} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
