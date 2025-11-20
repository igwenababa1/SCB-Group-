
import React, { useState } from 'react';
import { SUPPORT_FAQS, SYSTEM_STATUS } from '../../constants';
import FaqAccordion from '../../components/dashboard/support/FaqAccordion';
import LiveChatModal from '../../components/dashboard/support/LiveChatModal';

const SupportChannelCard: React.FC<{ 
    icon: string; 
    title: string; 
    subtitle: string; 
    status?: 'online' | 'offline' | 'busy'; 
    waitTime?: string;
    onClick?: () => void;
    isPrimary?: boolean;
}> = ({ icon, title, subtitle, status, waitTime, onClick, isPrimary }) => (
    <button 
        onClick={onClick}
        className={`group relative flex flex-col items-start text-left p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
            isPrimary 
                ? 'bg-gradient-to-br from-[#e6b325] to-[#d4a017] border-yellow-400/50 text-[#1a365d] shadow-lg shadow-yellow-500/20' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-white hover:border-white/20'
        }`}
    >
        {/* Hover Glow */}
        {!isPrimary && <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
        
        <div className="flex justify-between w-full mb-4 relative z-10">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${
                isPrimary ? 'bg-white/20 text-[#1a365d]' : 'bg-black/30 text-gray-300 group-hover:text-white'
            }`}>
                <i className={`fas ${icon}`}></i>
            </div>
            {status && (
                <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${
                    status === 'online' 
                        ? (isPrimary ? 'bg-[#1a365d]/10 text-[#1a365d] border-[#1a365d]/20' : 'bg-green-500/10 text-green-400 border-green-500/30')
                        : 'bg-gray-500/10 text-gray-400 border-gray-500/30'
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-current animate-pulse' : 'bg-gray-500'}`}></span>
                    {status === 'online' ? 'Available' : 'Offline'}
                </div>
            )}
        </div>
        
        <h3 className="font-bold text-lg mb-1 relative z-10">{title}</h3>
        <p className={`text-xs relative z-10 ${isPrimary ? 'text-[#1a365d]/80 font-medium' : 'text-gray-400 group-hover:text-gray-300'}`}>{subtitle}</p>
        
        {waitTime && (
            <div className={`mt-4 text-[10px] font-mono font-bold relative z-10 flex items-center gap-1 ${isPrimary ? 'text-[#1a365d]' : 'text-blue-400'}`}>
                <i className="fas fa-clock"></i> Est. Wait: {waitTime}
            </div>
        )}
    </button>
);

const SupportView: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');

    return (
        <div className="relative min-h-full bg-[#0b1120] text-white font-sans">
             {/* Professional Background */}
             <div 
                className="absolute inset-0 z-0 opacity-30"
                style={{ 
                    backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b1120]/90 via-[#0b1120]/95 to-[#0b1120]"></div>

            <div className="relative z-10 p-8 max-w-[1600px] mx-auto">
                
                {/* Hero / Concierge Header */}
                <div className="text-center mb-16 animate-fade-in-scale-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-300 text-xs font-bold uppercase tracking-widest mb-4">
                        <i className="fas fa-concierge-bell"></i> Private Client Services
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
                        How can we assist you today?
                    </h1>
                    
                    {/* Intelligent Search Bar */}
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                            <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-yellow-400 transition-colors"></i>
                            <input 
                                type="text" 
                                placeholder="Search for help (e.g. 'Card Limits', 'Wire Transfer', 'Travel Notice')" 
                                className="w-full bg-white/10 border border-white/20 rounded-full py-5 pl-16 pr-6 text-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 focus:bg-[#0f172a] transition-all shadow-2xl"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center gap-3 mt-4 text-xs text-gray-500">
                        <span className="hover:text-white cursor-pointer transition-colors">Popular:</span>
                        <button className="hover:text-yellow-400 cursor-pointer transition-colors underline">Reset PIN</button>
                        <button className="hover:text-yellow-400 cursor-pointer transition-colors underline">Dispute Charge</button>
                        <button className="hover:text-yellow-400 cursor-pointer transition-colors underline">Order Checks</button>
                    </div>
                </div>

                {/* Support Channels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    <SupportChannelCard 
                        icon="fa-comments" 
                        title="Live Concierge" 
                        subtitle="Chat securely with a banking specialist."
                        status="online"
                        waitTime="< 1 min"
                        isPrimary
                        onClick={() => setIsChatOpen(true)}
                    />
                    <SupportChannelCard 
                        icon="fa-user-tie" 
                        title="Book an Advisor" 
                        subtitle="Schedule a video call for wealth planning."
                        status="online"
                        waitTime="Avail: Today 2pm"
                    />
                    <SupportChannelCard 
                        icon="fa-envelope-open-text" 
                        title="Secure Message" 
                        subtitle="Send documents or sensitive inquiries."
                        waitTime="Resp: < 4 hrs"
                    />
                    <SupportChannelCard 
                        icon="fa-phone-alt" 
                        title="Global Priority Line" 
                        subtitle="+46 (0) 8 123 45 67"
                        status="online"
                        waitTime="< 2 mins"
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    
                    {/* FAQ Knowledge Base */}
                    <div className="xl:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-white">Knowledge Base</h2>
                            <div className="flex bg-black/20 p-1 rounded-lg">
                                {['All', 'Accounts', 'Security', 'Transfers'].map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${activeCategory === cat ? 'bg-white/10 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <FaqAccordion items={SUPPORT_FAQS} />
                        <button className="w-full mt-6 py-3 text-sm font-bold text-gray-400 hover:text-white border-t border-white/10 transition-colors flex items-center justify-center gap-2">
                            View Full Library <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>

                    {/* Sidebar: Emergency & Status */}
                    <div className="space-y-6">
                        {/* Emergency Actions */}
                        <div className="bg-gradient-to-b from-red-900/20 to-transparent border border-red-500/30 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4 text-red-400">
                                <i className="fas fa-exclamation-triangle text-xl"></i>
                                <h3 className="font-bold text-lg">Emergency Zone</h3>
                            </div>
                            <div className="space-y-3">
                                <button className="w-full p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-between text-red-200 transition-colors group">
                                    <span className="font-semibold text-sm">Lost or Stolen Card</span>
                                    <i className="fas fa-chevron-right text-xs opacity-50 group-hover:translate-x-1 transition-transform"></i>
                                </button>
                                <button className="w-full p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-between text-red-200 transition-colors group">
                                    <span className="font-semibold text-sm">Report Fraud</span>
                                    <i className="fas fa-chevron-right text-xs opacity-50 group-hover:translate-x-1 transition-transform"></i>
                                </button>
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">System Status</h3>
                            <div className="space-y-4">
                                {SYSTEM_STATUS.map(s => {
                                    const isOperational = s.status === 'Operational';
                                    return (
                                        <div key={s.service} className="flex justify-between items-center">
                                            <span className="text-sm text-gray-300">{s.service}</span>
                                            <div className={`flex items-center gap-2 text-xs font-bold ${isOperational ? 'text-green-400' : 'text-yellow-400'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${isOperational ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                                {s.status}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 text-[10px] text-gray-500 text-center">
                                Last updated: {new Date().toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <LiveChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
    );
};

export default SupportView;
