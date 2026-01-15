# Booking Creation – Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant DB

    Client->>API: POST /bookings
    API->>DB: BEGIN TRANSACTION
    API->>DB: Validate room exists and is active
    API->>DB: Check overlapping bookings (exclusive end-date logic)
    alt Overlapping booking exists
        API->>DB: ROLLBACK
        API-->>Client: 409 Conflict
    else No overlap
        API->>DB: INSERT booking (CONFIRMED)
        API->>DB: COMMIT
        API-->>Client: 201 Created
    end

