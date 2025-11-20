
import React from 'react';

const MarketTicker: React.FC = () => {
    const items = [
        { symbol: 'S&P 500', value: '4,783.45', change: '+0.52%' },
        { symbol: 'NASDAQ', value: '15,123.20', change: '+0.89%' },
        { symbol: 'DJIA', value: '37,450.10', change: '+0.12%' },
        { symbol: 'EUR/USD', value: '1.0945', change: '-0.05%' },
        { symbol: 'BTC/USD', value: '43,250.00', change: '+2.10%' },
        { symbol: 'ETH/USD', value: '2,340.15', change: '+1.45%' },
        { symbol: 'Gold', value: '2,045.50', change: '+0.30%' },
        { symbol: 'Oil', value: '73.20', change: '-1.20%' },
    ];

    return (
        <div className="w-full bg-[#0f172a]/90 backdrop-blur-md border-b border-white/5 overflow-hidden py-2">
            <div className="flex animate-marquee whitespace-nowrap">
                {[...items, ...items, ...items].map((item, i) => (
                    <div key={i} className="flex items-center mx-8 text-xs font-mono">
                        <span className="text-gray-400 mr-2 tracking-wider">{item.symbol}</span>
                        <span className="text-white font-bold mr-2">{item.value}</span>
                        <span className={`${item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'} flex items-center gap-1`}>
                            {item.change.startsWith('+') ? <i className="fas fa-caret-up"></i> : <i className="fas fa-caret-down"></i>}
                            {item.change}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketTicker;