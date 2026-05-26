"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Filter,
  Search,
  SlidersHorizontal,
  ArrowLeft,
} from "lucide-react";
import { ReportSummary } from "./report-summary";
import { ClaimCard } from "./claim-card";
import type { FactCheckReport, Verdict } from "@/types";

interface ReportDashboardProps {
  report: FactCheckReport;
  onReset: () => void;
}

const verdictFilters: (Verdict | "ALL")[] = [
  "ALL",
  "VERIFIED",
  "PARTIALLY TRUE",
  "OUTDATED",
  "MISLEADING",
  "FALSE",
];

export function ReportDashboard({ report, onReset }: ReportDashboardProps) {
  const [activeFilter, setActiveFilter] = useState<Verdict | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"confidence" | "verdict" | "page">(
    "page"
  );

  const filteredClaims = useMemo(() => {
    let claims = [...report.claims];

    // Filter by verdict
    if (activeFilter !== "ALL") {
      claims = claims.filter((c) => c.verdict === activeFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      claims = claims.filter(
        (c) =>
          c.claim.toLowerCase().includes(q) ||
          c.entity?.toLowerCase().includes(q) ||
          c.reasoning.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "confidence":
        claims.sort((a, b) => a.confidenceScore - b.confidenceScore);
        break;
      case "verdict":
        const verdictOrder: Record<Verdict, number> = {
          FALSE: 0,
          MISLEADING: 1,
          OUTDATED: 2,
          "PARTIALLY TRUE": 3,
          VERIFIED: 4,
        };
        claims.sort(
          (a, b) => verdictOrder[a.verdict] - verdictOrder[b.verdict]
        );
        break;
      case "page":
      default:
        claims.sort((a, b) => a.pageNumber - b.pageNumber);
    }

    return claims;
  }, [report.claims, activeFilter, searchQuery, sortBy]);

  const handleDownloadReport = () => {
    // Generate a basic text report for download
    const lines = [
      "TruthLayer AI — Fact-Check Report",
      "=".repeat(50),
      `Document: ${report.fileName}`,
      `Pages: ${report.totalPages}`,
      `Claims Analyzed: ${report.summary.totalClaims}`,
      `Risk Score: ${report.summary.riskScore}/100`,
      `Average Confidence: ${Math.round(report.summary.averageConfidence)}%`,
      "",
      "Claims Breakdown:",
      `  ✓ Verified: ${report.summary.verified}`,
      `  ~ Partially True: ${report.summary.partiallyTrue}`,
      `  ⏰ Outdated: ${report.summary.outdated}`,
      `  ⚠ Misleading: ${report.summary.misleading}`,
      `  ✗ False: ${report.summary.false}`,
      "",
      "=".repeat(50),
      "",
    ];

    report.claims.forEach((claim, i) => {
      lines.push(`Claim ${i + 1}: ${claim.claim}`);
      lines.push(`  Verdict: ${claim.verdict}`);
      lines.push(`  Confidence: ${claim.confidenceScore}%`);
      lines.push(`  Reasoning: ${claim.reasoning}`);
      if (claim.correctedFact) {
        lines.push(`  Corrected: ${claim.correctedFact}`);
      }
      if (claim.sources.length > 0) {
        lines.push(`  Sources:`);
        claim.sources.forEach((s) => {
          lines.push(`    - ${s.title}: ${s.url}`);
        });
      }
      lines.push("");
    });

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `truthlayer-report-${report.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] 
                     hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          New analysis
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownloadReport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl 
                     bg-gradient-to-r from-blue-500 to-violet-600 
                     text-white text-sm font-medium shadow-lg shadow-blue-500/20
                     hover:shadow-xl hover:shadow-blue-500/30 transition-shadow"
        >
          <Download className="w-4 h-4" />
          Download Report
        </motion.button>
      </motion.div>

      {/* Summary */}
      <ReportSummary
        summary={report.summary}
        fileName={report.fileName}
        totalPages={report.totalPages}
      />

      {/* Filters & search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search claims, entities, reasoning..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[hsl(var(--muted))] 
                       border border-[hsl(var(--border))] text-sm 
                       text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]
                       focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30
                       transition-all"
            id="claim-search-input"
          />
        </div>

        {/* Filter tabs and sort */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[hsl(var(--muted))]">
            <Filter className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))] ml-2 mr-1" />
            {verdictFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeFilter === filter
                    ? "bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-sm"
                    : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                }`}
              >
                {filter === "ALL" ? "All" : filter.charAt(0) + filter.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-xs bg-transparent text-[hsl(var(--muted-foreground))] 
                         focus:outline-none cursor-pointer"
              id="sort-select"
            >
              <option value="page">Sort by Page</option>
              <option value="confidence">Sort by Confidence</option>
              <option value="verdict">Sort by Verdict</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Claims list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredClaims.map((claim, index) => (
            <ClaimCard key={claim.id} claim={claim} index={index} />
          ))}
        </AnimatePresence>

        {filteredClaims.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              No claims match your filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
