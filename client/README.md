# Sketch It - Client

The frontend application for a real-time multiplayer drawing and guessing game, similar to Gartic or Skribbl. Players take turns drawing while others try to guess the word. It's fast, fun, and works great with friends.

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8) ![Vite](https://img.shields.io/badge/Vite-7-646cff)

## Features

- **Real-time Drawing Canvas** - Smooth brush strokes with customizable colors and sizes
- **Word Selection** - Drawer picks from 3 random words at the start of each round
- **Live Chat** - Dual-tab system with separate Answer and Chat sections to keep things organized
- **Smart Scoring** - Points calculated based on guess speed, so faster guesses earn more
- **Room System** - Create private rooms with custom settings or join public ones
- **Sound Effects** - Audio feedback for correct guesses, round changes, and game events
- **Theme Selection** - Choose word categories like Animals, Food, Sports, and more
- **Kick System** - Room hosts can remove disruptive players mid-game
- **Mobile Friendly** - Responsive design that works on phones and tablets
- **Animations** - Smooth transitions powered by Framer Motion

## Getting Started

### Prerequisites

You'll need Node.js version 18 or higher installed on your machine. Make sure the backend server is also running before starting the client.

### Installation

Navigate to the client folder:

```bash
cd client
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file for your environment variables:

```env
VITE_API_URL=http://localhost:3001
```

Start the development server:

```bash
npm run dev
```

Open your browser and go to `http://localhost:5173`. You should see the game running.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool and Dev Server |
| TailwindCSS 4 | Styling |
| Framer Motion | Animations |
| Socket.IO Client | Real-time Communication |
| Zustand | State Management |

## Project Structure

```
src/
├── components/
│   ├── Chat.tsx              # Chat component with Answer/Chat tabs
│   ├── DrawingCanvas.tsx     # Main canvas for drawing
│   ├── GameOver.tsx          # End-of-game scoreboard
│   ├── GameView.tsx          # Main game layout and controls
│   ├── Icons.tsx             # Custom SVG icons
│   ├── Notification.tsx      # Toast notifications
│   ├── Scoreboard.tsx        # Live player scores
│   ├── SettingsMenu.tsx      # Room settings modal
│   └── WordSelection.tsx     # Word picker for drawers
├── store/
│   └── gameStore.ts          # Zustand store for game state
├── utils/
│   └── soundManager.ts       # Sound effects handler
├── App.tsx                   # Main application component
├── main.tsx                  # Entry point
└── index.css                 # Global styles and CSS variables
```

## How to Play

1. Enter your name and create a room or join an existing one
2. Wait for at least 2 players to join
3. The host starts the game with the "Start Game" button or by typing `/start`
4. When it's your turn to draw, pick a word from the three options
5. Draw the word while others guess in the Answer tab
6. First player to reach the target score wins

## Scoring System

The scoring is designed to reward quick and accurate guesses:

| Event | Points |
|-------|--------|
| First correct guess | 10 points |
| Later guesses | Decreasing points based on order |
| Time penalty | -1 to -3 points for slow guesses |
| Drawer bonus | Based on percentage of players who guessed correctly |

The default target score is 120 points, but hosts can change this in settings.

## Drawing Tools

The canvas supports several tools:

- **Brush** - Standard drawing tool with adjustable size
- **Eraser** - Remove strokes with a custom cursor
- **Color Palette** - Quick access to common colors plus a full color picker
- **Clear Canvas** - Wipe everything and start fresh
- **Undo** - Remove the last stroke

## Scripts

```bash
npm run dev      # Start the development server
npm run build    # Build for production
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint to check for issues
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend server URL | http://localhost:3001 |

For production, update `VITE_API_URL` to point to your deployed backend.

## Notes

This is the client-side portion of the application. You'll need to run the server separately for the game to work. Check the main project README for full setup instructions.

If you run into any issues with WebSocket connections, make sure your backend is running and the `VITE_API_URL` is pointing to the correct address.
