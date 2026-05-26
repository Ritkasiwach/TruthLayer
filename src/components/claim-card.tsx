"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ExternalLink,
  Quote,
  FileText,
  Lightbulb,
  Globe,
} from "lucide-react";
import { VerdictBadge } from "./verdict-badge";
import { ConfidenceBar } from "./confidence-bar";
import type { VerifiedClaim } from "@/types";
import { getVerdictBg, getVerdictGlow, getTrustLevelLabel, getTrustLevelColor } from "@/lib/utils";

interface ClaimCardProps {
  claim: VerifiedClaim;
  index: number;
}

export function ClaimCard({ claim, index }: ClaimCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      layout
      className={`glass-card overflow-hidden transition-shadow duration-300 ${
        isExpanded ? `shadow-lg ${getVerdictGlow(claim.verdict)}` : ""
      }`}
    >
      {/* Main row */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 text-left focus-ring rounded-2xl"
        id={`claim-card-${claim.id}`}
      >
        <div className="flex items-start gap-4">
          {/* Index */}
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[hsl(var(--muted))] 
                          flex items-center justify-center">
            <span className="text-xs font-bold mono text-[hsl(var(--muted-foreground))]">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Claim text */}
          <div className="flex-1 min-w-0 space-y-3">
            <p className="text-sm font-medium text-[hsl(var(--foreground))] leading-relaxed">
              {claim.claim}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <VerdictBadge verdict={claim.verdict} size="sm" />
              
              {claim.entity && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full 
                                 bg-blue-500/10 text-blue-500 text-[10px] font-semibold">
                  {claim.entity}
                </span>
              )}

              {claim.category && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full 
                                 bg-violet-500/10 text-violet-400 text-[10px] font-semibold capitalize">
                  {claim.category.replace("_", " ")}
                </span>
              )}

              <span className="text-[10px] text-[hsl(var(--muted-foreground))] ml-auto">
                Page {claim.pageNumber}
              </span>
            </div>
          </div>

          {/* Confidence + expand */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="w-20 hidden sm:block">
              <ConfidenceBar score={claim.confidenceScore} size="sm" />
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            </motion.div>
          </div>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-[hsl(var(--border))] pt-4">
              {/* Confidence bar (full) */}
              <div className="sm:hidden">
                <ConfidenceBar score={claim.confidenceScore} />
              </div>

              {/* AI Reasoning */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-semibold text-[hsl(var(--foreground))]">
                    AI Reasoning
                  </span>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed pl-5">
                  {claim.reasoning}
                </p>
              </div>

              {/* Corrected fact */}
              {claim.correctedFact && (
                <div
                  className={`p-4 rounded-xl border ${getVerdictBg(
                    claim.verdict
                  )}`}
                >
                  <div className="flex items-start gap-2">
                    <Quote className="w-3.5 h-3.5 mt-0.5 opacity-60 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold mb-1 opacity-70">
                        Corrected Fact
                      </p>
                      <p className="text-sm font-medium leading-relaxed">
                        {claim.correctedFact}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Original text */}
              {claim.originalText && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
                    <span className="text-xs font-semibold text-[hsl(var(--foreground))]">
                      Original Text
                    </span>
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed pl-5 italic">
                    &ldquo;{claim.originalText}&rdquo;
                  </p>
                </div>
              )}

              {/* Sources */}
              {claim.sources.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-xs font-semibold text-[hsl(var(--foreground))]">
                      Sources ({claim.sources.length})
                    </span>
                  </div>
                  <div className="space-y-2 pl-5">
                    {claim.sources.map((source, i) => (
                      <motion.a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 4 }}
                        className="flex items-start gap-3 p-3 rounded-xl 
                                   bg-[hsl(var(--muted))] hover:bg-[hsla(var(--muted-foreground),0.08)]
                                   transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[hsl(var(--foreground))] 
                                        group-hover:text-blue-500 transition-colors truncate">
                            {source.title}
                          </p>
                          <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1 line-clamp-2">
                            {source.snippet}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getTrustLevelColor(
                                source.trustLevel
                              )}`}
                            >
                              {getTrustLevelLabel(source.trustLevel)}
                            </span>
                          </div>
                        </div>
                        <ExternalLink className="w-3 h-3 text-[hsl(var(--muted-foreground))] 
                                                  group-hover:text-blue-500 transition-colors flex-shrink-0 mt-0.5" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
