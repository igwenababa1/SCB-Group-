
import React, { useState } from 'react';
import NetWorth from '../../components/dashboard/NetWorth';
import AccountCardsGrid from '../../components/dashboard/congratulations/AccountCardsGrid';
import { ACCOUNTS } from '../../constants';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../contexts/GlobalSettingsContext';

const CongratulationsView: React.FC = () => {
    const [isBalanceHidden, setIsBalanceHidden] = useState(false);
    const { currency, exchangeRate, language } = useCurrency();

    const totalAssets = ACCOUNTS.filter(a => a.type !== 'Credit').reduce((sum, item) => sum + item.balance, 0);
    const totalLiabilities = ACCOUNTS.filter(a => a.type === 'Credit').reduce((sum, item) => sum + Math.abs(item.balance), 0);
    const netWorth = totalAssets - totalLiabilities;
    const convertedNetWorth = netWorth * exchangeRate;

    return (
        <div className="min-h-full bg-gray-50 dark:bg-slate-900 p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Congratulations, Rodriguez!</h1>
                    <p className="text-gray-500 dark:text-gray-400">You're building a strong financial future. Here's your complete snapshot.</p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Net Worth</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                            {isBalanceHidden ? '••••••' : formatCurrency(convertedNetWorth, currency.code, language.code)}
                        </p>
                    </div>
                    <button onClick={() => setIsBalanceHidden(!isBalanceHidden)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-slate-700 transition-colors">
                        <i className={`fas ${isBalanceHidden ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                </div>
            </div>

            <AccountCardsGrid isBalanceHidden={isBalanceHidden} />

            <div className="mt-8">
                 <NetWorth isBalanceHidden={isBalanceHidden} />
            </div>
        </div>
    );
};

export default CongratulationsView;