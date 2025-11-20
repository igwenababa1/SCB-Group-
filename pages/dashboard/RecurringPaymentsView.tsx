

import React, { useState, useMemo, useEffect } from 'react';
import { RECURRING_PAYMENTS } from '../../constants';
import type { RecurringPayment } from '../../types';
import RecurringPaymentItem from '../../components/dashboard/payments/RecurringPaymentItem';
import SetupRecurringPaymentModal from '../../components/dashboard/payments/SetupRecurringPaymentModal';
import { formatCurrency, formatDate } from '../../utils/formatters';

const StandingOrderProcessor: React.FC<{ isOpen: boolean, action: string, onClose: () => void }> = ({ isOpen, action, onClose }) => {
    const [step, setStep] = useState(0);
    const steps = [
        "Authenticating Request...",
        "Connecting to Interbank Standing Order Gateway...",
        `Processing ${action} Instruction...`,
        "Updating Ledger...",
        "Confirmation Received."
    ];

    useEffect(() => {
        if (isOpen) {
            setStep(0);
            const interval = setInterval(() => {
                setStep(prev => {
                    if (prev >= steps.length - 1) {
                        clearInterval(interval);
                        setTimeout(onClose, 800);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isOpen, onClose, action]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
                <div className="p-8 flex flex-col items-center text-center">
                    <div className="relative w-20 h-20 mb-6">
                        <div className="absolute inset-0 border-4 border-blue-900/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-blue-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                        <i className="fas fa-satellite-dish text-2xl text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Processing Request</h3>
                    <p className="text-blue-300 font-mono text-sm mb-6">REF: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                    
                    <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4 overflow-hidden">
                        <div 
                            className="bg-blue-500 h-full transition-all duration-500 ease-out" 
                            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                        ></div>
                    </div>
                    
                    <p className="text-gray-400 text-xs h-4 fade-in">{steps[step]}</p>
                </div>
            </div>
        </div>
    );
};

const PaymentTimeline: React.FC<{ payments: RecurringPayment[] }> = ({ payments }) => {
    const today = new Date();
    const dates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() + i);
        return d;
    });

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 overflow-x-auto scrollbar-hide">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">14-Day Forecast</h3>
            <div className="flex justify-between min-w-[800px] relative">
                {/* Timeline Line */}
                <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-700/50"></div>
                
                {dates.map((date, i) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const paymentsOnDate = payments.filter(p => p.nextDate === dateStr);
                    const hasPayment = paymentsOnDate.length > 0;
                    const isToday = i === 0;

                    return (
                        <div key={i} className="flex flex-col items-center relative z-10 group">
                            <span className={`text-[10px] mb-3 font-medium ${isToday ? 'text-blue-400' : 'text-gray-500'}`}>
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                            
                            <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                                hasPayment 
                                    ? 'bg-yellow-400 border-yellow-400 scale-125 shadow-[0_0_10px_rgba(250,204,21,0.5)]' 
                                    : isToday 
                                        ? 'bg-blue-500 border-blue-500' 
                                        : 'bg-[#0f172a] border-gray-600'
                            }`}></div>
                            
                            <span className={`text-xs mt-3 font-bold ${hasPayment ? 'text-white' : 'text-gray-600'}`}>
                                {date.getDate()}
                            </span>

                            {hasPayment && (
                                <div className="absolute top-14 left-1/2 -translate-x-1/2 w-max bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 z-20">
                                    {paymentsOnDate.map(p => (
                                        <div key={p.id} className="whitespace-nowrap">
                                            {p.recipient} - {formatCurrency(p.amount)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const RecurringPaymentsView: React.FC = () => {
    const [payments, setPayments] = useState<RecurringPayment[]>(RECURRING_PAYMENTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState<RecurringPayment | null>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all');
    
    // Simulation State
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingAction, setProcessingAction] = useState('');
    const [pausedIds, setPausedIds] = useState<Set<string>>(new Set());
    
    const [remindersEnabled, setRemindersEnabled] = useState(true);
    const [showReminderToast, setShowReminderToast] = useState(false);

    const handleToggleReminders = () => {
        setRemindersEnabled(!remindersEnabled);
        setShowReminderToast(true);
        setTimeout(() => setShowReminderToast(false), 3000);
    };

    const handleOpenModal = (payment: RecurringPayment | null = null) => {
        setEditingPayment(payment);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingPayment(null);
        setIsModalOpen(false);
    };

    const handleSavePayment = (payment: RecurringPayment) => {
        setIsProcessing(true);
        setProcessingAction(editingPayment ? "Modification" : "Setup");
        
        // Wait for processor to close (handled by StandingOrderProcessor's interval + timeout)
        setTimeout(() => {
            if (editingPayment) {
                setPayments(payments.map(p => p.id === payment.id ? payment : p));
            } else {
                setPayments(prev => [...prev, { ...payment, id: `rec-${Date.now()}` }].sort((a,b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime()));
            }
            handleCloseModal();
            setIsProcessing(false); // Reset processing state here manually if needed or rely on component unmount logic
        }, 5000); // Sync with processor animation duration
    };

    const handleDeletePayment = (id: string) => {
        if (window.confirm('Are you sure you want to cancel this standing order? This requires bank verification.')) {
             setIsProcessing(true);
             setProcessingAction("Cancellation");
             setTimeout(() => {
                setPayments(payments.filter(p => p.id !== id));
                setIsProcessing(false);
             }, 5000);
        }
    };
    
    const handleTogglePause = (id: string) => {
        const isPaused = pausedIds.has(id);
        const action = isPaused ? "Resuming" : "Pausing";
        setIsProcessing(true);
        setProcessingAction(action);
        
        setTimeout(() => {
            setPausedIds(prev => {
                const newSet = new Set(prev);
                if (newSet.has(id)) {
                    newSet.delete(id);
                } else {
                    newSet.add(id);
                }
                return newSet;
            });
            setIsProcessing(false);
        }, 5000);
    };

    // Metrics
    const totalMonthly = payments.reduce((sum, p) => sum + p.amount, 0);
    const nextPayment = [...payments].sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime())[0];

    const filteredPayments = payments.filter(p => {
        if (filter === 'active') return !pausedIds.has(p.id);
        if (filter === 'paused') return pausedIds.has(p.id);
        return true;
    });

    return (
        <div className="relative min-h-full bg-[#0b1120] text-white p-8">
             {/* Sophisticated Background */}
            <div 
                className="absolute inset-0 z-0 opacity-40"
                style={{ 
                    backgroundImage: "url('https://images.unsplash.com/photo-1634117622592-114e3024ff27?q=80&w=2532&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b1120]/80 via-[#0b1120]/95 to-[#0b1120]"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header & Metrics */}
                <div className="flex flex-col lg:flex-row justify-between items-end mb-10 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-bold text-white tracking-tight">Standing Orders</h1>
                            <button 
                                onClick={handleToggleReminders}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border ${remindersEnabled ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-transparent text-gray-400 border-gray-500 hover:border-yellow-400 hover:text-yellow-400'}`}
                                title={remindersEnabled ? "Reminders Enabled" : "Turn on Reminders"}
                            >
                                <i className={`fas ${remindersEnabled ? 'fa-bell' : 'fa-bell-slash'} text-sm`}></i>
                            </button>
                        </div>
                        <p className="text-gray-400">Automated clearing house (ACH) & recurring transfer management.</p>
                    </div>
                    
                    <div className="flex gap-4 w-full lg:w-auto">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex-1 lg:w-48">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Monthly Outflow</p>
                            <p className="text-2xl font-mono font-bold text-white">{formatCurrency(totalMonthly)}</p>
                            <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                                <div className="bg-blue-500 h-1 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex-1 lg:w-48">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Next Debit</p>
                            <p className="text-lg font-bold text-white truncate">{nextPayment?.recipient || 'None'}</p>
                            <p className="text-xs text-yellow-400 mt-1">{nextPayment ? formatDate(nextPayment.nextDate) : '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <PaymentTimeline payments={payments} />

                {/* Controls & List */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                        {(['all', 'active', 'paused'] as const).map(f => (
                             <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-yellow-400 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="px-6 py-2 rounded-lg bg-[#1a365d] border border-blue-500/30 text-blue-300 font-bold hover:bg-blue-900/50 hover:text-white transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
                    >
                        <i className="fas fa-plus"></i> Setup New
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPayments.map(payment => (
                        <RecurringPaymentItem 
                            key={payment.id} 
                            payment={payment} 
                            isPaused={pausedIds.has(payment.id)}
                            onEdit={() => handleOpenModal(payment)} 
                            onDelete={() => handleDeletePayment(payment.id)}
                            onTogglePause={() => handleTogglePause(payment.id)}
                            variant="card" 
                        />
                    ))}
                    
                    {/* Add New Placeholder Card */}
                    <button 
                        onClick={() => handleOpenModal()}
                        className="border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center p-8 text-gray-500 hover:border-yellow-400 hover:text-yellow-400 hover:bg-white/5 transition-all min-h-[200px] group"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <i className="fas fa-plus text-2xl"></i>
                        </div>
                        <span className="font-bold">Add Schedule</span>
                    </button>
                </div>
            </div>

            <SetupRecurringPaymentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSavePayment}
                payment={editingPayment}
            />
            
            <StandingOrderProcessor 
                isOpen={isProcessing} 
                action={processingAction}
                onClose={() => setIsProcessing(false)} 
            />
            
            {/* Reminder Toast */}
            {showReminderToast && (
                <div className="fixed bottom-8 right-8 bg-white text-gray-900 px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-fade-in-status-item">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${remindersEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        <i className={`fas ${remindersEnabled ? 'fa-bell' : 'fa-bell-slash'}`}></i>
                    </div>
                    <div>
                        <p className="font-bold text-sm">{remindersEnabled ? 'Reminders Enabled' : 'Reminders Disabled'}</p>
                        <p className="text-xs text-gray-500">{remindersEnabled ? 'You will be notified 2 days before debit.' : 'Automatic notifications turned off.'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecurringPaymentsView;