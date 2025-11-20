
import React, { useState, useEffect, useRef } from 'react';

interface TwoFactorAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    biometricVerified?: boolean;
}

const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({ isOpen, onClose, onSuccess, biometricVerified }) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (isOpen) {
            setCode(['', '', '', '', '', '']);
            setTimeLeft(30);
            setError('');
            // Focus first input after a short delay to ensure modal animation finishes
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || timeLeft === 0) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [isOpen, timeLeft]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1); // Only allow 1 digit
        
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
        
        // Auto-submit if full
        if (index === 5 && value) {
            verifyCode(newCode.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const verifyCode = (fullCode: string) => {
        setIsVerifying(true);
        setError('');
        
        // Simulate network latency for security check
        setTimeout(() => {
            // Strict Code Validation: 903418
            if (fullCode === '903418') {
                setIsVerifying(false);
                onSuccess();
            } else {
                setIsVerifying(false);
                setError('Authentication Failed: Invalid Security Code.');
                // Clear code on error for security
                setCode(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-xl flex items-center justify-center z-[80] p-4" onClick={e => e.stopPropagation()}>
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden animate-fade-in-scale-up">
                {/* Top Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-[#e6b325] to-blue-600"></div>
                
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <i className="fas fa-times text-xl"></i>
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                        <i className={`fas ${biometricVerified ? 'fa-fingerprint' : 'fa-shield-alt'} text-3xl text-blue-400`}></i>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Multi-Factor Authentication</h2>
                    
                    {biometricVerified && (
                        <div className="mb-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center justify-center gap-2 mx-auto max-w-[90%] animate-fade-in-up">
                            <i className="fas fa-check-circle text-green-400"></i>
                            <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Biometric Identity Verified</span>
                        </div>
                    )}

                    <p className="text-gray-400 text-sm">
                        Enter the secure 6-digit OTP sent to your registered device ending in <span className="text-white font-mono">**89</span>.
                    </p>
                </div>

                <div className="flex justify-between gap-2 mb-6">
                    {code.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={el => inputRefs.current[idx] = el}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleChange(idx, e.target.value)}
                            onKeyDown={e => handleKeyDown(idx, e)}
                            disabled={isVerifying}
                            className={`w-12 h-14 bg-black/30 border rounded-lg text-center text-2xl font-mono font-bold text-white outline-none transition-all disabled:opacity-50 ${
                                error ? 'border-red-500 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/10 focus:border-[#e6b325] focus:shadow-[0_0_15px_rgba(230,179,37,0.2)]'
                            }`}
                        />
                    ))}
                </div>

                {error && (
                    <div className="flex items-center justify-center gap-2 text-red-400 text-xs text-center mb-6 font-bold animate-pulse bg-red-500/10 p-2 rounded">
                        <i className="fas fa-triangle-exclamation"></i> {error}
                    </div>
                )}

                <div className="text-center">
                    <button 
                        onClick={() => verifyCode(code.join(''))}
                        disabled={code.some(c => !c) || isVerifying}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-[#e6b325] to-[#d4a017] hover:to-[#e6b325] text-[#1a365d] font-bold uppercase tracking-widest text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4 flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
                    >
                        {isVerifying ? (
                            <>
                                <i className="fas fa-circle-notch fa-spin"></i> Verifying Token...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-lock"></i> Complete Login
                            </>
                        )}
                    </button>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500 border-t border-white/5 pt-4">
                         <span className="flex items-center gap-1"><i className="fas fa-shield-virus text-[10px] text-green-400"></i> TLS 1.3 Encrypted</span>
                        <div>
                            Code expires in 
                            {timeLeft > 0 ? (
                                <span className="ml-1 text-white font-mono font-bold">{timeLeft}s</span>
                            ) : (
                                <button className="ml-1 text-blue-400 hover:text-white font-bold transition-colors uppercase" onClick={() => setTimeLeft(30)}>Resend</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwoFactorAuthModal;
