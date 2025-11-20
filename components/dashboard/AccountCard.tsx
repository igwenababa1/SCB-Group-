

import React from 'react';
// FIX: Corrected import path
import type { Account } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface AccountCardProps {
    account: Account;
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
    const isNegative = account.balance < 0;
    const changeIsPositive = account.change && account.change >= 0;

    const getIcon = (type: Account['type']) => {
        switch (type) {
            case 'Checking': return 'fa-wallet';
            case 'Savings': return 'fa-piggy-bank';
            case 'Investment': return 'fa-chart-line';
            case 'Credit': return 'fa-credit-card';
            default: return 'fa-dollar-sign';
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-semibold text-gray-500">{account.type}</p>
                    <p className="text-xs text-gray-400">{account.number}</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <i className={`fas ${getIcon(account.type)} text-gray-600`}></i>
                </div>
            </div>
            <div className="mt-4">
                <p className={`text-3xl font-bold ${isNegative ? 'text-red-500' : 'text-gray-800'}`}>
                    {formatCurrency(account.balance)}
                </p>
                {account.change !== undefined && (
                    <p className={`text-sm font-semibold ${changeIsPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {changeIsPositive ? '+' : ''}{formatCurrency(account.change)} Today
                    </p>
                )}
            </div>
        </div>
    );
};

export default AccountCard;
