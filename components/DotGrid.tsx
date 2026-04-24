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
      const scrollY = window.scrollY;

      // Reset transform and clear
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);

      // Mouse is in viewport/client coordinates — perfect since canvas is fixed
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Calculate which dots are visible in the viewport
      // Dots exist at document positions: row * SPACING, col * SPACING
      // On screen they appear at: (docY - scrollY)
      const startRow = Math.floor(scrollY / DOT_SPACING);
      const endRow = Math.ceil((scrollY + h) / DOT_SPACING) + 1;
      const cols = Math.ceil(w / DOT_SPACING) + 1;

      for (let row = startRow; row < endRow; row++) {
        for (let col = 0; col < cols; col++) {
          // Document position of this dot
          const docX = col * DOT_SPACING;
          const docY = row * DOT_SPACING;

          // Viewport position (where it appears on screen)
          const screenX = docX;
          const screenY = docY - scrollY;

          // Distance from mouse (both in viewport coords)
          const dx = screenX - mx;
          const dy = screenY - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let drawX = screenX;
          let drawY = screenY;
          let radius = DOT_RADIUS;
          let alpha = 0.1;

          if (dist < LIFT_RADIUS && dist > 0) {
            const strength = 1 - dist / LIFT_RADIUS;
            const eased = strength * strength * strength; // cubic for smoother falloff
            const pushX = (dx / dist) * eased * MAX_LIFT;
            const pushY = (dy / dist) * eased * MAX_LIFT;
            drawX = screenX + pushX;
            drawY = screenY + pushY;
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
