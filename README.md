# Nuro

A calm, practical life-skills app for autistic young adults. Nuro breaks down everyday real-world tasks — making appointments, managing money, doing laundry, grocery shopping, making phone calls — into clear, step-by-step instructions. Every lesson includes written steps, an interactive checklist, and (where relevant) a word-for-word script you can copy or read from.

The design is respectful and direct: no confetti, no childish praise, no overwhelming noise. Plain language, at your own pace.

---

## How to run on the web

This is now the easiest way to let someone use Nuro without installing Expo Go.

### Browser preview for development

```bash
npm install
npm run web
```

That opens the app in a browser using Expo's web support.

### Static HTML build for deployment

```bash
npm install
npm run build:web
```

This writes a deployable web build to:

```text
dist/
```

You can preview that exported site locally with:

```bash
npm run serve:dist
```

Then open:

```text
http://localhost:4173
```

### GitHub Pages deployment flow

This repo is now set up for a clean split:

- `source` = app source code
- `main` = compiled static web build only

On every push to `source`, GitHub Actions will:

1. run `npm ci`
2. run `npm run build:web`
3. force-push the exported `dist/` output to `main`

Workflow file:

```text
.github/workflows/deploy-pages.yml
```

### One-time GitHub Pages setting

In the GitHub repo settings:

- go to **Settings → Pages**
- set **Build and deployment** to **Deploy from a branch**
- choose branch **main** and folder **/(root)**

After that, each push to `source` should update the live site automatically once the workflow finishes.

### Why this setup

- keeps source history clean
- keeps the deploy branch disposable
- avoids mixing app code with built output
- fits GitHub Pages well for a static Expo web export

## How to run on a phone (Expo Go)

This is the recommended way to test the app without building a native binary.

### Prerequisites

- **Node.js 18 or newer** — check with `node --version`
- **npm** — bundled with Node.js
- **Expo Go app** installed on your Android or iOS device
  - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
- Your phone and development machine must be on the **same Wi-Fi network**

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm start
```

A QR code will appear in the terminal. Scan it:
- **Android**: open the Expo Go app → tap "Scan QR code"
- **iOS**: open the Camera app and point it at the QR code

The app will load on your device. Changes to source files hot-reload automatically.

### If the QR code doesn't connect

Try running with the tunnel option, which works across different networks:

```bash
npx expo start --tunnel
```

This requires `@expo/ngrok` — if prompted, install it: `npm install -g @expo/ngrok`

### Running on a simulator

```bash
npm run ios       # macOS only, requires Xcode
npm run android   # requires Android Studio + running emulator
npm run web       # browser preview — limited functionality
```

---

## How local persistence works

All user data is stored on the device using `AsyncStorage` — a simple key-value store included with React Native. There is no server, no login, and no cloud sync. Data persists across app restarts and is never sent anywhere.

### Storage keys

All keys are namespaced to avoid conflicts with other apps:

| Key | What it stores |
|-----|----------------|
| `@adulting_coach:onboarding_complete` | Whether the user has completed onboarding (`"true"` or null) |
| `@adulting_coach:focus_areas` | JSON array of selected category IDs |
| `@adulting_coach:progress` | JSON object: completed lesson IDs, streak count, last active date, focus areas |
| `@adulting_coach:saved_tools` | JSON array of saved checklists and scripts |
| `@adulting_coach:reminders` | JSON array of reminder objects |

### Data flow

Each persistent entity has its own hook:

- `useOnboarding` — onboarding state and focus area selection
- `useProgress` — lesson completion and streak
- `useSaved` — saved checklists and scripts
- `useReminders` — reminder list

Hooks load from `AsyncStorage` on mount and refresh when screens come back into focus (via React Navigation's `focus` listener). All storage functions are in `src/lib/storage.ts`.

### First-run behaviour

On first launch, all storage keys are empty. The app shows the Welcome screen. After the user picks focus areas and taps Continue, onboarding is marked complete and the app navigates to the main tabs. On all subsequent launches, it goes directly to the Home tab.

---

## What is stored locally

- **Completed lessons** — which lesson IDs the user has marked complete
- **Focus areas** — the category or categories the user selected during onboarding
- **Streak** — number of consecutive active days (a day counts when you complete a lesson)
- **Saved checklists** — checklists the user tapped "Save checklist" on
- **Saved scripts** — scripts the user tapped "Save this script" on
- **Reminders** — reminder labels and repeat rules the user created

Nothing else is stored. The app collects no analytics, no usage data, and no personal information beyond what the user explicitly enters.

---

## What is not yet implemented

| Feature | Status | Notes |
|---------|--------|-------|
| Push notifications | Not implemented | Reminders are saved as local data objects. `expo-notifications` would need to be added to schedule actual device alerts. |
| Date/time picker for reminders | Not implemented | Reminders currently save with the current timestamp. A proper date picker (`@react-native-community/datetimepicker`) is needed for scheduling future reminders. |
| Note creation | Not implemented | The Notes tab in Saved shows any programmatically-saved notes, but there is no in-app flow to write a new note yet. |
| App icon and splash image | Placeholder | `assets/` contains placeholder 1×1 PNGs. Real artwork is needed before a production build. |
| Lesson content from CMS | Not implemented | All 8 lessons are hardcoded in `src/sample-data/lessons.ts`. |
| Account / cloud sync | Not planned for MVP | All data is local. |

---

## Project structure

```
adulting-coach-app/
├── App.tsx                  # Root: navigation setup and onboarding gate
├── app.json                 # Expo config (name, orientation, splash background)
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config (strict mode)
├── babel.config.js          # Babel config for Expo
├── assets/                  # App icon and splash (currently placeholders)
└── src/
    ├── types/
    │   └── index.ts         # All shared TypeScript types + navigation param list
    ├── sample-data/
    │   ├── categories.ts    # 4 category definitions (title, color, icon, description)
    │   └── lessons.ts       # 8 full lessons with steps, checklists, and scripts
    ├── lib/
    │   ├── theme.ts         # Design tokens: colors, spacing, radius, typography, shadows
    │   ├── storage.ts       # AsyncStorage wrappers — all read/write logic lives here
    │   └── progress.ts      # Pure helper functions for progress calculations
    ├── hooks/
    │   ├── useOnboarding.ts # Onboarding state and focus area selection
    │   ├── useProgress.ts   # Lesson completion and streak
    │   ├── useSaved.ts      # Saved checklists and scripts
    │   └── useReminders.ts  # Reminder list (add, remove, toggle complete)
    ├── components/
    │   ├── CategoryBadge.tsx   # Colored pill badge showing a category name
    │   ├── ChecklistItem.tsx   # Interactive checkbox row with optional detail text
    │   ├── LessonCard.tsx      # Card: lesson title, summary, category, time, completion
    │   ├── ProgressBar.tsx     # Horizontal progress bar with "X of Y done" label
    │   └── ScriptBlock.tsx     # Card layout for script context and lines (display-only)
    └── screens/
        ├── WelcomeScreen.tsx        # Intro — app name, tagline, get started
        ├── FocusAreaScreen.tsx      # Onboarding — pick focus areas
        ├── HomeScreen.tsx           # Home tab — topics, next lesson, live reminders
        ├── LessonListScreen.tsx     # Lessons in a category with completion badges
        ├── LessonDetailScreen.tsx   # Lesson: Overview / Checklist / Scripts tabs
        ├── ChecklistScreen.tsx      # Interactive checklist with progress bar
        ├── ScriptScreen.tsx         # Full script view — per-line copy, save script
        ├── ReminderSetupScreen.tsx  # Create reminders; view and manage all reminders
        ├── ProgressScreen.tsx       # Stats, per-category bars, completed lesson list
        └── SavedToolsScreen.tsx     # Saved checklists, scripts, notes — tabbed
```

---

## How to test on a phone

### First-run test

1. Delete the app from your device (or clear app data on Android) to start fresh
2. Run `npm start`, scan the QR code
3. Confirm: Welcome screen appears → tap Get started → Focus Areas screen → pick at least one area → tap Continue → Home tab
4. Confirm: restarting the app (close and reopen from device) skips onboarding and lands on Home

### Persistence test

1. Open a lesson → tap "Mark as complete"
2. Close the app fully (swipe away from the app switcher)
3. Reopen the app
4. Confirm: the lesson still shows as complete on the lesson list and on the Progress tab

### Saved tools test

1. Open a lesson → tap "Save checklist" → confirm the "Checklist saved" alert
2. Switch to the Saved tab → confirm the checklist appears under Checklists
3. Close and reopen the app
4. Confirm: the checklist is still there

### Reminders test

1. Open any lesson → tap "Set reminder" → enter a label → tap "Save reminder"
2. Go back to the Home tab
3. Confirm: the reminder appears under the Reminders section
4. Tap "Done" on the reminder
5. Confirm: it disappears from the Home tab (but is still visible in ReminderSetup)
6. Close and reopen the app
7. Confirm: completed reminders stay completed; the Home tab stays empty

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | ~51.0.0 | Managed workflow runtime |
| `react` | 18.2.0 | UI framework |
| `react-native` | 0.74.5 | Mobile primitives |
| `@react-navigation/native` | ^6.1.17 | Navigation container |
| `@react-navigation/native-stack` | ^6.9.26 | Stack navigator |
| `@react-navigation/bottom-tabs` | ^6.5.20 | Tab bar |
| `react-native-screens` | ~3.31.1 | Native screen optimisation |
| `react-native-safe-area-context` | 4.10.5 | Safe area insets |
| `@react-native-async-storage/async-storage` | 1.23.1 | Local persistence |
| `expo-status-bar` | ~1.12.1 | Status bar control |
| `expo-clipboard` | ~6.0.3 | Copy-to-clipboard on script lines |

---

## Best next step after real-user feedback

Based on the architecture and what's missing, here is the recommended order after you have feedback from a first tester:

### 1. Push notifications for reminders

Add `expo-notifications` to turn the current reminder data objects into real device alerts.

```bash
npx expo install expo-notifications
```

Key tasks:
- Request notification permissions on first reminder creation (fail gracefully if denied)
- Schedule a `Notifications.scheduleNotificationAsync` call when a reminder is saved
- Cancel the notification when a reminder is removed or marked done
- Handle repeat rules (`daily`, `weekly`, `monthly`) using trigger options

This is the highest-value missing feature. Reminders without notifications have limited use.

### 2. Date/time picker

Replace the current "save with current timestamp" approach with a real date and time selector:

```bash
npx expo install @react-native-community/datetimepicker
```

Wire it into `ReminderSetupScreen` so users can pick a specific future date and time.

### 3. Note creation

Add a simple `NoteEditorScreen` with a title field and multiline body. Save the result as a `SavedTool` with `type: 'note'`. This fills the empty Notes tab and gives users a freeform writing space.

### 4. More lessons

The 8 current lessons are a solid foundation. The most common next additions based on the target use case:
- How to do laundry (already there)
- How to read a pay stub
- How to call in sick to work
- How to set up and use a basic budget

### 5. Accessibility audit

Test with VoiceOver (iOS) and TalkBack (Android). Add `accessibilityHint` props to interactive elements that need more context. The target audience makes this a priority, not an afterthought.
