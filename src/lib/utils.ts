import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Verdict, TrustLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getVerdictColor(verdict: Verdict): string {
  const map: Record<Verdict, string> = {
    VERIFIED: "text-emerald-400",
    "PARTIALLY TRUE": "text-amber-400",
    OUTDATED: "text-orange-400",
    MISLEADING: "text-rose-400",
    FALSE: "text-red-500",
  };
  return map[verdict];
}

export function getVerdictBg(verdict: Verdict): string {
  const map: Record<Verdict, string> = {
    VERIFIED: "bg-emerald-500/10 border-emerald-500/20",
    "PARTIALLY TRUE": "bg-amber-500/10 border-amber-500/20",
    OUTDATED: "bg-orange-500/10 border-orange-500/20",
    MISLEADING: "bg-rose-500/10 border-rose-500/20",
    FALSE: "bg-red-500/10 border-red-500/20",
  };
  return map[verdict];
}

export function getVerdictGlow(verdict: Verdict): string {
  const map: Record<Verdict, string> = {
    VERIFIED: "shadow-emerald-500/20",
    "PARTIALLY TRUE": "shadow-amber-500/20",
    OUTDATED: "shadow-orange-500/20",
    MISLEADING: "shadow-rose-500/20",
    FALSE: "shadow-red-500/20",
  };
  return map[verdict];
}

export function getConfidenceColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
}

export function getTrustLevelLabel(level: TrustLevel): string {
  const map: Record<TrustLevel, string> = {
    government: "Government Source",
    official_report: "Official Report",
    sec_filing: "SEC Filing",
    research: "Research Report",
    news: "News Source",
    blog: "Blog / Article",
    unknown: "Unknown Source",
  };
  return map[level];
}

export function getTrustLevelColor(level: TrustLevel): string {
  const map: Record<TrustLevel, string> = {
    government: "text-emerald-400 bg-emerald-500/10",
    official_report: "text-blue-400 bg-blue-500/10",
    sec_filing: "text-indigo-400 bg-indigo-500/10",
    research: "text-violet-400 bg-violet-500/10",
    news: "text-amber-400 bg-amber-500/10",
    blog: "text-zinc-400 bg-zinc-500/10",
    unknown: "text-zinc-500 bg-zinc-500/10",
  };
  return map[level];
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
