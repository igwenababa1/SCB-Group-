
import React, { useState } from 'react';
import type { Card } from '../../../types';

interface CardDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    card: Card;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ isOpen, onClose, card }) => {
    const [showCvv, setShowCvv] = useState(false);
    const [showNumber, setShowNumber] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    if (!isOpen) return null;

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(label);
        setTimeout(() => setCopySuccess(''), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <i className="fas fa-shield-alt text-green-400"></i> Secure Details
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><i className="fas fa-times"></i></button>
                </div>
                
                <div className="p-8 space-y-6">
                    {/* Card Preview */}
                    <div className="relative h-48 rounded-xl overflow-hidden shadow-lg mb-8 group">
                        <img src={card.imageUrl} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                        <div className="absolute inset-0 p-6 flex flex-col justify-between">
                            <div className="flex justify-between text-white/80">
                                <span className="font-bold">Swedish Construction Bank</span>
                                <i className={`fab fa-cc-${card.type.toLowerCase()} text-2xl`}></i>
                            </div>
                            <div className="text-white text-shadow-lg">
                                <p className="font-mono text-xl tracking-widest mb-2">
                                    {showNumber ? card.number : `•••• •••• •••• ${card.number.slice(-4)}`}
                                </p>
                                <div className="flex justify-between text-sm font-medium">
                                    <span>{card.nameOnCard}</span>
                                    <span>{card.expiry}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details Fields */}
                    <div className="space-y-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Card Number</p>
                                <p className="text-white font-mono">{showNumber ? card.number : `•••• •••• •••• ${card.number.slice(-4)}`}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setShowNumber(!showNumber)} className="p-2 text-gray-400 hover:text-white">
                                    <i className={`fas ${showNumber ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                                <button onClick={() => handleCopy(card.number, 'Number')} className="p-2 text-gray-400 hover:text-yellow-400">
                                    <i className="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                             <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">CVV / CVC</p>
                                    <p className="text-white font-mono">{showCvv ? '482' : '•••'}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => setShowCvv(!showCvv)} className="p-2 text-gray-400 hover:text-white">
                                        <i className={`fas ${showCvv ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>
                             <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">PIN Status</p>
                                    <p className="text-green-400 font-bold text-sm"><i className="fas fa-check-circle"></i> Set</p>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-blue-400 text-xs">Reset</button>
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Billing Address</p>
                            <p className="text-white text-sm">123 Banking Ave, New York, NY 10001</p>
                        </div>
                    </div>

                    {copySuccess && (
                        <div className="text-center text-green-400 text-sm font-bold animate-pulse">
                            <i className="fas fa-check mr-2"></i> {copySuccess} Copied to Clipboard
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardDetailsModal;
