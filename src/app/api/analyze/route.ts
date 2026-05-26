import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { parsePDF } from "@/lib/pdf-parser";
import { extractClaims } from "@/lib/claim-extractor";
import { searchWeb } from "@/lib/web-verifier";
import { generateVerdict } from "@/lib/verdict-engine";
import { setReport } from "@/lib/store";
import type {
  FactCheckReport,
  VerifiedClaim,
  ReportSummary,
  Verdict,
} from "@/types";

export const maxDuration = 300; // 5 min timeout for Vercel
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    const reportId = uuidv4();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Step 1: Parse PDF
    const parsed = await parsePDF(buffer);

    if (!parsed.text || parsed.text.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract sufficient text from the PDF" },
        { status: 422 }
      );
    }

    // Step 2: Extract claims using AI
    const extractedClaims = await extractClaims(parsed.text);

    if (extractedClaims.length === 0) {
      return NextResponse.json(
        {
          error:
            "No verifiable claims were found in the document. The document may not contain specific factual assertions.",
        },
        { status: 422 }
      );
    }

    // Step 3: Verify each claim
    const verifiedClaims: VerifiedClaim[] = [];

    for (const claim of extractedClaims) {
      // Search for evidence
      const sources = await searchWeb(claim.claim);

      // Generate verdict
      const verified = await generateVerdict(claim, sources);
      verifiedClaims.push(verified);
    }

    // Step 4: Generate summary
    const summary = generateSummary(verifiedClaims);

    // Step 5: Create report
    const report: FactCheckReport = {
      id: reportId,
      fileName: file.name,
      fileSize: file.size,
      totalPages: parsed.totalPages,
      uploadedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      claims: verifiedClaims,
      summary,
      status: "completed",
    };

    // Store the report
    setReport(reportId, report);

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during analysis",
      },
      { status: 500 }
    );
  }
}

function generateSummary(claims: VerifiedClaim[]): ReportSummary {
  const verdictCounts: Record<Verdict, number> = {
    VERIFIED: 0,
    "PARTIALLY TRUE": 0,
    OUTDATED: 0,
    MISLEADING: 0,
    FALSE: 0,
  };

  let totalConfidence = 0;

  for (const claim of claims) {
    verdictCounts[claim.verdict]++;
    totalConfidence += claim.confidenceScore;
  }

  const totalClaims = claims.length;
  const averageConfidence = totalClaims > 0 ? totalConfidence / totalClaims : 0;

  // Risk score: higher when more claims are false/misleading
  const riskFactors =
    verdictCounts.FALSE * 25 +
    verdictCounts.MISLEADING * 20 +
    verdictCounts.OUTDATED * 10 +
    verdictCounts["PARTIALLY TRUE"] * 5;
  const riskScore = Math.min(
    100,
    totalClaims > 0 ? Math.round((riskFactors / totalClaims) * 4) : 0
  );

  return {
    totalClaims,
    verified: verdictCounts.VERIFIED,
    partiallyTrue: verdictCounts["PARTIALLY TRUE"],
    outdated: verdictCounts.OUTDATED,
    misleading: verdictCounts.MISLEADING,
    false: verdictCounts.FALSE,
    averageConfidence: Math.round(averageConfidence),
    riskScore,
  };
}
