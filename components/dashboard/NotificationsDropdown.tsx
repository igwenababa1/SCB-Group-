
import React, { useState, useMemo } from 'react';
import type { Alert, ViewType } from '../../types';

interface NotificationsDropdownProps {
    onClose: () => void;
    alerts: Alert[];
    setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
    setActiveView: (view: ViewType) => void;
}

type Tab = 'all' | 'security' | 'activity';

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ onClose, alerts, setAlerts, setActiveView }) => {
    const [activeTab, setActiveTab] = useState<Tab>('all');

    // Filter Logic
    const filteredAlerts = useMemo(() => {
        return alerts.filter(alert => {
            if (activeTab === 'all') return true;
            if (activeTab === 'security') return alert.severity === 'critical' || alert.severity === 'warning';
            if (activeTab === 'activity') return alert.severity === 'info';
            return true;
        }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [alerts, activeTab]);

    // Actions
    const markAsRead = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
    };

    const markAllAsRead = () => {
        setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
    };

    const dismissAlert = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    const handleAction = (view: ViewType, alertId: string) => {
        markAsRead(alertId);
        setActiveView(view);
        onClose();
    };

    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m";
        return "Now";
    };

    const getIconConfig = (severity: Alert['severity']) => {
        switch (severity) {
            case 'critical': return { icon: 'fa-shield-virus', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' };
            case 'warning': return { icon: 'fa-exclamation-triangle', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' };
            case 'info': return { icon: 'fa-info-circle', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' };
            default: return { icon: 'fa-bell', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30' };
        }
    };

    return (
        <div className="absolute top-full right-0 mt-4 w-96 bg-[#0f172a]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 z-50 overflow-hidden animate-fade-in-scale-up origin-top-right" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-[#1e293b] to-[#0f172a]">
                <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        Notification Center
                        {alerts.filter(a => !a.isRead).length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{alerts.filter(a => !a.isRead).length}</span>
                        )}
                    </h3>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={markAllAsRead} className="text-[10px] font-bold uppercase tracking-wider text-blue-400 hover:text-white transition-colors" title="Mark all as read">
                        Mark Read
                    </button>
                    <button onClick={() => setActiveView('settings')} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fas fa-cog"></i>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-black/20 border-b border-white/5">
                {(['all', 'security', 'activity'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                            activeTab === tab 
                                ? 'bg-white/10 text-white shadow-sm' 
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                {filteredAlerts.length > 0 ? (
                    filteredAlerts.map(alert => {
                        const style = getIconConfig(alert.severity);
                        return (
                            <div 
                                key={alert.id} 
                                onClick={() => markAsRead(alert.id)}
                                className={`relative p-4 border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer ${!alert.isRead ? 'bg-white/[0.02]' : ''}`}
                            >
                                {!alert.isRead && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                                )}
                                
                                <div className="flex gap-4">
                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${style.bg} ${style.border} ${style.color}`}>
                                        <i className={`fas ${style.icon}`}></i>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-sm font-bold truncate pr-2 ${!alert.isRead ? 'text-white' : 'text-gray-400'}`}>
                                                {alert.title}
                                            </h4>
                                            <span className="text-[10px] text-gray-500 whitespace-nowrap">{timeAgo(alert.timestamp)}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 leading-snug mb-3 line-clamp-2">
                                            {alert.description}
                                        </p>

                                        {/* Actions */}
                                        {alert.action && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleAction(alert.action!.view, alert.id); }}
                                                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-colors flex items-center gap-2 w-max ${
                                                    alert.severity === 'critical' 
                                                        ? 'bg-red-500 hover:bg-red-600 border-red-500 text-white' 
                                                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                                                }`}
                                            >
                                                {alert.action.label} <i className="fas fa-arrow-right"></i>
                                            </button>
                                        )}
                                    </div>

                                    {/* Dismiss (Hover) */}
                                    <button 
                                        onClick={(e) => dismissAlert(alert.id, e)}
                                        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-gray-600 hover:bg-white/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                        title="Dismiss"
                                    >
                                        <i className="fas fa-times text-xs"></i>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-600">
                            <i className="fas fa-bell-slash text-2xl"></i>
                        </div>
                        <p className="text-gray-300 font-bold text-sm">All Caught Up</p>
                        <p className="text-gray-500 text-xs mt-1">No new notifications at the moment.</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-black/20 border-t border-white/10 text-center">
                <button onClick={() => { setActiveView('alerts'); onClose(); }} className="text-xs text-blue-400 hover:text-white font-bold transition-colors uppercase tracking-wider">
                    View Full History
                </button>
            </div>
        </div>
    );
};

export default NotificationsDropdown;
