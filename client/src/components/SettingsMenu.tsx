import React, { useState } from 'react';
import { soundManager } from '../utils/soundManager';
import { IconMenu, IconX, IconSoundOn, IconSoundOff } from './Icons';

const SettingsMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());
    const [volume, setVolume] = useState(0.5); // Default volume

    const toggleSound = () => {
        const newState = soundManager.toggle();
        setSoundEnabled(newState);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        soundManager.setVolume(newVol);
        if (newVol > 0 && !soundEnabled) {
            soundManager.toggle(); // Auto enable if volume dragged up
            setSoundEnabled(true);
        }
    };

    return (
        <div className="absolute top-4 right-4 z-40">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="gartic-btn text-sm py-2 px-3 bg-white font-marker flex items-center gap-2"
                >
                    <IconMenu size={18} />
                    MENU
                </button>
            ) : (
                <div className="gartic-card p-4 w-64 bg-white animate-bounce-in">
                    <div className="flex justify-between items-center mb-4 border-b-2 border-dashed border-gray-300 pb-2">
                        <span className="text-ink text-lg font-bold font-marker">SETTINGS</span>
                        <button onClick={() => setIsOpen(false)} className="text-ink hover:text-red-500">
                            <IconX size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Sound Controls */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 font-hand font-bold">SOUND EFFECTS</span>
                                <button
                                    onClick={toggleSound}
                                    className={`p-2 rounded-full border-2 transition-colors ${soundEnabled ? 'bg-green-100 border-green-400 text-green-600' : 'bg-red-100 border-red-400 text-red-600'}`}
                                >
                                    {soundEnabled ? <IconSoundOn size={20} /> : <IconSoundOff size={20} />}
                                </button>
                            </div>

                            {/* Volume Slider */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-400 font-mono">VOL</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-full accent-ink cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsMenu;
