
import React, { useState, useMemo, useEffect } from 'react';
import { TRANSACTIONS, ACCOUNTS, TRANSACTION_CATEGORIES_WITH_ICONS } from '../../constants';
import type { Transaction, ViewType, Account } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import TransactionDetailModal from '../../components/dashboard/transactions/TransactionDetailModal';
import AdvancedFilters from '../../components/dashboard/transactions/AdvancedFilters';
import { useCurrency } from '../../contexts/GlobalSettingsContext';
import StatementModal from '../../components/dashboard/StatementModal';

// --- Helper Components ---

const LedgerHeader: React.FC<{ inflow: number, outflow: number, count: number }> = ({ inflow, outflow, count }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#1a365d]/80 to-[#0f172a]/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Total Inflow</p>
            <p className="text-2xl font-mono font-bold text-green-400">{formatCurrency(inflow)}</p>
            <div className="w-full bg-gray-700/50 h-1 mt-3 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: '100%' }}></div>
            </div>
        </div>

        <div className="bg-gradient-to-br from-[#1a365d]/80 to-[#0f172a]/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Total Outflow</p>
            <p className="text-2xl font-mono font-bold text-white">{formatCurrency(outflow)}</p>
            <div className="w-full bg-gray-700/50 h-1 mt-3 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full" style={{ width: `${(outflow / (inflow + 1)) * 100}%` }}></div>
            </div>
        </div>

        <div className="bg-gradient-to-br from-[#1a365d]/80 to-[#0f172a]/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Net Position</p>
            <p className={`text-2xl font-mono font-bold ${inflow - outflow >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                {inflow - outflow >= 0 ? '+' : ''}{formatCurrency(inflow - outflow)}
            </p>
            <p className="text-[10px] text-gray-500 mt-3 text-right">{count} transactions found</p>
        </div>
    </div>
);

const StatusBadge: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
    const config = {
        Completed: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: 'fa-check-circle' },
        Pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: 'fa-clock' },
        Failed: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'fa-times-circle' },
    };
    const style = config[status];
    
    return (
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${style.bg} ${style.color} ${style.border}`}>
            <i className={`fas ${style.icon}`}></i> {status === 'Completed' ? 'Settled' : status}
        </span>
    );
};

const TransactionRow: React.FC<{ transaction: Transaction, onSelect: () => void, delay: number }> = ({ transaction, onSelect, delay }) => {
    const { currency, exchangeRate, language } = useCurrency();
    const isIncome = transaction.type === 'income';
    const icon = TRANSACTION_CATEGORIES_WITH_ICONS[transaction.category] || 'fa-receipt';
    const account = ACCOUNTS.find(a => a.id === transaction.accountId);

    const convertedAmount = transaction.amount * exchangeRate;
    const convertedRunningBalance = transaction.runningBalance * exchangeRate;

    return (
        <div 
            onClick={onSelect}
            className="group grid grid-cols-12 items-center gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-all duration-200 cursor-pointer animate-fade-in-status-item"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="col-span-1 flex justify-center">
                <div className="w-10 h-10 rounded-xl bg-[#1e293b] border border-white/10 flex items-center justify-center group-hover:border-yellow-400/50 transition-colors shadow-lg">
                    {transaction.merchantLogoUrl ? (
                        <img src={transaction.merchantLogoUrl} alt={transaction.description} className="w-6 h-6 rounded-full object-contain bg-white p-0.5" />
                    ) : (
                        <i className={`fas ${icon} text-gray-400 group-hover:text-yellow-400 transition-colors`}></i>
                    )}
                </div>
            </div>
            
            <div className="col-span-4 pl-2">
                <p className="font-bold text-white text-sm truncate group-hover:text-blue-300 transition-colors">{transaction.description}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-500 font-mono">{formatDate(transaction.date)}</span>
                    <span className="text--[10px] text-gray-600">•</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{transaction.category}</span>
                </div>
            </div>

            <div className="col-span-2 text-xs text-gray-400">
                <p>{account?.type || 'Account'}</p>
                <p className="font-mono text-[10px] opacity-60">...{account?.number.slice(-4)}</p>
            </div>

            <div className="col-span-2 flex justify-center">
                <StatusBadge status={transaction.status} />
            </div>

            <div className="col-span-3 text-right pr-2">
                 <p className={`font-mono font-bold text-sm ${isIncome ? 'text-green-400' : 'text-white'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(convertedAmount, currency.code, language.code)}
                </p>
                 <p className="text-[10px] text-gray-600 font-mono mt-0.5">
                    Bal: {formatCurrency(convertedRunningBalance, currency.code, language.code)}
                </p>
            </div>
            
            {/* Hover Action Mock */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
                    <i className="fas fa-ellipsis-v text-xs"></i>
                </button>
            </div>
        </div>
    );
};

const SkeletonRow = () => (
    <div className="grid grid-cols-12 items-center gap-4 px-6 py-4 border-b border-white/5 animate-pulse">
        <div className="col-span-1 flex justify-center"><div className="w-10 h-10 rounded-xl bg-white/5"></div></div>
        <div className="col-span-4 pl-2 space-y-2">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-2 bg-white/5 rounded w-1/2"></div>
        </div>
        <div className="col-span-2 space-y-2">
            <div className="h-3 bg-white/5 rounded w-2/3"></div>
        </div>
        <div className="col-span-2 flex justify-center"><div className="h-6 w-20 bg-white/5 rounded-full"></div></div>
        <div className="col-span-3 flex flex-col items-end space-y-2">
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
            <div className="h-2 bg-white/5 rounded w-1/3"></div>
        </div>
    </div>
);

const TransactionsView: React.FC<{ setActiveView: (view: ViewType) => void }> = ({ setActiveView }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({
        type: 'all',
        accountIds: [] as string[],
        category: 'all',
        dateRange: { start: '', end: '' },
    });
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);

    // Simulate server loading on filter change
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 600); // 600ms simulated delay
        return () => clearTimeout(timer);
    }, [searchTerm, filters]);

    const filteredTransactions = useMemo(() => {
        return TRANSACTIONS
            .filter(tx => {
                const lowercasedSearchTerm = searchTerm.toLowerCase();
                const searchMatch = lowercasedSearchTerm ? (
                    tx.description.toLowerCase().includes(lowercasedSearchTerm) ||
                    tx.category.toLowerCase().includes(lowercasedSearchTerm) ||
                    tx.amount.toString().includes(lowercasedSearchTerm)
                ) : true;

                const typeMatch = filters.type === 'all' || tx.type === filters.type;
                const accountMatch = filters.accountIds.length === 0 || filters.accountIds.includes(tx.accountId);
                const categoryMatch = filters.category === 'all' || tx.category === filters.category;

                const txDate = new Date(tx.date);
                const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
                const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
                if (startDate) startDate.setHours(0, 0, 0, 0);
                if (endDate) endDate.setHours(23, 59, 59, 999);
                const dateMatch = (!startDate || txDate >= startDate) && (!endDate || txDate <= endDate);

                return searchMatch && typeMatch && accountMatch && categoryMatch && dateMatch;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [searchTerm, filters]);

    // Calculate Summary stats based on FILTERED data
    const summaryStats = useMemo(() => {
        return filteredTransactions.reduce((acc, tx) => {
            if (tx.type === 'income') acc.inflow += tx.amount;
            else acc.outflow += tx.amount;
            return acc;
        }, { inflow: 0, outflow: 0 });
    }, [filteredTransactions]);

    const exportToCsv = () => {
        setIsStatementModalOpen(true);
    };

    return (
        <div className="relative min-h-full bg-[#0b1120] text-white overflow-hidden font-sans">
             {/* Background */}
             <div 
                className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{ 
                    backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b1120]/90 via-[#0b1120]/95 to-[#0b1120]"></div>

            <div className="relative z-10 p-8 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-bold tracking-tight text-white">Transaction Ledger</h1>
                            <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                Live Sync
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">Real-time monitoring of all financial movements across accounts.</p>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                         <button onClick={exportToCsv} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
                            <i className="fas fa-file-csv"></i> Export CSV
                        </button>
                         <button onClick={() => setIsStatementModalOpen(true)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
                            <i className="fas fa-print"></i> Print Statement
                        </button>
                    </div>
                </div>

                {/* Stats Summary */}
                <LedgerHeader inflow={summaryStats.inflow} outflow={summaryStats.outflow} count={filteredTransactions.length} />

                {/* Filters */}
                <AdvancedFilters 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filters={filters}
                    setFilters={setFilters}
                    onExport={exportToCsv}
                />

                {/* Ledger Table */}
                <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative min-h-[500px]">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-black/20 border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400 sticky top-0 z-20 backdrop-blur-md">
                        <div className="col-span-1 text-center">Type</div>
                        <div className="col-span-4 pl-2">Description</div>
                        <div className="col-span-2">Source</div>
                        <div className="col-span-2 text-center">Status</div>
                        <div className="col-span-3 text-right pr-2">Amount / Balance</div>
                    </div>

                    {/* Table Body */}
                    <div className="relative">
                        {isLoading ? (
                            Array.from({length: 8}).map((_, i) => <SkeletonRow key={i} />)
                        ) : filteredTransactions.length > 0 ? (
                            filteredTransactions.map((tx, index) => (
                                <TransactionRow 
                                    key={tx.id} 
                                    transaction={tx} 
                                    onSelect={() => setSelectedTransaction(tx)}
                                    delay={index * 50}
                                />
                            ))
                        ) : (
                            <div className="text-center py-24">
                                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                                    <i className="fas fa-search text-4xl text-gray-600"></i>
                                </div>
                                <h3 className="text-xl font-bold text-white">No records found</h3>
                                <p className="text-gray-500 mt-2 text-sm">Adjust filters or search criteria to view transactions.</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Pagination Footer (Mock) */}
                    <div className="p-4 border-t border-white/10 bg-black/20 flex justify-between items-center text-xs text-gray-400">
                        <span>Showing {isLoading ? '...' : filteredTransactions.length} records</span>
                        <div className="flex gap-2">
                            <button disabled className="px-3 py-1 rounded bg-white/5 text-gray-600 cursor-not-allowed">Previous</button>
                            <button className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors">Next</button>
                        </div>
                    </div>
                </div>
            </div>
            
            {selectedTransaction && (
                <TransactionDetailModal 
                    isOpen={!!selectedTransaction}
                    onClose={() => setSelectedTransaction(null)}
                    transaction={selectedTransaction}
                    setActiveView={setActiveView}
                />
            )}

            <StatementModal 
                isOpen={isStatementModalOpen}
                onClose={() => setIsStatementModalOpen(false)}
                type="Consolidated"
            />
        </div>
    );
};

export default TransactionsView;
