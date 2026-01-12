# Non-Functional & Architectural Decisions

This document describes the key architectural decisions related to scalability,
consistency, security, and reliability in the Room Booking Platform.

---

## Consistency Model

### Booking Consistency (Double Booking Prevention)

**Requirement:**
A room must not have overlapping bookings for the same time range.

**Decision:**
Strong consistency is enforced at the database level.

**Approach Options:**

**Option A – Transactional Check (Initial Implementation):**
- Start a database transaction.
- Query for overlapping bookings for the same room and time range.
- If no overlap exists, insert the new booking.
- Commit the transaction.

**Option B – Database Constraint (Future-Ready):**
- Use PostgreSQL range types (`tsrange`) and an `EXCLUDE` constraint.
- Let the database enforce non-overlapping bookings automatically.

**Rationale:**
- Option A is simpler to implement and sufficient for MVP.
- Option B provides the strongest guarantee and can be introduced without API changes.

---

## Scalability Strategy

### Backend Scalability
- Backend services are stateless.
- JWT-based authentication allows horizontal scaling.
- No in-memory session state is required.

### Database Scalability
- Proper indexing on:
  - Room search fields
  - Booking time ranges
  - Foreign keys
- Pagination is enforced on all list endpoints.

### Caching Strategy
- No caching is required for correctness.
- Redis may be introduced later for:
  - Rate limiting
  - Caching read-heavy endpoints
  - Temporary locks if needed

---

## Security Decisions

### Authentication
- Short-lived access tokens (e.g., 15 minutes).
- Long-lived refresh tokens (e.g., 7–30 days).
- Refresh token rotation on each use.

### Refresh Token Storage
- Refresh tokens are stored in the database.
- Tokens are hashed before storage.
- Tokens can be revoked individually.

### Authorization
- Role-Based Access Control (RBAC).
- Administrative actions are restricted to ADMIN role.

### Password Handling
- Passwords are never stored in plain text.
- bcrypt is used for hashing.
- Password comparison is done using constant-time checks.

---

## Input Validation & Error Handling

### Input Validation
- All external input is validated using Zod schemas.
- Invalid requests are rejected before reaching business logic.

### Error Handling
- Centralized error handling middleware.
- Standardized error response format.
- No internal stack traces are exposed in production.

---

## Rate Limiting

**Initial Strategy:**
- In-memory rate limiting per IP.

**Future Strategy:**
- Redis-based distributed rate limiting for horizontal scaling.

---

## Observability & Reliability

### Logging
- Structured JSON logs.
- Correlation ID assigned per request.
- Logs include request lifecycle events.

### Health & Readiness
- `/health` indicates process liveness.
- `/ready` indicates dependency readiness (DB connectivity).

### Metrics
- `/metrics` endpoint exposes Prometheus-compatible metrics.
- Tracks request counts, error rates, and response times.

---

## Design Principles

- Favor correctness over premature optimization.
- Prefer database guarantees over application-level assumptions.
- Keep the system simple but extensible.
- Optimize for clarity and debuggability.
