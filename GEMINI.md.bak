# GEMINI.md: Al-Quran Project

This document provides a comprehensive overview of the Al-Quran web application project, its architecture, and development conventions to serve as a guide for future interactions.

## Project Overview

The project is a web application for reading the Quran, built with a focus on providing a clean user interface and keyboard-based navigation between verses (ayahs). The motivation behind its creation was to add features that the developer found lacking in existing Quran websites.

### Core Technologies

- **Framework**: [Astro](https://astro.build/) (v5.14.1)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (using Astro's `strict` configuration)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4.1.14)
- **Deployment**: Server-Side Rendering (SSR) with a Node.js adapter, containerized with Docker.
- **Formatting**: [Prettier](https://prettier.io/)

### Architecture

- **Rendering**: The application uses Astro's server-side rendering (`output: "server"`) but pre-renders all Surah and index pages at build time (`prerender = true`) for optimal performance.
- **Data**: Quran text (`hafs.json`), translations, and page mappings are stored as local JSON files in the `src/data` directory.
- **Core Features**:
  - **Verse Navigation**: The primary feature, keyboard navigation with arrow keys (left/right) to move between verses, is implemented via a client-side script in `src/pages/[surah].astro`.
  - **Audio Recitation**: A full-featured audio player, managed by the `AudioPlayer` class in `src/utils/audioPlayer.ts`, allows users to listen to Surah recitations from `quranicaudio.com`. It includes controls for play/pause, seeking, volume, and looping.
  - **Theme**: A persistent dark/light mode theme toggle is implemented, storing the user's preference in `localStorage`.
- **Containerization**: A multi-stage `Dockerfile` is provided to build and run the application in a production environment, exposing port `4321`.

## Building and Running

Project dependencies and scripts are managed with `npm`.

- **Install Dependencies**:

  ```bash
  npm install
  ```

- **Run Development Server**:
  Starts a local development server with hot-reloading.

  ```bash
  npm run dev
  ```

- **Build for Production**:
  Compiles and builds the application for production.

  ```bash
  npm run build
  ```

- **Preview Production Build**:
  Starts a local server to preview the production build.

  ```bash
  npm run preview
  ```

- **Run with Docker**:
  Build and run the application using the provided Docker configuration.

  ```bash
  # Build the image
  docker build -t alquran .

  # Run the container
  docker run -p 4321:4321 alquran
  ```

## Development Conventions

- **Code Formatting**: All code should be formatted using Prettier. Run `npm run format` to format the entire codebase.
- **Type Checking**: The project uses a strict TypeScript configuration. Run `npm run check` to identify any type errors.
- **Component Structure**: Reusable UI elements are organized as Astro components within the `src/components` directory.
- **Styling**: All styling is done using Tailwind CSS utility classes. The configuration is located in `tailwind.config.mjs`, and global styles are in `src/styles/global.css`.
- **Client-Side Logic**: Simple client-side interactions are handled within `<script>` tags in `.astro` files. More complex logic, like the audio player, is encapsulated in TypeScript files within the `src/utils` directory.
