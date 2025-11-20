import React, { useState, useEffect } from 'react';

interface SecurityCheckPageProps {
    onComplete: () => void;
}

const securitySteps = [
    { id: 1, label: "Initiating Secure Handshake", detail: "TLS 1.3 / AES-256" },
    { id: 2, label: "Verifying Digital Signature", detail: "RSA-4096 Key Exchange" },
    { id: 3, label: "Scanning for Anomalies", detail: "Heuristic Analysis" },
    { id: 4, label: "Syncing Ledger Node", detail: "Stockholm Core [Active]" },
    { id: 5, label: "Access Granted", detail: "Redirecting..." },
];

const SecurityCheckPage: React.FC<SecurityCheckPageProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Sequential timer for steps
        const timers = securitySteps.map((_, index) => 
            setTimeout(() => setCurrentStep(index + 1), (index + 1) * 800)
        );
        
        const finalTimer = setTimeout(onComplete, securitySteps.length * 800 + 500);

        return () => {
            timers.forEach(clearTimeout);
            clearTimeout(finalTimer);
        };
    }, [onComplete]);

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 overflow-hidden relative">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-md">
                {/* Radar Scanner Visual */}
                <div className="relative w-40 h-40 mb-12 flex items-center justify-center">
                    <div className="absolute inset-0 border border-[#e6b325]/30 rounded-full"></div>
                    <div className="absolute inset-4 border border-[#e6b325]/50 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-0 rounded-full bg-[#e6b325]/5 animate-radar"></div>
                    
                    <div className="w-20 h-20 bg-[#0f172a] rounded-full flex items-center justify-center border border-[#e6b325] shadow-[0_0_20px_rgba(230,179,37,0.3)] z-20">
                        <i className="fas fa-shield-alt text-3xl text-[#e6b325]"></i>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-white uppercase tracking-[0.2em] mb-8 text-center">
                    System Integrity Check
                </h2>

                <div className="w-full space-y-4">
                    {securitySteps.map((step, index) => {
                        const isActive = currentStep === index;
                        const isCompleted = currentStep > index;

                        return (
                            <div 
                                key={step.id}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-500 ${
                                    isCompleted 
                                        ? 'bg-green-500/10 border-green-500/30' 
                                        : isActive 
                                            ? 'bg-[#e6b325]/10 border-[#e6b325]/40 shadow-[0_0_10px_rgba(230,179,37,0.1)] scale-[1.02]' 
                                            : 'bg-transparent border-white/5 opacity-40'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                        isCompleted ? 'bg-green-500' : isActive ? 'bg-[#e6b325] animate-pulse' : 'bg-gray-700'
                                    }`}>
                                        {isCompleted && <i className="fas fa-check text-[8px] text-black"></i>}
                                    </div>
                                    <div>
                                        <p className={`text-xs font-bold uppercase tracking-wider ${
                                            isCompleted ? 'text-green-400' : isActive ? 'text-[#e6b325]' : 'text-gray-400'
                                        }`}>
                                            {step.label}
                                        </p>
                                    </div>
                                </div>
                                <span className={`font-mono text-[10px] ${isCompleted ? 'text-green-500/70' : 'text-gray-500'}`}>
                                    {isCompleted ? 'OK' : isActive ? step.detail : '...'}
                                </span>
                            </div>
                        );
                    })}
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-[9px] text-gray-600 font-mono uppercase">
                        SCB Secure Gateway v4.2.1 • IP {Math.floor(Math.random()*255)}.{Math.floor(Math.random()*255)}.14.22
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SecurityCheckPage;