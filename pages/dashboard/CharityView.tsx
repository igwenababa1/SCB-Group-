
import React, { useState, useRef } from 'react';
import { CHARITIES, DONATION_HISTORY } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { Charity, Donation, ViewType } from '../../types';
import DonateModal from '../../components/dashboard/charity/DonateModal';

const ImpactMetric: React.FC<{ label: string; value: string; icon: string; subtext?: string }> = ({ label, value, icon, subtext }) => (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-xl flex items-start gap-4 hover:bg-white/10 transition-colors duration-300">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1a365d] to-[#2d5c8a] flex items-center justify-center text-yellow-400 shadow-lg">
            <i className={`fas ${icon} text-xl`}></i>
        </div>
        <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">{label}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
    </div>
);

const FeaturedCharityCard: React.FC<{ charity: Charity, onDonate: () => void }> = ({ charity, onDonate }) => (
    <div className="group relative w-full h-[400px] rounded-2xl overflow-hidden text-white shadow-2xl flex-shrink-0 border border-white/10 transition-all duration-500 hover:-translate-y-2">
        <img src={charity.imageUrl} alt={charity.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent opacity-90"></div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <i className="fas fa-check-circle text-blue-400"></i> Verified Partner
            </span>
            <span className="px-3 py-1 rounded-full bg-[#e6b325]/20 backdrop-blur-md border border-[#e6b325]/40 text-[#e6b325] text-[10px] font-bold uppercase tracking-wider">
                SCB Match Available
            </span>
        </div>

        <div className="relative z-10 p-6 flex flex-col h-full justify-end">
            <div className="w-16 h-16 mb-4 bg-white rounded-xl p-2 shadow-lg flex items-center justify-center">
                <img src={charity.logoUrl} alt={`${charity.name} logo`} className="max-w-full max-h-full" />
            </div>
            <h3 className="font-bold text-2xl mb-2 text-white group-hover:text-yellow-400 transition-colors">{charity.name}</h3>
            <p className="text-sm text-gray-300 mb-6 line-clamp-2 leading-relaxed">{charity.description}</p>
            
            <div className="space-y-4">
                <div className="w-full bg-white/20 rounded-full h-1">
                    <div className="bg-yellow-400 h-1 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                    <span>75% of Annual Goal Reached</span>
                    <span className="text-white font-bold">Certified 501(c)(3)</span>
                </div>
                
                <button onClick={onDonate} className="w-full py-3 text-sm font-bold rounded-xl bg-white text-[#0f172a] hover:bg-[#e6b325] hover:text-[#1a365d] transition-all shadow-lg flex items-center justify-center gap-2">
                    <i className="fas fa-heart"></i> Make a Donation
                </button>
            </div>
        </div>
    </div>
);

const DonationLedgerItem: React.FC<{ donation: Donation }> = ({ donation }) => (
    <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center group">
        <div className="col-span-1 text-gray-500 text-center">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <i className="fas fa-receipt text-gray-400 group-hover:text-yellow-400 transition-colors"></i>
            </div>
        </div>
        <div className="col-span-5">
            <p className="font-bold text-white text-sm">{donation.charityName}</p>
            <p className="text-xs text-gray-500">{formatDate(donation.date)} &bull; {donation.isRecurring ? 'Monthly Recurring' : 'One-Time Gift'}</p>
        </div>
        <div className="col-span-3 text-right">
            <span className="px-2 py-1 rounded text-[10px] bg-green-500/10 text-green-400 border border-green-500/30 uppercase font-bold">Processed</span>
        </div>
        <div className="col-span-3 text-right">
            <p className="font-mono font-bold text-white">{formatCurrency(donation.amount)}</p>
            <button className="text-[10px] text-blue-400 hover:text-white mt-1 flex items-center justify-end gap-1 ml-auto">
                <i className="fas fa-download"></i> Receipt
            </button>
        </div>
    </div>
);

interface CharityViewProps {
    setActiveView: (view: ViewType) => void;
}

const CharityView: React.FC<CharityViewProps> = ({ setActiveView }) => {
    const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
    const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleOpenDonateModal = (charity: Charity | null) => {
        setSelectedCharity(charity);
        setIsDonateModalOpen(true);
    };
    
    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.6;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    // Mock Calculations for "Impact Overview"
    const totalDonated = DONATION_HISTORY.reduce((sum, d) => sum + d.amount, 0);
    const totalOrgs = new Set(DONATION_HISTORY.map(d => d.charityName)).size;

    return (
        <div className="relative min-h-full bg-[#0b1120] text-white overflow-hidden">
             {/* Sophisticated Background */}
            <div 
                className="absolute inset-0 z-0 opacity-30"
                style={{ 
                    backgroundImage: "url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 30%'
                }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b1120]/90 via-[#0b1120]/95 to-[#0b1120]"></div>
            
            {/* Content */}
            <div className="relative z-10 p-8 max-w-[1600px] mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-xs font-bold uppercase tracking-widest">
                                Philanthropy Portal
                            </span>
                        </div>
                        <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2">
                            Impact & Giving
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            Empower global change through secure, direct giving. Manage your charitable portfolio and track your social impact.
                        </p>
                    </div>
                    <button 
                        onClick={() => handleOpenDonateModal(null)} 
                        className="mt-6 md:mt-0 px-8 py-4 rounded-xl bg-gradient-to-r from-[#e6b325] to-[#d4a017] text-[#1a365d] font-bold shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 hover:-translate-y-1 transition-all flex items-center gap-2"
                    >
                        <i className="fas fa-hand-holding-heart"></i>
                        Quick Donation
                    </button>
                </div>

                {/* Impact Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <ImpactMetric 
                        label="Total Contributed (YTD)" 
                        value={formatCurrency(totalDonated)} 
                        icon="fa-donate"
                        subtext="Across all accounts"
                    />
                    <ImpactMetric 
                        label="Causes Supported" 
                        value={totalOrgs.toString()} 
                        icon="fa-globe-americas"
                        subtext="Active organizations"
                    />
                    <ImpactMetric 
                        label="Tax Deductible" 
                        value={formatCurrency(totalDonated)} 
                        icon="fa-file-invoice-dollar"
                        subtext="100% of contributions"
                    />
                     <div className="bg-gradient-to-br from-[#1a365d] to-[#0f172a] p-5 rounded-xl border border-white/10 flex flex-col justify-between shadow-xl">
                        <div className="flex justify-between items-start">
                            <p className="text-blue-200 text-xs uppercase tracking-wider font-bold">SCB Foundation Match</p>
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-[10px] font-bold uppercase">Active</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">2.5%</p>
                            <p className="text-xs text-gray-400 mt-1">Matched on eligible donations</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    {/* Main Column: Featured Charities */}
                    <div className="xl:col-span-2 space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Curated Causes</h2>
                            <div className="flex gap-2">
                                <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors">
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors">
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>

                        <div 
                            ref={scrollContainerRef} 
                            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
                            style={{ scrollBehavior: 'smooth' }}
                        >
                            {CHARITIES.map(charity => (
                                <div key={charity.id} className="snap-center min-w-[320px] md:min-w-[380px]">
                                    <FeaturedCharityCard charity={charity} onDonate={() => handleOpenDonateModal(charity)} />
                                </div>
                            ))}
                        </div>

                        {/* Donation History Ledger */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Giving Ledger</h3>
                                    <p className="text-xs text-gray-400 mt-1">Secure record of all philanthropic transactions</p>
                                </div>
                                <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider transition-colors">
                                    Export CSV
                                </button>
                            </div>
                            <div className="divide-y divide-white/5">
                                {DONATION_HISTORY.map(d => <DonationLedgerItem key={d.id} donation={d} />)}
                            </div>
                            <div className="p-4 bg-black/20 text-center">
                                <button className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider transition-colors">View All History</button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Documents & Tools */}
                    <div className="space-y-8">
                        {/* Tax Documents Widget */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center text-blue-400">
                                    <i className="fas fa-file-contract"></i>
                                </div>
                                <h3 className="font-bold text-lg text-white">Tax Documents</h3>
                            </div>
                            <p className="text-sm text-gray-400 mb-6">Download your consolidated giving statements for tax filing purposes.</p>
                            
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <i className="fas fa-file-pdf text-red-400"></i>
                                        <span className="text-sm font-semibold text-gray-300 group-hover:text-white">2023 Annual Statement</span>
                                    </div>
                                    <i className="fas fa-download text-gray-500 group-hover:text-white"></i>
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <i className="fas fa-file-csv text-green-400"></i>
                                        <span className="text-sm font-semibold text-gray-300 group-hover:text-white">Q1 2024 Summary</span>
                                    </div>
                                    <i className="fas fa-download text-gray-500 group-hover:text-white"></i>
                                </button>
                            </div>
                        </div>

                        {/* Recurring Impact */}
                        <div className="bg-gradient-to-b from-[#1a365d]/40 to-transparent border border-white/10 rounded-2xl p-6 shadow-xl">
                            <h3 className="font-bold text-lg text-white mb-4">Recurring Impact</h3>
                            <div className="space-y-4">
                                {DONATION_HISTORY.filter(d => d.isRecurring).slice(0, 2).map(d => (
                                    <div key={`rec-${d.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5">
                                        <img src={d.charityLogo} alt="Logo" className="w-10 h-10 rounded-full bg-white p-1" />
                                        <div className="flex-grow">
                                            <p className="text-sm font-bold text-white">{d.charityName}</p>
                                            <p className="text-xs text-gray-400">Monthly Donation</p>
                                        </div>
                                        <p className="font-bold text-yellow-400">{formatCurrency(d.amount)}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-300 hover:text-white transition-colors border border-dashed border-blue-500/30 rounded-lg hover:bg-blue-500/10">
                                + Setup New Recurring
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {isDonateModalOpen && (
                <DonateModal 
                    isOpen={isDonateModalOpen}
                    onClose={() => setIsDonateModalOpen(false)}
                    initialCharity={selectedCharity}
                    setActiveView={setActiveView}
                />
            )}
        </div>
    );
};

export default CharityView;
