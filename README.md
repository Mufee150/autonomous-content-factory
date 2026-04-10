# 🚀 Autonomous Content Factory

An AI-powered multi-agent system that transforms a single source document into a complete, consistent multi-channel marketing campaign — powered by Google Gemini.

---

## 💡 Problem

Marketing teams face several challenges:

* 🔁 Repetitive rewriting of the same content across platforms
* 😓 Creative burnout
* ⚠️ Inconsistent messaging and tone
* 🐞 Human errors and hallucinated information
* ⏳ Slow campaign rollout

---

## 🧠 Solution

This project introduces a **multi-agent pipeline** powered by a structured **Meta Document** as a single source of truth.

Instead of generating content directly, the system:

1. Extracts structured knowledge from raw input (Research Agent)
2. Uses it as a **single source of truth** (Meta Document)
3. Generates consistent content across platforms (Copywriter Agent)
4. Validates outputs for accuracy and tone (Editor Agent)
5. Automatically regenerates rejected content (Regeneration Agent)
6. Caches requests to avoid duplicate API calls

---

## ⚙️ Architecture

```text
User Input (source text)
   ↓
Research Agent → Extracts facts → Meta Document (JSON)
   ↓
Copywriter Agent → Blog + Twitter + LinkedIn + Email
   ↓
Editor Agent → Validates accuracy, tone, hallucinations
   ↓
[If REJECTED] → Regeneration Agent → Re-validates
   ↓
Final Multi-Format Output (APPROVED)
```

---

## 🤖 Agents

### 🧠 Research Agent
Converts raw input → Meta Document with structured information.

**Extracts:**
- Product name, target audience
- Key features, value proposition
- Tone of voice, supporting points
- Risks/ambiguities, missing information

**Fallback:** Smart NLP-based extraction from natural text when API is unavailable.

---

### ✍️ Copywriter Agent
Generates 5 content formats from the Meta Document.

**Outputs:**
- 400-500 word Blog Post
- 5-tweet Twitter Thread
- LinkedIn Post
- Email Subject Line
- Email Teaser Copy

**Fallback:** Professional template-based generation using extracted metadata.

---

### ✅ Editor Agent
Validates generated content against the source Meta Document.

**Checks:**
- Hallucination detection (facts not in source)
- Tone consistency across platforms
- Value proposition alignment
- Risk handling (ambiguous points not stated as facts)

**Actions:**
- **APPROVED**: Content is ready to publish
- **REJECTED**: Flags issues → triggers Regeneration Agent

---

### 🔁 Regeneration Agent
Regenerates rejected content based on editor feedback.

**Features:**
- Uses editor feedback to fix specific issues
- Preserves correct sections, only fixes flagged problems
- Re-validated by Editor Agent after regeneration

---

## 🧩 Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React 18 + Vite | Premium dark-themed dashboard UI |
| **Styling** | Tailwind CSS v4 + Custom CSS | Glassmorphism design system |
| **Backend** | Node.js + Express.js | REST API server |
| **AI Model** | Google Gemini 2.0 Flash | Content generation & validation |
| **Icons** | Lucide React | Modern icon set |
| **Routing** | React Router v6 | Client-side navigation |

---

## 📁 Project Structure

```
autonomous-content-factory/
├── client/                          # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation bar (4 links)
│   │   │   ├── UploadBox.jsx        # Source text input
│   │   │   ├── AgentStatus.jsx      # 3-agent pipeline status
│   │   │   ├── ActivityFeed.jsx     # Live pipeline activity log
│   │   │   ├── OutputDisplay.jsx    # 6-tab content viewer
│   │   │   ├── AIAuditCard.jsx      # Editor validation report
│   │   │   └── HistoryPanel.jsx     # Run history list
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page with hero section
│   │   │   ├── Dashboard.jsx        # Pipeline page (main workspace)
│   │   │   ├── History.jsx          # Generation history
│   │   │   └── Analytics.jsx        # Session analytics & stats
│   │   ├── context/
│   │   │   └── AppContext.jsx       # Global state management
│   │   ├── hooks/
│   │   │   └── useAgentFlow.js      # Pipeline orchestration hook
│   │   ├── services/
│   │   │   └── api.js               # API client (retry + error handling)
│   │   ├── styles/
│   │   │   └── index.css            # Design system (CSS custom properties)
│   │   ├── App.jsx                  # Router setup
│   │   └── main.jsx                 # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                          # Node.js backend
│   ├── controllers/
│   │   └── contentController.js     # Route handlers (analyze, generate, create-content)
│   ├── services/
│   │   ├── researchAgent.js         # Meta document extraction
│   │   ├── copywriterAgent.js       # Multi-format content generation
│   │   ├── editorAgent.js           # Content validation & audit
│   │   ├── regenerationAgent.js     # Rejected content regeneration
│   │   ├── apiHandler.js            # Gemini API orchestration + retry
│   │   ├── cacheService.js          # In-memory request caching
│   │   └── promptTemplates.js       # AI prompt templates
│   ├── middleware/
│   │   ├── requestLogger.js         # HTTP request logging
│   │   └── errorHandler.js          # Global error handler
│   ├── routes/
│   │   └── contentRoutes.js         # API route definitions
│   ├── app.js                       # Express app setup
│   ├── server.js                    # Server entry point
│   └── package.json
│
├── shared/                          # Shared schemas
│   └── metaSchema.js                # Meta Document JSON schema
│
├── .env                             # Environment variables
├── .gitignore
├── package.json                     # Root package (workspaces)
├── sample_input.txt                 # Example source text
├── README.md                        # This file
└── APPROACH.md                      # Solution approach document
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Google Gemini API key (get one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone and install
git clone https://github.com/Mufee150/autonomous-content-factory.git
cd autonomous-content-factory
npm install
```

### Configuration

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Run Development Servers

```bash
npm run dev
```

This starts:
- **Backend**: http://localhost:5000 (Express)
- **Frontend**: http://localhost:5173 (Vite + React)

---

## 🖥️ UI Pages

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Landing page with hero section, agent cards, output chips |
| **Pipeline** | `/dashboard` | Main workspace — input, agent status, live feed, output viewer |
| **History** | `/history` | List of all generation runs with approval status |
| **Analytics** | `/analytics` | Session stats — approval rate, word count, output breakdown |

---

## 🔌 API Endpoints

### GET /health
Server health check → `{ "ok": true }`

### POST /analyze
Converts source text into a structured Meta Document.

```json
// Request
{ "source_text": "Your product description here..." }

// Response
{
  "success": true,
  "data": {
    "product_name": "TechFlow Pro",
    "target_audience": "Development teams",
    "key_features": ["AI deadline prediction", "Auto task assignment"],
    "value_proposition": "Streamlines project management with AI",
    "tone_detected": "Professional, technical yet accessible"
  }
}
```

### POST /generate
Generates 5 content formats from a Meta Document + validates with Editor Agent.

```json
// Request
{ "meta_document": { ... } }

// Response
{
  "success": true,
  "data": {
    "blog_post": "...",
    "linkedin_post": "...",
    "twitter_thread": ["Tweet 1", "Tweet 2", "Tweet 3", "Tweet 4", "Tweet 5"],
    "email_subject": "...",
    "email_teaser": "...",
    "editor_review": {
      "status": "APPROVED",
      "hallucinations_found": [],
      "tone_issues": [],
      "suggested_fixes": []
    }
  }
}
```

### POST /create-content
Complete pipeline in one call (Research → Copywrite → Validate).

```json
// Request
{ "source_text": "Your product description here..." }

// Response
{
  "success": true,
  "data": {
    "meta_document": { ... },
    "content": { ... }
  }
}
```

---

## 🔄 Reliability Features

### Retry Logic
Each API call uses exponential backoff with jitter:
```
Attempt 1 → immediate
Attempt 2 → wait ~1s
Attempt 3 → wait ~2s
If all fail → fallback to template-based generation
```

### Smart Fallbacks
When the Gemini API is unavailable (rate limits, quota exhausted, network issues), each agent has a built-in fallback:

| Agent | Fallback Strategy |
|-------|------------------|
| Research | Smart NLP extraction from natural text |
| Copywriter | Professional template-based content |
| Editor | Static validation based on metadata risks |
| Regeneration | Returns original content |

### In-Memory Caching
- Research calls cached for 5 minutes
- Copywrite + Editor calls cached for 10 minutes
- MD5-based cache keys prevent duplicate API calls

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key |
| `PORT` | No | Server port (default: 5000) |
| `CLIENT_URL` | No | Frontend URL for CORS (default: http://localhost:5173) |
| `DEBUG` | No | Enable debug logging (default: false) |

---

## 📄 License

MIT License

---

## 💬 Author

Built by **Mufeedha Aliyar** ✨
