
import React, { useState, useMemo } from 'react';
import type { Holding } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';

interface TradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    holding: Holding;
    tradeType: 'Buy' | 'Sell';
    onConfirmTrade: (shares: number) => void;
}

const TradeModal: React.FC<TradeModalProps> = ({ isOpen, onClose, holding, tradeType, onConfirmTrade }) => {
    const [step, setStep] = useState(1);
    const [shares, setShares] = useState('');
    const sharesNum = parseFloat(shares) || 0;

    const estimatedValue = useMemo(() => {
        return sharesNum * holding.price;
    }, [sharesNum, holding.price]);

    if (!isOpen) return null;

    const handleCloseAndReset = () => {
        setStep(1);
        setShares('');
        onClose();
    };
    
    const handleConfirm = () => {
        onConfirmTrade(sharesNum);
        handleCloseAndReset();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity" onClick={handleCloseAndReset}>
            <div className="bg-gray-800 border border-white/10 rounded-lg shadow-xl p-8 w-full max-w-md text-white" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{tradeType} {holding.symbol}</h2>
                    <button onClick={handleCloseAndReset} className="text-gray-400 hover:text-white"><i className="fas fa-times text-xl"></i></button>
                </div>

                {step === 1 && (
                    <div>
                        <div className="flex justify-between items-baseline mb-4">
                            <span className="text-gray-400">Market Price</span>
                            <span className="font-semibold text-lg">{formatCurrency(holding.price)}</span>
                        </div>
                        <div>
                            <label htmlFor="shares" className="block text-sm font-medium text-gray-400 mb-1">Shares</label>
                            <input
                                id="shares"
                                type="number"
                                value={shares}
                                onChange={(e) => setShares(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-gray-900 border-gray-600 rounded-md text-white p-2 text-lg"
                                autoFocus
                            />
                        </div>
                        <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-white/10">
                            <span className="text-gray-400">Estimated {tradeType === 'Buy' ? 'Cost' : 'Proceeds'}</span>
                            <span className="font-bold text-xl text-yellow-400">{formatCurrency(estimatedValue)}</span>
                        </div>
                        <button onClick={() => setStep(2)} disabled={sharesNum <= 0} className="mt-8 w-full py-3 rounded-md bg-yellow-500 text-gray-900 font-bold hover:bg-yellow-400 disabled:bg-gray-600">
                            Review Order
                        </button>
                    </div>
                )}
                
                {step === 2 && (
                     <div>
                        <h3 className="font-bold text-lg mb-4 text-center">Confirm Your Order</h3>
                        <div className="bg-gray-900/50 p-4 rounded-lg space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-400">Action:</span><span className={`font-semibold ${tradeType === 'Buy' ? 'text-green-400' : 'text-red-400'}`}>{tradeType}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Ticker:</span><span className="font-semibold">{holding.symbol}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Shares:</span><span className="font-semibold">{sharesNum}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Price per Share:</span><span className="font-semibold">{formatCurrency(holding.price)}</span></div>
                            <hr className="border-gray-600" />
                            <div className="flex justify-between text-base"><span className="text-gray-300">Estimated Total:</span><span className="font-bold text-yellow-400">{formatCurrency(estimatedValue)}</span></div>
                        </div>
                         <div className="flex gap-4 mt-6">
                            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-md text-gray-200 border border-gray-600 hover:bg-gray-700">Back</button>
                            <button onClick={handleConfirm} className="flex-1 py-3 rounded-md bg-green-600 text-white font-bold hover:bg-green-700">Submit Order</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TradeModal;
