
import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardView from './dashboard/DashboardView';
import TransactionsView from './dashboard/TransactionsView';
import CardsView from './dashboard/CardsView';
import PaymentsView from './dashboard/PaymentsView';
import BudgetingView from './dashboard/BudgetingView';
import InvestmentsView from './dashboard/InvestmentsView';
import LoansView from './dashboard/LoansView';
import SettingsView from './dashboard/SettingsView';
import CryptoView from './dashboard/CryptoView';
import CharityView from './dashboard/CharityView';
import GlobalNetworkView from './dashboard/GlobalNetworkView';
import ConnectedAppsView from './dashboard/ConnectedAppsView';
import AlertsView from './dashboard/AlertsView';
import ReceiptsView from './dashboard/ReceiptsView';
import SupportView from './dashboard/SupportView';
import RecurringPaymentsView from './dashboard/RecurringPaymentsView';
import LoanApplicationView from './dashboard/LoanApplicationView';
import CongratulationsView from './dashboard/CongratulationsView';
import type { ViewType } from '../types';
import { DashboardContextProvider } from '../contexts/DashboardContext';

const DigitalBankingPage: React.FC = () => {
    const [activeView, setActiveView] = useState<ViewType>('recurring-payments');

    const renderView = () => {
        switch (activeView) {
            case 'dashboard': return <DashboardView setActiveView={setActiveView} />;
            case 'transactions': return <TransactionsView setActiveView={setActiveView} />;
            case 'cards': return <CardsView />;
            case 'payments': return <PaymentsView setActiveView={setActiveView} />;
            case 'budgeting': return <BudgetingView />;
            case 'investments': return <InvestmentsView />;
            case 'loans': return <LoansView setActiveView={setActiveView} />;
            case 'loan-application': return <LoanApplicationView setActiveView={setActiveView} />;
            case 'settings': return <SettingsView />;
            case 'crypto': return <CryptoView setActiveView={setActiveView} />;
            case 'charity': return <CharityView setActiveView={setActiveView} />;
            case 'network': return <GlobalNetworkView setActiveView={setActiveView} />;
            case 'apps': return <ConnectedAppsView setActiveView={setActiveView} />;
            case 'alerts': return <AlertsView setActiveView={setActiveView} />;
            case 'receipts': return <ReceiptsView setActiveView={setActiveView} />;
            case 'support': return <SupportView />;
            case 'recurring-payments': return <RecurringPaymentsView />;
            case 'congratulations': return <CongratulationsView />;
            default: return <DashboardView setActiveView={setActiveView} />;
        }
    };

    return (
        <DashboardContextProvider>
            <div className="flex h-screen bg-gray-100 font-sans dark:bg-slate-900">
                <Sidebar activeView={activeView} setActiveView={setActiveView} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <DashboardHeader activeView={activeView} setActiveView={setActiveView} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-slate-900">
                        {renderView()}
                    </main>
                </div>
            </div>
        </DashboardContextProvider>
    );
};

export default DigitalBankingPage;
