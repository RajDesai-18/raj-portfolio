"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { Container } from "@/components/layout/container";
import Image from "next/image";

/* ──────────────────────────────────────────────────────────
   ABOUT SECTION — Editorial Layout (Rachel Chen-inspired)

   Typography hierarchy:
     Statement headline  → Satoshi, --text-subheading        entrance
     Body paragraphs     → Satoshi, --text-body              readable
     Bullets             → Satoshi, --text-body-sm           quieter

   Photo grid (6 columns):
     Slot 1 — Static: you in snow
     Slot 2 — Crossfade: places (UTD, Mumbai, Sedona)
     Slot 3 — Crossfade: skies
     Slot 4 — Crossfade: travel/nature
     Slot 5 — Static: you cooking
     Slot 6 — Spotify
   ────────────────────────────────────────────────────────── */

/* ── Slot 2: Places crossfade ── */
const PLACES_PHOTOS = [
  { src: "/images/about-2.jpeg", alt: "UTD campus aerial" },
  { src: "/images/about-3.jpeg", alt: "UTD fall walkway" },
  { src: "/images/about-4.jpeg", alt: "Mumbai beach sunset" },
  { src: "/images/about-5.jpeg", alt: "Sedona panorama" },
];

/* ── Slot 3: Sky crossfade ── */
const SKY_PHOTOS = [
  { src: "/images/about-6.jpeg", alt: "Pink sunset lake reflection" },
  { src: "/images/about-7.jpeg", alt: "Red sun on ocean" },
  { src: "/images/about-8.jpeg", alt: "Golden cumulonimbus" },
  { src: "/images/about-9.jpeg", alt: "Fiery orange sky" },
];

/* ── Slot 4: Travel/Nature crossfade ── */
const TRAVEL_PHOTOS = [
  { src: "/images/about-10.jpeg", alt: "Sedona red rock" },
  { src: "/images/about-11.jpeg", alt: "Gatlinburg forest road" },
  { src: "/images/about-12.jpeg", alt: "Tree canopy" },
  { src: "/images/about-13.jpeg", alt: "Dramatic clouds" },
  { src: "/images/about-14.jpeg", alt: "Gatlinburg stairs" },
  { src: "/images/about-15.jpeg", alt: "Sedona trail" },
];

/* ── Spotify playlists ── */
const SPOTIFY_PLAYLISTS = [
  {
    id: "3HPsMBw0lXA2wbvYrq7fRA",
    name: "Indie Mix",
  },
  {
    id: "7irjVFMTVAoMuBYlLh8WCg",
    name: "Playlist 2",
  },
];

/* ──────────────────────────────────────────────────────────
   CROSSFADE — auto-cycles through images
   ────────────────────────────────────────────────────────── */

function PhotoCrossfade({
  photos,
  interval = 3500,
}: {
  photos: { src: string; alt: string }[];
  interval?: number;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % photos.length);
    }, interval);

    return () => clearInterval(timer);
  }, [photos.length, interval]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: "3/4" }}>
      {photos.map((photo, i) => (
        <div
          key={photo.src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 30vw, (max-width: 1024px) 22vw, 14vw"
          />
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   SPOTIFY ICON
   ────────────────────────────────────────────────────────── */

function SpotifyIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1DB954" className="shrink-0">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────
   SPOTIFY SLOT
   1800px+    → full iframe embed
   below      → static card with cover from oEmbed + link
   ────────────────────────────────────────────────────────── */

function SpotifySlot({ playlists }: { playlists: { id: string; name: string }[] }) {
  const [active, setActive] = useState(0);
  const [covers, setCovers] = useState<Record<string, string>>({});

  useEffect(() => {
    playlists.forEach((pl) => {
      fetch(`https://open.spotify.com/oembed?url=https://open.spotify.com/playlist/${pl.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.thumbnail_url) {
            setCovers((prev) => ({ ...prev, [pl.id]: data.thumbnail_url }));
          }
        })
        .catch(() => {});
    });
  }, [playlists]);

  const handleNav = useCallback(
    (dir: 1 | -1, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (playlists.length <= 1) return;
      setActive((prev) => (prev + dir + playlists.length) % playlists.length);
    },
    [playlists.length]
  );

  if (playlists.length === 0) return null;

  const current = playlists[active];

  const arrowStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 20,
    width: 24,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "rgba(255, 255, 255, 0.85)",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    transition: "background-color 0.2s",
  };

  return (
    <>
      {/* ══ LARGE MONITOR (1800px+): full iframe ══ */}
      <div
        className="relative w-full overflow-hidden rounded-lg group hidden min-[1800px]:block"
        style={{ aspectRatio: "3/4" }}
      >
        {playlists.map((pl, i) => (
          <div
            key={pl.id}
            className="absolute inset-0 transition-opacity duration-300 ease-out"
            style={{
              opacity: i === active ? 1 : 0,
              pointerEvents: i === active ? "auto" : "none",
              zIndex: i === active ? 1 : 0,
            }}
          >
            <iframe
              src={`https://open.spotify.com/embed/playlist/${pl.id}?utm_source=generator`}
              width="100%"
              height="100%"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="border-0"
              title={`Spotify playlist: ${pl.name}`}
              style={{ borderRadius: 12 }}
            />
          </div>
        ))}

        {playlists.length > 1 && (
          <>
            <button
              onClick={(e) => handleNav(-1, e)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ ...arrowStyle, left: 0, borderRadius: "0 6px 6px 0" }}
              aria-label="Previous playlist"
            >
              &#8249;
            </button>
            <button
              onClick={(e) => handleNav(1, e)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ ...arrowStyle, right: 0, borderRadius: "6px 0 0 6px" }}
              aria-label="Next playlist"
            >
              &#8250;
            </button>
            <div
              className="absolute bottom-2.5 left-1/2 -translate-x-1/2 font-mono tracking-wide pointer-events-none select-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{
                fontSize: 10,
                padding: "2px 7px",
                borderRadius: 4,
                backgroundColor: "rgba(0, 0, 0, 0.55)",
                color: "rgba(255, 255, 255, 0.8)",
                zIndex: 20,
              }}
            >
              {active + 1}/{playlists.length}
            </div>
          </>
        )}
      </div>

      {/* ══ BELOW 1800px: cover card + link ══ */}
      <a
        href={`https://open.spotify.com/playlist/${current.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-full overflow-hidden rounded-lg block min-[1800px]:hidden group/card"
        style={{ aspectRatio: "3/4" }}
      >
        {covers[current.id] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={covers[current.id]}
            alt={current.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "#282828" }}
          >
            <SpotifyIcon size={32} />
          </div>
        )}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.25) 45%, transparent 100%)",
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between z-10">
          <div className="min-w-0">
            <span
              className="block font-body font-medium leading-tight text-white truncate"
              style={{ fontSize: "var(--text-body-sm)" }}
            >
              {current.name}
            </span>
            <span
              className="block font-mono uppercase tracking-[0.08em] mt-1"
              style={{
                fontSize: "var(--text-micro)",
                color: "#1DB954",
              }}
            >
              Open in Spotify
            </span>
          </div>
          <SpotifyIcon size={20} />
        </div>

        {playlists.length > 1 && (
          <>
            <button
              onClick={(e) => handleNav(-1, e)}
              className="opacity-100 lg:opacity-0 lg:group-hover/card:opacity-100 transition-opacity duration-200"
              style={{
                ...arrowStyle,
                left: 0,
                borderRadius: "0 6px 6px 0",
              }}
              aria-label="Previous playlist"
            >
              &#8249;
            </button>
            <button
              onClick={(e) => handleNav(1, e)}
              className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-200"
              style={{
                ...arrowStyle,
                right: 0,
                borderRadius: "6px 0 0 6px",
              }}
              aria-label="Next playlist"
            >
              &#8250;
            </button>
            <div
              className="absolute top-2.5 right-2.5 font-mono tracking-wide pointer-events-none select-none z-10 opacity-100 lg:opacity-0 lg:group-hover/card:opacity-100 transition-opacity duration-200"
              style={{
                fontSize: 10,
                padding: "2px 7px",
                borderRadius: 4,
                backgroundColor: "rgba(0, 0, 0, 0.55)",
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              {active + 1}/{playlists.length}
            </div>
          </>
        )}
      </a>
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   ABOUT SECTION
   ────────────────────────────────────────────────────────── */

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const photoStripRef = useRef<HTMLDivElement>(null);
  const hrTopRef = useRef<HTMLDivElement>(null);
  const hrBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      [hrTopRef, hrBottomRef].forEach((ref) => {
        if (ref.current) gsap.set(ref.current, { scaleX: 1 });
      });
      [bodyRef, photoStripRef].forEach((ref) => {
        if (ref.current) gsap.set(ref.current, { opacity: 1, y: 0 });
      });
      return;
    }

    const splits: InstanceType<typeof SplitText>[] = [];

    gsap.set(hrTopRef.current, { scaleX: 0 });
    gsap.set(hrBottomRef.current, { scaleX: 0 });
    if (bodyRef.current) gsap.set(bodyRef.current, { opacity: 0, y: 24 });
    if (photoStripRef.current) gsap.set(photoStripRef.current, { opacity: 0, y: 32 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 88%",
          end: "top 15%",
          scrub: 0.6,
        },
      });

      tl.to(hrTopRef.current, { scaleX: 1, duration: 0.3, ease: "none" }, 0);

      if (subheadRef.current) {
        const subSplit = new SplitText(subheadRef.current, {
          type: "words",
          wordsClass: "about-word",
        });
        splits.push(subSplit);
        gsap.set(subSplit.words, { opacity: 0, y: 20 });
        tl.to(
          subSplit.words,
          { opacity: 1, y: 0, stagger: 0.02, duration: 0.3, ease: "none" },
          0.1
        );
      }

      tl.to(bodyRef.current, { opacity: 1, y: 0, duration: 0.3, ease: "none" }, 0.25);
      tl.to(photoStripRef.current, { opacity: 1, y: 0, duration: 0.3, ease: "none" }, 0.4);
      tl.to(hrBottomRef.current, { scaleX: 1, duration: 0.3, ease: "none" }, 0.55);
    }, sectionRef);

    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative w-full overflow-hidden">
      <div className="py-[10vh] sm:py-[12vh] lg:py-0 lg:pt-16 lg:pb-12 lg:min-h-screen lg:flex lg:items-center">
        <Container className="w-full">
          {/* ── Text block — full width until ultrawide ── */}
          <div className="2xl:max-w-[82%]">
            {/* Statement — Satoshi, subtitle size, entrance element */}
            <p
              ref={subheadRef}
              className="font-body font-medium tracking-[-0.015em] leading-[1.35] mb-6 sm:mb-4 lg:mb-6 2xl:max-w-[77%]"
              style={{
                color: "var(--text)",
                fontSize: "var(--text-heading)",
                opacity: 0.8,
              }}
            >
              I&apos;m an engineer, builder, &amp; designer -- always chasing the next thing worth
              making.
            </p>

            {/* Body content */}
            <div ref={bodyRef} className="space-y-4 sm:space-y-5">
              {/* P1 */}
              <p
                className="font-body leading-[1.7]"
                style={{
                  color: "var(--text)",
                  fontSize: "var(--text-body)",
                  opacity: 0.85,
                }}
              >
                I grew up in Mumbai, moved to Dallas for my masters, and somewhere along the way got
                obsessed with building software that actually feels good to use. I think deeply
                about products, the thought behind them, and why they should exist in the first
                place.
              </p>

              {/* P2 — Availability */}
              <p
                className="font-body leading-[1.7]"
                style={{
                  color: "var(--text)",
                  fontSize: "var(--text-body)",
                  opacity: 0.85,
                }}
              >
                Currently open to{" "}
                <span className="font-medium" style={{ color: "var(--accent-raw)" }}>
                  full-time roles
                </span>{" "}
                starting July 2026.
              </p>

              {/* P3 — Interests */}
              <div>
                <p
                  className="font-body leading-[1.7] mb-2"
                  style={{
                    color: "var(--text)",
                    fontSize: "var(--text-body)",
                    opacity: 0.85,
                  }}
                >
                  Outside of engineering, building, and designing, I&apos;m:
                </p>
                <ul className="space-y-1.5">
                  {[
                    "reading anything that makes me better at what I do",
                    "scrolling YouTube for what's new in tech and cars",
                    "discovering music nobody's heard of yet",
                    "always out with the camera, chasing skies and sunsets",
                    "finding new anime to binge",
                  ].map((item) => (
                    <li key={item} className="flex items-baseline gap-2.5">
                      <span
                        className="w-[5px] h-[5px] rounded-full shrink-0 relative top-[-2px]"
                        style={{ backgroundColor: "var(--accent-raw)" }}
                      />
                      <span
                        className="font-body leading-[1.7]"
                        style={{
                          color: "var(--text)",
                          fontSize: "var(--text-body-sm)",
                          opacity: 0.7,
                        }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Photo strip — ALWAYS full container width ── */}
          <div ref={photoStripRef} className="mt-10 sm:mt-12 lg:mt-14">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-3.5 lg:grid-cols-6 lg:gap-4">
              {/* Slot 1: You in snow (static) */}
              <div
                className="relative overflow-hidden rounded-lg"
                style={{ aspectRatio: "3/4" }}
                data-cursor-label="THIS IS ME!"
              >
                <Image
                  src="/images/about-1.jpeg"
                  alt="Raj in snow"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 30vw, (max-width: 1024px) 22vw, 14vw"
                />
              </div>

              {/* Slot 2: Places crossfade */}
              <div data-cursor-label="EXPLORING">
                <PhotoCrossfade photos={PLACES_PHOTOS} interval={5000} />
              </div>

              {/* Slot 3: Sky crossfade */}
              <div data-cursor-label="SKY OBSESSED">
                <PhotoCrossfade photos={SKY_PHOTOS} interval={5500} />
              </div>

              {/* Slot 4: Travel/Nature crossfade */}
              <div data-cursor-label="ADVENTURING">
                <PhotoCrossfade photos={TRAVEL_PHOTOS} interval={6000} />
              </div>

              {/* Slot 5: You cooking (static) */}
              <div
                className="relative overflow-hidden rounded-lg"
                style={{ aspectRatio: "3/4" }}
                data-cursor-label="CHEF MODE"
              >
                <Image
                  src="/images/about-16.jpeg"
                  alt="Raj cooking"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 30vw, (max-width: 1024px) 22vw, 14vw"
                />
              </div>

              {/* Slot 6: Spotify */}
              <SpotifySlot playlists={SPOTIFY_PLAYLISTS} />
            </div>
          </div>

          {/* Bottom HR */}
          <div
            ref={hrBottomRef}
            className="h-px w-full origin-left mt-10 sm:mt-12 lg:mt-14 mb-4 lg:mb-6"
            style={{ backgroundColor: "var(--border-custom)" }}
          />
        </Container>
      </div>
    </section>
  );
}
