
import React, { useState } from 'react';
// FIX: Corrected import path
import type { CryptoHolding, ViewType } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';

interface WithdrawCryptoModalProps {
    isOpen: boolean;
    onClose: () => void;
    crypto: CryptoHolding;
    setActiveView: (view: ViewType) => void;
}

const WithdrawCryptoModal: React.FC<WithdrawCryptoModalProps> = ({ isOpen, onClose, crypto, setActiveView }) => {
    const [step, setStep] = useState(1);
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    
    if (!isOpen) return null;
    
    const handleContinue = () => {
        // Basic validation
        if (address && parseFloat(amount) > 0) {
            setStep(2);
        }
    };
    
    const handleConfirm = () => {
        // Here you would integrate with a real backend
        console.log(`Withdrawing ${amount} ${crypto.symbol} to ${address}`);
        setStep(3);
    };

    const handleCloseAndReset = () => {
        setStep(1);
        setAddress('');
        setAmount('');
        onClose();
    };

    const handleDone = () => {
        handleCloseAndReset();
        setActiveView('transactions');
    };

    const renderStepContent = () => {
        const networkFee = 0.0001; // Example fee
        const amountNum = parseFloat(amount) || 0;
        const totalDeducted = amountNum + networkFee;

        switch (step) {
            case 1:
                return (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Withdraw {crypto.symbol}</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Recipient Address</label>
                                <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder={`Enter ${crypto.name} address`} className="w-full bg-gray-900 border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Amount</label>
                                <div className="relative">
                                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-gray-900 border-gray-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-white pr-16" />
                                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">{crypto.symbol}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Available: {crypto.balanceCrypto.toFixed(6)} {crypto.symbol}</p>
                            </div>
                        </div>
                        <div className="mt-8">
                            <button onClick={handleContinue} disabled={!address || !amount || amountNum <= 0} className="w-full px-6 py-3 rounded-md bg-yellow-500 text-gray-900 font-semibold hover:bg-yellow-400 disabled:bg-gray-600 disabled:cursor-not-allowed">Continue</button>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Confirm Withdrawal</h2>
                        <div className="bg-gray-900/50 p-6 rounded-lg space-y-3">
                            <div className="flex justify-between"><span className="text-gray-400">Amount:</span><span className="font-semibold">{amountNum.toFixed(6)} {crypto.symbol}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Network Fee:</span><span className="font-semibold">{networkFee.toFixed(6)} {crypto.symbol}</span></div>
                            <div className="flex justify-between border-t border-gray-600 pt-3 mt-3"><span className="text-gray-400">Total Deducted:</span><span className="font-bold text-lg">{totalDeducted.toFixed(6)} {crypto.symbol}</span></div>
                            <div className="pt-3 border-t border-gray-600 mt-3">
                                <p className="text-gray-400 text-sm">To Address:</p>
                                <p className="font-mono text-xs break-all">{address}</p>
                            </div>
                        </div>
                        <div className="mt-8 flex gap-4">
                           <button onClick={() => setStep(1)} className="flex-1 px-6 py-3 rounded-md text-gray-200 border border-gray-600 hover:bg-gray-700">Back</button>
                           <button onClick={handleConfirm} className="flex-1 px-6 py-3 rounded-md bg-yellow-500 text-gray-900 font-semibold hover:bg-yellow-400">Confirm & Withdraw</button>
                       </div>
                    </>
                );
            case 3:
                return (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-check text-green-400 text-3xl"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Withdrawal Initiated</h2>
                        <p className="text-gray-400">Your withdrawal of {amountNum.toFixed(6)} {crypto.symbol} is being processed.</p>
                        <div className="mt-8">
                            <button onClick={handleDone} className="w-full px-6 py-3 rounded-md bg-gray-700 text-white font-semibold hover:bg-gray-600">Done</button>
                        </div>
                    </div>
                );
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-gray-800 border border-white/10 rounded-lg shadow-xl p-8 w-full max-w-md text-white" onClick={e => e.stopPropagation()}>
                {renderStepContent()}
            </div>
        </div>
    );
};

export default WithdrawCryptoModal;
