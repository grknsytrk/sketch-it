import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { IconPencil, IconCheck, IconCrown, IconX } from './Icons';

const Scoreboard: React.FC = () => {
    const { gameState, myPlayerId, kickPlayer } = useGameStore();
    const [kickTargetId, setKickTargetId] = useState<string | null>(null);

    if (!gameState) return null;

    const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
    const isRoomCreator = gameState.roomCreatorId === myPlayerId;

    const kickTargetPlayer = kickTargetId ? gameState.players.find(p => p.id === kickTargetId) : null;

    const handleKickClick = (playerId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setKickTargetId(playerId);
    };

    const confirmKick = () => {
        if (kickTargetId) {
            kickPlayer(kickTargetId);
            setKickTargetId(null);
        }
    };

    const cancelKick = () => {
        setKickTargetId(null);
    };

    return (
        <>
            <div className="w-64 flex flex-col gap-2 h-full overflow-y-auto pr-2">
                {sortedPlayers.map((player, index) => {
                    const isDrawer = player.index === gameState.currentDrawer;
                    const isMe = player.id === myPlayerId;
                    const hasGuessed = player.hasGuessed;
                    const canKick = isRoomCreator && !isMe;

                    return (
                        <div
                            key={player.id}
                            className={`flex items-center p-2 border-2 transition-all relative group
                                ${isMe ? 'bg-white border-ink shadow-sketch' : 'border-transparent'}
                                ${hasGuessed && !isMe ? 'bg-green-50 border-green-200' : ''}
                            `}
                            style={{
                                borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                                transform: isMe ? 'scale(1.02) rotate(-1deg)' : 'none'
                            }}
                        >
                            {/* Rank / Status */}
                            <div className="flex flex-col items-center justify-center w-8 mr-2 font-marker">
                                <span className="text-xs font-bold text-gray-500">#{index + 1}</span>
                                {isDrawer && <IconPencil size={18} className="text-ink" />}
                                {hasGuessed && !isDrawer && <IconCheck size={18} className="text-green-500" />}
                            </div>

                            {/* Avatar */}
                            <div className="relative mr-3">
                                <img
                                    src={(() => {
                                        const seed = player.avatarSeed || player.name;
                                        if (seed.startsWith('http') || seed.startsWith('/')) {
                                            return seed;
                                        }
                                        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                                    })()}
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full bg-white border-2 border-ink object-cover"
                                />
                                {hasGuessed && !isDrawer && (
                                    <div className="absolute -bottom-1 -right-1 bg-green-400 text-white rounded-full p-0.5 border border-ink">
                                        <IconCheck size={10} color="white" strokeWidth={3} />
                                    </div>
                                )}
                            </div>

                            {/* Name & Score */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold truncate font-hand text-lg ${player.hasGuessed ? 'text-green-600' : 'text-ink'}`}>
                                        {player.name} {player.id === myPlayerId ? '(You)' : ''}
                                    </span>
                                    {!player.hasGuessed && gameState.gameStarted && !isDrawer && (
                                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded border font-hand ${(player.guessCount || 0) >= 4 ? 'bg-red-100 text-red-600 border-red-200' : 'bg-blue-100 text-blue-600 border-blue-200'
                                            }`}>
                                            {5 - (player.guessCount || 0)} left
                                        </span>
                                    )}
                                    {player.id === gameState.roomCreatorId && <IconCrown size={16} className="ml-1 text-yellow-500" fill="#FFD700" />}
                                </div>
                                <div className="text-xs font-bold text-gray-500 font-hand">
                                    {player.score} points
                                </div>
                            </div>

                            {/* Kick Button - Only visible to room creator for other players */}
                            {canKick && (
                                <button
                                    onClick={(e) => handleKickClick(player.id, e)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 border border-transparent hover:border-red-300"
                                    title="Kick player"
                                >
                                    <IconX size={14} strokeWidth={3} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Kick Confirmation Modal */}
            {kickTargetId && kickTargetPlayer && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="sketch-modal w-72 text-center">
                        <h3 className="font-bold text-lg mb-3 text-ink font-marker">Kick Player?</h3>
                        <p className="text-gray-600 font-hand mb-4">
                            Are you sure you want to kick <span className="font-bold text-ink">{kickTargetPlayer.name}</span>?
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={cancelKick}
                                className="gartic-btn flex-1 py-2 text-sm bg-gray-200"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={confirmKick}
                                className="gartic-btn flex-1 py-2 text-sm"
                                style={{ background: 'var(--color-pastel-pink)' }}
                            >
                                KICK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Scoreboard;
