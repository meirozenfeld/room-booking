# Booking Lifecycle & State Model

## Overview

The booking system currently operates with a simple and deterministic lifecycle:

CONFIRMED → CANCELLED

Bookings are either successfully created and immediately confirmed, or rejected.
There is no intermediate or partial booking state.

## Why no PENDING state?

Although a `PENDING` status exists in the database schema, it is not used in the current flow.

This is an intentional design decision based on the following assumptions:

- No payment or external approval is required
- Booking creation is synchronous and fully transactional
- Strong consistency is preferred over temporary holds

As a result, a booking is only persisted if it can be fully confirmed.

## Future Extensions

The `PENDING` state is reserved for future use cases such as:

- Payment-based bookings
- Time-limited reservation holds
- Approval workflows

These features can be added without changing the existing transactional model.

---

A detailed sequence diagram illustrating the booking flow
is available under `/docs/diagrams/booking-sequence.md`.
