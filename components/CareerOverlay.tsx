"use client";

import { motion } from "framer-motion";

export interface CareerItem {
  year: string;
  role: string;
  company: string;
  description: string;
  highlights: string[];
  type: "work" | "education";
}

interface CareerOverlayProps {
  item: CareerItem;
  index: number;
  onClose: () => void;
}

const STAGGER = 0.06;
const ITEM_DURATION = 0.3;
const DELAY_BASE = 0.3;

const contentVariants = {
  open: {
    opacity: 1,
    transition: { staggerChildren: STAGGER, delayChildren: DELAY_BASE },
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
  closed: { opacity: 0, y: 12 },
};

export default function CareerOverlay({ item, index, onClose }: CareerOverlayProps) {
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

      {/* Morphing shell */}
      <motion.div
        layoutId={`career-item-${index}`}
        className="fixed inset-4 sm:inset-8 md:inset-12 z-50 overflow-hidden liquid-glass-card"
        style={{ borderRadius: 24, willChange: "transform", backfaceVisibility: "hidden" }}
        transition={{ layout: { type: "spring", stiffness: 220, damping: 28 } }}
      >
        {/* Content */}
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

          <div className="px-6 sm:px-12 pb-12 max-w-3xl mx-auto">
            {/* Type badge */}
            <motion.div variants={itemVariants}>
              <span className="glass rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {item.type === "work" ? "Work" : "Education"}
              </span>
            </motion.div>

            {/* Role */}
            <motion.h1
              variants={itemVariants}
              className="mt-4 text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight"
            >
              {item.role}
            </motion.h1>

            {/* Company + year */}
            <motion.div
              variants={itemVariants}
              className="mt-3 flex items-center gap-3"
            >
              <span className="text-xl font-medium text-slate-600">{item.company}</span>
              <span className="text-slate-300">·</span>
              <span className="glass rounded-full px-3 py-1 text-sm font-medium text-slate-500">
                {item.year}
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="mt-8 text-lg text-slate-500 leading-relaxed"
            >
              {item.description}
            </motion.p>

            {/* Highlights */}
            {item.highlights.length > 0 && (
              <motion.div variants={itemVariants} className="mt-8">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">
                  Highlights
                </h2>
                <ul className="flex flex-col gap-3">
                  {item.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
