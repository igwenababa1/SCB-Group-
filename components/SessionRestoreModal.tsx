
import React, { useEffect, useState } from 'react';

interface SessionRestoreModalProps {
    isOpen: boolean;
    lastActiveTime: string;
    lastView: string;
    onRestore: () => void;
    onRestart: () => void;
}

const SessionRestoreModal: React.FC<SessionRestoreModalProps> = ({ isOpen, lastActiveTime, lastView, onRestore, onRestart }) => {
    const [progress, setProgress] = useState(0);
    const [isRestoring, setIsRestoring] = useState(false);

    const formatViewName = (view: string) => {
        if (!view) return 'Home';
        return view.charAt(0).toUpperCase() + view.slice(1).replace('-', ' ');
    };

    const handleRestoreClick = () => {
        setIsRestoring(true);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onRestore, 500);
                    return 100;
                }
                return prev + 4;
            });
        }, 20);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center p-4">
            {/* Background Tech Visuals */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
            </div>

            <div className="relative w-full max-w-md bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-scale-up">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-[#e6b325] to-blue-600"></div>
                
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                                <i className="fas fa-history text-3xl text-blue-400"></i>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-[#0f172a] rounded-full p-1">
                                <div className="w-8 h-8 rounded-full bg-[#e6b325] flex items-center justify-center shadow-lg">
                                    <i className="fas fa-exclamation text-[#1a365d] font-bold"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white text-center mb-2">Session Recovery</h2>
                    <p className="text-gray-400 text-sm text-center mb-8">
                        An active workspace was detected. Would you like to restore your previous session context?
                    </p>

                    <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500 uppercase font-bold">Last Active</span>
                            <span className="text-xs text-gray-300 font-mono">{new Date(lastActiveTime).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 uppercase font-bold">Module</span>
                            <span className="text-sm text-[#e6b325] font-bold">{formatViewName(lastView)}</span>
                        </div>
                    </div>

                    {isRestoring ? (
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs text-blue-300 font-mono">
                                <span>REHYDRATING STATE...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" 
                                    style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
                                ></div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <button 
                                onClick={handleRestoreClick}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#1a365d] to-[#2d5c8a] border border-white/10 hover:border-blue-400/50 text-white font-bold shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
                            >
                                <i className="fas fa-play text-blue-400 group-hover:text-white transition-colors"></i>
                                Restore Secure Session
                            </button>
                            <button 
                                onClick={onRestart}
                                className="w-full py-3 rounded-xl bg-transparent border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-semibold text-sm transition-colors"
                            >
                                Terminate & Start Fresh
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-black/20 p-3 text-center border-t border-white/5">
                    <p className="text-[10px] text-gray-600 font-mono">ENCRYPTED STATE STORAGE • PROTOCOL V4.2</p>
                </div>
            </div>
        </div>
    );
};

export default SessionRestoreModal;
