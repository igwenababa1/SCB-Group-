import React, { useState, useMemo } from 'react';
import { TRANSACTIONS, SUPPORT_FAQS } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface GlobalSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');

    const searchResults = useMemo(() => {
        if (query.length < 2) {
            return { transactions: [], faqs: [] };
        }
        const lowerQuery = query.toLowerCase();
        
        const transactions = TRANSACTIONS.filter(tx => 
            tx.description.toLowerCase().includes(lowerQuery) ||
            tx.category.toLowerCase().includes(lowerQuery)
        ).slice(0, 5);
        
        const faqs = SUPPORT_FAQS.filter(faq =>
            faq.question.toLowerCase().includes(lowerQuery) ||
            faq.answer.toLowerCase().includes(lowerQuery)
        ).slice(0, 3);
        
        return { transactions, faqs };
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 border border-white/10 rounded-xl w-full max-w-2xl h-full max-h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-white/10">
                    <div className="relative">
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search transactions, help articles..."
                            className="w-full bg-gray-900/50 border-gray-600 rounded-full py-3 pl-12 pr-4 text-white focus:ring-yellow-400 focus:border-yellow-400"
                            autoFocus
                        />
                    </div>
                </div>
                
                <div className="flex-grow overflow-y-auto p-4">
                    {query.length < 2 ? (
                         <div className="text-center text-gray-500 pt-16">
                            <i className="fas fa-search text-4xl mb-4"></i>
                            <p>Start typing to search across the platform.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Transaction Results */}
                            {searchResults.transactions.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-400 uppercase text-xs mb-2">Transactions</h3>
                                    <div className="space-y-2">
                                        {searchResults.transactions.map(tx => (
                                            <div key={tx.id} className="bg-gray-900/50 p-3 rounded-lg flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-white">{tx.description}</p>
                                                    <p className="text-sm text-gray-400">{formatDate(tx.date)}</p>
                                                </div>
                                                <p className={`font-semibold ${tx.type === 'income' ? 'text-green-400' : 'text-white'}`}>
                                                    {tx.type === 'expense' ? '-' : ''}{formatCurrency(tx.amount)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* FAQ Results */}
                            {searchResults.faqs.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-400 uppercase text-xs mb-2">Help & Support</h3>
                                    <div className="space-y-2">
                                        {searchResults.faqs.map((faq, i) => (
                                            <div key={i} className="bg-gray-900/50 p-3 rounded-lg">
                                                <p className="font-semibold text-white">{faq.question}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {searchResults.transactions.length === 0 && searchResults.faqs.length === 0 && (
                                 <div className="text-center text-gray-500 pt-16">
                                    <i className="fas fa-box-open text-4xl mb-4"></i>
                                    <p>No results found for "{query}".</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GlobalSearchModal;
