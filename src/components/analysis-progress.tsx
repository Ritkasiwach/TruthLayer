"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FileSearch,
  Brain,
  Globe,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";
import type { AnalysisProgress as AnalysisProgressType } from "@/types";

const steps = [
  {
    id: "extracting",
    label: "Extracting Claims",
    description: "Identifying factual claims, statistics, and metrics",
    icon: FileSearch,
  },
  {
    id: "verifying",
    label: "Verifying Facts",
    description: "Searching live web data and trusted sources",
    icon: Globe,
  },
  {
    id: "generating",
    label: "Generating Verdicts",
    description: "AI reasoning and confidence scoring",
    icon: Brain,
  },
  {
    id: "completed",
    label: "Report Ready",
    description: "Your fact-check report is complete",
    icon: Sparkles,
  },
];

interface AnalysisProgressProps {
  progress: AnalysisProgressType;
}

export function AnalysisProgress({ progress }: AnalysisProgressProps) {
  const currentStepIndex = steps.findIndex((s) => s.id === progress.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="glass-card p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 
                        border border-blue-500/20 flex items-center justify-center"
          >
            <Brain className="w-7 h-7 text-blue-500" />
          </motion.div>
          <h3 className="text-xl font-bold text-[hsl(var(--foreground))] mt-4">
            Analyzing Document
          </h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {progress.message}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-1">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            const isPending = index > currentStepIndex;
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-blue-500/5 border border-blue-500/10"
                    : isCompleted
                    ? "opacity-60"
                    : "opacity-30"
                }`}
              >
                {/* Step indicator */}
                <div className="relative flex-shrink-0">
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="complete"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 
                                   flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </motion.div>
                    ) : isActive ? (
                      <motion.div
                        key="active"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 
                                   flex items-center justify-center pulse-ring"
                      >
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                      </motion.div>
                    ) : (
                      <div
                        className="w-10 h-10 rounded-xl bg-[hsl(var(--muted))] 
                                   flex items-center justify-center"
                      >
                        <Icon className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Step info */}
                <div className="flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      isActive
                        ? "text-[hsl(var(--foreground))]"
                        : "text-[hsl(var(--muted-foreground))]"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                    {step.description}
                  </p>
                </div>

                {/* Status indicator */}
                {isActive && progress.totalClaims > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-right"
                  >
                    <p className="text-xs font-mono text-blue-500">
                      {progress.processedClaims}/{progress.totalClaims}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Current claim being verified */}
        <AnimatePresence>
          {progress.currentClaim && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-[hsl(var(--muted))] border border-[hsl(var(--border))]">
                <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">
                  Currently verifying:
                </p>
                <p className="text-sm text-[hsl(var(--foreground))] font-medium italic">
                  &ldquo;{progress.currentClaim}&rdquo;
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overall progress */}
        <div className="space-y-2">
          <div className="confidence-bar">
            <motion.div
              className="confidence-bar-fill bg-gradient-to-r from-blue-500 to-violet-500"
              animate={{
                width: `${
                  progress.totalClaims > 0
                    ? (progress.processedClaims / progress.totalClaims) * 100
                    : (currentStepIndex / (steps.length - 1)) * 100
                }%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
