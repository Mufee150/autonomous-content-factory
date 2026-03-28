# 🚀 Autonomous Content Factory

An AI-powered multi-agent system that transforms a single source document into a complete, consistent multi-channel marketing campaign.

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

This project introduces a **multi-agent pipeline** powered by a structured **Meta Document**.

Instead of directly generating content, the system:

1. Extracts structured knowledge from raw input
2. Uses it as a **single source of truth**
3. Generates consistent content across platforms
4. Validates outputs for accuracy and tone

---

## ⚙️ Architecture

```text
User Input
   ↓
Research Agent → Meta Document (Structured JSON)
   ↓
Copywriter Agent → Blog + Social + Email
   ↓
Editor Agent → Validation & Refinement
   ↓
Final Output
```

---

## 🤖 Agents

### 🧠 Research Agent

* Converts raw input → Meta Document
* Extracts:

  * Product name
  * Features
  * Target audience
  * Value proposition
  * Tone
* Flags ambiguous points

---

### ✍️ Copywriter Agent

* Generates:

  * 500-word Blog Post
  * 5-post Social Thread
  * Email Teaser
* Ensures consistent messaging

---

### ✅ Editor Agent

* Validates generated content
* Detects:

  * Hallucinations
  * Tone inconsistencies
* Ensures alignment with Meta Document

---

## 🔥 Key Innovation

> The introduction of a **Meta Document as a single source of truth**, ensuring consistency and reducing hallucination across all generated outputs.

---

## 🧩 Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Axios

### Backend

* Node.js
* Express.js
* Nodemon

### AI

* OpenAI API
* OpenAI Node SDK

---

## 📁 Project Structure

```bash
autonomous-content-factory/
├── client/                     # React frontend
├── server/                     # Node.js + Express backend
│   ├── services/               # researchAgent, copywriterAgent, editorAgent
│   ├── routes/                 # API routes
│   ├── controllers/            # Request handlers
│   └── config/                 # OpenAI configuration
├── shared/                     # Meta document schema
└── README.md
```

---

## 🚀 Getting Started

### Install dependencies

```bash
npm install
npm run install:all
```

### Run development servers

```bash
npm run dev
```

* Frontend: http://localhost:5173
* Backend: http://localhost:5000

---

## 🔌 API Endpoints

### POST /analyze

Converts source text into a Meta Document.

```json
{
   "source_text": "Your source document text here"
}
```

### POST /generate

Generates and validates content from a Meta Document.

```json
{
   "meta_document": {
      "product_name": "",
      "features": [],
      "target_audience": "",
      "value_proposition": "",
      "tone": "",
      "ambiguous_points": []
   }
}
```

### POST /create-content

Runs the full pipeline in one call.

```json
{
   "source_text": "Your source document text here"
}
```

### GET /health

Simple server health check endpoint.

---

## 🔐 Environment Variables

Create a `.env` file in project root:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

---

## 🔮 Future Improvements

* Real-time agent collaboration UI
* Campaign export (PDF/ZIP)
* Brand tone customization
* Multi-language support

---

## 💬 Author

Built by Mufeedha ✨
