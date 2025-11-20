import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import BiometricsModal from '../components/BiometricsModal';

interface LoginPageProps {
    onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
    const { login } = useContext(AppContext);
    const [email, setEmail] = useState('alex.byrne@example.com');
    const [password, setPassword] = useState('password123');
    const [rememberMe, setRememberMe] = useState(false);
    const [isBiometricsModalOpen, setIsBiometricsModalOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            login();
        }
    };
    
    const handleBiometricSuccess = () => {
        setIsBiometricsModalOpen(false);
        login();
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#020617]">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop"
                    className="w-full h-full object-cover animate-kenburns opacity-40"
                    alt="Background"
                />
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
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <i className="fas fa-shield-alt text-[#e6b325] mt-1"></i>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider">End-to-End Encryption</h3>
                                <p className="text-gray-400 text-xs mt-1">Your session is protected by military-grade AES-256 encryption protocols.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <i className="fas fa-fingerprint text-[#e6b325] mt-1"></i>
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider">Biometric Verified</h3>
                                <p className="text-gray-400 text-xs mt-1">Supports FIDO2 hardware keys and biometric authentication methods.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Login Form */}
                <div className="lg:col-span-5">
                    <div className="bg-[#0f172a]/80 backdrop-blur-xl border-t border-l border-white/10 rounded-3xl shadow-2xl p-8 lg:p-10 relative overflow-hidden group">
                        {/* Top Gold Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e6b325] to-transparent"></div>
                        
                        <div className="mb-8">
                            <button onClick={onBack} className="text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-white transition-colors flex items-center gap-2 mb-6">
                                <i className="fas fa-arrow-left"></i> Return to Home
                            </button>
                            <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
                            <p className="text-gray-400 text-sm">Identify yourself to access global markets.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#e6b325] uppercase tracking-widest ml-1">Client Identity</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#020617] border border-gray-700 text-white rounded-lg px-4 py-3.5 pl-11 focus:border-[#e6b325] focus:ring-1 focus:ring-[#e6b325] outline-none transition-all"
                                        placeholder="Username or Email"
                                    />
                                    <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#e6b325] uppercase tracking-widest ml-1">Access Key</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#020617] border border-gray-700 text-white rounded-lg px-4 py-3.5 pl-11 focus:border-[#e6b325] focus:ring-1 focus:ring-[#e6b325] outline-none transition-all"
                                        placeholder="••••••••••••"
                                    />
                                    <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="form-checkbox rounded bg-[#020617] border-gray-700 text-[#e6b325] focus:ring-0" />
                                    <span className="text-xs text-gray-400">Remember Device</span>
                                </label>
                                <a href="#" className="text-xs text-gray-400 hover:text-[#e6b325] transition-colors">Forgot credentials?</a>
                            </div>

                            <button 
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-[#e6b325] to-[#d4a017] hover:to-[#e6b325] text-[#0f172a] font-bold uppercase tracking-widest text-sm rounded-lg shadow-lg transition-all transform hover:-translate-y-0.5"
                            >
                                Authenticate
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
                            <button 
                                onClick={() => setIsBiometricsModalOpen(true)}
                                className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#e6b325]/10 flex items-center justify-center text-[#e6b325]">
                                    <i className="fas fa-fingerprint text-lg"></i>
                                </div>
                                <span className="text-xs font-bold text-gray-300 group-hover:text-white uppercase tracking-wider">Use Biometrics</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <BiometricsModal 
                isOpen={isBiometricsModalOpen}
                onClose={() => setIsBiometricsModalOpen(false)}
                onSuccess={handleBiometricSuccess}
            />
        </div>
    );
};

export default LoginPage;