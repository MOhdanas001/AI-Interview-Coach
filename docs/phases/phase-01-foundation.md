# Phase 1 Documentation: Foundation & Project Architecture

## Overview

Phase 1 establishes the full-stack monorepo foundation for **AI Interview Coach**. It sets up an enterprise-grade TypeScript workspace containing a **Next.js** frontend application, a **NestJS** backend API microservice, modular TypeScript packages, Docker Compose setup, and health verification endpoints.

---

## What Was Built

### 1. Monorepo Architecture (`pnpm` Workspaces)
- Configured workspace root with package script orchestration (`dev`, `build`, `test`, `lint`, `check-types`).
- Standardized TypeScript base rules via `@ai-interview-coach/config`.
- Decoupled contracts into `@ai-interview-coach/types`, `@ai-interview-coach/shared`, and `@ai-interview-coach/ai`.

### 2. NestJS Backend Microservice (`apps/api`)
- Modular architecture with `HealthModule`, `HealthController`, and `HealthService`.
- Global URI versioning (`/api/v1`).
- Custom `HttpExceptionFilter` for uniform API error responses.
- Exposes `GET /api/v1/health` returning:
  ```json
  {
    "status": "ok",
    "service": "ai-interview-coach-api",
    "timestamp": "2026-08-26T20:14:16Z"
  }
  ```
- Unit & E2E tests built with Jest and Supertest (`health.controller.spec.ts` & `health.e2e-spec.ts`).

### 3. Next.js Frontend Application (`apps/web`)
- Built using **Next.js 14 App Router**, **TypeScript**, and **Tailwind CSS**.
- Responsive layout featuring sticky top Navigation Bar, Collapsible Sidebar, and Footer.
- Interactive Landing Page highlighting feature capabilities and the 10-phase roadmap visual cards.
- Dashboard Shell with system metric widgets and a live `HealthBadge` component fetching real-time status from the NestJS backend API.

### 4. Infrastructure & Containerization
- `docker-compose.yml` orchestrating PostgreSQL (with `pgvector/pgvector:pg16` image), Redis 7, NestJS API, and Next.js Web containers.
- Production-ready Dockerfiles (`Dockerfile.api` and `Dockerfile.web`).
- Nginx configuration (`infrastructure/nginx/nginx.conf`).

---

## Folder Structure

```
ai-interview-coach/
├── apps/
│   ├── api/                  # NestJS API microservice
│   │   ├── src/
│   │   │   ├── common/filters/ # HttpExceptionFilter
│   │   │   ├── health/       # Health check controller & service
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── test/             # E2E health tests
│   └── web/                  # Next.js App Router UI
│       └── src/
│           ├── app/          # Pages & Layouts (Landing, Dashboard Shell)
│           └── components/   # Layout (Navbar, Sidebar, Footer) & HealthBadge
├── packages/
│   ├── ai/                   # AI Provider abstraction interfaces & MockAIProvider
│   ├── config/               # Shared tsconfig base files
│   ├── shared/               # Shared constants & helper functions
│   └── types/                # TypeScript DTOs & interfaces
├── docs/
│   ├── architecture/         # System architecture spec
│   └── phases/               # Phase-specific documentation
├── infrastructure/
│   ├── docker/               # Container Dockerfiles
│   └── nginx/                # Nginx reverse proxy configuration
├── .github/workflows/ci.yml # GitHub Actions CI pipeline
├── docker-compose.yml
├── package.json
└── README.md
```

---

## How to Run Locally

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Workspace in Development Mode
```bash
pnpm dev
```
- **Next.js Web Frontend**: [http://localhost:3000](http://localhost:3000)
- **NestJS Backend API**: [http://localhost:3001/api/v1/health](http://localhost:3001/api/v1/health)

### 3. Run Tests
```bash
pnpm test
```

### 4. Docker Compose Environment
```bash
docker-compose up -d
```

---

## What Comes Next (Phase 2 Preview)
In Phase 2, we will implement secure **Authentication and User Profile Management**, introducing user registration, login, JWT token rotation with Argon2 password hashing, profile updates, and protected dashboard routes.
