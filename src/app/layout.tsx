import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "TruthLayer AI — AI-Powered Fact Checking",
  description:
    "Upload a PDF and let AI extract, verify, and score every factual claim against live web data. Detect outdated statistics, fabricated numbers, and unsupported claims instantly.",
  keywords: [
    "fact checking",
    "AI verification",
    "PDF analysis",
    "claim verification",
    "truth detection",
  ],
  authors: [{ name: "TruthLayer AI" }],
  openGraph: {
    title: "TruthLayer AI — AI-Powered Fact Checking",
    description:
      "Verify every claim in your documents with AI-powered fact checking.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
