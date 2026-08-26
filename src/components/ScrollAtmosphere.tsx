"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Setzt `--night` auf dem Wurzelelement von 0 (oben, warmes Gold) auf
 * 1 (unten, Neon). Eine einzige CSS-Variable, ein rAF-Tick - kein
 * Scroll-Listener, der pro Pixel Layout erzwingt.
 */
export function ScrollAtmosphere() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      document.documentElement.style.setProperty("--night", "0.5");
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      document.documentElement.style.setProperty("--night", progress.toFixed(3));
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return <div className="atmosphere" aria-hidden />;
}
