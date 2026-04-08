"use client";

import { useEffect, useState } from "react";

/* ────────────────────────────────────────────
   Timezone → approximate city coordinates
   Covers 50+ major timezones. Falls back to
   Dallas (Raj's location) for unknown zones.
   ──────────────────────────────────────────── */

const TIMEZONE_COORDS: Record<string, [number, number]> = {
  // North America
  "America/New_York": [40.71, -74.01],
  "America/Chicago": [41.88, -87.63],
  "America/Denver": [39.74, -104.99],
  "America/Los_Angeles": [34.05, -118.24],
  "America/Phoenix": [33.45, -112.07],
  "America/Anchorage": [61.22, -149.9],
  "Pacific/Honolulu": [21.31, -157.86],
  "America/Toronto": [43.65, -79.38],
  "America/Vancouver": [49.28, -123.12],
  "America/Mexico_City": [19.43, -99.13],
  // South America
  "America/Sao_Paulo": [-23.55, -46.63],
  "America/Argentina/Buenos_Aires": [-34.6, -58.38],
  "America/Bogota": [4.71, -74.07],
  "America/Santiago": [-33.45, -70.67],
  "America/Lima": [-12.05, -77.04],
  // Europe
  "Europe/London": [51.51, -0.13],
  "Europe/Paris": [48.86, 2.35],
  "Europe/Berlin": [52.52, 13.41],
  "Europe/Madrid": [40.42, -3.7],
  "Europe/Rome": [41.9, 12.5],
  "Europe/Amsterdam": [52.37, 4.9],
  "Europe/Zurich": [47.38, 8.54],
  "Europe/Stockholm": [59.33, 18.07],
  "Europe/Oslo": [59.91, 10.75],
  "Europe/Copenhagen": [55.68, 12.57],
  "Europe/Helsinki": [60.17, 24.94],
  "Europe/Warsaw": [52.23, 21.01],
  "Europe/Prague": [50.08, 14.44],
  "Europe/Vienna": [48.21, 16.37],
  "Europe/Lisbon": [38.72, -9.14],
  "Europe/Dublin": [53.35, -6.26],
  "Europe/Moscow": [55.76, 37.62],
  "Europe/Istanbul": [41.01, 28.98],
  "Europe/Athens": [37.98, 23.73],
  "Europe/Bucharest": [44.43, 26.1],
  // Asia
  "Asia/Kolkata": [28.61, 77.21],
  "Asia/Calcutta": [22.57, 88.36],
  "Asia/Mumbai": [19.08, 72.88],
  "Asia/Dubai": [25.2, 55.27],
  "Asia/Singapore": [1.35, 103.82],
  "Asia/Tokyo": [35.68, 139.69],
  "Asia/Shanghai": [31.23, 121.47],
  "Asia/Hong_Kong": [22.32, 114.17],
  "Asia/Seoul": [37.57, 126.98],
  "Asia/Taipei": [25.03, 121.57],
  "Asia/Bangkok": [13.76, 100.5],
  "Asia/Jakarta": [-6.21, 106.85],
  "Asia/Manila": [14.6, 121.0],
  "Asia/Kuala_Lumpur": [3.14, 101.69],
  "Asia/Dhaka": [23.81, 90.41],
  "Asia/Karachi": [24.86, 67.01],
  "Asia/Riyadh": [24.69, 46.72],
  "Asia/Tehran": [35.69, 51.39],
  // Oceania
  "Australia/Sydney": [-33.87, 151.21],
  "Australia/Melbourne": [-37.81, 144.96],
  "Australia/Perth": [-31.95, 115.86],
  "Australia/Brisbane": [-27.47, 153.03],
  "Pacific/Auckland": [-36.85, 174.76],
  // Africa
  "Africa/Cairo": [30.04, 31.24],
  "Africa/Lagos": [6.52, 3.38],
  "Africa/Johannesburg": [-26.2, 28.04],
  "Africa/Nairobi": [-1.29, 36.82],
  "Africa/Casablanca": [33.57, -7.59],
};

// Dallas fallback
const DEFAULT_COORDS: [number, number] = [32.78, -96.8];

export function LiveClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [temp, setTemp] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      const tz =
        new Intl.DateTimeFormat("en-US", {
          timeZoneName: "short",
        })
          .formatToParts(now)
          .find((part) => part.type === "timeZoneName")?.value || "CST";

      setTime(`${hours}:${minutes} ${tz}`);

      const month = now.toLocaleString("en-US", { month: "short" }).toUpperCase();
      const day = now.getDate();
      const year = now.getFullYear();
      setDate(`${month} ${day}, ${year}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);

    // Detect Fahrenheit vs Celsius from locale
    const useFahrenheit = (() => {
      try {
        const locale = Intl.DateTimeFormat().resolvedOptions().locale || navigator.language || "";
        const region = locale.split("-").pop()?.toUpperCase() || "";
        return ["US", "BS", "KY", "PW", "MH", "FM"].includes(region);
      } catch {
        return false;
      }
    })();

    const unit = useFahrenheit ? "fahrenheit" : "celsius";
    const symbol = useFahrenheit ? "°F" : "°C";

    // Get coordinates from visitor's timezone — no API call, no prompt
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const [lat, lon] = TIMEZONE_COORDS[timezone] || DEFAULT_COORDS;

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&temperature_unit=${unit}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.current?.temperature_2m != null) {
          setTemp(`${Math.round(data.current.temperature_2m)}${symbol}`);
        }
      })
      .catch(() => {
        // Silently fail — no temp shown
      });

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="font-mono text-[0.625rem] lg:text-[0.6875rem] uppercase tracking-[0.08em] tabular-nums"
      style={{ color: "var(--text-muted)" }}
    >
      {time}
      {temp && (
        <>
          <span style={{ color: "var(--border-custom)", margin: "0 6px" }}>/</span>
          <span style={{ color: "var(--accent-raw)" }}>{temp}</span>
        </>
      )}
      {date && (
        <>
          <span style={{ color: "var(--border-custom)", margin: "0 6px" }}>/</span>
          <span>{date}</span>
        </>
      )}
    </span>
  );
}
