
import React, { useState, useEffect } from 'react';

interface StatementModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'Account' | 'Investment' | 'Tax' | 'Consolidated';
}

const StatementModal: React.FC<StatementModalProps> = ({ isOpen, onClose, type }) => {
    const [step, setStep] = useState<'config' | 'generating' | 'ready'>('config');
    const [progress, setProgress] = useState(0);
    const [format, setFormat] = useState('PDF');
    const [period, setPeriod] = useState('last_30');

    useEffect(() => {
        if (isOpen) {
            setStep('config');
            setProgress(0);
        }
    }, [isOpen]);

    const handleGenerate = () => {
        setStep('generating');
        let prog = 0;
        const interval = setInterval(() => {
            prog += Math.random() * 15;
            if (prog >= 100) {
                prog = 100;
                clearInterval(interval);
                setTimeout(() => setStep('ready'), 500);
            }
            setProgress(prog);
        }, 300);
    };

    const handleDownload = () => {
        // In a real app, this would trigger the file download
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <i className="fas fa-file-invoice-dollar text-[#e6b325]"></i>
                        {type} Statements
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><i className="fas fa-times"></i></button>
                </div>

                <div className="p-8">
                    {step === 'config' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Time Period</label>
                                <select 
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#e6b325] outline-none"
                                >
                                    <option value="last_30">Last 30 Days</option>
                                    <option value="last_90">Last Quarter (Q3)</option>
                                    <option value="ytd">Year to Date (2024)</option>
                                    <option value="2023">Full Year 2023</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">File Format</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['PDF', 'CSV', 'QIF'].map(fmt => (
                                        <button
                                            key={fmt}
                                            onClick={() => setFormat(fmt)}
                                            className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                                                format === fmt 
                                                    ? 'bg-[#e6b325] text-[#1a365d] border-[#e6b325]' 
                                                    : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'
                                            }`}
                                        >
                                            {fmt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl flex gap-3">
                                <i className="fas fa-shield-alt text-blue-400 mt-0.5"></i>
                                <p className="text-xs text-blue-200">
                                    Documents are password protected with your account PIN by default.
                                </p>
                            </div>

                            <button 
                                onClick={handleGenerate}
                                className="w-full py-4 rounded-xl bg-[#1a365d] text-white font-bold hover:bg-[#2d5c8a] shadow-lg transition-all"
                            >
                                Generate Document
                            </button>
                        </div>
                    )}

                    {step === 'generating' && (
                        <div className="text-center py-8">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                                <div 
                                    className="absolute inset-0 border-4 border-t-[#e6b325] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"
                                ></div>
                                <i className="fas fa-cog text-2xl text-gray-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></i>
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Compiling Data</h4>
                            <p className="text-sm text-gray-400 mb-6 font-mono">Retrieving records... {Math.floor(progress)}%</p>
                            
                            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-[#e6b325] h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    )}

                    {step === 'ready' && (
                        <div className="text-center animate-fade-in-scale-up py-4">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                                <i className="fas fa-file-check text-4xl text-green-400"></i>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Document Ready</h4>
                            <p className="text-gray-400 text-sm mb-8">
                                Your {type} Statement ({period}) has been generated securely.
                            </p>
                            
                            <button 
                                onClick={handleDownload}
                                className="w-full py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2"
                            >
                                <i className="fas fa-download"></i> Download {format}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatementModal;
