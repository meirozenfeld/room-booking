# Repository Structure

This document describes the monorepo structure of the Room Booking Platform.

The repository is organized to clearly separate frontend, backend, shared code, infrastructure, and documentation, while remaining simple and scalable.

---

## Root Structure

room-booking/
├─ apps/
│ ├─ backend/
│ │ ├─ src/
│ │ │ ├─ modules/
│ │ │ │ ├─ auth/
│ │ │ │ ├─ users/
│ │ │ │ ├─ rooms/
│ │ │ │ ├─ bookings/
│ │ │ │ └─ observability/
│ │ │ ├─ common/
│ │ │ ├─ config/
│ │ │ ├─ app.ts
│ │ │ └─ server.ts
│ │ ├─ prisma/
│ │ ├─ test/
│ │ └─ Dockerfile
│ │
│ ├─ frontend/
│ │ ├─ src/
│ │ │ ├─ features/
│ │ │ ├─ components/
│ │ │ ├─ pages/
│ │ │ ├─ api/
│ │ │ └─ app.tsx
│ │ └─ Dockerfile
│
├─ packages/
│ └─ shared/
│ ├─ src/
│ │ ├─ types/
│ │ └─ contracts/
│ └─ package.json
│
├─ infra/
│ └─ docker/
│ └─ docker-compose.dev.yml
│
├─ docs/
│ ├─ decisions/
│ ├─ diagrams/
│ ├─ system-boundaries.md
│ ├─ micro-boundaries.md
│ └─ repo-structure.md
│
├─ README.md
└─ package.json

---

## Backend Structure Notes

- Each domain lives under `modules/`.
- Business logic is isolated from HTTP controllers.
- Shared utilities and middleware are placed under `common/`.
- Configuration and environment handling are centralized.

---

## Frontend Structure Notes

- Feature-based organization.
- API communication logic is separated from UI components.
- Designed for scalability and testability.

---

## Shared Package

- Contains shared TypeScript types and API contracts.
- Prevents duplication and contract drift between frontend and backend.

---

## Infrastructure

- Docker and Docker Compose are used for local development.
- Production infrastructure is defined separately during deployment phase.

---

## Documentation

- Architectural decisions are documented explicitly.
- Diagrams and boundaries are maintained alongside the code.