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
      data-visible={visible}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
      className={`${variant === "mask" ? "reveal-mask" : "reveal"} ${className}`}
    >
      {children}
    </Tag>
  );
}
