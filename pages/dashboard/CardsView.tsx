
import React, { useState, useMemo, useEffect } from 'react';
import { ACCOUNTS, CARDS, RECURRING_PAYMENTS } from '../../constants';
import type { Card, Account } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../contexts/GlobalSettingsContext';
import CardDetailsModal from '../../components/dashboard/cards/CardDetailsModal';
import AccountCardDisplay from '../../components/dashboard/congratulations/AccountCardDisplay';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// --- Helper Components ---

const LimitSlider: React.FC<{ limit: number, onChange: (val: number) => void }> = ({ limit, onChange }) => (
    <div className="space-y-3">
        <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Daily Spending Limit</label>
            <span className="text-sm font-mono font-bold text-white">{formatCurrency(limit)}</span>
        </div>
        <input 
            type="range" 
            min="500" 
            max="20000" 
            step="500" 
            value={limit} 
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#e6b325]"
        />
        <div className="flex justify-between text-[10px] text-gray-500">
            <span>$500</span>
            <span>$20k+</span>
        </div>
    </div>
);

const SubscriptionPill: React.FC<{ name: string, amount: number, icon: string }> = ({ name, amount, icon }) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-gray-400">
                <i className={`fas ${icon} text-xs`}></i>
            </div>
            <div>
                <p className="text-sm font-bold text-gray-200">{name}</p>
                <p className="text-[10px] text-gray-500">Monthly</p>
            </div>
        </div>
        <span className="text-xs font-mono font-bold text-white">{formatCurrency(amount)}</span>
    </div>
);

const SpendingChart: React.FC = () => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    
    React.useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                        datasets: [{
                            label: 'Spend',
                            data: [120, 45, 320, 150, 440, 210, 90],
                            backgroundColor: '#e6b325',
                            borderRadius: 4,
                            barThickness: 8
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            x: { display: false },
                            y: { display: false }
                        }
                    }
                });
            }
        }
    }, []);

    return <div className="h-24 w-full"><canvas ref={canvasRef}></canvas></div>;
}

const CardsView: React.FC = () => {
    const { currency, exchangeRate, language } = useCurrency();
    const [selectedCardIndex, setSelectedCardIndex] = useState(0);
    const [cards, setCards] = useState<Card[]>(CARDS);
    const [selectedCardDetails, setSelectedCardDetails] = useState<Card | null>(null);
    const [cardLimits, setCardLimits] = useState<Record<string, number>>({ 'card-1': 5000, 'card-2': 15000 });
    const [securitySettings, setSecuritySettings] = useState<Record<string, { online: boolean, atm: boolean, international: boolean }>>({
        'card-1': { online: true, atm: true, international: false },
        'card-2': { online: true, atm: false, international: true }
    });
    const [travelMode, setTravelMode] = useState(false);
    const [walletAdded, setWalletAdded] = useState(false);

    const activeCard = cards[selectedCardIndex];
    const activeAccount = ACCOUNTS.find(a => a.type === (activeCard.type === 'Visa' ? 'Checking' : 'Credit')); // Simplified mapping

    const handleToggleFreeze = () => {
        const newCards = [...cards];
        newCards[selectedCardIndex].isFrozen = !newCards[selectedCardIndex].isFrozen;
        setCards(newCards);
    };

    const handleSettingToggle = (setting: 'online' | 'atm' | 'international') => {
        setSecuritySettings(prev => ({
            ...prev,
            [activeCard.id]: {
                ...prev[activeCard.id],
                [setting]: !prev[activeCard.id][setting]
            }
        }));
    };

    const handleLimitChange = (val: number) => {
        setCardLimits(prev => ({ ...prev, [activeCard.id]: val }));
    };

    const handleAddToWallet = () => {
        setWalletAdded(true);
        setTimeout(() => setWalletAdded(false), 3000);
    };

    return (
        <div className="relative min-h-full bg-[#0b1120] text-white font-sans overflow-hidden">
             {/* Immersive Background */}
             <div 
                className="absolute inset-0 z-0 opacity-30"
                style={{ 
                    backgroundImage: "url('https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2232&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b1120]/80 via-[#0b1120]/95 to-[#0b1120]"></div>

            <div className="relative z-10 p-8 max-w-[1600px] mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-bold tracking-tight text-white">Card Command</h1>
                            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
                                Portfolio Elite
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">Manage security, limits, and global access.</p>
                    </div>
                    
                    <div className="flex gap-2 mt-6 md:mt-0">
                         <button className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
                            <i className="fas fa-plus"></i> New Card
                        </button>
                        <button className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
                            <i className="fas fa-file-invoice"></i> Statements
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    
                    {/* Left Column: Card Visual & Primary Actions (5 cols) */}
                    <div className="xl:col-span-5 space-y-8">
                        
                        {/* Card Carousel */}
                        <div className="relative group perspective-1000">
                            <div className={`transition-all duration-500 transform ${activeCard.isFrozen ? 'grayscale opacity-90 scale-95' : 'hover:scale-[1.02]'}`}>
                                {activeCard.isFrozen && (
                                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-blue-900/40 backdrop-blur-[2px] rounded-2xl border-2 border-blue-400/30">
                                        <div className="bg-black/60 p-4 rounded-full border border-blue-400/50 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                                            <i className="fas fa-snowflake text-4xl text-blue-300 animate-pulse"></i>
                                        </div>
                                    </div>
                                )}
                                {activeAccount && (
                                    <AccountCardDisplay 
                                        account={activeAccount} 
                                        isBalanceHidden={false} 
                                    />
                                )}
                            </div>
                            
                            {/* Navigation Dots */}
                            <div className="flex justify-center gap-2 mt-6">
                                {cards.map((_, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setSelectedCardIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === selectedCardIndex ? 'bg-[#e6b325] w-6' : 'bg-gray-600 hover:bg-gray-400'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Primary Controls */}
                        <div className="grid grid-cols-4 gap-3">
                            <button 
                                onClick={handleToggleFreeze}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                                    activeCard.isFrozen 
                                        ? 'bg-blue-500 text-white border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                                }`}
                            >
                                <i className={`fas ${activeCard.isFrozen ? 'fa-snowflake' : 'fa-lock'} text-xl mb-2`}></i>
                                <span className="text-[10px] font-bold uppercase">{activeCard.isFrozen ? 'Unfreeze' : 'Freeze'}</span>
                            </button>

                            <button 
                                onClick={() => setSelectedCardDetails(activeCard)}
                                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all hover:border-[#e6b325]/50 hover:text-[#e6b325]"
                            >
                                <i className="fas fa-eye text-xl mb-2"></i>
                                <span className="text-[10px] font-bold uppercase">Details</span>
                            </button>

                            <button 
                                onClick={() => setTravelMode(!travelMode)}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                                    travelMode
                                        ? 'bg-purple-500 text-white border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                                }`}
                            >
                                <i className="fas fa-plane text-xl mb-2"></i>
                                <span className="text-[10px] font-bold uppercase">Travel</span>
                            </button>

                            <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all hover:text-red-400 hover:border-red-400/50">
                                <i className="fas fa-ban text-xl mb-2"></i>
                                <span className="text-[10px] font-bold uppercase">Block</span>
                            </button>
                        </div>

                        {/* Digital Wallet */}
                        <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Digital Wallets</h3>
                            <div className="flex gap-4">
                                <button 
                                    onClick={handleAddToWallet}
                                    className="flex-1 bg-black hover:bg-gray-900 border border-white/20 rounded-xl py-3 flex items-center justify-center gap-2 transition-all relative overflow-hidden"
                                >
                                    <i className="fab fa-apple text-xl"></i>
                                    <span className="text-sm font-bold">Add to Apple Wallet</span>
                                    {walletAdded && <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center"><i className="fas fa-check text-green-500"></i></div>}
                                </button>
                                <button 
                                    onClick={handleAddToWallet}
                                    className="flex-1 bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-xl py-3 flex items-center justify-center gap-2 transition-all relative overflow-hidden"
                                >
                                    <i className="fab fa-google text-xl text-blue-500"></i>
                                    <span className="text-sm font-bold">Add to GPay</span>
                                    {walletAdded && <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center"><i className="fas fa-check text-green-500"></i></div>}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings & Analytics (7 cols) */}
                    <div className="xl:col-span-7 space-y-8">
                        
                        {/* Configuration Panel */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Security Settings */}
                            <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                    <i className="fas fa-shield-halved text-green-400"></i> Security Protocols
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-200">Online Payments</p>
                                            <p className="text-[10px] text-gray-500">Allow internet transactions</p>
                                        </div>
                                        <button 
                                            onClick={() => handleSettingToggle('online')}
                                            className={`w-11 h-6 rounded-full relative transition-colors ${securitySettings[activeCard.id].online ? 'bg-green-500' : 'bg-gray-600'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${securitySettings[activeCard.id].online ? 'left-6' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-200">ATM Withdrawals</p>
                                            <p className="text-[10px] text-gray-500">Allow cash access</p>
                                        </div>
                                        <button 
                                            onClick={() => handleSettingToggle('atm')}
                                            className={`w-11 h-6 rounded-full relative transition-colors ${securitySettings[activeCard.id].atm ? 'bg-green-500' : 'bg-gray-600'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${securitySettings[activeCard.id].atm ? 'left-6' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-200">International Use</p>
                                            <p className="text-[10px] text-gray-500">Allow foreign currencies</p>
                                        </div>
                                        <button 
                                            onClick={() => handleSettingToggle('international')}
                                            className={`w-11 h-6 rounded-full relative transition-colors ${securitySettings[activeCard.id].international ? 'bg-green-500' : 'bg-gray-600'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${securitySettings[activeCard.id].international ? 'left-6' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Spending Limits */}
                            <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
                                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                    <i className="fas fa-sliders-h text-yellow-400"></i> Controls
                                </h3>
                                <LimitSlider 
                                    limit={cardLimits[activeCard.id]} 
                                    onChange={handleLimitChange} 
                                />
                                <div className="mt-8 pt-4 border-t border-white/10">
                                     <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-gray-400">Current Cycle Spend</span>
                                        <span className="text-sm font-bold text-white">$1,240.50</span>
                                     </div>
                                     <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                         <div className="bg-blue-500 h-full" style={{ width: '25%' }}></div>
                                     </div>
                                </div>
                            </div>
                        </div>

                        {/* Analytics & Subs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Spending Trend */}
                            <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-white">Weekly Spending</h3>
                                    <span className="text-xs text-green-400 font-bold">+12%</span>
                                </div>
                                <SpendingChart />
                            </div>

                            {/* Linked Subscriptions */}
                            <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-white">Recurring Charges</h3>
                                    <button className="text-[10px] text-blue-400 hover:text-white uppercase font-bold">Manage</button>
                                </div>
                                <div className="space-y-2">
                                    <SubscriptionPill name="Netflix" amount={15.99} icon="fa-play" />
                                    <SubscriptionPill name="Spotify" amount={10.99} icon="fa-music" />
                                    <SubscriptionPill name="Amazon Prime" amount={14.99} icon="fa-shopping-cart" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            
            {selectedCardDetails && (
                <CardDetailsModal 
                    isOpen={!!selectedCardDetails}
                    onClose={() => setSelectedCardDetails(null)}
                    card={selectedCardDetails}
                />
            )}
        </div>
    );
};

export default CardsView;
