import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: string;
  number?: string;
  className?: string;
}

export function SectionLabel({ children, number, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-4 mb-10", className)}>
      {number && (
        <span
          className="font-mono text-[0.75rem] uppercase tracking-[0.12em]"
          style={{ color: "var(--accent-raw)" }}
        >
          {number}
        </span>
      )}
      <div className="h-px w-10" style={{ backgroundColor: "var(--accent-raw)", opacity: 0.3 }} />
      <span
        className="font-mono text-[0.75rem] uppercase tracking-[0.12em]"
        style={{ color: "var(--text-muted)" }}
      >
        {children}
      </span>
    </div>
  );
}
