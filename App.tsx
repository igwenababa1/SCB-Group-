
// FIX: Replaced placeholder content with a functional App component to manage state and routing.
// FIX: Corrected import statement for React hooks
import React, { useState, useCallback, createContext, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DigitalBankingPage from './pages/DigitalBankingPage';
import OpenAccountPage from './pages/OpenAccountPage';
import SecurityCheckPage from './pages/SecurityCheckPage';
import GoodbyePage from './pages/GoodbyePage';
import SessionRestoreModal from './components/SessionRestoreModal';
import { LanguageProvider, CurrencyProvider, ThemeProvider } from './contexts/GlobalSettingsContext';

interface AppContextType {
    isLoggedIn: boolean;
    showLogin: () => void;
    showOpenAccount: () => void;
    login: () => void;
    logout: () => void;
}

export const AppContext = createContext<AppContextType>({
    isLoggedIn: false,
    showLogin: () => {},
    showOpenAccount: () => {},
    login: () => {},
    logout: () => {},
});

const SESSION_KEY = 'scb_secure_session_v1';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [view, setView] = useState<'landing' | 'login' | 'openAccount' | 'securityCheck' | 'goodbye'>('landing');
    
    // Session Restoration State
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [savedSessionData, setSavedSessionData] = useState<any>(null);

    // 1. Check for saved session on mount
    useEffect(() => {
        const savedData = localStorage.getItem(SESSION_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Check if session is valid (e.g., exists and maybe simple expiry logic if needed)
                if (parsed && (parsed.isLoggedIn || parsed.view !== 'landing')) {
                    setSavedSessionData(parsed);
                    setShowResumeModal(true);
                }
            } catch (e) {
                console.error("Session parse error", e);
                localStorage.removeItem(SESSION_KEY);
            }
        }
    }, []);

    // 2. Save session on state change
    useEffect(() => {
        if (!showResumeModal) { // Don't save while deciding to resume
            const stateToSave = {
                isLoggedIn,
                view,
                timestamp: new Date().toISOString(),
                // Note: Dashboard sub-view is saved independently in DigitalBankingPage
            };
            localStorage.setItem(SESSION_KEY, JSON.stringify(stateToSave));
        }
    }, [isLoggedIn, view, showResumeModal]);

    const login = useCallback(() => {
        setView('securityCheck');
    }, []);

    const logout = useCallback(() => {
        setView('goodbye');
        localStorage.removeItem(SESSION_KEY); // Clear session on explicit logout
        localStorage.removeItem('scb_dashboard_view'); // Clear dashboard sub-state
    }, []);
    
    const showLogin = useCallback(() => setView('login'), []);
    const showOpenAccount = useCallback(() => setView('openAccount'), []);
    const showLanding = useCallback(() => setView('landing'), []);
    
    const handleSecurityCheckComplete = useCallback(() => {
        setIsLoggedIn(true);
    }, []);
    
    const handleLogoutComplete = useCallback(() => {
        setIsLoggedIn(false);
        setView('landing');
    }, []);

    // Session Restore Handlers
    const handleRestoreSession = useCallback(() => {
        if (savedSessionData) {
            setIsLoggedIn(savedSessionData.isLoggedIn);
            setView(savedSessionData.view);
        }
        setShowResumeModal(false);
    }, [savedSessionData]);

    const handleRestartSession = useCallback(() => {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem('scb_dashboard_view');
        setShowResumeModal(false);
        // Default state is already landing/logged out
    }, []);

    const contextValue = {
        isLoggedIn,
        showLogin,
        showOpenAccount,
        login,
        logout,
    };

    const renderContent = () => {
        if (view === 'goodbye') {
            return (
                <GoodbyePage onComplete={handleLogoutComplete} />
            );
        }

        if (isLoggedIn) {
            return (
                <AppContext.Provider value={contextValue}>
                    <DigitalBankingPage />
                </AppContext.Provider>
            );
        }

        switch (view) {
            case 'login':
                return (
                     <AppContext.Provider value={contextValue}>
                        <LoginPage onBack={showLanding} />
                    </AppContext.Provider>
                );
            case 'openAccount':
                return (
                    <AppContext.Provider value={contextValue}>
                        <OpenAccountPage onNavigateToLogin={showLogin} onBack={showLanding} />
                    </AppContext.Provider>
                );
            case 'securityCheck':
                return (
                    <SecurityCheckPage onComplete={handleSecurityCheckComplete} />
                );
            case 'landing':
            default:
                 return (
                     <AppContext.Provider value={contextValue}>
                        <LandingPage />
                    </AppContext.Provider>
                );
        }
    }
    
    return (
        <ThemeProvider>
            <LanguageProvider>
                <CurrencyProvider>
                    {showResumeModal && savedSessionData ? (
                        <SessionRestoreModal 
                            isOpen={showResumeModal}
                            lastActiveTime={savedSessionData.timestamp}
                            lastView={savedSessionData.isLoggedIn ? 'Dashboard' : savedSessionData.view}
                            onRestore={handleRestoreSession}
                            onRestart={handleRestartSession}
                        />
                    ) : (
                        renderContent()
                    )}
                </CurrencyProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
};

export default App;
