"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  AlertOctagon,
  XCircle,
} from "lucide-react";
import type { Verdict } from "@/types";

const verdictConfig: Record<
  Verdict,
  {
    icon: React.ElementType;
    className: string;
    label: string;
  }
> = {
  VERIFIED: {
    icon: CheckCircle2,
    className: "verdict-badge verified",
    label: "Verified",
  },
  "PARTIALLY TRUE": {
    icon: AlertTriangle,
    className: "verdict-badge partially-true",
    label: "Partially True",
  },
  OUTDATED: {
    icon: Clock,
    className: "verdict-badge outdated",
    label: "Outdated",
  },
  MISLEADING: {
    icon: AlertOctagon,
    className: "verdict-badge misleading",
    label: "Misleading",
  },
  FALSE: {
    icon: XCircle,
    className: "verdict-badge false",
    label: "False",
  },
};

interface VerdictBadgeProps {
  verdict: Verdict;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function VerdictBadge({
  verdict,
  size = "md",
  animated = true,
}: VerdictBadgeProps) {
  const config = verdictConfig[verdict];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-[10px] px-2.5 py-1 gap-1",
    md: "text-xs px-3.5 py-1.5 gap-1.5",
    lg: "text-sm px-4 py-2 gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  const Component = animated ? motion.span : "span";
  const animProps = animated
    ? {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: "spring" as const, stiffness: 400, damping: 20 },
      }
    : {};

  return (
    <Component
      className={`${config.className} ${sizeClasses[size]}`}
      {...animProps}
    >
      <Icon className={iconSizes[size]} />
      {config.label}
    </Component>
  );
}
