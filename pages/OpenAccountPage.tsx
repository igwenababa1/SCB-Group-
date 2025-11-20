
import React, { useState, useEffect } from 'react';

interface OpenAccountPageProps {
    onNavigateToLogin: () => void;
    onBack: () => void;
}

const ACCOUNT_TIERS = [
    {
        id: 'personal',
        title: 'Infinite Personal',
        description: 'Everyday banking with zero fees and global ATM access.',
        features: ['Multi-currency IBAN', 'Metal Visa Infinite Card', '0% FX Fees'],
        color: 'from-blue-600 to-blue-400',
        icon: 'fa-user'
    },
    {
        id: 'business',
        title: 'Global Business',
        description: 'Power your enterprise with integrated invoicing and team cards.',
        features: ['Bulk Payments', 'Accounting Integration', 'Unlimited Virtual Cards'],
        color: 'from-purple-600 to-purple-400',
        icon: 'fa-briefcase'
    },
    {
        id: 'wealth',
        title: 'Private Wealth',
        description: 'Exclusive access to investment services and dedicated advisory.',
        features: ['Dedicated Banker', 'Concierge Service', 'Priority Support'],
        color: 'from-[#e6b325] to-[#d4a017]',
        icon: 'fa-crown'
    }
];

const OpenAccountPage: React.FC<OpenAccountPageProps> = ({ onNavigateToLogin, onBack }) => {
    const [step, setStep] = useState(1);
    const [selectedTier, setSelectedTier] = useState<string | null>(null);
    const [scanningState, setScanningState] = useState<'idle' | 'scanning' | 'success'>('idle');
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '', country: 'Sweden'
    });
    const [processingStep, setProcessingStep] = useState(0);

    // Simulated ID Scanning
    const startScan = () => {
        setScanningState('scanning');
        setTimeout(() => {
            setScanningState('success');
        }, 3000);
    };

    // Simulated Account Creation
    useEffect(() => {
        if (step === 4) {
            const interval = setInterval(() => {
                setProcessingStep(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setStep(5), 500);
                        return 100;
                    }
                    return prev + 2; // Progress increment
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [step]);

    const getProcessingText = (progress: number) => {
        if (progress < 30) return "Verifying Identity & Biometrics...";
        if (progress < 60) return "Running Global Compliance Checks (AML/KYC)...";
        if (progress < 85) return "Generating Multi-Currency IBAN...";
        return "Minting Digital Card...";
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans overflow-hidden relative flex flex-col">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
                    className="w-full h-full object-cover opacity-30"
                    alt="Architecture"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#020617]/80 to-[#020617]"></div>
            </div>

            {/* Header */}
            <div className="relative z-20 p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#e6b325] rounded-lg flex items-center justify-center text-[#1a365d] shadow-lg">
                        <i className="fas fa-university text-xl"></i>
                    </div>
                    <span className="font-bold tracking-wider text-lg">SCB Group</span>
                </div>
                <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <i className="fas fa-times"></i> Cancel
                </button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-5xl">
                    
                    {/* Progress Bar (if not success) */}
                    {step < 5 && (
                        <div className="mb-8">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                <span className={step >= 1 ? 'text-[#e6b325]' : ''}>01 Select Tier</span>
                                <span className={step >= 2 ? 'text-[#e6b325]' : ''}>02 Verify ID</span>
                                <span className={step >= 3 ? 'text-[#e6b325]' : ''}>03 Details</span>
                                <span className={step >= 4 ? 'text-[#e6b325]' : ''}>04 Activation</span>
                            </div>
                            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-[#e6b325] transition-all duration-500 ease-out"
                                    style={{ width: `${((step - 1) / 4) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Steps */}
                    
                    {/* Step 1: Product Selection */}
                    {step === 1 && (
                        <div className="animate-fade-in-up">
                            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Choose Your Level of Access</h1>
                            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">Select the account tier that best aligns with your financial ambitions.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {ACCOUNT_TIERS.map(tier => (
                                    <div 
                                        key={tier.id}
                                        onClick={() => setSelectedTier(tier.id)}
                                        className={`relative p-8 rounded-3xl border transition-all duration-300 cursor-pointer group ${selectedTier === tier.id ? 'bg-white/10 border-[#e6b325] shadow-[0_0_30px_rgba(230,179,37,0.2)]' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'}`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center text-white text-2xl mb-6 shadow-lg`}>
                                            <i className={`fas ${tier.icon}`}></i>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">{tier.title}</h3>
                                        <p className="text-sm text-gray-400 mb-6 h-10">{tier.description}</p>
                                        <ul className="space-y-3 mb-8">
                                            {tier.features.map((feat, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                                    <i className="fas fa-check-circle text-green-400"></i> {feat}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className={`w-full py-3 rounded-xl border font-bold text-center text-sm uppercase tracking-wider transition-all ${selectedTier === tier.id ? 'bg-[#e6b325] border-[#e6b325] text-[#1a365d]' : 'border-white/20 text-gray-400 group-hover:text-white group-hover:border-white'}`}>
                                            {selectedTier === tier.id ? 'Selected' : 'Select Plan'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 flex justify-center">
                                <button 
                                    onClick={() => setStep(2)}
                                    disabled={!selectedTier}
                                    className="px-12 py-4 rounded-full bg-white text-[#1a365d] font-bold text-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl"
                                >
                                    Continue to Verification <i className="fas fa-arrow-right ml-2"></i>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: eKYC */}
                    {step === 2 && (
                        <div className="max-w-2xl mx-auto animate-fade-in-up">
                            <h2 className="text-3xl font-bold text-center mb-8">Identity Verification</h2>
                            
                            <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                                {scanningState === 'idle' && (
                                    <div className="text-center py-12">
                                        <div className="w-24 h-24 border-2 border-dashed border-gray-600 rounded-xl mx-auto mb-6 flex items-center justify-center text-gray-500">
                                            <i className="fas fa-id-card text-4xl"></i>
                                        </div>
                                        <p className="text-gray-300 mb-6">Please scan your government-issued ID or Passport.</p>
                                        <button onClick={startScan} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition-colors">
                                            <i className="fas fa-camera mr-2"></i> Start Camera
                                        </button>
                                    </div>
                                )}
                                
                                {scanningState === 'scanning' && (
                                    <div className="relative h-64 bg-black rounded-xl overflow-hidden flex items-center justify-center">
                                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555617981-7783b03f354b?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-50"></div>
                                        <div className="absolute inset-0 border-4 border-blue-500/50 rounded-xl"></div>
                                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 shadow-[0_0_15px_#3b82f6] animate-[scan_2s_linear_infinite]"></div>
                                        <p className="relative z-10 font-mono text-blue-400 bg-black/50 px-3 py-1 rounded">Scanning Document...</p>
                                    </div>
                                )}

                                {scanningState === 'success' && (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400 border border-green-500/50">
                                            <i className="fas fa-check text-3xl"></i>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Identity Verified</h3>
                                        <p className="text-gray-400 text-sm">Passport ending in ****8291 accepted.</p>
                                        <button onClick={() => setStep(3)} className="mt-8 px-8 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-white transition-colors">
                                            Continue
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-6 flex justify-center gap-8 text-xs text-gray-500">
                                <span className="flex items-center gap-2"><i className="fas fa-lock"></i> 256-bit Encryption</span>
                                <span className="flex items-center gap-2"><i className="fas fa-shield-alt"></i> GDPR Compliant</span>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Details */}
                    {step === 3 && (
                        <div className="max-w-2xl mx-auto animate-fade-in-up">
                            <h2 className="text-3xl font-bold text-center mb-8">Personal Details</h2>
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">First Name</label>
                                        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-[#e6b325] focus:ring-1 focus:ring-[#e6b325] outline-none" placeholder="e.g. Alex" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Last Name</label>
                                        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-[#e6b325] focus:ring-1 focus:ring-[#e6b325] outline-none" placeholder="e.g. Byrne" />
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Email Address</label>
                                    <input type="email" className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-[#e6b325] focus:ring-1 focus:ring-[#e6b325] outline-none" placeholder="alex@example.com" />
                                </div>
                                <div className="mb-8">
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Tax Residency</label>
                                    <select className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-[#e6b325] focus:ring-1 focus:ring-[#e6b325] outline-none appearance-none">
                                        <option>Sweden</option>
                                        <option>United States</option>
                                        <option>Germany</option>
                                        <option>United Kingdom</option>
                                    </select>
                                </div>
                                
                                <button onClick={() => setStep(4)} className="w-full py-4 bg-[#e6b325] text-[#1a365d] font-bold rounded-xl hover:bg-[#d4a017] transition-colors shadow-lg">
                                    Create Account
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Processing */}
                    {step === 4 && (
                        <div className="max-w-xl mx-auto text-center animate-fade-in-up py-12">
                            <div className="relative w-32 h-32 mx-auto mb-8">
                                <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
                                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                    <circle
                                        cx="64" cy="64" r="60"
                                        stroke="#e6b325" strokeWidth="4" fill="transparent"
                                        strokeDasharray="377"
                                        strokeDashoffset={377 - (377 * processingStep) / 100}
                                        className="transition-all duration-100"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold font-mono text-white">{processingStep}%</span>
                                </div>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-white mb-2">Setting Up Your Portfolio</h2>
                            <p className="text-[#e6b325] font-mono text-sm animate-pulse">
                                {getProcessingText(processingStep)}
                            </p>
                        </div>
                    )}

                    {/* Step 5: Success */}
                    {step === 5 && (
                        <div className="max-w-2xl mx-auto text-center animate-fade-in-scale-up">
                            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/30 transform rotate-3">
                                <i className="fas fa-check text-5xl text-white"></i>
                            </div>
                            
                            <h1 className="text-5xl font-bold text-white mb-4">Welcome to SCB.</h1>
                            <p className="text-gray-400 text-lg mb-10">Your {ACCOUNT_TIERS.find(t => t.id === selectedTier)?.title} account is active and ready for use.</p>
                            
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 text-left max-w-lg mx-auto">
                                <div className="flex justify-between mb-4 border-b border-white/5 pb-4">
                                    <span className="text-gray-400">Account Number</span>
                                    <span className="font-mono font-bold text-white">8842 1930 2291</span>
                                </div>
                                <div className="flex justify-between mb-4 border-b border-white/5 pb-4">
                                    <span className="text-gray-400">IBAN</span>
                                    <span className="font-mono font-bold text-white">SE88 4000 1293 9921 00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">BIC / SWIFT</span>
                                    <span className="font-mono font-bold text-white">SCBSEMM</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={onNavigateToLogin}
                                className="px-10 py-4 bg-[#e6b325] text-[#1a365d] font-bold rounded-full hover:bg-white transition-all shadow-xl hover:scale-105"
                            >
                                Access Online Banking
                            </button>
                        </div>
                    )}

                </div>
            </div>
            
            <style>{`
                @keyframes scan {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
            `}</style>
        </div>
    );
};

export default OpenAccountPage;
