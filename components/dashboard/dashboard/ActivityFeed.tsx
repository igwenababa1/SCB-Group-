


import React from 'react';
// FIX: Corrected import path
import { ACTIVITY_FEED_ITEMS } from '../../../constants';

const ActivityFeed: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
            <h3 className="font-bold text-xl text-[#1a365d] dark:text-white mb-4">Activity Feed</h3>
            <div className="space-y-4">
                {ACTIVITY_FEED_ITEMS.map(item => (
                    <div key={item.id} className="flex items-start gap-3">
                        <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${item.iconBg} dark:bg-slate-700 dark:text-slate-300`}>
                            <i className={`fas ${item.icon}`}></i>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-slate-100 text-sm">{item.title}</p>
                            <p className="text-xs text-gray-600 dark:text-slate-300">{item.description}</p>
                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{item.timestamp}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;