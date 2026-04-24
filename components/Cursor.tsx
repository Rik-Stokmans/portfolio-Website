"use client";

import { useEffect, useRef } from "react";

// The cursor smoothly morphs as it approaches magnetic elements.
// When hovering a magnetic button, it snaps to the button's shape,
// the button scales up and follows the mouse magnetically.
// Project cards are NOT magnetic — cursor stays as a circle over them.

const CURSOR_SIZE = 20;
const MAGNETIC_RANGE = 60; // px from button edge where morph begins

export default function Cursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -100, y: -100 });
  const activeElRef = useRef<HTMLElement | null>(null);
  const morphRef = useRef(0); // 0 = circle, 1 = fully morphed

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    // Track which magnetic element the mouse is actually inside
    function onEnterMagnetic(e: Event) {
      activeElRef.current = e.currentTarget as HTMLElement;
    }

    function onLeaveMagnetic() {
      const el = activeElRef.current;
      if (el) {
        // Reset the button transform smoothly
        el.style.transition = "transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)";
        el.style.transform = "";
        // Clean up transition after it completes
        setTimeout(() => {
          if (el) el.style.transition = "";
        }, 350);
      }
      activeElRef.current = null;
    }

    function animate() {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const el = activeElRef.current;

      if (el) {
        // Mouse is inside a magnetic element
        const rect = el.getBoundingClientRect();
        const elCx = rect.left + rect.width / 2;
        const elCy = rect.top + rect.height / 2;

        // Magnetic pull: button follows mouse with damping
        const pullX = (mx - elCx) * 0.25;
        const pullY = (my - elCy) * 0.25;
        el.style.transition = "none";
        el.style.transform = `translate(${pullX}px, ${pullY}px) scale(1.06)`;

        // Morph cursor toward button shape
        morphRef.current = Math.min(1, morphRef.current + 0.12);
        const m = morphRef.current;
        const w = rect.width + 16; // slightly larger than button
        const h = rect.height + 12;

        outer!.style.left = `${elCx + pullX}px`;
        outer!.style.top = `${elCy + pullY}px`;
        outer!.style.width = `${CURSOR_SIZE + (w - CURSOR_SIZE) * m}px`;
        outer!.style.height = `${CURSOR_SIZE + (h - CURSOR_SIZE) * m}px`;
        outer!.style.borderRadius = `${50 - m * 38}%`; // 50% circle -> 12% rounded rect
        outer!.style.opacity = `${0.6 + m * 0.4}`;
        outer!.style.background = `rgba(0, 0, 0, ${0.03 + m * 0.02})`;
        outer!.style.borderColor = `rgba(0, 0, 0, ${0.12 - m * 0.06})`;
      } else {
        // Normal cursor — decay morph back to circle
        morphRef.current = Math.max(0, morphRef.current - 0.15);
        const m = morphRef.current;

        outer!.style.left = `${mx}px`;
        outer!.style.top = `${my}px`;
        outer!.style.width = `${CURSOR_SIZE + m * 30}px`;
        outer!.style.height = `${CURSOR_SIZE + m * 20}px`;
        outer!.style.borderRadius = `${50 - m * 38}%`;
        outer!.style.opacity = "1";
        outer!.style.background = "rgba(0, 0, 0, 0.05)";
        outer!.style.borderColor = "rgba(0, 0, 0, 0.12)";
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    function setupListeners() {
      // Only select actual buttons and links — NOT project cards
      const magnetics = document.querySelectorAll<HTMLElement>(
        '[data-magnetic], nav a, button'
      );
      magnetics.forEach((el) => {
        el.addEventListener("mouseenter", onEnterMagnetic);
        el.addEventListener("mouseleave", onLeaveMagnetic);
      });
      return magnetics;
    }

    window.addEventListener("mousemove", onMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    let elements = setupListeners();
    const observer = new MutationObserver(() => {
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterMagnetic);
        el.removeEventListener("mouseleave", onLeaveMagnetic);
      });
      elements = setupListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterMagnetic);
        el.removeEventListener("mouseleave", onLeaveMagnetic);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={outerRef}
      className="fixed pointer-events-none z-[9999]"
      style={{
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        borderRadius: "50%",
        background: "rgba(0, 0, 0, 0.05)",
        border: "1.5px solid rgba(0, 0, 0, 0.12)",
        transform: "translate(-50%, -50%)",
        left: -100,
        top: -100,
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        willChange: "left, top, width, height, border-radius",
      }}
    />
  );
}
