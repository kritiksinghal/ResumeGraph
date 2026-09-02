# ResumeGraph

Structured resume creation, extraction, and editing platform.

A local-first, privacy-focused platform that brings software version-control paradigms — branching, diffing, merging — to resume authoring and tailoring.

Your resume evolves the way your career does. ResumeFlow treats each version as a branch, so you can tailor for different roles, track what changed, and merge improvements back — without losing history or overwriting earlier work.

## Repository Layout

- `backend/`: Node.js + TypeScript + Express + PostgreSQL + Drizzle ORM backend service.
- `frontend/`: React 18 + TypeScript (Vite), Tailwind CSS. 100% client-side resume editor.

## Stack

- React 18 + TypeScript, bundled with Vite
- Tailwind CSS, with editorial-grade custom typography (Cormorant Garamond, Playfair Display, Newsreader)
- Node.js + TypeScript + Express + PostgreSQL + Drizzle ORM backend

## Features

- HTML5 Canvas ribbon/particle background animations
- DAG (Directed Acyclic Graph) career branch visualizer
- Deterministic four-level AST/keyword semantic diffing between resume versions
- Real-time ATS (Applicant Tracking System) scoring engine
- Client-side LaTeX/PDF export

## Milestone Goals

1. User can create a resume.
2. User can upload an existing resume (PDF/DOCX).
3. The backend extracts document content.
4. The content is converted into a structured ResumeData representation.
5. The structured resume is persisted in PostgreSQL.
6. The frontend can retrieve and edit the structured resume.

## Getting started

```bash
npm install
npm run dev
```

For backend setup instructions, see [backend/README.md](./backend/README.md).

## License

TBD