# BBSM App — Phase 1 Architecture

## System Overview

```
┌─────────────────────────┐     HTTPS      ┌─────────────────────────┐
│   Customer Mobile App   │ ─────────────► │                         │
│  (React Native + Expo)  │                │   BBSM Backend API      │
│   iOS + Android         │                │   (Node.js + Express)   │
└─────────────────────────┘                │                         │
                                           │   Port 4000             │
┌─────────────────────────┐     HTTPS      │   /api/v1/*             │
│   Admin Dashboard       │ ─────────────► │                         │
│   (React.js)            │                └────────────┬────────────┘
│   Internal use only     │                             │
└─────────────────────────┘                   ┌─────────┴──────────┐
                                              │                    │
                                    ┌─────────▼───────┐  ┌────────▼────────┐
                                    │   PostgreSQL 15  │  │    Redis 7      │
                                    │   (Primary DB)   │  │   (Cache/OTP)   │
                                    └─────────────────┘  └─────────────────┘
```

## Key Architectural Decisions

### 1. No ORM (Phase 1)
We use raw SQL via `node-postgres` (pg). This keeps queries explicit, fast, and
easy to audit. If the team grows or query complexity increases, we can introduce
Knex.js (query builder) in Phase 2 without a full rewrite.

### 2. Decoupled from ERP/POS
Phase 1 is entirely standalone. Store data is seeded from CSV. Purchase history
is not yet linked to real POS transactions. ERP integration is Phase 2.

### 3. PostgreSQL as source of truth, Redis as cache
- All business data lives in PostgreSQL
- Redis is used for: OTP storage (TTL 5 min), loyalty_config cache (TTL 1 min),
  rate limiting, and FCM token lookups
- If Redis goes down, the app degrades gracefully (OTP falls back to DB check)

### 4. Versioned API
All routes are prefixed `/api/v1/`. When breaking changes are needed, a `/v2/`
prefix is added and `/v1/` is deprecated with a sunset date.

### 5. Firebase for auth, not custom JWT for mobile
- Mobile users authenticate via Firebase Auth (phone OTP)
- The backend verifies Firebase ID tokens on every request
- Admin dashboard uses a separate JWT-based session (simpler than Firebase for
  internal server-to-server use)

## Database Schema Relationships

```
users (1) ──────────── (1) club_cards
  │                          │
  │                          └──── (many) points_ledger
  │
  ├── (many) coupon_redemptions ──── (1) coupons ──── (1) coupon_batches
  │
  ├── (many) gift_vouchers (issued_to)
  │
  └── (many) analytics_events

stores (28 rows, seeded)
promotions (created by admin)
notifications (created by admin)
loyalty_config (single row, admin-editable)
```

## Security Model

| Layer | Mechanism |
|---|---|
| Mobile → API | Firebase ID token (verified via firebase-admin SDK) |
| Admin → API | JWT signed with JWT_SECRET |
| Rate limiting | express-rate-limit (10 req/15min for auth, 100 for others) |
| Headers | Helmet (X-Frame-Options, HSTS, etc.) |
| CORS | Allowlist in production, open in development |
| Secrets | .env file, never committed |

## Infrastructure (AWS, ap-southeast-1 — Singapore)

```
Route 53 (DNS)
    └── CloudFront (CDN + WAF)
            └── Application Load Balancer
                    └── ECS Fargate (backend containers)
                            ├── RDS PostgreSQL (Multi-AZ)
                            ├── ElastiCache Redis
                            └── S3 (promotion images, assets)
```

## Analytics Architecture

Two-channel approach:
1. **Firebase Analytics** — client-side events (screen views, button taps, app opens)
2. **analytics_events table** — server-side events (OTP sent, coupon redeemed, card scanned)

Both feed into the admin dashboard analytics panel. Firebase data is read via the
Firebase Admin SDK / BigQuery export.

## Phase 2 Additions (not in scope now)

- ERP/POS integration (REST or file-based sync from BBSM's existing system)
- In-app product catalog + shopping cart
- Delivery management
- Digital payments (eSewa, Khalti, bank transfer)
- Real-time purchase → points pipeline
