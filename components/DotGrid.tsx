"use client";

import { useEffect, useRef } from "react";

const DOT_SPACING = 28;
const DOT_RADIUS = 1.2;
const LIFT_RADIUS = 140;
const MAX_LIFT = 10;

export default function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = `${window.innerWidth}px`;
      canvas!.style.height = `${window.innerHeight}px`;
    }

    function draw() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);

      // Mouse in viewport coordinates (canvas is fixed, so this is correct)
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Dots are at fixed viewport positions — they don't scroll.
      // This makes them feel like a wallpaper texture.
      const cols = Math.ceil(w / DOT_SPACING) + 1;
      const rows = Math.ceil(h / DOT_SPACING) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const baseX = col * DOT_SPACING;
          const baseY = row * DOT_SPACING;

          const dx = baseX - mx;
          const dy = baseY - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let drawX = baseX;
          let drawY = baseY;
          let radius = DOT_RADIUS;
          let alpha = 0.1;

          if (dist < LIFT_RADIUS && dist > 0) {
            const strength = 1 - dist / LIFT_RADIUS;
            const eased = strength * strength * strength;
            const pushX = (dx / dist) * eased * MAX_LIFT;
            const pushY = (dy / dist) * eased * MAX_LIFT;
            drawX = baseX + pushX;
            drawY = baseY + pushY;
            radius = DOT_RADIUS + eased * 2;
            alpha = 0.1 + eased * 0.35;
          }

          ctx!.beginPath();
          ctx!.arc(drawX, drawY, radius, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(0, 0, 0, ${alpha})`;
          ctx!.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function onMouseLeave() {
      mouseRef.current = { x: -1000, y: -1000 };
    }

    resize();
    draw();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", resize);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
