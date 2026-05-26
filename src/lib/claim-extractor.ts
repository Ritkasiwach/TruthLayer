import OpenAI from "openai";
import type { ExtractedClaim } from "@/types";
import { v4 as uuidv4 } from "uuid";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
});

const EXTRACTION_PROMPT = `You are an expert fact-checker. Analyze the following document text and extract all factual claims that can be verified.

Focus on extracting:
- Statistics and numbers
- Percentages
- Financial numbers and revenue
- Dates and timelines
- Company claims and announcements
- Growth metrics
- Technical claims
- Market size claims
- AI-related claims
- Any specific, verifiable factual assertion

For each claim, provide:
1. "claim": The exact factual assertion (rewrite clearly if needed)
2. "entity": The company, organization, or person the claim is about
3. "metric": What is being measured or claimed
4. "value": The specific number, percentage, or value
5. "timeframe": When this applies (year, quarter, date, or "unspecified")
6. "category": One of: statistic, percentage, financial, date, company_claim, growth_metric, technical, market_size, ai_claim, general
7. "pageNumber": Estimated page number based on position (start from 1)
8. "originalText": The closest original sentence from the document

Return a JSON array of claim objects. Extract ALL verifiable claims, not just the most obvious ones.
Be thorough — identify even subtle claims that contain specific facts, numbers, or assertions.

If the document contains obviously fabricated or suspicious numbers, still extract them — they'll be verified later.

IMPORTANT: Return ONLY valid JSON array, no other text.`;

export async function extractClaims(
  text: string
): Promise<ExtractedClaim[]> {
  // Split long documents into chunks for processing
  const maxChunkSize = 12000;
  const chunks: string[] = [];

  if (text.length <= maxChunkSize) {
    chunks.push(text);
  } else {
    for (let i = 0; i < text.length; i += maxChunkSize) {
      chunks.push(text.slice(i, i + maxChunkSize));
    }
  }

  const allClaims: ExtractedClaim[] = [];

  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const chunk = chunks[chunkIndex];

    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4.1",
        messages: [
          { role: "system", content: EXTRACTION_PROMPT },
          {
            role: "user",
            content: `Document text (chunk ${chunkIndex + 1}/${chunks.length}):\n\n${chunk}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) continue;

      let parsed: { claims?: Record<string, string>[] } | Record<string, string>[];
      try {
        parsed = JSON.parse(content);
      } catch {
        // Try to extract JSON array from response
        const match = content.match(/\[[\s\S]*\]/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          continue;
        }
      }

      const claimsArray = Array.isArray(parsed)
        ? parsed
        : (parsed as { claims?: Record<string, string>[] }).claims || [];

      for (const raw of claimsArray) {
        allClaims.push({
          id: uuidv4(),
          claim: raw.claim || "",
          entity: raw.entity || "",
          metric: raw.metric || "",
          value: raw.value || "",
          timeframe: raw.timeframe || "unspecified",
          category: (raw.category as ExtractedClaim["category"]) || "general",
          pageNumber: parseInt(String(raw.pageNumber)) || 1,
          originalText: raw.originalText || raw.original_text || "",
        });
      }
    } catch (error) {
      console.error(`Error processing chunk ${chunkIndex}:`, error);
    }
  }

  return allClaims;
}
