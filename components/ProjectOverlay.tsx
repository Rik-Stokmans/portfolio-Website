"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import type { Project } from "@/lib/projects";
import TechPill from "./TechPill";
import GlassButton from "./GlassButton";

interface ProjectOverlayProps {
  project: Project;
  onClose: () => void;
}

// Animation config — close is the exact inverse of open but faster
const OPEN_STAGGER = 0.06; // delay between each content item on open
const OPEN_DURATION = 0.3; // each item's fade-in duration
const OPEN_CONTENT_DELAY = 0.3; // wait for box morph before content appears

const CLOSE_STAGGER = 0.04; // slightly faster stagger on close
const CLOSE_DURATION = 0.18; // faster fade-out
const CLOSE_TOTAL_ITEMS = 6; // back button + 5 content items
const CLOSE_CONTENT_TIME = CLOSE_STAGGER * (CLOSE_TOTAL_ITEMS - 1) + CLOSE_DURATION; // ~0.38s

const EASE_OUT = [0, 0, 0.2, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

export default function ProjectOverlay({
  project,
  onClose,
}: ProjectOverlayProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    // Wait for content to fully fade out, then unmount to trigger layoutId morph back
    setTimeout(onClose, CLOSE_CONTENT_TIME * 1000 + 30);
  }, [isClosing, onClose]);

  // Content items with their open/close delay indices
  // Open: top to bottom (title first, screenshot last)
  // Close: bottom to top (screenshot first, title last) — exact inverse
  const contentItems = useMemo(() => [
    { id: "back", openIndex: 0, closeIndex: 5 },
    { id: "title", openIndex: 1, closeIndex: 4 },
    { id: "desc", openIndex: 2, closeIndex: 3 },
    { id: "tech", openIndex: 3, closeIndex: 2 },
    { id: "links", openIndex: 4, closeIndex: 1 },
    { id: "screenshot", openIndex: 5, closeIndex: 0 },
  ], []);

  function getAnimate(openIndex: number, closeIndex: number) {
    if (isClosing) {
      return {
        opacity: 0,
        y: -12,
        transition: {
          duration: CLOSE_DURATION,
          delay: closeIndex * CLOSE_STAGGER,
          ease: EASE_IN,
        },
      };
    }
    return {
      opacity: 1,
      y: 0,
      transition: {
        duration: OPEN_DURATION,
        delay: OPEN_CONTENT_DELAY + openIndex * OPEN_STAGGER,
        ease: EASE_OUT,
      },
    };
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 bg-white/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: isClosing ? 0.35 : 0.25 }}
        onClick={handleClose}
      />

      {/* Expanded card — layoutId morphs to/from ProjectCard */}
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
            animate={getAnimate(
              contentItems[0].openIndex,
              contentItems[0].closeIndex
            )}
          >
            &larr; Back
          </motion.button>
        </div>

        {/* Detail content */}
        <div className="px-6 sm:px-12 pb-12 max-w-3xl mx-auto">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            animate={getAnimate(
              contentItems[1].openIndex,
              contentItems[1].closeIndex
            )}
          >
            {project.title}
          </motion.h1>

          <motion.p
            className="mt-6 text-lg text-slate-500 leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={getAnimate(
              contentItems[2].openIndex,
              contentItems[2].closeIndex
            )}
          >
            {project.longDescription}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 12 }}
            animate={getAnimate(
              contentItems[3].openIndex,
              contentItems[3].closeIndex
            )}
          >
            {project.tech.map((t) => (
              <TechPill key={t} label={t} />
            ))}
          </motion.div>

          <motion.div
            className="mt-8 flex gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={getAnimate(
              contentItems[4].openIndex,
              contentItems[4].closeIndex
            )}
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

          {/* Screenshot placeholder */}
          <motion.div
            className="mt-12 w-full h-64 sm:h-80 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100"
            initial={{ opacity: 0, y: 12 }}
            animate={getAnimate(
              contentItems[5].openIndex,
              contentItems[5].closeIndex
            )}
          />
        </div>
      </motion.div>
    </>
  );
}
