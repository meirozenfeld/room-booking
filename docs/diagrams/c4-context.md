# C4 Diagram – System Context

This diagram provides a high-level system context view of the Room Booking Platform.
It shows how users interact with the system and how the main components communicate.

---

```mermaid
flowchart LR
    User[End User]
    Admin[Admin User]

    User -->|Browser| WebApp[React Web Application]
    Admin -->|Browser| WebApp

    WebApp -->|HTTPS REST + JWT| API[Backend API<br/>(Node.js + Express)]

    API -->|SQL| Postgres[(PostgreSQL)]
    API -->|Optional| Redis[(Redis)]

    API -->|Logs| LogSink[(Structured Logs)]
    API -->|Metrics| Metrics[(Prometheus Scraper)]

    ---

## Diagram Explanation

### Users
- **End User**: Searches available rooms and creates bookings.
- **Admin User**: Manages rooms and performs administrative actions.

### Web Application
- A React-based frontend accessed via a browser.
- Communicates with the backend using REST over HTTPS.
- Uses JWT access tokens for authentication.

### Backend API
- A Node.js + Express application.
- Handles business logic, validation, and security.
- Exposes REST endpoints for users, rooms, and bookings.

### Database
- PostgreSQL stores all persistent data.
- Ensures transactional consistency, especially for bookings.

### Optional Infrastructure
- Redis may be introduced for caching or rate limiting.
- Logs and metrics are exposed for observability and monitoring.

