import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameState, JoinRoomPayload, SendMessagePayload, AddBotPayload, StartGamePayload, SelectWordPayload, DrawPayload, Player, ChatMessage } from './types';
import { getRandomWords, getWordHint } from './words';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const games = new Map<string, GameState>();

const createInitialGameState = (roomId: string, maxPlayers: number = 8, theme: string = 'general', maxScore: number = 120): GameState => {
    return {
        roomId,
        players: [],
        gameStarted: false,
        messages: [],
        currentDrawer: 0,
        currentWord: '',
        wordHint: '',
        roundNumber: 0,
        drawingData: [],
        correctGuessers: [],
        hintsGiven: 0,
        maxPlayers,
        theme,
        maxScore,
        selectionEndTime: undefined,
        roomCreatorId: undefined // Will be set when first player joins
    };
};

const getMaskedGameState = (game: GameState, playerId: string): GameState => {
    const player = game.players.find(p => p.id === playerId);
    const isDrawer = player && player.index === game.currentDrawer;

    if (!game.gameStarted || isDrawer || !game.currentWord) {
        return game;
    }

    return {
        ...game,
        currentWord: '', // Hide word
        wordHint: game.wordHint // Send hint instead
    };
};

const broadcastGameState = (roomId: string, game: GameState) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (room) {
        room.forEach((socketId) => {
            const socket = io.sockets.sockets.get(socketId);
            if (socket) {
                socket.emit('gameStateUpdate', getMaskedGameState(game, socketId));
            }
        });
    }
};

const broadcastRoomList = () => {
    const roomList: any[] = [];
    games.forEach((game, id) => {
        roomList.push({
            roomId: id,
            playerCount: game.players.filter(p => p.isConnected).length,
            maxPlayers: game.maxPlayers,
            maxScore: game.maxScore,
            gameStarted: game.gameStarted,
            isLocked: !!game.password
        });
    });
    io.emit('roomListUpdate', roomList);
};

const endRound = (game: GameState, roomId: string) => {
    // Check if we have enough players to continue
    if (game.players.length < 2) {
        game.gameStarted = false;
        game.drawingData = [];
        game.currentWord = '';
        game.wordHint = '';
        game.roundEndTime = undefined;
        game.selectionEndTime = undefined;

        io.to(roomId).emit('clearCanvas');

        io.to(roomId).emit('gameEnd', {
            scores: game.players.map(p => ({ name: p.name, score: p.score }))
        });

        const host = game.players.find(p => p.id === game.roomCreatorId);
        const hostName = host ? host.name : 'Host';

        game.messages.push({
            sender: 'System',
            text: `Game ended (not enough players). ${hostName} can type /start to play again!`,
            timestamp: Date.now(),
            isSystemMessage: true,
            color: 'gold'
        });

        game.players.forEach(p => p.score = 0);
        game.roundNumber = 0;
        game.currentDrawer = 0;
        broadcastGameState(roomId, game);
        return;
    }

    // Reveal word to everyone
    io.to(roomId).emit('roundEnd', {
        word: game.currentWord,
        scores: game.players.map(p => ({ name: p.name, score: p.score }))
    });

    // Wait 5 seconds then start next round
    setTimeout(() => {
        // Check again if we still have enough players after timeout
        if (game.players.length < 2) {
            game.gameStarted = false;
            game.drawingData = [];
            game.currentWord = '';
            game.wordHint = '';
            game.roundEndTime = undefined;
            game.selectionEndTime = undefined;

            io.to(roomId).emit('clearCanvas');

            io.to(roomId).emit('gameEnd', {
                scores: game.players.map(p => ({ name: p.name, score: p.score }))
            });

            const host = game.players.find(p => p.id === game.roomCreatorId);
            const hostName = host ? host.name : 'Host';

            game.messages.push({
                sender: 'System',
                text: `Game ended (not enough players). ${hostName} can type /start to play again!`,
                timestamp: Date.now(),
                isSystemMessage: true,
                color: 'gold'
            });

            game.players.forEach(p => p.score = 0);
            game.roundNumber = 0;
            game.currentDrawer = 0;
            broadcastGameState(roomId, game);
            return;
        }

        game.currentDrawer = (game.currentDrawer + 1) % game.players.length;
        game.roundNumber++;
        game.drawingData = [];
        game.correctGuessers = [];
        game.hintsGiven = 0;
        game.currentWord = '';
        game.wordHint = '';
        game.wordOptions = undefined;
        game.roundEndTime = undefined;

        game.correctGuessers = [];
        game.hintsGiven = 0;
        game.currentWord = '';
        game.wordHint = '';
        game.wordOptions = undefined;
        game.roundEndTime = undefined;

        // Explicitly tell all clients to clear their canvas
        io.to(roomId).emit('clearCanvas');
        game.players.forEach(p => {
            p.hasGuessed = false;
            p.guessCount = 0;
        });

        // End game after everyone has drawn twice (2 rounds per player)
        // Check if anyone reached the target score
        const winner = game.players.find(p => p.score >= game.maxScore);

        if (winner) {
            game.gameStarted = false;
            game.drawingData = []; // Ensure data is cleared on game end
            game.currentWord = '';
            game.wordHint = '';
            game.roundEndTime = undefined;
            game.selectionEndTime = undefined;

            // Explicitly tell all clients to clear their canvas
            io.to(roomId).emit('clearCanvas');

            const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);
            io.to(roomId).emit('gameEnd', {
                scores: sortedPlayers.map(p => ({ name: p.name, score: p.score }))
            });

            const host = game.players.find(p => p.id === game.roomCreatorId);
            const hostName = host ? host.name : 'Host';

            game.messages.push({
                sender: 'System',
                text: `Game Over! ${winner.name} reached the target score! ${hostName} can type /start to play again!`,
                timestamp: Date.now(),
                isSystemMessage: true,
                color: 'gold'
            });

            // Reset scores for potential rematch
            game.players.forEach(p => p.score = 0);
            game.roundNumber = 0;
            broadcastGameState(roomId, game);
        } else {
            // Start next round - give word options to new drawer
            const options = getRandomWords(3, game.theme);
            game.wordOptions = options;
            game.selectionEndTime = Date.now() + 20000; // 20 seconds to select

            // Ensure canvas is cleared for selection phase too
            game.drawingData = [];
            io.to(roomId).emit('clearCanvas');

            broadcastGameState(roomId, game);
        }
    }, 5000);
};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('getRooms', () => {
        const roomList: any[] = [];
        games.forEach((game, id) => {
            roomList.push({
                roomId: id,
                playerCount: game.players.filter(p => p.isConnected).length,
                maxPlayers: game.maxPlayers,
                maxScore: game.maxScore,
                gameStarted: game.gameStarted,
                isLocked: !!game.password
            });
        });
        socket.emit('roomListUpdate', roomList);
    });

    socket.on('joinRoom', ({ roomId, playerName, password, maxPlayers, theme, maxScore, avatarSeed }: JoinRoomPayload) => {
        let game = games.get(roomId);

        if (!game) {
            game = createInitialGameState(roomId, maxPlayers, theme, maxScore);
            if (password && password.trim() !== "") {
                game.password = password;
            }
            games.set(roomId, game);
        } else {
            if (game.password && game.password !== password) {
                socket.emit('error', 'Incorrect Password');
                return;
            }
        }

        if (game.players.length >= game.maxPlayers) {
            socket.emit('error', 'Room is full');
            return;
        }

        const existingPlayer = game.players.find((p: Player) => p.id === socket.id);
        if (existingPlayer) {
            socket.emit('error', 'Already in room');
            return;
        }

        const newPlayer: Player = {
            id: socket.id,
            name: playerName,
            avatarSeed: avatarSeed || Math.random().toString(36).substring(7), // Random seed if not provided
            index: game.players.length,
            isConnected: true,
            score: 0,
            hasGuessed: false
        };

        game.players.push(newPlayer);
        socket.join(roomId);

        if (game.players.length === 1) {
            game.roomCreatorId = socket.id;
            // Send instruction message to host
            const instructionMsg: ChatMessage = {
                sender: 'System',
                text: `👑 ${playerName} is the room host! They can type /start to begin when ready (min 2 players).`,
                timestamp: Date.now(),
                isSystemMessage: true,
                color: 'gold' // Özel renk
            };
            game.messages.push(instructionMsg);
        }

        // Notify others
        const joinMsg: ChatMessage = {
            sender: 'System',
            text: `${playerName} joined the room`,
            timestamp: Date.now(),
            isSystemMessage: true
        };
        game.messages.push(joinMsg);

        broadcastGameState(roomId, game);
        broadcastRoomList();
    });

    socket.on('addBot', ({ roomId }: AddBotPayload) => {
        const game = games.get(roomId);
        if (!game) return;

        if (socket.id !== game.roomCreatorId) {
            socket.emit('error', 'Only room creator can add bots');
            return;
        }

        if (game.players.length >= game.maxPlayers) {
            socket.emit('error', 'Room is full');
            return;
        }

        if (game.gameStarted) {
            socket.emit('error', 'Game already started');
            return;
        }

        const botPlayer: Player = {
            id: `bot-${Date.now()}`,
            name: `Bot ${game.players.length + 1}`,
            avatarSeed: `Bot ${game.players.length + 1}`,
            index: game.players.length,
            isConnected: true,
            score: 0,
            isBot: true,
            hasGuessed: false
        };

        game.players.push(botPlayer);
        broadcastGameState(roomId, game);
        broadcastRoomList();
    });

    socket.on('removeBot', ({ roomId, botId }: { roomId: string, botId: string }) => {
        const game = games.get(roomId);
        if (!game) return;

        if (socket.id !== game.roomCreatorId) {
            socket.emit('error', 'Only room creator can remove bots');
            return;
        }

        if (game.gameStarted) {
            socket.emit('error', 'Cannot remove bots after game started');
            return;
        }

        const botIndex = game.players.findIndex((p: Player) => p.id === botId);
        if (botIndex === -1 || !game.players[botIndex].isBot) {
            socket.emit('error', 'Bot not found');
            return;
        }

        game.players.splice(botIndex, 1);
        game.players.forEach((p: Player, idx: number) => p.index = idx);

        broadcastGameState(roomId, game);
        broadcastRoomList();
    });

    socket.on('startGame', ({ roomId }: StartGamePayload) => {
        const game = games.get(roomId);
        if (!game) return;

        if (socket.id !== game.roomCreatorId) {
            socket.emit('error', 'Only room creator can start the game');
            return;
        }

        if (game.gameStarted) {
            socket.emit('error', 'Game already started');
            return;
        }

        if (game.players.length < 2) {
            socket.emit('error', 'Need at least 2 players to start');
            return;
        }

        game.gameStarted = true;
        game.currentDrawer = 0;
        game.roundNumber = 1;
        game.currentWord = '';
        game.wordHint = '';
        const options = getRandomWords(3, game.theme);
        game.wordOptions = options;
        game.selectionEndTime = Date.now() + 20000; // 20 seconds to select
        game.drawingData = [];
        game.correctGuessers = [];

        // Clear canvas on game start
        io.to(roomId).emit('clearCanvas');

        game.players.forEach((p: Player) => {
            p.score = 0;
            p.hasGuessed = false;
            p.guessCount = 0;
        });

        broadcastGameState(roomId, game);
        broadcastRoomList();
    });

    socket.on('selectWord', ({ roomId, word }: SelectWordPayload) => {
        const game = games.get(roomId);
        if (!game) return;

        const player = game.players.find((p: Player) => p.id === socket.id);
        if (!player || player.index !== game.currentDrawer) {
            socket.emit('error', 'Not your turn to draw');
            return;
        }

        if (!game.wordOptions || !game.wordOptions.includes(word)) {
            socket.emit('error', 'Invalid word selection');
            return;
        }

        game.currentWord = word;
        game.wordHint = getWordHint(word, 0);
        game.wordOptions = undefined;
        game.selectionEndTime = undefined;
        game.roundEndTime = Date.now() + 80000; // 80 seconds per round

        // Clear drawing data when word is selected (official start of drawing)
        game.drawingData = [];
        io.to(roomId).emit('clearCanvas');

        broadcastGameState(roomId, game);
    });

    socket.on('giveHint', ({ roomId }: { roomId: string }) => {
        const game = games.get(roomId);
        if (!game) return;

        const player = game.players.find((p: Player) => p.id === socket.id);
        if (!player || player.index !== game.currentDrawer) {
            socket.emit('error', 'Only drawer can give hints');
            return;
        }

        if (!game.currentWord) return;

        // Find unrevealed indices
        const unrevealedIndices: number[] = [];
        for (let i = 0; i < game.currentWord.length; i++) {
            if (game.wordHint && game.wordHint[i * 2] === '_') { // *2 because of spaces in hint
                unrevealedIndices.push(i);
            }
        }

        if (unrevealedIndices.length === 0) {
            socket.emit('error', 'All letters revealed');
            return;
        }

        // Check hint limit
        if ((game.hintsGiven || 0) >= 2) {
            socket.emit('error', 'Max 2 hints per round');
            return;
        }

        // Pick random index to reveal
        const revealIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];

        // Update hint
        const currentHintChars = game.wordHint ? game.wordHint.split(' ') : [];
        currentHintChars[revealIndex] = game.currentWord[revealIndex];
        game.wordHint = currentHintChars.join(' ');

        // Increment usage
        game.hintsGiven = (game.hintsGiven || 0) + 1;

        // Broadcast update
        broadcastGameState(roomId, game);

        // Notify chat
        const chatMsg: ChatMessage = {
            sender: 'System',
            text: 'Drawer gave a hint!',
            timestamp: Date.now(),
            isSystemMessage: true
        };
        game.messages.push(chatMsg);
        broadcastGameState(roomId, game);
    });

    socket.on('draw', ({ roomId, action }: DrawPayload) => {
        const game = games.get(roomId);
        if (!game) return;

        const player = game.players.find((p: Player) => p.id === socket.id);
        if (!player || player.index !== game.currentDrawer) {
            return; // Silently ignore non-drawer attempts
        }

        game.drawingData.push(action);

        // Broadcast to everyone INCLUDING the sender for consistent state
        io.to(roomId).emit('draw', action);
    });

    socket.on('sendMessage', ({ roomId, message }: SendMessagePayload) => {
        const game = games.get(roomId);
        if (!game) return;

        const player = game.players.find((p: Player) => p.id === socket.id);
        if (!player) return;

        // Handle /start command
        if (message.trim() === '/start') {
            if (socket.id !== game.roomCreatorId) {
                socket.emit('error', 'Only room creator can start the game');
                return;
            }
            if (game.gameStarted) {
                socket.emit('error', 'Game already started');
                return;
            }
            if (game.players.length < 2) {
                socket.emit('error', 'Need at least 2 players to start');
                return;
            }

            game.gameStarted = true;
            game.currentDrawer = 0;
            game.roundNumber = 1;
            game.currentWord = '';
            game.wordHint = '';
            game.roundEndTime = undefined;
            game.selectionEndTime = undefined;
            const options = getRandomWords(3, game.theme);
            game.wordOptions = options;
            game.selectionEndTime = Date.now() + 20000; // 20 seconds to select
            game.drawingData = [];
            game.correctGuessers = [];
            game.hintsGiven = 0;

            // Clear canvas on game start via /start command
            io.to(roomId).emit('clearCanvas');

            game.players.forEach((p: Player) => {
                p.score = 0;
                p.hasGuessed = false;
                p.guessCount = 0;
            });

            broadcastGameState(roomId, game);
            broadcastRoomList();
            return;
        }

        // Check if it's a correct guess
        if (game.currentWord &&
            game.gameStarted &&
            message.toLowerCase().trim() === game.currentWord.toLowerCase() &&
            player.index !== game.currentDrawer &&
            !game.correctGuessers.includes(player.id)) {

            // Calculate points based on order and time
            // 1st: 10, 2nd: 9, 3rd: 8, ... Min: 1
            const guessOrder = game.correctGuessers.length; // 0 for 1st, 1 for 2nd...

            // Time Penalty:
            // 0-15s: 0
            // 15-30s: -1
            // 30-45s: -2
            // 45s+: -3
            const timeElapsed = (game.roundEndTime! - Date.now()) / 1000; // This is actually timeLeft
            const roundDuration = 60; // Assuming 60s round
            const actualTimeElapsed = roundDuration - timeElapsed;

            let timePenalty = 0;
            if (actualTimeElapsed > 45) timePenalty = 3;
            else if (actualTimeElapsed > 30) timePenalty = 2;
            else if (actualTimeElapsed > 15) timePenalty = 1;

            const points = Math.max(1, (10 - guessOrder) - timePenalty);

            player.score += points;
            player.hasGuessed = true;
            game.correctGuessers.push(player.id);

            // Award drawer - Proportional to total players
            // Formula: 10 * (Correct Guesses / Total Possible Guessers)
            const drawer = game.players[game.currentDrawer];
            const totalPossibleGuessers = Math.max(1, game.players.length - 1);

            // Calculate old score contribution (before this guess)
            const prevCorrectCount = game.correctGuessers.length - 1;
            const prevScoreContribution = Math.ceil(10 * (prevCorrectCount / totalPossibleGuessers));

            // Calculate new score contribution (including this guess)
            // Drawer gets points purely based on percentage of people who guessed.
            // This ensures that in 1v1, if the guesser is slow, the guesser loses points but the drawer doesn't.
            // This allows the faster guesser to pull ahead in total score.
            const newScoreContribution = Math.ceil(10 * (game.correctGuessers.length / totalPossibleGuessers));

            // Add the difference
            const scoreDelta = newScoreContribution - prevScoreContribution;
            drawer.score += scoreDelta;

            // Broadcast correct guess notification
            const chatMsg: ChatMessage = {
                sender: 'System',
                text: `${player.name} guessed the word!`,
                timestamp: Date.now(),
                isSystemMessage: true
            };
            game.messages.push(chatMsg);
            broadcastGameState(roomId, game);

            // If everyone guessed, end round early
            // Check if everyone has guessed
            if (game.correctGuessers.length >= game.players.length - 1) {
                endRound(game, roomId);
            }
        } else {
            // Check guess limit
            if (game.gameStarted && game.currentWord && player.index !== game.currentDrawer) {
                if ((player.guessCount || 0) >= 5) {
                    // Send private system message
                    socket.emit('gameStateUpdate', game); // Ensure state is synced
                    socket.emit('error', 'You have used all your guesses!');
                    return;
                }

                // Increment guess count for wrong guesses
                player.guessCount = (player.guessCount || 0) + 1;
            }

            // Normal chat message (only show if not the correct word)
            const chatMsg: ChatMessage = {
                sender: player.name,
                text: message,
                timestamp: Date.now()
            };
            game.messages.push(chatMsg);
            broadcastGameState(roomId, game);

            // Check if round should end early (everyone guessed OR used all guesses)
            // Filter out drawer
            const guessers = game.players.filter(p => p.index !== game.currentDrawer);
            const allFinished = guessers.every(p => p.hasGuessed || (p.guessCount || 0) >= 5);

            if (allFinished) {
                // Award drawer compensation points if nobody guessed correctly
                // This ensures fairness in 1v1 and small games
                if (game.correctGuessers.length === 0) {
                    const drawer = game.players[game.currentDrawer];
                    // Give drawer 3-5 points based on average attempts made
                    const totalAttempts = guessers.reduce((sum, p) => sum + (p.guessCount || 0), 0);
                    const avgAttempts = totalAttempts / guessers.length;
                    // More attempts = better drawing (drawer tried hard) = more points
                    const compensationPoints = Math.ceil(3 + (avgAttempts / 5) * 2); // 3-5 points
                    drawer.score += compensationPoints;

                    const compensationMsg: ChatMessage = {
                        sender: 'System',
                        text: `${drawer.name} earned ${compensationPoints} points for drawing!`,
                        timestamp: Date.now(),
                        isSystemMessage: true
                    };
                    game.messages.push(compensationMsg);
                    broadcastGameState(roomId, game);
                }

                endRound(game, roomId);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        games.forEach((game, roomId) => {
            const playerIndex = game.players.findIndex((p: Player) => p.id === socket.id);
            if (playerIndex !== -1) {
                const player = game.players[playerIndex];

                // Remove player from array
                game.players.splice(playerIndex, 1);

                // Re-calculate indices for remaining players
                game.players.forEach((p, index) => p.index = index);

                // Clean up correctGuessers
                game.correctGuessers = game.correctGuessers.filter(id => id !== socket.id);

                // Handle currentDrawer adjustment
                const wasDrawer = playerIndex === game.currentDrawer;
                if (playerIndex < game.currentDrawer) {
                    game.currentDrawer--;
                } else if (wasDrawer) {
                    // If drawer left during active round, end it
                    if (game.gameStarted && game.currentWord) {
                        // Set currentDrawer to previous index so endRound will increment to correct next player
                        game.currentDrawer = playerIndex > 0 ? playerIndex - 1 : game.players.length - 1;
                        endRound(game, roomId);
                    } else {
                        // Not in active round, just adjust index
                        game.currentDrawer = playerIndex % Math.max(1, game.players.length);
                    }
                } else if (game.gameStarted && game.currentWord && game.correctGuessers.length >= game.players.length - 1) {
                    // Check if everyone remaining has guessed
                    endRound(game, roomId);
                }

                // Reassign creator if needed
                if (game.roomCreatorId === socket.id) {
                    if (game.players.length > 0) {
                        game.roomCreatorId = game.players[0].id;
                        // Notify about new host
                        const hostMsg: ChatMessage = {
                            sender: 'System',
                            text: `${game.players[0].name} is now the room host`,
                            timestamp: Date.now(),
                            isSystemMessage: true
                        };
                        game.messages.push(hostMsg);
                    }
                }

                const leaveMsg: ChatMessage = {
                    sender: 'System',
                    text: `${player.name} disconnected`,
                    timestamp: Date.now(),
                    isSystemMessage: true
                };
                game.messages.push(leaveMsg);

                // Check if game should end (less than 2 players)
                if (game.gameStarted && game.players.length < 2) {
                    game.gameStarted = false;
                    game.drawingData = [];
                    game.currentWord = '';
                    game.wordHint = '';
                    game.roundEndTime = undefined;
                    game.selectionEndTime = undefined;

                    io.to(roomId).emit('clearCanvas');

                    io.to(roomId).emit('gameEnd', {
                        scores: game.players.map(p => ({ name: p.name, score: p.score }))
                    });

                    const host = game.players.find(p => p.id === game.roomCreatorId);
                    const hostName = host ? host.name : 'Host';

                    game.messages.push({
                        sender: 'System',
                        text: `Game ended (not enough players). ${hostName} can type /start to play again!`,
                        timestamp: Date.now(),
                        isSystemMessage: true,
                        color: 'gold'
                    });

                    game.players.forEach(p => p.score = 0);
                    game.roundNumber = 0;
                    game.currentDrawer = 0;
                }

                broadcastGameState(roomId, game);
                broadcastRoomList();

                // Clean up empty rooms
                if (game.players.length === 0) {
                    games.delete(roomId);
                    broadcastRoomList();
                }
            }
        });
    });
});

// Round timer - check for round end
setInterval(() => {
    const now = Date.now();
    games.forEach((game, roomId) => {
        // Check for round timeout
        if (game.gameStarted && game.roundEndTime && now >= game.roundEndTime && game.currentWord) {
            // Clear roundEndTime before calling endRound to prevent re-entry
            game.roundEndTime = undefined;
            endRound(game, roomId);
        }

        // Check for selection timeout
        if (game.gameStarted && game.selectionEndTime && now >= game.selectionEndTime) {
            if (game.wordOptions && game.wordOptions.length > 0) {
                // Auto-select random word
                const randomWord = game.wordOptions[Math.floor(Math.random() * game.wordOptions.length)];

                game.currentWord = randomWord;
                game.wordHint = getWordHint(randomWord, 0);
                game.wordOptions = undefined;
                game.selectionEndTime = undefined;
                game.roundEndTime = Date.now() + 80000;

                // Clear drawing data on auto-select just in case
                game.drawingData = [];
                io.to(roomId).emit('clearCanvas');

                broadcastGameState(roomId, game);

                // Notify chat
                const chatMsg: ChatMessage = {
                    sender: 'System',
                    text: 'Word auto-selected due to timeout',
                    timestamp: Date.now(),
                    isSystemMessage: true
                };
                game.messages.push(chatMsg);
                broadcastGameState(roomId, game);
            }
        }
    });
}, 1000);

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';
server.listen(Number(PORT), HOST, () => {
    console.log(`Drawing game server running on ${HOST}:${PORT}`);
});
