# BBSM Backend API

Node.js + Express REST API serving the BBSM customer mobile app and admin dashboard.

## Tech Stack

| | |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| Auth | Firebase Auth + SMS OTP (Sparrow SMS) |
| Logging | Winston + Daily Rotate File |
| File Storage | AWS S3 (ap-southeast-1) |

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15 running locally (or connection string to a remote instance)
- Redis 7 running locally

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your local database credentials and other values
```

Minimum required values for local development:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bbsm_db
DB_USER=bbsm_user
DB_PASSWORD=your_password
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=any_long_random_string_for_dev
```

### 3. Create the PostgreSQL database

```sql
-- Run in psql as a superuser
CREATE DATABASE bbsm_db;
CREATE USER bbsm_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE bbsm_db TO bbsm_user;
```

### 4. Run migrations and seed data

```bash
# Apply the schema (001_initial_schema.sql)
npm run migrate

# Seed all 28 stores and default loyalty config
npm run seed

# Or do both at once
npm run setup
```

### 5. Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:4000`.

## Health Checks

| Endpoint | Purpose |
|---|---|
| `GET /health` | Liveness — is Express up? |
| `GET /health/ready` | Readiness — PostgreSQL + Redis reachable? |

## API Conventions

All endpoints share a common response envelope:

**Success**
```json
{
  "success": true,
  "data": { ... },
  "message": "Description of result"
}
```

**Error**
```json
{
  "success": false,
  "data": null,
  "message": "Human-readable error description",
  "code": "ERROR_CODE"
}
```

All timestamps are stored and returned in **UTC ISO 8601** format.

## API Routes (Phase 1 Plan)

All routes are versioned under `/api/v1`.

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/auth/send-otp` | Send OTP to phone number |
| `POST` | `/api/v1/auth/verify-otp` | Verify OTP, return token |
| `GET` | `/api/v1/users/me` | Get current user profile |
| `PATCH` | `/api/v1/users/me` | Update current user profile |
| `GET` | `/api/v1/club-cards/me` | Get user's Club Card + points |
| `GET` | `/api/v1/club-cards/me/history` | Points earn/burn history |
| `GET` | `/api/v1/stores` | List all 28 stores |
| `GET` | `/api/v1/stores/:id` | Get single store |
| `GET` | `/api/v1/promotions` | List active promotions |
| `GET` | `/api/v1/coupons` | List user's available coupons |
| `POST` | `/api/v1/coupons/:code/redeem` | Redeem a coupon |
| `GET` | `/api/v1/admin/customers` | List all customers |
| `PATCH` | `/api/v1/admin/customers/:id/points` | Manually adjust points |
| `POST` | `/api/v1/admin/notifications` | Send push notification |
| `GET` | `/api/v1/admin/analytics` | Dashboard analytics |

> Routes marked `admin` require the `x-admin-token` header and an active admin session.

## Database

Schema is managed via plain SQL files in `src/db/migrations/`.

```
src/db/
├── migrations/
│   └── 001_initial_schema.sql    ← Full Phase 1 schema (11 tables)
├── seeds/
│   ├── 001_stores.sql            ← 28 BBSM store locations with GPS coords
│   └── 002_loyalty_config.sql    ← Default loyalty tier config
└── migrate.js                    ← CLI runner
```

### Migration commands

```bash
npm run migrate          # Apply pending migrations
npm run migrate:rollback # Drop all tables (DEV ONLY)
npm run seed             # Run seed files (idempotent)
npm run setup            # migrate + seed
```

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable | Description |
|---|---|
| `DB_HOST/PORT/NAME/USER/PASSWORD` | PostgreSQL connection |
| `REDIS_HOST/PORT` | Redis connection |
| `JWT_SECRET` | Secret for admin JWT signing |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Path to Firebase service account JSON |
| `SMS_GATEWAY_TOKEN` | Sparrow SMS / equivalent gateway token |
| `AWS_*` | S3 credentials for image uploads |

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── env.js          ← Env var validation + typed exports
│   │   ├── database.js     ← pg Pool setup + connect/disconnect
│   │   └── redis.js        ← ioredis client + connect/disconnect
│   ├── middleware/
│   │   ├── errorHandler.js ← Global error handler + createError()
│   │   ├── requestLogger.js← Morgan → Winston HTTP logging
│   │   └── rateLimiter.js  ← Per-route rate limit configs
│   ├── routes/
│   │   └── health.js       ← /health and /health/ready
│   ├── utils/
│   │   ├── logger.js       ← Winston logger (file + console)
│   │   └── response.js     ← sendSuccess / sendError / errors.*
│   ├── db/
│   │   ├── migrations/     ← SQL migration files
│   │   ├── seeds/          ← SQL seed files
│   │   └── migrate.js      ← Migration CLI runner
│   └── app.js              ← Express app factory
├── server.js               ← Entry point (boot + shutdown)
├── package.json
├── .env.example
└── .gitignore
```

## Logging

Logs are written to:

- **Console** — colorized in dev, JSON in prod
- **`logs/combined-YYYY-MM-DD.log`** — all levels, 14-day retention
- **`logs/error-YYYY-MM-DD.log`** — errors only, 30-day retention

The `logs/` directory is git-ignored.

## Security Notes

- All secrets are in `.env` — never commit this file
- `firebase-service-account.json` is git-ignored
- Rate limiting is applied globally (100 req/15min) and strictly on auth endpoints (10 req/15min)
- Helmet is applied for security headers
- CORS is restricted to listed origins in production
- SSL is enforced on PostgreSQL connections in production
