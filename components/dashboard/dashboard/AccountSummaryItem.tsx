


import React from 'react';
// FIX: Corrected import path
import type { Account } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';
import { useCurrency } from '../../../contexts/GlobalSettingsContext';

interface AccountSummaryItemProps {
    account: Account;
}

const AccountSummaryItem: React.FC<AccountSummaryItemProps> = ({ account }) => {
    const { currency, exchangeRate, language } = useCurrency();
    const convertedBalance = account.balance * exchangeRate;
    const isNegative = convertedBalance < 0;

    const getIcon = (type: Account['type']) => {
        switch (type) {
            case 'Checking': return 'fa-wallet text-blue-500 dark:text-blue-400';
            case 'Savings': return 'fa-piggy-bank text-green-500 dark:text-green-400';
            case 'Investment': return 'fa-chart-line text-purple-500 dark:text-purple-400';
            case 'Credit': return 'fa-credit-card text-orange-500 dark:text-orange-400';
            default: return 'fa-dollar-sign text-gray-500 dark:text-gray-400';
        }
    };
    
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-700">
                    <i className={`fas ${getIcon(account.type)}`}></i>
                </div>
                <div>
                    <p className="font-semibold text-gray-800 dark:text-slate-100">{account.type}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{account.number}</p>
                </div>
            </div>
            <p className={`text-2xl font-bold mt-2 ${isNegative ? 'text-red-500' : 'text-gray-900 dark:text-slate-50'}`}>
                {formatCurrency(convertedBalance, currency.code, language.code)}
            </p>
        </div>
    );
};

export default AccountSummaryItem;