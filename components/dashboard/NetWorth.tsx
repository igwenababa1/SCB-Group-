import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
// FIX: Corrected import path
import { NET_WORTH_SUMMARY, ACCOUNTS } from '../../constants';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency, useTheme } from '../../contexts/GlobalSettingsContext';
import type { Account } from '../../types';

Chart.register(...registerables);

interface NetWorthProps {
    isBalanceHidden?: boolean;
}

const NetWorth: React.FC<NetWorthProps> = ({ isBalanceHidden }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const { currency, exchangeRate, language } = useCurrency();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const assetAccounts = ACCOUNTS.filter(a => a.type !== 'Credit');
    const liabilityAccounts = ACCOUNTS.filter(a => a.type === 'Credit');

    const totalAssets = assetAccounts.reduce((sum, item) => sum + item.balance, 0);
    const totalLiabilities = liabilityAccounts.reduce((sum, item) => sum + Math.abs(item.balance), 0);
    const netWorth = totalAssets - totalLiabilities;
    const { last30DaysChange } = NET_WORTH_SUMMARY; // Keep this for now
    
    const convertedNetWorth = netWorth * exchangeRate;
    const convertedLast30DaysChange = last30DaysChange * exchangeRate;
    const convertedTotalAssets = totalAssets * exchangeRate;
    const convertedTotalLiabilities = totalLiabilities * exchangeRate;
    
    const accountIcons: Record<Account['type'], string> = {
        Checking: 'fa-wallet',
        Savings: 'fa-piggy-bank',
        Investment: 'fa-chart-line',
        Credit: 'fa-credit-card',
    };

    useEffect(() => {
        let netWorthChart: Chart | undefined;
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                netWorthChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Assets', 'Liabilities'],
                        datasets: [{
                            data: [totalAssets, totalLiabilities],
                            backgroundColor: ['#3b82f6', '#f59e0b'],
                            borderColor: [isDark ? '#1f2937' : '#ffffff', isDark ? '#1f2937' : '#ffffff'],
                            borderWidth: 4,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '70%',
                        plugins: {
                            legend: {
                                display: false
                            },
                        },
                    },
                });
            }
        }
        return () => {
            if (netWorthChart) netWorthChart.destroy();
        };
    }, [totalAssets, totalLiabilities, isDark]);
    
    const textColor = isDark ? 'text-white' : 'text-[#1a365d]';
    const valueTextColor = isDark ? 'text-white' : 'text-[#1a365d]';
    const subValueTextColor = isDark ? 'text-green-400' : 'text-green-500';
    const assetsColor = isDark ? 'text-gray-200' : 'text-gray-700';
    const liabilitiesColor = isDark ? 'text-gray-200' : 'text-gray-700';
    const itemTextColor = isDark ? 'text-gray-200' : 'text-gray-800';
    const subTextColor = isDark ? 'text-gray-400' : 'text-gray-500';
    const borderColor = isDark ? 'border-white/10' : 'border-gray-200';

    const renderBalance = (amount: number) => isBalanceHidden ? '••••••' : formatCurrency(amount, currency.code, language.code);
    
    const breakdownContent = (
        <div>
            <div>
                <div className="flex justify-between items-baseline mb-3">
                    <h4 className={`font-bold text-lg ${textColor}`}>Assets</h4>
                    <span className={`font-semibold ${assetsColor}`}>{renderBalance(convertedTotalAssets)}</span>
                </div>
                <div className="space-y-1">
                    {assetAccounts.map(account => (
                         <div key={account.id} className={`flex items-center justify-between text-sm py-2 border-t ${borderColor}`}>
                            <div className="flex items-center gap-3">
                                 <i className={`fas ${accountIcons[account.type]} w-4 text-center text-gray-500`}></i>
                                <div>
                                    <p className={itemTextColor}>{account.type}</p>
                                    <p className={`${subTextColor} text-xs`}>{account.number}</p>
                                </div>
                            </div>
                            <span className={`font-semibold ${itemTextColor}`}>{renderBalance(account.balance * exchangeRate)}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-6">
                <div className="flex justify-between items-baseline mb-3">
                    <h4 className={`font-bold text-lg ${textColor}`}>Liabilities</h4>
                    <span className={`font-semibold ${liabilitiesColor}`}>{renderBalance(convertedTotalLiabilities)}</span>
                </div>
                <div className="space-y-1">
                     {liabilityAccounts.map(account => (
                         <div key={account.id} className={`flex items-center justify-between text-sm py-2 border-t ${borderColor}`}>
                            <div className="flex items-center gap-3">
                                 <i className={`fas ${accountIcons[account.type]} w-4 text-center text-gray-500`}></i>
                                <div>
                                    <p className={itemTextColor}>{account.type}</p>
                                    <p className={`${subTextColor} text-xs`}>{account.number}</p>
                                </div>
                            </div>
                            <span className={`font-semibold ${itemTextColor}`}>{renderBalance(Math.abs(account.balance * exchangeRate))}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (isDark) {
        return (
            <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg border border-slate-700/50 h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
                    <div className="flex flex-col items-center text-center">
                        <h3 className={`font-bold text-xl ${textColor} mb-2`}>Your Net Worth</h3>
                        <p className={`text-5xl font-extrabold ${valueTextColor}`}>{renderBalance(convertedNetWorth)}</p>
                        <p className={`font-semibold ${subValueTextColor} mt-1`}>
                            <i className="fas fa-arrow-up mr-1"></i>
                            {isBalanceHidden ? '••••••' : `${renderBalance(convertedLast30DaysChange)} in last 30 days`}
                        </p>
                        <div className="relative w-48 h-48 mt-4">
                            <canvas ref={chartRef}></canvas>
                        </div>
                    </div>
                    {breakdownContent}
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white p-6 rounded-xl shadow-md h-full`}>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
                <div className="flex flex-col items-center text-center">
                    <h3 className={`font-bold text-xl ${textColor} mb-2`}>Your Net Worth</h3>
                    <p className={`text-5xl font-extrabold ${valueTextColor}`}>{renderBalance(convertedNetWorth)}</p>
                    <p className={`font-semibold ${subValueTextColor} mt-1`}>
                        <i className="fas fa-arrow-up mr-1"></i>
                        {isBalanceHidden ? '••••••' : `${renderBalance(convertedLast30DaysChange)} in last 30 days`}
                    </p>
                    <div className="relative w-48 h-48 mt-4">
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>
                {breakdownContent}
            </div>
        </div>
    );
};

export default NetWorth;