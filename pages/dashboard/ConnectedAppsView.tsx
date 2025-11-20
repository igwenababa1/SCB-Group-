
import React, { useState, useEffect } from 'react';
import { CONNECTED_APPS } from '../../constants';
import type { ConnectedApp, ViewType } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import ConnectAppModal from '../../components/dashboard/connected-apps/ConnectAppModal';
import SendMoneyModal from '../../components/dashboard/connected-apps/SendMoneyModal';

const SecurityMetric: React.FC<{ label: string; value: string; icon: string; color: string }> = ({ label, value, icon, color }) => (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-xl flex items-center gap-4 relative overflow-hidden group hover:bg-white/10 transition-all">
        <div className={`absolute top-0 right-0 w-16 h-16 bg-${color}-500/10 rounded-full blur-2xl -mr-4 -mt-4`}></div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-[#1a365d] to-[#0f172a] flex items-center justify-center ${color} shadow-lg border border-white/5`}>
            <i className={`fas ${icon} text-xl`}></i>
        </div>
        <div>
            <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">{label}</p>
            <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
        </div>
    </div>
);

const IntegrationCard: React.FC<{ app: ConnectedApp; onConnect: () => void; onManage: () => void; onSend: () => void; }> = ({ app, onConnect, onManage, onSend }) => {
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        if (app.isConnected) {
            // Randomly simulate syncing state
            const randomSync = Math.random() > 0.8;
            if (randomSync) {
                setIsSyncing(true);
                setTimeout(() => setIsSyncing(false), 3000);
            }
        }
    }, [app.isConnected]);

    return (
        <div className={`relative group overflow-hidden rounded-2xl border transition-all duration-300 ${app.isConnected ? 'bg-[#1e293b]/80 border-green-500/30 hover:border-green-500/50' : 'bg-black/40 border-white/10 hover:border-white/30'}`}>
            {app.isConnected && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400"></div>
            )}
            
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-xl p-2 shadow-lg flex items-center justify-center relative">
                            <img src={app.logoUrl} alt={app.name} className="w-full h-full object-contain" />
                            {app.isConnected && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#1e293b] flex items-center justify-center">
                                    <i className="fas fa-check text-[10px] text-white"></i>
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">{app.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                {app.isConnected ? (
                                    <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${isSyncing ? 'text-blue-400' : 'text-green-400'}`}>
                                        {isSyncing ? <><i className="fas fa-sync fa-spin"></i> Syncing Data...</> : <><i className="fas fa-link"></i> Active Connection</>}
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Not Connected</span>
                                )}
                            </div>
                        </div>
                    </div>
                    {app.isConnected && (
                        <button onClick={onManage} className="text-gray-400 hover:text-white transition-colors">
                            <i className="fas fa-cog"></i>
                        </button>
                    )}
                </div>

                <p className="text-xs text-gray-400 mb-6 h-10 line-clamp-2">{app.description}</p>

                {app.isConnected ? (
                    <div className="space-y-3">
                        {/* Data Scope Visuals */}
                        <div className="flex gap-2 mb-4">
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] text-gray-300 uppercase font-bold" title="Read Identity">ID</span>
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] text-gray-300 uppercase font-bold" title="Read Transactions">TX</span>
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] text-gray-300 uppercase font-bold" title="Initiate Payments">PAY</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={onSend} className="py-2 rounded-lg bg-yellow-500 text-black text-xs font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20">
                                Send Money
                            </button>
                            <button onClick={onManage} className="py-2 rounded-lg bg-white/10 text-white text-xs font-bold hover:bg-white/20 border border-white/10 transition-colors">
                                View Data
                            </button>
                        </div>
                    </div>
                ) : (
                    <button onClick={onConnect} className="w-full py-3 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                        <i className="fas fa-plug"></i> Connect App
                    </button>
                )}
            </div>
        </div>
    );
};

const ApiAccessLog: React.FC = () => {
    const [logs, setLogs] = useState<{ id: string, app: string, action: string, time: string }[]>([]);

    useEffect(() => {
        const possibleActions = [
            { app: 'PayPal', action: 'Read Account Balance' },
            { app: 'Mint', action: 'Sync Transaction History' },
            { app: 'Venmo', action: 'Verify Identity Token' },
            { app: 'QuickBooks', action: 'Download Statement PDF' },
        ];

        const interval = setInterval(() => {
            const randomLog = possibleActions[Math.floor(Math.random() * possibleActions.length)];
            const newLog = {
                id: Math.random().toString(36).substr(2, 9),
                app: randomLog.app,
                action: randomLog.action,
                time: 'Just now'
            };
            setLogs(prev => [newLog, ...prev].slice(0, 6));
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <i className="fas fa-terminal text-green-400"></i> Data Access Ledger
                </h3>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <div className="space-y-3">
                {logs.map(log => (
                    <div key={log.id} className="flex items-center justify-between text-xs p-2 rounded hover:bg-white/5 transition-colors animate-fade-in-status-item">
                        <div className="flex items-center gap-3">
                            <span className="text-blue-400 font-mono font-bold">[{log.app}]</span>
                            <span className="text-gray-300">{log.action}</span>
                        </div>
                        <span className="text-gray-500 font-mono">{log.time}</span>
                    </div>
                ))}
                {logs.length === 0 && <p className="text-gray-500 text-xs text-center py-4">Waiting for API activity...</p>}
            </div>
        </div>
    );
};

const ConnectedAppsView: React.FC<{ setActiveView: (view: ViewType) => void }> = ({ setActiveView }) => {
    const [apps, setApps] = useState(CONNECTED_APPS);
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState<ConnectedApp | null>(null);

    const activeCount = apps.filter(a => a.isConnected).length;

    const handleOpenConnectModal = (app: ConnectedApp) => {
        setSelectedApp(app);
        setIsConnectModalOpen(true);
    };

    const handleOpenSendModal = (app: ConnectedApp) => {
        setSelectedApp(app);
        setIsSendModalOpen(true);
    };
    
    const handleConnectSuccess = (appId: string) => {
        setApps(prevApps => prevApps.map(app => app.id === appId ? { ...app, isConnected: true } : app));
        setIsConnectModalOpen(false);
    };

    const handleRevokeAccess = (app: ConnectedApp) => {
        if (confirm(`Are you sure you want to revoke access for ${app.name}? This will stop any recurring payments or data syncs.`)) {
            setApps(prevApps => prevApps.map(a => a.id === app.id ? { ...a, isConnected: false } : a));
        }
    }

    return (
        <div className="relative min-h-full bg-[#0b1120] text-white font-sans">
             {/* Background */}
            <div 
                className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{ 
                    backgroundImage: "url('https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=2068&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b1120]/90 via-[#0b1120]/95 to-[#0b1120]"></div>

            <div className="relative z-10 p-8 max-w-[1600px] mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                                API Command Center
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
                            Open Banking Hub
                        </h1>
                        <p className="text-gray-400 text-lg">Manage third-party integrations, API tokens, and data sovereignty.</p>
                    </div>
                    
                    <div className="flex gap-4 mt-6 md:mt-0">
                        <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Security Protocol</p>
                            <p className="text-sm font-bold text-green-400 flex items-center justify-end gap-2">
                                <i className="fas fa-shield-alt"></i> OAuth 2.0 / OIDC
                            </p>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <SecurityMetric 
                        label="Active Connections" 
                        value={activeCount.toString()} 
                        icon="fa-plug" 
                        color="text-blue-400"
                    />
                    <SecurityMetric 
                        label="API Calls (24h)" 
                        value="1,248" 
                        icon="fa-server" 
                        color="text-yellow-400"
                    />
                    <SecurityMetric 
                        label="Data Privacy Score" 
                        value="100%" 
                        icon="fa-user-shield" 
                        color="text-green-400"
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main App Grid */}
                    <div className="xl:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <i className="fas fa-cubes text-blue-500"></i> My Integrations
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {apps.map(app => (
                                    <IntegrationCard 
                                        key={app.id} 
                                        app={app} 
                                        onConnect={() => handleOpenConnectModal(app)}
                                        onManage={() => handleRevokeAccess(app)} // Simplifying for demo
                                        onSend={() => handleOpenSendModal(app)}
                                    />
                                ))}
                            </div>
                        </div>
                        
                        {/* Discovery Section */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white">Recommended Services</h3>
                                <button className="text-xs text-yellow-400 hover:text-white font-bold">View Marketplace</button>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {['QuickBooks', 'Robinhood', 'Coinbase', 'Stripe'].map((name, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-colors cursor-pointer min-w-[160px]">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-xs shadow">
                                            {name[0]}
                                        </div>
                                        <span className="text-sm text-gray-300 font-bold">{name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Ledger & Security */}
                    <div className="xl:col-span-1 space-y-8">
                        <ApiAccessLog />
                        
                        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-2">Developer API</h3>
                            <p className="text-xs text-gray-400 mb-4">Build your own financial tools with our secure robust API.</p>
                            <div className="bg-black/40 rounded p-3 font-mono text-[10px] text-green-400 mb-4 overflow-hidden">
                                GET /v1/accounts/me/balance<br/>
                                Authorization: Bearer sk_test_...
                            </div>
                            <button className="w-full py-2 rounded-lg border border-white/20 hover:bg-white/10 text-white text-xs font-bold transition-colors">
                                Generate API Keys
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isConnectModalOpen && selectedApp && (
                <ConnectAppModal
                    isOpen={isConnectModalOpen}
                    onClose={() => setIsConnectModalOpen(false)}
                    app={selectedApp}
                    onSuccess={handleConnectSuccess}
                />
            )}

            {isSendModalOpen && selectedApp && (
                <SendMoneyModal
                    isOpen={isSendModalOpen}
                    onClose={() => setIsSendModalOpen(false)}
                    app={selectedApp}
                    setActiveView={setActiveView}
                />
            )}
        </div>
    );
};

export default ConnectedAppsView;
