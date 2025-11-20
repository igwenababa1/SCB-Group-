
import React, { useState, useMemo } from 'react';
import { ACCOUNTS, TRANSACTION_CATEGORIES_WITH_ICONS } from '../../../constants';
import { formatDate } from '../../../utils/formatters';

interface AdvancedFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filters: {
        type: string;
        accountIds: string[];
        category: string;
        dateRange: { start: string; end: string };
    };
    setFilters: (filters: AdvancedFiltersProps['filters']) => void;
    onExport: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ searchTerm, setSearchTerm, filters, setFilters, onExport }) => {
    const [showFilters, setShowFilters] = useState(false);
    const allCategories = Object.keys(TRANSACTION_CATEGORIES_WITH_ICONS);
    
    const handleFilterChange = (key: keyof AdvancedFiltersProps['filters'], value: any) => {
        setFilters({ ...filters, [key]: value });
    };

    const handleAccountToggle = (accountId: string) => {
        const newAccountIds = filters.accountIds.includes(accountId)
            ? filters.accountIds.filter(id => id !== accountId)
            : [...filters.accountIds, accountId];
        handleFilterChange('accountIds', newAccountIds);
    };

    const resetFilters = () => {
        setFilters({
            type: 'all',
            accountIds: [],
            category: 'all',
            dateRange: { start: '', end: '' },
        });
        setSearchTerm('');
    };

    const removeFilter = (type: string, value?: any) => {
        switch (type) {
            case 'search': setSearchTerm(''); break;
            case 'type': setFilters({ ...filters, type: 'all' }); break;
            case 'category': setFilters({ ...filters, category: 'all' }); break;
            case 'dateStart': setFilters({ ...filters, dateRange: { ...filters.dateRange, start: '' } }); break;
            case 'dateEnd': setFilters({ ...filters, dateRange: { ...filters.dateRange, end: '' } }); break;
            case 'account': setFilters({ ...filters, accountIds: filters.accountIds.filter(id => id !== value) }); break;
        }
    };
    
    const activeFilterPills = useMemo(() => {
        const pills: { type: string; value?: string; label: string }[] = [];
        if (searchTerm) pills.push({ type: 'search', label: `Search: "${searchTerm}"` });
        if (filters.type !== 'all') pills.push({ type: 'type', label: `Type: ${filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}` });
        if (filters.category !== 'all') pills.push({ type: 'category', label: `Category: ${filters.category}` });
        if (filters.dateRange.start) pills.push({ type: 'dateStart', label: `From: ${formatDate(filters.dateRange.start)}` });
        if (filters.dateRange.end) pills.push({ type: 'dateEnd', label: `To: ${formatDate(filters.dateRange.end)}` });
        filters.accountIds.forEach(id => {
            const account = ACCOUNTS.find(a => a.id === id);
            if (account) pills.push({ type: 'account', value: id, label: `Acc: ...${account.number.slice(-4)}` });
        });
        return pills;
    }, [searchTerm, filters]);

    return (
        <div className="bg-[#1e293b]/40 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg mb-6">
            <div className="flex flex-col md:flex-row items-center gap-2 p-2">
                {/* Search Bar */}
                <div className="relative flex-grow w-full md:w-auto">
                     <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                        type="text"
                        placeholder="Search ID, Merchant, Amount..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors placeholder-gray-500"
                    />
                </div>

                {/* Quick Toggles */}
                <div className="flex gap-2 w-full md:w-auto">
                    <button 
                        onClick={() => setShowFilters(!showFilters)} 
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg transition-all border ${showFilters ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'}`}
                    >
                        <i className="fas fa-sliders-h"></i>
                        <span>Filters</span>
                        {activeFilterPills.length > 0 && <span className="bg-black/30 px-1.5 rounded-full text-[10px]">{activeFilterPills.length}</span>}
                    </button>
                    <button onClick={onExport} className="px-4 py-2.5 text-sm font-bold rounded-lg bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 transition-colors">
                        <i className="fas fa-download"></i>
                    </button>
                </div>
            </div>
            
            {/* Active Filters Strip */}
            {activeFilterPills.length > 0 && (
                <div className="px-4 pb-3 pt-1 flex flex-wrap gap-2 items-center border-t border-white/5 mt-1">
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mr-2">Active:</span>
                    {activeFilterPills.map(pill => (
                        <div key={pill.label} className="bg-blue-500/20 border border-blue-500/30 text-blue-200 text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-2 animate-fade-in-scale-up">
                            <span>{pill.label}</span>
                            <button onClick={() => removeFilter(pill.type, pill.value)} className="hover:text-white transition-colors">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    ))}
                    <button onClick={resetFilters} className="text-[10px] text-red-400 hover:text-red-300 uppercase font-bold tracking-wider ml-auto transition-colors">Clear All</button>
                </div>
            )}

            {/* Expandable Filter Panel */}
            {showFilters && (
                <div className="p-4 border-t border-white/10 bg-black/20 rounded-b-xl grid grid-cols-1 md:grid-cols-4 gap-6 text-sm animate-fade-in-section">
                    {/* Date Range */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-2">Date Range</label>
                        <div className="space-y-2">
                             <input type="date" value={filters.dateRange.start} onChange={e => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })} className="w-full bg-[#0b1120] border border-white/10 rounded-md px-3 py-2 text-gray-300 text-xs focus:border-yellow-400 transition-colors" />
                             <input type="date" value={filters.dateRange.end} onChange={e => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })} className="w-full bg-[#0b1120] border border-white/10 rounded-md px-3 py-2 text-gray-300 text-xs focus:border-yellow-400 transition-colors" />
                        </div>
                    </div>
                    
                    {/* Type & Category */}
                    <div className="space-y-4">
                         <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-2">Transaction Type</label>
                            <select value={filters.type} onChange={e => handleFilterChange('type', e.target.value)} className="w-full bg-[#0b1120] border border-white/10 rounded-md px-3 py-2 text-gray-300 text-xs focus:border-yellow-400 transition-colors">
                                <option value="all">All Types</option>
                                <option value="income">Income (Credit)</option>
                                <option value="expense">Expense (Debit)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-2">Category</label>
                            <select value={filters.category} onChange={e => handleFilterChange('category', e.target.value)} className="w-full bg-[#0b1120] border border-white/10 rounded-md px-3 py-2 text-gray-300 text-xs focus:border-yellow-400 transition-colors">
                                <option value="all">All Categories</option>
                                {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Accounts */}
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-2">Filter by Account</label>
                        <div className="grid grid-cols-2 gap-2">
                            {ACCOUNTS.map(account => (
                                <label key={account.id} className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all ${filters.accountIds.includes(account.id) ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-200' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}>
                                    <input type="checkbox" checked={filters.accountIds.includes(account.id)} onChange={() => handleAccountToggle(account.id)} className="hidden" />
                                    <div className={`w-3 h-3 rounded border flex items-center justify-center ${filters.accountIds.includes(account.id) ? 'bg-yellow-400 border-yellow-400' : 'border-gray-500'}`}>
                                        {filters.accountIds.includes(account.id) && <i className="fas fa-check text-black text-[8px]"></i>}
                                    </div>
                                    <span className="text-xs">{account.type} (...{account.number.slice(-4)})</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvancedFilters;
