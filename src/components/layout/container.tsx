import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  narrow?: boolean;
}

export function Container({ children, narrow = false, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-[64px]",
        narrow ? "max-w-[840px]" : "max-w-[1512px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
