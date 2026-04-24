"use client";

import { useEffect, useRef } from "react";

const CURSOR_SIZE = 20;
const PULL_STRENGTH = 0.15;
const BUTTON_SCALE = 1.05;
const MORPH_IN_SPEED = 0.35;
const MORPH_OUT_SPEED = 0.12;
// How quickly the button springs back after mouse leaves (0–1 per frame)
const SPRING_BACK_SPEED = 0.08;

export default function Cursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -100, y: -100 });
  const activeElRef = useRef<HTMLElement | null>(null);
  const morphRef = useRef(0);
  const enterTimeRef = useRef<number>(0);
  // Track the element that was just left so we can spring it back
  const springElRef = useRef<HTMLElement | null>(null);
  const springPullRef = useRef({ x: 0, y: 0, scale: 1 });

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function getMagnetic(target: EventTarget | null): HTMLElement | null {
      let el = target as HTMLElement | null;
      while (el && el !== document.body) {
        if (
          el.hasAttribute("data-magnetic") ||
          el.tagName === "BUTTON" ||
          (el.tagName === "A" && el.closest("nav"))
        ) return el;
        el = el.parentElement;
      }
      return null;
    }

    function onMouseOver(e: MouseEvent) {
      const mag = getMagnetic(e.target);
      if (mag && mag !== activeElRef.current) {
        // If this element was springing back, cancel that
        if (mag === springElRef.current) {
          springElRef.current = null;
        }
        activeElRef.current = mag;
        enterTimeRef.current = performance.now();
      }
    }

    function onMouseOut(e: MouseEvent) {
      const mag = getMagnetic(e.target);
      if (mag && mag === activeElRef.current) {
        const related = getMagnetic(e.relatedTarget);
        if (related !== mag) {
          // Hand off to spring-back — don't reset transform here
          springElRef.current = mag;
          activeElRef.current = null;
        }
      }
    }

    function animate() {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const el = activeElRef.current;

      // Clear ref if element was removed from DOM
      if (el && !el.isConnected) {
        activeElRef.current = null;
      }

      if (el && el.isConnected) {
        const rect = el.getBoundingClientRect();
        const elCx = rect.left + rect.width / 2;
        const elCy = rect.top + rect.height / 2;

        const elapsed = performance.now() - enterTimeRef.current;
        const easeProgress = Math.min(1, elapsed / 350);
        // Apply cubic ease-out: t => 1 - (1-t)^3
        const easedT = 1 - Math.pow(1 - easeProgress, 3);

        const pullX = (mx - elCx) * PULL_STRENGTH * easedT;
        const pullY = (my - elCy) * PULL_STRENGTH * easedT;
        el.style.transition = "none";
        el.style.transform = `translate(${pullX}px, ${pullY}px) scale(${BUTTON_SCALE})`;

        // Store current pull so spring-back can start from here
        springPullRef.current = { x: pullX, y: pullY, scale: BUTTON_SCALE };

        // Morph cursor to button shape
        morphRef.current = Math.min(1, morphRef.current + MORPH_IN_SPEED);
        const m = morphRef.current;

        const pad = 6;
        const targetW = rect.width + pad;
        const targetH = rect.height + pad;
        const w = CURSOR_SIZE + (targetW - CURSOR_SIZE) * m;
        const h = CURSOR_SIZE + (targetH - CURSOR_SIZE) * m;

        const computedRadius = getComputedStyle(el).borderRadius;
        const targetRadius = parseFloat(computedRadius) || 12;
        const circleRadius = Math.min(w, h) / 2;
        const r = circleRadius + (targetRadius + pad / 2 - circleRadius) * m;

        outer!.style.left = `${elCx + pullX}px`;
        outer!.style.top = `${elCy + pullY}px`;
        outer!.style.width = `${w}px`;
        outer!.style.height = `${h}px`;
        outer!.style.borderRadius = `${r}px`;
        outer!.style.background = `rgba(200, 200, 210, ${0.01 + m * 0.06})`;
        outer!.style.border = `1px solid rgba(255, 255, 255, ${0.1 + m * 0.35})`;
        outer!.style.boxShadow = m > 0.5
          ? `0 4px 20px rgba(0, 0, 0, ${m * 0.04}), inset 0 1px 0 rgba(255, 255, 255, ${m * 0.4})`
          : "none";
        outer!.style.mixBlendMode = "normal";
      } else {
        // Spring back the previously-hovered button
        const sEl = springElRef.current;
        if (sEl && sEl.isConnected) {
          const sp = springPullRef.current;
          sp.x *= (1 - SPRING_BACK_SPEED);
          sp.y *= (1 - SPRING_BACK_SPEED);
          sp.scale = 1 + (sp.scale - 1) * (1 - SPRING_BACK_SPEED);

          if (Math.abs(sp.x) < 0.1 && Math.abs(sp.y) < 0.1) {
            sEl.style.transform = "";
            springElRef.current = null;
          } else {
            sEl.style.transition = "none";
            sEl.style.transform = `translate(${sp.x}px, ${sp.y}px) scale(${sp.scale})`;
          }
        } else {
          springElRef.current = null;
        }

        // Decay cursor to free state
        morphRef.current = Math.max(0, morphRef.current - MORPH_OUT_SPEED);
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

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
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
        willChange: "left, top, width, height, border-radius, background",
      }}
    />
  );
}
