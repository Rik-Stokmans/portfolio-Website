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

// ── Animation design ──────────────────────────────────────────────
//
// OPEN (what the user already likes):
//   1. Box morphs from card tile → full screen (0.4s, ease)
//   2. Content appears top → bottom, staggered:
//      Each item: opacity 0→1, y 12→0, easeOut, 0.3s, 60ms stagger
//      First content delay: 0.3s (waits for box morph)
//
// CLOSE (exact inverse, slightly faster):
//   1. Content disappears bottom → top, staggered:
//      Each item: opacity 1→0, y 0→12 (slides BACK DOWN where it came from)
//      easeIn (accelerates away — mirror of easeOut), 0.2s, 45ms stagger
//   2. After content fully gone, box morphs full screen → card tile (0.4s)
//
// The y direction on close is +12 (down), NOT -12 (up). This is what
// makes it feel like a true rewind rather than a different animation.
// ──────────────────────────────────────────────────────────────────

const ITEMS_COUNT = 6; // back btn + title + desc + tech + links + screenshot
const OPEN_DELAY_BASE = 0.3;
const OPEN_STAGGER = 0.06;
const OPEN_DURATION = 0.3;

const CLOSE_STAGGER = 0.045;
const CLOSE_DURATION = 0.2;
// Total time for all content to fade: last item delay + its duration
const CLOSE_TOTAL = (ITEMS_COUNT - 1) * CLOSE_STAGGER + CLOSE_DURATION; // ~0.425s

export default function ProjectOverlay({
  project,
  onClose,
}: ProjectOverlayProps) {
  const [phase, setPhase] = useState<"open" | "closing">("open");

  const handleClose = useCallback(() => {
    if (phase === "closing") return;
    setPhase("closing");
    // After content fades out, unmount → triggers layoutId reverse morph
    setTimeout(onClose, CLOSE_TOTAL * 1000 + 20);
  }, [phase, onClose]);

  // Each content item gets an index (0 = back button at top, 5 = screenshot at bottom)
  // Open: index 0 animates first (top → bottom)
  // Close: index 5 animates first (bottom → top) — exact reverse
  function itemAnimate(index: number) {
    if (phase === "closing") {
      const reverseIndex = ITEMS_COUNT - 1 - index; // 5→0, 4→1, etc.
      return {
        opacity: 0,
        y: 12, // slides back DOWN (where it originally came from)
        transition: {
          duration: CLOSE_DURATION,
          delay: reverseIndex * CLOSE_STAGGER,
          ease: [0.4, 0, 1, 1] as const, // easeIn — mirror of easeOut
        },
      };
    }
    return {
      opacity: 1,
      y: 0,
      transition: {
        duration: OPEN_DURATION,
        delay: OPEN_DELAY_BASE + index * OPEN_STAGGER,
        ease: [0, 0, 0.2, 1] as const, // easeOut
      },
    };
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 bg-white/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "closing" ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: phase === "closing" ? CLOSE_TOTAL : 0.25 }}
        onClick={handleClose}
      />

      {/* Expanded card — layoutId morphs to/from ProjectCard */}
      <motion.div
        layoutId={`card-${project.slug}`}
        className="fixed inset-4 sm:inset-8 md:inset-12 z-50 glass rounded-3xl overflow-y-auto"
        style={{ borderRadius: 24 }}
        transition={{ layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
      >
        {/* Back button (index 0) */}
        <div className="sticky top-0 z-10 p-4 sm:p-6">
          <motion.button
            onClick={handleClose}
            className="glass rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            initial={{ opacity: 0, y: -8 }}
            animate={itemAnimate(0)}
          >
            &larr; Back
          </motion.button>
        </div>

        {/* Detail content */}
        <div className="px-6 sm:px-12 pb-12 max-w-3xl mx-auto">
          {/* Title (index 1) */}
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            animate={itemAnimate(1)}
          >
            {project.title}
          </motion.h1>

          {/* Description (index 2) */}
          <motion.p
            className="mt-6 text-lg text-slate-500 leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={itemAnimate(2)}
          >
            {project.longDescription}
          </motion.p>

          {/* Tech pills (index 3) */}
          <motion.div
            className="mt-8 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 12 }}
            animate={itemAnimate(3)}
          >
            {project.tech.map((t) => (
              <TechPill key={t} label={t} />
            ))}
          </motion.div>

          {/* Links (index 4) */}
          <motion.div
            className="mt-8 flex gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={itemAnimate(4)}
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

          {/* Screenshot placeholder (index 5) */}
          <motion.div
            className="mt-12 w-full h-64 sm:h-80 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100"
            initial={{ opacity: 0, y: 12 }}
            animate={itemAnimate(5)}
          />
        </div>
      </motion.div>
    </>
  );
}
