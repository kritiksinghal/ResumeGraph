# ResumeGraph - Backend

Backend service for **ResumeGraph** — structured resume parsing, storage, and retrieval.

## Tech Stack
- **Runtime**: Node.js (>= 20.0.0) + TypeScript
- **Framework**: Express
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Testing**: Vitest + Supertest

---

## Directory Structure

```
backend/
├── src/
│   ├── config/          # Environment configuration (Zod) and DB pool
│   ├── controllers/     # HTTP route handlers
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic & orchestration (future)
│   ├── db/              # Drizzle schemas and migrations
│   │   └── schema/      # Entity schemas
│   ├── middlewares/     # Global error handling, 404, request validators
│   ├── types/           # Shared domain types and contracts
│   ├── utils/           # Utility functions and loggers
│   ├── app.ts           # Express app factory
│   └── server.ts        # Server entrypoint and graceful shutdown
├── drizzle.config.ts    # Drizzle Kit CLI configuration
├── docker-compose.yml   # PostgreSQL container for local development
├── package.json
└── tsconfig.json
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` (already populated with defaults):
```bash
cp .env.example .env
```

### 3. Start PostgreSQL (Optional via Docker)
```bash
docker compose up -d
```

### 4. Run Development Server
```bash
npm run dev
```

The server will start on `http://localhost:4000`.

---

## Available Scripts

- `npm run dev` — Start the server in watch mode with `tsx`.
- `npm run build` — Compile TypeScript to `dist/`.
- `npm start` — Run compiled JavaScript in production mode.
- `npm test` — Run unit and integration tests with Vitest.
- `npm run db:generate` — Generate Drizzle migration files from schemas.
- `npm run db:migrate` — Apply migrations to PostgreSQL.
- `npm run db:studio` — Launch Drizzle Studio UI to browse the database.

---

## Endpoints (Current Milestone)

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check (uptime, DB status, environment) |
| `GET` | `/api/health` | Health check via `/api` route |
| `POST` | `/api/resumes/ingest` | Complete end-to-end ingestion (Upload -> Extract -> AI Structure -> Persist to DB) |
| `POST` | `/api/resumes/upload` | Upload & extract raw text from PDF or DOCX file (multipart/form-data) |
| `POST` | `/api/resumes/structure` | Structure raw resume text into ResumeData contract via Claude AI |
| `POST` | `/api/resumes` | Create a new structured resume (backend assigns UUIDs) |
| `GET` | `/api/resumes` | List all resumes |
| `GET` | `/api/resumes/:id` | Get single resume by ID |
| `PUT` | `/api/resumes/:id` | Update resume (preserves IDs, assigns new UUIDs for added items) |
| `DELETE` | `/api/resumes/:id` | Delete resume by ID |
