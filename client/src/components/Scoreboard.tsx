import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { IconPencil, IconCheck, IconCrown } from './Icons';

const Scoreboard: React.FC = () => {
    const { gameState, myPlayerId } = useGameStore();

    if (!gameState) return null;

    const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);

    return (
        <div className="w-64 flex flex-col gap-2 h-full overflow-y-auto pr-2">
            {sortedPlayers.map((player, index) => {
                const isDrawer = player.index === gameState.currentDrawer;
                const isMe = player.id === myPlayerId;
                const hasGuessed = player.hasGuessed;

                return (
                    <div
                        key={player.id}
                        className={`flex items-center p-2 border-2 transition-all relative
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
                    </div>
                );
            })}
        </div>
    );
};

export default Scoreboard;
