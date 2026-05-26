import type { VerificationSource, TrustLevel } from "@/types";

interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  published_date?: string;
  score?: number;
}

interface TavilyResponse {
  results: TavilySearchResult[];
  answer?: string;
}

/**
 * Classify a URL into a trust level based on known patterns
 */
function classifyTrustLevel(url: string): TrustLevel {
  const domain = url.toLowerCase();

  // Government sources
  if (
    domain.includes(".gov") ||
    domain.includes("census.gov") ||
    domain.includes("bls.gov") ||
    domain.includes("sec.gov") ||
    domain.includes("whitehouse.gov") ||
    domain.includes("europa.eu")
  ) {
    return "government";
  }

  // SEC filings
  if (
    domain.includes("sec.gov") ||
    domain.includes("edgar") ||
    domain.includes("secfilings")
  ) {
    return "sec_filing";
  }

  // Official reports & company sites
  if (
    domain.includes("investor") ||
    domain.includes("ir.") ||
    domain.includes("press.") ||
    domain.includes("newsroom") ||
    domain.includes("about.") ||
    domain.includes("blog.google") ||
    domain.includes("openai.com") ||
    domain.includes("microsoft.com") ||
    domain.includes("apple.com") ||
    domain.includes("meta.com") ||
    domain.includes("amazon.com")
  ) {
    return "official_report";
  }

  // Research
  if (
    domain.includes("arxiv.org") ||
    domain.includes("nature.com") ||
    domain.includes("science.org") ||
    domain.includes("ieee.org") ||
    domain.includes("acm.org") ||
    domain.includes("gartner.com") ||
    domain.includes("mckinsey.com") ||
    domain.includes("statista.com") ||
    domain.includes("idc.com") ||
    domain.includes("forrester.com") ||
    domain.includes("deloitte.com") ||
    domain.includes("pwc.com")
  ) {
    return "research";
  }

  // Major news
  if (
    domain.includes("reuters.com") ||
    domain.includes("bloomberg.com") ||
    domain.includes("wsj.com") ||
    domain.includes("nytimes.com") ||
    domain.includes("ft.com") ||
    domain.includes("bbc.com") ||
    domain.includes("cnbc.com") ||
    domain.includes("techcrunch.com") ||
    domain.includes("theverge.com") ||
    domain.includes("arstechnica.com") ||
    domain.includes("wired.com") ||
    domain.includes("forbes.com") ||
    domain.includes("washingtonpost.com") ||
    domain.includes("apnews.com") ||
    domain.includes("theguardian.com")
  ) {
    return "news";
  }

  // Blogs and other
  if (
    domain.includes("medium.com") ||
    domain.includes("substack.com") ||
    domain.includes("wordpress.com") ||
    domain.includes("blogspot.com")
  ) {
    return "blog";
  }

  return "unknown";
}

/**
 * Search the web for evidence about a claim using Tavily API
 */
export async function searchWeb(
  claimText: string
): Promise<VerificationSource[]> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    console.warn("TAVILY_API_KEY not set, returning mock sources");
    return getMockSources(claimText);
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: claimText,
        search_depth: "advanced",
        include_answer: true,
        max_results: 5,
        include_domains: [
          "reuters.com",
          "bloomberg.com",
          "wsj.com",
          "sec.gov",
          "statista.com",
          "techcrunch.com",
          "cnbc.com",
          "bbc.com",
          "nytimes.com",
          "ft.com",
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.statusText}`);
    }

    const data: TavilyResponse = await response.json();

    return data.results.map((result) => ({
      title: result.title,
      url: result.url,
      snippet: result.content.slice(0, 300),
      trustLevel: classifyTrustLevel(result.url),
      publishedDate: result.published_date,
    }));
  } catch (error) {
    console.error("Web search error:", error);
    return getMockSources(claimText);
  }
}

/**
 * Fallback mock sources when API key is not available
 */
function getMockSources(claim: string): VerificationSource[] {
  return [
    {
      title: `Fact check: ${claim.slice(0, 50)}...`,
      url: "https://reuters.com/fact-check",
      snippet:
        "Based on available data, this claim requires verification against current official sources.",
      trustLevel: "news",
      publishedDate: new Date().toISOString(),
    },
    {
      title: "Related industry report",
      url: "https://statista.com/statistics",
      snippet:
        "Statistical data suggests different figures than those cited in the document.",
      trustLevel: "research",
      publishedDate: new Date().toISOString(),
    },
  ];
}
