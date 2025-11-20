
import React, { useState, useMemo, useEffect } from 'react';
import type { Receipt, ViewType } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import ReceiptDetailModal from '../../components/dashboard/receipts/ReceiptDetailModal';
import { useDashboard } from '../../contexts/DashboardContext';

const ReceiptStatsWidget: React.FC<{ total: number, count: number }> = ({ total, count }) => (
    <div className="bg-gradient-to-br from-[#1a365d]/80 to-[#0f172a]/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-xs font-bold text-blue-300 uppercase tracking-widest">Digital Archive Value</h3>
                <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-bold text-white">{formatCurrency(total)}</p>
                    <span className="text-xs text-green-400 font-semibold"><i className="fas fa-arrow-up"></i> 12% YTD</span>
                </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                <i className="fas fa-archive"></i>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
            <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Documents</p>
                <p className="text-lg font-semibold text-white">{count}</p>
            </div>
            <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Tax Deductible</p>
                <p className="text-lg font-semibold text-white">{formatCurrency(total * 0.4)}</p>
            </div>
        </div>
    </div>
);

const ReceiptCard: React.FC<{ receipt: Receipt, onClick: () => void }> = ({ receipt, onClick }) => (
    <button 
        onClick={onClick} 
        className="group relative w-full text-left bg-[#1e293b]/60 backdrop-blur-md border border-white/5 hover:border-yellow-400/30 rounded-xl p-0 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
    >
        {/* Top Color Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1a365d] to-[#2d5c8a] group-hover:from-yellow-400 group-hover:to-yellow-600 transition-all"></div>
        
        <div className="p-5">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white p-1 shadow-lg flex items-center justify-center">
                        <img src={receipt.vendorLogo} alt={receipt.vendor} className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-lg group-hover:text-yellow-400 transition-colors">{receipt.vendor}</h4>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                            <i className="fas fa-clock text-[10px]"></i> {formatDate(receipt.date)}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20">Verified</span>
                </div>
            </div>

            <div className="flex justify-between items-end border-t border-white/5 pt-4">
                <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Category</p>
                    <span className="text-sm text-gray-300 bg-white/5 px-2 py-1 rounded border border-white/10">
                        {receipt.category}
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Total</p>
                    <p className="text-xl font-mono font-bold text-white">{formatCurrency(receipt.total)}</p>
                </div>
            </div>
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </button>
);

interface ReceiptsViewProps {
    setActiveView: (view: ViewType) => void;
}

const ReceiptsView: React.FC<ReceiptsViewProps> = ({ setActiveView }) => {
    const { receipts, newReceiptId, clearNewReceipt } = useDashboard();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
    const [filterCategory, setFilterCategory] = useState('All');

    useEffect(() => {
        if (newReceiptId) {
            const newReceipt = receipts.find(r => r.id === newReceiptId);
            if (newReceipt) {
                setSelectedReceipt(newReceipt);
                clearNewReceipt();
            }
        }
    }, [newReceiptId, receipts, clearNewReceipt]);

    const filteredReceipts = useMemo(() => {
        return receipts
            .filter(r => {
                const matchesSearch = r.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    r.category.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = filterCategory === 'All' || r.category === filterCategory;
                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [searchTerm, receipts, filterCategory]);

    const totalValue = receipts.reduce((acc, curr) => acc + curr.total, 0);
    
    const categories = ['All', ...Array.from(new Set(receipts.map(r => r.category)))];

    return (
        <div className="relative min-h-full bg-[#0b1120] text-white overflow-hidden">
             {/* Background */}
            <div 
                className="absolute inset-0 z-0 opacity-20"
                style={{ 
                    backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b1120]/90 via-[#0b1120]/95 to-[#0b1120]"></div>

            <div className="relative z-10 p-8 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest">
                                Document Vault
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
                            Digital Receipts
                        </h1>
                        <p className="text-gray-400 text-lg">Secure storage for all transaction documentation and warranties.</p>
                    </div>
                    
                    <div className="flex gap-4 mt-6 md:mt-0">
                        <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-bold transition-colors flex items-center gap-2">
                            <i className="fas fa-cloud-download-alt"></i> Export Year
                        </button>
                        <button className="px-6 py-3 rounded-xl bg-[#e6b325] text-[#1a365d] font-bold shadow-lg shadow-yellow-500/20 hover:bg-[#d4a017] transition-colors flex items-center gap-2">
                            <i className="fas fa-camera"></i> Snap Receipt
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                    {/* Stats Widget */}
                    <ReceiptStatsWidget total={totalValue} count={receipts.length} />
                    
                    {/* Search & Filter Area */}
                    <div className="lg:col-span-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                        <div className="relative w-full mb-4">
                            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Search vendor, amount, or reference ID..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                                        filterCategory === cat 
                                            ? 'bg-yellow-400 text-black shadow-md' 
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            
                {/* Grid of Receipts */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredReceipts.map(receipt => (
                        <div key={receipt.id} className="animate-fade-in-scale-up">
                            <ReceiptCard receipt={receipt} onClick={() => setSelectedReceipt(receipt)} />
                        </div>
                    ))}
                </div>

                {filteredReceipts.length === 0 && (
                    <div className="text-center py-24 border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
                        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-receipt text-5xl text-gray-600"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Vault Empty</h3>
                        <p className="text-gray-400 mt-2">No documents match your current criteria.</p>
                    </div>
                )}
            </div>

            {selectedReceipt && (
                <ReceiptDetailModal
                    isOpen={!!selectedReceipt}
                    onClose={() => setSelectedReceipt(null)}
                    receipt={selectedReceipt}
                    setActiveView={setActiveView}
                />
            )}
        </div>
    );
};

export default ReceiptsView;
