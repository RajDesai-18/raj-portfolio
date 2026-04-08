/* ──────────────────────────────────────────────────────────
   About Section — Data (Editorial Layout)
   ────────────────────────────────────────────────────────── */

export const ABOUT_HEADLINE =
  "I'm an engineer, builder, & designer -- always chasing the next thing worth making.";

export const ABOUT_PHILOSOPHY =
  "I grew up in Mumbai, moved to Dallas for my masters, and somewhere along the way got obsessed with building software that actually {{feels good}} to use. I think deeply about products, the thought behind them, and why they should exist in the first place.";

export const ABOUT_AVAILABILITY =
  "Currently open to full-time and contract roles starting July 2026.";

export const ABOUT_INTERESTS_INTRO = "Outside of engineering, building, and designing, I'm:";

export interface AboutInterest {
  id: string;
  text: string;
  /** Primary image */
  image: string;
  imageAlt: string;
  /** Additional images for stack effect (e.g. sky photos) */
  stackImages?: string[];
  /** Spotify playlist IDs for compact embed stack */
  spotifyIds?: string[];
}

export const ABOUT_INTERESTS: AboutInterest[] = [
  {
    id: "reading",
    text: "reading anything that makes me better at what I do",
    image: "/images/about-1.jpeg",
    imageAlt: "Books and reading",
  },
  {
    id: "tech-cars",
    text: "scrolling YouTube for what's new in tech and cars",
    image: "/images/about-2.jpeg",
    imageAlt: "Tech and cars",
  },
  {
    id: "skies",
    text: "always on the lookout for pretty skies and sunsets",
    image: "/images/about-3.jpeg",
    imageAlt: "Sky and sunset",
    stackImages: ["/images/sky-1.jpeg", "/images/sky-2.jpeg", "/images/sky-3.jpeg"],
  },
  {
    id: "anime",
    text: "finding new anime to binge",
    image: "/images/about-4.jpeg",
    imageAlt: "Anime",
  },
  {
    id: "music",
    text: "discovering music nobody's heard of yet",
    image: "/images/about-5.jpeg",
    imageAlt: "Music and playlists",
    // TODO: Replace with your actual Spotify playlist IDs
    spotifyIds: ["37i9dQZF1DXcBWIGoYBM5M", "37i9dQZF1DWWQRwui0ExPn", "37i9dQZF1DX4sWSpwq3LiO"],
  },
];
