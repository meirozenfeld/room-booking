# Room Search – Design Decision

## Context
Room search is a read-heavy flow that must scale efficiently and provide
fast responses under high traffic.

## Decision
Room availability is computed dynamically at query time using
database-level filtering, without precomputed availability tables
or locking mechanisms.

## Availability Logic
A room is considered unavailable if there exists at least one booking such that:
- booking.startDate < requestedEndDate
- booking.endDate > requestedStartDate
- booking.status != CANCELLED

This logic supports both multi-day and single-day bookings using
exclusive end-date comparison.


## Rationale
- Search is eventually consistent by design
- Strong consistency is enforced only during booking creation
- Avoids premature optimization and complex cache invalidation
- Leverages existing indexes and relational constraints

## Consequences
- Search results may become stale under extreme concurrency
- Double booking is prevented at booking time, not search time
- The design remains simple, predictable, and scalable

## Future Considerations
- Redis caching with short TTL for hot search queries
- Precomputed availability windows if read load becomes extreme
