
import React from 'react';
import type { RecurringPayment } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';

interface RecurringPaymentItemProps {
    payment: RecurringPayment;
    isPaused?: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onTogglePause?: () => void;
    variant?: 'default' | 'overlay' | 'card';
}

const RecurringPaymentItem: React.FC<RecurringPaymentItemProps> = ({ payment, isPaused = false, onEdit, onDelete, onTogglePause, variant = 'default' }) => {
    const categoryIcons: { [key: string]: string } = {
        'Utilities': 'fa-lightbulb',
        'Rent': 'fa-home',
        'Subscription': 'fa-sync-alt',
        'Loan': 'fa-landmark',
        'Other': 'fa-receipt',
    };
    
    const icon = categoryIcons[payment.category] || categoryIcons['Other'];
    
    // Calculate cycle progress (simulated based on monthly assumption)
    const nextDate = new Date(payment.nextDate);
    const today = new Date();
    const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    const cycleLength = 30; // Approximate
    const progress = Math.max(0, Math.min(100, ((cycleLength - daysUntil) / cycleLength) * 100));
    
    if (variant === 'card') {
        return (
            <div className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 group ${isPaused ? 'bg-gray-900/40 border-gray-700 grayscale-[0.5]' : 'bg-white/5 border-white/10 hover:border-yellow-400/30 hover:bg-white/10 hover:shadow-2xl'}`}>
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                    <span className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${isPaused ? 'bg-gray-800 text-gray-400 border-gray-600' : 'bg-green-500/10 text-green-400 border-green-500/30'}`}>
                        {isPaused ? (
                            <>
                                <i className="fas fa-pause-circle"></i> Paused
                            </>
                        ) : (
                            <>
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Active
                            </>
                        )}
                    </span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg text-2xl ${isPaused ? 'bg-gray-800 text-gray-500' : 'bg-gradient-to-br from-[#1a365d] to-[#2d5c8a] text-white'}`}>
                        <i className={`fas ${icon}`}></i>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white leading-tight">{payment.recipient}</h4>
                        <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wider">{payment.category}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Amount</p>
                            <p className="text-2xl font-mono font-bold text-white">{formatCurrency(payment.amount)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Next Debit</p>
                            <p className={`text-sm font-bold ${daysUntil <= 3 ? 'text-yellow-400' : 'text-white'}`}>
                                {formatDate(payment.nextDate)}
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative pt-2">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1 uppercase font-bold">
                            <span>Billing Cycle</span>
                            <span>{daysUntil} days left</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ${isPaused ? 'bg-gray-500' : 'bg-blue-500'}`} 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                     <button 
                        onClick={onTogglePause} 
                        className={`text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${isPaused ? 'text-green-400 hover:text-green-300' : 'text-yellow-400 hover:text-yellow-300'}`}
                    >
                        <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'}`}></i>
                        {isPaused ? 'Resume' : 'Pause'}
                    </button>
                    
                    <div className="flex gap-3">
                        <button onClick={onEdit} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors" title="Edit">
                            <i className="fas fa-pen text-xs"></i>
                        </button>
                        <button onClick={onDelete} className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors" title="Cancel">
                            <i className="fas fa-trash text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Fallback for list/overlay variants
    const containerClasses = variant === 'overlay'
        ? "bg-white/5 hover:bg-white/10 border border-white/5 text-white"
        : "bg-white hover:shadow-md border border-gray-100 text-gray-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700/80";
        
    const iconContainerClasses = variant === 'overlay'
        ? "bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 group-hover:text-yellow-400"
        : "bg-gray-100 text-gray-500 group-hover:text-[#1a365d] dark:bg-slate-700 dark:text-gray-400 dark:group-hover:text-yellow-400";

    const subTextClasses = variant === 'overlay' ? "text-gray-400" : "text-gray-500 dark:text-gray-400";
    const buttonClasses = variant === 'overlay' ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-[#1a365d] dark:hover:text-white";

    return (
        <div className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${containerClasses}`}>
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center shadow-inner transition-colors ${iconContainerClasses}`}>
                    <i className={`fas ${icon}`}></i>
                </div>
                <div>
                    <p className="font-bold text-base">{payment.recipient}</p>
                    <p className={`text-xs mt-0.5 flex items-center gap-1 ${subTextClasses}`}>
                        <span className="capitalize">{payment.frequency}</span>
                        <span className="w-1 h-1 bg-current rounded-full opacity-50"></span>
                        <span>Next: {formatDate(payment.nextDate)}</span>
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                 <p className="font-mono font-bold text-lg">{formatCurrency(payment.amount)}</p>
                 <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={onEdit} className={`text-xs transition-colors ${buttonClasses}`} title="Edit">
                        <i className="fas fa-pen"></i>
                    </button>
                    <button onClick={onDelete} className="text-xs text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                        <i className="fas fa-trash"></i>
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default RecurringPaymentItem;
