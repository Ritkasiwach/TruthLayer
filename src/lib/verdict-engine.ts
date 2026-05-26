import OpenAI from "openai";
import type {
  ExtractedClaim,
  VerifiedClaim,
  VerificationSource,
  Verdict,
} from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
});

const VERDICT_PROMPT = `You are an expert fact-checker and critical analyst. Given a claim from a document and web search evidence, determine the accuracy of the claim.

You MUST return a JSON object with EXACTLY these fields:
{
  "verdict": "VERIFIED" | "PARTIALLY TRUE" | "OUTDATED" | "MISLEADING" | "FALSE",
  "confidenceScore": <number 0-100>,
  "reasoning": "<detailed explanation of why you reached this verdict>",
  "correctedFact": "<the correct fact if the claim is wrong, or null if verified>"
}

Verdict definitions:
- VERIFIED: The claim is accurate and supported by current evidence
- PARTIALLY TRUE: The claim contains some truth but is incomplete, exaggerated, or missing context
- OUTDATED: The claim may have been true at some point but is no longer accurate
- MISLEADING: The claim uses real data but presents it in a deceptive way
- FALSE: The claim is factually incorrect and not supported by evidence

Guidelines:
- Be skeptical of claims without strong supporting evidence
- Look for specific numbers and compare them carefully
- Consider the timeframe — data changes over time
- Check if the claim cites outdated statistics
- Fabricated or suspiciously round numbers should lower confidence
- If evidence is insufficient, lean towards lower confidence
- Provide specific, actionable corrections when the claim is wrong

IMPORTANT: Return ONLY valid JSON, no other text.`;

export async function generateVerdict(
  claim: ExtractedClaim,
  sources: VerificationSource[]
): Promise<VerifiedClaim> {
  const sourceContext = sources
    .map(
      (s, i) =>
        `Source ${i + 1} (${s.trustLevel}): ${s.title}\nURL: ${s.url}\nExcerpt: ${s.snippet}`
    )
    .join("\n\n");

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1",
      messages: [
        { role: "system", content: VERDICT_PROMPT },
        {
          role: "user",
          content: `CLAIM: "${claim.claim}"
Entity: ${claim.entity || "N/A"}
Metric: ${claim.metric || "N/A"}
Value: ${claim.value || "N/A"}
Timeframe: ${claim.timeframe || "N/A"}
Category: ${claim.category}

WEB EVIDENCE:
${sourceContext || "No web evidence found."}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No response from AI");

    const result = JSON.parse(content);

    return {
      ...claim,
      verdict: validateVerdict(result.verdict),
      confidenceScore: Math.min(
        100,
        Math.max(0, parseInt(result.confidenceScore) || 50)
      ),
      reasoning: result.reasoning || "Unable to determine reasoning.",
      correctedFact: result.correctedFact || null,
      sources,
      verifiedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Verdict generation error:", error);
    return {
      ...claim,
      verdict: "PARTIALLY TRUE",
      confidenceScore: 30,
      reasoning:
        "Unable to fully verify this claim due to processing limitations. Manual review recommended.",
      correctedFact: null,
      sources,
      verifiedAt: new Date().toISOString(),
    };
  }
}

function validateVerdict(v: string): Verdict {
  const valid: Verdict[] = [
    "VERIFIED",
    "PARTIALLY TRUE",
    "OUTDATED",
    "MISLEADING",
    "FALSE",
  ];
  const normalized = v?.toUpperCase()?.trim();
  return valid.includes(normalized as Verdict)
    ? (normalized as Verdict)
    : "PARTIALLY TRUE";
}
