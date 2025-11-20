import React from 'react';
import { ALERTS } from '../../constants';
import type { Alert } from '../../types';

interface NotificationsDropdownProps {
    onClose: () => void;
}

const AlertItem: React.FC<{ alert: Alert }> = ({ alert }) => {
    const severityStyles = {
        info: 'text-blue-500 dark:text-blue-400',
        warning: 'text-yellow-500 dark:text-yellow-400',
        critical: 'text-red-500 dark:text-red-400',
    };
    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return "Just now";
    };

    return (
        <a href="#" className="block p-3 hover:bg-gray-100 dark:hover:bg-slate-600 border-b dark:border-slate-600 last:border-0">
            <div className="flex justify-between items-start">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">{alert.title}</p>
                {!alert.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5 ml-2"></div>}
            </div>
            <p className="text-xs text-gray-600 dark:text-slate-300 truncate">{alert.description}</p>
            <div className="flex justify-between text-xs text-gray-400 dark:text-slate-400 mt-1">
                 <span className={`${severityStyles[alert.severity]} font-bold capitalize`}>{alert.severity}</span>
                 <span>{timeAgo(alert.timestamp)}</span>
            </div>
        </a>
    );
};


const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ onClose }) => {
    const recentAlerts = ALERTS.slice(0, 4);
    
    return (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-700 rounded-lg shadow-lg border dark:border-slate-600 z-40">
            <div className="p-3 border-b dark:border-slate-600">
                <h3 className="font-bold text-gray-800 dark:text-white">Notifications</h3>
            </div>
            <div>
                {recentAlerts.map(alert => <AlertItem key={alert.id} alert={alert} />)}
            </div>
            <div className="p-2 text-center bg-gray-50 dark:bg-slate-700/50 rounded-b-lg">
                <a href="#" className="text-sm font-semibold text-blue-600 dark:text-yellow-400 hover:underline">View All Alerts</a>
            </div>
        </div>
    );
};

export default NotificationsDropdown;