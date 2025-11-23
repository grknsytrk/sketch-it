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
    avatarSeed?: string;
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
    targetId?: string; // Sadece belirli bir kişiye gösterilecekse
    color?: string; // Özel renk (örn: 'gold')
}

export interface GameState {
    roomId: string;
    password?: string;
    roomCreatorId?: string;
    players: Player[];
    gameStarted: boolean;
    messages: ChatMessage[];

    // Drawing game specific
    currentDrawer: number;
    currentWord: string;
    wordHint?: string;
    wordOptions?: string[];
    roundNumber: number;
    roundEndTime?: number;
    selectionEndTime?: number;
    drawingData: DrawingAction[];
    correctGuessers: string[];
    hintsGiven: number;

    // Room settings
    maxPlayers: number;
    theme: string;
    maxScore: number;
}

export interface JoinRoomPayload {
    roomId: string;
    playerName: string;
    password?: string;
    // Creation options
    maxPlayers?: number;
    theme?: string;
    maxScore?: number;
    avatarSeed?: string;
}

export interface SendMessagePayload {
    roomId: string;
    message: string;
}

export interface AddBotPayload {
    roomId: string;
}

export interface StartGamePayload {
    roomId: string;
}

export interface SelectWordPayload {
    roomId: string;
    word: string;
}

export interface DrawPayload {
    roomId: string;
    action: DrawingAction;
}

export interface RoomInfo {
    roomId: string;
    playerCount: number;
    maxPlayers: number;
    maxScore: number;
    gameStarted: boolean;
    isLocked: boolean;
}
