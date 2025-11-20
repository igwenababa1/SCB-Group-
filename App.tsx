
// FIX: Replaced placeholder content with a functional App component to manage state and routing.
// FIX: Corrected import statement for React hooks
import React, { useState, useCallback, createContext } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DigitalBankingPage from './pages/DigitalBankingPage';
import OpenAccountPage from './pages/OpenAccountPage';
import SecurityCheckPage from './pages/SecurityCheckPage';
import GoodbyePage from './pages/GoodbyePage';
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

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [view, setView] = useState<'landing' | 'login' | 'openAccount' | 'securityCheck' | 'goodbye'>('landing');

    const login = useCallback(() => {
        setView('securityCheck');
    }, []);

    const logout = useCallback(() => {
        setView('goodbye');
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
                    {renderContent()}
                </CurrencyProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
};

export default App;
