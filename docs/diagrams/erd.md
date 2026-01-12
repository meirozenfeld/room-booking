erDiagram
  USER ||--o{ BOOKING : makes
  ROOM ||--o{ BOOKING : has
  ROOM ||--o{ ROOM_AVAILABILITY : defines
  USER ||--o{ REFRESH_TOKEN : owns

  USER {
    uuid id
    string email
    string password
    enum role
  }

  ROOM {
    uuid id
    string name
    int capacity
    boolean isActive
  }

  BOOKING {
    uuid id
    datetime startDate
    datetime endDate
    enum status
  }

  ROOM_AVAILABILITY {
    uuid id
    datetime date
    boolean isBlocked
  }

  REFRESH_TOKEN {
    uuid id
    string token
    datetime expiresAt
  }
