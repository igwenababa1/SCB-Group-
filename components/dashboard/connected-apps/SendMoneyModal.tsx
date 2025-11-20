import React, { useState } from 'react';
import type { ConnectedApp, Account, ViewType } from '../../../types';
import { ACCOUNTS } from '../../../constants';
import { formatCurrency } from '../../../utils/formatters';

interface SendMoneyModalProps {
    isOpen: boolean;
    onClose: () => void;
    app: ConnectedApp;
    setActiveView: (view: ViewType) => void;
}

const SendMoneyModal: React.FC<SendMoneyModalProps> = ({ isOpen, onClose, app, setActiveView }) => {
    const [step, setStep] = useState(1);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    
    if (!isOpen) return null;

    const handleCloseAndReset = () => {
        setStep(1);
        setRecipient('');
        setAmount('');
        onClose();
    };
    
    const handleDone = () => {
        handleCloseAndReset();
        setActiveView('receipts');
    };

    const handleConfirm = () => {
        console.log(`Sending ${amount} via ${app.name} to ${recipient}`);
        setStep(3); // Success
    };

    const renderStepContent = () => {
        const amountNum = parseFloat(amount) || 0;
        switch (step) {
            case 1: // Enter Details
                return (
                     <div>
                        <div className="space-y-4">
                            <input type="text" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder={`${app.name} username, email or phone`} className="w-full bg-gray-900 border-gray-600 rounded-md text-white" />
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount (USD)" className="w-full bg-gray-900 border-gray-600 rounded-md text-white" />
                        </div>
                        <button onClick={() => setStep(2)} disabled={!recipient || amountNum <= 0} className="mt-6 w-full py-3 rounded-md bg-yellow-500 text-gray-900 font-bold hover:bg-yellow-400 disabled:bg-gray-600">Review Payment</button>
                    </div>
                );
            case 2: // Review
                return (
                     <div>
                        <h3 className="font-bold text-lg mb-4 text-center">Review Payment</h3>
                        <div className="bg-gray-900/50 p-4 rounded-lg space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-400">To:</span><span className="font-semibold">{recipient}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Via:</span><span className="font-semibold">{app.name}</span></div>
                            <hr className="border-gray-600" />
                            <div className="flex justify-between text-base"><span className="text-gray-300">Amount:</span><span className="font-bold text-yellow-400">{formatCurrency(amountNum)}</span></div>
                        </div>
                         <div className="flex gap-4 mt-6">
                            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-md text-gray-200 border border-gray-600 hover:bg-gray-700">Back</button>
                            <button onClick={handleConfirm} className="flex-1 py-3 rounded-md bg-green-600 text-white font-bold hover:bg-green-700">Confirm & Send</button>
                        </div>
                    </div>
                );
            case 3: // Success
                 return (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-check text-green-400 text-3xl"></i>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Payment Sent!</h2>
                        <p className="text-gray-400">Your payment of {formatCurrency(amountNum)} to {recipient} via {app.name} is on its way.</p>
                        <button onClick={handleDone} className="mt-6 w-full py-3 rounded-md bg-gray-700 hover:bg-gray-600 font-semibold">Done</button>
                    </div>
                );
        }
    };

    return (
         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-gray-800 border border-white/10 rounded-lg shadow-xl p-8 w-full max-w-md text-white" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <img src={app.logoUrl} alt={app.name} className="w-10 h-10 bg-white rounded-full p-1" />
                        <h2 className="text-2xl font-bold">Send via {app.name}</h2>
                    </div>
                    <button onClick={handleCloseAndReset} className="text-gray-400 hover:text-gray-200"><i className="fas fa-times text-xl"></i></button>
                </div>
                {renderStepContent()}
            </div>
        </div>
    );
};

export default SendMoneyModal;