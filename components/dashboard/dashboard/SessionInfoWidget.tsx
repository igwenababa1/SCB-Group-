
import React, { useState, useEffect } from 'react';
import { USER_SETTINGS } from '../../../constants';

const SessionInfoWidget: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const activeSessions = USER_SETTINGS.security.managedDevices;

    return (
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-lg text-white h-full flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-3xl">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-gray-300">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <i className="fas fa-clock text-3xl text-yellow-400/50"></i>
                </div>
                <p className="text-xs text-gray-400 mt-1"><i className="fas fa-map-marker-alt mr-1"></i> New York, NY (Approximate)</p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
                <h4 className="font-semibold mb-2">Active Sessions ({activeSessions.length})</h4>
                <div className="space-y-2 text-sm">
                    {activeSessions.slice(0, 2).map(device => (
                        <div key={device.id} className="flex items-center gap-3 opacity-90">
                             <i className={`fas ${device.icon} text-gray-300 w-4 text-center`}></i>
                            <span className="flex-grow truncate">{device.device}</span>
                            <span className="text-green-400 font-semibold">Active</span>
                        </div>
                    ))}
                </div>
                <button className="text-xs font-semibold text-yellow-400 hover:underline mt-3">
                    Manage Sessions
                </button>
            </div>
        </div>
    );
};

export default SessionInfoWidget;
