


import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
// FIX: Corrected import path
import { SPENDING_CATEGORIES } from '../../../constants';
import { formatCurrency } from '../../../utils/formatters';

Chart.register(...registerables);

const SpendingInsights: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let chartInstance: Chart | undefined;
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstance = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: SPENDING_CATEGORIES.map(c => c.name),
                        datasets: [{
                            data: SPENDING_CATEGORIES.map(c => c.amount),
                            backgroundColor: SPENDING_CATEGORIES.map(c => {
                                const colorClass = c.color.replace('bg-', '');
                                const colorShade = colorClass.split('-')[1];
                                const colorName = colorClass.split('-')[0];
                                const colors: { [key: string]: string } = {
                                    blue: `rgba(59, 130, 246, ${colorShade ? parseInt(colorShade) / 1000 : 1})`,
                                    green: `rgba(16, 185, 129, ${colorShade ? parseInt(colorShade) / 1000 : 1})`,
                                    yellow: `rgba(245, 158, 11, ${colorShade ? parseInt(colorShade) / 1000 : 1})`,
                                    red: `rgba(239, 68, 68, ${colorShade ? parseInt(colorShade) / 1000 : 1})`,
                                    gray: `rgba(156, 163, 175, ${colorShade ? parseInt(colorShade) / 1000 : 1})`,
                                };
                                return colors[colorName] || 'rgba(107, 114, 128, 1)';
                            }),
                            borderColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff',
                            borderWidth: 2,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        cutout: '60%',
                    }
                });
            }
        }
        return () => chartInstance?.destroy();
    }, []);

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
            <h3 className="font-bold text-xl text-[#1a365d] dark:text-white mb-4">Spending Insights</h3>
            <div className="relative h-40 w-40 mx-auto mb-4">
                <canvas ref={chartRef}></canvas>
            </div>
            <div className="space-y-2">
                {SPENDING_CATEGORIES.map(category => (
                    <div key={category.name} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${category.color}`}></span>
                            <span className="text-gray-600 dark:text-slate-300">{category.name}</span>
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-slate-100">{formatCurrency(category.amount)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpendingInsights;