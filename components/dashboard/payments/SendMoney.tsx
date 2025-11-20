
import React, { useState, useEffect, useMemo } from 'react';
import { ACCOUNTS, CONTACTS, CURRENCY_RATES, USER_SETTINGS } from '../../../constants';
import { CURRENCIES } from '../../../i18n';
import type { ViewType, Account, Contact } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';
import { useDashboard } from '../../../contexts/DashboardContext';
import PaymentReceipt from './PaymentReceipt';
import SecurityPinModal from './SecurityPinModal';
import ItccComplianceModal from './ItccComplianceModal';

interface SendMoneyProps {
    setActiveView: (view: ViewType) => void;
}

const BANKS_DATABASE: Record<string, { name: string; logo: string; color: string }> = {
    '021000021': { name: 'JPMorgan Chase', logo: 'https://logo.clearbit.com/chase.com', color: 'bg-blue-900' },
    '121000358': { name: 'Bank of America', logo: 'https://logo.clearbit.com/bankofamerica.com', color: 'bg-red-700' },
    '122000247': { name: 'Wells Fargo', logo: 'https://logo.clearbit.com/wellsfargo.com', color: 'bg-yellow-600' },
    '021000089': { name: 'Citibank', logo: 'https://logo.clearbit.com/citi.com', color: 'bg-blue-500' },
};

const TransferProcessingModal: React.FC<{ isOpen: boolean; steps: string[]; currentStep: number }> = ({ isOpen, steps, currentStep }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-xl z-[70] flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">
                {/* Animated Progress Bar Top */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-[shimmer_2s_infinite]"
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%`, transition: 'width 0.5s ease-out' }}
                    ></div>
                </div>

                <div className="p-8 flex flex-col items-center text-center">
                    {/* Central Visual */}
                    <div className="relative w-32 h-32 mb-8">
                        <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                        <div className="absolute inset-4 border-2 border-dashed border-purple-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-400/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                <i className="fas fa-globe-americas text-3xl text-blue-400 animate-pulse"></i>
                            </div>
                        </div>
                        
                        {/* Orbiting Particles */}
                        <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite]">
                            <div className="w-2 h-2 bg-white rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_white]"></div>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">Processing Transfer</h3>
                    <p className="text-gray-400 text-xs font-mono mb-8">SECURE CHANNEL ESTABLISHED</p>

                    <div className="w-full space-y-3 text-left">
                        {steps.map((step, idx) => (
                            <div key={idx} className={`flex items-center gap-3 transition-all duration-500 ${idx <= currentStep ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${idx < currentStep ? 'bg-green-500 border-green-500' : idx === currentStep ? 'border-blue-500 animate-pulse' : 'border-gray-700'}`}>
                                    {idx < currentStep && <i className="fas fa-check text-[10px] text-black"></i>}
                                    {idx === currentStep && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                </div>
                                <span className={`text-sm ${idx === currentStep ? 'text-white font-bold' : 'text-gray-500'}`}>{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SendMoney: React.FC<SendMoneyProps> = ({ setActiveView }) => {
    const { addReceiptAndNavigate } = useDashboard();
    
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('');
    const [fromAccount, setFromAccount] = useState<Account>(ACCOUNTS[0]);
    const [targetCurrency, setTargetCurrency] = useState('USD');
    const [note, setNote] = useState('');
    
    // Recipient State
    const [recipientMode, setRecipientMode] = useState<'contact' | 'manual'>('contact');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [manualRecipient, setManualRecipient] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: 'United States',
        routingNumber: '',
        accountNumber: '',
        accountType: 'Checking',
        bankName: ''
    });
    const [detectedBank, setDetectedBank] = useState<{ name: string; logo: string; color: string } | null>(null);
    const [isCheckingBank, setIsCheckingBank] = useState(false);

    // ITCC Logic
    const [itccCode, setItccCode] = useState('');
    const [showComplianceModal, setShowComplianceModal] = useState(false);
    
    // Processing Logic
    const [showProcessingModal, setShowProcessingModal] = useState(false);
    const [processingStep, setProcessingStep] = useState(0);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);
    
    // Consent Logic
    const [consentAgreed, setConsentAgreed] = useState(false);
    
    // PIN Logic
    const [showPinModal, setShowPinModal] = useState(false);

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

    // Bank Detection Logic
    useEffect(() => {
        if (manualRecipient.routingNumber.length >= 9) {
            setIsCheckingBank(true);
            const timer = setTimeout(() => {
                const routing = manualRecipient.routingNumber;
                let bank = BANKS_DATABASE[routing];
                
                if (!bank) {
                    if (routing.startsWith('0')) bank = BANKS_DATABASE['021000021']; // Chase
                    else if (routing.startsWith('1')) bank = BANKS_DATABASE['121000358']; // BOA
                    else if (routing.startsWith('2')) bank = BANKS_DATABASE['021000089']; // Citi
                    else if (routing.startsWith('3')) bank = BANKS_DATABASE['122000247']; // Wells
                }

                setDetectedBank(bank || { name: 'Unknown Institution', logo: '', color: 'bg-gray-600' });
                setManualRecipient(prev => ({ ...prev, bankName: bank ? bank.name : 'Unknown Bank' }));
                setIsCheckingBank(false);
            }, 800);
            return () => clearTimeout(timer);
        } else {
            setDetectedBank(null);
        }
    }, [manualRecipient.routingNumber]);

    // STRICT ITCC VALIDATION
    const isItccValid = (code: string) => code.trim().toUpperCase() === 'ITCC-8X92-226';

    const handleContinueAttempt = () => {
        const isRecipientValid = recipientMode === 'contact' 
            ? !!selectedContact 
            : (manualRecipient.name && manualRecipient.routingNumber.length >= 9 && manualRecipient.accountNumber.length >= 4);

        if (!isRecipientValid || !amount || parseFloat(amount) <= 0) return;

        if (isItccValid(itccCode)) {
            setStep(2);
        } else {
            setShowComplianceModal(true);
        }
    };

    const processingSteps = [
        "Initiating Secure Handshake (TLS 1.3)",
        "Verifying Biometric Token",
        "Checking Liquidity & Daily Limits",
        "Running AML/KYC Sanctions Screen",
        "Generating UETR Reference",
        "Transmitting to Clearing House",
        "Settlement Confirmed"
    ];

    const handleInitiateAuthorization = () => {
        setShowPinModal(true);
    };

    const handlePinSuccess = () => {
        setShowPinModal(false);
        startProcessing();
    };

    const startProcessing = () => {
        setShowProcessingModal(true);
        setProcessingStep(0);
        
        const amt = parseFloat(amount);
        const converted = amt * simulatedRate;
        
        const finalRecipientName = recipientMode === 'contact' ? selectedContact?.name : manualRecipient.name;
        const finalRecipientLogo = recipientMode === 'contact' 
            ? selectedContact?.avatarUrl 
            : (detectedBank?.logo || 'https://img.icons8.com/ios-filled/50/ffffff/bank-building.png');

        let step = 0;
        const interval = setInterval(() => {
            step++;
            setProcessingStep(step);
            if (step >= processingSteps.length) {
                clearInterval(interval);
                setTimeout(() => {
                    const newReceiptData = {
                        vendor: `Payment to ${finalRecipientName}`,
                        vendorLogo: finalRecipientLogo || '',
                        date: new Date().toISOString(),
                        total: amt,
                        category: 'Transfers',
                        items: [
                            { name: `Transfer to ${finalRecipientName}`, quantity: 1, price: amt, description: targetCurrency !== 'USD' ? `Converted to ${new Intl.NumberFormat('en-US', { style: 'currency', currency: targetCurrency }).format(converted)}` : undefined },
                            ...(recipientMode === 'manual' ? [{ name: `Dest: ${manualRecipient.bankName} (****${manualRecipient.accountNumber.slice(-4)})`, quantity: 1, price: 0 }] : [])
                        ]
                    };
                    setReceiptData({ ...newReceiptData, id: `TX-${Date.now()}` });
                    setShowProcessingModal(false);
                    setShowReceipt(true);
                }, 800);
            }
        }, 1200);
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
    const settlementDate = new Date(); 
    const settlementDateStr = settlementDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const handleManualChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setManualRecipient(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="animate-fade-in-scale-up max-w-4xl mx-auto relative">
            {step === 1 && (
                <>
                    <div className="mb-8">
                        <div className="flex justify-between items-end mb-3">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Select Recipient</label>
                            {recipientMode === 'manual' && (
                                <button onClick={() => setRecipientMode('contact')} className="text-xs text-blue-400 hover:text-white font-bold">
                                    <i className="fas fa-users mr-1"></i> Back to Contacts
                                </button>
                            )}
                        </div>
                        
                        {recipientMode === 'contact' ? (
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                <button 
                                    onClick={() => { setRecipientMode('manual'); setSelectedContact(null); }}
                                    className="flex flex-col items-center justify-center min-w-[80px] h-[100px] rounded-xl bg-white/5 border-2 border-dashed border-white/20 hover:border-yellow-400 hover:text-yellow-400 text-gray-400 transition-all group"
                                >
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
                        ) : (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-fade-in-up">
                                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                    <i className="fas fa-university text-yellow-400"></i> New Recipient Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Recipient Legal Name</label>
                                        <input type="text" name="name" value={manualRecipient.name} onChange={handleManualChange} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-yellow-400 outline-none" placeholder="Full Name" />
                                    </div>
                                    
                                    {/* Full Address Block */}
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Address Line 1</label>
                                        <input type="text" name="address" value={manualRecipient.address} onChange={handleManualChange} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-yellow-400 outline-none" placeholder="Street Address" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">City</label>
                                        <input type="text" name="city" value={manualRecipient.city} onChange={handleManualChange} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-yellow-400 outline-none" placeholder="City" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">State / Province</label>
                                        <input type="text" name="state" value={manualRecipient.state} onChange={handleManualChange} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-yellow-400 outline-none" placeholder="State" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Zip / Postal Code</label>
                                        <input type="text" name="zip" value={manualRecipient.zip} onChange={handleManualChange} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-yellow-400 outline-none" placeholder="Zip" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Country</label>
                                        <select name="country" value={manualRecipient.country} onChange={handleManualChange} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-400 outline-none">
                                            <option>United States</option><option>United Kingdom</option><option>Canada</option><option>Germany</option><option>France</option>
                                        </select>
                                    </div>

                                    <div className="col-span-2 h-px bg-white/10 my-2"></div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Routing / ABA Number</label>
                                        <div className="relative">
                                            <input type="text" name="routingNumber" value={manualRecipient.routingNumber} onChange={handleManualChange} className={`w-full bg-black/20 border rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none ${detectedBank ? 'border-green-500/50 focus:border-green-500' : 'border-white/10 focus:border-yellow-400'}`} placeholder="9 Digits" maxLength={9} />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                {isCheckingBank ? <i className="fas fa-circle-notch fa-spin text-yellow-400"></i> : detectedBank ? <i className="fas fa-check-circle text-green-400"></i> : null}
                                            </div>
                                        </div>
                                        {detectedBank && <div className="mt-2 flex items-center gap-2"><img src={detectedBank.logo} className="w-4 h-4 rounded-full bg-white" /><span className="text-xs text-gray-300 font-bold">{detectedBank.name}</span></div>}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Account Number</label>
                                        <input type="text" name="accountNumber" value={manualRecipient.accountNumber} onChange={handleManualChange} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-yellow-400 outline-none" placeholder="10-12 Digits" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
                        <div className="flex flex-col md:flex-row gap-6">
                             <div className="flex-grow">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">You Send (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500">$</span>
                                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-3xl font-mono font-bold text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all" placeholder="0.00" />
                                </div>
                             </div>
                             <div className="md:w-1/3">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recipient Receives</label>
                                <select className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 text-sm font-bold text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all appearance-none" onChange={e => setTargetCurrency(e.target.value)} value={targetCurrency}>
                                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.flag})</option>)}
                                </select>
                             </div>
                        </div>
                        
                        {targetCurrency !== 'USD' && amountNum > 0 && (
                             <div className="mt-3 flex items-center justify-between text-xs text-gray-400 px-1">
                                 <span>Exchange Rate: 1 USD ≈ {simulatedRate.toFixed(4)} {targetCurrency}</span>
                                 <span className="text-green-400 font-bold">Est. Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: targetCurrency }).format(convertedAmount)}</span>
                             </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-white/5">
                             <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">From Account</label>
                                <select className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all appearance-none" onChange={e => setFromAccount(ACCOUNTS.find(a => a.id === e.target.value) || ACCOUNTS[0])} value={fromAccount.id}>
                                    {ACCOUNTS.filter(a => a.type !== 'Credit').map(acc => (
                                        <option key={acc.id} value={acc.id}>{acc.type} (...{acc.number.slice(-4)})</option>
                                    ))}
                                </select>
                             </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Note (Optional)</label>
                                <input type="text" value={note} onChange={e => setNote(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all" placeholder="Reference / Memo" />
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                                <span>ITCC Code</span>
                                {itccCode && isItccValid(itccCode) && <span className="text-green-400"><i className="fas fa-check"></i> Valid</span>}
                            </label>
                            <input type="text" value={itccCode} onChange={e => setItccCode(e.target.value)} className={`w-full bg-black/20 border rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 focus:ring-1 transition-all uppercase font-mono tracking-wider ${itccCode && isItccValid(itccCode) ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500' : 'border-white/10 focus:border-yellow-400 focus:ring-yellow-400'}`} placeholder="Required for transfer" />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button 
                            onClick={handleContinueAttempt} 
                            disabled={(recipientMode === 'contact' && !selectedContact) || (recipientMode === 'manual' && (!manualRecipient.name || !manualRecipient.routingNumber)) || amountNum <= 0}
                            className="px-8 py-4 rounded-xl bg-yellow-400 text-[#1a365d] font-bold hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                        >
                            <span>Review Transfer</span>
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </>
            )}

            <ItccComplianceModal 
                isOpen={showComplianceModal} 
                onClose={() => setShowComplianceModal(false)} 
                onSuccess={(code) => {
                    setItccCode(code);
                    setShowComplianceModal(false);
                    setStep(2);
                }}
            />

            {/* STEP 2: PROFESSIONAL REVIEW */}
            {step === 2 && (
                <div className="max-w-3xl mx-auto">
                    <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-8 shadow-2xl mb-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#e6b325]"></div>
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-white">Transaction Authorization</h3>
                                <p className="text-xs text-gray-400 font-mono">ORDER ID: {quoteId || 'TX-PENDING'}</p>
                            </div>
                            <div className="text-right">
                                <div className="inline-block px-3 py-1 rounded border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-[10px] font-bold uppercase tracking-wider mb-1">Verification Pending</div>
                                <p className="text-[10px] text-gray-500">{new Date().toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Remitter Section */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">Remitter Details</h4>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="font-bold text-white text-sm">{USER_SETTINGS.profile.fullName}</p>
                                    <p className="text-xs text-gray-400 mt-1">{USER_SETTINGS.profile.address}</p>
                                    <p className="text-xs text-gray-400">{USER_SETTINGS.profile.phone}</p>
                                    <div className="mt-3 pt-3 border-t border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Source Account</p>
                                        <p className="text-xs text-white">{fromAccount.type} ****{fromAccount.number.slice(-4)}</p>
                                        <p className="text-[10px] text-gray-500">Swedish Construction Bank</p>
                                    </div>
                                </div>
                            </div>

                            {/* Beneficiary Section */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">Beneficiary Details</h4>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="font-bold text-white text-sm">{recipientMode === 'contact' ? selectedContact?.name : manualRecipient.name}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {recipientMode === 'contact' ? 'Registered Contact Address' : `${manualRecipient.address}, ${manualRecipient.city}, ${manualRecipient.state} ${manualRecipient.zip}`}
                                    </p>
                                    <p className="text-xs text-gray-400">{recipientMode === 'contact' ? 'USA' : manualRecipient.country}</p>
                                    <div className="mt-3 pt-3 border-t border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Destination Bank</p>
                                        <p className="text-xs text-white">{recipientMode === 'manual' ? manualRecipient.bankName : 'External Bank'}</p>
                                        {recipientMode === 'manual' && <p className="text-[10px] text-gray-500">Acct: {manualRecipient.accountNumber}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/30 rounded-xl p-6 border border-white/10 mb-8">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Total Debit Amount</p>
                                    <p className="text-3xl font-mono font-bold text-white">{formatCurrency(amountNum)}</p>
                                    {targetCurrency !== 'USD' && <p className="text-xs text-blue-400 mt-1">FX Rate: 1 USD = {simulatedRate.toFixed(4)} {targetCurrency}</p>}
                                    <div className="mt-2 border-t border-white/5 pt-2">
                                        <div className="flex justify-between text-[10px] text-gray-400 gap-4">
                                            <span>Quote ID: {quoteId}</span>
                                            <span>Inverse: 1 {targetCurrency} = {inverseRate} USD</span>
                                            <span>Source: USD (United States Dollar)</span>
                                            <span>Target: {targetCurrency} ({targetCurrency === 'EUR' ? 'Euro' : targetCurrency === 'GBP' ? 'British Pound' : 'Japanese Yen'})</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                     <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Value Date</p>
                                     <p className="text-sm font-bold text-white">{settlementDateStr}</p>
                                </div>
                            </div>
                        </div>

                        {/* Legal & Consent */}
                        <div className="space-y-4 mb-8">
                            <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-xl">
                                <h5 className="text-xs font-bold text-red-400 uppercase mb-2"><i className="fas fa-exclamation-triangle mr-1"></i> Declaration of Intent</h5>
                                <p className="text-[10px] text-gray-400 leading-relaxed text-justify">
                                    By authorizing this transfer, I certify that I am the owner of the source account and have verified the beneficiary details. I understand that international and inter-bank transfers may be irrevocable once executed. I acknowledge that this transaction is subject to AML/KYC screening and international sanctions regulations. I agree to the applicable fees and exchange rates.
                                </p>
                            </div>
                            
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${consentAgreed ? 'bg-green-500 border-green-500' : 'border-gray-500 group-hover:border-white'}`}>
                                    <input type="checkbox" className="hidden" checked={consentAgreed} onChange={() => setConsentAgreed(!consentAgreed)} />
                                    {consentAgreed && <i className="fas fa-check text-xs text-black"></i>}
                                </div>
                                <span className="text-xs text-gray-300 select-none">I authorize this transfer and certify that the beneficiary information is correct. I understand that this transaction may be irrevocable once processed.</span>
                            </label>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="px-8 py-4 rounded-xl border border-white/20 text-gray-300 font-semibold hover:bg-white/5 transition-colors">Edit Details</button>
                            <button 
                                onClick={handleInitiateAuthorization} 
                                disabled={!consentAgreed}
                                className="flex-1 py-4 rounded-xl font-bold shadow-lg transition-all bg-gradient-to-r from-[#e6b325] to-[#d4a017] text-[#1a365d] hover:to-[#e6b325] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <i className="fas fa-fingerprint mr-2"></i> Authorize Transfer
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Modals */}
            <SecurityPinModal 
                isOpen={showPinModal} 
                onClose={() => setShowPinModal(false)} 
                onSuccess={handlePinSuccess} 
            />
            
            <TransferProcessingModal isOpen={showProcessingModal} steps={processingSteps} currentStep={processingStep} />

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
