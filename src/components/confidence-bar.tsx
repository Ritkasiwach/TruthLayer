"use client";

import { motion } from "framer-motion";
import { getConfidenceColor } from "@/lib/utils";

interface ConfidenceBarProps {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function ConfidenceBar({
  score,
  showLabel = true,
  size = "md",
  animated = true,
}: ConfidenceBarProps) {
  const colorClass = getConfidenceColor(score);
  const heights = { sm: "h-1", md: "h-1.5", lg: "h-2" };

  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            Confidence
          </span>
          <span className="text-xs font-semibold mono text-[hsl(var(--foreground))]">
            {score}%
          </span>
        </div>
      )}
      <div
        className={`w-full ${heights[size]} rounded-full bg-[hsl(var(--muted))] overflow-hidden`}
      >
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={animated ? { width: "0%" } : undefined}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}
