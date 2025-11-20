
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
    const [animationState, setAnimationState] = useState<'init' | 'generating' | 'signing' | 'sealing' | 'complete'>('init');
    const [hashString, setHashString] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAnimationState('init');
            setHashString('');
            
            // Animation Sequence
            setTimeout(() => setAnimationState('generating'), 300);
            
            // Simulate Hash Generation
            setTimeout(() => {
                setAnimationState('signing');
                let result = '';
                const characters = 'ABCDEF0123456789';
                const interval = setInterval(() => {
                    result = '';
                    for (let i = 0; i < 64; i++) {
                        result += characters.charAt(Math.floor(Math.random() * characters.length));
                    }
                    setHashString(result);
                }, 50);
                
                setTimeout(() => {
                    clearInterval(interval);
                    setHashString(`0x${Array.from({length:60}, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('')}`); // Final static hash
                    setAnimationState('sealing');
                }, 1500);
            }, 1500);

            setTimeout(() => setAnimationState('complete'), 4000);
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

    // Mock Data for Professional Look
    const uetr = `54a9-9f03-${Math.floor(Math.random() * 10000)}-899a-12e4`;
    const valueDate = new Date().toISOString().split('T')[0];
    const settlementChannel = receipt.category === 'Wire Transfer' ? 'SWIFT gpi' : 'Instant SEPA / ACH';
    const docId = `DOC-${Math.floor(Math.random() * 1000000)}-${new Date().getFullYear()}`;
    const cleanVendor = receipt.vendor.replace('Payment to ', '').replace('Transfer to ', '');

    const handlePrint = () => {
        setIsDownloading(true);
        setTimeout(() => {
            window.print();
            setIsDownloading(false);
        }, 500);
    };

    const handleShare = async () => {
        const shareData = {
            title: 'SCB Transaction Certificate',
            text: `Official Payment Receipt for ${formatCurrency(receipt.total)} to ${cleanVendor}. Ref: ${receipt.id}`,
            url: window.location.href // Mock URL
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share canceled');
            }
        } else {
            // Fallback
            navigator.clipboard.writeText(`SCB Receipt: Transaction ${receipt.id} - ${uetr}`);
            alert("Secure receipt link copied to clipboard.");
        }
    };

    const toggleFocusMode = () => {
        setIsFocusMode(!isFocusMode);
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden receipt-modal-overlay">
            {/* Print Styles */}
            <style>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body * { visibility: hidden; }
                    .receipt-modal-overlay, .receipt-right-panel, .receipt-actions, .no-print { display: none !important; }
                    #receipt-document, #receipt-document * { visibility: visible; }
                    #receipt-document {
                        position: fixed;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        padding: 20px 40px;
                        background: white !important;
                        color: black !important;
                        box-shadow: none !important;
                        overflow: visible !important;
                        border: none !important;
                        z-index: 9999;
                        transform: none !important;
                        display: flex !important;
                        flex-direction: column;
                    }
                    .print-footer { position: fixed; bottom: 20px; left: 40px; right: 40px; }
                    /* Force background graphics */
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
                
                /* Scan Line Animation */
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
            `}</style>

            {/* Immersive Backdrop */}
            <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl transition-opacity duration-700 no-print" onClick={onClose}>
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            </div>

            {/* Main Container */}
            <div className={`relative z-20 w-full ${isFocusMode ? 'max-w-6xl h-[95vh]' : 'max-w-4xl h-[90vh]'} flex flex-col md:flex-row bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-500 transform ${animationState === 'init' ? 'scale-90 opacity-0 translate-y-20' : 'scale-100 opacity-100 translate-y-0'}`}>
                
                {/* Left Side: The Certificate (Paper) */}
                <div 
                    id="receipt-document"
                    className={`flex-grow relative bg-[#fffdfa] text-[#1e293b] flex flex-col p-0 overflow-hidden w-full ${isFocusMode ? 'md:w-full' : 'md:w-2/3'} shadow-[inset_-10px_0_20px_rgba(0,0,0,0.05)] transition-all duration-500`}
                >
                    {/* Focus Toggle (Desktop) */}
                    <button onClick={toggleFocusMode} className="absolute top-4 right-4 z-50 text-gray-400 hover:text-[#1a365d] no-print hidden md:block" title={isFocusMode ? "Collapse" : "Expand Full View"}>
                        <i className={`fas ${isFocusMode ? 'fa-compress' : 'fa-expand'}`}></i>
                    </button>

                    {/* Security Background Pattern */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.04]" 
                         style={{ 
                             backgroundImage: 'radial-gradient(circle at 50% 50%, #1a365d 1px, transparent 1px)', 
                             backgroundSize: '20px 20px' 
                         }}>
                    </div>
                    
                    {/* Top Decorative Strip */}
                    <div className="absolute top-0 left-0 w-full h-3 bg-[#1a365d] flex items-center justify-between px-4 print:px-0">
                        <span className="text-[8px] text-white/50 font-mono tracking-[0.5em]">OFFICIAL DOCUMENT</span>
                        <span className="text-[8px] text-white/50 font-mono tracking-[0.5em]">SCB SECURE</span>
                    </div>

                    {/* Header */}
                    <div className="p-8 pt-10 border-b border-gray-200 relative z-10 flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#1a365d] text-white rounded-lg flex items-center justify-center shadow-xl border-2 border-[#e6b325] print:shadow-none print:border-black">
                                <i className="fas fa-university text-2xl"></i>
                            </div>
                            <div>
                                <h1 className="text-2xl font-serif font-bold text-[#1a365d] tracking-wide">SCB Group</h1>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Global Transaction Services</p>
                                <p className="text-[9px] text-gray-400 mt-1">123 Financial District, Stockholm, Sweden</p>
                                <p className="text-[9px] text-gray-400">SWIFT: SCBSEMM • +46 (0) 8 123 45 67</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-lg font-bold uppercase tracking-widest text-[#1a365d]">Payment Advice</h2>
                            <p className="text-[10px] font-mono text-gray-500 mt-1">Customer Copy</p>
                            <div className="mt-2 border border-gray-300 p-1 px-2 inline-block rounded bg-gray-50">
                                <p className="text-[9px] font-bold text-gray-600">DOC ID: {docId}</p>
                            </div>
                        </div>
                    </div>

                    {/* Body Content */}
                    <div className="flex-grow p-8 relative overflow-y-auto scrollbar-hide">
                        {/* Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <i className="fas fa-globe-europe text-[300px] text-[#1a365d] opacity-[0.03]"></i>
                        </div>

                        {/* Authority Stamp */}
                        <div className={`absolute top-12 right-12 w-40 h-40 border-4 border-double border-green-700/40 rounded-full flex items-center justify-center transform rotate-[-12deg] transition-all duration-700 z-20 mix-blend-multiply print:opacity-100 print:scale-100 ${animationState === 'sealing' || animationState === 'complete' ? 'opacity-90 scale-100' : 'opacity-0 scale-150'}`}>
                            <div className="w-36 h-36 border border-green-700/40 rounded-full flex flex-col items-center justify-center text-green-800/60 p-2 text-center">
                                <span className="text-[9px] font-black uppercase tracking-widest">SCB International</span>
                                <span className="text-2xl font-black uppercase my-1 tracking-widest text-green-700/70">PAID</span>
                                <span className="text-[9px] font-bold uppercase">{new Date().toLocaleDateString()}</span>
                                <span className="text-[8px] uppercase mt-1">Verified & Cleared</span>
                            </div>
                        </div>

                        {/* Amount Section */}
                        <div className="mb-8 p-6 bg-[#f8f9fa] rounded-xl border border-gray-200 relative z-10 print:border-black print:bg-transparent">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-bold">Transaction Amount</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-serif font-bold text-[#1a365d]">{formatCurrency(receipt.total)}</span>
                                        <span className="text-sm font-bold text-gray-400">USD</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 italic mt-1">
                                        (Funds successfully transferred)
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Value Date</p>
                                    <p className="text-lg font-mono font-bold text-gray-800">{valueDate}</p>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Grid */}
                        <div className="grid grid-cols-2 gap-x-12 gap-y-8 text-sm relative z-10 mb-8">
                            {/* Beneficiary */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 border-b border-gray-200 pb-1 mb-2">
                                    <i className="fas fa-user-check text-gray-400 text-xs no-print"></i>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Beneficiary Details</p>
                                </div>
                                <p className="font-bold text-base text-[#1a365d]">{cleanVendor}</p>
                                <p className="text-xs text-gray-500">Acct: ****{Math.floor(Math.random()*9000)+1000}</p>
                                <p className="text-xs text-gray-500">Bank: Chase Manhattan, NY</p>
                                <p className="text-[10px] text-gray-400">Addr: 270 Park Ave, New York, NY</p>
                            </div>

                            {/* Remitter */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 border-b border-gray-200 pb-1 mb-2">
                                    <i className="fas fa-building text-gray-400 text-xs no-print"></i>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Remitter Details</p>
                                </div>
                                <p className="font-bold text-base text-[#1a365d]">Alex P. Byrne</p>
                                <p className="text-xs text-gray-500">Acct: ****1234 (Infinite Debit)</p>
                                <p className="text-xs text-gray-500">Bank: SCB Group, Stockholm</p>
                                <p className="text-[10px] text-gray-400">Addr: 123 Financial District, Stockholm</p>
                            </div>

                            {/* Payment Details */}
                            <div className="col-span-2 grid grid-cols-3 gap-4 bg-white border border-gray-200 p-4 rounded-lg print:border-black print:p-2">
                                <div>
                                    <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Payment Reference</p>
                                    <p className="font-mono text-xs font-bold">{receipt.id || `TX-${Date.now()}`}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">UETR (Tracker)</p>
                                    <p className="font-mono text-xs text-gray-600 break-all">{uetr}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Settlement Channel</p>
                                    <p className="font-mono text-xs text-gray-600">{settlementChannel}</p>
                                </div>
                            </div>
                        </div>

                        {/* Authorization Section */}
                        <div className="flex justify-between items-end mt-8 pt-8 border-t-2 border-gray-100 relative print:mt-4">
                             {/* QR Code */}
                            <div className="text-center">
                                <div className="bg-white p-1 border border-gray-200 inline-block mb-1 print:border-black">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=SCB-VERIFY-${receipt.id}-${uetr}`} 
                                        alt="Verification QR" 
                                        className="w-20 h-20"
                                    />
                                </div>
                                <p className="text-[8px] font-mono text-gray-400 uppercase">Scan to Verify</p>
                            </div>

                            {/* Signature */}
                            <div className="text-center w-48">
                                <div className="h-12 mb-2 flex items-end justify-center">
                                    {animationState === 'complete' && (
                                        <img 
                                            src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Signature_sample.svg" 
                                            className="h-10 opacity-80 filter sepia brightness-50 contrast-150 print:filter-none" 
                                            alt="Signature" 
                                        />
                                    )}
                                </div>
                                <div className="border-t border-gray-400 pt-1">
                                    <p className="text-xs font-bold text-[#1a365d]">Marcus Wallenberg</p>
                                    <p className="text-[9px] text-gray-500 uppercase">Chief Clearing Officer</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Blockchain Hash */}
                    <div className="bg-[#f1f5f9] px-8 py-4 border-t border-gray-300 font-mono text-[9px] text-gray-500 relative print-footer">
                         <div className="flex justify-between items-center mb-2">
                            <span className="font-bold">DIGITAL FINGERPRINT:</span>
                            <span className="font-bold text-[#1a365d]">{hashString || 'Generating...'}</span>
                        </div>
                        {/* Barcode Simulation */}
                        <div className="h-8 w-full bg-[repeating-linear-gradient(90deg,black,black_1px,transparent_1px,transparent_3px)] opacity-40 mb-2"></div>
                        <p className="text-[8px] text-center text-gray-400 uppercase leading-tight">
                            Swedish Construction Bank AB (publ) is authorized by the Swedish Prudential Regulation Authority. 
                            Registered Office: 123 Financial District, Stockholm. Registered No. 556000-0000. 
                            This receipt is electronically generated and valid without seal.
                        </p>
                    </div>
                </div>

                {/* Right Side: Visual Tracker & Actions (Dark Mode) - Hidden on Print & Focus Mode */}
                <div className={`w-full md:w-1/3 bg-[#0f172a] border-l border-white/10 p-8 flex flex-col justify-between text-white relative overflow-hidden receipt-right-panel ${isFocusMode ? 'hidden' : ''}`}>
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-8 flex items-center gap-2">
                            <i className="fas fa-satellite-dish"></i> Network Trace
                        </h3>
                        
                        {/* Timeline */}
                        <div className="space-y-8 relative pl-2">
                            <div className="absolute top-2 left-[19px] w-0.5 h-[80%] bg-gray-700 -z-10"></div>
                            
                            <div className="flex gap-4 items-start group">
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.6)] z-10 border-2 border-[#0f172a]">
                                    <i className="fas fa-check text-xs text-black"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Initiated</p>
                                    <p className="text-[10px] text-gray-400">SCB Stockholm Hub</p>
                                    <p className="text-[9px] text-gray-500 font-mono mt-0.5">{new Date().toLocaleTimeString()}</p>
                                </div>
                            </div>
                            
                            <div className={`flex gap-4 items-start group transition-opacity duration-500 ${['signing', 'sealing', 'complete'].includes(animationState) ? 'opacity-100' : 'opacity-30'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 border-[#0f172a] ${['signing', 'sealing', 'complete'].includes(animationState) ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-gray-700'}`}>
                                    <i className="fas fa-shield-alt text-xs"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Compliance</p>
                                    <p className="text-[10px] text-gray-400">AML/KYC & ITCC Pass</p>
                                </div>
                            </div>

                            <div className={`flex gap-4 items-start group transition-opacity duration-500 delay-200 ${['sealing', 'complete'].includes(animationState) ? 'opacity-100' : 'opacity-30'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 border-[#0f172a] ${['sealing', 'complete'].includes(animationState) ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]' : 'bg-gray-700'}`}>
                                    <i className="fas fa-globe text-xs"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Clearing</p>
                                    <p className="text-[10px] text-gray-400">{settlementChannel}</p>
                                </div>
                            </div>

                            <div className={`flex gap-4 items-start group transition-opacity duration-500 delay-500 ${animationState === 'complete' ? 'opacity-100' : 'opacity-30'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 border-[#0f172a] ${animationState === 'complete' ? 'bg-[#e6b325] text-black shadow-[0_0_15px_rgba(250,204,21,0.6)]' : 'bg-gray-700'}`}>
                                    <i className="fas fa-flag text-xs"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Settled</p>
                                    <p className="text-[10px] text-gray-400">Funds Available</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`space-y-3 transition-all duration-700 transform receipt-actions ${animationState === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <button 
                            onClick={handlePrint}
                            disabled={isDownloading}
                            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDownloading ? (
                                <>
                                    <i className="fas fa-circle-notch fa-spin text-white"></i> Preparing...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-print text-red-400"></i> Print / Save PDF
                                </>
                            )}
                        </button>
                        <button 
                            onClick={handleShare}
                            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors text-white"
                        >
                             <i className="fas fa-share-alt text-blue-400"></i> Share Secure Link
                        </button>
                        <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                            <button onClick={handleNewTransfer} className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-sm transition-colors border border-gray-700">
                                New Payment
                            </button>
                            <button onClick={handleDone} className="flex-1 py-3 rounded-xl bg-[#e6b325] hover:bg-[#d4a017] text-[#1a365d] font-bold text-sm transition-colors shadow-lg shadow-yellow-500/20">
                                Dashboard
                            </button>
                        </div>
                    </div>

                    {/* Loading Overlay for Right Side */}
                    {animationState !== 'complete' && (
                        <div className="absolute bottom-10 left-0 right-0 text-center">
                            <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
                                <p className="text-xs text-blue-400 animate-pulse flex items-center gap-2">
                                    <i className="fas fa-circle-notch fa-spin"></i> Finalizing Settlement...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentReceipt;
