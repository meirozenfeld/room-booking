# Room Booking Platform

A production-oriented Room Booking system designed to demonstrate clean backend architecture,
secure authentication, and scalability-aware design decisions.

This project is built as a step-by-step engineering exercise, following real-world backend
development practices rather than a toy implementation.

---

## 🎯 Project Goals

- Design a realistic booking system with strong consistency guarantees
- Apply clean architecture and separation of concerns
- Implement secure, production-grade authentication
- Demonstrate scalability, security, and observability considerations
- Remain free-tier friendly and easy to run locally

---

## 🧱 Architecture Overview

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + TypeScript (client-side rendered)    
- **Database**: PostgreSQL (via Prisma ORM)  
- **Authentication**: JWT (Access + Refresh Tokens)  
- **Security**: Password hashing, rate limiting, role-based access control  
- **DevOps**: Docker (system-level local orchestration via Docker Compose),
  production-like backend container, environment-based configuration
  nment-based configuration  

High-level architecture and diagrams are available under `/docs`.

---

## 🧰 Core Tooling & Technical Decisions

The project intentionally relies on a focused set of well-established tools,
each selected to support correctness, safety, and operational clarity.

- **Prisma ORM**
  - Type-safe database access
  - Explicit transaction boundaries
  - Schema-driven migrations

- **Zod**
  - Runtime request validation at API boundaries
  - Prevents invalid input from reaching the service layer

- **express-async-errors**
  - Enables centralized async error handling
  - Eliminates repetitive try/catch blocks in route handlers

- **Pino**
  - Structured JSON logging
  - Correlation-friendly and production-ready
  - Low-overhead logging for high-throughput scenarios

- **bcrypt**
  - Secure password hashing
  - No plain-text credential storage

- **Helmet**
  - Secure HTTP headers
  - Baseline protection against common web vulnerabilities

- **CORS**
  - Explicitly restricted origin configuration
  - Prevents unintended cross-origin access

- **dotenv**
  - Environment-based configuration
  - Clear separation between code and secrets

---

## 📁 Project Structure (Backend)

```text
src/
├─ api/            # HTTP layer (routes, controllers, schemas)
├─ services/       # Business logic
├─ repositories/   # Data access (Prisma)
├─ infra/          # Cross-cutting concerns (auth, logging, rate-limit, etc.)
├─ config/         # Environment & configuration
├─ domain/         # Domain concepts (reserved for later phases)
├─ app.ts          # Express app configuration
└─ server.ts       # Server bootstrap
```

## 📁 Project Structure (Frontend)

```text
src/
├─ api/            # API client wrappers
├─ components/     # Reusable UI components
├─ pages/          # Route-level components
├─ hooks/          # Custom React hooks
├─ auth/           # Authentication guards & helpers
├─ types/          # Shared TypeScript types
├─ utils/          # Utility functions
├─ App.tsx         # Root application component
└─ main.tsx        # Application bootstrap
```

This structure follows clean architecture principles and allows the project to scale
without premature over-engineering.

---

## 🔐 Authentication & Security

The system uses a secure, production-oriented authentication model:

- **JWT Access Tokens**
  - Short-lived
  - Stateless
  - Used for request authentication

- **Refresh Tokens**
  - Long-lived
  - Stored in the database
  - Support server-side revocation
  - Rotated on every refresh

- **Password Security**
  - Passwords are hashed using `bcrypt`
  - Plain-text passwords are never stored

- **Authorization**
  - Role-based access control (`USER`, `ADMIN`)
  - Protected routes via middleware

- **Additional Protections**
  - Rate limiting on authentication endpoints
  - Security headers via Helmet
  - Restricted CORS configuration

---

## 🧪 API Overview (Current)

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### User
- `GET /api/users/me` (authenticated)

### Admin
- `GET /api/admin/users` (ADMIN only)

### Rooms
- `GET /api/rooms/search` (read-heavy, paginated)

### Bookings
- `POST /bookings` (authenticated, concurrency-safe)
- `PATCH /bookings/:id/cancel` (owner or ADMIN)

---

## 🖥️ Frontend – User Flows & Consistency

The frontend is implemented using **React + TypeScript** and focuses on correctness,
clarity, and alignment with backend consistency guarantees.

### Key Characteristics

- Token-based authentication using JWT access tokens
- Protected routes with explicit authentication guards
- Stateless room search (read-heavy)
- Explicit booking confirmation to avoid accidental writes
- No optimistic UI for booking operations
- Explicit handling of booking conflicts (HTTP 409)

The frontend intentionally avoids complex state management or heavy UI frameworks,
keeping the focus on system behavior rather than presentation.

---

## 🗄️ Database Schema

Core entities:
- `users`
- `rooms`
- `bookings`
- `room_availability`
- `refresh_tokens`
- `audit_events` (used for booking audit trail)

Booking creation is intentionally treated as a consistency-sensitive operation.

The system does not rely on optimistic UI updates. Instead, booking requests are
confirmed explicitly by the user and validated atomically on the backend.
Concurrency conflicts are returned as HTTP 409 responses and surfaced clearly
to the user interface.

The schema is designed to support concurrency-safe bookings and auditing.
ER diagrams are available under `/docs`.

Bookings follow a simple lifecycle model (CONFIRMED → CANCELLED).
Intermediate states such as PENDING are intentionally reserved for future extensions.

---

## 🔍 Room Search

Room search is implemented as a read-optimized, eventually consistent flow.

- Availability is computed dynamically at query time
- Filtering is performed at the database level
- Pagination and sorting are supported
- No locks or cache are used at this stage

Strong consistency guarantees are enforced during booking creation
via transactional logic and database-level locking.

The booking lifecycle and state model are documented under
`/docs/decisions/booking-lifecycle.md`.

Design rationale is documented under `/docs/decisions/room-search.md`.

---

## 🔍 Observability & Operational Excellence

The system is designed with production-grade observability, enabling deep visibility
into both technical behavior and business-critical flows.

### Health & Readiness Probes

The backend exposes two operational endpoints:

- `/health` – liveness probe indicating that the application process is running.
- `/ready` – readiness probe validating that critical dependencies
  (e.g. database connectivity) are available before receiving traffic.

This separation allows the system to remain observable and resilient
under partial failure scenarios.

### Metrics (Prometheus-Compatible)

The backend exposes a `/metrics` endpoint compatible with Prometheus.

Collected metrics include:
- **HTTP request count** (`http_requests_total`)  
  Labeled by HTTP method, normalized route, and status code.
- **HTTP request latency** (`http_request_duration_seconds`)  
  Histogram-based latency tracking with predefined buckets.
- **Application error count** (`http_errors_total`)  
  Captures both client (4xx) and server (5xx) errors.
- **Default Node.js runtime metrics**  
  CPU usage, memory consumption, and event-loop health.

To ensure production safety, dynamic or unknown routes are intentionally normalized
to avoid high-cardinality metric labels.

### Structured Logging

The application uses structured JSON logging via **Pino**.

Each request log includes:
- HTTP method and path
- Response status code
- Request duration
- A unique correlation ID (`requestId`) propagated across the request lifecycle

This enables reliable request tracing and seamless integration with centralized
log aggregation systems (e.g. ELK, Datadog).

### Business Audit Logs (Bookings)

In addition to technical logs, the system emits **business-level audit logs**
for all critical booking operations.

Logged booking events include:
- Booking attempt
- Booking creation
- Booking cancellation

Each audit log entry contains:
- Event type
- Booking ID
- Room ID
- User ID
- Booking status
- Correlated request ID

Audit logs are emitted at the **service layer**, ensuring clear separation
from HTTP concerns and full visibility into domain behavior.

### Database Audit Trail

Booking creation and cancellation events are also persisted in the database
via the `audit_events` table, providing a durable audit trail for
post-incident analysis and compliance needs.

---


## 🚀 Getting Started (Local)

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or Dockerized)

---

### Environment Configuration

The application expects the following environment variables:

- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`
- `CORS_ORIGIN`

See `.env.example` for a local development template.

---

## Install & Run
```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Dockerized Local Setup (Recommended)

The project supports a one-command local setup using Docker Compose,
providing a production-like runtime environment.

```bash
docker compose up --build
```

Once the containers are running:

Backend health check: http://127.0.0.1:3000/health

Backend readiness check: http://127.0.0.1:3000/ready

Metrics endpoint: http://127.0.0.1:3000/metrics

Database migrations are executed inside the backend container:

docker compose exec backend npx prisma migrate deploy


Database seeding is performed from the host environment to keep the
runtime image minimal and free of development-only dependencies:

```bash
cd apps/backend
npx prisma db seed
```

---

## 📌 Design Philosophy

This project intentionally prioritizes:

- Correctness over premature optimization

- Explicit decisions over magic abstractions

- Production realism over academic purity

- Advanced features (caching, concurrency control, observability, deployment)
  are introduced gradually in later phases.

- Simple, explicit domain models over unused intermediate states

---

## 📚 Documentation

Detailed diagrams, sequence flows, and design notes are available under:
/docs

---

## 👤 Author
Meir Rosenfeld – Full Stack Developer  

---
