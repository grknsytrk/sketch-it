# 🎨 Gartic.io Style Drawing Game

Real-time multiplayer drawing and guessing game built with modern web technologies.

https://sketch-it-5zo0.onrender.com

## 🎮 Features

- **Real-time Drawing**: Players take turns drawing while others guess
- **Word Selection**: Drawer chooses from 3 random words
- **Smart Scoring**: Points based on guess speed and accuracy
- **Chat System**: In-game chat for guessing and communication
- **Room System**: Create private or public rooms
- **Bot Support**: Add AI players for testing
- **Customizable Settings**: Adjust max players, score target, and themes

## 🛠️ Tech Stack

### Backend
- Node.js + Express + TypeScript
- Socket.IO (WebSocket for real-time communication)
- Custom game logic and state management

### Frontend
- React 19 + TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- Zustand (State management)
- Framer Motion (Animations)
- Socket.IO Client

## 🚀 Local Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### 1. Install Dependencies

#### Server
```bash
cd server
npm install
```

#### Client
```bash
cd client
npm install
```

### 2. Start Development Servers

#### Terminal 1 - Server
```bash
cd server
npm run dev
```
Server runs on `http://localhost:3001`

#### Terminal 2 - Client
```bash
cd client
npm run dev
```
Client runs on `http://localhost:5173`

### 3. Play the Game

1. Open `http://localhost:5173` in multiple browser tabs/windows
2. Create or join the same room
3. Wait for at least 2 players
4. Click "START GAME" or type `/start` in chat
5. Take turns drawing and guessing!

## 📦 Production Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions on deploying to Render.com (free hosting).

### Quick Deploy to Render.com

1. Push code to GitHub
2. Connect your repository to Render
3. Deploy backend as Web Service
4. Deploy frontend as Static Site
5. Configure environment variables

Full step-by-step guide available in DEPLOYMENT_GUIDE.md

## 🎯 Game Rules

1. **Drawing Phase**: Current drawer selects a word and has 80 seconds to draw
2. **Guessing Phase**: Other players guess the word via chat
3. **Scoring**:
   - Guessers: 10 points (1st), decreasing for later guesses
   - Time penalty: -1 to -3 points for slow guesses
   - Drawer: Points based on % of players who guessed correctly
4. **Win Condition**: First player to reach target score (default: 120)

## 📝 Commands

- `/start` - Start the game (host only, min 2 players)

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=3001
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

For production, update `VITE_API_URL` to your deployed backend URL.

## 📄 License

MIT License - Feel free to use this project for learning and fun!

## 🤝 Contributing

Contributions are welcome! This is a learning project, so feel free to experiment and improve.

## 🎨 Screenshots

_Coming soon..._

---

**Enjoy the game!** 🎉
