import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { soundManager } from '../utils/soundManager';
import DrawingCanvas from './DrawingCanvas';
import WordSelection from './WordSelection';
import Scoreboard from './Scoreboard';
import Chat from './Chat';
import GameOver from './GameOver';


const GameView: React.FC = () => {
    const { gameState, myPlayerId, selectWord, draw, leaveRoom, giveHint, gameOverData } = useGameStore();
    const [timeLeft, setTimeLeft] = useState(80);

    const isDrawer = gameState?.currentDrawer !== undefined && gameState.players[gameState.currentDrawer]?.id === myPlayerId;
    const showWordSelection = isDrawer && gameState?.wordOptions && gameState.wordOptions.length > 0;

    useEffect(() => {
        if (!gameState?.roundEndTime) return;

        const interval = setInterval(() => {
            const remaining = Math.max(0, Math.min(80, Math.floor((gameState.roundEndTime! - Date.now()) / 1000)));
            setTimeLeft(remaining);
        }, 100);

        return () => clearInterval(interval);
    }, [gameState?.roundEndTime]);

    // Tick sound effect when time is running low
    useEffect(() => {
        if (gameState?.roundEndTime && timeLeft > 0 && timeLeft <= 10) {
            soundManager.play('tick', 0.4);
        }
    }, [timeLeft, gameState?.roundEndTime]);

    if (!gameState) return null;

    const handleWordSelect = (word: string) => {
        selectWord(word);
    };

    const handleDraw = (action: any) => {
        draw(action);
    };

    return (
        <div className="flex w-full h-screen p-4 gap-4 overflow-hidden relative">



            {/* Left Sidebar: Scoreboard */}
            <div className="w-64 flex-shrink-0 flex flex-col gap-4">
                <div className="gartic-card p-3 flex items-center justify-between bg-white">
                    <h1 className="text-xl font-marker text-ink tracking-wider">SKETCH IT!</h1>
                    <span className="text-xs font-bold text-gray-400 font-hand">TARGET: {gameState.maxScore}</span>
                    <button
                        onClick={leaveRoom}
                        className="text-xs font-bold text-red-500 hover:text-red-700 font-hand border-b border-red-500 border-dashed"
                        title="Leave Room"
                    >
                        EXIT
                    </button>
                </div>
                <Scoreboard />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
                {/* Header: Word & Timer */}
                <div className="flex gap-4 h-20">
                    {/* Word Display */}
                    <div className="flex-1 gartic-card flex items-center justify-center relative overflow-hidden bg-white">
                        {isDrawer && gameState.currentWord ? (
                            <div className="flex flex-col items-center w-full relative py-1">
                                <span className="text-xs font-bold text-gray-400 font-hand">YOU ARE DRAWING</span>
                                <h2 className="text-2xl font-black text-ink tracking-widest uppercase font-marker">
                                    {gameState.currentWord}
                                </h2>
                                <button
                                    onClick={giveHint}
                                    disabled={(gameState.hintsGiven || 0) >= 2}
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 text-ink text-xs font-bold px-3 py-1 rounded-full border-2 border-ink transition-colors font-hand
                                        ${(gameState.hintsGiven || 0) >= 2
                                            ? 'bg-gray-200 cursor-not-allowed'
                                            : 'bg-yellow-200 hover:bg-yellow-300'}`}
                                    title="Give a hint (Max 2 per round)"
                                >
                                    HINT ({2 - (gameState.hintsGiven || 0)})
                                </button>
                            </div>
                        ) : gameState.wordHint ? (
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-bold text-gray-400 font-hand">GUESS THE WORD</span>
                                <h2 className="text-2xl font-black text-ink tracking-widest uppercase letter-spacing-4 font-marker">
                                    {gameState.wordHint}
                                </h2>
                            </div>
                        ) : !gameState.gameStarted ? (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-gray-400 text-lg font-hand">Waiting for game to start...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-gray-400 text-lg font-hand">Waiting for word selection...</span>
                            </div>
                        )}

                        {/* Progress Bar */}
                        {gameState.roundEndTime && (
                            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-100 border-t-2 border-ink">
                                <div
                                    className={`h-full transition-all duration-100 border-r-2 border-ink ${timeLeft <= 10 ? 'bg-red-300' : 'bg-blue-300'
                                        }`}
                                    style={{ width: `${(timeLeft / 80) * 100}%` }}
                                />
                            </div>
                        )}
                    </div>
                    {/* Timer */}
                    {gameState.roundEndTime && (
                        <div className="w-24 gartic-card flex items-center justify-center bg-white">
                            <span className={`text-4xl font-black font-marker ${timeLeft < 10 ? 'text-red-400' : 'text-blue-400'}`}>
                                {timeLeft}
                            </span>
                        </div>
                    )}
                </div>

                {/* Game Area: Canvas & Chat */}
                <div className="flex-1 flex gap-4 min-h-0">
                    {/* Canvas Container */}
                    <div className="flex-1 gartic-card p-1 flex flex-col relative bg-white overflow-hidden">
                        <DrawingCanvas
                            isDrawer={isDrawer}
                            onDraw={handleDraw}
                            drawingData={gameState.drawingData || []}
                        />
                    </div>

                    {/* Chat Container */}
                    <div className="w-80 flex-shrink-0">
                        <Chat />
                    </div>
                </div>
            </div>

            {/* Word Selection Modal */}
            {showWordSelection && (
                <WordSelection
                    words={gameState.wordOptions!}
                    onSelect={handleWordSelect}
                />
            )}

            {/* Game Over Modal */}
            {gameOverData && (
                <GameOver
                    winners={gameOverData.winners}
                    isHost={gameState.roomCreatorId === myPlayerId}
                />
            )}
        </div>
    );
};

export default GameView;
