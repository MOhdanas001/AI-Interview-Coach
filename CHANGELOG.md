# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - Phase 1 Foundation - 2026-08-26

### Added
- Monorepo structure using Node.js, TypeScript, Next.js, and NestJS.
- Shared packages: `@ai-interview-coach/types`, `@ai-interview-coach/shared`, `@ai-interview-coach/config`, and `@ai-interview-coach/ai`.
- NestJS Backend API service with global exception filter, versioning `v1`, custom logger, and health endpoint `GET /api/v1/health`.
- Next.js Web frontend app with App Router, Tailwind CSS, Lucide icons, responsive layout, Navbar, Sidebar, Dashboard Shell, and Landing page.
- Infrastructure configuration with Docker Compose (PostgreSQL pgvector, Redis, API, and Web).
- Unit and E2E tests for NestJS API health check.
- Comprehensive Phase 1 documentation and root README with Mermaid architecture diagram.
