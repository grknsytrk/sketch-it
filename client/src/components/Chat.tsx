import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { IconCrown } from './Icons';

const Chat: React.FC = () => {
    const { gameState, sendMessage } = useGameStore();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [gameState?.messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage(input);
            setInput('');
        }
    };

    // Helper to parse text and replace emojis with icons
    const parseMessageContent = (text: string) => {
        if (!text) return null;
        
        // Split by the crown emoji
        const parts = text.split('👑');
        if (parts.length === 1) return text;

        return (
            <span className="inline-flex items-center flex-wrap gap-1 align-bottom">
                {parts.map((part, index) => (
                    <React.Fragment key={index}>
                        {part}
                        {index < parts.length - 1 && (
                            <span className="inline-block -mb-1 mx-0.5">
                                <IconCrown size={16} className="text-yellow-600" fill="#FFD700" strokeWidth={2} />
                            </span>
                        )}
                    </React.Fragment>
                ))}
            </span>
        );
    };

    if (!gameState) return null;

    return (
        <div className="flex flex-col h-full gartic-card p-0 overflow-hidden bg-white">
            {/* Header */}
            <div className="p-2 border-b-2 border-dashed border-gray-300 flex justify-between items-center bg-gray-50">
                <span className="text-xs font-bold text-gray-500 font-marker">CHAT ROOM</span>
                <span className="text-xs font-bold text-ink font-hand">{gameState.messages.length} msgs</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 29px, #f0f0f0 30px)',
                backgroundSize: '100% 30px',
                backgroundAttachment: 'local'
            }}>
                {gameState.messages.map((msg, idx) => {
                    // Mesaj rengini belirle
                    let textColor = 'text-ink';
                    let bgClass = '';
                    
                    if (msg.color === 'gold') {
                        textColor = 'text-yellow-700';
                        bgClass = 'bg-yellow-50 border border-yellow-200';
                    } else if (msg.isSystemMessage) {
                        textColor = 'text-green-600'; // System messages green
                    }

                    return (
                        <div key={idx} className={`text-sm font-hand leading-[30px] px-2 rounded ${msg.isSystemMessage ? 'font-bold' : ''} ${bgClass}`}>
                            {!msg.isSystemMessage && (
                                <span className="font-bold text-ink mr-1 font-marker">{msg.sender}:</span>
                            )}
                            <span className={textColor}>
                                {parseMessageContent(msg.text)}
                            </span>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-2 bg-gray-50 border-t-2 border-dashed border-gray-300 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="gartic-input flex-1 text-sm bg-white"
                    placeholder="Type here..."
                />
                <button type="submit" className="gartic-btn text-sm px-4 py-1">
                    SEND
                </button>
            </form>
        </div>
    );
};

export default Chat;
