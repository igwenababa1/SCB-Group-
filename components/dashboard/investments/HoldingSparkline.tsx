import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface HoldingSparklineProps {
    data: number[];
}

const HoldingSparkline: React.FC<HoldingSparklineProps> = ({ data }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const isPositiveTrend = data.length > 1 ? data[data.length - 1] >= data[0] : true;
    const lineColor = isPositiveTrend ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)';
    const areaColor = isPositiveTrend ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';

    useEffect(() => {
        let chartInstance: Chart | undefined;
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstance = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: data.map((_, index) => index.toString()),
                        datasets: [{
                            data: data,
                            borderColor: lineColor,
                            backgroundColor: areaColor,
                            borderWidth: 2,
                            pointRadius: 0,
                            tension: 0.4,
                            fill: true,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false },
                        },
                        scales: {
                            x: { display: false },
                            y: { display: false },
                        },
                    },
                });
            }
        }
        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [data, lineColor, areaColor]);

    return <canvas ref={chartRef}></canvas>;
};

export default HoldingSparkline;
