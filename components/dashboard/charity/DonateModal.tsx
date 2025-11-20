import React, { useState } from 'react';
import { CHARITIES, ACCOUNTS } from '../../../constants';
import type { Charity, Account, ViewType } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';

interface DonateModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialCharity: Charity | null;
    setActiveView: (view: ViewType) => void;
}

const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
    <div className="flex justify-center items-center space-x-2 mb-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`w-8 h-2 rounded-full ${i < currentStep ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
        ))}
    </div>
);

const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose, initialCharity, setActiveView }) => {
    const [step, setStep] = useState(1);
    const [selectedCharity, setSelectedCharity] = useState<Charity | null>(initialCharity);
    const [amount, setAmount] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [fromAccount, setFromAccount] = useState<Account>(ACCOUNTS[0]);
    
    if (!isOpen) return null;

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleCloseAndReset = () => {
        setStep(1);
        setSelectedCharity(initialCharity);
        setAmount('');
        setIsRecurring(false);
        setFromAccount(ACCOUNTS[0]);
        onClose();
    };
    
    const handleDone = () => {
        handleCloseAndReset();
        setActiveView('receipts');
    };

    const handleConfirm = () => {
        // Here you would process the donation
        console.log(`Donating ${amount} to ${selectedCharity?.name} ${isRecurring ? 'monthly' : 'one-time'}`);
        handleNext();
    }

    const renderStepContent = () => {
        const amountNum = parseFloat(amount) || 0;

        switch (step) {
            case 1: // Select Charity & Amount
                return (
                    <div>
                        <h3 className="font-bold text-lg mb-4">Choose a Cause</h3>
                        <div className="flex space-x-4 overflow-x-auto pb-3 -mx-2 px-2 mb-4">
                            {CHARITIES.map(c => (
                                <button key={c.id} onClick={() => setSelectedCharity(c)} className={`flex-shrink-0 text-center p-2 rounded-lg border-2 transition-all ${selectedCharity?.id === c.id ? 'border-yellow-400 bg-gray-700' : 'border-gray-600'}`}>
                                    <img src={c.logoUrl} alt={c.name} className="w-16 h-16 rounded-full mx-auto bg-white/10 p-1" />
                                    <p className="text-xs font-semibold mt-2 truncate w-20">{c.name}</p>
                                </button>
                            ))}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Amount</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-gray-900 border-gray-600 rounded-md text-white" />
                        </div>
                        <button onClick={handleNext} disabled={!selectedCharity || amountNum <= 0} className="mt-6 w-full py-3 rounded-md bg-yellow-500 text-gray-900 font-bold hover:bg-yellow-400 disabled:bg-gray-600">Continue</button>
                    </div>
                );
            case 2: // Schedule & Payment
                 return (
                    <div>
                        <h3 className="font-bold text-lg mb-4">Schedule & Payment</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Frequency</label>
                                <div className="flex gap-2 bg-gray-900/50 p-1 rounded-md">
                                    <button onClick={() => setIsRecurring(false)} className={`flex-1 py-2 text-sm font-semibold rounded ${!isRecurring ? 'bg-yellow-500 text-gray-900' : ''}`}>One-Time</button>
                                    <button onClick={() => setIsRecurring(true)} className={`flex-1 py-2 text-sm font-semibold rounded ${isRecurring ? 'bg-yellow-500 text-gray-900' : ''}`}>Monthly</button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">From Account</label>
                                <select onChange={e => setFromAccount(ACCOUNTS.find(a => a.id === e.target.value) || ACCOUNTS[0])} className="w-full bg-gray-900 border-gray-600 rounded-md text-white">
                                    {ACCOUNTS.map(acc => <option key={acc.id} value={acc.id}>{acc.type} ({acc.number}) - {formatCurrency(acc.balance)}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button onClick={handleBack} className="flex-1 py-3 rounded-md text-gray-200 border border-gray-600 hover:bg-gray-700">Back</button>
                            <button onClick={handleNext} className="flex-1 py-3 rounded-md bg-yellow-500 text-gray-900 font-bold hover:bg-yellow-400">Review Donation</button>
                        </div>
                    </div>
                );
            case 3: // Review
                return (
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-center">Review Your Donation</h3>
                        <div className="bg-gray-900/50 p-4 rounded-lg space-y-2 text-sm">
                             <div className="flex justify-between items-center"><span className="text-gray-400">To:</span><div className="flex items-center gap-2"><img src={selectedCharity?.logoUrl} className="w-6 h-6 bg-white/10 rounded-full p-0.5"/><span className="font-semibold">{selectedCharity?.name}</span></div></div>
                             <hr className="border-gray-600" />
                            <div className="flex justify-between"><span className="text-gray-400">Amount:</span><span className="font-semibold">{formatCurrency(amountNum)}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Frequency:</span><span className="font-semibold">{isRecurring ? 'Monthly' : 'One-Time'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">From:</span><span className="font-semibold">{fromAccount.type} ({fromAccount.number})</span></div>
                        </div>
                         <div className="flex gap-4 mt-6">
                            <button onClick={handleBack} className="flex-1 py-3 rounded-md text-gray-200 border border-gray-600 hover:bg-gray-700">Back</button>
                            <button onClick={handleConfirm} className="flex-1 py-3 rounded-md bg-green-600 text-white font-bold hover:bg-green-700">Confirm & Donate</button>
                        </div>
                    </div>
                );
            case 4: // Success
                 return (
                     <div className="text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-check text-green-400 text-3xl"></i>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                        <p className="text-gray-400">Your donation of {formatCurrency(amountNum)} to {selectedCharity?.name} has been processed successfully.</p>
                        <button onClick={handleDone} className="mt-6 w-full py-3 rounded-md bg-gray-700 hover:bg-gray-600 font-semibold">Done</button>
                    </div>
                );
        }
    };

    return (
         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-gray-800 border border-white/10 rounded-lg shadow-xl p-8 w-full max-w-lg text-white" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">Make a Donation</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200"><i className="fas fa-times text-xl"></i></button>
                </div>
                {step < 4 && <StepIndicator currentStep={step} totalSteps={3} />}
                {renderStepContent()}
            </div>
        </div>
    );
};

export default DonateModal;