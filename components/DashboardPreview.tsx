import React from 'react';

const DashboardPreview: React.FC = () => {
    return (
        <div className="relative transform-gpu perspective-1000 rotate-y-15 -rotate-x-3 hover:rotate-y-10 hover:-rotate-x-1 transition-transform duration-500 ease-in-out group">
            <div className="aspect-[16/10] w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-700/50 to-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-white/20">
                {/* Header */}
                 <div className="flex items-center justify-between gap-1.5 mb-3">
                     <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-red-500/80 rounded-full"></span>
                        <span className="w-3 h-3 bg-yellow-400/80 rounded-full"></span>
                        <span className="w-3 h-3 bg-green-500/80 rounded-full"></span>
                     </div>
                     <div className="w-1/3 h-3 bg-gray-600/50 rounded-full"></div>
                </div>

                {/* Main Content */}
                <div className="bg-black/20 rounded-lg h-[calc(100%-1.75rem)] flex gap-3 p-3">
                    {/* Sidebar */}
                    <div className="w-1/5 bg-white/5 rounded-md p-2 space-y-4">
                        <div className="w-16 h-4 bg-white/20 rounded-full"></div>
                        <div className="space-y-2 pl-2">
                            <div className="w-full h-2.5 bg-yellow-400/60 rounded-full"></div>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-2/3 h-2.5 bg-white/20 rounded-full opacity-75 group-hover:translate-x-1 transition-transform" style={{ transitionDelay: `${i * 50}ms` }}></div>
                            ))}
                        </div>
                         <div className="space-y-2 pl-2 pt-2 border-t border-white/10">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="w-2/3 h-2.5 bg-white/20 rounded-full opacity-75 group-hover:translate-x-1 transition-transform" style={{ transitionDelay: `${(i+4) * 50}ms` }}></div>
                            ))}
                        </div>
                    </div>

                    {/* Dashboard Area */}
                    <div className="w-4/5 space-y-3">
                        {/* Account Cards */}
                        <div className="grid grid-cols-4 gap-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white/5 rounded-md p-2 space-y-1.5 border border-white/10 group-hover:border-white/20 transition-colors" style={{ transitionDelay: `${i * 100}ms` }}>
                                    <div className="w-1/2 h-2 bg-white/20 rounded-full"></div>
                                    <div className="w-3/4 h-3.5 bg-white/40 rounded-full"></div>
                                </div>
                            ))}
                        </div>

                        {/* Chart + List */}
                        <div className="grid grid-cols-2 gap-3 h-[calc(100%-4rem)]">
                            {/* Bar Chart */}
                            <div className="bg-white/5 rounded-md p-2 flex flex-col justify-between border border-white/10">
                                <div className="w-1/2 h-2 bg-white/20 rounded-full mb-2"></div>
                                <div className="flex items-end justify-around h-full gap-2">
                                    <div className="w-full bg-yellow-400/50 rounded-t-sm transition-all duration-500 group-hover:bg-yellow-400/80" style={{ height: '40%' }}></div>
                                    <div className="w-full bg-yellow-400/50 rounded-t-sm transition-all duration-500 group-hover:bg-yellow-400/80" style={{ height: '60%', transitionDelay: '100ms' }}></div>
                                    <div className="w-full bg-blue-400/50 rounded-t-sm transition-all duration-500 group-hover:bg-blue-400/80" style={{ height: '50%', transitionDelay: '50ms' }}></div>
                                    <div className="w-full bg-blue-400/50 rounded-t-sm transition-all duration-500 group-hover:bg-blue-400/80" style={{ height: '75%', transitionDelay: '150ms' }}></div>
                                </div>
                            </div>
                             {/* Transaction List */}
                            <div className="bg-white/5 rounded-md p-2 space-y-2 border border-white/10">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-2 group-hover:bg-white/5 p-1 rounded transition-colors" style={{ transitionDelay: `${i * 100}ms` }}>
                                        <div className={`w-6 h-6 rounded-full ${i % 2 === 0 ? 'bg-red-500/40' : 'bg-green-500/40'}`}></div>
                                        <div className="w-2/3 h-2 bg-white/20 rounded-full"></div>
                                        <div className="w-1/4 h-2 bg-white/30 rounded-full ml-auto"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPreview;