
import React from 'react';

const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-500 dark:text-green-400';
    if (score >= 650) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
};

const CreditScoreWidget: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 45; // r=45
    const dashoffset = circumference - (score / 850) * circumference;

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md text-center">
            <h3 className="font-bold text-xl text-[#1a365d] dark:text-white mb-4">Credit Score</h3>
            <div className="relative inline-block">
                <svg className="w-32 h-32" viewBox="0 0 100 100">
                    <circle
                        className="text-gray-200 dark:text-slate-700"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                    />
                    <circle
                        className={getScoreColor(score)}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
                    <span className="text-sm font-semibold text-gray-500 dark:text-slate-400">Excellent</span>
                </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">Updated last week</p>
        </div>
    );
};

export default CreditScoreWidget;