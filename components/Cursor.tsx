"use client";

import { useEffect, useRef } from "react";

const CURSOR_SIZE = 20;

export default function Cursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -100, y: -100 });
  const activeElRef = useRef<HTMLElement | null>(null);
  const morphRef = useRef(0);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function onEnterMagnetic(e: Event) {
      activeElRef.current = e.currentTarget as HTMLElement;
    }

    function onLeaveMagnetic() {
      const el = activeElRef.current;
      if (el) {
        el.style.transition = "transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)";
        el.style.transform = "";
        setTimeout(() => {
          if (el) el.style.transition = "";
        }, 300);
      }
      activeElRef.current = null;
    }

    function animate() {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const el = activeElRef.current;

      if (el) {
        const rect = el.getBoundingClientRect();
        const elCx = rect.left + rect.width / 2;
        const elCy = rect.top + rect.height / 2;

        // Magnetic pull on the button
        const pullX = (mx - elCx) * 0.2;
        const pullY = (my - elCy) * 0.2;
        el.style.transition = "none";
        el.style.transform = `translate(${pullX}px, ${pullY}px) scale(1.05)`;

        // Cursor morphs to a subtle highlight ring around center of button
        // Much smaller than the button — acts as a focus indicator
        morphRef.current = Math.min(1, morphRef.current + 0.15);
        const m = morphRef.current;

        // Morph to a slightly larger circle that sits behind the button
        const targetSize = Math.min(rect.width, rect.height) * 0.5;
        const size = CURSOR_SIZE + (targetSize - CURSOR_SIZE) * m;

        outer!.style.left = `${elCx + pullX}px`;
        outer!.style.top = `${elCy + pullY}px`;
        outer!.style.width = `${size}px`;
        outer!.style.height = `${size}px`;
        outer!.style.borderRadius = "50%";
        outer!.style.background = `rgba(0, 0, 0, ${0.04 * m})`;
        outer!.style.borderColor = `rgba(0, 0, 0, ${0.12 - m * 0.08})`;
      } else {
        morphRef.current = Math.max(0, morphRef.current - 0.18);
        const m = morphRef.current;
        const size = CURSOR_SIZE + m * 10;

        outer!.style.left = `${mx}px`;
        outer!.style.top = `${my}px`;
        outer!.style.width = `${size}px`;
        outer!.style.height = `${size}px`;
        outer!.style.borderRadius = "50%";
        outer!.style.background = "rgba(0, 0, 0, 0.05)";
        outer!.style.borderColor = "rgba(0, 0, 0, 0.12)";
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    function setupListeners() {
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
        willChange: "left, top, width, height",
      }}
    />
  );
}
