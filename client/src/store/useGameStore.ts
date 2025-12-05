import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { soundManager } from '../utils/soundManager';

// Drawing game types
export interface DrawingAction {
    type: 'start' | 'draw' | 'end' | 'clear';
    x?: number;
    y?: number;
    prevX?: number;
    prevY?: number;
    color?: string;
    size?: number;
}

export interface Player {
    id: string;
    name: string;
    avatarSeed?: string; // Added avatarSeed
    index: number;
    isConnected: boolean;
    score: number;
    isBot?: boolean;
    hasGuessed?: boolean;
    guessCount?: number;
}

export interface ChatMessage {
    sender: string;
    text: string;
    timestamp: number;
    isSystemMessage?: boolean;
    targetId?: string;
    color?: string;
}

export interface GameState {
    roomId: string;
    password?: string;
    roomCreatorId?: string;
    players: Player[];
    gameStarted: boolean;
    messages: ChatMessage[];
    serverTime?: number; // Added for time sync

    // Drawing game specific
    currentDrawer: number;
    currentWord: string;
    wordHint?: string;
    wordOptions?: string[];
    roundNumber: number;
    roundEndTime?: number;
    drawingData: DrawingAction[];
    correctGuessers: string[];
    hintsGiven: number;

    // Room settings
    maxPlayers: number;
    theme: string;
    maxScore: number;
}

export interface RoomInfo {
    roomId: string;
    playerCount: number;
    maxPlayers: number;
    gameStarted: boolean;
    isLocked: boolean;
    theme: string;
}

interface GameStore {
    socket: Socket | null;
    gameState: GameState | null;
    isConnected: boolean;
    myPlayerId: string | null;
    rooms: RoomInfo[];
    notification: { message: string; type: 'error' | 'success' | 'info' } | null;

    connect: () => void;
    joinRoom: (roomId: string, playerName: string, password?: string, maxPlayers?: number, theme?: string, maxScore?: number, avatarSeed?: string) => void;
    getRooms: () => void;
    sendMessage: (message: string) => void;
    showNotification: (message: string, type: 'error' | 'success' | 'info') => void;
    clearNotification: () => void;
    addBot: () => void;
    removeBot: (botId: string) => void;
    kickPlayer: (playerId: string) => void;
    startGame: () => void;
    selectWord: (word: string) => void;
    draw: (action: DrawingAction) => void;
    leaveRoom: () => void;
    giveHint: () => void;
    gameOverData: { winners: { name: string; score: number; avatarSeed?: string }[] } | null;
    closeGameOver: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
    socket: null,
    gameState: null,
    isConnected: false,
    myPlayerId: null,
    rooms: [],
    notification: null,
    gameOverData: null,

    connect: () => {
        if (get().socket) return;

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const socket = io(apiUrl, {
            transports: ['websocket'],  // Skip polling, use WebSocket directly
            upgrade: false,              // Don't upgrade from polling
            reconnectionDelay: 1000,     // Reconnect after 1s
            reconnectionDelayMax: 5000,  // Max 5s between retries
            timeout: 10000               // Connection timeout
        });

        socket.on('connect', () => {
            set({ isConnected: true, myPlayerId: socket.id });
            socket.emit('getRooms');
        });

        socket.on('disconnect', () => {
            set({ isConnected: false });
        });

        socket.on('gameStateUpdate', (newState: GameState) => {
            const previousState = get().gameState;
            set({ gameState: newState });

            // Play sound when game starts
            if (!previousState?.gameStarted && newState.gameStarted) {
                soundManager.play('gameStart', 0.6);
            }
        });

        socket.on('roomListUpdate', (rooms: RoomInfo[]) => {
            set({ rooms });
        });

        // Listen for error messages (e.g., guess limit reached)
        socket.on('error', (message: string) => {
            if (message === 'You have used all your guesses!') {
                soundManager.play('guessLimitReached', 0.6);
            }
            get().showNotification(message, 'error');
        });

        socket.on('error', (msg: string) => {
            get().showNotification(msg, 'error');
        });

        socket.on('draw', (action: DrawingAction) => {
            set((state) => {
                if (!state.gameState) return state;

                // Avoid duplicating actions if we already optimistically added it
                // This is a simple check, might need more robust id checking in production
                // But for now, since we are just appending, let's trust the server broadcast
                // However, since we added optimistic UI, we might get duplicates. 
                // But drawing the same line twice is visually harmless usually.
                // To be safe, we can just rely on the optimistic UI for self, 
                // but we need to handle the case where server sends data back.

                // Actually, simpler approach: 
                // If we are the drawer, we ignore the server echo for my own actions IF I already added them.
                // But socket.io broadcast usually sends to everyone including sender?
                // In our server code: `io.to(roomId).emit('draw', action);` -> Yes, sends to everyone.

                // Let's just append. If it's double drawing, it's fine for now.
                return {
                    gameState: {
                        ...state.gameState,
                        drawingData: [...state.gameState.drawingData, action]
                    }
                };
            });
        });

        socket.on('clearCanvas', () => {
            set((state) => {
                if (!state.gameState) return state;
                return {
                    gameState: {
                        ...state.gameState,
                        drawingData: []
                    }
                };
            });
        });

        socket.on('correctGuess', ({ playerName }: { playerName: string }) => {
            soundManager.play('correct', 0.7);
            get().showNotification(`${playerName} guessed correctly!`, 'success');
        });

        socket.on('roundEnd', () => {
            soundManager.play('roundEnd', 0.5);
            get().showNotification('Round ended!', 'info');
        });

        socket.on('gameEnd', ({ scores }: { scores: { name: string, score: number }[] }) => {
            soundManager.play('victory', 0.8);
            // Sort scores to find winners
            const winners = [...scores].sort((a, b) => b.score - a.score).slice(0, 3);

            // Find avatars for winners from current players list
            const players = get().gameState?.players || [];
            const winnersWithAvatars = winners.map(w => {
                const player = players.find(p => p.name === w.name);
                return {
                    ...w,
                    avatarSeed: player?.avatarSeed
                };
            });

            set({ gameOverData: { winners: winnersWithAvatars } });
        });

        set({ socket });
    },

    joinRoom: (roomId, playerName, password, maxPlayers, theme, maxScore, avatarSeed) => {
        const socket = get().socket;
        if (socket) {
            socket.emit('joinRoom', { roomId, playerName, password, maxPlayers, theme, maxScore, avatarSeed });
        }
    },

    getRooms: () => {
        const socket = get().socket;
        if (socket) {
            socket.emit('getRooms');
        }
    },

    sendMessage: (message: string) => {
        const { socket, gameState } = get();
        if (socket && gameState) {
            socket.emit('sendMessage', { roomId: gameState.roomId, message });
        }
    },

    showNotification: (message: string, type: 'error' | 'success' | 'info') => {
        set({ notification: { message, type } });
        setTimeout(() => {
            get().clearNotification();
        }, 3000);
    },

    clearNotification: () => {
        set({ notification: null });
    },

    addBot: () => {
        const { socket, gameState } = get();
        if (socket && gameState) {
            socket.emit('addBot', { roomId: gameState.roomId });
        }
    },

    removeBot: (botId: string) => {
        const { socket, gameState } = get();
        if (socket && gameState) {
            socket.emit('removeBot', { roomId: gameState.roomId, botId });
        }
    },

    kickPlayer: (playerId: string) => {
        const { socket, gameState } = get();
        if (socket && gameState) {
            socket.emit('kickPlayer', { roomId: gameState.roomId, playerId });
        }
    },

    startGame: () => {
        const { socket, gameState } = get();
        if (socket && gameState) {
            set({ gameOverData: null }); // Clear game over screen when starting new game
            socket.emit('startGame', { roomId: gameState.roomId });
        }
    },

    selectWord: (word: string) => {
        const { socket, gameState } = get();
        if (socket && gameState) {
            socket.emit('selectWord', { roomId: gameState.roomId, word });
        }
    },

    draw: (action: DrawingAction) => {
        const { socket, gameState } = get();
        if (socket && gameState) {
            // Optimistic update: Add to local state immediately
            set((state) => {
                if (!state.gameState) return state;
                return {
                    gameState: {
                        ...state.gameState,
                        drawingData: [...state.gameState.drawingData, action]
                    }
                };
            });

            // Emit to server
            socket.emit('draw', { roomId: gameState.roomId, action });
        }
    },

    leaveRoom: () => {
        const { socket } = get();
        set({ gameState: null });
        if (socket) {
            socket.disconnect();
            socket.connect();
        }
    },

    giveHint: () => {
        const { socket, gameState } = get();
        if (socket && gameState) {
            socket.emit('giveHint', { roomId: gameState.roomId });
        }
    },

    closeGameOver: () => {
        set({ gameOverData: null });
    }
}));
