
import React from 'react';
import type { Transaction, Account, ViewType } from '../../../types';
import { ACCOUNTS } from '../../../constants';
import { formatCurrency, formatDate } from '../../../utils/formatters';

interface TransactionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction;
    setActiveView: (view: ViewType) => void;
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between py-3 border-b border-white/10 last:border-0">
        <span className="text-gray-400">{label}</span>
        <div className="font-semibold text-white text-right">{value}</div>
    </div>
);

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ isOpen, onClose, transaction, setActiveView }) => {
    if (!isOpen) return null;

    const account = ACCOUNTS.find(acc => acc.id === transaction.accountId) as Account;
    const isIncome = transaction.type === 'income';

    const handleViewReceipt = () => {
        onClose();
        setActiveView('receipts');
    };
    
    const statusStyles = {
        Completed: 'text-green-400',
        Pending: 'text-yellow-400',
        Failed: 'text-red-400',
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 border border-white/10 rounded-lg shadow-xl p-8 w-full max-w-md text-white" 
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Transaction Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-lg mb-6 text-center">
                    {transaction.merchantLogoUrl && (
                        <img src={transaction.merchantLogoUrl} alt={transaction.description} className="w-16 h-16 rounded-full mx-auto mb-4 bg-white p-1" />
                    )}
                    <p className={`text-4xl font-bold ${isIncome ? 'text-green-400' : 'text-white'}`}>
                        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="font-semibold text-white mt-1">{transaction.description}</p>
                </div>
                
                <div>
                    <DetailRow label="Status" value={<span className={statusStyles[transaction.status]}>{transaction.status}</span>} />
                    <DetailRow label="Date" value={formatDate(transaction.date)} />
                    <DetailRow label="Category" value={transaction.category} />
                    <DetailRow label="Account" value={`${account.type} (${account.number})`} />
                    <DetailRow label="Running Balance" value={formatCurrency(transaction.runningBalance)} />
                    <DetailRow label="Transaction ID" value={<span className="font-mono text-xs">{transaction.id}</span>} />
                </div>

                <div className="mt-8 flex flex-col gap-3">
                     <button 
                        onClick={handleViewReceipt} 
                        className="w-full px-6 py-3 rounded-md bg-yellow-500 text-gray-900 font-semibold hover:bg-yellow-400"
                    >
                        View Full Receipt
                    </button>
                     <button 
                        onClick={onClose} 
                        className="w-full px-6 py-2 rounded-md bg-gray-700/60 text-gray-200 font-semibold hover:bg-gray-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailModal;
