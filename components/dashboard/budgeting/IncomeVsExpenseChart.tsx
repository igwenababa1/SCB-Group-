
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
// FIX: Corrected import path
import { EXPENSE_CHART_DATA } from '../../../constants';

Chart.register(...registerables);

const IncomeVsExpenseChart: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let chartInstance: Chart | undefined;
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstance = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: EXPENSE_CHART_DATA.labels,
                        datasets: [
                            {
                                label: 'Income',
                                data: EXPENSE_CHART_DATA.income,
                                backgroundColor: 'rgba(26, 54, 93, 0.8)', // #1a365d
                                borderColor: 'rgba(26, 54, 93, 1)',
                                borderWidth: 1,
                            },
                            {
                                label: 'Expenses',
                                data: EXPENSE_CHART_DATA.expenses,
                                backgroundColor: 'rgba(230, 179, 37, 0.8)', // #e6b325
                                borderColor: 'rgba(230, 179, 37, 1)',
                                borderWidth: 1,
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Income vs. Expenses (Last 6 Months)',
                                font: { size: 16 }
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return '$' + value;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
        return () => chartInstance?.destroy();
    }, []);
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-md h-96">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default IncomeVsExpenseChart;
