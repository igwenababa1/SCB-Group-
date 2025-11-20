
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { AppContext } from '../App';

interface AutoLogoutHandlerProps {
    children: React.ReactNode;
}

const EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
const TIMEOUT_MS = 3 * 60 * 1000; // 3 Minutes Total
const WARNING_MS = 2.5 * 60 * 1000; // Warning at 2m 30s
// const TIMEOUT_MS = 10000; // Debug: 10s
// const WARNING_MS = 5000;  // Debug: 5s

const AutoLogoutHandler: React.FC<AutoLogoutHandlerProps> = ({ children }) => {
    const { logout } = useContext(AppContext);
    const [isWarningOpen, setIsWarningOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastActivityRef = useRef<number>(Date.now());

    const logoutUser = useCallback(() => {
        setIsWarningOpen(false);
        logout();
    }, [logout]);

    const showWarning = useCallback(() => {
        setIsWarningOpen(true);
        const remaining = Math.ceil((TIMEOUT_MS - WARNING_MS) / 1000);
        setTimeLeft(remaining);
    }, []);

    const resetTimer = useCallback(() => {
        if (isWarningOpen) return; // Don't reset if warning is already showing (must click button)

        lastActivityRef.current = Date.now();

        if (timerRef.current) clearTimeout(timerRef.current);
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);

        // Set warning timer
        warningTimerRef.current = setTimeout(showWarning, WARNING_MS);
        
        // Set hard logout timer (failsafe)
        timerRef.current = setTimeout(logoutUser, TIMEOUT_MS);
    }, [isWarningOpen, logoutUser, showWarning]);

    // Event Listeners
    useEffect(() => {
        EVENTS.forEach(event => {
            window.addEventListener(event, resetTimer);
        });
        
        // Initial start
        resetTimer();

        return () => {
            EVENTS.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
            if (timerRef.current) clearTimeout(timerRef.current);
            if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        };
    }, [resetTimer]);

    // Countdown effect when warning is open
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isWarningOpen) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        logoutUser();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isWarningOpen, logoutUser]);

    const handleKeepActive = () => {
        setIsWarningOpen(false);
        resetTimer();
    };

    return (
        <>
            {children}

            {/* Inactivity Warning Modal */}
            {isWarningOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl animate-fade-in"></div>
                    
                    <div className="relative bg-[#0f172a] border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-scale-up">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse"></div>
                        
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)] relative">
                                <i className="fas fa-user-lock text-3xl text-red-500"></i>
                                <div className="absolute inset-0 border-2 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2">Security Timeout Imminent</h2>
                            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                                Your secure session has been inactive. If you are authorized, please confirm your presence to remain connected.
                            </p>

                            <div className="bg-black/30 rounded-lg p-4 mb-6 border border-white/5">
                                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Auto-Logout In</p>
                                <p className="text-4xl font-mono font-bold text-white">{timeLeft}s</p>
                            </div>

                            <div className="space-y-3">
                                <button 
                                    onClick={handleKeepActive}
                                    className="w-full py-4 rounded-xl bg-white text-[#0f172a] font-bold uppercase tracking-wider text-sm hover:bg-gray-200 transition-all shadow-lg shadow-white/10"
                                >
                                    Confirm Authorization
                                </button>
                                <button 
                                    onClick={logoutUser}
                                    className="w-full py-3 rounded-xl bg-transparent border border-white/10 text-gray-400 font-bold uppercase tracking-wider text-xs hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Log Out Immediately
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AutoLogoutHandler;
