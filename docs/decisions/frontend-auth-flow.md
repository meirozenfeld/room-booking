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

## Administrative Authorization Flow

In addition to standard user authentication, the frontend supports
role-based authorization for administrative functionality.

### Admin Route Protection

- Administrative routes are grouped under a dedicated `/admin` namespace.
- Access to admin routes requires:
  - A valid access token
  - A user role of `ADMIN`
- Role validation is enforced both:
  - Client-side (route guards)
  - Server-side (authorization middleware)

Unauthorized access attempts result in a redirect to a safe route
(e.g. home or login), without exposing administrative UI elements.

### Admin UX Principles

- Administrative actions are treated as operational controls rather than user interactions.
- No optimistic UI updates are used.
- All mutations trigger an explicit data reload from the backend.
- Destructive actions require explicit confirmation dialogs.

This approach prioritizes correctness, predictability, and safety
over perceived responsiveness.
