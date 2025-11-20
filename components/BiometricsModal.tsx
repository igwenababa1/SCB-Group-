import React, { useEffect, useState } from 'react';

interface BiometricsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const BiometricsModal: React.FC<BiometricsModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [status, setStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isOpen) {
            setStatus('scanning');
            // Simulate a 2-second biometric scan
            timer = setTimeout(() => {
                setStatus('success');
                // Wait another second to show success, then call onSuccess callback
                setTimeout(() => {
                    onSuccess();
                    // Reset state for next time
                    setTimeout(() => setStatus('idle'), 500);
                }, 1000);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [isOpen, onSuccess]);

    if (!isOpen) return null;
    
    const renderContent = () => {
        switch (status) {
            case 'scanning':
                return (
                    <>
                        <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                            <div className="absolute w-full h-full bg-[#1a365d]/10 rounded-full animate-ping"></div>
                            <i className="fas fa-fingerprint text-5xl text-[#1a365d]"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-[#1a365d]">Scanning...</h2>
                        <p className="text-gray-600 mt-2">Place your finger on the sensor.</p>
                    </>
                );
            case 'success':
                 return (
                    <>
                        <div className="flex items-center justify-center w-24 h-24 mb-6 bg-green-100 rounded-full">
                            <i className="fas fa-check text-5xl text-green-500"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-[#1a365d]">Authenticated</h2>
                        <p className="text-gray-600 mt-2">Logging you in...</p>
                    </>
                );
            default: // idle
                return (
                    <>
                        <div className="flex items-center justify-center w-24 h-24 mb-6">
                            <i className="fas fa-fingerprint text-5xl text-gray-400"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-[#1a365d]">Biometric Login</h2>
                        <p className="text-gray-600 mt-2">Ready to scan.</p>
                    </>
                );
        }
    }

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity"
            onClick={onClose}
        >
            <div 
                className="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-sm flex flex-col items-center text-center" 
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                    <i className="fas fa-times text-2xl"></i>
                </button>
                {renderContent()}
                <button 
                    onClick={onClose} 
                    className="mt-8 px-6 py-2 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-100"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default BiometricsModal;