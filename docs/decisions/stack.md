# Technology Stack Decisions

This document describes the final technology stack selected for the Room Booking Platform and the rationale behind each decision.

The goal of the project is to build a realistic, production-style system that demonstrates scalability, security, observability, and clean architecture, while remaining compatible with free-tier infrastructure.

---

## Backend

### Runtime & Framework
- **Node.js**
- **Express.js**
- **TypeScript**

**Rationale:**
- Node.js provides fast development velocity and strong ecosystem support.
- Express is lightweight, flexible, and widely adopted in production systems.
- TypeScript ensures type safety, improves maintainability, and reduces runtime errors.
- The stack is highly relevant to the current backend job market.

### API Style
- **RESTful API**

**Rationale:**
- Clear and predictable resource-based design.
- Well-suited for CRUD operations on users, rooms, and bookings.
- Simple to integrate with frontend clients and external systems.

### Validation
- **Zod**

**Rationale:**
- Single source of truth for validation and TypeScript types.
- Runtime validation combined with compile-time safety.
- Clean error handling and strong developer experience.

### Authentication & Authorization
- **JWT Access Tokens (short-lived)**
- **JWT Refresh Tokens (long-lived, stored in DB)**
- **Role-Based Access Control (RBAC)**

**Rationale:**
- Stateless access tokens enable horizontal scalability.
- Refresh token rotation allows secure session management and token revocation.
- RBAC enables separation between regular users and administrators.

### Password Security
- **bcrypt**

**Rationale:**
- Industry-standard password hashing algorithm.
- Resistant to brute-force and rainbow table attacks.

### ORM & Migrations
- **Prisma ORM**

**Rationale:**
- Strong TypeScript integration with fully typed queries.
- Schema-driven development with clear migrations.
- Excellent developer experience and maintainability.

---

## Database

### Primary Database
- **PostgreSQL**

**Usage:**
- Users
- Rooms
- Bookings
- Refresh tokens
- Basic audit/logging tables

**Rationale:**
- Strong consistency guarantees and transactional support.
- Ideal for relational data and booking constraints.
- Supports advanced features such as indexes, transactions, and range constraints.
- Widely available on free-tier managed platforms.

---

## Caching & In-Memory Store (Optional)

### Redis (Optional)
**Potential Uses:**
- Rate limiting
- Temporary session-like data
- Caching frequently accessed queries
- Distributed locks (if required in future)

**Rationale:**
- Not required for MVP correctness.
- Can be introduced later without architectural changes.
- PostgreSQL is sufficient for the initial scale of the system.

---

## Frontend

### Framework
- **React**
- **TypeScript**
- **Vite**

**Rationale:**
- Modern, fast development experience.
- Strong community support and ecosystem.
- Type safety across the entire application stack.

### Styling
- **Tailwind CSS**

**Rationale:**
- Rapid UI development.
- Consistent design system.
- Easy to maintain and refactor.

### Data Fetching
- **TanStack Query (React Query)**

**Rationale:**
- Built-in caching, retries, and loading states.
- Declarative and predictable data management.
- Reduces boilerplate and improves UX.

---

## Observability

### Logging
- **Pino**
- **Correlation ID Middleware**

**Rationale:**
- Structured, high-performance logging.
- Correlation IDs enable tracing requests across the system.

### Metrics
- **prom-client**
- **/metrics endpoint (Prometheus-compatible)**

**Rationale:**
- Enables collection of application-level metrics.
- Demonstrates production-grade observability practices.

### Health Checks
- **/health** – liveness
- **/ready** – readiness

**Rationale:**
- Required for container orchestration and load balancers.
- Separates “process is running” from “system is ready”.

---

## Infrastructure & Deployment

### Containerization
- **Docker**
- **Docker Compose (system-level local orchestration)**

**Rationale:**
- Production-like local runtime for the backend service.
- Clear separation between application runtime and infrastructure services.
- Enables one-command local setup while keeping the runtime image minimal.


### Deployment Targets (Free-tier Friendly)
- **Frontend:** Vercel or Netlify
- **Backend:** Render, Fly.io, or Railway
- **Database:** Supabase Postgres, Neon, or managed Postgres on Render

**Rationale:**
- All services offer free tiers suitable for demonstration and portfolio projects.
- Clear separation between frontend, backend, and database layers.

---

## Architectural Principles

- Stateless backend services
- Clear separation of concerns
- Modular monolith with explicit domain boundaries
- Infrastructure-agnostic design
- Designed for future scalability without premature complexity

---

### Final Production Deployment (Phase 9)

The final production deployment uses a fully free-tier setup,
selected to demonstrate realistic deployment constraints and
environment separation.

**Selected Providers:**
- **Frontend:** Vercel  
- **Backend:** Render (Docker-based service)  
- **Database:** Neon (Managed PostgreSQL)

**Rationale:**
- Clear separation between frontend, backend, and database layers
- Zero-cost deployment suitable for portfolio and interview use
- Supports environment-based configuration and managed secrets
- Reflects common real-world deployment patterns for small-to-medium systems

Database migrations are executed via `prisma migrate deploy`.
Seed data is intentionally **not executed in production** to ensure
realistic user creation flows.

---
