/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";

// ── Category data ──
interface Category {
    id: string;
    label: string;
    chartData: number[]; // normalized 0–1
    transactions: { merchant: string; amount: number; date: string }[];
}

const CATEGORIES: Category[] = [
    {
        id: "food",
        label: "Food",
        // Gentle variation, trending slightly up
        chartData: [0.30, 0.35, 0.32, 0.38, 0.36, 0.40, 0.37, 0.42, 0.45, 0.40, 0.43, 0.48, 0.44, 0.50, 0.46, 0.52, 0.48, 0.55, 0.50, 0.53],
        transactions: [
            { merchant: "Whole Foods", amount: -87.32, date: "Mar 18" },
            { merchant: "Chipotle", amount: -12.45, date: "Mar 16" },
        ],
    },
    {
        id: "rent",
        label: "Rent",
        // Flat baseline with monthly spikes
        chartData: [0.08, 0.08, 0.08, 0.08, 0.85, 0.10, 0.08, 0.08, 0.08, 0.08, 0.85, 0.10, 0.08, 0.08, 0.08, 0.08, 0.85, 0.10, 0.08, 0.08],
        transactions: [
            { merchant: "Apartment", amount: -1850.0, date: "Mar 1" },
        ],
    },
    {
        id: "subs",
        label: "Subscriptions",
        // Steady low with small regular bumps
        chartData: [0.15, 0.16, 0.25, 0.16, 0.15, 0.16, 0.28, 0.16, 0.15, 0.16, 0.24, 0.16, 0.15, 0.16, 0.26, 0.16, 0.15, 0.16, 0.25, 0.16],
        transactions: [
            { merchant: "Spotify", amount: -14.99, date: "Mar 15" },
            { merchant: "Netflix", amount: -17.99, date: "Mar 12" },
        ],
    },
    {
        id: "utilities",
        label: "Utilities",
        // Gentle seasonal curve
        chartData: [0.50, 0.54, 0.58, 0.62, 0.66, 0.68, 0.65, 0.60, 0.55, 0.48, 0.42, 0.38, 0.36, 0.38, 0.42, 0.46, 0.50, 0.52, 0.54, 0.56],
        transactions: [
            { merchant: "Electric Co", amount: -142.0, date: "Mar 10" },
            { merchant: "Water Dept", amount: -38.50, date: "Mar 8" },
        ],
    },
    {
        id: "transport",
        label: "Transport",
        // Gentle ups and downs
        chartData: [0.25, 0.28, 0.30, 0.40, 0.45, 0.35, 0.30, 0.32, 0.42, 0.48, 0.38, 0.32, 0.35, 0.44, 0.50, 0.40, 0.35, 0.42, 0.46, 0.38],
        transactions: [
            { merchant: "Uber", amount: -24.80, date: "Mar 17" },
            { merchant: "Gas Station", amount: -45.12, date: "Mar 14" },
        ],
    },
];

// ── Stats ──
const STATS = {
    income: 4820.0,
    expenses: 2731.47,
    balance: 16088.62,
};

// ── Timing ──
const COUNT_DURATION = 1800;
const CHART_DRAW_DURATION = 1800;
const CHART_HOLD = 2200;
const CHART_FADE = 400;
const CYCLE_PAUSE = 1200;

// ── Helpers ──
function fmt(val: number): string {
    return val.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function fmtShort(val: number): string {
    return val.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

function straightPath(points: { x: number; y: number }[]): string {
    return points
        .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
        .join(" ");
}

function getChartPoints(
    data: number[], w: number, h: number, px: number, py: number
): { x: number; y: number }[] {
    const uw = w - px * 2;
    const uh = h - py * 2;
    const step = uw / (data.length - 1);
    return data.map((v, i) => ({
        x: px + i * step,
        y: py + uh * (1 - v),
    }));
}

export function FinancialSaasThumbnail() {
    const [counters, setCounters] = useState({ income: 0, expenses: 0, balance: 0 });
    const [showConnected, setShowConnected] = useState(false);
    const [activeCat, setActiveCat] = useState(0);
    const [chartProgress, setChartProgress] = useState(0);
    const [chartOpacity, setChartOpacity] = useState(1);
    const [showTx, setShowTx] = useState(false);
    const [isReducedMotion, setIsReducedMotion] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const countRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const chartTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const catIndexRef = useRef(0);

    const cleanup = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (countRef.current) clearInterval(countRef.current);
        if (chartTimerRef.current) clearInterval(chartTimerRef.current);
    }, []);

    // ── Draw a single category chart, then move to next ──
    const drawCategory = useCallback((catIdx: number) => {
        setActiveCat(catIdx);
        setChartProgress(0);
        setChartOpacity(1);
        setShowTx(false);

        // Show transactions
        timeoutRef.current = setTimeout(() => {
            setShowTx(true);
        }, 200);

        // Draw line
        timeoutRef.current = setTimeout(() => {
            const c0 = Date.now();
            chartTimerRef.current = setInterval(() => {
                const cp = Math.min((Date.now() - c0) / CHART_DRAW_DURATION, 1);
                setChartProgress(1 - Math.pow(1 - cp, 2));

                if (cp >= 1) {
                    if (chartTimerRef.current) clearInterval(chartTimerRef.current);

                    // Hold
                    timeoutRef.current = setTimeout(() => {
                        // Fade out line
                        setChartOpacity(0);

                        // Next category after fade
                        timeoutRef.current = setTimeout(() => {
                            const nextIdx = (catIdx + 1) % CATEGORIES.length;
                            catIndexRef.current = nextIdx;
                            drawCategory(nextIdx);
                        }, CHART_FADE);
                    }, CHART_HOLD);
                }
            }, 16);
        }, 400);
    }, []);

    useEffect(() => {
        const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        setIsReducedMotion(rm);

        if (rm) {
            setCounters(STATS);
            setShowConnected(true);
            setIsActive(true);
            setChartProgress(1);
            setShowTx(true);
            return;
        }

        // Phase 1: Count up stats
        timeoutRef.current = setTimeout(() => {
            setShowConnected(true);
            setIsActive(true);

            const t0 = Date.now();
            countRef.current = setInterval(() => {
                const p = Math.min((Date.now() - t0) / COUNT_DURATION, 1);
                const e = 1 - Math.pow(1 - p, 3);
                setCounters({
                    income: STATS.income * e,
                    expenses: STATS.expenses * e,
                    balance: STATS.balance * e,
                });

                if (p >= 1) {
                    if (countRef.current) clearInterval(countRef.current);

                    // Phase 2: Start category cycling
                    timeoutRef.current = setTimeout(() => {
                        drawCategory(0);
                    }, 400);
                }
            }, 16);
        }, CYCLE_PAUSE);

        return cleanup;
    }, [cleanup, drawCategory]);

    // ── Current category ──
    const cat = CATEGORIES[activeCat];

    // ── Chart geometry ──
    const W = 440;
    const H = 120;
    const PX = 35;
    const PY = 6;
    const points = getChartPoints(cat.chartData, W, H, PX, PY);
    const linePath = straightPath(points);
    const pathLength = 800;
    const visibleLen = pathLength * chartProgress;

    return (
        <div
            className="relative w-full overflow-hidden rounded-xl select-none flex flex-col"
            style={{
                aspectRatio: "16 / 10",
                backgroundColor: "#161616",
                border: "1px solid var(--border-custom)",
            }}
        >
            {/* ── Dot grid ── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, rgba(239,230,216,0.02) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                }}
            />

            <div
                className="absolute pointer-events-none"
                style={{
                    bottom: "0%",
                    right: "-10%",
                    width: "300px",
                    height: "300px",
                    borderRadius: "50%",
                    background: "var(--accent-raw)",
                    opacity: isActive ? 0.035 : 0.01,
                    filter: "blur(80px)",
                    transition: "opacity 1s ease",
                }}
            />

            {/* ═══ TOP — Income / Expenses / Balance + Plaid ═══ */}
            <div className="relative shrink-0 px-4 pt-3.5 pb-2 md:px-5 md:pt-4" style={{ zIndex: 2 }}>
                <div className="flex items-center gap-2.5">
                    {/* Income */}
                    <div
                        className="flex-1 px-3 py-2 rounded-lg"
                        style={{
                            backgroundColor: "rgba(127,175,155,0.04)",
                            borderWidth: "1px",
                            borderStyle: "solid",
                            borderColor: "rgba(127,175,155,0.1)",
                        }}
                    >
                        <span
                            className="font-mono uppercase tracking-[0.12em] block"
                            style={{ fontSize: "clamp(0.3125rem, 0.55vw, 0.4375rem)", color: "var(--accent-raw)", opacity: 0.6 }}
                        >
                            Income
                        </span>
                        <span
                            className="font-mono tabular-nums block"
                            style={{ fontSize: "clamp(0.5625rem, 1.1vw, 0.875rem)", color: "var(--accent-raw)", opacity: 0.9, fontWeight: 500, lineHeight: 1.3 }}
                        >
                            +${fmtShort(counters.income)}
                        </span>
                    </div>

                    {/* Expenses */}
                    <div
                        className="flex-1 px-3 py-2 rounded-lg"
                        style={{
                            backgroundColor: "rgba(228,90,90,0.04)",
                            borderWidth: "1px",
                            borderStyle: "solid",
                            borderColor: "rgba(228,90,90,0.1)",
                        }}
                    >
                        <span
                            className="font-mono uppercase tracking-[0.12em] block"
                            style={{ fontSize: "clamp(0.3125rem, 0.55vw, 0.4375rem)", color: "#e45a5a", opacity: 0.6 }}
                        >
                            Expenses
                        </span>
                        <span
                            className="font-mono tabular-nums block"
                            style={{ fontSize: "clamp(0.5625rem, 1.1vw, 0.875rem)", color: "#e45a5a", opacity: 0.8, fontWeight: 500, lineHeight: 1.3 }}
                        >
                            -${fmtShort(counters.expenses)}
                        </span>
                    </div>

                    {/* Balance */}
                    <div
                        className="flex-1 px-3 py-2 rounded-lg"
                        style={{
                            backgroundColor: "rgba(239,230,216,0.03)",
                            borderWidth: "1px",
                            borderStyle: "solid",
                            borderColor: "rgba(239,230,216,0.06)",
                        }}
                    >
                        <span
                            className="font-mono uppercase tracking-[0.12em] block"
                            style={{ fontSize: "clamp(0.3125rem, 0.55vw, 0.4375rem)", color: "var(--text-muted)", opacity: 0.5 }}
                        >
                            Balance
                        </span>
                        <span
                            className="font-mono tabular-nums block"
                            style={{ fontSize: "clamp(0.5625rem, 1.1vw, 0.875rem)", color: "var(--text)", opacity: 0.85, fontWeight: 500, lineHeight: 1.3 }}
                        >
                            ${fmt(counters.balance)}
                        </span>
                    </div>

                    {/* Plaid */}
                    <div
                        className="shrink-0 flex items-center gap-1.5 px-2 py-2 rounded-md self-center"
                        style={{
                            backgroundColor: "rgba(239,230,216,0.03)",
                            borderWidth: "1px",
                            borderStyle: "solid",
                            borderColor: showConnected ? "rgba(127,175,155,0.15)" : "rgba(239,230,216,0.06)",
                            transition: "border-color 0.5s ease",
                        }}
                    >
                        <div
                            className="rounded-full"
                            style={{
                                width: "6px",
                                height: "6px",
                                backgroundColor: showConnected ? "var(--accent-raw)" : "rgba(239,230,216,0.15)",
                                boxShadow: showConnected ? "0 0 6px var(--accent-raw)" : "none",
                                animation: showConnected && !isReducedMotion ? "fin-pulse 2s ease-in-out infinite" : "none",
                                transition: "background-color 0.4s ease, box-shadow 0.4s ease",
                            }}
                        />
                        <span
                            className="font-mono uppercase tracking-[0.1em]"
                            style={{
                                fontSize: "clamp(0.3125rem, 0.55vw, 0.4375rem)",
                                color: showConnected ? "var(--accent-raw)" : "var(--text-muted)",
                                opacity: showConnected ? 0.7 : 0.25,
                                transition: "color 0.4s ease, opacity 0.4s ease",
                            }}
                        >
                            Live
                        </span>
                    </div>
                </div>
            </div>

            {/* ═══ MIDDLE — Category tabs + transactions ═══ */}
            <div className="relative shrink-0 px-4 py-1.5 md:px-5" style={{ zIndex: 2 }}>
                {/* Category tabs */}
                <div className="flex items-center gap-1.5 mb-2">
                    {CATEGORIES.map((c, i) => {
                        const isAct = activeCat === i;
                        return (
                            <span
                                key={c.id}
                                className="font-mono uppercase tracking-[0.08em] px-2 py-1 rounded"
                                style={{
                                    fontSize: "clamp(0.3125rem, 0.6vw, 0.4375rem)",
                                    color: isAct ? "var(--accent-raw)" : "var(--text-muted)",
                                    opacity: isAct ? 0.9 : 0.3,
                                    backgroundColor: isAct ? "rgba(127,175,155,0.08)" : "transparent",
                                    borderWidth: "1px",
                                    borderStyle: "solid",
                                    borderColor: isAct ? "rgba(127,175,155,0.15)" : "transparent",
                                    transition: "all 0.35s ease",
                                }}
                            >
                                {c.label}
                            </span>
                        );
                    })}
                </div>

                {/* Transaction rows for active category */}
                <div className="flex items-center gap-4">
                    {cat.transactions.map((tx, i) => (
                        <div
                            key={`${cat.id}-${i}`}
                            className="flex items-center gap-1.5"
                            style={{
                                opacity: showTx ? 1 : 0,
                                transform: showTx ? "translateY(0)" : "translateY(4px)",
                                transition: isReducedMotion ? "none" : `opacity 0.35s ease ${i * 0.1}s, transform 0.35s ease ${i * 0.1}s`,
                            }}
                        >
                            <div
                                className="shrink-0 flex items-center justify-center rounded"
                                style={{
                                    width: "16px",
                                    height: "16px",
                                    backgroundColor: "rgba(239,230,216,0.03)",
                                }}
                            >
                                <ArrowUpRight
                                    size={8}
                                    style={{ color: "var(--text-muted)", opacity: 0.35 }}
                                    strokeWidth={2.5}
                                />
                            </div>
                            <span
                                className="font-mono"
                                style={{ fontSize: "clamp(0.375rem, 0.7vw, 0.5rem)", color: "var(--text)", opacity: 0.5 }}
                            >
                                {tx.merchant}
                            </span>
                            <span
                                className="font-mono tabular-nums"
                                style={{ fontSize: "clamp(0.375rem, 0.7vw, 0.5rem)", color: "var(--text)", opacity: 0.35 }}
                            >
                                -${fmt(Math.abs(tx.amount))}
                            </span>
                            <span
                                className="font-mono"
                                style={{ fontSize: "clamp(0.25rem, 0.5vw, 0.375rem)", color: "var(--text-muted)", opacity: 0.2 }}
                            >
                                {tx.date}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══ BOTTOM — Chart in bordered box ═══ */}
            <div className="relative px-4 pb-3 pt-1 md:px-5 md:pb-4" style={{ zIndex: 1, height: "60%" }}>
                <div
                    className="w-full h-full rounded-lg overflow-hidden flex flex-col"
                    style={{
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: "rgba(239,230,216,0.06)",
                        backgroundColor: "rgba(239,230,216,0.015)",
                    }}
                >
                    {/* Chart header */}
                    <div className="flex items-center justify-between px-3 pt-2 pb-0.5">
                        <span
                            className="font-mono uppercase tracking-[0.1em]"
                            style={{
                                fontSize: "clamp(0.3125rem, 0.6vw, 0.4375rem)",
                                color: "var(--text-muted)",
                                opacity: 0.4,
                                transition: "opacity 0.3s ease",
                            }}
                        >
                            {cat.label} spending · 6M
                        </span>
                    </div>

                    {/* SVG */}
                    <div className="relative flex-1 min-h-0 px-1 pb-1">
                        <svg
                            viewBox={`0 0 ${W} ${H}`}
                            className="w-full h-full"
                            preserveAspectRatio="none"
                            style={{ display: "block" }}
                        >
                            {/* Grid lines */}
                            {[0.0, 0.25, 0.5, 0.75, 1.0].map((r, i) => (
                                <line
                                    key={`g-${i}`}
                                    x1={PX}
                                    y1={PY + (H - PY * 2) * r}
                                    x2={W}
                                    y2={PY + (H - PY * 2) * r}
                                    stroke="var(--text)"
                                    strokeOpacity={0.04}
                                    strokeWidth={0.5}
                                />
                            ))}

                            {/* Y-axis labels */}
                            {[
                                { value: 0.0, label: "$0" },
                                { value: 0.25, label: "$150" },
                                { value: 0.5, label: "$300" },
                                { value: 0.75, label: "$450" },
                                { value: 1.0, label: "$600" },
                            ].map((yl, i) => (
                                <text
                                    key={`yl-${i}`}
                                    x={4}
                                    y={PY + (H - PY * 2) * (1 - yl.value) + 3}
                                    fill="var(--text-muted)"
                                    fillOpacity={0.25}
                                    fontSize="7"
                                    fontFamily="'Azeret Mono', monospace"
                                >
                                    {yl.label}
                                </text>
                            ))}

                            {/* Line */}
                            <path
                                d={linePath}
                                fill="none"
                                stroke="var(--accent-raw)"
                                strokeWidth={1.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray={pathLength}
                                strokeDashoffset={pathLength - visibleLen}
                                style={{
                                    opacity: chartOpacity * 0.85,
                                    transition: isReducedMotion ? "none" : `opacity ${CHART_FADE}ms ease`,
                                }}
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}