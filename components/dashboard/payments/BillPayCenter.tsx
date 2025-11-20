

import React, { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { ACCOUNTS } from '../../../constants';
import type { Account } from '../../../types';

interface Bill {
    id: string;
    billerName: string;
    accountNumber: string;
    amount: number;
    dueDate: string;
    status: 'Overdue' | 'Due Soon' | 'Scheduled' | 'Unpaid' | 'Paid';
    category: 'Utilities' | 'Credit Card' | 'Insurance' | 'Internet' | 'Rent';
    icon: string;
    autoPay: boolean;
    isEBill: boolean;
    lastPaid?: string;
}

const MOCK_BILLS: Bill[] = [
    { id: 'b1', billerName: 'Con Edison', accountNumber: '***4829', amount: 145.20, dueDate: new Date(Date.now() + 2 * 86400000).toISOString(), status: 'Due Soon', category: 'Utilities', icon: 'fa-lightbulb', autoPay: true, isEBill: true },
    { id: 'b2', billerName: 'Verizon Fios', accountNumber: '***9921', amount: 89.99, dueDate: new Date(Date.now() + 5 * 86400000).toISOString(), status: 'Scheduled', category: 'Internet', icon: 'fa-wifi', autoPay: true, isEBill: true },
    { id: 'b3', billerName: 'Chase Sapphire', accountNumber: '***1102', amount: 2450.00, dueDate: new Date(Date.now() - 1 * 86400000).toISOString(), status: 'Overdue', category: 'Credit Card', icon: 'fa-credit-card', autoPay: false, isEBill: false },
    { id: 'b4', billerName: 'State Farm', accountNumber: '***3321', amount: 120.50, dueDate: new Date(Date.now() + 12 * 86400000).toISOString(), status: 'Unpaid', category: 'Insurance', icon: 'fa-shield-alt', autoPay: false, isEBill: true },
    { id: 'b5', billerName: 'Luxury Apartments', accountNumber: '***0001', amount: 3200.00, dueDate: new Date(Date.now() + 15 * 86400000).toISOString(), status: 'Unpaid', category: 'Rent', icon: 'fa-building', autoPay: false, isEBill: false },
];

const BillStatusBadge: React.FC<{ status: Bill['status'] }> = ({ status }) => {
    const styles = {
        'Overdue': 'bg-red-500/20 text-red-400 border-red-500/50',
        'Due Soon': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
        'Scheduled': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
        'Unpaid': 'bg-gray-500/20 text-gray-400 border-gray-500/50',
        'Paid': 'bg-green-500/20 text-green-400 border-green-500/50',
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
            {status}
        </span>
    );
};

const EBillViewerModal: React.FC<{ isOpen: boolean; onClose: () => void; bill: Bill; onPay: (bill: Bill) => void }> = ({ isOpen, onClose, bill, onPay }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            // Simulate fetching secure document
            const timer = setTimeout(() => setLoading(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <i className="fas fa-file-invoice text-blue-400"></i>
                        eBill Statement
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><i className="fas fa-times"></i></button>
                </div>

                <div className="p-8 flex-grow overflow-y-auto flex flex-col">
                    {loading ? (
                         <div className="flex-grow flex flex-col items-center justify-center text-center py-12">
                            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                            <p className="text-white font-semibold text-lg">Retrieving secure document...</p>
                            <p className="text-sm text-gray-500 mt-2">Connecting to {bill.billerName} secure portal via encrypted channel.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-white">{bill.billerName}</h2>
                                    <p className="text-gray-400">Account: {bill.accountNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400 uppercase tracking-wider">Amount Due</p>
                                    <p className="text-3xl font-bold text-white">{formatCurrency(bill.amount)}</p>
                                    <p className="text-sm text-red-400 font-semibold mt-1">Due {new Date(bill.dueDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Mock PDF Preview */}
                            <div className="flex-grow bg-white text-gray-800 p-8 rounded-lg shadow-inner mb-8 font-mono text-sm relative overflow-hidden min-h-[300px]">
                                <div className="absolute top-0 right-0 bg-gray-200 px-2 py-1 text-[10px] font-bold rounded-bl">PREVIEW</div>
                                <div className="border-b-2 border-gray-800 pb-4 mb-6 flex justify-between items-end">
                                    <div>
                                        <span className="text-xl font-bold block">{bill.billerName.toUpperCase()}</span>
                                        <span className="text-xs text-gray-500">123 Corporate Drive, Suite 400</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-bold">INVOICE</span>
                                        <span className="text-xs">#{Math.floor(Math.random()*1000000)}</span>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between"><span>Billing Period</span><span>{new Date(Date.now() - 30 * 86400000).toLocaleDateString()} - {new Date().toLocaleDateString()}</span></div>
                                    <div className="flex justify-between"><span>Previous Balance</span><span>$0.00</span></div>
                                    <div className="flex justify-between"><span>New Charges ({bill.category})</span><span>{formatCurrency(bill.amount * 0.88)}</span></div>
                                    <div className="flex justify-between"><span>Taxes & Fees</span><span>{formatCurrency(bill.amount * 0.12)}</span></div>
                                    <div className="border-t border-gray-400 my-2"></div>
                                    <div className="flex justify-between font-bold text-lg"><span>Total Due</span><span>{formatCurrency(bill.amount)}</span></div>
                                </div>
                                <div className="bg-gray-100 p-4 rounded text-xs text-gray-600 leading-relaxed">
                                    <p className="font-bold mb-1">Important Information:</p>
                                    <p>Late payments may be subject to a fee. Please ensure your payment reaches us by the due date to avoid service interruption.</p>
                                </div>
                                <div className="mt-8 text-center text-[10px] text-gray-400 uppercase">
                                    Thank you for being a valued customer.
                                </div>
                            </div>

                            <div className="flex gap-4 mt-auto">
                                <button className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white font-semibold transition-colors flex items-center justify-center gap-2 group">
                                    <i className="fas fa-download group-hover:translate-y-0.5 transition-transform"></i> Download PDF
                                </button>
                                {bill.status !== 'Paid' && (
                                    <button 
                                        onClick={() => { onClose(); onPay(bill); }}
                                        className="flex-1 py-3 rounded-xl bg-yellow-400 text-[#1a365d] font-bold hover:bg-yellow-300 transition-colors shadow-lg hover:shadow-yellow-400/20"
                                    >
                                        Pay Now
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const PaymentProcessingModal: React.FC<{ isOpen: boolean; onClose: () => void; bill: Bill; account: Account }> = ({ isOpen, onClose, bill, account }) => {
    const [step, setStep] = useState(0);
    
    const steps = [
        "Authenticating with National Biller Clearing House...",
        `Verifying account ${bill.accountNumber} with ${bill.billerName}...`,
        "Securing transfer channel (256-bit SSL)...",
        "Executing payment instruction...",
        "Payment Cleared."
    ];

    useEffect(() => {
        if (isOpen) {
            setStep(0);
            const interval = setInterval(() => {
                setStep(prev => {
                    if (prev >= steps.length - 1) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1200);
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const isComplete = step === steps.length - 1;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-gradient-to-r from-[#1a365d] to-[#0f172a] p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <i className="fas fa-university text-yellow-400"></i>
                        Payment Clearing
                    </h3>
                </div>
                
                <div className="p-8">
                    {!isComplete ? (
                        <div className="text-center">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <i className="fas fa-shield-alt text-2xl text-white"></i>
                                </div>
                            </div>
                            <p className="text-yellow-400 font-mono text-sm mb-2">PROCESSING TRANSACTION ID: #TX-{Date.now().toString().slice(-8)}</p>
                            <p className="text-gray-300 text-sm h-6">{steps[step]}</p>
                            
                            <div className="mt-8 w-full bg-gray-800 rounded-full h-1">
                                <div 
                                    className="bg-green-500 h-1 rounded-full transition-all duration-300 ease-out" 
                                    style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center animate-fade-in-scale-up">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
                                <i className="fas fa-check text-4xl text-green-400"></i>
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-2">Payment Successful</h4>
                            <p className="text-gray-400 text-sm mb-6">Your payment of <span className="text-white font-bold">{formatCurrency(bill.amount)}</span> to <span className="text-white font-bold">{bill.billerName}</span> has been processed.</p>
                            
                            <div className="bg-white/5 rounded-lg p-4 text-left mb-6 border border-white/10">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-500">Confirmation #</span>
                                    <span className="text-white font-mono">BP-{Math.floor(Math.random() * 1000000)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">From</span>
                                    <span className="text-white">{account.type} (...{account.number.slice(-4)})</span>
                                </div>
                            </div>

                            <button onClick={onClose} className="w-full py-3 rounded-lg bg-white text-[#0f172a] font-bold hover:bg-gray-200 transition-colors">
                                Done
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const BillPayCenter: React.FC = () => {
    const [bills, setBills] = useState<Bill[]>(MOCK_BILLS);
    const [selectedAccount, setSelectedAccount] = useState<Account>(ACCOUNTS[0]);
    const [processingBill, setProcessingBill] = useState<Bill | null>(null);
    const [viewingEBill, setViewingEBill] = useState<Bill | null>(null);
    
    const [remindersEnabled, setRemindersEnabled] = useState(true);
    const [notificationState, setNotificationState] = useState<{ show: boolean, message: string, icon: string, color: string } | null>(null);

    const totalDue = bills.reduce((sum, b) => b.status !== 'Paid' && b.status !== 'Scheduled' ? sum + b.amount : sum, 0);
    const scheduledTotal = bills.reduce((sum, b) => b.status === 'Scheduled' ? sum + b.amount : sum, 0);
    const paidMTD = 1250.45; // Mocked paid month-to-date

    const handlePayBill = (bill: Bill) => {
        setProcessingBill(bill);
    };

    const handlePaymentComplete = () => {
        if (processingBill) {
            setBills(prev => prev.map(b => b.id === processingBill.id ? { ...b, status: 'Paid', lastPaid: new Date().toISOString() } : b));
            setProcessingBill(null);
        }
    };
    
    const showNotification = (message: string, icon: string, color: string) => {
        setNotificationState({ show: true, message, icon, color });
        setTimeout(() => setNotificationState(null), 3000);
    };

    const toggleAutoPay = (id: string) => {
        setBills(prev => prev.map(b => {
            if (b.id === id) {
                const newAutoPay = !b.autoPay;
                let newStatus = b.status;
                
                // Smart Status Update logic
                if (newAutoPay) {
                    if (b.status !== 'Paid') newStatus = 'Scheduled';
                    showNotification(`Auto-Pay enabled for ${b.billerName}`, 'fa-check-circle', 'text-green-500');
                } else {
                    if (b.status === 'Scheduled') {
                        // Revert status based on dates if it was scheduled
                        const now = new Date();
                        const due = new Date(b.dueDate);
                        const diffTime = due.getTime() - now.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        
                        if (diffDays < 0) newStatus = 'Overdue';
                        else if (diffDays <= 3) newStatus = 'Due Soon';
                        else newStatus = 'Unpaid';
                    }
                    showNotification(`Auto-Pay disabled for ${b.billerName}`, 'fa-info-circle', 'text-blue-400');
                }
                
                return { ...b, autoPay: newAutoPay, status: newStatus };
            }
            return b;
        }));
    };
    
    const toggleReminders = () => {
        setRemindersEnabled(!remindersEnabled);
        const msg = !remindersEnabled ? 'Bill Due Alerts Enabled' : 'Bill Alerts Muted';
        const icon = !remindersEnabled ? 'fa-bell' : 'fa-bell-slash';
        const color = !remindersEnabled ? 'text-yellow-400' : 'text-gray-400';
        showNotification(msg, icon, color);
    };

    return (
        <div className="animate-fade-in-scale-up relative">
            {/* Dashboard Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-red-900/40 to-red-800/10 border border-red-500/20 p-5 rounded-xl relative">
                    <div className="flex justify-between items-start">
                        <p className="text-red-300 text-xs font-bold uppercase tracking-wider mb-1">Total Due Now</p>
                        <button 
                            onClick={toggleReminders} 
                            className={`text-xs flex items-center gap-1 ${remindersEnabled ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}
                            title="Toggle Due Date Alerts"
                        >
                            <i className={`fas ${remindersEnabled ? 'fa-bell' : 'fa-bell-slash'}`}></i>
                        </button>
                    </div>
                    <p className="text-3xl font-bold text-white">{formatCurrency(totalDue)}</p>
                    <div className="w-full bg-red-900/30 h-1 mt-3 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full w-3/4"></div>
                    </div>
                    <p className="text-[10px] text-red-400 mt-2 text-right">3 Bills Pending</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/10 border border-blue-500/20 p-5 rounded-xl">
                    <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">Scheduled</p>
                    <p className="text-3xl font-bold text-white">{formatCurrency(scheduledTotal)}</p>
                     <div className="w-full bg-blue-900/30 h-1 mt-3 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-1/2"></div>
                    </div>
                    <p className="text-[10px] text-blue-400 mt-2 text-right">Auto-Pay Active</p>
                </div>

                <div className="bg-gradient-to-br from-green-900/40 to-green-800/10 border border-green-500/20 p-5 rounded-xl">
                    <p className="text-green-300 text-xs font-bold uppercase tracking-wider mb-1">Paid (MTD)</p>
                    <p className="text-3xl font-bold text-white">{formatCurrency(paidMTD)}</p>
                    <div className="w-full bg-green-900/30 h-1 mt-3 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-full"></div>
                    </div>
                    <p className="text-[10px] text-green-400 mt-2 text-right">On Track</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Bills List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Payment Source Selector */}
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#1a365d] rounded-lg flex items-center justify-center">
                                <i className="fas fa-wallet text-white"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Default Payment Method</p>
                                <select 
                                    className="bg-transparent text-white font-bold outline-none cursor-pointer"
                                    value={selectedAccount.id}
                                    onChange={(e) => setSelectedAccount(ACCOUNTS.find(a => a.id === e.target.value) || ACCOUNTS[0])}
                                >
                                    {ACCOUNTS.filter(a => a.type !== 'Credit').map(acc => (
                                        <option key={acc.id} value={acc.id} className="text-black">{acc.type} (...{acc.number.slice(-4)}) - {formatCurrency(acc.balance)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button className="text-xs text-yellow-400 hover:text-white transition-colors font-semibold">Change</button>
                    </div>

                    {/* Bills Table */}
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h3 className="font-bold text-white">Upcoming Bills</h3>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white"><i className="fas fa-filter"></i></button>
                                <button className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white"><i className="fas fa-sort-amount-down"></i></button>
                            </div>
                        </div>
                        <div className="divide-y divide-white/5">
                            {bills.map(bill => (
                                <div key={bill.id} className="p-4 flex flex-col sm:flex-row items-center justify-between hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-4 w-full sm:w-auto mb-3 sm:mb-0">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${bill.status === 'Overdue' ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-300'}`}>
                                            <i className={`fas ${bill.icon}`}></i>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-white">{bill.billerName}</h4>
                                                {bill.isEBill && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setViewingEBill(bill); }}
                                                        className="flex items-center gap-1 text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded hover:bg-blue-500/40 transition-colors border border-blue-500/30"
                                                        title="View Electronic Bill"
                                                    >
                                                        <i className="fas fa-file-invoice"></i> eBill
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                                                {bill.category} &bull; Due {formatDate(bill.dueDate)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="text-right">
                                            <p className="font-mono font-bold text-lg text-white">{formatCurrency(bill.amount)}</p>
                                            <BillStatusBadge status={bill.status} />
                                        </div>
                                        
                                        {bill.status === 'Paid' ? (
                                            <button disabled className="px-6 py-2 rounded-lg border border-green-500/30 text-green-400 text-sm font-semibold cursor-default bg-green-500/10">
                                                Paid
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handlePayBill(bill)}
                                                className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-[#1a365d] text-sm font-bold shadow-lg shadow-yellow-400/10 transition-all transform hover:-translate-y-0.5"
                                            >
                                                Pay
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Actions & Calendar */}
                <div className="space-y-6">
                     {/* Quick Add */}
                    <button className="w-full py-4 rounded-xl border-2 border-dashed border-gray-600 hover:border-yellow-400 text-gray-400 hover:text-yellow-400 transition-all flex items-center justify-center gap-2 group">
                        <div className="w-8 h-8 rounded-full bg-gray-700 group-hover:bg-yellow-400 group-hover:text-black flex items-center justify-center transition-colors">
                            <i className="fas fa-plus"></i>
                        </div>
                        <span className="font-semibold">Add New Biller</span>
                    </button>

                    {/* Auto-Pay Management */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <i className="fas fa-sync-alt text-blue-400"></i> Auto-Pay Manager
                        </h3>
                        <div className="space-y-3">
                            {bills.filter(b => b.status !== 'Paid').map(bill => (
                                <div key={bill.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-gray-400 text-xs">
                                            <i className={`fas ${bill.icon}`}></i>
                                        </div>
                                        <span className="text-sm text-gray-300">{bill.billerName}</span>
                                    </div>
                                    <button 
                                        onClick={() => toggleAutoPay(bill.id)}
                                        className={`w-10 h-5 rounded-full relative transition-colors ${bill.autoPay ? 'bg-green-500' : 'bg-gray-600'}`}
                                    >
                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${bill.autoPay ? 'left-5' : 'left-0.5'}`}></div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Simple Calendar Widget */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <h3 className="font-bold text-white mb-4">Due Date Timeline</h3>
                        <div className="flex justify-between text-center">
                            {Array.from({length: 5}).map((_, i) => {
                                const d = new Date();
                                d.setDate(d.getDate() + i * 3);
                                return (
                                    <div key={i} className="flex flex-col items-center">
                                        <span className="text-[10px] text-gray-500 uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                        <span className={`text-sm font-bold my-1 ${i === 1 ? 'text-yellow-400' : 'text-white'}`}>{d.getDate()}</span>
                                        {i === 1 && <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {processingBill && (
                <PaymentProcessingModal 
                    isOpen={!!processingBill}
                    onClose={handlePaymentComplete}
                    bill={processingBill}
                    account={selectedAccount}
                />
            )}
            
            {viewingEBill && (
                <EBillViewerModal 
                    isOpen={!!viewingEBill}
                    onClose={() => setViewingEBill(null)}
                    bill={viewingEBill}
                    onPay={handlePayBill}
                />
            )}
            
            {/* Generic Notification Toast */}
            {notificationState && (
                <div className="absolute bottom-8 right-0 left-0 flex justify-center z-50 animate-fade-in-status-item">
                    <div className="bg-white text-gray-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-gray-100">
                        <i className={`fas ${notificationState.icon} ${notificationState.color}`}></i>
                        <span className="font-bold text-sm">
                            {notificationState.message}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillPayCenter;
