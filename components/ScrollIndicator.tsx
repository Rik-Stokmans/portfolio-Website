"use client";

export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-slate-400"
        style={{ animation: "bounce-subtle 1.5s ease-in-out infinite" }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}
