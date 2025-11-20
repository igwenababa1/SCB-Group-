
import React, { useState, useEffect } from 'react';

const ExecutiveStatusPanel: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-end gap-4">
            {/* Top Row: Identity & Status */}
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg">
                
                {/* Verified Badge */}
                <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 blur-md opacity-40 animate-pulse"></div>
                        <i className="fas fa-certificate text-blue-500 text-lg relative z-10"></i>
                        <i className="fas fa-check text-[8px] text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"></i>
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest leading-none">Verified</p>
                        <p className="text-[9px] text-gray-400 font-mono leading-none mt-0.5">ID-8829-X</p>
                    </div>
                </div>

                {/* Active Session */}
                <div className="flex items-center gap-2">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                        Session Active
                    </span>
                </div>
            </div>

            {/* Bottom Row: Time & Score */}
            <div className="flex gap-3">
                {/* Clock Widget */}
                <div className="bg-[#0f172a]/80 border border-white/10 px-4 py-2 rounded-xl text-right shadow-xl min-w-[140px]">
                    <p className="text-xl font-mono font-bold text-white leading-none tracking-tight">
                        {time.toLocaleTimeString('en-US', { hour12: false })}
                    </p>
                    <p className="text-[10px] text-[#e6b325] font-bold uppercase tracking-widest mt-1">
                        {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
                    </p>
                </div>

                {/* Score Widget */}
                <div className="bg-gradient-to-br from-[#1a365d] to-[#0f172a] border border-blue-500/30 px-4 py-2 rounded-xl flex items-center gap-3 shadow-xl">
                    <div className="relative w-10 h-10">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="transparent" />
                            <circle cx="20" cy="20" r="16" stroke="#3b82f6" strokeWidth="3" fill="transparent" strokeDasharray="100" strokeDashoffset="2" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">98</span>
                    </div>
                    <div className="text-left">
                        <p className="text-[9px] text-blue-300 uppercase font-bold tracking-widest">Security Tier</p>
                        <p className="text-xs font-bold text-white">Titanium</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExecutiveStatusPanel;
