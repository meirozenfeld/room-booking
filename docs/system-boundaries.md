# System Boundaries

This document defines the functional scope of the Room Booking Platform.

Clearly defining system boundaries ensures a focused MVP, prevents unnecessary complexity, and allows future extensions without architectural changes.

---

## In Scope (MVP)

### User Management
- User registration
- User login and logout
- Token refresh
- Basic user profile (id, email, role)
- Role-based access control (USER / ADMIN)

### Room Management
- Create rooms (admin only)
- Update room details
- Deactivate rooms (admin only, soft-deletion)
- List and search rooms
- Filter rooms by basic attributes (e.g., capacity, location, price)

Rooms are never physically deleted.
Deactivation preserves historical booking integrity and auditability.

### Booking Management
- Create a booking for a room
- Cancel a booking
- List bookings for a user
- Prevent overlapping bookings for the same room
- Enforce booking rules through database consistency

### Observability & Operations
- Health endpoint (`/health`)
- Readiness endpoint (`/ready`)
- Metrics endpoint (`/metrics`)
- Structured logging with correlation IDs
- Centralized error handling

### Security
- Password hashing
- JWT-based authentication
- Refresh token rotation
- Input validation on all external inputs
- Basic rate limiting (initially in-memory)

---

## Out of Scope (Explicitly Excluded)

### Payments
- No payment processing
- No pricing calculations beyond static values
- No invoices or receipts

### Notifications
- No email notifications
- No SMS or push notifications
- Only internal hooks for future integrations

### Advanced Booking Logic
- No recurring bookings
- No dynamic pricing
- No waitlists or overbooking logic

### Multi-Tenancy & Marketplace Features
- No multiple organizations or tenants
- No host marketplace features
- No revenue sharing logic

### External Integrations
- No third-party APIs
- No calendar synchronization (Google Calendar, iCal, etc.)

---

## Future Considerations (Not Implemented)

The architecture allows future support for:
- Payment providers (e.g., Stripe)
- Notification services
- Distributed caching
- Multi-tenant deployments
- Advanced analytics and reporting

These features are intentionally excluded from the initial implementation.
