"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import TechPill from "./TechPill";
import GlassButton from "./GlassButton";

interface ProjectOverlayProps {
  project: Project;
  onClose: () => void;
}

// Two-phase close:
// Phase 1: content fades out bottom-to-top (reverse stagger) ~250ms
// Phase 2: box morphs back to card position ~400ms
// Total close: ~650ms (feels snappy because content disappears fast)

export default function ProjectOverlay({
  project,
  onClose,
}: ProjectOverlayProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    // Phase 1 runs for ~280ms, then we unmount to trigger Phase 2 (layoutId morph)
    setTimeout(() => {
      onClose();
    }, 280);
  }, [isClosing, onClose]);

  // Content items — reversed order for bottom-to-top exit
  const items = [
    // index 0 = title (top), index 4 = screenshot (bottom)
    { key: "title", delay: 4 },  // exits last (top)
    { key: "desc", delay: 3 },
    { key: "tech", delay: 2 },
    { key: "links", delay: 1 },
    { key: "screenshot", delay: 0 },  // exits first (bottom)
  ];

  const getItemStyle = (exitOrder: number) => ({
    opacity: isClosing ? 0 : 1,
    y: isClosing ? -8 : 0,
    transition: `opacity ${isClosing ? "0.15s" : "0.3s"} ${isClosing ? `${exitOrder * 0.035}s` : "0s"} ease, transform ${isClosing ? "0.15s" : "0.3s"} ${isClosing ? `${exitOrder * 0.035}s` : "0s"} ease`,
  });

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 bg-white/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: isClosing ? 0.3 : 0.25 }}
        onClick={handleClose}
      />

      {/* Expanded card */}
      <motion.div
        layoutId={`card-${project.slug}`}
        className="fixed inset-4 sm:inset-8 md:inset-12 z-50 glass rounded-3xl overflow-y-auto"
        style={{ borderRadius: 24 }}
        transition={{ layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
      >
        {/* Back button */}
        <div className="sticky top-0 z-10 p-4 sm:p-6">
          <motion.button
            onClick={handleClose}
            className="glass rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.2 }}
            style={{
              opacity: isClosing ? 0 : undefined,
              transition: isClosing ? "opacity 0.1s ease" : undefined,
            }}
          >
            &larr; Back
          </motion.button>
        </div>

        {/* Detail content — staggered entrance, reverse-staggered exit */}
        <div className="px-6 sm:px-12 pb-12 max-w-3xl mx-auto">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3, ease: "easeOut" }}
            style={getItemStyle(items[0].delay)}
          >
            {project.title}
          </motion.h1>

          <motion.p
            className="mt-6 text-lg text-slate-500 leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.31, duration: 0.3, ease: "easeOut" }}
            style={getItemStyle(items[1].delay)}
          >
            {project.longDescription}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.37, duration: 0.3, ease: "easeOut" }}
            style={getItemStyle(items[2].delay)}
          >
            {project.tech.map((t) => (
              <TechPill key={t} label={t} />
            ))}
          </motion.div>

          <motion.div
            className="mt-8 flex gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.43, duration: 0.3, ease: "easeOut" }}
            style={getItemStyle(items[3].delay)}
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
            className="mt-12 w-full h-64 sm:h-80 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.49, duration: 0.3, ease: "easeOut" }}
            style={getItemStyle(items[4].delay)}
          />
        </div>
      </motion.div>
    </>
  );
}
