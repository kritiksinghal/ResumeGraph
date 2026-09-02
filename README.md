<<<<<<< HEAD
# ResumeFlow

A local-first, privacy-focused platform that brings software version-control paradigms — branching, diffing, merging — to resume authoring and tailoring.

Your resume evolves the way your career does. ResumeFlow treats each version as a branch, so you can tailor for different roles, track what changed, and merge improvements back — without losing history or overwriting earlier work.

## Stack

- **React 18** + **TypeScript**, bundled with **Vite**
- **Tailwind CSS**, with editorial-grade custom typography (Cormorant Garamond, Playfair Display, Newsreader)
- 100% client-side — no backend, no telemetry. All data lives in local browser storage.

## Features

- HTML5 Canvas ribbon/particle background animations
- DAG (Directed Acyclic Graph) career branch visualizer
- Deterministic four-level AST/keyword semantic diffing between resume versions
- Real-time ATS (Applicant Tracking System) scoring engine
- Client-side LaTeX/PDF export

## Status

Currently scoped to **Showcase 1**: a focused demo covering create-resume and upload-resume flows with a structured editor and live preview. The branching, DAG visualizer, diffing, and ATS scoring — the eventual core of the product — are built but gated behind "Coming Soon" for this milestone.

## Getting started

\`\`\`bash
npm install
npm run dev
\`\`\`

## License

TBD
=======
# ResumeGraph

Structured resume creation, extraction, and editing platform.

## Repository Layout
- `backend/`: Node.js + TypeScript + Express + PostgreSQL + Drizzle ORM backend service.
- `frontend/`: (To be added) Frontend client application.

## Milestone Goals
1. User can create a resume.
2. User can upload an existing resume (PDF/DOCX).
3. The backend extracts document content.
4. The content is converted into a structured `ResumeData` representation.
5. The structured resume is persisted in PostgreSQL.
6. The frontend can retrieve and edit the structured resume.

For backend setup instructions, see [backend/README.md](./backend/README.md).
# ResumeGraph
>>>>>>> target/main
