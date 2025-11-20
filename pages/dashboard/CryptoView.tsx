
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { CRYPTO_HOLDINGS } from '../../constants';
import { formatCurrency } from '../../utils/formatters';
import type { CryptoHolding, ViewType } from '../../types';
import HoldingSparkline from '../../components/dashboard/investments/HoldingSparkline';
import WithdrawCryptoModal from '../../components/dashboard/crypto/WithdrawCryptoModal';

Chart.register(...registerables);

// --- Helper Components ---

const LivePrice: React.FC<{ value: number, previousValue: number, isCurrency?: boolean }> = ({ value, previousValue, isCurrency = true }) => {
    const [flash, setFlash] = useState<'up' | 'down' | null>(null);

    useEffect(() => {
        if (value > previousValue) {
            setFlash('up');
            setTimeout(() => setFlash(null), 600);
        } else if (value < previousValue) {
            setFlash('down');
            setTimeout(() => setFlash(null), 600);
        }
    }, [value, previousValue]);

    const colorClass = flash === 'up' ? 'text-green-400' : flash === 'down' ? 'text-red-400' : 'text-white';
    const bgClass = flash === 'up' ? 'bg-green-400/10' : flash === 'down' ? 'bg-red-400/10' : 'bg-transparent';

    return (
        <span className={`transition-all duration-300 px-1.5 py-0.5 rounded ${colorClass} ${bgClass} font-mono tracking-tight`}>
            {isCurrency ? formatCurrency(value) : value.toFixed(2)}
        </span>
    );
};

const NetworkStat: React.FC<{ label: string; value: string; icon: string; status?: 'optimal' | 'busy' | 'congested' }> = ({ label, value, icon, status }) => {
    const statusColors = {
        optimal: 'text-green-400 border-green-500/30 bg-green-500/10',
        busy: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
        congested: 'text-red-400 border-red-500/30 bg-red-500/10',
    };
    const colorClass = status ? statusColors[status] : 'text-blue-400 border-blue-500/30 bg-blue-500/10';

    return (
        <div className={`flex items-center justify-between p-3 rounded-lg border bg-white/5 border-white/10`}>
            <div className="flex items-center gap-3">
                <i className={`fas ${icon} text-gray-400`}></i>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
            </div>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${colorClass}`}>
                {value}
            </span>
        </div>
    );
};

const FearGreedMeter: React.FC<{ value: number }> = ({ value }) => {
    // 0 = Extreme Fear, 100 = Extreme Greed
    const rotation = (value / 100) * 180 - 90; // -90 to 90
    let label = "Neutral";
    let color = "text-gray-300";
    
    if (value >= 75) { label = "Ext. Greed"; color = "text-green-400"; }
    else if (value >= 55) { label = "Greed"; color = "text-green-300"; }
    else if (value <= 25) { label = "Ext. Fear"; color = "text-red-400"; }
    else if (value <= 45) { label = "Fear"; color = "text-red-300"; }

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-32 h-16 overflow-hidden mb-2">
                <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[8px] border-gray-700 border-b-0 border-r-0 border-l-0" style={{ transform: 'rotate(-45deg)' }}></div>
                {/* Gradient Arc approximation */}
                <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[8px] border-transparent border-t-red-500" style={{ transform: 'rotate(-45deg)', opacity: 0.6 }}></div>
                <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[8px] border-transparent border-r-yellow-500" style={{ transform: 'rotate(-45deg)', opacity: 0.6 }}></div>
                <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[8px] border-transparent border-b-green-500" style={{ transform: 'rotate(-45deg)', opacity: 0.6 }}></div>
                
                <div 
                    className="absolute bottom-0 left-1/2 w-1 h-16 bg-white origin-bottom transition-transform duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
                ></div>
                 <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-white rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
            </div>
            <div className="text-center">
                 <p className="text-2xl font-bold text-white">{value}</p>
                 <p className={`text-xs font-bold uppercase tracking-wider ${color}`}>{label}</p>
            </div>
        </div>
    );
};

interface CryptoViewProps {
    setActiveView: (view: ViewType) => void;
}

const CryptoView: React.FC<CryptoViewProps> = ({ setActiveView }) => {
    // Simulation State
    const [liveHoldings, setLiveHoldings] = useState<CryptoHolding[]>(CRYPTO_HOLDINGS);
    const [previousHoldings, setPreviousHoldings] = useState<CryptoHolding[]>(CRYPTO_HOLDINGS);
    const [btcPrice, setBtcPrice] = useState(66934.00);
    const [ethPrice, setEthPrice] = useState(3595.24);
    const [gasPrice, setGasPrice] = useState(18); // Gwei
    const [blockHeight, setBlockHeight] = useState(19420581);
    
    // UI State
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [selectedCrypto, setSelectedCrypto] = useState<CryptoHolding | null>(null);
    const [swapFrom, setSwapFrom] = useState('BTC');
    const [swapTo, setSwapTo] = useState('ETH');
    const [swapAmount, setSwapAmount] = useState('');

    // Chart Ref for Main Portfolio Area (if added later)
    
    // --- Live Simulation Effect ---
    useEffect(() => {
        const interval = setInterval(() => {
            setPreviousHoldings(liveHoldings);
            
            // Update Holdings
            const updatedHoldings = liveHoldings.map(h => {
                const volatility = 0.002; // 0.2% volatility
                const change = 1 + (Math.random() * volatility * 2 - volatility);
                const newPrice = h.priceUSD * change;
                
                // Update historical data (shift and push)
                const newHistory = [...h.historicalData.slice(1), newPrice];
                
                // Calculate new 24h change
                const openPrice = newHistory[0]; // Rough approximation
                const changePercent = ((newPrice - openPrice) / openPrice) * 100;

                return {
                    ...h,
                    priceUSD: newPrice,
                    balanceUSD: h.balanceCrypto * newPrice,
                    dayChangePercent: changePercent,
                    historicalData: newHistory
                };
            });
            setLiveHoldings(updatedHoldings);

            // Update Global Metrics
            setBtcPrice(p => p * (1 + (Math.random() * 0.001 * 2 - 0.001)));
            setEthPrice(p => p * (1 + (Math.random() * 0.0015 * 2 - 0.0015)));
            setGasPrice(g => Math.max(10, Math.min(50, g + Math.floor(Math.random() * 5 - 2))));
            setBlockHeight(b => b + (Math.random() > 0.7 ? 1 : 0));

        }, 3000);

        return () => clearInterval(interval);
    }, [liveHoldings]);

    const totalPortfolioValue = useMemo(() => liveHoldings.reduce((acc, h) => acc + h.balanceUSD, 0), [liveHoldings]);
    const prevTotalValue = useMemo(() => previousHoldings.reduce((acc, h) => acc + h.balanceUSD, 0), [previousHoldings]);
    const dayChangeValue = liveHoldings.reduce((acc, h) => acc + (h.balanceUSD - (h.balanceUSD / (1 + h.dayChangePercent/100))), 0);

    const handleOpenWithdrawModal = (crypto: CryptoHolding) => {
        setSelectedCrypto(crypto);
        setIsWithdrawModalOpen(true);
    };

    return (
        <div className="relative min-h-full bg-[#0b1120] text-white overflow-hidden font-sans selection:bg-blue-500/30">
            {/* Background */}
             <div 
                className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{ 
                    backgroundImage: "url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b1120]/90 via-[#0b1120]/95 to-[#0b1120]"></div>

            <div className="relative z-10 p-6 max-w-[1800px] mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-6 border-b border-white/10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-bold tracking-tight text-white">Digital Assets</h1>
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                Live Mainnet
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">Institutional-grade custody and trading terminal.</p>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">BTC Dominance</p>
                            <p className="text-lg font-bold font-mono text-yellow-400">52.4% <span className="text-xs text-green-400 ml-1"><i className="fas fa-caret-up"></i></span></p>
                        </div>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Global Cap</p>
                            <p className="text-lg font-bold font-mono text-blue-400">$2.45T</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    
                    {/* Left Column: Portfolio & Assets */}
                    <div className="xl:col-span-2 space-y-8">
                        
                        {/* Portfolio Overview Card */}
                        <div className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                            
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Total Portfolio Value</h2>
                                    <div className="flex items-baseline gap-4">
                                        <h3 className="text-5xl font-extrabold text-white tracking-tight font-mono">
                                            <LivePrice value={totalPortfolioValue} previousValue={prevTotalValue} />
                                        </h3>
                                        <div className={`flex items-center px-3 py-1 rounded-lg ${dayChangeValue >= 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            <i className={`fas ${dayChangeValue >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'} mr-2 text-xs`}></i>
                                            <span className="font-bold font-mono">{formatCurrency(Math.abs(dayChangeValue))}</span>
                                            <span className="text-xs ml-1 opacity-80">(24h)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                     <button className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-white shadow-lg shadow-blue-600/20 group">
                                        <i className="fas fa-plus text-xl mb-1 group-hover:scale-110 transition-transform"></i>
                                        <span className="text-[10px] font-bold uppercase">Buy</span>
                                     </button>
                                     <button className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 border border-white/10 hover:border-white/30">
                                        <i className="fas fa-arrow-up text-xl mb-1 rotate-45"></i>
                                        <span className="text-[10px] font-bold uppercase">Send</span>
                                     </button>
                                     <button className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 border border-white/10 hover:border-white/30">
                                        <i className="fas fa-arrow-down text-xl mb-1"></i>
                                        <span className="text-[10px] font-bold uppercase">Receive</span>
                                     </button>
                                </div>
                            </div>
                        </div>

                        {/* Asset Table */}
                        <div className="bg-[#1e293b]/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <i className="fas fa-layer-group text-blue-400"></i> Assets Allocation
                                </h3>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"><i className="fas fa-search"></i></button>
                                    <button className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"><i className="fas fa-filter"></i></button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-black/20 text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                                        <tr>
                                            <th className="p-4 pl-6">Asset</th>
                                            <th className="p-4 text-right">Price</th>
                                            <th className="p-4 text-right">Balance</th>
                                            <th className="p-4 text-right">Value</th>
                                            <th className="p-4 text-center">24h Change</th>
                                            <th className="p-4 text-center w-32">Trend (7d)</th>
                                            <th className="p-4 text-right pr-6">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {liveHoldings.map(h => {
                                            const prevH = previousHoldings.find(p => p.id === h.id) || h;
                                            return (
                                                <tr key={h.id} className="group hover:bg-white/5 transition-colors">
                                                    <td className="p-4 pl-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-white/10 p-1.5 flex items-center justify-center shadow-inner">
                                                                <img src={h.iconUrl} alt={h.name} className="w-full h-full object-contain" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-white text-base">{h.symbol}</p>
                                                                <p className="text-xs text-gray-500">{h.name}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right font-mono font-medium text-gray-300">
                                                        <LivePrice value={h.priceUSD} previousValue={prevH.priceUSD} />
                                                    </td>
                                                    <td className="p-4 text-right font-mono text-gray-400">
                                                        {h.balanceCrypto.toFixed(4)} {h.symbol}
                                                    </td>
                                                    <td className="p-4 text-right font-mono font-bold text-white">
                                                        {formatCurrency(h.balanceUSD)}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${h.dayChangePercent >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                                            {h.dayChangePercent > 0 ? '+' : ''}{h.dayChangePercent.toFixed(2)}%
                                                        </span>
                                                    </td>
                                                    <td className="p-4 h-16 w-32">
                                                        <HoldingSparkline data={h.historicalData} />
                                                    </td>
                                                    <td className="p-4 pr-6 text-right">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleOpenWithdrawModal(h)} className="p-2 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-yellow-400 transition-colors" title="Withdraw">
                                                                <i className="fas fa-paper-plane"></i>
                                                            </button>
                                                            <button className="p-2 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-colors" title="Trade">
                                                                <i className="fas fa-exchange-alt"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Market Data & Tools */}
                    <div className="space-y-6">
                        
                        {/* Network Health */}
                        <div className="bg-[#1e293b]/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Network Health (Ethereum)</h3>
                            <div className="space-y-3">
                                <NetworkStat label="Gas Price" value={`${gasPrice} Gwei`} icon="fa-gas-pump" status={gasPrice > 40 ? 'congested' : gasPrice > 25 ? 'busy' : 'optimal'} />
                                <NetworkStat label="Block Height" value={`#${blockHeight}`} icon="fa-cubes" />
                                <NetworkStat label="TPS" value="14.2" icon="fa-tachometer-alt" />
                            </div>
                        </div>

                        {/* Quick Swap */}
                        <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                             <h3 className="font-bold text-white mb-6">Instant Swap</h3>
                             
                             <div className="space-y-2">
                                <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                        <span>Sell</span>
                                        <span>Bal: 0.45 BTC</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <input 
                                            type="number" 
                                            value={swapAmount} 
                                            onChange={e => setSwapAmount(e.target.value)} 
                                            placeholder="0.00" 
                                            className="bg-transparent text-xl font-mono font-bold text-white w-1/2 focus:outline-none placeholder-gray-600"
                                        />
                                        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full px-3 py-1.5 transition-colors">
                                            <img src="https://img.icons8.com/color/48/bitcoin--v1.png" className="w-5 h-5" />
                                            <span className="font-bold text-sm">BTC</span>
                                            <i className="fas fa-chevron-down text-xs"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-center -my-3 relative z-10">
                                    <button className="w-8 h-8 rounded-full bg-[#0b1120] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                                        <i className="fas fa-arrow-down"></i>
                                    </button>
                                </div>

                                <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                        <span>Buy</span>
                                        <span>Rate: 1 BTC ≈ 18.42 ETH</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-mono font-bold text-gray-400 w-1/2">
                                            {swapAmount ? (parseFloat(swapAmount) * 18.42).toFixed(4) : '0.00'}
                                        </span>
                                        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full px-3 py-1.5 transition-colors">
                                            <img src="https://img.icons8.com/color/48/ethereum.png" className="w-5 h-5" />
                                            <span className="font-bold text-sm">ETH</span>
                                            <i className="fas fa-chevron-down text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                             </div>

                             <button className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5">
                                 Review Swap
                             </button>
                        </div>

                        {/* Market Sentiment */}
                        <div className="bg-[#1e293b]/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Fear & Greed Index</h3>
                            <FearGreedMeter value={72} />
                            <p className="text-center text-[10px] text-gray-500 mt-4">Updated 4 mins ago</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {isWithdrawModalOpen && selectedCrypto && (
                <WithdrawCryptoModal
                    isOpen={isWithdrawModalOpen}
                    onClose={() => setIsWithdrawModalOpen(false)}
                    crypto={selectedCrypto}
                    setActiveView={setActiveView}
                />
            )}
        </div>
    );
};

export default CryptoView;
