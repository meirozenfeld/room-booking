# Booking Creation – Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant DB

    Client->>API: POST /bookings
    API->>DB: BEGIN TRANSACTION
    API->>DB: Lock Room (FOR UPDATE)
    API->>DB: Check room active & availability
    API->>DB: Check overlapping bookings (exclusive end-date logic)
    API->>DB: INSERT booking (CONFIRMED)
    API->>DB: COMMIT
    API-->>Client: 201 Created
