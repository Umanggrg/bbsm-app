# Bhat-Bhateni Super Market (BBSM) Official App — Monorepo

Nepal's largest retail supermarket chain digital platform. Phase 1 MVP.

## Overview

| Metric | Value |
|---|---|
| Stores | 28 across Nepal |
| Daily footfall | 100,000+ |
| Daily sales | NRs 5.5 Crore (~USD $550,000) |
| Target launch | Phase 1 MVP |

## Repository Structure

```
bbsm-app/
├── mobile/      # React Native + Expo — customer-facing iOS & Android app
├── admin/       # React.js + Tailwind CSS — internal marketing dashboard
├── backend/     # Node.js + Express — shared API for mobile and admin
├── shared/      # Shared TypeScript types, constants, and utilities
└── docs/        # Architecture diagrams, API docs, onboarding notes
```

## Systems

### Mobile App (`/mobile`)
Cross-platform iOS + Android app for BBSM shoppers. Covers digital Club Card,
loyalty points, promotions, coupons, store finder, and purchase history.
> Phase 1 does NOT include in-app shopping, delivery, or payments.

### Admin Dashboard (`/admin`)
Internal tool for the BBSM marketing team. Manages customers, loyalty config,
promotions, coupons, push notifications, store content, and app analytics.
> NOT an HR, inventory, or POS tool.

### Backend API (`/backend`)
Node.js + Express REST API serving both mobile and admin. Handles auth (OTP via
SMS), loyalty engine, promotions, FCM push notifications, and analytics ingestion.
> Phase 1 is intentionally decoupled from BBSM's ERP/POS systems.

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile App | React Native + Expo |
| Admin Dashboard | React.js + Tailwind CSS |
| Backend API | Node.js + Express |
| Database | PostgreSQL |
| Cache | Redis |
| Auth | Firebase Auth + SMS OTP |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| File Storage | AWS S3 |
| Cloud Hosting | AWS (ap-southeast-1, Singapore) |
| Analytics | Firebase Analytics |

## Brand

- **Primary:** BBSM Red `#C8102E`
- **Accent:** Gold `#D4A843`
- **Background:** Warm cream `#FFF8F0`
- **Fonts:** Sora (English) · Noto Sans Devanagari (Nepali)
- **Tone:** Trustworthy, warm, modern — Nepal-first

## Getting Started

Each sub-system has its own README with setup instructions:

- [Backend Setup](./backend/README.md)
- Admin Setup *(coming soon)*
- Mobile Setup *(coming soon)*

## Development Phases

| Phase | Scope |
|---|---|
| **Phase 1 (current)** | Auth, digital Club Card, loyalty points, promotions, coupons, store finder, push notifications, admin dashboard, analytics |
| Phase 2 | In-app shopping, delivery, payments, ERP/POS integration, product catalog |
