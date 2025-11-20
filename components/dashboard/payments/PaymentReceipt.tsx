
import React, { useEffect, useState } from 'react';
import type { Receipt, ViewType } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';

interface PaymentReceiptProps {
    isOpen: boolean;
    onClose: () => void;
    receipt: any; // Using any to allow flexible receipt data structure during simulation
    setActiveView: (view: ViewType) => void;
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({ isOpen, onClose, receipt, setActiveView }) => {
    const [animationState, setAnimationState] = useState<'init' | 'printing' | 'scanning' | 'stamping' | 'complete'>('init');

    useEffect(() => {
        if (isOpen) {
            setAnimationState('init');
            setTimeout(() => setAnimationState('printing'), 100);
            setTimeout(() => setAnimationState('scanning'), 1000);
            setTimeout(() => setAnimationState('stamping'), 2500);
            setTimeout(() => setAnimationState('complete'), 3000);
        }
    }, [isOpen]);

    if (!isOpen || !receipt) return null;

    const handleDone = () => {
        onClose();
        setActiveView('receipts'); // Navigate to history or dashboard
    };

    const handleNewTransfer = () => {
        onClose();
        // Reset logic would be handled by parent
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden">
            {/* Backdrop with Blur and Image */}
            <div className="absolute inset-0 bg-[#0f172a]/90 backdrop-blur-xl transition-opacity duration-500" onClick={onClose}>
                 <img 
                    src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop" 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
                    alt="Security Background"
                />
            </div>

            {/* Receipt Container */}
            <div className={`relative z-10 w-full max-w-md transition-all duration-700 ease-out transform ${animationState === 'init' ? 'translate-y-[100vh]' : 'translate-y-0'}`}>
                
                {/* Printer Slot Visual (Top) */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gray-800 rounded-t-xl border-t border-x border-gray-700 shadow-2xl z-20 flex items-end justify-center">
                    <div className="w-11/12 h-1 bg-black/50 rounded-full mb-1"></div>
                </div>

                {/* The Receipt Paper */}
                <div className="bg-[#fdfbf7] text-gray-800 rounded-b-xl shadow-2xl overflow-hidden relative font-mono text-sm" 
                     style={{ 
                         boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                         backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' 
                     }}>
                    
                    {/* Holographic Security Strip */}
                    <div className="h-2 w-full bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 opacity-50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite] transform -skew-x-12"></div>
                    </div>

                    {/* Header */}
                    <div className="p-8 text-center border-b-2 border-dashed border-gray-300 relative">
                         {/* Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                            <i className="fas fa-university text-9xl"></i>
                        </div>

                        <div className="w-16 h-16 mx-auto bg-[#1a365d] text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <i className="fas fa-check text-3xl"></i>
                        </div>
                        <h2 className="text-2xl font-bold uppercase tracking-widest text-[#1a365d]">Transaction<br/>Certificate</h2>
                        <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider">Authorized by Swedish Construction Bank</p>
                    </div>

                    {/* Transaction Details */}
                    <div className="p-8 space-y-4 relative">
                        {/* Scanning Animation Overlay */}
                        {animationState === 'scanning' && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-green-400/50 shadow-[0_0_15px_rgba(74,222,128,0.5)] animate-[scan_1.5s_linear_forwards] z-10"></div>
                        )}
                        
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-xs uppercase">Status</span>
                            <span className="text-green-600 font-bold uppercase flex items-center gap-1">
                                <i className="fas fa-circle text-[8px]"></i> Success
                            </span>
                        </div>

                         <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-xs uppercase">Ref ID</span>
                            <span className="font-bold">{Math.random().toString(36).substr(2, 12).toUpperCase()}</span>
                        </div>
                        
                         <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-xs uppercase">Date</span>
                            <span className="font-bold">{formatDate(new Date().toISOString())}</span>
                        </div>

                        <div className="my-4 border-t border-dashed border-gray-300"></div>

                        <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                                 {receipt.vendorLogo && <img src={receipt.vendorLogo} className="w-full h-full object-cover" />}
                             </div>
                             <div>
                                 <p className="text-xs text-gray-500 uppercase">Beneficiary</p>
                                 <p className="font-bold text-lg leading-none">{receipt.vendor.replace('Payment to ', '')}</p>
                             </div>
                        </div>

                        <div className="my-4 border-t border-dashed border-gray-300"></div>

                        <div className="flex justify-between items-end">
                            <span className="text-gray-500 text-xs uppercase">Total Amount</span>
                            <span className="text-3xl font-bold text-[#1a365d]">{formatCurrency(receipt.total)}</span>
                        </div>
                        
                        {/* Visual Map Path */}
                        <div className="mt-6 bg-blue-50 rounded-lg p-3 border border-blue-100 flex justify-between items-center">
                             <div className="flex flex-col items-center">
                                 <div className="w-2 h-2 bg-[#1a365d] rounded-full mb-1"></div>
                                 <span className="text-[8px] uppercase font-bold text-gray-500">NYC</span>
                             </div>
                             <div className="flex-grow mx-2 h-px bg-blue-300 relative">
                                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1">
                                     <i className="fas fa-plane text-blue-400 text-xs transform rotate-45"></i>
                                 </div>
                             </div>
                             <div className="flex flex-col items-center">
                                 <div className="w-2 h-2 bg-green-500 rounded-full mb-1"></div>
                                 <span className="text-[8px] uppercase font-bold text-gray-500">DEST</span>
                             </div>
                        </div>

                        {/* Stamp Animation */}
                         <div className={`absolute bottom-10 right-8 border-4 border-green-600 text-green-600 font-black text-xl px-2 py-1 rounded transform -rotate-12 opacity-0 transition-all duration-300 ${animationState === 'stamping' || animationState === 'complete' ? 'opacity-50 scale-100' : 'scale-150'}`} style={{ transitionDelay: '0.1s' }}>
                            AUTHORIZED
                        </div>
                    </div>

                    {/* Security Footer */}
                    <div className="bg-gray-100 p-4 text-[9px] text-center text-gray-400 uppercase tracking-wider border-t border-gray-200">
                        <p className="mb-1">Secure 256-bit SSL Encryption</p>
                        <p>ITCC Compliance Verified • SCB Global Network</p>
                        <div className="mt-2 flex justify-center gap-1">
                            {Array.from({length: 20}).map((_, i) => (
                                <div key={i} className="w-px h-2 bg-gray-300"></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className={`mt-6 flex gap-3 transition-opacity duration-500 ${animationState === 'complete' ? 'opacity-100' : 'opacity-0'}`}>
                    <button onClick={handleNewTransfer} className="flex-1 py-3 bg-white text-gray-800 font-bold rounded-xl shadow-lg hover:bg-gray-50 transition-colors">
                        New Transfer
                    </button>
                    <button onClick={handleDone} className="flex-1 py-3 bg-[#e6b325] text-[#1a365d] font-bold rounded-xl shadow-lg hover:bg-[#d4a017] transition-colors">
                        Done
                    </button>
                </div>
                
                <div className={`mt-4 text-center transition-opacity duration-500 ${animationState === 'complete' ? 'opacity-100' : 'opacity-0'}`}>
                     <button className="text-white/60 text-xs hover:text-white flex items-center justify-center gap-2 mx-auto">
                        <i className="fas fa-download"></i> Download PDF Receipt
                    </button>
                </div>

            </div>
            
            <style>{`
                @keyframes scan {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%) skewX(-12deg); }
                    100% { transform: translateX(100%) skewX(-12deg); }
                }
            `}</style>
        </div>
    );
};

export default PaymentReceipt;
