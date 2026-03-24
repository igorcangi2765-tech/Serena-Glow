# 📊 Serena Glow Database Schema

This document provides a visual representation of the Serena Glow database architecture.

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    SERVICES ||--o{ APPOINTMENTS : "booked_for"
    SERVICES ||--o{ SALE_ITEMS : "sold_as"
    SERVICE_CATEGORIES ||--o{ SERVICES : "categorizes"
    CLIENTS ||--o{ APPOINTMENTS : "attends"
    CLIENTS ||--o{ SALES : "purchases"
    SALES ||--o{ SALE_ITEMS : "contains"
    SALES ||--o{ DOCUMENTS : "generates"
    PROFILES ||--o{ APPOINTMENTS : "provides"
    PROFILES ||--o{ CLIENTS : "prefers"

    SERVICES {
        uuid id PK
        uuid category_id FK
        text name_pt
        text name_en
        numeric price
        int duration
    }

    SERVICE_CATEGORIES {
        uuid id PK
        text name_pt
        text name_en
    }

    CLIENTS {
        uuid id PK
        text name
        text phone
        text email
        numeric total_spent
        int total_appointments
        boolean is_vip
    }

    APPOINTMENTS {
        uuid id PK
        uuid customer_id FK
        uuid service_id FK
        uuid staff_id FK
        date appointment_date
        time appointment_time
        text status
    }

    SALES {
        uuid id PK
        uuid customer_id FK
        numeric total
        text status
        text payment_method
        timestamp created_at
    }

    SALE_ITEMS {
        uuid id PK
        uuid sale_id FK
        uuid service_id FK
        int quantity
        numeric unit_price
    }

    DOCUMENTS {
        uuid id PK
        uuid sale_id FK
        text type
        text doc_number
        jsonb metadata
    }

    PROFILES {
        uuid id PK
        text full_name
        boolean is_admin
        text role
    }

    INBOX {
        uuid id PK
        text name
        text email
        text message
        text status
    }
```

## Description of Key Relationships

- **Appointments**: The core junction between Clients, Services, and Staff (Profiles). It tracks time and status.
- **Sales & Items**: Sales record financial transactions, while Sale Items track the specific Services provided in each transaction.
- **Documents**: Linking to Sales to provide Proof of Sale (Receipts/Invoices).
- **Profiles**: Extended user data synced with Auth records, managing roles and permissions.

---
*Created automatically by Antigravity Orchestrator.*
