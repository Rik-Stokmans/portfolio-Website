"use client";

import { useEffect, useRef } from "react";

// iPadOS-style cursor:
// - Free: small translucent circle follows mouse
// - On magnetic button: cursor morphs to button's exact shape, becomes a
//   subtle highlight that wraps around the button. The button text remains
//   visible because we use mix-blend-mode. Button follows mouse magnetically.

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
        setTimeout(() => { if (el) el.style.transition = ""; }, 300);
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

        // Magnetic pull
        const pullX = (mx - elCx) * 0.15;
        const pullY = (my - elCy) * 0.15;
        el.style.transition = "none";
        el.style.transform = `translate(${pullX}px, ${pullY}px) scale(1.04)`;

        // Morph cursor to button shape
        morphRef.current = Math.min(1, morphRef.current + 0.13);
        const m = morphRef.current;

        const pad = 6;
        const targetW = rect.width + pad;
        const targetH = rect.height + pad;
        const w = CURSOR_SIZE + (targetW - CURSOR_SIZE) * m;
        const h = CURSOR_SIZE + (targetH - CURSOR_SIZE) * m;

        // Compute target border radius from the element
        const computedRadius = getComputedStyle(el).borderRadius;
        const targetRadius = parseFloat(computedRadius) || 12;
        // Interpolate: circle uses min(w,h)/2 as radius, target uses element's radius
        const circleRadius = Math.min(w, h) / 2;
        const r = circleRadius + (targetRadius + pad / 2 - circleRadius) * m;

        outer!.style.left = `${elCx + pullX}px`;
        outer!.style.top = `${elCy + pullY}px`;
        outer!.style.width = `${w}px`;
        outer!.style.height = `${h}px`;
        outer!.style.borderRadius = `${r}px`;
        // Morphed state: subtle frosted glass highlight
        outer!.style.background = `rgba(200, 200, 210, ${0.01 + m * 0.12})`;
        outer!.style.border = `1px solid rgba(255, 255, 255, ${0.1 + m * 0.35})`;
        outer!.style.boxShadow = m > 0.5
          ? `0 4px 20px rgba(0, 0, 0, ${m * 0.06}), inset 0 1px 0 rgba(255, 255, 255, ${m * 0.4})`
          : "none";
        outer!.style.mixBlendMode = "multiply";
      } else {
        // Decay to free cursor
        morphRef.current = Math.max(0, morphRef.current - 0.16);
        const m = morphRef.current;
        const size = CURSOR_SIZE + m * 8;

        outer!.style.left = `${mx}px`;
        outer!.style.top = `${my}px`;
        outer!.style.width = `${size}px`;
        outer!.style.height = `${size}px`;
        outer!.style.borderRadius = "50%";
        outer!.style.background = "rgba(0, 0, 0, 0.05)";
        outer!.style.border = "1.5px solid rgba(0, 0, 0, 0.12)";
        outer!.style.boxShadow = "none";
        outer!.style.mixBlendMode = "normal";
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
        willChange: "left, top, width, height, border-radius, background",
      }}
    />
  );
}
