// ============================================================
// TruthLayer AI — Core Types
// ============================================================

export type Verdict =
  | "VERIFIED"
  | "PARTIALLY TRUE"
  | "OUTDATED"
  | "MISLEADING"
  | "FALSE";

export interface ExtractedClaim {
  id: string;
  claim: string;
  entity: string;
  metric: string;
  value: string;
  timeframe: string;
  category: ClaimCategory;
  pageNumber: number;
  originalText: string;
}

export type ClaimCategory =
  | "statistic"
  | "percentage"
  | "financial"
  | "date"
  | "company_claim"
  | "growth_metric"
  | "technical"
  | "market_size"
  | "ai_claim"
  | "general";

export interface VerificationSource {
  title: string;
  url: string;
  snippet: string;
  trustLevel: TrustLevel;
  publishedDate?: string;
}

export type TrustLevel =
  | "government"
  | "official_report"
  | "sec_filing"
  | "research"
  | "news"
  | "blog"
  | "unknown";

export interface VerifiedClaim extends ExtractedClaim {
  verdict: Verdict;
  confidenceScore: number; // 0–100
  reasoning: string;
  correctedFact: string | null;
  sources: VerificationSource[];
  verifiedAt: string; // ISO date
}

export interface FactCheckReport {
  id: string;
  fileName: string;
  fileSize: number;
  totalPages: number;
  uploadedAt: string;
  completedAt: string;
  claims: VerifiedClaim[];
  summary: ReportSummary;
  status: ReportStatus;
}

export interface ReportSummary {
  totalClaims: number;
  verified: number;
  partiallyTrue: number;
  outdated: number;
  misleading: number;
  false: number;
  averageConfidence: number;
  riskScore: number; // 0–100, higher = more risky
}

export type ReportStatus =
  | "uploading"
  | "extracting"
  | "verifying"
  | "generating"
  | "completed"
  | "error";

export interface AnalysisProgress {
  status: ReportStatus;
  currentStep: number;
  totalSteps: number;
  currentClaim?: string;
  processedClaims: number;
  totalClaims: number;
  message: string;
}

// API types
export interface UploadResponse {
  reportId: string;
  fileName: string;
  totalPages: number;
  extractedText: string;
}

export interface ClaimExtractionResponse {
  claims: ExtractedClaim[];
  totalFound: number;
}

export interface VerificationResponse {
  claim: VerifiedClaim;
}

export interface ReportResponse {
  report: FactCheckReport;
}
