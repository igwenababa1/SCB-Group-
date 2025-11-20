
import React, { useState, useEffect } from 'react';
import type { ConnectedApp } from '../../../types';

interface ConnectAppModalProps {
    isOpen: boolean;
    onClose: () => void;
    app: ConnectedApp;
    onSuccess: (appId: string) => void;
}

const ConnectAppModal: React.FC<ConnectAppModalProps> = ({ isOpen, onClose, app, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [loadingText, setLoadingText] = useState('');
    
    // Mock permissions
    const permissions = [
        { id: 'profile', label: 'View your profile details (Name, Email)', required: true },
        { id: 'balance', label: 'View account balances', required: true },
        { id: 'transactions', label: 'View transaction history (90 days)', required: true },
        { id: 'payment', label: 'Initiate payments on your behalf', required: false },
    ];

    if (!isOpen) return null;

    const handleCloseAndReset = () => {
        setStep(1);
        onClose();
    };
    
    const startAuthFlow = () => {
        setStep(2); // Loading state
        const stages = [
            "Establishing Secure Handshake...",
            `Redirecting to ${app.name} Authentication...`,
            "Verifying SSL Certificate...",
        ];
        
        let i = 0;
        const interval = setInterval(() => {
            setLoadingText(stages[i]);
            i++;
            if (i >= stages.length) {
                clearInterval(interval);
                setTimeout(() => setStep(3), 1000); // Login screen
            }
        }, 1000);
    };

    const handleLogin = () => {
        setStep(4); // Token exchange
        const stages = [
            "Validating Credentials...",
            "Generating Access Token...",
            "Exchanging Keys...",
            "Syncing Initial Data...",
        ];
        let i = 0;
        const interval = setInterval(() => {
            setLoadingText(stages[i]);
            i++;
            if (i >= stages.length) {
                clearInterval(interval);
                setTimeout(() => {
                    setStep(5); // Success
                    setTimeout(() => onSuccess(app.id), 2000);
                }, 1000);
            }
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-[#0f172a]/95 backdrop-blur-xl flex items-center justify-center z-[60] p-4" onClick={e => e.stopPropagation()}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700 relative">
                
                {/* Secure Header */}
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider">
                        <i className="fas fa-lock"></i> Secure Connection • 256-bit SSL
                    </div>
                </div>

                <div className="p-8">
                    {step === 1 && (
                        <div className="text-center animate-fade-in-scale-up">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-white rounded-xl shadow-md p-2 flex items-center justify-center">
                                    <i className="fas fa-university text-[#1a365d] text-3xl"></i>
                                </div>
                                <div className="text-gray-400 text-xl"><i className="fas fa-exchange-alt"></i></div>
                                <div className="w-16 h-16 bg-white rounded-xl shadow-md p-2 flex items-center justify-center relative">
                                    <img src={app.logoUrl} alt={app.name} className="w-full h-full object-contain" />
                                </div>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Connect {app.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                {app.name} is requesting access to your SCB account. 
                            </p>
                            
                            <div className="text-left bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-100 dark:border-gray-700">
                                <h4 className="text-xs font-bold uppercase text-gray-500 mb-3">Requested Permissions</h4>
                                <ul className="space-y-3">
                                    {permissions.map(perm => (
                                        <li key={perm.id} className="flex items-start gap-3 text-sm">
                                            <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${perm.required ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'border border-gray-300 dark:border-gray-600'}`}>
                                                <i className="fas fa-check text-xs"></i>
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">{perm.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="flex gap-4">
                                <button onClick={handleCloseAndReset} className="flex-1 py-3 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 font-bold transition-colors">Cancel</button>
                                <button onClick={startAuthFlow} className="flex-1 py-3 rounded-lg bg-[#1a365d] hover:bg-[#2d5c8a] text-white font-bold shadow-lg transition-colors">Authorize</button>
                            </div>
                        </div>
                    )}

                    {(step === 2 || step === 4) && (
                        <div className="text-center py-10">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                <i className="fas fa-shield-alt text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl"></i>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Processing Security Handshake</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{loadingText}</p>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-fade-in-scale-up">
                            <div className="text-center mb-6">
                                <img src={app.logoUrl} alt={app.name} className="w-16 h-16 mx-auto mb-3 bg-white rounded-full p-2 shadow-md" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Log in to {app.name}</h3>
                                <p className="text-xs text-gray-500">Enter your credentials to link this account.</p>
                            </div>
                            <div className="space-y-4">
                                <input type="text" defaultValue="alex.byrne@example.com" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" disabled />
                                <input type="password" placeholder="Password" className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" autoFocus />
                            </div>
                            <button onClick={handleLogin} className="w-full mt-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg transition-colors">
                                Verify & Link
                            </button>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="text-center py-8 animate-fade-in-scale-up">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 dark:text-green-400 shadow-lg border-4 border-white dark:border-gray-800">
                                <i className="fas fa-check text-4xl"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Success!</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Your SCB account is now securely linked to {app.name}.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConnectAppModal;
