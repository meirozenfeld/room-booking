# Frontend Authentication & Booking Flow

## Authentication Model

The frontend uses a token-based authentication model aligned with the backend design.

- Access tokens are stored in memory and localStorage
- Tokens are attached via the Authorization header
- Refresh tokens are stored but not automatically rotated on the client
- User identity is restored on page reload via `GET /api/users/me`

This avoids decoding JWTs on the client and keeps authorization logic server-driven.

## Route Protection

Protected routes are implemented using a route guard component.

- Routes require a valid access token
- Initial hydration waits for auth state initialization
- Unauthorized users are redirected to `/login`

## Booking UX Decisions

Booking is treated as a **consistency-sensitive write operation**.

- A confirmation step is required before submitting a booking
- No optimistic UI updates are performed
- Backend conflicts (HTTP 409) are surfaced explicitly to the user
- This reflects real-world booking systems where availability may change concurrently
