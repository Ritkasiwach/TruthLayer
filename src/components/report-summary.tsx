"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  AlertOctagon,
  XCircle,
  TrendingUp,
  Shield,
  FileText,
  BarChart3,
} from "lucide-react";
import type { ReportSummary as ReportSummaryType } from "@/types";

interface ReportSummaryProps {
  summary: ReportSummaryType;
  fileName: string;
  totalPages: number;
}

export function ReportSummary({
  summary,
  fileName,
  totalPages,
}: ReportSummaryProps) {
  const verdictCards = [
    {
      label: "Verified",
      count: summary.verified,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Partially True",
      count: summary.partiallyTrue,
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Outdated",
      count: summary.outdated,
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    {
      label: "Misleading",
      count: summary.misleading,
      icon: AlertOctagon,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
    {
      label: "False",
      count: summary.false,
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
  ];

  const riskColor =
    summary.riskScore >= 70
      ? "text-red-500"
      : summary.riskScore >= 40
      ? "text-amber-500"
      : "text-emerald-500";

  const riskBg =
    summary.riskScore >= 70
      ? "from-red-500/20 to-red-500/5"
      : summary.riskScore >= 40
      ? "from-amber-500/20 to-amber-500/5"
      : "from-emerald-500/20 to-emerald-500/5";

  return (
    <div className="space-y-6">
      {/* Document info bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[hsl(var(--muted))] border border-[hsl(var(--border))]"
      >
        <FileText className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
          {fileName}
        </span>
        <span className="text-xs text-[hsl(var(--muted-foreground))] ml-auto">
          {totalPages} pages · {summary.totalClaims} claims found
        </span>
      </motion.div>

      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Risk Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 relative overflow-hidden"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${riskBg} opacity-50`} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                Risk Score
              </span>
            </div>
            <div className="flex items-end gap-1">
              <span className={`text-4xl font-bold mono ${riskColor}`}>
                {summary.riskScore}
              </span>
              <span className="text-sm text-[hsl(var(--muted-foreground))] mb-1">
                /100
              </span>
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
              {summary.riskScore >= 70
                ? "High risk — many claims unverified"
                : summary.riskScore >= 40
                ? "Moderate risk — some claims need attention"
                : "Low risk — most claims verified"}
            </p>
          </div>
        </motion.div>

        {/* Avg Confidence */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
              Avg Confidence
            </span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-4xl font-bold mono text-[hsl(var(--foreground))]">
              {Math.round(summary.averageConfidence)}
            </span>
            <span className="text-sm text-[hsl(var(--muted-foreground))] mb-1">
              %
            </span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
              initial={{ width: "0%" }}
              animate={{ width: `${summary.averageConfidence}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Total Claims */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
              Claims Analyzed
            </span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-4xl font-bold mono text-[hsl(var(--foreground))]">
              {summary.totalClaims}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {summary.verified > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                {summary.verified} verified
              </span>
            )}
            {summary.false + summary.misleading > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">
                {summary.false + summary.misleading} flagged
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Verdict breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {verdictCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.4 }}
              className={`p-4 rounded-xl ${card.bg} border ${card.border} text-center`}
            >
              <Icon className={`w-5 h-5 mx-auto mb-2 ${card.color}`} />
              <p className={`text-2xl font-bold mono ${card.color}`}>
                {card.count}
              </p>
              <p className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] mt-1 uppercase tracking-wider">
                {card.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
