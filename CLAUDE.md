# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hoyoverse Check-in is a Chrome extension (Manifest V3) for automatic daily check-in and resource tracking for Hoyoverse games (Genshin Impact, Honkai: Star Rail, Honkai Impact 3rd, Zenless Zone Zero).

## Development Commands

```bash
npm run dev          # Start development mode with hot reload
npm run build        # Production build (outputs to dist/, copies _locales)
npm run type-check   # TypeScript type checking
npm run lint         # ESLint
npm run format       # Prettier formatting
npm run test         # Jest tests
```

After `npm run dev`, load the `dist` directory as an unpacked extension in `chrome://extensions` with Developer Mode enabled.

## Architecture

### Clean Architecture Pattern

The background service worker follows Clean Architecture with dependency injection (tsyringe):

```
src/apps/background/
├── domain/{feature}/
│   ├── port/          # Input/Output interfaces for use cases
│   └── usecase/       # Use case interfaces (business logic contracts)
├── service/{feature}/ # Service implementations of use cases
├── controller/        # Controllers that orchestrate use cases
└── dependency.ts      # DI container registration
```

**Pattern**: Controllers → Usecases (interfaces) → Services (implementations via DI)

### Path Aliases

Defined in both `tsconfig.json` and `vite.config.ts`:
- `@apps/*` → `src/apps/*`
- `@background/*` → `src/apps/background/*`
- `@front/*` → `src/apps/front/*`
- `@src/*` → `src/*`
- `@assets/*` → `src/assets/*`

### Entry Points

- **Background Service Worker**: `src/apps/background/index.ts` - Initializes controllers for check-in, messaging, badge updates, and data scraping
- **Popup**: `src/apps/front/popup/` - Main extension popup UI
- **Options**: `src/apps/front/options/` - Settings page
- **Content Scripts**: `src/apps/front/content/` - Tooltip (for check-in pages) and wakeup scripts

### Communication

Frontend communicates with background via `chrome.runtime.onMessage`. Message types are defined in `src/types/index.ts` (`MessageType` enum). The `MessengerController` handles all message routing.

### Shared Code

- `src/shared/api/` - Hoyolab API wrappers
- `src/shared/constants/` - Game configs, API codes, storage keys, URLs
- `src/shared/i18n/` - Internationalization setup (i18next)
- `src/shared/utils/` - Utility functions

### Localization

- Extension manifest locales: `_locales/{en,ja,ko,zh_TW}/messages.json`
- App translations: `src/shared/i18n/translations.ts`

## Tech Stack

- React 18 + TypeScript + Vite
- @crxjs/vite-plugin for Chrome extension bundling
- Tailwind CSS + Radix UI components (in `src/apps/front/external/components/ui/`)
- tsyringe for dependency injection
- i18next for internationalization
- Zustand for state management (stores in `src/apps/background/store/`)
