import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/soundManager';

interface WordSelectionProps {
    words: string[];
    onSelect: (word: string) => void;
}

const WordSelection: React.FC<WordSelectionProps> = ({ words, onSelect }) => {
    const [timeLeft, setTimeLeft] = useState(20);

    const handleSelect = (word: string) => {
        soundManager.play('wordSelect', 0.6);
        onSelect(word);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Auto-select first word if time runs out
                    onSelect(words[0]);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onSelect, words]);

    // Tick sound effect when time is running low
    useEffect(() => {
        if (timeLeft > 0 && timeLeft <= 10) {
            soundManager.play('tick', 0.4);
        }
    }, [timeLeft]);

    const cardColors = [
        '#a0e7e5', // pastel blue
        '#ffb7b2', // pastel pink
        '#fff4bd', // pastel yellow
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="sketch-modal max-w-2xl w-[95vw] mx-2 lg:mx-4 bg-paper p-4 lg:p-8">
                {/* Header */}
                <div className="text-center mb-4 lg:mb-8">
                    <h2 className="text-2xl lg:text-4xl font-marker text-ink mb-2">
                        Choose Your Word!
                    </h2>
                    <div className="flex items-center justify-center gap-2 font-hand">
                        <div className="text-xl lg:text-2xl font-bold text-ink">
                            {timeLeft}s
                        </div>
                        <div className="w-32 lg:w-48 h-3 lg:h-4 border-2 border-ink rounded-full overflow-hidden p-0.5 bg-white">
                            <div
                                className={`h-full transition-all duration-1000 ease-linear rounded-full border border-ink ${timeLeft <= 5 ? 'bg-red-300' : 'bg-blue-300'
                                    }`}
                                style={{ width: `${(timeLeft / 20) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Word Cards */}
                <div className="grid grid-cols-1 gap-2 lg:gap-4">
                    {words.map((word, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelect(word)}
                            className="group relative overflow-visible p-4 lg:p-6 transition-all duration-300 border-2 border-ink hover:scale-105"
                            style={{
                                backgroundColor: cardColors[index % cardColors.length],
                                borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                                boxShadow: '3px 3px 0px var(--color-ink)'
                            }}
                        >
                            <div className="relative z-10 flex items-center justify-between">
                                <span className="text-xl lg:text-3xl font-black text-ink font-marker">
                                    {word.toUpperCase()}
                                </span>
                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-ink bg-white flex items-center justify-center
                                    group-hover:rotate-12 transition-all duration-300">
                                    <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Helper Text */}
                <p className="text-center text-gray-500 text-lg font-hand mt-6">
                    Click on a word to start drawing!
                </p>
            </div>
        </div>
    );
};

export default WordSelection;
