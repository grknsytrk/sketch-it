import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { IconCrown, IconTarget, IconChat } from './Icons';

const Chat: React.FC = () => {
    const { gameState, sendMessage, myPlayerId } = useGameStore();
    const [input, setInput] = useState('');
    const [activeTab, setActiveTab] = useState<'answer' | 'chat'>('answer');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [gameState?.messages]);

    // Check if current player is the drawer
    const isDrawer = gameState?.players[gameState.currentDrawer]?.id === myPlayerId;

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            // If in chat mode, prefix with [CHAT] so server can differentiate
            const message = activeTab === 'chat' ? `[CHAT] ${input}` : input;
            sendMessage(message);
            setInput('');
        }
    };

    // Helper to parse text and replace emojis with icons
    const parseMessageContent = (text: string) => {
        if (!text) return null;

        // Remove [CHAT] prefix for display
        const displayText = text.replace(/^\[CHAT\]\s*/, '');

        // Split by the crown emoji
        const parts = displayText.split('👑');
        if (parts.length === 1) return displayText;

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

    // Filter messages based on active tab
    const filteredMessages = gameState?.messages.filter(msg => {
        if (activeTab === 'chat') {
            // In chat tab, show only [CHAT] messages and system messages
            return msg.text.startsWith('[CHAT]') || msg.isSystemMessage;
        } else {
            // In answer tab, show everything except [CHAT] messages
            return !msg.text.startsWith('[CHAT]');
        }
    }) || [];

    if (!gameState) return null;

    return (
        <div className="flex flex-col h-full gartic-card p-0 overflow-hidden bg-white">
            {/* Header with Tabs */}
            <div className="border-b-2 border-dashed border-gray-300 bg-gray-50">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('answer')}
                        className={`flex-1 py-2 px-3 text-xs font-bold font-marker transition-all ${activeTab === 'answer'
                            ? 'text-ink bg-white border-b-2 border-ink -mb-[2px]'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <IconTarget size={14} className="inline-block mr-1 -mt-0.5" /> ANSWER
                    </button>
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`flex-1 py-2 px-3 text-xs font-bold font-marker transition-all ${activeTab === 'chat'
                            ? 'text-ink bg-white border-b-2 border-ink -mb-[2px]'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <IconChat size={14} className="inline-block mr-1 -mt-0.5" /> CHAT
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 29px, #f0f0f0 30px)',
                backgroundSize: '100% 30px',
                backgroundAttachment: 'local'
            }}>
                {filteredMessages.map((msg, idx) => {
                    // Mesaj rengini belirle
                    let textColor = 'text-ink';
                    let bgClass = '';

                    if (msg.color === 'gold') {
                        textColor = 'text-yellow-700';
                        bgClass = 'bg-yellow-50 border border-yellow-200';
                    } else if (msg.color === 'green') {
                        textColor = 'text-green-600';
                        bgClass = 'bg-green-50 border border-green-200';
                    } else if (msg.isSystemMessage) {
                        textColor = 'text-green-600';
                    }

                    // Check if it's a chat message
                    const isChatMsg = msg.text.startsWith('[CHAT]');

                    return (
                        <div key={idx} className={`text-sm font-hand leading-[30px] px-2 rounded ${msg.isSystemMessage ? 'font-bold' : ''} ${bgClass}`}>
                            {!msg.isSystemMessage && (
                                <span className="font-bold text-ink mr-1 font-marker">
                                    {isChatMsg && <IconChat size={12} className="inline-block mr-1 text-blue-500" />}
                                    {msg.sender}:
                                </span>
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
                    placeholder={activeTab === 'answer'
                        ? (isDrawer ? "You're drawing!" : "Type your guess...")
                        : "Chat with others..."
                    }
                    disabled={activeTab === 'answer' && isDrawer && gameState.gameStarted && !!gameState.currentWord}
                />
                <button
                    type="submit"
                    className={`gartic-btn text-sm px-4 py-1 ${activeTab === 'chat' ? 'bg-blue-100' : ''}`}
                    disabled={activeTab === 'answer' && isDrawer && gameState.gameStarted && !!gameState.currentWord}
                >
                    {activeTab === 'answer' ? 'GUESS' : 'SEND'}
                </button>
            </form>
        </div>
    );
};

export default Chat;
