import React from 'react';
import { useGameStore } from '../store/useGameStore';

interface GameOverProps {
    winners: { name: string; score: number; avatarSeed?: string }[];
    isHost: boolean;
}

const GameOver: React.FC<GameOverProps> = ({ winners, isHost }) => {
    const { startGame, leaveRoom } = useGameStore();

    const getAvatarUrl = (seed?: string) => {
        const s = seed || 'default';
        if (s.startsWith('http') || s.startsWith('/')) {
            return s;
        }
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${s}`;
    };

    // Helper to render a podium spot
    const renderPodiumSpot = (player: typeof winners[0], rank: number) => {
        if (!player) return <div className="w-16 md:w-24"></div>; // Empty placeholder

        let height = 'h-24 md:h-32';
        let order = 'order-2'; // Default for 1st
        let bgColor = 'bg-yellow-200';
        let scale = 'scale-110 z-10';

        if (rank === 2) {
            height = 'h-16 md:h-24';
            order = 'order-1';
            bgColor = 'bg-gray-200';
            scale = 'scale-100 mt-6 md:mt-8';
        } else if (rank === 3) {
            height = 'h-12 md:h-20';
            order = 'order-3';
            bgColor = 'bg-orange-200';
            scale = 'scale-90 mt-10 md:mt-12';
        }

        return (
            <div className={`flex flex-col items-center ${order} ${scale} transition-all duration-500 font-hand`}>
                {/* Avatar */}
                <div className="relative mb-2">
                    <img
                        src={getAvatarUrl(player.avatarSeed || player.name)}
                        alt={player.name}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-ink bg-white object-cover"
                    />
                    <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 md:w-8 md:h-8 rounded-full ${bgColor} flex items-center justify-center text-ink font-black border-2 border-ink text-xs md:text-base`}>
                        {rank}
                    </div>
                </div>

                {/* Name & Score */}
                <div className="text-center mt-4">
                    <div className="font-bold text-ink text-sm md:text-lg truncate max-w-[80px] md:max-w-[120px] font-marker">
                        {player.name}
                    </div>
                    <div className="font-bold text-gray-600 text-xs md:text-sm">
                        {player.score} pts
                    </div>
                </div>

                {/* Podium Block */}
                <div className={`w-16 md:w-24 ${height} ${bgColor} mt-2 border-2 border-ink flex items-end justify-center pb-2`}
                    style={{ borderRadius: '10px 10px 0 0' }}>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="sketch-modal max-w-2xl w-full relative overflow-hidden bg-paper p-4 md:p-8">

                <div className="text-center mb-8 md:mb-12 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black text-ink tracking-widest mb-2 font-marker transform -rotate-2">
                        GAME OVER
                    </h2>
                    <p className="text-gray-500 font-bold uppercase tracking-wider font-hand text-lg md:text-xl">
                        And the winners are...
                    </p>
                </div>

                {/* Podium */}
                <div className="flex justify-center items-end gap-2 md:gap-4 mb-8 md:mb-12 h-48 md:h-64 relative z-10 px-2 md:px-8">
                    {winners[1] && renderPodiumSpot(winners[1], 2)}
                    {winners[0] && renderPodiumSpot(winners[0], 1)}
                    {winners[2] && renderPodiumSpot(winners[2], 3)}
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-center relative z-10">
                    <button
                        onClick={leaveRoom}
                        className="gartic-btn bg-white py-2 px-4 text-sm md:text-base"
                    >
                        EXIT
                    </button>

                    {isHost && (
                        <button
                            onClick={startGame}
                            className="gartic-btn py-2 px-4 text-sm md:text-base"
                            style={{ background: 'var(--color-pastel-green)' }}
                        >
                            PLAY AGAIN
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameOver;
