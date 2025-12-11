# Sketch It

A real-time multiplayer drawing and guessing game, heavily inspired by Gartic.io. One player draws a word while others race to guess it correctly. It's built to be fast, responsive, and easy to play with friends.

React TypeScript TailwindCSS Vite

## Features

- **Real-time Drawing** - Smooth, synchronized drawing experience that feels instant
- **Multiplayer Logic** - Handles turns, scoring, and game states seamlessly
- **Dual Chat System** - Separate tabs for guessing words and chatting with friends, so the chat doesn't get cluttered
- **Smart Scoring** - The faster you guess, the more points you get. Drawers also get points based on how many people guessed correctly
- **Room System** - Create your own private rooms with custom settings or join public ones
- **Kick System** - Hosts can remove disruptive players to keep the game fun
- **Mobile Friendly** - Layout adapts perfectly to phones and tablets
- **Animations** - Smooth UI transitions powered by Framer Motion

## Getting Started

### Prerequisites

You'll need Node.js version 18 or higher installed on your machine. You can use either npm or yarn as your package manager.

### Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/grknsytrk/sketch-it.git
cd sketch-it
```

Since this project has both a client and a server, you'll need to install dependencies for both.

**Server Setup:**
```bash
cd server
npm install
```

**Client Setup:**
```bash
cd ../client
npm install
```

### Running the App

You'll need two terminal windows open to run the game locally.

**1. Start the Server:**
Go to the `server` folder and run:
```bash
npm run dev
```

**2. Start the Client:**
Go to the `client` folder and run:
```bash
npm run dev
```

Open your browser and navigate to the URL shown in your terminal (usually `http://localhost:5173`).

**Note on Configuration:**
The project uses `.env` files for configuration. You can check `.env.example` to see what variables are available, but the defaults should work fine for local development.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool and Dev Server |
| **TailwindCSS 4** | Styling |
| **Socket.IO** | Real-time Communication |
| **Zustand** | State Management |
| **Express** | Backend Server |
| **Framer Motion** | Animations |

## Project Structure

```
sketch-it/
├── client/                   # Frontend Application
│   ├── src/
│   │   ├── components/       # Game components (Canvas, Chat, etc.)
│   │   ├── store/            # Game state (Zustand)
│   │   ├── utils/            # Helper functions
│   │   └── App.tsx           # Main component
├── server/                   # Backend Application
│   ├── src/
│   │   ├── index.ts          # Server entry point
│   │   ├── types.ts          # Shared types
│   │   └── words.ts          # Word lists
└── README.md
```

## How to Play

1. **Join a Room:** Enter your name and create a new room or join an existing one.
2. **Start Game:** Wait for friends to join (minimum 2 players) and hit Start.
3. **Draw & Guess:**
   - If it's your turn, pick a word and draw it.
   - If you're guessing, type the word in the Answer tab.
4. **Win:** The player with the most points at the end of the score limit wins!

## Contributing

Contributions are welcome. If you want to add a feature or fix a bug:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes and commit them (`git commit -m 'Add your feature'`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is open source under the MIT License. You can use it however you like.

## Acknowledgments

- Inspired by the classic Gartic.io
- Built for learning and having fun with WebSocket technology

If you have any questions or run into issues, feel free to open an issue on GitHub.
