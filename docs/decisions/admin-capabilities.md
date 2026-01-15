# Administrative Capabilities – Design Decision

## Context

The system includes administrative functionality required for
operational control over rooms and bookings.

Administrative actions differ fundamentally from end-user interactions
and must prioritize correctness, safety, and auditability.

## Decision

Administrative capabilities are implemented as a **separate control surface**
with explicit authorization, confirmation, and backend-driven state.

## Scope of Administrative Capabilities

### Room Management
- Create rooms
- Update room details
- Activate / deactivate rooms
- Rooms are never physically deleted

### Booking Oversight
- View all bookings across users
- Filter bookings by status, date range, and room
- Cancel bookings when necessary (administrative override)

### Access Control
- All administrative actions require the `ADMIN` role
- Authorization is enforced server-side
- Admin UI elements are never rendered for non-admin users

## UX & Consistency Principles

- No optimistic UI updates
- All write operations require explicit user intent
- Destructive actions require confirmation dialogs
- State is always refreshed from the backend after mutations

This ensures that administrative operations remain predictable
and consistent with backend guarantees.

## Rationale

- Administrative mistakes have higher impact than user actions
- Explicitness reduces the risk of unintended system changes
- Soft-deletion preserves historical data integrity
- Clear separation simplifies auditing and debugging

## Consequences

- Admin operations may feel less “snappy” than user flows
- The system favors safety and correctness over UX convenience

This trade-off is intentional and aligned with production-grade systems.
