
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import type { Holding } from '../../../types';
import { formatCurrency, formatLargeNumber } from '../../../utils/formatters';

Chart.register(...registerables);

interface HoldingDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    holding: Holding;
    onBuy: (holding: Holding) => void;
    onSell: (holding: Holding) => void;
}

const StatItem: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
    <div className="flex justify-between text-sm py-2 border-b border-white/10">
        <span className="text-gray-400">{label}</span>
        <span className="font-semibold">{value ?? 'N/A'}</span>
    </div>
);

const HoldingDetailModal: React.FC<HoldingDetailModalProps> = ({ isOpen, onClose, holding, onBuy, onSell }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                const isPositive = holding.change >= 0;
                const lineColor = isPositive ? '#22c55e' : '#ef4444';
                const gradientStart = isPositive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)';

                gradient.addColorStop(0, gradientStart);
                gradient.addColorStop(1, 'rgba(31, 41, 55, 0)');

                chartInstanceRef.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: Array.from({ length: holding.historicalData.length }, (_, i) => `Day ${i + 1}`),
                        datasets: [{
                            label: `${holding.symbol} Price`,
                            data: holding.historicalData,
                            borderColor: lineColor,
                            backgroundColor: gradient,
                            tension: 0.4,
                            fill: true,
                            pointRadius: 0,
                            pointHoverRadius: 5,
                            pointBackgroundColor: lineColor,
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2,
                        }],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                            intersect: false,
                            mode: 'index',
                        },
                        plugins: { 
                            legend: { display: false },
                            tooltip: {
                                enabled: true,
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                titleColor: '#e5e7eb',
                                bodyColor: '#d1d5db',
                                titleFont: { weight: 'bold' },
                                bodyFont: { size: 14 },
                                padding: 12,
                                cornerRadius: 8,
                                displayColors: false,
                                callbacks: {
                                    title: (tooltipItems) => `7-Day Period: ${tooltipItems[0].label}`,
                                    label: (context) => `Price: ${formatCurrency(context.parsed.y)}`,
                                }
                            }
                        },
                        scales: { 
                            y: { ticks: { callback: (value) => formatCurrency(value as number), color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                            x: { ticks: { color: '#9ca3af' }, grid: { display: false } },
                        }
                    },
                });
            }
        }
        return () => {
            chartInstanceRef.current?.destroy();
        };
    }, [isOpen, holding]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <img src={holding.logoUrl} alt={holding.name} className="w-10 h-10 bg-white rounded-full p-1" />
                        <div>
                            <h2 className="text-xl font-bold text-white">{holding.name} ({holding.symbol})</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><i className="fas fa-times text-xl"></i></button>
                </div>
                
                {/* Body */}
                <div className="flex-grow overflow-y-auto p-6">
                    <div className="mb-4">
                        <p className="text-3xl font-bold text-white">{formatCurrency(holding.price)}</p>
                        <p className={`font-semibold ${holding.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {holding.change >= 0 ? '+' : ''}{formatCurrency(holding.change)} ({holding.changePercent.toFixed(2)}%)
                        </p>
                    </div>
                    
                    {/* Chart */}
                    <div className="h-64 relative mb-6">
                        <canvas ref={chartRef}></canvas>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mb-6">
                        <div>
                            <h3 className="font-bold text-lg mb-2">Key Statistics</h3>
                            <StatItem label="Market Cap" value={holding.marketCap ? `$${formatLargeNumber(holding.marketCap)}` : undefined} />
                            <StatItem label="P/E Ratio" value={holding.peRatio} />
                            <StatItem label="Dividend Yield" value={holding.dividendYield !== undefined ? `${holding.dividendYield}%` : undefined} />
                        </div>
                        <div>
                             <h3 className="font-bold text-lg mb-2 md:invisible">_</h3>
                            <StatItem label="52-Week High" value={holding.fiftyTwoWeekHigh ? formatCurrency(holding.fiftyTwoWeekHigh) : undefined} />
                            <StatItem label="52-Week Low" value={holding.fiftyTwoWeekLow ? formatCurrency(holding.fiftyTwoWeekLow) : undefined} />
                             <StatItem label="Shares Held" value={holding.shares.toFixed(2)} />
                        </div>
                    </div>

                    {/* About */}
                    {holding.about && (
                        <div>
                            <h3 className="font-bold text-lg mb-2">About {holding.name}</h3>
                            <p className="text-sm text-gray-400">{holding.about}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-black/20 border-t border-white/10 flex gap-4">
                    <button onClick={() => onBuy(holding)} className="flex-1 py-3 rounded-md font-bold bg-green-600 hover:bg-green-700">Buy</button>
                    <button onClick={() => onSell(holding)} className="flex-1 py-3 rounded-md font-bold bg-red-600 hover:bg-red-700">Sell</button>
                </div>
            </div>
        </div>
    );
};

export default HoldingDetailModal;
