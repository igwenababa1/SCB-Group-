
import React, { useState, useEffect, useRef } from 'react';

interface SecurityPinModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const SecurityPinModal: React.FC<SecurityPinModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [pin, setPin] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [status, setStatus] = useState<'idle' | 'verifying' | 'success'>('idle');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (isOpen) {
            setPin(['', '', '', '']);
            setError('');
            setStatus('idle');
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    }, [isOpen]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        if (value.length > 1) value = value.slice(-1);

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);
        setError('');

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }

        if (index === 3 && value) {
            verifyPin(newPin.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const verifyPin = (enteredPin: string) => {
        setStatus('verifying');
        
        setTimeout(() => {
            if (enteredPin === '4380') {
                setStatus('success');
                setTimeout(onSuccess, 800);
            } else {
                setStatus('idle');
                setError('Invalid PIN');
                setPin(['', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-xl flex items-center justify-center z-[110] p-4" onClick={e => e.stopPropagation()}>
            <div className={`bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl w-full max-w-sm p-8 relative overflow-hidden flex flex-col items-center transition-transform ${error ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                
                {/* Header */}
                <div className="w-16 h-16 rounded-full bg-[#1a365d]/50 border border-blue-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                    {status === 'success' ? (
                        <i className="fas fa-check text-2xl text-green-400 animate-fade-in-scale-up"></i>
                    ) : status === 'verifying' ? (
                        <i className="fas fa-circle-notch fa-spin text-2xl text-blue-400"></i>
                    ) : (
                        <i className="fas fa-lock text-2xl text-white"></i>
                    )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Security Authorization</h3>
                <p className="text-xs text-gray-400 mb-8 text-center">Enter your 4-digit Transaction PIN to authorize this transfer.</p>

                {/* PIN Inputs */}
                <div className="flex gap-4 mb-8">
                    {pin.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={el => inputRefs.current[idx] = el}
                            type="password"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleChange(idx, e.target.value)}
                            onKeyDown={e => handleKeyDown(idx, e)}
                            disabled={status !== 'idle'}
                            className={`w-14 h-16 bg-black/40 border rounded-xl text-center text-3xl font-bold text-white outline-none transition-all duration-300 ${
                                error 
                                    ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                                    : 'border-white/10 focus:border-[#e6b325] focus:shadow-[0_0_20px_rgba(230,179,37,0.2)]'
                            }`}
                        />
                    ))}
                </div>

                {status === 'verifying' && (
                    <p className="text-xs text-blue-400 font-mono animate-pulse mb-4">VERIFYING HASH...</p>
                )}

                {error && (
                    <p className="text-xs text-red-400 font-bold mb-4 animate-pulse"><i className="fas fa-exclamation-circle mr-1"></i> {error}</p>
                )}

                <button onClick={onClose} className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-wider mt-auto">
                    Cancel Transaction
                </button>
            </div>
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
            `}</style>
        </div>
    );
};

export default SecurityPinModal;
