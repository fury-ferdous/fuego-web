"use client";

import { openTour } from "@/components/tour/TourExperience";

export function OpenTourButton({
  sceneId,
  children,
  className = "btn btn-primary",
}: {
  sceneId?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button type="button" onClick={() => openTour(sceneId)} className={className}>
      {children}
    </button>
  );
}
