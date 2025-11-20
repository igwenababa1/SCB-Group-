
import React, { useEffect, useState } from 'react';

interface BiometricsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const BiometricsModal: React.FC<BiometricsModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [status, setStatus] = useState<'init' | 'integrity' | 'scanning' | 'liveness' | 'crypto' | 'success' | 'failed'>('init');
    const [scanType, setScanType] = useState<'face' | 'finger'>('face');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setStatus('init');
            setProgress(0);
            setTimeout(() => setStatus('integrity'), 500);
        }
    }, [isOpen]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        
        if (status === 'integrity') {
            setTimeout(() => setStatus('scanning'), 1000);
        } else if (status === 'scanning') {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        setStatus('liveness');
                        return 100;
                    }
                    return prev + 3;
                });
            }, 30);
        } else if (status === 'liveness') {
            setTimeout(() => setStatus('crypto'), 1200);
        } else if (status === 'crypto') {
            setTimeout(() => setStatus('success'), 1000);
        } else if (status === 'success') {
            setTimeout(onSuccess, 1000);
        }

        return () => clearInterval(interval);
    }, [status, onSuccess]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-xl flex items-center justify-center z-[90] p-4" onClick={e => e.stopPropagation()}>
            <div className="bg-black/40 border border-white/10 rounded-3xl shadow-2xl w-full max-w-sm p-8 relative flex flex-col items-center overflow-hidden">
                {/* Scanning Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-20 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a365d]/10 to-[#0f172a]/80 pointer-events-none"></div>

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-20">
                    <i className="fas fa-times"></i>
                </button>

                <div className="flex gap-4 mb-10 bg-white/5 p-1 rounded-full border border-white/10 relative z-10">
                    <button 
                        onClick={() => setScanType('face')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${scanType === 'face' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-white'}`}
                    >
                        Face ID
                    </button>
                    <button 
                        onClick={() => setScanType('finger')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${scanType === 'finger' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-white'}`}
                    >
                        Touch ID
                    </button>
                </div>

                {/* Visualizer Area */}
                <div className="relative w-48 h-48 mb-10 flex items-center justify-center">
                    {/* Outer Ring */}
                    <div className={`absolute inset-0 border-2 rounded-full transition-all duration-500 ${status === 'success' ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)]' : 'border-blue-500/20'}`}></div>
                    
                    {/* Scanning Ring */}
                    {['scanning', 'liveness'].includes(status) && (
                        <div className="absolute inset-0 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-[spin_1.5s_linear_infinite] shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
                    )}

                    {/* Inner Activity Ring for Crypto */}
                    {status === 'crypto' && (
                         <div className="absolute inset-2 border-2 border-dashed border-purple-500 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
                    )}

                    {/* Status Icons & Animation */}
                    <div className="relative z-10 flex items-center justify-center">
                         {status === 'init' && <i className="fas fa-power-off text-5xl text-gray-600"></i>}
                         {status === 'integrity' && <i className="fas fa-shield-virus text-5xl text-blue-400 animate-pulse"></i>}
                         {(status === 'scanning' || status === 'liveness' || status === 'crypto') && (
                             <i className={`fas ${scanType === 'face' ? 'fa-user-astronaut' : 'fa-fingerprint'} text-6xl text-blue-400 transition-all duration-500 ${status === 'liveness' ? 'scale-110 text-blue-300' : 'scale-100'}`}></i>
                         )}
                         {status === 'success' && <i className="fas fa-check-circle text-7xl text-green-500 animate-fade-in-scale-up drop-shadow-lg"></i>}
                    </div>
                    
                    {/* Scanning Beam Effect */}
                    {status === 'scanning' && scanType === 'face' && (
                         <div className="absolute w-full h-0.5 bg-blue-400/80 shadow-[0_0_20px_#3b82f6] animate-[scan_1.5s_ease-in-out_infinite]"></div>
                    )}
                </div>

                {/* Text Feedback */}
                <h3 className="text-xl font-bold text-white mb-2 z-10 tracking-wide text-center">
                    {status === 'init' && "Initializing Sensor..."}
                    {status === 'integrity' && "System Integrity Check"}
                    {status === 'scanning' && "Scanning Biometrics..."}
                    {status === 'liveness' && "Liveness Verification"}
                    {status === 'crypto' && "Decrypting Secure Enclave"}
                    {status === 'success' && "Identity Confirmed"}
                </h3>
                
                <div className="h-6 flex flex-col items-center justify-center w-full">
                    <p className="text-blue-400 text-[10px] font-mono uppercase tracking-widest z-10 animate-pulse">
                        {status === 'scanning' && `Analyzing Data Points: ${Math.floor(progress * 12.42)}`}
                        {status === 'liveness' && "Deep Depth Mapping Active"}
                        {status === 'crypto' && "HSM Token Exchange: 2048-bit"}
                        {status === 'success' && "Redirecting to 2FA..."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BiometricsModal;
