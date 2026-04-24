"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CareerOverlay, { type CareerItem } from "./CareerOverlay";

const careerItems: CareerItem[] = [
  {
    year: "2024 – Present",
    role: "Full-Stack Developer",
    company: "Freelance",
    description:
      "Building web applications and automation tools for clients across Europe. Focus on TypeScript, Next.js, and Go backends.",
    highlights: [
      "Delivered 3 production web applications for Dutch SMEs",
      "Built Go microservices handling 50k+ daily API requests",
      "Reduced client cloud costs by 40% through serverless migration",
      "Maintained < 48h turnaround on client change requests",
    ],
    type: "work",
  },
  {
    year: "2023",
    role: "Bachelor of Computer Science",
    company: "Eindhoven University of Technology",
    description:
      "Specialization in software engineering and distributed systems. Thesis on real-time collaborative editing algorithms.",
    highlights: [
      "Graduated cum laude",
      "Thesis: Conflict-free collaborative editing using CRDTs",
      "Teaching assistant for Algorithms & Data Structures",
      "Built the faculty's internal scheduling tool (Next.js + PostgreSQL)",
    ],
    type: "education",
  },
  {
    year: "2022",
    role: "Software Engineering Intern",
    company: "ASML",
    description:
      "Contributed to internal tooling for lithography system diagnostics. Built data visualization dashboards used by field engineers.",
    highlights: [
      "Rebuilt legacy C# dashboard in React, reducing load time by 70%",
      "Designed REST API consumed by 40+ field engineers globally",
      "Wrote integration tests covering 85% of the diagnostics pipeline",
    ],
    type: "work",
  },
  {
    year: "2021",
    role: "Teaching Assistant",
    company: "Eindhoven University of Technology",
    description:
      "Assisted with algorithms and data structures courses. Ran weekly problem-solving sessions for first-year students.",
    highlights: [
      "Held weekly sessions for groups of 20 first-year students",
      "Received 4.7/5 average student satisfaction rating",
      "Developed supplementary practice problem sets",
    ],
    type: "education",
  },
];

export default function Career() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <section id="career" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header */}
          <div className="mb-16 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
              Experience & Education
            </p>
            <h2 className="text-3xl font-bold text-slate-900">Career</h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Center line — hidden on mobile, visible on md+ */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/50 -translate-x-1/2" />

            {/* Left line on mobile */}
            <div className="md:hidden absolute left-4 top-0 bottom-0 w-px bg-white/50" />

            <div className="flex flex-col gap-10">
              {careerItems.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94] as const,
                      delay: index * 0.08,
                    }}
                    className={`relative flex items-start gap-4 md:gap-0 ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Mobile: indent to clear the left line */}
                    <div className="md:hidden w-8 flex-shrink-0" />

                    {/* Clickable card */}
                    <motion.div
                      layoutId={`career-item-${index}`}
                      onClick={() => setSelectedIndex(index)}
                      className={`flex-1 md:max-w-[calc(50%-2rem)] liquid-glass-card rounded-2xl p-6 cursor-pointer ${
                        isEven ? "md:mr-auto" : "md:ml-auto"
                      }`}
                      style={{ borderRadius: 16, willChange: "transform", backfaceVisibility: "hidden" }}
                      animate={{
                        boxShadow: "0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(255,255,255,0.2)",
                      }}
                      whileHover={{
                        y: -4,
                        boxShadow: "0 20px 60px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(255,255,255,0.4)",
                      }}
                      whileTap={{ y: -1, scale: 0.99 }}
                      transition={{
                        layout: { type: "spring", stiffness: 220, damping: 28 },
                        y: { type: "spring", stiffness: 300, damping: 22 },
                        boxShadow: { duration: 0.3 },
                        scale: { type: "spring", stiffness: 400, damping: 25 },
                      }}
                    >
                      {/* Year badge + type dot */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="glass rounded-full px-3 py-1 text-xs font-medium text-slate-600">
                          {item.year}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            item.type === "work" ? "bg-slate-700" : "bg-slate-400"
                          }`}
                        />
                      </div>

                      <h3 className="text-base font-semibold text-slate-900 leading-snug">
                        {item.role}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 mt-0.5 mb-3">
                        {item.company}
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Click hint */}
                      <p className="mt-4 text-xs text-slate-400 font-medium">
                        Click to read more →
                      </p>
                    </motion.div>

                    {/* Center dot on desktop */}
                    <div className="hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 w-3 h-3 rounded-full bg-white border border-white/60 shadow-sm z-10" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedIndex !== null && (
          <CareerOverlay
            item={careerItems[selectedIndex]}
            index={selectedIndex}
            onClose={() => setSelectedIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
