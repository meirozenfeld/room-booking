# C4 Diagram – System Context

This diagram provides a high-level system context view of the Room Booking Platform.
It shows how users interact with the system and how the main components communicate.

```mermaid
flowchart LR
    User[End User]
    Admin[Admin User]

    User -->|Browser| WebApp[React Web Application]
    Admin -->|Browser| WebApp

    WebApp -->|HTTPS REST + JWT| API[Backend API (Node.js + Express)]

    API -->|SQL| Postgres[(PostgreSQL)]
    API -->|Optional| Redis[(Redis)]

    API -->|Logs| LogSink[(Structured Logs)]
    API -->|Metrics| Metrics[(Prometheus)]
