import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { soundManager } from '../utils/soundManager';
import DrawingCanvas from './DrawingCanvas';
import WordSelection from './WordSelection';
import Scoreboard from './Scoreboard';
import Chat from './Chat';
import GameOver from './GameOver';
import { IconPalette, IconPaw, IconPizza, IconBox, IconStar, IconFilm, IconGamepad, IconBall, IconPencil, IconChat, IconUsers } from './Icons';


const GameView: React.FC = () => {
    const { gameState, myPlayerId, selectWord, draw, leaveRoom, giveHint, gameOverData } = useGameStore();
    const [timeLeft, setTimeLeft] = useState(80);
    const [mobilePanel, setMobilePanel] = useState<'canvas' | 'chat' | 'scoreboard'>('canvas');

    const isDrawer = gameState?.currentDrawer !== undefined && gameState.players[gameState.currentDrawer]?.id === myPlayerId;
    const showWordSelection = isDrawer && gameState?.wordOptions && gameState.wordOptions.length > 0;

    useEffect(() => {
        if (!gameState?.roundEndTime) return;

        const interval = setInterval(() => {
            // Calculate time offset if server time is available
            const offset = gameState.serverTime ? gameState.serverTime - Date.now() : 0;
            // Adjust current time by offset to match server time
            const serverNow = Date.now() + offset;

            const remaining = Math.max(0, Math.min(80, Math.floor((gameState.roundEndTime! - serverNow) / 1000)));
            setTimeLeft(remaining);
        }, 100);

        return () => clearInterval(interval);
    }, [gameState?.roundEndTime, gameState?.serverTime]);

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
        <div className="flex flex-col lg:flex-row w-full h-screen p-2 lg:p-4 gap-2 lg:gap-4 overflow-hidden relative pb-16 lg:pb-4">

            {/* Left Sidebar: Scoreboard - Hidden on mobile, visible on desktop only */}
            <div className="hidden lg:flex w-64 flex-shrink-0 flex-col gap-4">
                <div className="gartic-card p-3 flex items-center justify-between bg-white">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 font-hand uppercase">TOPIC</span>
                        <h1 className="text-lg font-marker text-ink tracking-wider flex items-center gap-1.5">
                            {(() => {
                                const themeIcons: Record<string, React.ReactNode> = {
                                    general: <IconPalette size={18} />,
                                    animals: <IconPaw size={18} />,
                                    food: <IconPizza size={18} />,
                                    objects: <IconBox size={18} />,
                                    anime: <IconStar size={18} />,
                                    movies: <IconFilm size={18} />,
                                    games: <IconGamepad size={18} />,
                                    sports: <IconBall size={18} />
                                };
                                const icon = themeIcons[gameState.theme] || <IconPalette size={18} />;
                                const themeName = gameState.theme.charAt(0).toUpperCase() + gameState.theme.slice(1);
                                return <>{icon} {themeName}</>;
                            })()}
                        </h1>
                    </div>
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

            {/* Mobile Scoreboard Panel - Only visible when scoreboard tab is active on mobile */}
            {mobilePanel === 'scoreboard' && (
                <div className="flex lg:hidden flex-col gap-2 flex-1 min-h-0 w-full">
                    <div className="gartic-card p-3 flex items-center justify-between bg-white flex-shrink-0">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-400 font-hand uppercase">TOPIC</span>
                            <h1 className="text-base font-marker text-ink tracking-wider flex items-center gap-1">
                                {(() => {
                                    const themeIcons: Record<string, React.ReactNode> = {
                                        general: <IconPalette size={16} />,
                                        animals: <IconPaw size={16} />,
                                        food: <IconPizza size={16} />,
                                        objects: <IconBox size={16} />,
                                        anime: <IconStar size={16} />,
                                        movies: <IconFilm size={16} />,
                                        games: <IconGamepad size={16} />,
                                        sports: <IconBall size={16} />
                                    };
                                    const icon = themeIcons[gameState.theme] || <IconPalette size={16} />;
                                    const themeName = gameState.theme.charAt(0).toUpperCase() + gameState.theme.slice(1);
                                    return <>{icon} {themeName}</>;
                                })()}
                            </h1>
                        </div>
                        <span className="text-xs font-bold text-gray-400 font-hand">TARGET: {gameState.maxScore}</span>
                        <button
                            onClick={leaveRoom}
                            className="text-xs font-bold text-red-500 hover:text-red-700 font-hand border-b border-red-500 border-dashed"
                        >
                            EXIT
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto flex justify-center">
                        <Scoreboard />
                    </div>
                </div>
            )}

            {/* Main Content Area - Hidden on mobile when showing other tabs */}
            <div className={`flex-1 flex flex-col gap-2 lg:gap-4 min-w-0 ${mobilePanel !== 'canvas' ? 'hidden lg:flex' : ''}`}>
                {/* Header: Word & Timer */}
                <div className="flex gap-2 lg:gap-4 h-14 lg:h-20 flex-shrink-0">
                    {/* Word Display */}
                    <div className="flex-1 gartic-card flex items-center justify-center relative overflow-hidden bg-white px-2">
                        {isDrawer && gameState.currentWord ? (
                            <div className="flex flex-col items-center w-full relative py-1">
                                <span className="text-[10px] lg:text-xs font-bold text-gray-400 font-hand">YOU ARE DRAWING</span>
                                <h2 className="text-lg lg:text-2xl font-black text-ink tracking-widest uppercase font-marker">
                                    {gameState.currentWord}
                                </h2>
                                <button
                                    onClick={giveHint}
                                    disabled={(gameState.hintsGiven || 0) >= 2}
                                    className={`absolute right-1 lg:right-4 top-1/2 -translate-y-1/2 text-ink text-[10px] lg:text-xs font-bold px-2 lg:px-3 py-0.5 lg:py-1 rounded-full border-2 border-ink transition-colors font-hand
                                        ${(gameState.hintsGiven || 0) >= 2
                                            ? 'bg-gray-200 cursor-not-allowed'
                                            : 'bg-yellow-200 hover:bg-yellow-300'}`}
                                    title="Give a hint (Max 2 per round)"
                                >
                                    <span className="hidden lg:inline">HINT ({2 - (gameState.hintsGiven || 0)})</span>
                                    <span className="lg:hidden">{2 - (gameState.hintsGiven || 0)}</span>
                                </button>
                            </div>
                        ) : gameState.wordHint ? (
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] lg:text-xs font-bold text-gray-400 font-hand">GUESS THE WORD</span>
                                <h2 className="text-lg lg:text-2xl font-black text-ink tracking-widest uppercase letter-spacing-4 font-marker">
                                    {gameState.wordHint}
                                </h2>
                            </div>
                        ) : !gameState.gameStarted ? (
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-gray-400 text-sm lg:text-lg font-hand">Waiting for game to start...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-gray-400 text-sm lg:text-lg font-hand">Waiting for word selection...</span>
                            </div>
                        )}

                        {/* Progress Bar */}
                        {gameState.roundEndTime && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 lg:h-2 bg-gray-100 border-t border-ink">
                                <div
                                    className={`h-full transition-all duration-100 ${timeLeft <= 10 ? 'bg-red-300' : 'bg-blue-300'
                                        }`}
                                    style={{ width: `${(timeLeft / 80) * 100}%` }}
                                />
                            </div>
                        )}
                    </div>
                    {/* Timer */}
                    {gameState.roundEndTime && (
                        <div className="w-14 lg:w-24 gartic-card flex items-center justify-center bg-white">
                            <span className={`text-2xl lg:text-4xl font-black font-marker ${timeLeft < 10 ? 'text-red-400' : 'text-blue-400'}`}>
                                {timeLeft}
                            </span>
                        </div>
                    )}
                </div>

                {/* Game Area: Canvas & Chat */}
                <div className="flex-1 flex gap-2 lg:gap-4 min-h-0">
                    {/* Canvas Container */}
                    <div className="flex-1 gartic-card p-1 flex flex-col relative bg-white overflow-hidden">
                        <DrawingCanvas
                            isDrawer={isDrawer}
                            onDraw={handleDraw}
                            drawingData={gameState.drawingData || []}
                        />
                    </div>

                    {/* Chat Container - Hidden on mobile */}
                    <div className="hidden lg:block w-80 flex-shrink-0">
                        <Chat />
                    </div>
                </div>
            </div>

            {/* Mobile Chat Panel */}
            {mobilePanel === 'chat' && (
                <div className="flex lg:hidden flex-1 min-h-0">
                    <div className="w-full h-full">
                        <Chat />
                    </div>
                </div>
            )}

            {/* Mobile Tab Bar */}
            <div className="mobile-tab-bar flex lg:hidden">
                <button
                    onClick={() => setMobilePanel('canvas')}
                    className={`mobile-tab-btn ${mobilePanel === 'canvas' ? 'active' : ''}`}
                >
                    <IconPencil size={20} />
                    <span>CANVAS</span>
                </button>
                <button
                    onClick={() => setMobilePanel('chat')}
                    className={`mobile-tab-btn ${mobilePanel === 'chat' ? 'active' : ''}`}
                >
                    <IconChat size={20} />
                    <span>CHAT</span>
                </button>
                <button
                    onClick={() => setMobilePanel('scoreboard')}
                    className={`mobile-tab-btn ${mobilePanel === 'scoreboard' ? 'active' : ''}`}
                >
                    <IconUsers size={20} />
                    <span>SCORES</span>
                </button>
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
