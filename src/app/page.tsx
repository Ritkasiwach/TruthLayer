"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Sparkles,
  Zap,
  Globe,
  Brain,
  FileSearch,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/header";
import { UploadZone } from "@/components/upload-zone";
import { AnalysisProgress } from "@/components/analysis-progress";
import { ReportDashboard } from "@/components/report-dashboard";
import type { FactCheckReport, AnalysisProgress as AnalysisProgressType } from "@/types";

type AppState = "upload" | "analyzing" | "report" | "error";

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [report, setReport] = useState<FactCheckReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] =
    useState<AnalysisProgressType>({
      status: "uploading",
      currentStep: 0,
      totalSteps: 4,
      processedClaims: 0,
      totalClaims: 0,
      message: "Preparing analysis...",
    });

  const handleFileAccepted = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      // Complete upload animation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setUploadProgress(100);
      clearInterval(progressInterval);

      // Start analysis
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsUploading(false);
      setAppState("analyzing");
      setAnalysisProgress({
        status: "extracting",
        currentStep: 1,
        totalSteps: 4,
        processedClaims: 0,
        totalClaims: 0,
        message: "Extracting claims from document...",
      });

      // Call the API
      const formData = new FormData();
      formData.append("file", file);

      // Update progress during analysis
      const analysisInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev.status === "extracting") {
            return {
              ...prev,
              status: "verifying",
              currentStep: 2,
              message: "Verifying claims against web data...",
            };
          }
          if (prev.status === "verifying") {
            return {
              ...prev,
              status: "generating",
              currentStep: 3,
              processedClaims: prev.processedClaims + 1,
              message: "Generating verdicts with AI reasoning...",
            };
          }
          return prev;
        });
      }, 5000);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      clearInterval(analysisInterval);

      if (!response.ok) {
        let errorMsg = "Analysis failed";
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch {
          errorMsg = `Server error: ${response.status} ${response.statusText} (This is likely a Vercel timeout)`;
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();

      setAnalysisProgress({
        status: "completed",
        currentStep: 4,
        totalSteps: 4,
        processedClaims: data.report.claims.length,
        totalClaims: data.report.claims.length,
        message: "Analysis complete!",
      });

      // Short delay to show completion
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setReport(data.report);
      setAppState("report");
    } catch (err) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setAppState("error");
    }
  };

  const handleReset = () => {
    setAppState("upload");
    setReport(null);
    setError(null);
    setUploadProgress(0);
    setIsUploading(false);
    setAnalysisProgress({
      status: "uploading",
      currentStep: 0,
      totalSteps: 4,
      processedClaims: 0,
      totalClaims: 0,
      message: "Preparing analysis...",
    });
  };

  return (
    <div className="min-h-screen noise-bg">
      <div className="gradient-mesh" />
      <Header />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {/* ── Upload State ── */}
            {appState === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
              >
                {/* Hero */}
                <div className="text-center mb-16 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                               bg-blue-500/10 border border-blue-500/20 text-blue-500"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">
                      AI-Powered Fact Verification
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-6xl font-bold tracking-tight"
                  >
                    <span className="text-gradient">Verify every claim</span>
                    <br />
                    <span className="text-[hsl(var(--foreground))]">
                      in your documents
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-[hsl(var(--muted-foreground))] max-w-xl mx-auto leading-relaxed"
                  >
                    Upload a PDF and let our AI extract, verify, and score every
                    factual claim against live web data.
                  </motion.p>
                </div>

                {/* Upload zone */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <UploadZone
                    onFileAccepted={handleFileAccepted}
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                  />
                </motion.div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-20"
                  id="features"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        icon: FileSearch,
                        title: "Intelligent Extraction",
                        desc: "AI identifies statistics, financials, dates, and factual claims across your entire document.",
                      },
                      {
                        icon: Globe,
                        title: "Live Verification",
                        desc: "Every claim is verified against trusted web sources, government data, and official reports.",
                      },
                      {
                        icon: Brain,
                        title: "AI Reasoning",
                        desc: "Get detailed verdicts with confidence scores, corrected facts, and source citations.",
                      },
                    ].map((feature, i) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="glass-card p-6 group hover:border-blue-500/20 transition-all duration-300"
                      >
                        <div
                          className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 
                                      border border-blue-500/20 flex items-center justify-center mb-4
                                      group-hover:border-blue-500/30 transition-colors"
                        >
                          <feature.icon className="w-5 h-5 text-blue-500" />
                        </div>
                        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                          {feature.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* How it works */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="mt-20"
                  id="how-it-works"
                >
                  <h2 className="text-2xl font-bold text-center text-[hsl(var(--foreground))] mb-10">
                    How It Works
                  </h2>
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    {[
                      {
                        step: "01",
                        title: "Upload PDF",
                        desc: "Drop your document into the upload zone",
                        icon: Shield,
                      },
                      {
                        step: "02",
                        title: "AI Extracts Claims",
                        desc: "GPT-4.1 identifies all verifiable assertions",
                        icon: Zap,
                      },
                      {
                        step: "03",
                        title: "Live Verification",
                        desc: "Claims are checked against trusted web sources",
                        icon: Globe,
                      },
                      {
                        step: "04",
                        title: "Get Your Report",
                        desc: "Interactive dashboard with verdicts and citations",
                        icon: CheckCircle2,
                      },
                    ].map((item, i) => (
                      <div key={item.step} className="flex-1 flex items-start gap-6 md:flex-col md:items-center md:text-center">
                        <div className="relative">
                          <div
                            className="w-12 h-12 rounded-2xl bg-[hsl(var(--muted))] border border-[hsl(var(--border))]
                                        flex items-center justify-center"
                          >
                            <span className="text-xs font-bold mono text-gradient">
                              {item.step}
                            </span>
                          </div>
                          {i < 3 && (
                            <div className="hidden md:block absolute top-1/2 left-full w-full">
                              <ArrowRight className="w-4 h-4 text-[hsl(var(--border))] ml-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ── Analyzing State ── */}
            {appState === "analyzing" && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center min-h-[60vh]"
              >
                <AnalysisProgress progress={analysisProgress} />
              </motion.div>
            )}

            {/* ── Report State ── */}
            {appState === "report" && report && (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
              >
                <ReportDashboard report={report} onReset={handleReset} />
              </motion.div>
            )}

            {/* ── Error State ── */}
            {appState === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center min-h-[60vh]"
              >
                <div className="glass-card p-8 max-w-md w-full text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 
                                  flex items-center justify-center">
                    <Shield className="w-7 h-7 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-[hsl(var(--foreground))]">
                    Analysis Error
                  </h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {error}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 
                               text-white text-sm font-medium shadow-lg shadow-blue-500/20"
                  >
                    Try Again
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))]">
              TruthLayer AI
            </span>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] opacity-60">
            Powered by GPT-4.1 · Tavily Search · Real-time Web Verification
          </p>
        </div>
      </footer>
    </div>
  );
}
