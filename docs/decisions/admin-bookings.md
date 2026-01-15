# Administrative Booking Management – Design Decision

## Context

While end users interact only with their own bookings,
administrators require visibility and limited control
over all bookings in the system.

This includes operational oversight, troubleshooting,
and exceptional intervention.

## Decision

Administrative booking management is implemented as a **read-dominant flow**
with tightly controlled write capabilities.

## Admin Booking Capabilities

- View all bookings across all users
- Filter bookings by:
  - Status (CONFIRMED / CANCELLED)
  - Date range
  - Room
- Inspect booking details without modifying core attributes

### Allowed Administrative Actions
- Cancel a booking when operationally required

### Disallowed Actions
- Editing booking time ranges
- Reassigning bookings to different users or rooms
- Creating bookings on behalf of users

## Consistency & Safety Model

- No optimistic UI updates
- All actions are validated server-side
- Booking cancellation follows the same consistency rules
  as user-initiated cancellation
- All administrative booking actions are auditable

## Audit & Observability

Administrative booking actions are:
- Logged at the service layer
- Persisted in the `audit_events` table
- Correlated with request-level identifiers

This ensures full traceability for post-incident analysis
and compliance needs.

## Rationale

- Administrative control should be minimal and explicit
- Reducing write surface lowers the risk of system inconsistency
- Read-heavy admin flows support operational transparency
  without compromising data integrity
