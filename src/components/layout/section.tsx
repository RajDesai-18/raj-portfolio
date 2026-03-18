import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  id?: string;
  flush?: boolean;
  fullHeight?: boolean;
}

export function Section({
  children,
  id,
  flush = false,
  fullHeight = false,
  className,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full",
        !flush && "py-[clamp(6rem,12vh,10rem)]",
        fullHeight && "min-h-screen",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
