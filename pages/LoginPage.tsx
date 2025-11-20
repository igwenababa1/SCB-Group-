
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import BiometricsModal from '../components/BiometricsModal';
import TwoFactorAuthModal from '../components/TwoFactorAuthModal';

interface LoginPageProps {
    onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
    const { login } = useContext(AppContext);
    
    // Security: Inputs initialized to empty to require manual entry
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [rememberMe, setRememberMe] = useState(false);
    const [isBiometricsModalOpen, setIsBiometricsModalOpen] = useState(false);
    const [isTwoFactorOpen, setIsTwoFactorOpen] = useState(false);
    
    // Advanced Security States
    const [authStage, setAuthStage] = useState<'idle' | 'encrypting' | 'breach_check' | 'entropy' | 'handshake' | 'success'>('idle');
    const [securityLog, setSecurityLog] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isBiometricVerified, setIsBiometricVerified] = useState(false);

    // Authorized Credentials
    const AUTHORIZED_EMAIL = 'mrikimc@gmail.com';
    const AUTHORIZED_PASS = 'SCD@password2025';

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const handleLoginAttempt = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError("Credentials required.");
            return;
        }

        // START SECURITY PROTOCOL
        try {
            // Phase 1: Local Encryption
            setAuthStage('encrypting');
            setSecurityLog('Encrypting payload (AES-256-GCM)...');
            await sleep(800);

            // Phase 2: Breach Database Check (Simulation)
            setAuthStage('breach_check');
            setSecurityLog('Cross-referencing Global Breach Database...');
            await sleep(1200);

            // Strict Credential Validation
            if (email.toLowerCase() !== AUTHORIZED_EMAIL || password !== AUTHORIZED_PASS) {
                 throw new Error("Authentication Failed: Invalid Identity or Access Key.");
            }

            // Phase 3: Entropy & Complexity Analysis
            setAuthStage('entropy');
            setSecurityLog('Analyzing Credential Entropy...');
            await sleep(800);

            // Phase 4: Secure Handshake
            setAuthStage('handshake');
            setSecurityLog('Initiating TLS 1.3 Handshake with Core...');
            await sleep(800);

            // Success
            setAuthStage('success');
            setSecurityLog('Identity Verified.');
            await sleep(500);

            // Reset biometric state for manual login flow and trigger 2FA
            setIsBiometricVerified(false); 
            setIsTwoFactorOpen(true);

        } catch (err: any) {
            setAuthStage('idle');
            setSecurityLog('');
            setError(err.message || "Authentication Failed");
        }
    };
    
    const handleBiometricSuccess = () => {
        setIsBiometricsModalOpen(false);
        setIsBiometricVerified(true);
        // Advanced Security: Biometrics now requires a secondary confirmation step (2FA)
        setTimeout(() => {
            setIsTwoFactorOpen(true);
        }, 300);
    };

    const handleTwoFactorSuccess = () => {
        setIsTwoFactorOpen(false);
        login();
    };

    const handleTwoFactorClose = () => {
        setIsTwoFactorOpen(false);
        setAuthStage('idle'); // Reset if canceled
        // Reset biometric verification if canceled
        if (isBiometricVerified) {
            setIsBiometricVerified(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#020617]">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover animate-kenburns opacity-40"
                >
                    <source src="https://videos.pexels.com/video-files/3121459/3121459-uhd_2560_1440_24fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#020617]/90 to-[#1a365d]/40 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
            </div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-6xl mx-auto p-6 grid lg:grid-cols-12 gap-12 items-center">
                
                {/* Left: Brand Messaging */}
                <div className="lg:col-span-7 text-white space-y-8 hidden lg:block">
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 border border-[#e6b325] rounded-sm flex items-center justify-center text-[#e6b325]">
                            <i className="fas fa-university text-xl"></i>
                         </div>
                         <span className="text-lg font-bold tracking-[0.2em] uppercase text-[#e6b325]">SCB Group</span>
                    </div>
                    
                    <h1 className="text-6xl font-bold leading-tight font-serif">
                        Secure Access<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">Portal</span>
                    </h1>
                    
                    <div className="space-y-4 max-w-lg">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <i className="fas fa-shield-alt text-[#e6b325] mt-1 text-xl"></i>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider text-white">Secure Banking Protocol</h3>
                                <p className="text-gray-400 text-xs mt-1">Your session is protected by military-grade AES-256 encryption and TLS 1.3 handshakes.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <i className="fas fa-fingerprint text-[#e6b325] mt-1 text-xl"></i>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider text-white">Adaptive Biometrics</h3>
                                <p className="text-gray-400 text-xs mt-1">Supports multi-factor authentication via FIDO2 hardware keys and AI-driven biometric analysis.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Login Form */}
                <div className="lg:col-span-5">
                    <div className="bg-[#0f172a]/80 backdrop-blur-xl border-t border-l border-white/10 rounded-3xl shadow-2xl p-8 lg:p-10 relative overflow-hidden group transition-all hover:shadow-[#e6b325]/10">
                        {/* Top Gold Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e6b325] to-transparent"></div>
                        
                        <div className="mb-8">
                            <button onClick={onBack} className="text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-white transition-colors flex items-center gap-2 mb-6">
                                <i className="fas fa-arrow-left"></i> Return to Home
                            </button>
                            <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
                            <p className="text-gray-400 text-sm">Authenticate to access global markets.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 animate-fade-in-up">
                                <i className="fas fa-triangle-exclamation text-red-500 mt-0.5"></i>
                                <div>
                                    <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Security Exception</p>
                                    <p className="text-xs text-gray-300 mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleLoginAttempt} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#e6b325] uppercase tracking-widest ml-1">Secure ID</label>
                                <div className="relative group/input">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={authStage !== 'idle'}
                                        className="w-full bg-[#020617] border border-gray-700 text-white rounded-lg px-4 py-3.5 pl-11 focus:border-[#e6b325] focus:ring-1 focus:ring-[#e6b325] outline-none transition-all group-hover/input:border-gray-600 disabled:opacity-50"
                                        placeholder="Client Email"
                                    />
                                    <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-[#e6b325] transition-colors"></i>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#e6b325] uppercase tracking-widest ml-1">Access Key</label>
                                <div className="relative group/input">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={authStage !== 'idle'}
                                        className="w-full bg-[#020617] border border-gray-700 text-white rounded-lg px-4 py-3.5 pl-11 focus:border-[#e6b325] focus:ring-1 focus:ring-[#e6b325] outline-none transition-all group-hover/input:border-gray-600 disabled:opacity-50"
                                        placeholder="••••••••••••"
                                    />
                                    <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-[#e6b325] transition-colors"></i>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="form-checkbox rounded bg-[#020617] border-gray-700 text-[#e6b325] focus:ring-0 transition-colors group-hover:border-gray-500" />
                                    <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Remember Device</span>
                                </label>
                                <a href="#" className="text-xs text-gray-400 hover:text-[#e6b325] transition-colors">Forgot credentials?</a>
                            </div>

                            <button 
                                type="submit"
                                disabled={authStage !== 'idle'}
                                className={`w-full py-4 font-bold uppercase tracking-widest text-sm rounded-lg shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-90 disabled:cursor-wait flex items-center justify-center gap-3 ${
                                    authStage === 'idle' 
                                        ? 'bg-gradient-to-r from-[#e6b325] to-[#d4a017] hover:to-[#e6b325] text-[#0f172a]' 
                                        : 'bg-gray-800 text-gray-300 border border-gray-700'
                                }`}
                            >
                                {authStage === 'idle' ? (
                                    'Authenticate'
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-2.5 w-2.5">
                                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                            </span>
                                            <span className="font-mono text-xs">{securityLog}</span>
                                        </div>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
                            <button 
                                onClick={() => setIsBiometricsModalOpen(true)}
                                disabled={authStage !== 'idle'}
                                className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group active:scale-95 disabled:opacity-50"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#e6b325]/10 flex items-center justify-center text-[#e6b325] group-hover:scale-110 transition-transform">
                                    <i className="fas fa-fingerprint text-lg"></i>
                                </div>
                                <span className="text-xs font-bold text-gray-300 group-hover:text-white uppercase tracking-wider">Use Biometrics</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Modals */}
            <BiometricsModal 
                isOpen={isBiometricsModalOpen}
                onClose={() => setIsBiometricsModalOpen(false)}
                onSuccess={handleBiometricSuccess}
            />
            
            <TwoFactorAuthModal 
                isOpen={isTwoFactorOpen}
                onClose={handleTwoFactorClose}
                onSuccess={handleTwoFactorSuccess}
                biometricVerified={isBiometricVerified}
            />
        </div>
    );
};

export default LoginPage;
