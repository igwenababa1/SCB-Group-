
import React, { useState } from 'react';
import type { ViewType } from '../../types';
import QuickActionButton from '../../components/dashboard/dashboard/QuickActionButton';
import SpendingInsights from '../../components/dashboard/dashboard/SpendingInsights';
import CreditScoreWidget from '../../components/dashboard/dashboard/CreditScoreWidget';
import ActivityFeed from '../../components/dashboard/dashboard/ActivityFeed';
import Transactions from '../../components/dashboard/Transactions';
import TransferModal from '../../components/dashboard/TransferModal';
import LiveVoiceAssistant from '../../components/dashboard/LiveVoiceAssistant';
import SessionInfoWidget from '../../components/dashboard/dashboard/SessionInfoWidget';
import MarketTicker from '../../components/dashboard/dashboard/MarketTicker';
import PremiumCardsCarousel from '../../components/dashboard/dashboard/PremiumCardsCarousel';
import ScanPayModal from '../../components/dashboard/dashboard/ScanPayModal';
import { ACCOUNTS } from '../../constants';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../contexts/GlobalSettingsContext';

interface DashboardViewProps {
    setActiveView: (view: ViewType) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setActiveView }) => {
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);
    const [isScanPayOpen, setIsScanPayOpen] = useState(false);
    const { currency, exchangeRate, language } = useCurrency();

    const totalAssets = ACCOUNTS.filter(a => a.type !== 'Credit').reduce((sum, item) => sum + item.balance, 0);
    const convertedTotalAssets = totalAssets * exchangeRate;

    return (
        <div className="relative min-h-full bg-gray-50 dark:bg-[#0b1120]">
            {/* Sophisticated Background */}
             <div
                className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }}
            />
            <div className="absolute inset-0 bg-white/90 dark:bg-[#0b1120]/95 z-0 backdrop-blur-sm" />

            <div className="relative z-10">
                <MarketTicker />

                <div className="p-8 max-w-[1600px] mx-auto space-y-10">
                    
                    {/* Hero Section: Net Worth & Cards */}
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-end mb-6 px-2">
                            <div>
                                <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Total Portfolio Value</h2>
                                <div className="flex items-baseline gap-3">
                                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1a365d] to-[#2d5c8a] dark:from-white dark:to-gray-300">
                                        {formatCurrency(convertedTotalAssets, currency.code, language.code)}
                                    </h1>
                                    <span className="px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold flex items-center">
                                        <i className="fas fa-arrow-up mr-1"></i> 2.4%
                                    </span>
                                </div>
                            </div>
                            <button className="mt-4 md:mt-0 text-sm font-semibold text-[#1a365d] dark:text-[#e6b325] hover:underline flex items-center gap-2">
                                View Analysis <i className="fas fa-chevron-right text-xs"></i>
                            </button>
                        </div>
                        
                        <PremiumCardsCarousel />
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                        <QuickActionButton icon="fa-paper-plane" label="Send Money" onClick={() => setIsTransferModalOpen(true)} />
                        <QuickActionButton icon="fa-file-invoice-dollar" label="Pay Bills" onClick={() => setActiveView('payments')} />
                        <QuickActionButton icon="fa-exchange-alt" label="Exchange" onClick={() => setActiveView('network')} />
                        <QuickActionButton icon="fa-chart-line" label="Invest" onClick={() => setActiveView('investments')} />
                        <QuickActionButton icon="fa-qrcode" label="Scan to Pay" onClick={() => setIsScanPayOpen(true)} />
                        <QuickActionButton icon="fa-ellipsis-h" label="More" onClick={() => setActiveView('apps')} />
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Left Column: Transactions & Activity */}
                        <div className="xl:col-span-2 space-y-8">
                            <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-white/5 overflow-hidden">
                                <Transactions limit={7} />
                            </div>
                            
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-white/5">
                                    <ActivityFeed />
                                </div>
                                <SessionInfoWidget />
                            </div>
                        </div>

                        {/* Right Column: Insights & Widgets */}
                        <div className="space-y-8">
                             <div className="bg-gradient-to-br from-[#1a365d] to-[#0f172a] rounded-2xl shadow-2xl p-1 border border-white/10">
                                <div className="bg-[#1a365d]/50 backdrop-blur-xl rounded-xl p-6 h-full">
                                     <div className="flex items-center justify-between mb-4 text-white">
                                        <h3 className="font-bold text-lg">Concierge</h3>
                                        <span className="px-2 py-0.5 bg-[#e6b325] text-[#1a365d] text-[10px] font-bold rounded uppercase">Private</span>
                                     </div>
                                     <p className="text-gray-300 text-sm mb-4">Your dedicated relationship manager, Sarah, is available.</p>
                                     <button onClick={() => setActiveView('support')} className="w-full py-3 rounded-lg bg-white text-[#1a365d] font-bold text-sm hover:bg-gray-100 transition-colors">
                                         Contact Relationship Manager
                                     </button>
                                </div>
                             </div>

                            <CreditScoreWidget score={780} />
                            <SpendingInsights />
                        </div>
                    </div>
                </div>

                <TransferModal
                    isOpen={isTransferModalOpen}
                    onClose={() => setIsTransferModalOpen(false)}
                    setActiveView={setActiveView}
                />
                
                <ScanPayModal 
                    isOpen={isScanPayOpen}
                    onClose={() => setIsScanPayOpen(false)}
                />
                
                {/* Voice Assistant FAB */}
                <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-4">
                    {/* Tooltip */}
                     <div className="bg-[#1a365d] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg mb-1 animate-bounce">
                        Need help?
                        <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-[#1a365d] transform rotate-45"></div>
                    </div>
                    
                    <button
                        onClick={() => setIsAssistantOpen(true)}
                        className="w-16 h-16 bg-gradient-to-br from-[#e6b325] to-[#b08d26] rounded-full text-[#1a365d] text-2xl flex items-center justify-center shadow-2xl hover:shadow-[#e6b325]/40 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 border-4 border-white/20"
                        aria-label="Open Voice Assistant"
                    >
                        <i className="fas fa-microphone-alt"></i>
                    </button>
                </div>

                {isAssistantOpen && (
                    <LiveVoiceAssistant
                        isOpen={isAssistantOpen}
                        onClose={() => setIsAssistantOpen(false)}
                        setActiveView={setActiveView}
                    />
                )}
            </div>
        </div>
    );
};

export default DashboardView;
