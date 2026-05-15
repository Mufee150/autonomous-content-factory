# 🚀 Autonomous Content Factory

An AI-powered multi-agent system that transforms a single source document into a complete, consistent multi-channel marketing campaign — powered by Google Gemini.

---

## 💡 Problem

Every product launch requires Marketing to rewrite the same content for blog, LinkedIn, and newsletter separately. Repetitive rewriting causes burnout, factual errors, and tonal inconsistencies across channels.

## 🧠 Solution

A **4-agent AI pipeline** that takes one source document, extracts verified facts into a structured Meta Document, then generates consistent content across 5 formats — all validated for accuracy by an AI editor.

```
Source Text → Research Agent → Meta Document → Copywriter Agent → 5 Formats
                                                      ↓
                                              Editor Agent (validates)
                                                      ↓
                                 [If rejected] → Regeneration Agent → Re-validates
```

---

## 🚀 Setup & Run Locally (Step-by-Step)

### Prerequisites

- **Node.js** 18 or higher — [download here](https://nodejs.org/)
- **Google Gemini API Key** — get one free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Mufee150/autonomous-content-factory.git
cd autonomous-content-factory
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all dependencies for both `client/` and `server/` workspaces automatically (npm workspaces).

### Step 3: Configure Environment

Create a `.env` file in the **project root**:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

> **Note:** Replace `your_gemini_api_key_here` with your actual Gemini API key.

### Step 4: Start the Application

```bash
npm run dev
```

This starts **both servers** simultaneously:
- **Backend:** http://localhost:5000 (Express API)
- **Frontend:** http://localhost:5173 (Vite + React)

### Step 5: Use the Application

1. Open **http://localhost:5173** in your browser
2. Click **"Open Pipeline"** from the homepage
3. Paste any product description / source text into the text area
4. Click **"Generate Content"**
5. Watch the 3 agents process in real-time (Research → Copywriter → Editor)
6. View generated content across 6 tabs: Meta, Blog, LinkedIn, Twitter, Email, Audit Report
7. Copy any output with one click

---

## 🤖 Agents

| Agent | Input | Output | Purpose |
|-------|-------|--------|---------|
| **Research** | Raw source text | Meta Document (JSON) | Extracts facts, features, audience, tone. Flags ambiguities. |
| **Copywriter** | Meta Document | 5 content formats | Blog (500w), Twitter thread (5 tweets), LinkedIn, Email subject + teaser |
| **Editor** | Meta Document + Content | APPROVED / REJECTED | Hallucination detection, tone audit, value alignment check |
| **Regeneration** | Editor feedback + Content | Fixed content | Regenerates only the problematic sections |

---

## 🖥️ UI Pages

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Landing page — hero section, agent showcase, output format chips |
| **Pipeline** | `/dashboard` | Main workspace — input, agent status, live activity feed, output viewer |
| **History** | `/history` | All generation runs with approval/rejection badges |
| **Analytics** | `/analytics` | Session stats — approval rate, word count, output breakdown |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |
| `POST` | `/analyze` | Source text → Meta Document |
| `POST` | `/generate` | Meta Document → 5 content formats + validation |
| `POST` | `/create-content` | Full pipeline in one call (analyze + generate + validate) |

---

## 🧩 Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18, Vite 5 |
| Styling | Tailwind CSS v4 + CSS Custom Properties |
| Routing | React Router v6 |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| AI Model | Google Gemini 2.0 Flash |
| AI SDK | @google/generative-ai |
| Caching | In-memory with TTL (MD5 keys) |
| Monorepo | npm Workspaces |

---

## 📁 Project Structure

```
autonomous-content-factory/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/          # UI components (Navbar, UploadBox, AgentStatus, etc.)
│   │   ├── pages/               # Home, Dashboard, History, Analytics
│   │   ├── context/             # Global state (AppContext)
│   │   ├── hooks/               # Pipeline orchestration (useAgentFlow)
│   │   ├── services/            # API client with retry logic
│   │   └── styles/              # Design system (CSS custom properties)
│   └── package.json
├── server/                      # Express backend
│   ├── controllers/             # Route handlers
│   ├── services/                # AI agents + API handler + cache
│   ├── middleware/               # Logger, error handler
│   ├── routes/                  # API routes
│   └── package.json
├── shared/                      # Meta Document schema
├── .env                         # API key config
├── APPROACH.md                  # Solution approach document
└── README.md                    # This file
```

---

## 📄 License

MIT License

## 💬 Author

Built by **Mufeedha Aliyar**
