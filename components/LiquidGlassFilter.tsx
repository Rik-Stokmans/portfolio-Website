"use client";

import { useEffect, useState } from "react";

/**
 * Generates a lens displacement map PNG via canvas:
 *  - R channel encodes horizontal displacement (bright left → neutral center → dark right)
 *  - G channel encodes vertical displacement (bright top → neutral center → dark bottom)
 *  - Flat neutral zone in center (30%–70%) keeps central content undistorted
 *  - Edges ramp smoothly with eased falloff for organic glass look
 *
 * Returns a base64 data URL for use in feImage.
 */
function generateLensMap(): string {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const d = img.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / (size - 1); // 0→1 left to right
      const ny = y / (size - 1); // 0→1 top to bottom

      // Horizontal displacement (R channel)
      // Left edge: bright (>128) → pulls sampled pixels rightward (content appears shifted left → toward center)
      // Right edge: dark (<128) → pulls sampled pixels leftward (content appears shifted right → toward center)
      let r = 128;
      if (nx < 0.3) {
        const t = 1 - nx / 0.3; // 1 at edge, 0 at 30%
        const eased = t * t * (3 - 2 * t); // smoothstep
        r = 128 + eased * 40;
      } else if (nx > 0.7) {
        const t = (nx - 0.7) / 0.3; // 0 at 70%, 1 at edge
        const eased = t * t * (3 - 2 * t);
        r = 128 - eased * 40;
      }

      // Vertical displacement (G channel) — same logic
      let g = 128;
      if (ny < 0.3) {
        const t = 1 - ny / 0.3;
        const eased = t * t * (3 - 2 * t);
        g = 128 + eased * 40;
      } else if (ny > 0.7) {
        const t = (ny - 0.7) / 0.3;
        const eased = t * t * (3 - 2 * t);
        g = 128 - eased * 40;
      }

      const i = (y * size + x) * 4;
      d[i] = Math.round(r);
      d[i + 1] = Math.round(g);
      d[i + 2] = 128; // B — unused
      d[i + 3] = 255; // A — fully opaque
    }
  }

  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL("image/png");
}

export default function LiquidGlassFilter() {
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    setMapUrl(generateLensMap());
  }, []);

  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute", pointerEvents: "none" }}
      aria-hidden="true"
    >
      <defs>
        {/*
          liquid-glass filter pipeline:
          1. feImage — loads the canvas-generated lens displacement map (PNG)
          2. feDisplacementMap — warps backdrop pixels using R/G channels
             (content bends inward at all four edges, undistorted in center)
          3. feGaussianBlur — light frosted glass softening
        */}
        <filter
          id="liquid-glass"
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
          colorInterpolationFilters="sRGB"
        >
          {/* Displacement map (or neutral fallback before canvas generates) */}
          {mapUrl ? (
            <feImage
              href={mapUrl}
              result="map"
              preserveAspectRatio="none"
            />
          ) : (
            <feFlood floodColor="rgb(128,128,128)" result="map" />
          )}

          {/* Lens distortion: edges refract inward, center is clean */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale="55"
            xChannelSelector="R"
            yChannelSelector="G"
            result="refracted"
          />

          {/* Frosted-glass softening */}
          <feGaussianBlur in="refracted" stdDeviation="3" />
        </filter>
      </defs>
    </svg>
  );
}
