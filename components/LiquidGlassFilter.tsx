"use client";

/**
 * Renders a hidden SVG with filter definitions for the liquid glass refraction effect.
 * Uses feDisplacementMap with separate horizontal/vertical gradient maps
 * to create a proper lens-like distortion (content bends inward at edges).
 *
 * Include once in the layout; reference via backdrop-filter: url(#liquid-glass).
 */
export default function LiquidGlassFilter() {
  // Horizontal displacement map — varies R channel left-to-right
  // Bright left (pull content right → toward center) → neutral center → dark right (pull content left → toward center)
  // Flat zone in center (35%–65%) keeps central content undistorted
  const hMap = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
      "<defs>" +
      '<linearGradient id="h" x1="0" x2="1" y1="0" y2="0">' +
      '<stop offset="0%" stop-color="rgb(168,0,0)"/>' +
      '<stop offset="35%" stop-color="rgb(128,0,0)"/>' +
      '<stop offset="65%" stop-color="rgb(128,0,0)"/>' +
      '<stop offset="100%" stop-color="rgb(88,0,0)"/>' +
      "</linearGradient>" +
      "</defs>" +
      '<rect width="200" height="200" fill="url(#h)"/>' +
      "</svg>"
  );

  // Vertical displacement map — varies G channel top-to-bottom
  const vMap = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
      "<defs>" +
      '<linearGradient id="v" x1="0" x2="0" y1="0" y2="1">' +
      '<stop offset="0%" stop-color="rgb(0,168,0)"/>' +
      '<stop offset="35%" stop-color="rgb(0,128,0)"/>' +
      '<stop offset="65%" stop-color="rgb(0,128,0)"/>' +
      '<stop offset="100%" stop-color="rgb(0,88,0)"/>' +
      "</linearGradient>" +
      "</defs>" +
      '<rect width="200" height="200" fill="url(#v)"/>' +
      "</svg>"
  );

  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute", pointerEvents: "none" }}
      aria-hidden="true"
    >
      <defs>
        {/* Main liquid glass filter — lens refraction + subtle blur */}
        <filter
          id="liquid-glass"
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
          colorInterpolationFilters="sRGB"
        >
          {/* Load horizontal gradient (R channel encodes X displacement) */}
          <feImage
            href={`data:image/svg+xml,${hMap}`}
            result="hmap"
            preserveAspectRatio="none"
          />
          {/* Load vertical gradient (G channel encodes Y displacement) */}
          <feImage
            href={`data:image/svg+xml,${vMap}`}
            result="vmap"
            preserveAspectRatio="none"
          />

          {/* Extract R from hmap, zero out G */}
          <feColorMatrix
            in="hmap"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="rChannel"
          />
          {/* Extract G from vmap, zero out R */}
          <feColorMatrix
            in="vmap"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="gChannel"
          />

          {/* Combine: R from hmap + G from vmap into one displacement map */}
          <feComposite
            in="rChannel"
            in2="gChannel"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="displacement"
          />

          {/* Apply lens distortion */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="displacement"
            scale="35"
            xChannelSelector="R"
            yChannelSelector="G"
            result="refracted"
          />

          {/* Very light blur for frosted glass feel */}
          <feGaussianBlur in="refracted" stdDeviation="1.2" />
        </filter>
      </defs>
    </svg>
  );
}
