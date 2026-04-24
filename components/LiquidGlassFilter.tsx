export default function LiquidGlassFilter() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute", pointerEvents: "none" }}
      aria-hidden="true"
    >
      <defs>
        {/*
          lg-card: used by .liquid-glass-card (ProjectCard, ProjectOverlay, TechPill)
          Higher scale (55) gives visible refraction on larger elements.
        */}
        <filter
          id="lg-card"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="turbulence"
            baseFrequency="0.012 0.008"
            numOctaves="3"
            seed="5"
            result="turb"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turb"
            scale="55"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/*
          lg-btn: used by .glass-button (GlassButton)
          Lower scale (30) avoids chaos on small button elements.
        */}
        <filter
          id="lg-btn"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="turbulence"
            baseFrequency="0.012 0.008"
            numOctaves="3"
            seed="5"
            result="turb"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turb"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
