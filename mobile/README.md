# Perplexity Comet

A mobile application built with React Native, Expo, and TypeScript. This app functions as a local Perplexity AI clone (UI prototype), featuring thread-based conversations and search-like interactions.

## Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **State Management**: Zustand
- **Styling**: NativeWind (Tailwind CSS)
- **Linting/Formatting**: ESLint, Prettier, Husky, Lint-staged
- **Environment**: react-native-dotenv

## Features

- **Home**: Search bar and suggested topics.
- **Thread View**: Simulated AI chat interface.
- **Library**: History of past searches/threads.
- **Theme**: Dark/Light mode support.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Setup Environment Variables:
   Create a `.env` file in the root directory (see `.env.example`).
   ```bash
   API_URL=https://api.example.com
   ```

## Scripts

- `npm start`: Start the Expo development server
- `npm run android`: Run on Android emulator/device
- `npm run ios`: Run on iOS simulator/device
- `npm run web`: Run on web
- `npm run lint`: Run ESLint
- `npm run format`: Run Prettier

## Architecture

- `src/navigation`: Navigation configuration
- `src/screens`: Screen components
  - `HomeScreen`: Search entry point.
  - `ThreadScreen`: Chat interface.
  - `HistoryScreen`: List of past threads.
- `src/store`: Global state (Zustand) for managing threads.
- `src/components`: Reusable components
- `src/utils`: Utilities (Logger, Analytics, etc.)
- `src/types`: TypeScript type definitions
