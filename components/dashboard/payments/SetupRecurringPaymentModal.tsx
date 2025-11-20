
import React, { useState, useEffect } from 'react';
import type { RecurringPayment } from '../../../types';
import { CONTACTS } from '../../../constants';

interface SetupRecurringPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payment: RecurringPayment) => void;
    payment: RecurringPayment | null;
}

const SetupRecurringPaymentModal: React.FC<SetupRecurringPaymentModalProps> = ({ isOpen, onClose, onSave, payment }) => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState<RecurringPayment['frequency']>('Monthly');
    const [nextDate, setNextDate] = useState('');
    const [category, setCategory] = useState<RecurringPayment['category']>('Other');
    const [error, setError] = useState('');

    useEffect(() => {
        if (payment) {
            setRecipient(payment.recipient);
            setAmount(payment.amount.toString());
            setFrequency(payment.frequency);
            // Ensure date is YYYY-MM-DD for input
            const dateObj = new Date(payment.nextDate);
            setNextDate(!isNaN(dateObj.getTime()) ? dateObj.toISOString().split('T')[0] : '');
            setCategory(payment.category);
        } else {
            setRecipient('');
            setAmount('');
            setFrequency('Monthly');
            setNextDate(new Date().toISOString().split('T')[0]);
            setCategory('Other');
        }
        setError('');
    }, [payment, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipient || !amount || !nextDate) {
            setError('Please fill out all required fields.');
            return;
        }
        if (parseFloat(amount) <= 0) {
            setError('Amount must be greater than 0.');
            return;
        }
        
        const newPayment: RecurringPayment = {
            id: payment?.id || '',
            recipient,
            amount: parseFloat(amount),
            frequency,
            nextDate,
            category,
        };
        onSave(newPayment);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-[#1a365d] dark:text-white">{payment ? 'Edit Payment' : 'New Recurring Payment'}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Automate your financial commitments.</p>
                        </div>
                        <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                             <i className="fas fa-times"></i>
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                         <div>
                            <label htmlFor="recipient" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Recipient</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    id="recipient" 
                                    value={recipient} 
                                    onChange={e => setRecipient(e.target.value)} 
                                    list="contacts" 
                                    placeholder="e.g., Netflix, Landlord, Gym"
                                    className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-[#e6b325] focus:border-[#e6b325] dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 transition-all" 
                                />
                                <datalist id="contacts">
                                    {CONTACTS.map(c => <option key={c.id} value={c.name} />)}
                                </datalist>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Amount</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">$</span>
                                    <input 
                                        type="number" 
                                        id="amount" 
                                        value={amount} 
                                        onChange={e => setAmount(e.target.value)} 
                                        placeholder="0.00"
                                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg pl-7 pr-4 py-2.5 shadow-sm focus:ring-2 focus:ring-[#e6b325] focus:border-[#e6b325] dark:bg-slate-700 dark:text-white" 
                                    />
                                </div>
                            </div>
                             <div>
                                <label htmlFor="frequency" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Frequency</label>
                                <select 
                                    id="frequency" 
                                    value={frequency} 
                                    onChange={e => setFrequency(e.target.value as any)} 
                                    className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-[#e6b325] focus:border-[#e6b325] dark:bg-slate-700 dark:text-white"
                                >
                                    <option>Weekly</option>
                                    <option>Bi-Weekly</option>
                                    <option>Monthly</option>
                                    <option>Yearly</option>
                                </select>
                            </div>
                        </div>
                        
                         <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="nextDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Next Payment</label>
                                <input 
                                    type="date" 
                                    id="nextDate" 
                                    value={nextDate} 
                                    onChange={e => setNextDate(e.target.value)} 
                                    className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-[#e6b325] focus:border-[#e6b325] dark:bg-slate-700 dark:text-white" 
                                />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                                <select 
                                    id="category" 
                                    value={category} 
                                    onChange={e => setCategory(e.target.value as any)} 
                                    className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-[#e6b325] focus:border-[#e6b325] dark:bg-slate-700 dark:text-white"
                                >
                                    <option>Utilities</option>
                                    <option>Rent</option>
                                    <option>Subscription</option>
                                    <option>Loan</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-slate-700">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2.5 rounded-lg bg-[#1a365d] text-white font-bold hover:bg-[#2d5c8a] shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-0.5">
                            {payment ? 'Save Changes' : 'Create Schedule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SetupRecurringPaymentModal;
