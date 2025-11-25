
import React, { useState } from 'react';
import type { ViewType, PaymentActivity } from '../../types';
import { PAYMENT_ACTIVITIES, RECURRING_PAYMENTS, CONTACTS } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import SendMoney from '../../components/dashboard/payments/SendMoney';
import WireTransfer from '../../components/dashboard/payments/WireTransfer';
import RecurringPaymentItem from '../../components/dashboard/payments/RecurringPaymentItem';
import BillPayCenter from '../../components/dashboard/payments/BillPayCenter';
import StatementModal from '../../components/dashboard/StatementModal';

interface PaymentsViewProps {
    setActiveView: (view: ViewType) => void;
}

const PaymentActivityItem: React.FC<{ activity: PaymentActivity }> = ({ activity }) => (
    <div className="group flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
        <div className="flex items-center gap-4">
            <div className="relative">
                <img src={activity.contactAvatarUrl} alt={activity.contactName} className="w-10 h-10 rounded-full border border-white/10" />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0f172a] flex items-center justify-center ${activity.type === 'sent' ? 'bg-red-500' : 'bg-green-500'}`}>
                    <i className={`fas ${activity.type === 'sent' ? 'fa-arrow-up' : 'fa-arrow-down'} text-[8px] text-white`}></i>
                </div>
            </div>
            <div>
                <p className="font-semibold text-white group-hover:text-yellow-400 transition-colors">{activity.contactName}</p>
                <p className="text-xs text-gray-400">{formatDate(activity.date)} &bull; {activity.type === 'sent' ? 'Outgoing' : 'Incoming'}</p>
            </div>
        </div>
        <div className="text-right">
            <p className={`font-mono font-bold ${activity.type === 'sent' ? 'text-white' : 'text-green-400'}`}>
                {activity.type === 'sent' ? '-' : '+'}{formatCurrency(activity.amount)}
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 uppercase tracking-wider">Completed</span>
        </div>
    </div>
);

const PaymentLimitsWidget: React.FC = () => (
    <div className="bg-gradient-to-br from-[#1a365d]/80 to-[#0f172a]/80 p-5 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Daily Transfer Limit</h4>
                <p className="text-xs text-gray-500">Resets in 14h 32m</p>
            </div>
            <i className="fas fa-shield-alt text-yellow-500/50 text-xl"></i>
        </div>
        <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
                <span className="text-white font-semibold">$12,450 used</span>
                <span className="text-gray-400">$50,000 limit</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-1.5 rounded-full" style={{ width: '25%' }}></div>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
             <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">Monthly Rolling</h4>
             <div className="flex justify-between text-sm mb-1">
                <span className="text-white font-semibold">$45,200 used</span>
                <span className="text-gray-400">$250,000 limit</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-1.5 rounded-full" style={{ width: '18%' }}></div>
            </div>
        </div>
        <button className="w-full mt-4 text-xs font-semibold text-center text-yellow-400 hover:text-white transition-colors">
            Request Limit Increase
        </button>
    </div>
);

const PaymentsView: React.FC<PaymentsViewProps> = ({ setActiveView }) => {
    const [activeTab, setActiveTab] = useState<'send' | 'wire' | 'recurring' | 'bills'>('send');
    const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);

    const handleOpenSettings = () => {
        setActiveView('settings');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'send': return <SendMoney setActiveView={setActiveView} />;
            case 'wire': return <WireTransfer setActiveView={setActiveView} />;
            case 'recurring':
                const upcomingPayments = RECURRING_PAYMENTS.slice(0, 3);
                return (
                    <div className="animate-fade-in-scale-up">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white">Scheduled Payments</h3>
                                <p className="text-gray-400 text-sm">Manage your automated financial commitments.</p>
                            </div>
                            <button 
                                onClick={() => setActiveView('recurring-payments')} 
                                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/10"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {upcomingPayments.length > 0 ? upcomingPayments.map(payment => (
                                <RecurringPaymentItem 
                                    key={payment.id} 
                                    payment={payment} 
                                    onEdit={() => setActiveView('recurring-payments')} 
                                    onDelete={() => setActiveView('recurring-payments')} 
                                    variant="overlay"
                                />
                            )) : <p className="text-gray-500 text-center py-8">No upcoming payments.</p>}
                        </div>
                        <button onClick={() => setActiveView('recurring-payments')} className="mt-6 w-full py-4 rounded-xl border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-white hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                            <i className="fas fa-plus"></i> Setup New Recurring Payment
                        </button>
                    </div>
                );
            case 'bills':
                return <BillPayCenter />;
            default: return null;
        }
    };

    return (
        <div className="relative min-h-full bg-[#0b1120] text-white">
            {/* Background Image */}
            <div 
                className="absolute inset-0 z-0 opacity-40"
                style={{ 
                    backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b1120]/80 via-[#0b1120]/95 to-[#0b1120]"></div>

            <div className="relative z-10 p-8 max-w-[1600px] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">Payments Center</h1>
                        <p className="text-gray-400 mt-2 text-lg">Global liquidity management and transfer execution.</p>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                         <button onClick={() => setIsStatementModalOpen(true)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium transition-colors flex items-center gap-2">
                            <i className="fas fa-download"></i> Statements
                        </button>
                        <button onClick={handleOpenSettings} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium transition-colors flex items-center gap-2">
                            <i className="fas fa-cog"></i> Settings
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column: Operations */}
                    <div className="xl:col-span-2 space-y-8">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Tab Navigation */}
                            <div className="flex border-b border-white/10 bg-black/20">
                                <button onClick={() => setActiveTab('send')} className={`flex-1 py-5 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === 'send' ? 'text-yellow-400 bg-white/5' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                                    Internal & Domestic
                                    {activeTab === 'send' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400"></div>}
                                </button>
                                <button onClick={() => setActiveTab('wire')} className={`flex-1 py-5 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === 'wire' ? 'text-yellow-400 bg-white/5' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                                    International Wire
                                    {activeTab === 'wire' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400"></div>}
                                </button>
                                <button onClick={() => setActiveTab('recurring')} className={`flex-1 py-5 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === 'recurring' ? 'text-yellow-400 bg-white/5' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                                    Recurring
                                    {activeTab === 'recurring' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400"></div>}
                                </button>
                                <button onClick={() => setActiveTab('bills')} className={`flex-1 py-5 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === 'bills' ? 'text-yellow-400 bg-white/5' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                                    Bill Pay
                                    {activeTab === 'bills' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400"></div>}
                                </button>
                            </div>
                            
                            {/* Content Area */}
                            <div className="p-8 min-h-[500px]">
                                {renderContent()}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-8">
                        {/* Limits */}
                        <PaymentLimitsWidget />
                        
                        {/* Smart Payees */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white">Smart Payees</h3>
                                <button className="text-xs text-yellow-400 hover:text-white">Manage</button>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {CONTACTS.slice(0, 8).map(contact => (
                                    <button key={contact.id} className="flex flex-col items-center group">
                                        <div className="w-12 h-12 rounded-full bg-white/10 p-0.5 group-hover:bg-yellow-400 transition-colors mb-1">
                                            <img src={contact.avatarUrl} alt={contact.name} className="w-full h-full rounded-full" />
                                        </div>
                                        <span className="text-[10px] text-gray-400 group-hover:text-white truncate w-full text-center">{contact.name.split(' ')[0]}</span>
                                    </button>
                                ))}
                                <button className="flex flex-col items-center group">
                                    <div className="w-12 h-12 rounded-full bg-white/5 border border-dashed border-gray-500 flex items-center justify-center group-hover:border-yellow-400 group-hover:text-yellow-400 transition-all mb-1">
                                        <i className="fas fa-plus"></i>
                                    </div>
                                    <span className="text-[10px] text-gray-400">Add New</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white">Recent Activity</h3>
                                <button onClick={() => setActiveView('transactions')} className="text-xs text-yellow-400 hover:text-white">View All</button>
                            </div>
                            <div className="space-y-2">
                                {PAYMENT_ACTIVITIES.slice(0, 5).map(activity => (
                                    <PaymentActivityItem key={activity.id} activity={activity} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <StatementModal 
                isOpen={isStatementModalOpen}
                onClose={() => setIsStatementModalOpen(false)}
                type="Account"
            />
        </div>
    );
};

export default PaymentsView;
