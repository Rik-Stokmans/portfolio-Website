"use client";

import { motion } from "framer-motion";
import ScrollIndicator from "./ScrollIndicator";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <motion.div
        className="text-center max-w-2xl"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          variants={item}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight"
        >
          Rik Stokmans
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-6 text-lg sm:text-xl text-slate-500 font-light"
        >
          Software developer.
        </motion.p>
        <motion.p
          variants={item}
          className="mt-2 text-lg sm:text-xl text-slate-500 font-light"
        >
          Building clean, thoughtful software.
        </motion.p>
        <motion.p
          variants={item}
          className="mt-2 text-lg sm:text-xl text-slate-500 font-light"
        >
          Based in the Netherlands.
        </motion.p>
      </motion.div>
      <ScrollIndicator />
    </section>
  );
}
