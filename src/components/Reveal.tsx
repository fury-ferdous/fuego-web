"use client";

import type { ElementType, ReactNode } from "react";
import { useInView } from "@/lib/useInView";

type Props = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  variant?: "rise" | "mask";
  className?: string;
};

export function Reveal({ children, as: Tag = "div", delay = 0, variant = "rise", className = "" }: Props) {
  const { ref, visible } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
    >
      <div data-visible={visible} className={variant === "mask" ? "reveal-mask" : "reveal"}>
        {children}
      </div>
    </Tag>
  );
}