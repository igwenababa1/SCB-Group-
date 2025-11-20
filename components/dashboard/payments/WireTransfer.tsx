
import React, { useState, useMemo, useEffect } from 'react';
import { ACCOUNTS, CURRENCY_RATES } from '../../../constants';
import type { ViewType } from '../../../types';
import { useDashboard } from '../../../contexts/DashboardContext';
import { formatCurrency } from '../../../utils/formatters';
import { CURRENCIES } from '../../../i18n';

interface WireTransferProps {
    setActiveView: (view: ViewType) => void;
}

const WireTransfer: React.FC<WireTransferProps> = ({ setActiveView }) => {
    const { addReceiptAndNavigate } = useDashboard();
    const [wireType, setWireType] = useState<'domestic' | 'international'>('domestic');
    const [formData, setFormData] = useState({
        fromAccount: ACCOUNTS[0].id,
        recipientName: '',
        recipientAddress: '',
        bankName: '',
        routingNumber: '',
        swiftCode: '',
        accountNumber: '',
        amount: '',
        memo: '',
    });
    const [isConfirming, setIsConfirming] = useState(false);
    const [toCurrency, setToCurrency] = useState(CURRENCY_RATES.length > 0 ? CURRENCY_RATES[0].code : 'EUR');
    
    // Real-time Rate Simulation State
    const [liveRate, setLiveRate] = useState(0);
    const [lockedRate, setLockedRate] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isRateExpired, setIsRateExpired] = useState(false);

    // Quote Metadata
    const quoteId = useMemo(() => isConfirming ? `FXQ-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : '', [isConfirming]);
    const valueDate = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + 2); // T+2 standard spot settlement
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }, [isConfirming]);

    // Initialize and Fluctuate Rate
    useEffect(() => {
        const baseRate = CURRENCY_RATES.find(r => r.code === toCurrency)?.rate || 1;
        setLiveRate(baseRate);

        const interval = setInterval(() => {
            if (!isConfirming) {
                // Fluctuate by +/- 0.05%
                const fluctuation = (Math.random() - 0.5) * (baseRate * 0.001); 
                setLiveRate(prev => Number((baseRate + fluctuation).toFixed(4)));
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [toCurrency, isConfirming]);

    // Countdown Timer for Locked Rate
    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (isConfirming && !isRateExpired && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setIsRateExpired(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isConfirming, isRateExpired, timeLeft]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setToCurrency(e.target.value);
    };

    const handleReview = () => {
        setLockedRate(liveRate);
        setTimeLeft(60);
        setIsRateExpired(false);
        setIsConfirming(true);
    };

    const handleRefreshRate = () => {
        const baseRate = CURRENCY_RATES.find(r => r.code === toCurrency)?.rate || 1;
        // New random rate close to base
        const newRate = Number((baseRate + (Math.random() - 0.5) * (baseRate * 0.001)).toFixed(4));
        setLiveRate(newRate);
        setLockedRate(newRate);
        setTimeLeft(60);
        setIsRateExpired(false);
    };

    const amountNum = parseFloat(formData.amount) || 0;
    const fromAccountDetails = ACCOUNTS.find(a => a.id === formData.fromAccount);

    // Calculations
    const effectiveRate = isConfirming && lockedRate ? lockedRate : liveRate;
    const convertedAmount = wireType === 'international' ? amountNum * effectiveRate : amountNum;
    const inverseRate = effectiveRate > 0 ? (1 / effectiveRate).toFixed(5) : '0.00000';

    // Fees Calculation
    const fixedFee = 25.00;
    const intermediaryFee = wireType === 'international' ? 18.00 : 0;
    const marginRate = 0.0075; // 0.75%
    const exchangeMargin = wireType === 'international' ? amountNum * marginRate : 0;
    const totalDebit = amountNum + fixedFee + intermediaryFee;

    // Visual Breakdown Calculations
    const totalVisualCost = amountNum + fixedFee + intermediaryFee + exchangeMargin;
    const principalPct = totalVisualCost > 0 ? (amountNum / totalVisualCost) * 100 : 0;
    const feesPct = totalVisualCost > 0 ? ((fixedFee + intermediaryFee) / totalVisualCost) * 100 : 0;
    const marginPct = totalVisualCost > 0 ? (exchangeMargin / totalVisualCost) * 100 : 0;

    const handleConfirm = () => {
        const newReceipt = {
            vendor: `Wire to ${formData.recipientName}`,
            vendorLogo: 'https://img.icons8.com/ios-filled/50/000000/bank.png',
            date: new Date().toISOString(),
            total: totalDebit,
            category: 'Wire Transfer',
            items: [
                { name: `Principal Amount`, quantity: 1, price: amountNum },
                { name: `Network Fee`, quantity: 1, price: fixedFee },
                ...(intermediaryFee > 0 ? [{ name: `Intermediary Bank Fee`, quantity: 1, price: intermediaryFee }] : []),
                { name: `Memo: "${formData.memo || 'N/A'}"`, quantity: 1, price: 0 },
                ...(wireType === 'international' ? [{ name: `Exchange Rate (Locked)`, quantity: 1, price: 0, description: `1 USD = ${effectiveRate} ${toCurrency}` }] : [])
            ],
        };
        addReceiptAndNavigate(newReceipt, setActiveView);
    };

    const InputField = ({ label, name, placeholder, type = "text", value }: any) => (
        <div className="group">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 group-focus-within:text-yellow-400 transition-colors">{label}</label>
            <input 
                type={type} 
                name={name} 
                value={value} 
                onChange={handleChange} 
                placeholder={placeholder} 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all" 
            />
        </div>
    );

    if (isConfirming) {
        return (
             <div className="animate-fade-in-scale-up max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Verify Wire Details</h3>
                    
                    <div className="space-y-6">
                        {/* Rate Lock Timer */}
                        {wireType === 'international' && (
                            <div className={`rounded-xl p-4 border transition-all ${isRateExpired ? 'bg-red-500/10 border-red-500/30' : 'bg-[#0b1120]/80 border-blue-500/30'}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <i className={`fas ${isRateExpired ? 'fa-lock-open' : 'fa-lock'} ${isRateExpired ? 'text-red-400' : 'text-blue-400'}`}></i>
                                        <span className={`text-sm font-bold ${isRateExpired ? 'text-red-400' : 'text-blue-400'}`}>
                                            {isRateExpired ? 'Rate Expired' : 'Rate Secured'}
                                        </span>
                                    </div>
                                    <span className="text-xs font-mono text-gray-400">
                                        Expires in {timeLeft}s
                                    </span>
                                </div>
                                
                                {isRateExpired ? (
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-red-300">Market rates have changed.</span>
                                        <button 
                                            onClick={handleRefreshRate}
                                            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold rounded transition-colors flex items-center gap-1"
                                        >
                                            <i className="fas fa-sync-alt"></i> Refresh Rate
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mt-2">
                                        <div 
                                            className={`h-full transition-all duration-1000 ease-linear ${timeLeft < 10 ? 'bg-red-500' : 'bg-blue-500'}`} 
                                            style={{ width: `${(timeLeft / 60) * 100}%` }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Principal Amount</span>
                            <span className="text-2xl font-bold text-white">{formatCurrency(amountNum)}</span>
                        </div>

                        {wireType === 'international' && (
                            <div className="bg-[#0b1120] border border-white/10 rounded-xl p-5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-blue-400 text-xs font-bold uppercase tracking-widest">FX Spot Deal</h4>
                                    <span className="text-[10px] font-mono text-gray-500">ID: {quoteId}</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-y-3 text-sm">
                                    <div className="text-gray-400">Source Currency</div>
                                    <div className="text-white font-mono text-right">USD (United States Dollar)</div>

                                    <div className="text-gray-400">Target Currency</div>
                                    <div className="text-white font-mono text-right">{toCurrency}</div>
                                    
                                    <div className="text-gray-400">Spot Rate</div>
                                    <div className="text-white font-mono text-right font-bold text-yellow-400">{effectiveRate.toFixed(5)}</div>
                                    
                                    <div className="text-gray-400">Inverse Rate</div>
                                    <div className="text-white font-mono text-right">1 {toCurrency} = {inverseRate} USD</div>
                                    
                                    <div className="text-gray-400">Value Date</div>
                                    <div className="text-white text-right font-mono">{valueDate} (T+2)</div>
                                </div>

                                <div className="border-t border-white/10 mt-4 pt-3 flex justify-between items-center">
                                    <span className="text-blue-200 font-bold text-sm">Contra Amount (Credit)</span>
                                    <span className="font-bold text-xl text-white">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: toCurrency }).format(convertedAmount)}
                                    </span>
                                </div>
                            </div>
                        )}
                        
                        {/* Fee Breakdown Visualization */}
                        <div className="bg-white/5 rounded-xl p-5 border border-white/10 mt-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <i className="fas fa-chart-pie"></i> Transfer Cost Breakdown
                            </h4>
                            
                            {/* Visual Bar */}
                            <div className="flex h-4 rounded-full overflow-hidden mb-5 bg-gray-800 border border-white/5">
                                <div className="bg-blue-500 h-full transition-all duration-1000 relative group" style={{ width: `${principalPct}%` }} title="Principal">
                                     <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black border border-white/10 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">Principal: {principalPct.toFixed(1)}%</div>
                                </div>
                                <div className="bg-yellow-500 h-full transition-all duration-1000 relative group" style={{ width: `${feesPct}%` }} title="Fees">
                                     <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black border border-white/10 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">Fees: {feesPct.toFixed(1)}%</div>
                                </div>
                                {wireType === 'international' && (
                                    <div className="bg-purple-500 h-full transition-all duration-1000 relative group" style={{ width: `${marginPct}%` }} title="FX Margin">
                                         <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black border border-white/10 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">Margin: {marginPct.toFixed(1)}%</div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-2 text-gray-300 text-xs">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div> Principal
                                    </span>
                                    <span className="font-mono text-white">{formatCurrency(amountNum)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-2 text-gray-300 text-xs">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Network Fee
                                    </span>
                                    <span className="font-mono text-white">{formatCurrency(fixedFee)}</span>
                                </div>
                                {wireType === 'international' && (
                                    <>
                                        <div className="flex justify-between items-center">
                                             <span className="flex items-center gap-2 text-gray-300 text-xs">
                                                <div className="w-2 h-2 rounded-full bg-yellow-600"></div> Intermediary (Est.)
                                            </span>
                                            <span className="font-mono text-white">{formatCurrency(intermediaryFee)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="flex items-center gap-2 text-gray-300 text-xs" title="Embedded in exchange rate">
                                                <div className="w-2 h-2 rounded-full bg-purple-500"></div> Exchange Margin ({ (marginRate * 100).toFixed(2) }%)
                                            </span>
                                             <span className="font-mono text-white/70 italic">{formatCurrency(exchangeMargin)}</span>
                                        </div>
                                    </>
                                )}
                                <div className="border-t border-white/10 pt-3 flex justify-between items-center mt-2">
                                    <span className="font-bold text-white uppercase text-xs tracking-wider">Total Debit</span>
                                    <span className="font-bold text-xl text-white">{formatCurrency(totalDebit)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-4 text-sm border-t border-white/10 pt-4">
                             <div><p className="text-gray-500">From Account</p><p className="font-semibold text-white">{fromAccountDetails?.type} (••• {fromAccountDetails?.number.slice(-4)})</p></div>
                             <div className="text-right"><p className="text-gray-500">Routing/SWIFT</p><p className="font-semibold text-white font-mono">{wireType === 'domestic' ? formData.routingNumber : formData.swiftCode}</p></div>
                             
                             <div><p className="text-gray-500">Beneficiary Name</p><p className="font-semibold text-white">{formData.recipientName}</p></div>
                             <div className="text-right"><p className="text-gray-500">Beneficiary Bank</p><p className="font-semibold text-white">{formData.bankName}</p></div>
                             
                             <div className="col-span-2"><p className="text-gray-500">Account Number / IBAN</p><p className="font-semibold text-white font-mono tracking-wide">{formData.accountNumber}</p></div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
                        <button onClick={() => setIsConfirming(false)} className="flex-1 py-3 rounded-lg text-gray-300 border border-white/20 hover:bg-white/10 font-semibold transition-colors">Edit</button>
                        <button 
                            onClick={handleConfirm} 
                            disabled={isRateExpired}
                            className={`flex-1 py-3 rounded-lg font-bold shadow-lg transition-colors ${isRateExpired ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-yellow-400 text-[#1a365d] hover:bg-yellow-300'}`}
                        >
                            {isRateExpired ? 'Rate Expired' : 'Execute Wire'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-scale-up max-w-3xl mx-auto">
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl mb-8 w-full max-w-md mx-auto">
                <button onClick={() => setWireType('domestic')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${wireType === 'domestic' ? 'bg-yellow-400 text-[#1a365d] shadow' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Domestic Wire</button>
                <button onClick={() => setWireType('international')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${wireType === 'international' ? 'bg-yellow-400 text-[#1a365d] shadow' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>International SWIFT</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <InputField label="Beneficiary Name" name="recipientName" value={formData.recipientName} placeholder="Legal Name" />
                 <InputField label="Beneficiary Address" name="recipientAddress" value={formData.recipientAddress} placeholder="Full Address" />
                 <InputField label="Beneficiary Bank" name="bankName" value={formData.bankName} placeholder="Bank Name" />
                 
                 {wireType === 'domestic' ? (
                    <InputField label="Routing Number (ABA)" name="routingNumber" value={formData.routingNumber} placeholder="9 Digits" />
                ) : (
                    <InputField label="SWIFT / BIC Code" name="swiftCode" value={formData.swiftCode} placeholder="8 or 11 Characters" />
                )}
                
                 <div className="md:col-span-2">
                    <InputField label="Account Number / IBAN" name="accountNumber" value={formData.accountNumber} placeholder="Account Number" />
                 </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                     <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Amount (USD)</label>
                        <div className="relative">
                             <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="0.00" className="w-full bg-[#0b1120] border border-white/20 rounded-lg pl-8 pr-4 py-3 text-white font-mono text-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400" />
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        </div>
                     </div>
                     
                     {wireType === 'international' && (
                         <div>
                             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Target Currency</label>
                             <select 
                                value={toCurrency} 
                                onChange={handleCurrencyChange} 
                                className="w-full bg-[#0b1120] border border-white/20 rounded-lg px-4 py-3 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 cursor-pointer appearance-none"
                            >
                                 {CURRENCIES.map(rate => <option key={rate.code} value={rate.code}>{rate.code} - {rate.code === 'EUR' ? 'Euro' : rate.code === 'GBP' ? 'British Pound' : 'Yen'}</option>)}
                             </select>
                         </div>
                     )}
                </div>
                 {wireType === 'international' && amountNum > 0 && (
                     <div className="mt-4 flex items-center justify-between text-sm text-gray-400 border-t border-white/10 pt-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span>Live Rate: 1 USD ≈ {liveRate.toFixed(4)} {toCurrency}</span>
                        </div>
                        <span className="text-yellow-400 font-bold">Est. Total: {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(convertedAmount)} {toCurrency}</span>
                     </div>
                 )}
            </div>
            
            <div className="flex justify-end">
                <button onClick={handleReview} disabled={amountNum <= 0} className="px-8 py-4 rounded-xl bg-yellow-400 text-[#1a365d] font-bold hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                    Review Wire Details
                </button>
            </div>
        </div>
    );
};

export default WireTransfer;
