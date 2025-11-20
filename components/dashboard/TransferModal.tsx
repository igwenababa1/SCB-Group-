import React, { useState } from 'react';
import type { ViewType, Account, Contact } from '../../types';
import { ACCOUNTS, CONTACTS } from '../../constants';
import { formatCurrency } from '../../utils/formatters';
import { useDashboard } from '../../contexts/DashboardContext';

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    setActiveView: (view: ViewType) => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose, setActiveView }) => {
    const { addReceiptAndNavigate } = useDashboard();
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [fromAccount, setFromAccount] = useState<Account>(ACCOUNTS[0]);
    const [note, setNote] = useState('');

    if (!isOpen) return null;

    const handleCloseAndReset = () => {
        setStep(1);
        setAmount('');
        setSelectedContact(null);
        setFromAccount(ACCOUNTS[0]);
        setNote('');
        onClose();
    };

    const handleConfirm = () => {
        // In a real app, this would trigger an API call.
        const newReceipt = {
            vendor: `Transfer to ${selectedContact?.name}`,
            vendorLogo: selectedContact?.avatarUrl || '',
            date: new Date().toISOString(),
            total: parseFloat(amount),
            category: 'Transfers',
            items: [{ name: `Payment with note: "${note || 'No note'}"`, quantity: 1, price: parseFloat(amount) }],
        };
        
        addReceiptAndNavigate(newReceipt, setActiveView);
        handleCloseAndReset();
    };
    
    const amountNum = parseFloat(amount) || 0;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity" onClick={handleCloseAndReset}>
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
                {/* Step 1: Amount and Recipient */}
                {step === 1 && (
                    <>
                        <h2 className="text-2xl font-bold text-[#1a365d] mb-6">Send Money</h2>
                        {/* Amount Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="$0.00" className="mt-1 w-full text-3xl font-bold border-0 border-b-2 focus:ring-0 focus:border-[#e6b325]" autoFocus />
                        </div>
                        {/* Recipient Selection */}
                        <div className="mb-6">
                             <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                             <div className="flex space-x-3 overflow-x-auto pb-2">
                                {CONTACTS.map(contact => (
                                    <button key={contact.id} onClick={() => setSelectedContact(contact)} className={`flex-shrink-0 text-center p-2 rounded-lg border-2 ${selectedContact?.id === contact.id ? 'border-[#e6b325]' : 'border-transparent'}`}>
                                        <img src={contact.avatarUrl} alt={contact.name} className="w-12 h-12 rounded-full mx-auto" />
                                        <p className="text-xs font-semibold mt-1">{contact.name.split(' ')[0]}</p>
                                    </button>
                                ))}
                             </div>
                        </div>
                        <button onClick={() => setStep(2)} disabled={!selectedContact || amountNum <= 0} className="w-full py-3 rounded-md bg-[#e6b325] text-[#1a365d] font-semibold hover:bg-[#d19d1f] disabled:bg-gray-300">
                            Continue
                        </button>
                    </>
                )}
                {/* Step 2: Review and Confirm */}
                {step === 2 && (
                    <>
                        <h2 className="text-2xl font-bold text-[#1a365d] mb-4">Review Transfer</h2>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                             <div className="flex justify-between items-center"><span className="text-gray-600">To:</span><div className="flex items-center gap-2"><img src={selectedContact?.avatarUrl} className="w-6 h-6 rounded-full"/><span className="font-semibold">{selectedContact?.name}</span></div></div>
                             <hr/>
                             <div className="flex justify-between"><span className="text-gray-600">Amount:</span><span className="font-semibold">{formatCurrency(amountNum)}</span></div>
                             <div className="flex justify-between"><span className="text-gray-600">From:</span>
                                <select onChange={e => setFromAccount(ACCOUNTS.find(a => a.id === e.target.value) || ACCOUNTS[0])} className="text-sm border-gray-300 rounded-md p-1">
                                    {ACCOUNTS.filter(a => a.type !== 'Credit').map(acc => <option key={acc.id} value={acc.id}>{acc.type} ({acc.number})</option>)}
                                </select>
                             </div>
                            <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note (optional)" className="mt-2 w-full border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-100">Back</button>
                            <button onClick={handleConfirm} className="flex-1 py-3 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700">Send Money</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TransferModal;
