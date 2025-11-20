
import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../../utils/formatters';

interface ScanPayModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ScanPayModal: React.FC<ScanPayModalProps> = ({ isOpen, onClose }) => {
    const [state, setState] = useState<'scanning' | 'detected' | 'confirming' | 'success'>('scanning');
    const [amount, setAmount] = useState('15.50');
    
    useEffect(() => {
        if (isOpen) {
            setState('scanning');
            const timer = setTimeout(() => setState('detected'), 2500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleConfirm = () => {
        setState('confirming');
        setTimeout(() => setState('success'), 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black z-[70] flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
                <button onClick={onClose} className="text-white hover:text-gray-300"><i className="fas fa-times text-2xl"></i></button>
                <span className="text-white font-bold uppercase tracking-widest text-sm">Scan QR Code</span>
                <button className="text-white hover:text-yellow-400"><i className="fas fa-bolt text-xl"></i></button>
            </div>

            <div className="flex-grow relative flex items-center justify-center bg-gray-900 overflow-hidden">
                {state === 'scanning' && (
                    <>
                         <div className="absolute inset-0 pointer-events-none">
                             <img src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-30" />
                         </div>
                        <div className="relative w-64 h-64 border-2 border-white/30 rounded-xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-green-400/50 to-transparent animate-[scan_2s_linear_infinite]"></div>
                            
                            {/* Corners */}
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-400"></div>
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-400"></div>
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-400"></div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-400"></div>
                        </div>
                        <p className="absolute bottom-24 text-white/80 text-sm animate-pulse">Searching for merchant code...</p>
                    </>
                )}

                {(state === 'detected' || state === 'confirming') && (
                    <div className="bg-white dark:bg-gray-800 w-full max-w-sm mx-4 rounded-2xl p-6 shadow-2xl animate-fade-in-scale-up relative z-20">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl">
                                <i className="fas fa-coffee"></i>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-bold">Merchant Detected</p>
                                <h3 className="text-xl font-bold dark:text-white">Starbucks Coffee</h3>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-xs text-gray-500 font-bold uppercase mb-1">Amount</label>
                            <div className="relative">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
                                <input 
                                    type="number" 
                                    value={amount} 
                                    onChange={e => setAmount(e.target.value)} 
                                    className="w-full bg-transparent border-b-2 border-gray-200 dark:border-gray-600 text-3xl font-bold text-gray-800 dark:text-white pl-6 py-2 focus:outline-none focus:border-green-500"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleConfirm} 
                            disabled={state === 'confirming'}
                            className="w-full py-4 rounded-xl bg-green-500 text-white font-bold shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                        >
                            {state === 'confirming' ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-check"></i>}
                            {state === 'confirming' ? 'Processing...' : 'Pay Now'}
                        </button>
                    </div>
                )}

                {state === 'success' && (
                     <div className="text-center text-white animate-fade-in-scale-up">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(34,197,94,0.5)]">
                            <i className="fas fa-check text-5xl"></i>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Payment Sent</h2>
                        <p className="text-gray-300 text-lg mb-8">{formatCurrency(parseFloat(amount))} to Starbucks</p>
                        <button onClick={onClose} className="px-8 py-3 rounded-full bg-white text-green-600 font-bold hover:bg-gray-100 transition-colors">
                            Done
                        </button>
                    </div>
                )}
            </div>
            
            <style>{`
                @keyframes scan {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
            `}</style>
        </div>
    );
};

export default ScanPayModal;
