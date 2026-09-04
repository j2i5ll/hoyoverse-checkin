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

### Content Script UI Styling Guidelines (CRITICAL: `rem` vs `px`)

The content script UI (`src/apps/front/content/tooltip/`) is injected directly into official HoYoverse check-in web pages (`act.hoyolab.com`).

**Host Page Context & Root Cause of Broken Layouts:**
- HoYoverse/HoYoLAB check-in pages dynamically inject a massive `font-size` on the host document's `<html>` element (often `50px ~ 100px`) via responsive mobile scaling scripts.
- **CSS Specification Rule**: Even when injected inside a **Shadow DOM**, `rem` units in CSS **always resolve against the host document's `<html>` element**, NOT the shadow root.
- Consequently, using Tailwind's default `rem`-based classes (e.g. `text-xs`, `text-sm`, `h-8`, `p-4`, `rounded-xl`, `space-y-*`, or default shadcn/Radix components like `Button`, `CardContent`, `CardFooter`) will blow up dimensions by 3x–6x:
  - Paddings like `p-4` (1rem) or `p-6` (1.5rem) expand to 100px–150px, crushing the card width and forcing text into single-character vertical columns.
  - Sizing like `h-8` (2rem) turns into 150px–200px giant buttons.

**Rules for Content Script Development:**
1. **Always use explicit pixel units (`px`)**:
   - Never use bare Tailwind rem-based utilities (`text-xs`, `text-sm`, `h-8`, `w-8`, `p-4`, `px-3`, `gap-2`, `rounded-md`, etc.).
   - Always use explicit bracket notation: `text-[12px]`, `leading-[16px]`, `h-[32px]`, `w-[380px]`, `p-[16px]`, `px-[12px]`, `gap-[8px]`, `rounded-[8px]`.
2. **Avoid standard shadcn/Radix components with built-in `rem` defaults**:
   - `Button` in `@front/external/components/ui/button` injects `h-9 px-4 py-2 text-sm [&_svg]:size-4` (all `rem`). Use native `<button>` with explicit pixel classes or override every dimensional class.
   - `Card`, `CardContent`, `CardFooter` inject `rounded-xl`, `p-6 pt-0`. Use plain `<div>` elements with explicit pixel paddings and radii.
3. **Explicitly size all icons (Lucide SVG)**:
   - Always supply explicit `size={...}` props (e.g. `size={14}`) and class names (`className="w-[14px] h-[14px] shrink-0"`).
4. **Maintain CSS isolation resets in `root.tsx`**:
   - Shadow Root `<style>` must include `:host, #shadow-root` resets (`font-size: 14px !important; line-height: 1.5 !important; writing-mode: horizontal-tb !important;`) to prevent host page typography/direction leakage.

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
