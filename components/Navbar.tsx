"use client";

import Link from "next/link";
import { motion } from "framer-motion";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      className="relative text-sm text-slate-500 py-1"
      whileHover="hover"
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <motion.span
        variants={{
          hover: { color: "#0f172a" },
        }}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute bottom-0 left-0 right-0 h-px bg-slate-900 origin-left"
        initial={{ scaleX: 0 }}
        variants={{
          hover: { scaleX: 1 },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
    </motion.a>
  );
}

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-t-0 border-x-0 rounded-none">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-slate-900">
          Rik Stokmans
        </Link>
        <div className="flex gap-6">
          <NavLink href="#projects">Projects</NavLink>
          <NavLink href="#career">Career</NavLink>
          <NavLink href="#skills">Skills</NavLink>
          <NavLink href="#contact">Contact</NavLink>
        </div>
      </div>
    </nav>
  );
}
