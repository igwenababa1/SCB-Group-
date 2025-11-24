
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../App';
import type { ViewType, TranslationKey, Alert } from '../../types';
import { ALERTS } from '../../constants';
import NotificationsDropdown from './NotificationsDropdown';
import GlobalSearchModal from './GlobalSearchModal';
import { useLanguage, useTheme } from '../../contexts/GlobalSettingsContext';
import CurrencySelectorDropdown from './CurrencySelectorDropdown';
import { bankingSystem } from '../../services/BankingSystem';

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

const PROFILE_IMAGE_URL = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&auto=format&fit=crop";

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ activeView, setActiveView }) => {
    const { logout } = useContext(AppContext);
    const { t } = useLanguage();
    const { theme, toggleTheme } = useTheme();

    const currentUser = bankingSystem.getCurrentUser();
    const firstName = currentUser?.profile.fullName.split(' ')[0] || 'User';
    const email = currentUser?.email || '';

    // State for Alerts to allow full functionality (Mark Read, Dismiss)
    const [alerts, setAlerts] = useState<Alert[]>(ALERTS);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };
    
    const quickInsight = {
        icon: 'fa-chart-line',
        color: 'text-green-500 dark:text-green-400',
        text: 'Portfolio +1.05%'
    };

    const getTitleAndSubtitle = () => {
        if (activeView === 'dashboard') {
            return {
                title: `${getGreeting()}, ${firstName}`,
                subtitle: (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="hidden md:inline">Executive Overview</span>
                        <span className="hidden md:inline text-gray-300 dark:text-gray-600">•</span>
                        <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                            <i className={`fas ${quickInsight.icon} ${quickInsight.color} text-xs`}></i>
                            <span className="font-bold text-xs text-green-600 dark:text-green-400">{quickInsight.text}</span>
                        </div>
                    </div>
                ),
            };
        }
        const { title: titleKey, subtitle: subtitleKey } = viewTitleKeys[activeView] || viewTitleKeys.dashboard;
        return {
            title: t(titleKey as TranslationKey, { name: firstName }),
            subtitle: <p className="text-sm text-gray-500 dark:text-gray-400">{t(subtitleKey as TranslationKey)}</p>,
        };
    };

    const { title, subtitle } = getTitleAndSubtitle();

    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

    const unreadAlertsCount = useMemo(() => alerts.filter(a => !a.isRead).length, [alerts]);
    const hasCriticalAlerts = useMemo(() => alerts.some(a => a.severity === 'critical' && !a.isRead), [alerts]);
    
    return (
        <>
            <header className="bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl shadow-sm border-b border-gray-200 dark:border-white/5 p-4 flex justify-between items-center sticky top-0 z-40 transition-all duration-300">
                <div className="flex items-center gap-6">
                    {activeView !== 'dashboard' && (
                        <button
                            onClick={() => setActiveView(activeView === 'loan-application' ? 'loans' : 'dashboard')}
                            className="w-10 h-10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-full text-gray-600 dark:text-gray-300 flex items-center justify-center transition-all shadow-sm group"
                            aria-label="Go back"
                        >
                            <i className="fas fa-arrow-left group-hover:-translate-x-0.5 transition-transform"></i>
                        </button>
                    )}
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">{title}</h2>
                            <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                <i className="fas fa-shield-alt text-[9px]"></i> Secure
                            </div>
                        </div>
                        <div className="mt-1">
                            {subtitle}
                        </div>
                    </div>
                </div>

                {/* Central Command Search (Desktop) */}
                <div className="hidden xl:flex flex-1 max-w-lg mx-12 relative group z-50">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative w-full">
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                        <input 
                            type="text" 
                            placeholder="Search assets, transactions, contacts..." 
                            onFocus={() => setIsSearchOpen(true)}
                            className="w-full bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-full py-3 pl-12 pr-16 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                             <span className="text-[10px] text-gray-500 font-bold border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 bg-gray-50 dark:bg-white/5">⌘K</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-5">
                    {/* Tools */}
                    <div className="flex items-center gap-1 md:gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-full border border-gray-200 dark:border-white/5">
                        <button
                            onClick={toggleTheme}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition-all"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
                        </button>
                        <div className="relative">
                            <button 
                                onClick={() => setIsCurrencyOpen(prev => !prev)} 
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isCurrencyOpen ? 'bg-white dark:bg-white/10 text-[#1a365d] dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-white dark:hover:bg-white/10'}`}
                            >
                                <i className="fas fa-coins"></i>
                            </button>
                            {isCurrencyOpen && <CurrencySelectorDropdown onClose={() => setIsCurrencyOpen(false)} />}
                        </div>
                        <div className="relative">
                            <button 
                                onClick={() => setIsNotificationsOpen(prev => !prev)} 
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all relative ${isNotificationsOpen ? 'bg-white dark:bg-white/10 text-[#1a365d] dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-white dark:hover:bg-white/10'} ${hasCriticalAlerts ? 'animate-swing' : ''}`}
                            >
                                <i className={`fas fa-bell`}></i>
                                {unreadAlertsCount > 0 && (
                                    <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#0f172a] flex items-center justify-center">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    </span>
                                )}
                            </button>
                            {isNotificationsOpen && (
                                <NotificationsDropdown 
                                    onClose={() => setIsNotificationsOpen(false)} 
                                    alerts={alerts}
                                    setAlerts={setAlerts}
                                    setActiveView={setActiveView}
                                />
                            )}
                        </div>
                    </div>

                    <div className="h-8 w-px bg-gray-200 dark:bg-white/10 hidden md:block"></div>

                    {/* User Profile */}
                    <div className="relative group">
                        <button className="flex items-center gap-3 focus:outline-none">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-gray-800 dark:text-white leading-none">{currentUser?.profile.fullName}</p>
                                <div className="flex items-center justify-end gap-1 mt-1">
                                    <i className="fas fa-crown text-[10px] text-[#e6b325]"></i>
                                    <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Private Wealth</p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-br from-[#e6b325] via-yellow-300 to-yellow-600 shadow-lg">
                                    <img 
                                        src={PROFILE_IMAGE_URL} 
                                        alt="User" 
                                        className="w-full h-full rounded-full object-cover border-2 border-white dark:border-[#0f172a]" 
                                    />
                                </div>
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#0f172a] rounded-full"></div>
                            </div>
                            <i className="fas fa-chevron-down text-gray-400 text-xs group-hover:text-gray-600 dark:group-hover:text-white transition-colors"></i>
                        </button>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute top-full right-0 mt-3 w-60 bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                            <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/20">
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Signed in as</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{email}</p>
                            </div>
                            <div className="p-2">
                                <button onClick={() => setActiveView('settings')} className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500"><i className="fas fa-user-cog"></i></div>
                                    Profile Settings
                                </button>
                                <button onClick={() => setActiveView('support')} className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500"><i className="fas fa-headset"></i></div>
                                    Support Center
                                </button>
                            </div>
                            <div className="p-2 border-t border-gray-100 dark:border-white/5">
                                <button onClick={logout} className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-3 font-semibold">
                                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500"><i className="fas fa-sign-out-alt"></i></div>
                                    Sign Out
                                </button>
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
