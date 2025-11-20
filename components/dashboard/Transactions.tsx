
import React from 'react';
// FIX: Corrected import path
import { TRANSACTIONS, ACCOUNTS, TRANSACTION_CATEGORIES_WITH_ICONS } from '../../constants';
// FIX: Corrected import path
import type { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

const accountTypeMap = ACCOUNTS.reduce((map, account) => {
    map[account.id] = account.type;
    return map;
}, {} as Record<string, string>);

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const categoryIcon = TRANSACTION_CATEGORIES_WITH_ICONS[transaction.category] || 'fa-receipt';

    return (
        <div className="flex justify-between items-center py-3 border-b last:border-0 dark:border-slate-700">
            <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mr-4 bg-gray-100 dark:bg-slate-700">
                    {transaction.merchantLogoUrl ? (
                        <img src={transaction.merchantLogoUrl} alt={transaction.description} className="w-6 h-6 rounded-full" />
                    ) : (
                        <i className={`fas ${categoryIcon} text-gray-600 dark:text-slate-300`}></i>
                    )}
                </div>
                <div>
                    <p className="font-semibold text-gray-800 dark:text-slate-100">{transaction.description}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{formatDate(transaction.date)}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-slate-100'}`}>
                    {transaction.type === 'expense' ? '-' : ''}{formatCurrency(transaction.amount)}
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400">{accountTypeMap[transaction.accountId]}</p>
            </div>
        </div>
    );
};


const Transactions: React.FC<{ limit?: number }> = ({ limit = 5 }) => {
    const recentTransactions = TRANSACTIONS.slice(0, limit);

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
            <h3 className="font-bold text-xl text-[#1a365d] dark:text-white mb-4">Recent Transactions</h3>
            <div className="space-y-2">
                {recentTransactions.map(tx => (
                    <TransactionItem key={tx.id} transaction={tx} />
                ))}
            </div>
        </div>
    );
};

export default Transactions;