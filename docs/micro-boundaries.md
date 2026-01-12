# Micro-Boundaries (Domain Separation)

The Room Booking Platform is implemented as a modular monolith.
Each domain is isolated by clear boundaries to ensure maintainability, scalability, and separation of concerns.

This structure allows the system to evolve into microservices in the future without significant refactoring.

---

## Auth & Users Domain

**Responsibilities:**
- User registration
- User login and logout
- Token refresh and token rotation
- Password hashing and verification
- Role-based access control (RBAC)

**Key Entities:**
- User
- RefreshToken

**Notes:**
- Authentication logic is fully isolated from business domains.
- No domain depends directly on authentication internals.

---

## Rooms Domain

**Responsibilities:**
- Create, update, and delete rooms (admin only)
- List and search available rooms
- Manage room attributes (capacity, location, price, etc.)

**Key Entities:**
- Room

**Notes:**
- Rooms are passive entities with no booking logic.
- Booking availability is derived from the Bookings domain.

---

## Bookings Domain

**Responsibilities:**
- Create bookings
- Cancel bookings
- List bookings for a user or room
- Prevent overlapping bookings for the same room
- Enforce booking consistency through database transactions

**Key Entities:**
- Booking

**Notes:**
- This domain contains the core business logic of the system.
- Strong consistency is required to prevent double bookings.

---

## Observability & Operations Domain

**Responsibilities:**
- Health and readiness checks
- Metrics exposure
- Structured logging
- Correlation ID propagation
- Centralized error handling

**Notes:**
- This domain is cross-cutting and used by all other domains.
- Observability concerns are kept separate from business logic.

---

## Cross-Domain Rules

- Domains communicate only through well-defined interfaces.
- No direct database access across domains.
- Shared types are defined in a shared package.
- Business logic never resides in controllers.

---

## Architectural Style

- Modular monolith
- Clear domain ownership
- Stateless application services
- Designed for horizontal scalability
