
// FIX: Removed invalid text from the start and end of the file that was causing parsing errors.
import React, { useContext, useState } from 'react';
import { AppContext } from '../../App';
import type { ViewType } from '../../types';

interface NavItemProps {
    view: ViewType;
    label: string;
    icon: string;
    activeView: ViewType;
    isCollapsed: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ view, label, icon, activeView, isCollapsed, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full p-3 my-1 rounded-lg text-left transition-colors duration-200 ${
            activeView === view
                ? 'bg-yellow-400 text-gray-900 font-semibold'
                : 'text-gray-300 hover:bg-gray-700'
        } ${isCollapsed ? 'justify-center' : ''}`}
        title={isCollapsed ? label : ''}
    >
        <i className={`fas ${icon} w-8 text-center text-lg`}></i>
        {!isCollapsed && <span className="ml-3">{label}</span>}
    </button>
);

interface SidebarProps {
    activeView: ViewType;
    setActiveView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
    const { logout } = useContext(AppContext);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const mainViews: { view: ViewType; label: string; icon: string }[] = [
        { view: 'congratulations', label: 'Net Worth', icon: 'fa-gem' },
        { view: 'dashboard', label: 'Dashboard', icon: 'fa-home' },
        { view: 'transactions', label: 'Transactions', icon: 'fa-exchange-alt' },
        { view: 'cards', label: 'Cards', icon: 'fa-credit-card' },
        { view: 'payments', label: 'Payments', icon: 'fa-paper-plane' },
    ];
    
    const financialViews: { view: ViewType; label: string; icon: string }[] = [
        { view: 'budgeting', label: 'Budgeting', icon: 'fa-chart-pie' },
        { view: 'investments', label: 'Investments', icon: 'fa-chart-line' },
        { view: 'crypto', label: 'Crypto', icon: 'fa-btc' },
        { view: 'loans', label: 'Loans', icon: 'fa-landmark' },
        { view: 'recurring-payments', label: 'Recurring', icon: 'fa-calendar-check' },
    ];
    
    const toolsViews: { view: ViewType; label: string; icon: string }[] = [
        { view: 'charity', label: 'Charity', icon: 'fa-hand-holding-heart' },
        { view: 'network', label: 'Global Network', icon: 'fa-globe-americas' },
        { view: 'apps', label: 'Connected Apps', icon: 'fa-plug' },
        { view: 'alerts', label: 'Alerts', icon: 'fa-bell' },
        { view: 'receipts', label: 'Receipts', icon: 'fa-receipt' },
    ];

    return (
        <aside className={`bg-[#1a365d] text-white flex flex-col p-4 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-24' : 'w-64'}`}>
            <div className={`text-center mb-8 py-2 transition-all duration-300 ${isCollapsed ? 'px-0' : ''}`}>
                <i className="fas fa-university text-4xl text-yellow-400"></i>
                <h1 className={`font-bold mt-2 transition-opacity duration-200 overflow-hidden whitespace-nowrap ${isCollapsed ? 'text-xs' : 'text-lg'}`}>
                    {isCollapsed ? 'SCB' : 'Swedish Construction Bank'}
                </h1>
            </div>
            <nav className="flex-grow overflow-y-auto scrollbar-hide">
                {mainViews.map(({ view, label, icon }) => (
                    <NavItem key={view} view={view} label={label} icon={icon} activeView={activeView} isCollapsed={isCollapsed} onClick={() => setActiveView(view)} />
                ))}
                <hr className="my-4 border-gray-700" />
                {financialViews.map(({ view, label, icon }) => (
                    <NavItem key={view} view={view} label={label} icon={icon} activeView={activeView} isCollapsed={isCollapsed} onClick={() => setActiveView(view)} />
                ))}
                 <hr className="my-4 border-gray-700" />
                {toolsViews.map(({ view, label, icon }) => (
                    <NavItem key={view} view={view} label={label} icon={icon} activeView={activeView} isCollapsed={isCollapsed} onClick={() => setActiveView(view)} />
                ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-700">
                 <NavItem view="support" label="Support" icon="fa-question-circle" activeView={activeView} isCollapsed={isCollapsed} onClick={() => setActiveView('support')} />
                 <NavItem view="settings" label="Settings" icon="fa-cog" activeView={activeView} isCollapsed={isCollapsed} onClick={() => setActiveView('settings')} />
                 <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`flex items-center w-full p-3 my-1 rounded-lg text-left transition-colors duration-200 text-gray-300 hover:bg-gray-700 ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? 'Expand Menu' : 'Collapse Menu'}
                >
                    <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} w-8 text-center text-lg`}></i>
                    {!isCollapsed && <span className="ml-3">Collapse</span>}
                </button>
                <button
                    onClick={logout}
                    className={`flex items-center w-full p-3 my-1 rounded-lg text-left text-gray-300 hover:bg-red-500/50 hover:text-white transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? 'Logout' : ''}
                >
                    <i className="fas fa-sign-out-alt w-8 text-center text-lg"></i>
                    {!isCollapsed && <span className="ml-3">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
