
import React, { useState, useMemo, useEffect } from 'react';
import { ALERTS } from '../../constants';
import type { Alert, ViewType } from '../../types';

interface AlertsViewProps {
    setActiveView: (view: ViewType) => void;
}

// --- Components ---

const SecurityHealthWidget: React.FC = () => {
    return (
        <div className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <i className="fas fa-shield-halved text-green-400"></i> Security Status
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Real-time protection protocols</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                    Active
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-700" />
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-green-500" strokeDasharray="251.2" strokeDashoffset="10" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <span className="text-2xl font-bold">98</span>
                        <span className="text-[8px] uppercase tracking-wider text-gray-400">Score</span>
                    </div>
                </div>
                <div className="space-y-2 w-full">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-300"><i className="fas fa-fingerprint mr-2 text-blue-400"></i>Biometrics</span>
                        <span className="text-green-400"><i className="fas fa-check"></i></span>
                    </div>
                    <div className="w-full bg-gray-700 h-1 rounded-full"><div className="w-full bg-blue-500 h-1 rounded-full"></div></div>
                    
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-300"><i className="fas fa-mobile-alt mr-2 text-blue-400"></i>2FA Enabled</span>
                        <span className="text-green-400"><i className="fas fa-check"></i></span>
                    </div>
                     <div className="w-full bg-gray-700 h-1 rounded-full"><div className="w-full bg-blue-500 h-1 rounded-full"></div></div>

                    <div className="flex justify-between text-xs">
                        <span className="text-gray-300"><i className="fas fa-globe mr-2 text-blue-400"></i>Global IP Lock</span>
                        <span className="text-green-400"><i className="fas fa-check"></i></span>
                    </div>
                     <div className="w-full bg-gray-700 h-1 rounded-full"><div className="w-full bg-blue-500 h-1 rounded-full"></div></div>
                </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10">
                <button className="w-full py-2 text-xs font-bold text-center text-blue-300 hover:text-white transition-colors">
                    Run Security Diagnostics
                </button>
            </div>
        </div>
    );
};

const SystemScanner: React.FC = () => {
    const [log, setLog] = useState<string[]>([]);
    
    useEffect(() => {
        const logs = [
            "Scanning localized IP protocols...",
            "Verifying SSL/TLS handshake certificate...",
            "Monitoring transaction velocity...",
            "Checking dark web credential leaks...",
            "Validating device integrity token...",
            "Ping check: Stockholm Server (12ms)...",
            "Ping check: New York Server (45ms)...",
            "Encryption keys rotated successfully."
        ];
        
        let index = 0;
        const interval = setInterval(() => {
            setLog(prev => [logs[index], ...prev].slice(0, 5));
            index = (index + 1) % logs.length;
        }, 2500);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Live Threat Monitor</h3>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse delay-75"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-150"></div>
                </div>
            </div>
            
            <div className="relative flex-grow bg-[#0b1120] rounded-lg p-3 font-mono text-[10px] text-green-500/80 overflow-hidden border border-white/5 shadow-inner">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
                <div className="space-y-1">
                    {log.map((line, i) => (
                        <div key={i} className={`flex gap-2 ${i === 0 ? 'text-green-400 font-bold' : 'opacity-60'}`}>
                            <span className="text-gray-600">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                            <span>{i === 0 ? '> ' : '  '}{line}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AlertCard: React.FC<{ alert: Alert, onAction: (view: ViewType) => void }> = ({ alert, onAction }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const severityConfig = {
        info: {
            icon: 'fa-info-circle',
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/30',
            shadow: 'hover:shadow-blue-500/10'
        },
        warning: {
            icon: 'fa-shield-alt',
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/30',
            shadow: 'hover:shadow-yellow-500/10'
        },
        critical: {
            icon: 'fa-triangle-exclamation',
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            border: 'border-red-500/50',
            shadow: 'hover:shadow-red-500/20'
        },
    };
    
    const style = severityConfig[alert.severity];
    const isCritical = alert.severity === 'critical';

    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <div 
            className={`relative overflow-hidden transition-all duration-300 rounded-xl border ${style.border} ${style.bg} ${style.shadow} ${isCritical ? 'shadow-lg' : 'shadow-sm'} group`}
        >
            {isCritical && <div className="absolute top-0 left-0 w-1 h-full bg-red-500 animate-pulse"></div>}
            
            <div className="p-5 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCritical ? 'bg-red-500 text-white' : 'bg-black/30 ' + style.color}`}>
                    <i className={`fas ${style.icon} text-lg ${isCritical ? 'animate-pulse' : ''}`}></i>
                </div>
                
                <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-bold text-sm ${isCritical ? 'text-white' : 'text-gray-200'}`}>{alert.title}</h4>
                        <div className="flex items-center gap-2">
                             {!alert.isRead && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                             <span className="text-[10px] text-gray-500 font-mono">{timeAgo(alert.timestamp)}</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{alert.description}</p>
                    
                    {(alert.action || isExpanded) && (
                        <div className="mt-4 flex gap-3">
                            {alert.action && (
                                <button 
                                    onClick={() => onAction(alert.action!.view)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                        isCritical 
                                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30' 
                                            : 'bg-[#e6b325] hover:bg-[#d4a017] text-black'
                                    }`}
                                >
                                    {alert.action.label}
                                </button>
                            )}
                             <button 
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="px-3 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-xs font-bold uppercase tracking-wider"
                            >
                                {isExpanded ? 'Dismiss' : 'Details'}
                            </button>
                        </div>
                    )}
                    
                    {isExpanded && (
                         <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-500 bg-black/20 -mx-5 -mb-5 p-4">
                            <p><span className="font-bold text-gray-400">Alert ID:</span> #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                            <p className="mt-1"><span className="font-bold text-gray-400">Source:</span> Automated Fraud Detection System v4.2</p>
                            <div className="mt-3 flex gap-4">
                                <button className="text-blue-400 hover:text-white"><i className="fas fa-print mr-1"></i> Log</button>
                                <button className="text-blue-400 hover:text-white"><i className="fas fa-headset mr-1"></i> Support</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AlertsView: React.FC<AlertsViewProps> = ({ setActiveView }) => {
    const [alerts, setAlerts] = useState<Alert[]>(ALERTS);
    const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

    // Simulate a new alert arriving
    useEffect(() => {
        const timer = setTimeout(() => {
            // Only add if not already there to prevent spam in this demo
            if (alerts.length < 6) {
                 const newAlert: Alert = { 
                    id: `new-${Date.now()}`, 
                    title: 'Login Attempt Blocked', 
                    description: 'We blocked a login attempt from an unrecognized device in Singapore.', 
                    timestamp: new Date().toISOString(), 
                    severity: 'critical', 
                    isRead: false, 
                    action: { label: 'Secure Account', view: 'settings' } 
                };
                setAlerts(prev => [newAlert, ...prev]);
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [alerts.length]);

    const filteredAlerts = useMemo(() => {
        return alerts
            .filter(a => {
                if (filter === 'unread' && a.isRead) return false;
                if (filter === 'critical' && a.severity !== 'critical') return false;
                return true;
            })
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [alerts, filter]);

    return (
        <div className="relative min-h-full bg-[#0b1120] text-white overflow-hidden">
             {/* Professional Background */}
            <div 
                className="absolute inset-0 z-0 opacity-30"
                style={{ 
                    backgroundImage: "url('https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b1120]/80 via-[#0b1120]/95 to-[#0b1120]"></div>

            <div className="relative z-10 p-8 max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
                            Security Center
                        </h1>
                        <p className="text-gray-400 text-lg">Centralized command for account alerts and threat monitoring.</p>
                    </div>
                    
                    <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md mt-4 md:mt-0">
                        {(['all', 'unread', 'critical'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                                    filter === f 
                                        ? 'bg-[#e6b325] text-black shadow-lg scale-105' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Banner for Critical Issues */}
                        {alerts.some(a => a.severity === 'critical' && !a.isRead) && (
                            <div className="bg-red-500/10 border border-red-500/40 p-4 rounded-xl flex items-center gap-4 animate-pulse">
                                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white text-xl">
                                    <i className="fas fa-triangle-exclamation"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-red-400">Action Required</h3>
                                    <p className="text-xs text-red-200/80">You have critical security alerts pending review.</p>
                                </div>
                            </div>
                        )}
                    
                        <div className="space-y-4">
                            {filteredAlerts.length > 0 ? (
                                filteredAlerts.map(alert => (
                                    <div key={alert.id} className="animate-fade-in-status-item">
                                        <AlertCard alert={alert} onAction={setActiveView} />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-24 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                                     <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500 border border-green-500/20">
                                        <i className="fas fa-shield-check text-4xl"></i>
                                     </div>
                                     <h3 className="text-xl font-bold text-white">All Clear</h3>
                                     <p className="text-gray-500 mt-1">System is secure. No new notifications.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Widgets */}
                    <div className="space-y-8">
                        <SecurityHealthWidget />
                        <SystemScanner />
                        
                        {/* Quick Actions Widget */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Emergency Controls</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 flex flex-col items-center gap-2 transition-colors">
                                    <i className="fas fa-snowflake text-xl"></i>
                                    <span className="text-xs font-bold">Freeze All</span>
                                </button>
                                <button className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-400 flex flex-col items-center gap-2 transition-colors">
                                    <i className="fas fa-key text-xl"></i>
                                    <span className="text-xs font-bold">Reset PINs</span>
                                </button>
                            </div>
                             <button className="w-full mt-3 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
                                <i className="fas fa-headset"></i> Contact Fraud Dept
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertsView;
