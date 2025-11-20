
import React, { useState, useEffect, useMemo } from 'react';
import { Chart, registerables } from 'chart.js';
import { INTERNATIONAL_ACCOUNTS, INTERNATIONAL_TRANSFERS, CURRENCY_RATES } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { ViewType } from '../../types';
import { CURRENCIES } from '../../i18n';

Chart.register(...registerables);

interface GlobalNetworkViewProps {
    setActiveView: (view: ViewType) => void;
}

// --- FX Terminal Component ---
const FxTerminal: React.FC = () => {
    const [base, setBase] = useState('USD');
    const [quote, setQuote] = useState('EUR');
    const [amount, setAmount] = useState('10000');
    const [rate, setRate] = useState(0.9245);
    const [trend, setTrend] = useState<number[]>([0.9240, 0.9242, 0.9238, 0.9244, 0.9241, 0.9245]);
    const [flash, setFlash] = useState<'up' | 'down' | null>(null);
    const [tradeStatus, setTradeStatus] = useState<'idle' | 'executing' | 'success'>('idle');

    // Simulate Live Market Data
    useEffect(() => {
        const interval = setInterval(() => {
            const volatility = 0.0005;
            const change = (Math.random() * volatility * 2) - volatility;
            setRate(prev => {
                const newValue = prev + change;
                setFlash(newValue > prev ? 'up' : 'down');
                setTimeout(() => setFlash(null), 500);
                return newValue;
            });
            setTrend(prev => [...prev.slice(1), rate + change]);
        }, 2500);
        return () => clearInterval(interval);
    }, [rate]);

    const handleTrade = () => {
        setTradeStatus('executing');
        setTimeout(() => {
            setTradeStatus('success');
            setTimeout(() => setTradeStatus('idle'), 2000);
        }, 1500);
    };

    const converted = parseFloat(amount) * rate;

    return (
        <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
            
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <i className="fas fa-chart-area text-yellow-400"></i> Spot FX Desk
                </h3>
                <span className="flex items-center gap-2 px-2 py-1 rounded bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Market Open
                </span>
            </div>

            {tradeStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center h-64 animate-fade-in-scale-up">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                        <i className="fas fa-check text-4xl text-green-400"></i>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Trade Executed</h4>
                    <p className="text-gray-400 text-sm">Sold {formatCurrency(parseFloat(amount), base)} for {formatCurrency(converted, quote)}</p>
                    <p className="text-xs text-gray-500 mt-1 font-mono">@ {rate.toFixed(5)}</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                            <div className="flex justify-between text-xs text-gray-400 mb-2 uppercase font-bold">
                                <span>Sell {base}</span>
                                <span>Bal: $142,050.00</span>
                            </div>
                            <div className="flex gap-2">
                                <select 
                                    value={base} 
                                    onChange={e => setBase(e.target.value)}
                                    className="bg-white/10 border-none rounded-lg text-white font-bold focus:ring-0 cursor-pointer"
                                >
                                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                                </select>
                                <input 
                                    type="number" 
                                    value={amount} 
                                    onChange={e => setAmount(e.target.value)} 
                                    className="w-full bg-transparent text-right text-2xl font-mono font-bold text-white focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                            <div className="flex justify-between text-xs text-gray-400 mb-2 uppercase font-bold">
                                <span>Buy {quote}</span>
                                <span>Indicative</span>
                            </div>
                            <div className="flex gap-2 items-center justify-between h-full">
                                <select 
                                    value={quote} 
                                    onChange={e => setQuote(e.target.value)}
                                    className="bg-white/10 border-none rounded-lg text-white font-bold focus:ring-0 cursor-pointer"
                                >
                                     {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                                </select>
                                <span className="text-2xl font-mono font-bold text-yellow-400">
                                    {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(converted)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Live Rate Display */}
                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Spot Rate ({base}/{quote})</p>
                            <div className={`text-3xl font-mono font-bold transition-colors duration-300 ${flash === 'up' ? 'text-green-400' : flash === 'down' ? 'text-red-400' : 'text-white'}`}>
                                {rate.toFixed(5)}
                                <span className="text-lg ml-2 opacity-50">
                                    {flash === 'up' ? <i className="fas fa-caret-up"></i> : flash === 'down' ? <i className="fas fa-caret-down"></i> : null}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex items-end gap-1 h-12">
                            {trend.map((val, i) => (
                                <div 
                                    key={i} 
                                    className={`w-2 rounded-t ${val >= trend[i-1] ? 'bg-green-500/50' : 'bg-red-500/50'}`} 
                                    style={{ height: `${((val - (rate * 0.999)) / (rate * 0.002)) * 100}%` }}
                                ></div>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleTrade}
                        disabled={tradeStatus !== 'idle'}
                        className="w-full py-4 rounded-xl bg-[#e6b325] hover:bg-[#d4a017] text-[#1a365d] font-bold text-lg shadow-lg shadow-yellow-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                    >
                        {tradeStatus === 'executing' ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-bolt"></i>}
                        {tradeStatus === 'executing' ? 'Executing...' : 'Execute Trade'}
                    </button>
                     <p className="text-center text-[10px] text-gray-500 mt-3">Quotes update every 2.5s. Final execution rate may vary.</p>
                 </>
            )}
        </div>
    );
};

// --- Network Map Node ---
const NetworkNode: React.FC<{ city: string; x: string; y: string; status: 'active' | 'latency'; delay: string }> = ({ city, x, y, status, delay }) => (
    <div className="absolute group cursor-pointer" style={{ top: y, left: x }}>
        <div className="relative flex items-center justify-center">
            <div className={`w-3 h-3 rounded-full ${status === 'active' ? 'bg-blue-500' : 'bg-yellow-500'} shadow-[0_0_10px_currentColor] z-10`}></div>
            <div className={`absolute w-8 h-8 rounded-full ${status === 'active' ? 'bg-blue-500' : 'bg-yellow-500'} opacity-20 animate-ping`}></div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs p-2 rounded border border-white/20 whitespace-nowrap z-20 shadow-xl">
                <p className="font-bold">{city}</p>
                <p className="text-[10px] text-gray-400 font-mono">Latency: {delay}</p>
                <p className="text-[10px] text-green-400">Status: Operational</p>
            </div>
        </div>
    </div>
);

const GlobalLiquidityMap: React.FC = () => {
    return (
        <div className="bg-[#0f172a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl h-full relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <h3 className="text-white font-bold">Global Liquidity Network</h3>
                    <p className="text-xs text-gray-400">Real-time connection status</p>
                </div>
                <div className="flex gap-3 text-[10px] font-mono text-gray-400">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> SCB Hub</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Partner Node</span>
                </div>
            </div>

            {/* Map Container */}
            <div className="relative w-full h-[300px] mt-6 opacity-80">
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg" 
                    className="w-full h-full object-contain opacity-20 invert grayscale" 
                    alt="World Map"
                />
                
                {/* Nodes */}
                <NetworkNode city="New York (HQ)" x="28%" y="35%" status="active" delay="1ms" />
                <NetworkNode city="London" x="48%" y="25%" status="active" delay="32ms" />
                <NetworkNode city="Frankfurt" x="51%" y="28%" status="active" delay="36ms" />
                <NetworkNode city="Tokyo" x="85%" y="35%" status="active" delay="89ms" />
                <NetworkNode city="Singapore" x="78%" y="55%" status="latency" delay="112ms" />
                <NetworkNode city="Sydney" x="90%" y="75%" status="active" delay="145ms" />
                
                {/* Connecting Lines (SVG Overlay) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path d="M 180 110 Q 300 50 320 90" stroke="url(#gradientLine)" strokeWidth="1" fill="none" className="animate-pulse" />
                    <defs>
                        <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
                            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.5)" />
                            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4 border-t border-white/10 pt-4">
                 {INTERNATIONAL_ACCOUNTS.slice(0, 3).map(acc => (
                     <div key={acc.id} className="text-center">
                         <p className="text-[10px] text-gray-400 uppercase">{acc.country}</p>
                         <p className="text-sm font-bold text-white">{formatCurrency(acc.balance, acc.currency)}</p>
                     </div>
                 ))}
            </div>
        </div>
    );
};

const SwiftTracker: React.FC = () => {
    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-satellite-dish text-blue-400"></i> SWIFT Monitor
            </h3>
            <div className="space-y-4">
                {INTERNATIONAL_TRANSFERS.slice(0, 3).map((transfer, idx) => (
                    <div key={transfer.id} className="bg-black/20 rounded-lg p-3 relative overflow-hidden group">
                        <div className="flex justify-between items-start relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-[#1a365d] flex items-center justify-center text-white text-xs font-bold">
                                    {transfer.currency}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{transfer.recipient}</p>
                                    <p className="text-[10px] text-gray-400">REF: {transfer.id.toUpperCase()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-white">{formatCurrency(transfer.amountUSD)}</p>
                                <p className="text-[10px] text-green-400">Clearing...</p>
                            </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-3 h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-blue-500 relative overflow-hidden" 
                                style={{ width: idx === 0 ? '75%' : '45%' }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_1s_infinite]"></div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-1 text-[9px] text-gray-500 uppercase font-bold">
                            <span>Initiated</span>
                            <span>Compliance</span>
                            <span className={idx === 0 ? 'text-blue-400' : ''}>Clearing</span>
                            <span>Settled</span>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 py-2 text-xs font-bold text-gray-400 hover:text-white border border-dashed border-gray-600 rounded hover:border-gray-400 transition-colors">
                View All Messages
            </button>
        </div>
    );
};


const GlobalNetworkView: React.FC<GlobalNetworkViewProps> = ({ setActiveView }) => {
    return (
        <div className="relative min-h-full bg-[#0b1120] text-white font-sans">
             {/* Professional Background */}
            <div 
                className="absolute inset-0 z-0 opacity-20"
                style={{ 
                    backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b1120]/90 via-[#0b1120]/95 to-[#0b1120]"></div>

            <div className="relative z-10 p-8 max-w-[1800px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-6 border-b border-white/10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-bold tracking-tight text-white">Global Treasury</h1>
                            <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-blue-500/20">
                                Institutional
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">Cross-border liquidity management and FX execution.</p>
                    </div>
                    
                    <div className="flex gap-4 mt-4 md:mt-0">
                         <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">NY Session</p>
                            <p className="text-sm font-bold text-green-400">● Active</p>
                         </div>
                         <div className="h-8 w-px bg-white/10"></div>
                         <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">London</p>
                            <p className="text-sm font-bold text-green-400">● Closing</p>
                         </div>
                         <div className="h-8 w-px bg-white/10"></div>
                         <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Tokyo</p>
                            <p className="text-sm font-bold text-red-400">○ Closed</p>
                         </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left: FX Terminal & Accounts */}
                    <div className="xl:col-span-1 space-y-8">
                        <FxTerminal />
                        <SwiftTracker />
                    </div>

                    {/* Right: Map & Liquidity */}
                    <div className="xl:col-span-2 space-y-8 flex flex-col">
                        <div className="flex-grow min-h-[400px]">
                             <GlobalLiquidityMap />
                        </div>
                        
                        {/* Partner Bank List (Compact) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                 <div className="flex justify-between items-center mb-4">
                                     <h4 className="font-bold text-white">Correspondent Banks</h4>
                                     <button className="text-xs text-blue-400 hover:text-white">Manage</button>
                                 </div>
                                 <div className="space-y-3">
                                     <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded cursor-pointer">
                                         <div className="flex items-center gap-3">
                                             <img src="https://logo.clearbit.com/barclays.co.uk" className="w-6 h-6 rounded-full bg-white" />
                                             <span className="text-sm text-gray-300">Barclays UK</span>
                                         </div>
                                         <span className="text-xs text-green-400">Connected</span>
                                     </div>
                                     <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded cursor-pointer">
                                         <div className="flex items-center gap-3">
                                             <img src="https://logo.clearbit.com/db.com" className="w-6 h-6 rounded-full bg-white" />
                                             <span className="text-sm text-gray-300">Deutsche Bank</span>
                                         </div>
                                         <span className="text-xs text-green-400">Connected</span>
                                     </div>
                                 </div>
                             </div>

                             <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 rounded-xl p-5 flex items-center justify-between">
                                 <div>
                                     <h4 className="font-bold text-white">Global ATM Access</h4>
                                     <p className="text-xs text-gray-400 mt-1">Fee-free withdrawals at 55,000+ locations.</p>
                                     <button className="mt-3 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors">
                                         Find Near Me
                                     </button>
                                 </div>
                                 <i className="fas fa-map-marked-alt text-4xl text-white/20"></i>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default GlobalNetworkView;
