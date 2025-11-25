
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Chart, registerables } from 'chart.js';
import { HOLDINGS, ASSET_ALLOCATION, MARKET_MOVERS, WATCHLIST } from '../../constants';
import { formatCurrency } from '../../utils/formatters';
import type { Holding, AssetAllocationItem, MarketMover, WatchlistItem, ViewType } from '../../types';
import TradeModal from '../../components/dashboard/investments/TradeModal';
import HoldingSparkline from '../../components/dashboard/investments/HoldingSparkline';
import HoldingDetailModal from '../../components/dashboard/investments/HoldingDetailModal';
import StatementModal from '../../components/dashboard/StatementModal';

Chart.register(...registerables);

// --- Types & Mock Data for Simulation ---
interface NewsItem {
    id: string;
    source: string;
    headline: string;
    time: string;
    sentiment: 'positive' | 'negative' | 'neutral';
}

const MOCK_NEWS: NewsItem[] = [
    { id: 'n1', source: 'Bloomberg', headline: 'Tech Sector Rallies as AI Chip Demand Surges', time: '2m ago', sentiment: 'positive' },
    { id: 'n2', source: 'Reuters', headline: 'Fed Signals Potential Rate Cut in Q4', time: '15m ago', sentiment: 'positive' },
    { id: 'n3', source: 'CNBC', headline: 'Oil Prices Stabilize Amid Geopolitical Tensions', time: '42m ago', sentiment: 'neutral' },
    { id: 'n4', source: 'WSJ', headline: 'Market Volatility Index (VIX) Spikes 5%', time: '1h ago', sentiment: 'negative' },
    { id: 'n5', source: 'Financial Times', headline: 'European Markets Close Higher on Earnings', time: '2h ago', sentiment: 'positive' },
];

// --- Helper Components ---

const LivePrice: React.FC<{ value: number, previousValue: number }> = ({ value, previousValue }) => {
    const [flash, setFlash] = useState<'up' | 'down' | null>(null);

    useEffect(() => {
        if (value > previousValue) {
            setFlash('up');
            setTimeout(() => setFlash(null), 1000);
        } else if (value < previousValue) {
            setFlash('down');
            setTimeout(() => setFlash(null), 1000);
        }
    }, [value, previousValue]);

    const colorClass = flash === 'up' ? 'text-green-400 bg-green-400/10' : flash === 'down' ? 'text-red-400 bg-red-400/10' : 'text-white';

    return (
        <span className={`transition-all duration-300 px-1 rounded ${colorClass}`}>
            {formatCurrency(value)}
        </span>
    );
};

const StatCard: React.FC<{ label: string; value: string | React.ReactNode; subValue?: string; valueColor?: string; icon: string }> = ({ label, value, subValue, valueColor, icon }) => (
    <div className="bg-[#1e293b]/60 backdrop-blur-md p-5 rounded-xl border border-white/5 shadow-lg hover:border-white/10 transition-all group">
        <div className="flex justify-between items-start mb-2">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{label}</p>
            <i className={`fas ${icon} text-gray-600 group-hover:text-yellow-400 transition-colors`}></i>
        </div>
        <div className={`text-2xl font-bold mt-1 ${valueColor || 'text-white'}`}>{value}</div>
        {subValue && <p className={`text-xs font-semibold mt-1 ${subValue.includes('+') ? 'text-green-400' : subValue.includes('-') ? 'text-red-400' : 'text-gray-400'}`}>{subValue}</p>}
    </div>
);

const SentimentGauge: React.FC<{ score: number }> = ({ score }) => {
    // Score 0-100. <30 Fear, >70 Greed
    const rotation = (score / 100) * 180 - 90; // -90 to 90 deg
    
    let label = "Neutral";
    let color = "text-yellow-400";
    if (score < 30) { label = "Fear"; color = "text-red-500"; }
    else if (score > 70) { label = "Greed"; color = "text-green-500"; }

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-40 h-20 overflow-hidden mb-2">
                <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[10px] border-gray-700 border-b-0 border-r-0 border-l-0" style={{ transform: 'rotate(-45deg)' }}></div>
                <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[10px] border-transparent border-t-green-500/50" style={{ transform: 'rotate(45deg)' }}></div>
                <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[10px] border-transparent border-l-red-500/50" style={{ transform: 'rotate(-45deg)' }}></div>
                
                {/* Needle */}
                <div 
                    className="absolute bottom-0 left-1/2 w-1 h-20 bg-white origin-bottom rounded-full shadow-lg transition-transform duration-1000 ease-out"
                    style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
                ></div>
                <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 translate-y-1/2 shadow-lg"></div>
            </div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Market Sentiment</p>
            <p className={`text-xl font-bold ${color}`}>{label} ({score})</p>
        </div>
    );
};

const InvestmentsView: React.FC<{ setActiveView: (view: ViewType) => void }> = ({ setActiveView }) => {
    // State
    const [liveHoldings, setLiveHoldings] = useState<Holding[]>(HOLDINGS);
    const [previousHoldings, setPreviousHoldings] = useState<Holding[]>(HOLDINGS);
    const [timeRange, setTimeRange] = useState('1Y');
    const [marketStatus, setMarketStatus] = useState('OPEN');
    const [portfolioValue, setPortfolioValue] = useState(120450.90);
    const [dayChange, setDayChange] = useState(1250.80);
    
    // Modals & Interaction
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [tradeDetails, setTradeDetails] = useState<{ holding: Holding | null, type: 'Buy' | 'Sell' }>({ holding: null, type: 'Buy' });
    const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Holding | 'marketValue'; direction: 'asc' | 'desc' } | null>(null);
    const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);

    // Chart Refs
    const portfolioChartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);
    const allocationChartRef = useRef<HTMLCanvasElement>(null);
    const allocationInstanceRef = useRef<Chart | null>(null);

    // --- Simulation Logic ---
    useEffect(() => {
        const interval = setInterval(() => {
            setPreviousHoldings(liveHoldings);
            setLiveHoldings(current => 
                current.map(h => {
                    const volatility = 0.0015; // 0.15% max move per tick
                    const move = 1 + (Math.random() * volatility * 2 - volatility);
                    const newPrice = h.price * move;
                    const priceDiff = newPrice - h.price;
                    return {
                        ...h,
                        price: newPrice,
                        change: h.change + priceDiff,
                        changePercent: ((h.change + priceDiff) / (newPrice - (h.change + priceDiff))) * 100
                    };
                })
            );
        }, 3000); // Tick every 3 seconds

        return () => clearInterval(interval);
    }, [liveHoldings]);

    // Update Portfolio Totals
    useEffect(() => {
        const total = liveHoldings.reduce((sum, h) => sum + (h.price * h.shares), 0) + 15230.40; // + Cash
        const change = liveHoldings.reduce((sum, h) => sum + (h.change * h.shares), 0);
        setPortfolioValue(total);
        setDayChange(change);
    }, [liveHoldings]);

    // --- Charting ---
    useEffect(() => {
        if (chartInstanceRef.current) chartInstanceRef.current.destroy();
        if (portfolioChartRef.current) {
            const ctx = portfolioChartRef.current.getContext('2d');
            if (ctx) {
                // Mock Data Generator based on TimeRange
                const points = timeRange === '1D' ? 24 : timeRange === '1W' ? 7 : timeRange === '1M' ? 30 : 12;
                const labels = Array.from({length: points}, (_, i) => i.toString());
                const data = Array.from({length: points}, () => 100000 + Math.random() * 20000);
                
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(250, 204, 21, 0.2)'); // Yellow-400
                gradient.addColorStop(1, 'rgba(250, 204, 21, 0)');

                chartInstanceRef.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels,
                        datasets: [{
                            data,
                            borderColor: '#facc15',
                            backgroundColor: gradient,
                            borderWidth: 2,
                            pointRadius: 0,
                            pointHoverRadius: 4,
                            pointBackgroundColor: '#facc15',
                            tension: 0.4,
                            fill: true,
                        }],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
                        scales: { 
                            x: { display: false }, 
                            y: { display: false } // Minimalist look
                        },
                        interaction: {
                            mode: 'nearest',
                            axis: 'x',
                            intersect: false
                        }
                    },
                });
            }
        }
    }, [timeRange]);

    useEffect(() => {
        if (allocationInstanceRef.current) allocationInstanceRef.current.destroy();
        if (allocationChartRef.current) {
            const ctx = allocationChartRef.current.getContext('2d');
            if (ctx) {
                allocationInstanceRef.current = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ASSET_ALLOCATION.map(d => d.name),
                        datasets: [{
                            data: ASSET_ALLOCATION.map(d => d.value),
                            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'],
                            borderColor: '#0f172a',
                            borderWidth: 4,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '75%',
                        plugins: { legend: { display: false } }
                    }
                });
            }
        }
    }, []);

    // --- Sorting ---
    const sortedHoldings = useMemo(() => {
        if (!sortConfig) return liveHoldings;
        return [...liveHoldings].sort((a, b) => {
            let aVal: any = a[sortConfig.key as keyof Holding];
            let bVal: any = b[sortConfig.key as keyof Holding];
            
            if (sortConfig.key === 'marketValue') {
                aVal = a.price * a.shares;
                bVal = b.price * b.shares;
            }

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [liveHoldings, sortConfig]);

    const handleSort = (key: keyof Holding | 'marketValue') => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // --- Handlers ---
    const handleTrade = (holding: Holding, type: 'Buy' | 'Sell') => {
        setTradeDetails({ holding, type });
        setIsTradeModalOpen(true);
    };

    return (
        <div className="relative min-h-full bg-[#0b1120] text-white font-sans selection:bg-yellow-500/30">
            {/* Background */}
            <div 
                className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{ 
                    backgroundImage: "url('https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2070&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b1120]/90 via-[#0b1120]/95 to-[#0b1120]"></div>

            <div className="relative z-10 p-6 max-w-[1800px] mx-auto">
                
                {/* Header */}
                <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-bold tracking-tight text-white">Investment Command</h1>
                            <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                Market Open
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">Real-time portfolio analytics and execution.</p>
                    </div>
                    <div className="flex gap-3">
                         <button onClick={() => setIsStatementModalOpen(true)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
                            <i className="fas fa-file-pdf"></i> Statements
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 transition-all text-sm flex items-center gap-2">
                            <i className="fas fa-plus"></i> Deposit Funds
                        </button>
                    </div>
                </div>

                {/* Top Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard 
                        label="Total Equity" 
                        value={<LivePrice value={portfolioValue} previousValue={portfolioValue - 10} />} 
                        icon="fa-wallet"
                    />
                    <StatCard 
                        label="Day's P&L" 
                        value={formatCurrency(dayChange)} 
                        subValue={`${dayChange >= 0 ? '+' : ''}${(dayChange/portfolioValue*100).toFixed(2)}%`} 
                        valueColor={dayChange >= 0 ? 'text-green-400' : 'text-red-400'}
                        icon="fa-chart-line"
                    />
                    <StatCard 
                        label="Buying Power" 
                        value={formatCurrency(15230.40)} 
                        icon="fa-bolt"
                    />
                    <StatCard 
                        label="Margin Used" 
                        value="$0.00" 
                        subValue="0% Utilization"
                        icon="fa-percent"
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main Chart Area */}
                    <div className="xl:col-span-2 space-y-6">
                        <div className="bg-[#1e293b]/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                             {/* Chart Controls */}
                             <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-white">Performance</h2>
                                <div className="flex bg-black/20 p-1 rounded-lg">
                                    {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map(range => (
                                        <button 
                                            key={range} 
                                            onClick={() => setTimeRange(range)}
                                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${timeRange === range ? 'bg-white/10 text-yellow-400 shadow' : 'text-gray-500 hover:text-white'}`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                             </div>
                             
                             <div className="h-80 w-full relative">
                                 <canvas ref={portfolioChartRef}></canvas>
                             </div>
                        </div>

                        {/* Holdings Table */}
                        <div className="bg-[#1e293b]/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h3 className="font-bold text-white">Positions</h3>
                                <div className="flex gap-2">
                                    <button className="w-8 h-8 rounded bg-black/20 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white"><i className="fas fa-search"></i></button>
                                    <button className="w-8 h-8 rounded bg-black/20 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white"><i className="fas fa-filter"></i></button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-black/20 text-gray-400 text-xs uppercase font-bold">
                                        <tr>
                                            <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('symbol')}>Symbol</th>
                                            <th className="p-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('price')}>Last Price</th>
                                            <th className="p-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('change')}>Day Change</th>
                                            <th className="p-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('marketValue')}>Value</th>
                                            <th className="p-4 text-center">Trend</th>
                                            <th className="p-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {sortedHoldings.map(h => (
                                            <tr key={h.id} onClick={() => setSelectedHolding(h)} className="hover:bg-white/5 transition-colors cursor-pointer group">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={h.logoUrl} className="w-8 h-8 rounded-full bg-white p-0.5" />
                                                        <div>
                                                            <p className="font-bold text-white">{h.symbol}</p>
                                                            <p className="text-[10px] text-gray-500">{h.shares} Shares</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right font-mono font-medium">
                                                    <LivePrice value={h.price} previousValue={previousHoldings.find(p => p.id === h.id)?.price || h.price} />
                                                </td>
                                                <td className="p-4 text-right font-mono">
                                                    <span className={h.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                                                        {h.change >= 0 ? '+' : ''}{h.change.toFixed(2)} <span className="text-[10px] opacity-70">({h.changePercent.toFixed(2)}%)</span>
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right font-mono text-white">
                                                    {formatCurrency(h.price * h.shares)}
                                                </td>
                                                <td className="p-4 h-12 w-24">
                                                     <HoldingSparkline data={h.historicalData} />
                                                </td>
                                                <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleTrade(h, 'Buy')} className="px-3 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-black text-xs font-bold transition-colors">Buy</button>
                                                        <button onClick={() => handleTrade(h, 'Sell')} className="px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-black text-xs font-bold transition-colors">Sell</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar: Intelligence */}
                    <div className="space-y-6">
                        {/* Sentiment & Allocation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                            <div className="bg-[#1e293b]/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col items-center">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 w-full">Allocation</h3>
                                <div className="h-48 w-48 relative">
                                    <canvas ref={allocationChartRef}></canvas>
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="text-xl font-bold text-white">Divsf.</span>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Stocks</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Bonds</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Real Est.</span>
                                </div>
                            </div>

                            <div className="bg-[#1e293b]/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
                                <SentimentGauge score={65} />
                            </div>
                        </div>

                        {/* Live News Feed */}
                        <div className="bg-[#1e293b]/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg overflow-hidden flex flex-col h-[400px]">
                            <div className="p-4 border-b border-white/10 bg-white/5">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <i className="fas fa-newspaper text-blue-400"></i> Market Wire
                                </h3>
                            </div>
                            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                                {MOCK_NEWS.map(news => (
                                    <div key={news.id} className="flex gap-3 group cursor-pointer">
                                        <div className={`w-1 h-full min-h-[40px] rounded-full ${news.sentiment === 'positive' ? 'bg-green-500' : news.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold bg-white/10 px-1.5 rounded text-gray-300">{news.source}</span>
                                                <span className="text-[10px] text-gray-500">{news.time}</span>
                                            </div>
                                            <p className="text-sm text-gray-300 font-medium leading-snug group-hover:text-yellow-400 transition-colors">{news.headline}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                             <button className="p-3 text-xs font-bold text-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-t border-white/10">
                                View All News
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isTradeModalOpen && tradeDetails.holding && (
                <TradeModal
                    isOpen={isTradeModalOpen}
                    onClose={() => setIsTradeModalOpen(false)}
                    holding={tradeDetails.holding}
                    tradeType={tradeDetails.type}
                    onConfirmTrade={(shares) => {
                         alert(`Order Placed: ${tradeDetails.type} ${shares} shares of ${tradeDetails.holding?.symbol}`);
                         setIsTradeModalOpen(false);
                    }}
                />
            )}

            {selectedHolding && (
                <HoldingDetailModal
                    isOpen={!!selectedHolding}
                    onClose={() => setSelectedHolding(null)}
                    holding={selectedHolding}
                    onBuy={(h) => handleTrade(h, 'Buy')}
                    onSell={(h) => handleTrade(h, 'Sell')}
                />
            )}

            <StatementModal 
                isOpen={isStatementModalOpen}
                onClose={() => setIsStatementModalOpen(false)}
                type="Investment"
            />
        </div>
    );
};

export default InvestmentsView;
