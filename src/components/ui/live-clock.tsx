"use client";

import { useEffect, useState } from "react";

export function LiveClock() {
  const [time, setTime] = useState("");
  const [temp, setTemp] = useState<string | null>(null);

  useEffect(() => {
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      // Get timezone abbreviation
      const tz =
        new Intl.DateTimeFormat("en-US", {
          timeZoneName: "short",
        })
          .formatToParts(now)
          .find((part) => part.type === "timeZoneName")?.value || "CST";

      setTime(`${hours}:${minutes}:${seconds} ${tz}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Fetch Dallas weather
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=32.78&longitude=-96.8&current=temperature_2m&temperature_unit=fahrenheit&timezone=America/Chicago"
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.current?.temperature_2m != null) {
          setTemp(`${Math.round(data.current.temperature_2m)}°F`);
        }
      })
      .catch(() => {
        // Silently fail — temp just won't show
      });

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] tabular-nums"
      style={{ color: "var(--text-muted)" }}
    >
      {time}
      {temp && (
        <>
          <span style={{ color: "var(--border-custom)", margin: "0 8px" }}>/</span>
          <span style={{ color: "var(--accent-raw)" }}>{temp}</span>
          <span style={{ color: "var(--text-muted)" }}> Dallas, TX</span>
        </>
      )}
    </span>
  );
}
