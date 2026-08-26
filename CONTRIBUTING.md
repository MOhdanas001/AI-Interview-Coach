# Contributing to AI Interview Coach

Thank you for your interest in contributing to AI Interview Coach!

## Development Guidelines

1. **Monorepo Architecture**: We follow a strict 10-phase incremental development methodology.
2. **Commit Style**: Use conventional commits:
   - `feat(phase-01): initialize project foundation`
   - `fix(api): handle missing environment variables`
3. **Coding Standards**:
   - Write TypeScript with strict type safety. Avoid `any`.
   - Ensure clean separation of concerns: Business logic belongs in services, not controllers or UI components.
   - Maintain unit and integration tests for all newly added features.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/ai-interview-coach.git
   cd ai-interview-coach
   ```
2. Copy environment file:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Start local development:
   ```bash
   pnpm dev
   ```
5. Run tests:
   ```bash
   pnpm test
   ```
