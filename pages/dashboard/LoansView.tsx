import React from 'react';
// FIX: Corrected import path
import { LOANS } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
// FIX: Corrected import path
import type { Loan, ViewType } from '../../types';

interface LoansViewProps {
    setActiveView: (view: ViewType) => void;
}

const LoanCard: React.FC<{ loan: Loan; onMakePayment: () => void; }> = ({ loan, onMakePayment }) => {
    const progress = (loan.paidAmount / loan.totalAmount) * 100;
    const remainingBalance = loan.totalAmount - loan.paidAmount;

    return (
        <div className="relative rounded-xl shadow-lifted overflow-hidden text-white">
            <img 
                src={loan.imageUrl} 
                alt={loan.type} 
                className="absolute inset-0 w-full h-full object-cover animate-kenburns-subtle" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50"></div>
            
            <div className="relative z-10 p-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-shadow">{loan.type}</h2>
                    <span className="text-sm font-semibold opacity-80 text-shadow">Rate: {loan.interestRate.toFixed(2)}%</span>
                </div>
                <p className="text-4xl font-bold mt-4 text-shadow-lg">{formatCurrency(remainingBalance)}</p>
                <p className="text-sm opacity-80 text-shadow">Remaining Balance</p>
                
                <div className="mt-4">
                    <div className="w-full bg-white/20 rounded-full h-2.5">
                        <div className="bg-green-400 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs opacity-80 mt-1 text-shadow">
                        <span>{formatCurrency(loan.paidAmount)} Paid</span>
                        <span>{formatCurrency(loan.totalAmount)} Total</span>
                    </div>
                </div>
            </div>
            <div className="relative z-10 bg-black/30 backdrop-blur-sm px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                    <p className="text-sm opacity-80 text-shadow">Next Payment:</p>
                    <p className="font-semibold text-shadow">{formatCurrency(loan.nextPayment)} on {formatDate(loan.nextPaymentDate)}</p>
                </div>
                <div className="mt-3 sm:mt-0">
                    <button onClick={onMakePayment} className="px-5 py-2 rounded-md bg-[#e6b325] text-[#1a365d] font-semibold hover:bg-[#d19d1f] transition-colors w-full sm:w-auto">
                        Make Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

const LoansView: React.FC<LoansViewProps> = ({ setActiveView }) => {
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[#1a365d]">Loan Center</h1>
                <button 
                    onClick={() => setActiveView('loan-application')}
                    className="px-6 py-3 rounded-lg bg-[#1a365d] text-white font-semibold hover:bg-[#2d5c8a] transition-transform transform hover:scale-105"
                >
                    <i className="fas fa-plus mr-2"></i>
                    Apply for a New Loan
                </button>
            </div>
            <div className="space-y-8">
                {LOANS.map(loan => <LoanCard key={loan.id} loan={loan} onMakePayment={() => setActiveView('payments')} />)}
            </div>
        </div>
    );
};

export default LoansView;