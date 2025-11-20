import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../App';
import type { ViewType, TranslationKey } from '../../types';
import { ALERTS } from '../../constants';
import NotificationsDropdown from './NotificationsDropdown';
import GlobalSearchModal from './GlobalSearchModal';
import { useLanguage, useTheme } from '../../contexts/GlobalSettingsContext';
import CurrencySelectorDropdown from './CurrencySelectorDropdown';

interface DashboardHeaderProps {
    activeView: ViewType;
    setActiveView: (view: ViewType) => void;
}

const viewTitleKeys: Record<ViewType, { title: TranslationKey, subtitle: TranslationKey }> = {
    dashboard: { title: "welcomeBack", subtitle: "dashboardSubtitle" },
    transactions: { title: "transactionsTitle", subtitle: "transactionsSubtitle" },
    cards: { title: "cardsTitle", subtitle: "cardsSubtitle" },
    payments: { title: "paymentsTitle", subtitle: "paymentsSubtitle" },
    budgeting: { title: "budgetingTitle", subtitle: "budgetingSubtitle" },
    investments: { title: "investmentsTitle", subtitle: "investmentsSubtitle" },
    crypto: { title: "cryptoTitle", subtitle: "cryptoSubtitle" },
    loans: { title: "loansTitle", subtitle: "loansSubtitle" },
    'loan-application': { title: "loanApplicationTitle", subtitle: "loanApplicationSubtitle" },
    charity: { title: "charityTitle", subtitle: "charitySubtitle" },
    network: { title: "networkTitle", subtitle: "networkSubtitle" },
    apps: { title: "appsTitle", subtitle: "appsSubtitle" },
    alerts: { title: "alertsTitle", subtitle: "alertsSubtitle" },
    receipts: { title: "receiptsTitle", subtitle: "receiptsSubtitle" },
    support: { title: "supportTitle", subtitle: "supportSubtitle" },
    settings: { title: "settingsTitle", subtitle: "settingsSubtitle" },
    'recurring-payments': { title: "recurringPaymentsTitle", subtitle: "recurringPaymentsSubtitle" },
    congratulations: { title: "netWorthTitle", subtitle: "netWorthSubtitle" },
};


const DashboardHeader: React.FC<DashboardHeaderProps> = ({ activeView, setActiveView }) => {
    const { logout } = useContext(AppContext);
    const { t } = useLanguage();
    const { theme, toggleTheme } = useTheme();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning, Alex!";
        if (hour < 18) return "Good afternoon, Alex!";
        return "Good evening, Alex!";
    };
    
    // In a real app, this insight would be dynamically generated.
    const quickInsight = {
        icon: 'fa-chart-line',
        color: 'text-green-500 dark:text-green-400',
        text: 'Your portfolio is up 1.05% today. Keep up the great work!'
    };

    const getTitleAndSubtitle = () => {
        if (activeView === 'dashboard') {
            return {
                title: getGreeting(),
                subtitle: (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <i className={`fas ${quickInsight.icon} ${quickInsight.color}`}></i>
                        <span className="font-semibold">{quickInsight.text}</span>
                    </div>
                ),
            };
        }
        const { title: titleKey, subtitle: subtitleKey } = viewTitleKeys[activeView] || viewTitleKeys.dashboard;
        return {
            title: t(titleKey as TranslationKey, { name: "Alex!" }),
            subtitle: <p className="text-sm text-gray-500 dark:text-gray-400">{t(subtitleKey as TranslationKey)}</p>,
        };
    };

    const { title, subtitle } = getTitleAndSubtitle();

    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

    const unreadAlertsCount = useMemo(() => ALERTS.filter(a => !a.isRead).length, []);
    
    return (
        <>
            <header className="bg-white dark:bg-slate-800 shadow-sm dark:shadow-none dark:border-b dark:border-slate-700 p-4 flex justify-between items-center flex-shrink-0 z-30">
                <div className="flex items-center gap-4">
                    {activeView !== 'dashboard' && (
                        <button
                            onClick={() => setActiveView(activeView === 'loan-application' ? 'loans' : 'dashboard')}
                            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full text-gray-600 dark:text-gray-300 flex items-center justify-center transition-colors flex-shrink-0"
                            aria-label="Go back"
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                    )}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
                        {subtitle}
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            onFocus={() => setIsSearchOpen(true)}
                            className="hidden md:block w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 bg-transparent dark:bg-slate-700 dark:text-white dark:placeholder-gray-400" 
                        />
                         <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hidden md:block"></i>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <i className="fas fa-moon text-xl"></i> : <i className="fas fa-sun text-xl"></i>}
                        </button>
                        <div className="relative">
                            <button onClick={() => setIsCurrencyOpen(prev => !prev)} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
                                <i className="fas fa-coins text-2xl"></i>
                            </button>
                            {isCurrencyOpen && <CurrencySelectorDropdown onClose={() => setIsCurrencyOpen(false)} />}
                        </div>
                        <div className="relative">
                            <button onClick={() => setIsNotificationsOpen(prev => !prev)} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white relative">
                                <i className="fas fa-bell text-2xl"></i>
                                {unreadAlertsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {unreadAlertsCount}
                                    </span>
                                )}
                            </button>
                            {isNotificationsOpen && <NotificationsDropdown onClose={() => setIsNotificationsOpen(false)} />}
                        </div>

                        <div className="flex items-center space-x-2">
                            <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2080&auto-format&fit=crop" alt="User" className="w-10 h-10 rounded-full" />
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">Alex Byrne</p>
                                    <span title="Verified Client">
                                        <i className="fas fa-check-circle text-blue-500 text-sm"></i>
                                    </span>
                                </div>
                                <button onClick={logout} className="text-xs text-red-500 hover:underline">Log Out</button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};

export default DashboardHeader;