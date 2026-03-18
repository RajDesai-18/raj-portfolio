# Raj Desai — Portfolio

A cinematic, scroll-driven personal portfolio built with modern web technologies. Dark mode default with light mode toggle. Every interaction is intentional, every animation is choreographed.

[Live Site](https://rajdesai.dev) · [LinkedIn](https://linkedin.com/in/rajdesai18) · [GitHub](https://github.com/RajDesai-18)

---

## Overview

Single-page immersive portfolio combining layout clarity, scroll animation craft, and typographic density into a cohesive personal brand. Inspired by the editorial precision of [minhpham.design](https://minhpham.design), the scroll craft of [kentokawazoe.com](https://kentokawazoe.com), the cinematic feel of [victor-sin.com](https://victor-sin.com), and the sharp positioning of [rachelchen.tech](https://rachelchen.tech).

## Features

- **Animated mesh gradient background** — GPU-accelerated WebGL gradient that flows behind all content
- **Merged loading + hero** — Counter animates into the hero section seamlessly
- **Custom cursor** — Dot + ring system with magnetic pull, hover expansion, and click feedback
- **Magnetic interactions** — Icons and buttons physically pull toward the cursor
- **Split-flap nav text** — Navigation links roll through the alphabet on hover
- **GSAP SplitText reveals** — Characters animate individually with staggered timing
- **Live clock + weather** — Real-time Dallas, TX time and temperature in the hero
- **Ghost text parallax** — Massive faint section names parallax behind content
- **Slow immersive scroll** — Lenis smooth scroll with high friction for cinematic pacing
- **Dark/Light mode** — Full theme system with floating toggle that repositions on scroll
- **Session-aware loading** — Loading animation plays once per session, skips on refresh

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-first config) |
| UI Components | shadcn/ui (Radix primitives) |
| Scroll Animation | GSAP + ScrollTrigger + SplitText |
| Component Animation | Framer Motion |
| Smooth Scroll | Lenis |
| Background | @paper-design/shaders-react |
| Icons | Lucide React |
| Fonts | Clash Display, Satoshi, Azeret Mono (Fontshare) |

## Design Tokens

### Dark Mode (Default)
- Background: `#1F1F1F` (Charcoal Black)
- Text: `#EFE6D8` (Warm Beige)
- Accent: `#7FAf9B` (Sage Green)

### Light Mode
- Background: `#E8D8C3` (Muted Sand)
- Text: `#2B1E17` (Deep Coffee)
- Accent: `#E4572E` (Burnt Orange)

## Typography

| Role | Font | Weight |
|------|------|--------|
| Display / Headlines | Clash Display | Semibold / Bold |
| Body / Navigation | Satoshi | Regular / Medium |
| Labels / Mono | Azeret Mono | Regular / Medium |

## Getting Started

### Prerequisites

- Node.js 20.9+
- npm or pnpm

### Installation
```bash
git clone https://github.com/RajDesai-18/raj-portfolio.git
cd raj-portfolio
npm install
```

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build
```bash
npm run build
npm run start
```

## Project Structure
```
src/
├── app/
│   ├── globals.css          # Design tokens, Tailwind v4 theme, base styles
│   ├── layout.tsx           # Root layout with providers and background
│   └── page.tsx             # Main page with all sections
├── components/
│   ├── background/
│   │   ├── mesh-gradient.tsx    # WebGL mesh gradient background
│   │   └── ghost-text.tsx       # Parallax ghost text behind sections
│   ├── layout/
│   │   ├── container.tsx        # Max-width + padding wrapper
│   │   ├── navigation.tsx       # Fixed nav with scramble text
│   │   ├── section.tsx          # Section wrapper
│   │   └── section-label.tsx    # Numbered section labels
│   ├── providers/
│   │   ├── theme-provider.tsx   # Dark/light mode context
│   │   └── smooth-scroll-provider.tsx  # Lenis integration
│   ├── sections/
│   │   └── hero-section.tsx     # Hero with merged loading state
│   └── ui/
│       ├── custom-cursor.tsx    # Dot + ring cursor system
│       ├── floating-theme-toggle.tsx  # Repositioning theme toggle
│       ├── live-clock.tsx       # Real-time clock + weather
│       ├── magnetic.tsx         # Magnetic pull wrapper
│       ├── scramble-text.tsx    # Split-flap text animation
│       └── scroll-indicator.tsx # Scroll prompt
├── hooks/
│   └── use-reduced-motion.ts
└── lib/
    ├── gsap.ts              # GSAP plugin registration
    └── utils.ts             # cn() utility
```

## Build Phases

- [x] Phase 1: Setup & Foundation
- [x] Phase 2: Loading Screen & Navigation
- [x] Phase 3: Hero Section
- [ ] Phase 4: About Me (content placed, animations pending)
- [ ] Phase 5: Skills / What I Do
- [ ] Phase 6: Projects
- [ ] Phase 7: Experience
- [ ] Phase 8: Contact & Footer
- [ ] Phase 9: Polish, Responsive & QA
- [ ] Phase 10: Content & Deploy

## Browser Support

- Chrome 111+
- Edge 111+
- Firefox 111+
- Safari 16.4+

## Accessibility

- `prefers-reduced-motion` respected for all animations
- Semantic HTML with proper heading hierarchy
- Focus-visible outlines on all interactive elements
- ARIA labels on icon buttons and links
- Custom cursor disabled on touch devices

## License

MIT License. See [LICENSE](LICENSE) for details.

---

Designed & built by [Raj Desai](https://github.com/RajDesai-18)

