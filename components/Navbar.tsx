"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-t-0 border-x-0 rounded-none">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-slate-900">
          Rik Stokmans
        </Link>
        <div className="flex gap-6">
          <a
            href="#projects"
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            Projects
          </a>
          <a
            href="#contact"
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
