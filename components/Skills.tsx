"use client";

import { motion } from "framer-motion";

const hardSkills = [
  { name: "TypeScript", level: 95 },
  { name: "React / Next.js", level: 92 },
  { name: "Go", level: 80 },
  { name: "Python", level: 85 },
  { name: "Node.js", level: 88 },
  { name: "PostgreSQL", level: 78 },
  { name: "Docker", level: 75 },
  { name: "Redis", level: 72 },
];

const softSkills = [
  "Problem solving",
  "Technical communication",
  "Self-directed learning",
  "Code review & mentoring",
  "System design",
  "Cross-functional collaboration",
];

export default function Skills() {
  return (
    <section id="skills" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
            What I bring
          </p>
          <h2 className="text-3xl font-bold text-slate-900">Skills</h2>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Hard skills */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-8">
              Hard Skills
            </h3>
            <div className="flex flex-col gap-5">
              {hardSkills.map((skill, index) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      {skill.name}
                    </span>
                    <span className="text-xs text-slate-400">{skill.level}%</span>
                  </div>
                  {/* Track */}
                  <div className="h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-slate-700"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{
                        duration: 0.7,
                        ease: [0.25, 0.46, 0.45, 0.94] as const,
                        delay: index * 0.06,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Soft skills */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-8">
              Soft Skills
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {softSkills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.45,
                    ease: [0.25, 0.46, 0.45, 0.94] as const,
                    delay: index * 0.07,
                  }}
                  className="glass rounded-full px-5 py-3 text-sm font-medium text-slate-700 text-center"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
