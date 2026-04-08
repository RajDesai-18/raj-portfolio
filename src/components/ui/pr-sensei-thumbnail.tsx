"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { GitPullRequest, ListTodo, Sparkles, MessageSquareCheck } from "lucide-react";

// ── Code diff lines ──
const DIFF_LINES = [
  { num: "41", type: "ctx", text: "export async function handleWebhook(req: Request) {" },
  { num: "42", type: "ctx", text: "  const payload = await req.json();" },
  { num: "43", type: "del", text: "  const files = payload.pull_request.files;" },
  { num: "43", type: "add", text: "  const files = await fetchChangedFiles(payload);" },
  { num: "44", type: "ctx", text: "  const config = loadReviewConfig();" },
  { num: "45", type: "ctx", text: "" },
  { num: "46", type: "del", text: "  const review = generateReview(files);" },
  { num: "46", type: "add", text: "  const job = await reviewQueue.add('review', {" },
  { num: "47", type: "add", text: "    files, config, pr: payload.number" },
  { num: "48", type: "add", text: "  });" },
  { num: "49", type: "ctx", text: "" },
  { num: "50", type: "del", text: "  return Response.json(review);" },
  { num: "50", type: "add", text: "  return Response.json({ queued: true, jobId: job.id });" },
  { num: "51", type: "ctx", text: "}" },
];

const REVIEW_TEXT = "Validate payload schema before accessing nested fields";

const PIPELINE = [
  { id: "pr", label: "PR", icon: GitPullRequest },
  { id: "queue", label: "QUEUE", icon: ListTodo },
  { id: "llm", label: "LLM", icon: Sparkles },
  { id: "review", label: "REVIEW", icon: MessageSquareCheck },
];

const TRAVEL_DURATION = 900;
const PROCESS_DURATION = 1400;
const TYPING_DURATION = 2200;
const HOLD_DURATION = 2500;
const TOTAL_NODES = PIPELINE.length;

export function PrSenseiThumbnail() {
  const [particleAt, setParticleAt] = useState(-1);
  const [isTraveling, setIsTraveling] = useState(false);
  const [processingNode, setProcessingNode] = useState(-1);
  const [reachedNode, setReachedNode] = useState(-1);
  const [typedText, setTypedText] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (typingRef.current) clearInterval(typingRef.current);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsReducedMotion(reducedMotion);

    if (reducedMotion) {
      setParticleAt(3);
      setReachedNode(3);
      setShowComment(true);
      setTypedText(REVIEW_TEXT);
      setShowStatus(true);
      return;
    }

    const runCycle = () => {
      setShowComment(false);
      setShowStatus(false);
      setTypedText("");
      setParticleAt(-1);
      setReachedNode(-1);
      setProcessingNode(-1);
      setIsTraveling(false);

      let currentNode = 0;

      const travelToNode = (nodeIndex: number) => {
        setIsTraveling(true);
        setProcessingNode(-1);
        setParticleAt(nodeIndex);

        timeoutRef.current = setTimeout(() => {
          setIsTraveling(false);
          setProcessingNode(nodeIndex);
          setReachedNode(nodeIndex);

          timeoutRef.current = setTimeout(() => {
            setProcessingNode(-1);
            currentNode = nodeIndex + 1;

            if (currentNode < TOTAL_NODES) {
              travelToNode(currentNode);
            } else {
              setShowComment(true);
              let charIndex = 0;

              typingRef.current = setInterval(() => {
                charIndex++;
                setTypedText(REVIEW_TEXT.slice(0, charIndex));

                if (charIndex >= REVIEW_TEXT.length) {
                  if (typingRef.current) clearInterval(typingRef.current);
                  timeoutRef.current = setTimeout(() => {
                    setShowStatus(true);
                    timeoutRef.current = setTimeout(() => {
                      runCycle();
                    }, HOLD_DURATION);
                  }, 400);
                }
              }, TYPING_DURATION / REVIEW_TEXT.length);
            }
          }, PROCESS_DURATION);
        }, TRAVEL_DURATION);
      };

      timeoutRef.current = setTimeout(() => {
        travelToNode(0);
      }, 600);
    };

    timeoutRef.current = setTimeout(runCycle, 800);
    return cleanup;
  }, [cleanup]);

  const particlePercent = particleAt >= 0 ? (particleAt / (TOTAL_NODES - 1)) * 100 : 0;

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-xl select-none flex flex-col"
      style={{
        aspectRatio: "16 / 10",
        backgroundColor: "var(--bg)",
        border: "1px solid var(--border-custom)",
      }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, var(--border-custom) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          opacity: 0.4,
        }}
      />

      {/* Glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-30%",
          right: "-15%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "var(--accent-raw)",
          opacity: 0.035,
          filter: "blur(70px)",
        }}
      />

      {/* ═══ PIPELINE ═══ */}
      <div
        className="relative shrink-0 px-4 pt-4 pb-3 md:px-6 md:pt-5 md:pb-3"
        style={{ zIndex: 1 }}
      >
        <div className="relative flex items-center justify-between">
          <div
            className="absolute h-px"
            style={{
              backgroundColor: "var(--border-custom)",
              top: "calc(50% - 8px)",
              left: "14px",
              right: "14px",
            }}
          />
          <div
            className="absolute h-px origin-left"
            style={{
              backgroundColor: "var(--accent-raw)",
              opacity: 0.2,
              top: "calc(50% - 8px)",
              left: "14px",
              right: "14px",
              transform: `scaleX(${reachedNode >= 0 ? reachedNode / (TOTAL_NODES - 1) : 0})`,
              transition: isReducedMotion
                ? "none"
                : `transform ${TRAVEL_DURATION}ms cubic-bezier(0.33, 1, 0.68, 1)`,
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              top: "calc(50% - 8px)",
              left: `calc(14px + ${particlePercent / 100} * (100% - 28px) - 3px)`,
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "var(--accent-raw)",
              boxShadow: "0 0 8px var(--accent-raw), 0 0 20px var(--accent-glow)",
              opacity: isTraveling ? 1 : 0,
              transform: "translateY(-50%)",
              transition: isReducedMotion
                ? "none"
                : `left ${TRAVEL_DURATION}ms cubic-bezier(0.33, 1, 0.68, 1), opacity 0.3s ease`,
            }}
          />

          {PIPELINE.map((node, i) => {
            const isReached = reachedNode >= i;
            const isProcessing = processingNode === i;
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                className="relative flex flex-col items-center gap-1"
                style={{ zIndex: 2 }}
              >
                <div
                  className="flex items-center justify-center transition-all duration-400"
                  style={{
                    width: "clamp(22px, 3.2vw, 28px)",
                    height: "clamp(22px, 3.2vw, 28px)",
                    borderRadius: "50%",
                    border: `1.5px solid ${isReached ? "var(--accent-raw)" : "var(--border-custom)"}`,
                    backgroundColor: isProcessing ? "var(--accent-glow)" : "var(--bg)",
                    boxShadow: isProcessing
                      ? "0 0 14px var(--accent-glow), 0 0 28px var(--accent-glow)"
                      : "none",
                    animation: isProcessing ? "pr-node-pulse 0.8s ease-in-out infinite" : "none",
                    transition:
                      "border-color 0.4s ease, background-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <Icon
                    size={10}
                    className="transition-colors duration-400"
                    style={{
                      color: isReached ? "var(--accent-raw)" : "var(--text-muted)",
                      opacity: isReached ? 1 : 0.3,
                    }}
                    strokeWidth={2}
                  />
                </div>
                <span
                  className="font-mono uppercase tracking-[0.15em] transition-colors duration-400"
                  style={{
                    fontSize: "clamp(0.375rem, 0.75vw, 0.5rem)",
                    color: isProcessing ? "var(--accent-raw)" : "var(--text-muted)",
                    opacity: isProcessing ? 1 : isReached ? 0.7 : 0.3,
                  }}
                >
                  {node.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Separator */}
      <div
        className="mx-4 md:mx-6 h-px shrink-0"
        style={{ backgroundColor: "var(--border-custom)", opacity: 0.5 }}
      />

      {/* ═══ CODE DIFF ═══ */}
      <div
        className="relative flex-1 min-h-0 px-4 pt-3 pb-2 md:px-6 md:pt-4 overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="flex items-center gap-1.5 px-2 py-0.5 rounded"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <svg
              width="8"
              height="10"
              viewBox="0 0 16 16"
              fill="none"
              style={{ color: "var(--text-muted)", opacity: 0.5 }}
            >
              <path
                d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75z"
                fill="currentColor"
              />
            </svg>
            <span
              className="font-mono tracking-wide"
              style={{
                color: "var(--text-muted)",
                opacity: 0.6,
                fontSize: "clamp(0.4375rem, 0.85vw, 0.5625rem)",
              }}
            >
              src/handlers/webhook.ts
            </span>
          </div>
          <div
            className="flex items-center ml-auto font-mono"
            style={{
              fontSize: "clamp(0.375rem, 0.7vw, 0.5rem)",
              color: "var(--text-muted)",
              opacity: 0.35,
            }}
          >
            <span>
              <span style={{ color: "var(--accent-raw)", opacity: 0.7 }}>+4</span>{" "}
              <span style={{ color: "#e45a5a", opacity: 0.7 }}>-3</span>
            </span>
          </div>
        </div>

        <div className="space-y-0">
          {DIFF_LINES.map((line, i) => (
            <div
              key={i}
              className="flex items-start gap-0 font-mono leading-[1.65]"
              style={{ fontSize: "clamp(0.4375rem, 0.95vw, 0.625rem)" }}
            >
              <span
                className="w-5 md:w-7 shrink-0 text-right pr-2 select-none"
                style={{ color: "var(--text-muted)", opacity: 0.2 }}
              >
                {line.num}
              </span>
              <span
                className="w-3 shrink-0 text-center select-none"
                style={{
                  color:
                    line.type === "add"
                      ? "var(--accent-raw)"
                      : line.type === "del"
                        ? "#e45a5a"
                        : "transparent",
                  opacity: 0.7,
                }}
              >
                {line.type === "add" ? "+" : line.type === "del" ? "-" : " "}
              </span>
              <span
                className="whitespace-nowrap overflow-hidden"
                style={{
                  color:
                    line.type === "del"
                      ? "rgba(228,90,90,0.45)"
                      : line.type === "add"
                        ? "var(--accent-raw)"
                        : "var(--text-muted)",
                  opacity: line.type === "del" ? 0.6 : line.type === "ctx" ? 0.3 : 0.75,
                  textDecoration: line.type === "del" ? "line-through" : "none",
                  textDecorationColor: "rgba(228,90,90,0.25)",
                }}
              >
                {line.text || "\u00A0"}
              </span>
            </div>
          ))}
        </div>

        <div
          className="mt-1.5 ml-5 md:ml-7 pl-3 py-1.5 transition-all duration-500"
          style={{
            borderLeft: "2px solid var(--accent-raw)",
            opacity: showComment ? 1 : 0,
            transform: showComment ? "translateY(0)" : "translateY(4px)",
          }}
        >
          <span
            className="font-mono"
            style={{
              color: "var(--accent-raw)",
              fontSize: "clamp(0.4375rem, 0.85vw, 0.5625rem)",
              opacity: 0.85,
            }}
          >
            {typedText}
            {showComment && typedText.length < REVIEW_TEXT.length && (
              <span
                className="inline-block w-[1px] h-[0.7em] ml-px align-middle"
                style={{
                  backgroundColor: "var(--accent-raw)",
                  animation: "pr-cursor-blink 0.6s step-end infinite",
                }}
              />
            )}
          </span>
        </div>
      </div>

      {/* ═══ STATUS BAR ═══ */}
      <div className="relative shrink-0 px-4 pb-3 pt-2 md:px-6 md:pb-4" style={{ zIndex: 1 }}>
        <div
          className="mb-2.5 h-px"
          style={{ backgroundColor: "var(--border-custom)", opacity: 0.5 }}
        />
        <div
          className="flex items-center gap-2"
          style={{
            opacity: showStatus ? 1 : 0,
            transform: showStatus ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "var(--accent-glow)",
              border: "1px solid var(--accent-raw)",
            }}
          >
            <svg
              width="8"
              height="8"
              viewBox="0 0 12 12"
              fill="none"
              style={{ color: "var(--accent-raw)" }}
            >
              <path
                d="M2.5 6L5 8.5L9.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            className="font-mono tracking-wide"
            style={{
              fontSize: "clamp(0.4375rem, 0.8vw, 0.5625rem)",
              color: "var(--accent-raw)",
              opacity: 0.9,
            }}
          >
            Review complete
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: "clamp(0.375rem, 0.7vw, 0.5rem)",
              color: "var(--text-muted)",
              opacity: 0.4,
            }}
          >
            ·
          </span>
          <span
            className="font-mono tracking-wide"
            style={{
              fontSize: "clamp(0.375rem, 0.7vw, 0.5rem)",
              color: "var(--text-muted)",
              opacity: 0.4,
            }}
          >
            2 suggestions
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: "clamp(0.375rem, 0.7vw, 0.5rem)",
              color: "var(--text-muted)",
              opacity: 0.4,
            }}
          >
            ·
          </span>
          <span
            className="font-mono tracking-wide"
            style={{
              fontSize: "clamp(0.375rem, 0.7vw, 0.5rem)",
              color: "var(--text-muted)",
              opacity: 0.4,
            }}
          >
            1.4s
          </span>
        </div>
      </div>
    </div>
  );
}
