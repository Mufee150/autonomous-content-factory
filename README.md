# Autonomous Content Factory

Autonomous Content Factory is a full-stack application for generating structured content using a multi-agent pipeline.

## Structure

- `client/`: React frontend for uploading input, monitoring agent flow, and viewing generated output.
- `server/`: Node.js backend with routes, controllers, AI agents, and utilities.
- `shared/`: Shared schemas and contracts used across frontend and backend.

## Quick Start

### 1) Install dependencies

```bash
npm install
npm run install:all
```

### 2) Run development servers

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Agent Pipeline

1. Research Agent gathers context and key points.
2. Copywriter Agent drafts content.
3. Editor Agent refines and formats final output.

## Backend API

### POST /analyze

Converts source text into a Meta Document.

Request body:

```json
{
	"source_text": "Your source document text here"
}
```

### POST /generate

Generates and validates content from a Meta Document.

Request body:

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

Runs the full pipeline in one call:
1) source text -> Meta Document
2) Meta Document -> generated content
3) Editor validation

Request body:

```json
{
	"source_text": "Your source document text here"
}
```

## Environment

Create/update `.env` with:

- `OPENAI_API_KEY`
- `PORT`
- `CLIENT_URL`

## Notes

This scaffold includes starter placeholders for all requested files so you can begin implementation immediately.

