
import React, { useEffect, useState, useRef } from 'react';

interface BiometricsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const BiometricsModal: React.FC<BiometricsModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [status, setStatus] = useState<'init' | 'permission' | 'integrity' | 'scanning' | 'liveness' | 'crypto' | 'success' | 'failed'>('init');
    const [scanType, setScanType] = useState<'face' | 'finger'>('face');
    const [progress, setProgress] = useState(0);
    const [permissionError, setPermissionError] = useState('');
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Cleanup function to stop camera
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    useEffect(() => {
        if (isOpen) {
            setStatus('init');
            setProgress(0);
            setPermissionError('');
            // Start sequence
            setTimeout(() => setStatus('permission'), 500);
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [isOpen]);

    // Camera Handling
    useEffect(() => {
        const startCamera = async () => {
            if (status === 'scanning' && scanType === 'face') {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error("Camera permission denied:", err);
                    setPermissionError("Camera access required for Face ID.");
                    setStatus('failed');
                }
            } else {
                stopCamera();
            }
        };

        startCamera();
    }, [status, scanType]);

    // Sequence Logic
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        
        if (status === 'permission') {
            // Simulate permission check delay
            setTimeout(() => setStatus('integrity'), 800);
        } else if (status === 'integrity') {
            setTimeout(() => setStatus('scanning'), 1000);
        } else if (status === 'scanning') {
            if (permissionError) return; // Stop if error

            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        setStatus('liveness');
                        return 100;
                    }
                    return prev + 2; // Slightly slower for realism
                });
            }, 40);
        } else if (status === 'liveness') {
            setTimeout(() => setStatus('crypto'), 1500);
        } else if (status === 'crypto') {
            setTimeout(() => setStatus('success'), 1000);
        } else if (status === 'success') {
            setTimeout(() => {
                stopCamera();
                onSuccess();
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [status, onSuccess, permissionError]);

    const handleClose = () => {
        stopCamera();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-xl flex items-center justify-center z-[90] p-4" onClick={e => e.stopPropagation()}>
            <div className="bg-black/40 border border-white/10 rounded-3xl shadow-2xl w-full max-w-sm p-8 relative flex flex-col items-center overflow-hidden min-h-[500px]">
                
                {/* Camera Feed Background (Only for Face ID during scanning phases) */}
                {scanType === 'face' && ['scanning', 'liveness', 'crypto', 'success'].includes(status) && !permissionError && (
                    <div className="absolute inset-0 z-0 opacity-50">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                        <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay"></div>
                    </div>
                )}

                {/* Scanning Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-20 pointer-events-none z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a365d]/20 to-[#0f172a]/90 pointer-events-none z-10"></div>

                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-30 bg-black/20 rounded-full p-2">
                    <i className="fas fa-times"></i>
                </button>

                <div className="flex gap-4 mb-10 bg-white/5 p-1 rounded-full border border-white/10 relative z-20 backdrop-blur-md">
                    <button 
                        onClick={() => { setScanType('face'); setStatus('init'); }}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${scanType === 'face' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-white'}`}
                        disabled={status !== 'init' && status !== 'permission' && status !== 'integrity'}
                    >
                        Face ID
                    </button>
                    <button 
                        onClick={() => { setScanType('finger'); setStatus('init'); }}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${scanType === 'finger' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-white'}`}
                        disabled={status !== 'init' && status !== 'permission' && status !== 'integrity'}
                    >
                        Touch ID
                    </button>
                </div>

                {/* Visualizer Area */}
                <div className="relative w-56 h-56 mb-10 flex items-center justify-center z-20">
                    {/* Face ID Frame Corners */}
                    {scanType === 'face' && (
                        <>
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500/50 rounded-tl-2xl"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500/50 rounded-tr-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500/50 rounded-bl-2xl"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500/50 rounded-br-2xl"></div>
                        </>
                    )}

                    {/* Outer Ring */}
                    <div className={`absolute inset-0 border-2 rounded-full transition-all duration-500 ${status === 'success' ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)]' : 'border-blue-500/20'}`}></div>
                    
                    {/* Scanning Ring */}
                    {['scanning', 'liveness'].includes(status) && !permissionError && (
                        <div className="absolute inset-0 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-[spin_1.5s_linear_infinite] shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
                    )}

                    {/* Inner Activity Ring for Crypto */}
                    {status === 'crypto' && (
                         <div className="absolute inset-2 border-2 border-dashed border-purple-500 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
                    )}

                    {/* Status Icons & Animation */}
                    <div className="relative z-10 flex items-center justify-center">
                         {status === 'init' && <i className="fas fa-power-off text-5xl text-gray-600"></i>}
                         {status === 'permission' && <i className="fas fa-lock text-5xl text-yellow-500 animate-pulse"></i>}
                         {status === 'integrity' && <i className="fas fa-shield-virus text-5xl text-blue-400 animate-pulse"></i>}
                         
                         {status === 'failed' && (
                             <div className="text-center">
                                 <i className="fas fa-exclamation-triangle text-5xl text-red-500 mb-2"></i>
                             </div>
                         )}

                         {(status === 'scanning' || status === 'liveness' || status === 'crypto') && !permissionError && (
                             scanType === 'finger' ? (
                                 <i className="fas fa-fingerprint text-7xl text-blue-400 animate-pulse"></i>
                             ) : (
                                 // Transparent center for Face ID to see camera
                                 <div className="w-32 h-32 rounded-full border-2 border-blue-400/30"></div> 
                             )
                         )}
                         
                         {status === 'success' && <i className="fas fa-check-circle text-7xl text-green-500 animate-fade-in-scale-up drop-shadow-lg"></i>}
                    </div>
                    
                    {/* Scanning Beam Effect */}
                    {status === 'scanning' && !permissionError && (
                         <div className="absolute w-full h-0.5 bg-blue-400/80 shadow-[0_0_20px_#3b82f6] animate-[scan_1.5s_ease-in-out_infinite]"></div>
                    )}
                </div>

                {/* Text Feedback */}
                <div className="z-20 text-center">
                    <h3 className="text-xl font-bold text-white mb-2 tracking-wide drop-shadow-md">
                        {status === 'init' && "Initializing Sensor..."}
                        {status === 'permission' && "Requesting Access..."}
                        {status === 'integrity' && "System Integrity Check"}
                        {status === 'scanning' && "Scanning Biometrics..."}
                        {status === 'liveness' && "Liveness Verification"}
                        {status === 'crypto' && "Decrypting Secure Enclave"}
                        {status === 'success' && "Identity Confirmed"}
                        {status === 'failed' && "Authentication Failed"}
                    </h3>
                    
                    <div className="h-6 flex flex-col items-center justify-center w-full">
                        {permissionError ? (
                            <p className="text-red-400 text-xs font-bold uppercase tracking-widest">{permissionError}</p>
                        ) : (
                            <p className="text-blue-400 text-[10px] font-mono uppercase tracking-widest z-10 animate-pulse">
                                {status === 'scanning' && `Analyzing Data Points: ${Math.floor(progress * 12.42)}`}
                                {status === 'liveness' && "Deep Depth Mapping Active"}
                                {status === 'crypto' && "HSM Token Exchange: 2048-bit"}
                                {status === 'success' && "Redirecting to 2FA..."}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BiometricsModal;
