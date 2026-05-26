# 🛡️ TruthLayer AI

**AI-Powered Fact-Checking for Documents**

TruthLayer AI is a premium, production-grade web application that extracts factual claims from uploaded PDFs and verifies them against live web data using AI reasoning.

![Built with Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![GPT-4.1](https://img.shields.io/badge/GPT--4.1-Powered-412991?logo=openai)

---

## ✨ Features

### Core Capabilities
- **PDF Upload** — Drag-and-drop with progress animation, supporting files up to 50MB
- **Intelligent Claim Extraction** — AI identifies statistics, percentages, financials, dates, growth metrics, technical claims, and more
- **Live Web Verification** — Every claim is checked against trusted sources using Tavily search
- **Verdict Engine** — Returns VERIFIED, PARTIALLY TRUE, OUTDATED, MISLEADING, or FALSE with confidence scores
- **Interactive Report Dashboard** — Filterable, searchable results with expandable evidence cards
- **Downloadable Reports** — Export fact-check reports as text files

### AI Pipeline
```
PDF Upload → Text Extraction → Claim Identification → Web Search → Evidence Comparison → Verdict Generation → Report
```

### Detects
- Outdated statistics
- Fabricated numbers
- Fake growth metrics
- Manipulated percentages
- Unsupported claims

### Source Priority
1. Government websites (.gov)
2. Official company reports
3. SEC filings
4. Trusted research reports (Gartner, McKinsey, Statista)
5. Major news sites (Reuters, Bloomberg, WSJ)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Tavily API key ([Get one here](https://tavily.com))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd assesment_cog

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Configure API Keys

Edit `.env.local` and add your API keys:

```env
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4.1
TAVILY_API_KEY=tvly-your-tavily-api-key
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Main analysis API endpoint
│   ├── globals.css               # Design system & animations
│   ├── layout.tsx                # Root layout with ThemeProvider
│   └── page.tsx                  # Main application page
├── components/
│   ├── analysis-progress.tsx     # Multi-step progress indicator
│   ├── claim-card.tsx            # Expandable claim with evidence
│   ├── confidence-bar.tsx        # Animated confidence score bar
│   ├── header.tsx                # Glass-morphism navigation header
│   ├── report-dashboard.tsx      # Full report with search/filter
│   ├── report-summary.tsx        # Risk score & verdict breakdown
│   ├── theme-provider.tsx        # Dark/light mode provider
│   ├── theme-toggle.tsx          # Animated theme switch
│   ├── upload-zone.tsx           # Drag & drop PDF upload
│   └── verdict-badge.tsx         # Animated verdict indicator
├── lib/
│   ├── claim-extractor.ts        # GPT-4.1 claim extraction
│   ├── pdf-parser.ts             # PDF text extraction
│   ├── store.ts                  # In-memory report store
│   ├── utils.ts                  # Utility functions
│   ├── verdict-engine.ts         # AI verdict generation
│   └── web-verifier.ts           # Tavily web search
└── types/
    └── index.ts                  # TypeScript type definitions
```

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **Theming** | next-themes (dark/light mode) |
| **Icons** | Lucide React |
| **PDF Parsing** | pdf-parse |
| **AI** | OpenAI GPT-4.1 |
| **Web Search** | Tavily API |
| **Deployment** | Vercel / Render / Railway |

---

## 🎨 Design System

The UI is built with a premium design system inspired by Linear, Vercel, and Notion:

- **Glassmorphism** — Frosted glass cards with backdrop blur
- **Gradient Mesh** — Animated background gradients
- **Micro-interactions** — Hover effects, spring animations, smooth transitions
- **Typography** — Inter + JetBrains Mono from Google Fonts
- **Dark/Light Mode** — Full theme support with smooth transitions
- **Verdict Colors** — Color-coded badges and confidence bars
- **Responsive** — Mobile-first responsive design

---

## 📡 API Reference

### POST `/api/analyze`

Upload a PDF for fact-checking analysis.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (PDF file)

**Response:**
```json
{
  "report": {
    "id": "uuid",
    "fileName": "document.pdf",
    "fileSize": 1234567,
    "totalPages": 10,
    "claims": [...],
    "summary": {
      "totalClaims": 15,
      "verified": 8,
      "partiallyTrue": 3,
      "outdated": 2,
      "misleading": 1,
      "false": 1,
      "averageConfidence": 72,
      "riskScore": 35
    },
    "status": "completed"
  }
}
```

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Set environment variables in the Vercel dashboard.

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔧 Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | — | OpenAI API key for claim extraction and verdict generation |
| `OPENAI_MODEL` | No | `gpt-4.1` | OpenAI model to use |
| `TAVILY_API_KEY` | Yes | — | Tavily API key for web search verification |

---

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ❤️ by TruthLayer AI
</p>
