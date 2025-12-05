import React from 'react';
import { IconX, IconCheck, IconWarning } from './Icons';

interface NotificationProps {
    message: string;
    type: 'error' | 'success' | 'info';
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    const bgMap = {
        error: 'bg-red-100 border-red-400 text-red-700',
        success: 'bg-green-100 border-green-400 text-green-700',
        info: 'bg-yellow-100 border-yellow-400 text-yellow-700'
    };

    const iconMap = {
        error: <IconX size={20} className="text-red-600 flex-shrink-0" />,
        success: <IconCheck size={20} className="text-green-600 flex-shrink-0" />,
        info: <IconWarning size={20} className="text-yellow-600 flex-shrink-0" />
    };

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
            <div className={`p-4 min-w-[300px] shadow-sketch transform -rotate-1 ${bgMap[type]}`}
                style={{
                    borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                    borderWidth: '2px',
                    borderStyle: 'solid'
                }}>
                <div className="flex justify-between items-center gap-3">
                    {iconMap[type]}
                    <span className="text-lg font-bold font-hand flex-1">{message}</span>
                    <button onClick={onClose} className="text-ink hover:text-gray-600 font-bold font-marker text-xl">X</button>
                </div>
            </div>
        </div>
    );
};

export default Notification;
