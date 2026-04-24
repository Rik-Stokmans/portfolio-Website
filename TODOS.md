# Portfolio Website TODOs

## Content & Pages

- [x] **Add a career section** — Timeline built in `components/Career.tsx`. Placeholder data to replace.

- [x] **Actually build the contact page** — Contact form with validation and success state in `components/Contact.tsx`.

- [x] **Fill in actual projects** — Replace placeholder/demo project data with real projects, including descriptions, screenshots, tech stacks, and links. Edit `lib/projects.ts`.

- [x] **Fill in actual career data** — Replace placeholder entries in `components/Career.tsx` with real work experience and education history.

- [x] **List of all skills** — Skills section in `components/Skills.tsx`. Placeholder data to replace.

- [x] **Fill in real skills data** — Update hard skill levels and soft skill list in `components/Skills.tsx` to reflect actual abilities.

- [x] **Fill in contact links** — GitHub (github.com/Rik-Stokmans) and LinkedIn links set in `components/Contact.tsx`.

## UI / Interactions

- [x] **Fix liquid glass refraction effect visibility** — The lens displacement/refraction on `.liquid-glass-card` is not visually apparent. The SVG `#liquid-glass` filter needs rigorous testing across browsers. Effect should be clearly visible: frosted lens distortion at card edges, strong backdrop blur + saturation, and a visible specular highlight.

- [x] **Lock body scroll when project modal is open** — When a project overlay is open, the main page should not be scrollable. Use `overflow: hidden` on `<body>` while the modal is mounted.

- [x] **Make tech pills clickable** — Pills in the project modal open a glass detail panel with category + description. Pills on the main page are static.

- [x] **Smoother button hover / magnetic effect** — Ease-in ramp on cursor enter, reduced displacement (0.15), spring return on exit.

- [x] **Career cards clickable** — Each card morphs into a full overlay with role, company, description, and highlights.

## Export / Utility

- [x] **CV export button** — "Download CV" button in Hero uses `window.print()`. Print stylesheet in `globals.css` strips decorative elements.
