
import React from 'react';

interface QuickActionButtonProps {
    icon: string;
    label: string;
    onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, label, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="group relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1"
        >
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 transition-all duration-300 group-hover:shadow-xl group-hover:bg-white/90 dark:group-hover:bg-slate-800/80"></div>
            <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-[#1a365d] to-[#2d5c8a] flex items-center justify-center shadow-inner mb-3 group-hover:scale-110 transition-transform duration-300">
                <i className={`fas ${icon} text-yellow-400 text-xl`}></i>
            </div>
            <span className="relative z-10 font-semibold text-gray-700 dark:text-gray-200 text-sm group-hover:text-[#1a365d] dark:group-hover:text-white transition-colors">{label}</span>
        </button>
    );
};

export default QuickActionButton;