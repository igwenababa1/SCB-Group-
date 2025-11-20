
import React, { useEffect, useState } from 'react';
import type { Receipt, ViewType } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';

interface ReceiptDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    receipt: Receipt;
    setActiveView: (view: ViewType) => void;
}

const ReceiptDetailModal: React.FC<ReceiptDetailModalProps> = ({ isOpen, onClose, receipt }) => {
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setIsScanning(true);
            const timer = setTimeout(() => setIsScanning(false), 2500); // Scan animation duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[60] transition-opacity p-4"
            onClick={onClose}
        >
            {/* Scanning Line Animation Style */}
            <style>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .scan-line {
                    width: 100%;
                    height: 2px;
                    background: #00ffcc;
                    box-shadow: 0 0 10px #00ffcc, 0 0 20px #00ffcc;
                    position: absolute;
                    z-index: 20;
                    animation: scan 2s linear infinite;
                }
                .zig-zag-bottom {
                    background: linear-gradient(-45deg, transparent 16px, #f3f4f6 0), linear-gradient(45deg, transparent 16px, #f3f4f6 0);
                    background-repeat: repeat-x;
                    background-position: left bottom;
                    background-size: 22px 32px;
                    height: 32px;
                    width: 100%;
                    position: absolute;
                    bottom: -32px;
                    left: 0;
                }
                .dark .zig-zag-bottom {
                    background: linear-gradient(-45deg, transparent 16px, #ffffff 0), linear-gradient(45deg, transparent 16px, #ffffff 0);
                }
            `}</style>

            <div 
                className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col md:flex-row overflow-hidden" 
                onClick={e => e.stopPropagation()}
            >
                {/* Left Side: Digital Receipt Simulation */}
                <div className="w-full md:w-1/2 bg-[#1e293b] relative flex items-center justify-center p-8 overflow-y-auto">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
                    
                    {/* The Receipt Paper */}
                    <div className="relative bg-white text-gray-800 w-full max-w-sm shadow-2xl transform transition-transform duration-500 hover:scale-[1.02]">
                        {/* Scanning Overlay */}
                        {isScanning && (
                            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                                <div className="scan-line"></div>
                                <div className="absolute inset-0 bg-green-500/10"></div>
                            </div>
                        )}

                        <div className="p-8 pb-12 relative">
                            {/* Logo Watermark */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                                <img src={receipt.vendorLogo} className="w-48 h-48 grayscale" />
                            </div>

                            <div className="text-center mb-8 border-b-2 border-dashed border-gray-300 pb-6">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-800 p-1">
                                    <img src={receipt.vendorLogo} className="w-full h-full rounded-full object-contain" />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-widest text-gray-900">{receipt.vendor}</h2>
                                <p className="text-xs font-mono text-gray-500 mt-1">MERCHANT ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                                <p className="text-xs font-mono text-gray-500">{formatDate(receipt.date)} • {new Date(receipt.date).toLocaleTimeString()}</p>
                            </div>

                            <div className="space-y-3 mb-8 font-mono text-sm">
                                {receipt.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-start">
                                        <div>
                                            <span className="font-bold">{item.name}</span>
                                            <div className="text-xs text-gray-500">Qty: {item.quantity} @ {formatCurrency(item.price)}</div>
                                        </div>
                                        <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t-2 border-gray-800 pt-4 mb-6">
                                <div className="flex justify-between font-mono text-lg font-black">
                                    <span>TOTAL</span>
                                    <span>{formatCurrency(receipt.total)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Tax (Inc.)</span>
                                    <span>{formatCurrency(receipt.total * 0.08)}</span>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="inline-block border-2 border-gray-800 p-2 rounded mb-2">
                                     <i className="fas fa-qrcode text-4xl"></i>
                                </div>
                                <p className="text-[10px] font-mono text-gray-400 uppercase">Scan for verification</p>
                                <p className="text-[10px] font-mono text-gray-400 uppercase mt-4">Thank you for your business</p>
                            </div>
                        </div>
                        
                        {/* Jagged Edge Bottom */}
                        <div className="zig-zag-bottom"></div>
                    </div>
                </div>

                {/* Right Side: Metadata & Actions */}
                <div className="w-full md:w-1/2 flex flex-col bg-[#0f172a] border-l border-white/10">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h3 className="text-white font-bold flex items-center gap-2">
                            <i className="fas fa-database text-yellow-400"></i> Transaction Metadata
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                        {/* Map Placeholder */}
                        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden h-48 relative group">
                            <img 
                                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1748&auto=format&fit=crop" 
                                alt="Location Map" 
                                className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white shadow-lg animate-bounce flex items-center justify-center text-white">
                                    <i className="fas fa-map-marker-alt text-sm"></i>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-xs text-gray-300 font-mono">
                                <i className="fas fa-location-arrow mr-1"></i> 40.7128° N, 74.0060° W
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Category</p>
                                <p className="text-white text-sm font-semibold">{receipt.category}</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status</p>
                                <p className="text-green-400 text-sm font-semibold flex items-center gap-1">
                                    <i className="fas fa-check-circle"></i> Verified
                                </p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Payment Method</p>
                                <p className="text-white text-sm font-semibold">Visa •••• 4242</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Ref ID</p>
                                <p className="text-white text-xs font-mono truncate">{receipt.id}</p>
                            </div>
                        </div>
                        
                        {/* Tax Info */}
                        <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl flex items-start gap-3">
                            <i className="fas fa-info-circle text-blue-400 mt-1"></i>
                            <div>
                                <p className="text-sm font-bold text-blue-200">Tax Deductible Potential</p>
                                <p className="text-xs text-blue-300/70 mt-1">This transaction is categorized under "{receipt.category}" and may be eligible for business expense deduction.</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-6 bg-black/20 border-t border-white/10 grid grid-cols-2 gap-3">
                         <button className="py-3 rounded-lg bg-white text-[#0f172a] font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                            <i className="fas fa-file-pdf"></i> Download PDF
                        </button>
                         <button className="py-3 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 border border-white/10 transition-colors flex items-center justify-center gap-2">
                            <i className="fas fa-envelope"></i> Email
                        </button>
                        <button className="col-span-2 py-3 rounded-lg text-red-400 hover:bg-red-900/20 border border-transparent hover:border-red-900/50 transition-colors text-sm font-semibold">
                            Report Issue or Dispute
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptDetailModal;
