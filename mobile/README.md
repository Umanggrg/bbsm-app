# BBSM Mobile App

React Native + Expo customer app for Bhat-Bhateni Super Market.

## Screens

| Tab | Screen | Description |
|---|---|---|
| Home | `app/(tabs)/index.tsx` | Promotions carousel, store selector, quick actions |
| Offers | `app/(tabs)/offers.tsx` | Full promotions grid with category filters |
| Stores | `app/(tabs)/stores.tsx` | All 28 BBSM locations with search and province filter |
| Shopping | `app/(tabs)/shopping.tsx` | Coming Soon placeholder |
| — | `app/store/[id].tsx` | Store detail — directions, hours, set as My Store |
| — | `app/promotion/[id].tsx` | Promotion detail — full image and description |

## Quick Start

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Studio emulator
- Or the **Expo Go** app on a physical device

### 1. Install dependencies

```bash
cd mobile
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Local development (simulator — localhost works)
EXPO_PUBLIC_API_URL=http://localhost:4000

# Physical device — replace with your machine's local IP
# EXPO_PUBLIC_API_URL=http://192.168.1.100:4000
```

### 3. Add app assets

Place the following files in `assets/`:
- `icon.png` — 1024×1024 app icon
- `splash.png` — 1284×2778 splash screen image
- `adaptive-icon.png` — 1024×1024 Android adaptive icon foreground
- `favicon.png` — 32×32 web favicon

Until real assets are added, Expo will use default placeholders.

### 4. Start the development server

```bash
npm start        # starts Expo dev server
npm run ios      # opens iOS simulator
npm run android  # opens Android emulator
```

Scan the QR code with **Expo Go** to run on a physical device.

## Project Structure

```
mobile/
├── app/
│   ├── _layout.tsx          ← Root layout: fonts, splash, QueryClient
│   ├── (tabs)/
│   │   ├── _layout.tsx      ← Tab bar config (4 tabs)
│   │   ├── index.tsx        ← Home screen
│   │   ├── offers.tsx       ← Offers/promotions grid
│   │   ├── stores.tsx       ← Store finder
│   │   └── shopping.tsx     ← Coming Soon
│   ├── store/[id].tsx       ← Store detail
│   └── promotion/[id].tsx   ← Promotion detail
├── components/
│   ├── PromotionCard.tsx    ← Reusable promo card (featured + grid variants)
│   ├── StoreCard.tsx        ← Store card with directions + My Store
│   ├── StorePicker.tsx      ← Full-screen store selection modal
│   ├── EmptyState.tsx       ← Empty/error state placeholder
│   └── LoadingSpinner.tsx   ← Loading indicator
├── constants/
│   ├── Colors.ts            ← BBSM brand color tokens
│   └── Api.ts               ← API base URL + apiFetch helper
├── hooks/
│   ├── useStores.ts         ← React Query hooks for stores
│   └── usePromotions.ts     ← React Query hooks for promotions
├── store/
│   └── useAppStore.ts       ← Zustand store (selected store, persisted)
└── types/
    └── index.ts             ← Store, Promotion TypeScript interfaces
```

## Key Features

### Store Picker (First Launch)
On first open, a full-screen modal appears asking the user to choose their store.
Selection is saved to `AsyncStorage` via Zustand persist middleware —
no login required. User can change it any time from the Stores tab.

### Browse Without Login
All content (promotions, store details) is visible without an account.
Login will be added in a future phase for loyalty features.

### Directions
Tapping "Get Directions" on any store opens the native Maps app:
- iOS → Apple Maps
- Android → Google Maps

## Brand

| Token | Value |
|---|---|
| Primary | `#C8102E` (BBSM Red) |
| Accent | `#D4A843` (Gold) |
| Background | `#FFF8F0` (Warm cream) |
| Font | Sora (via Google Fonts) |

## Environment Variables

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | Backend API base URL (e.g. `http://localhost:4000`) |
