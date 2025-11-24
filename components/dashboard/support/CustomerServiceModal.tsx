
import React, { useState, useEffect } from 'react';

interface CustomerServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTopic?: string;
}

type SupportChannel = 'chat' | 'voice' | 'message' | 'callback';

const CustomerServiceModal: React.FC<CustomerServiceModalProps> = ({ isOpen, onClose, initialTopic = '' }) => {
    const [activeChannel, setActiveChannel] = useState<SupportChannel | null>(null);
    const [topic, setTopic] = useState(initialTopic);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ticketId, setTicketId] = useState('');
    const [step, setStep] = useState<'selection' | 'form' | 'success'>('selection');

    useEffect(() => {
        if (isOpen) {
            setTopic(initialTopic);
            setStep('selection');
            setActiveChannel(null);
            setMessage('');
        }
    }, [isOpen, initialTopic]);

    if (!isOpen) return null;

    const handleChannelSelect = (channel: SupportChannel) => {
        setActiveChannel(channel);
        if (channel === 'message' || channel === 'callback') {
            setStep('form');
        } else if (channel === 'voice') {
            // For voice, we just show the number
            setStep('form'); 
        } else {
            // For chat, simulated direct connection
            alert("Connecting to Live Concierge...");
            // In a real app, this would open the chat window
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            setTicketId(`CASE-${Math.floor(Math.random() * 1000000)}-${new Date().getFullYear()}`);
            setIsSubmitting(false);
            setStep('success');
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[120] bg-[#0f172a]/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
            <div className="w-full max-w-2xl bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1a365d] to-[#0f172a] p-6 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                            <i className="fas fa-headset text-2xl text-[#e6b325]"></i>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Client Support & Concierge</h2>
                            <p className="text-xs text-blue-300 uppercase tracking-wider font-bold flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Priority Access Active
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-8">
                    {step === 'selection' && (
                        <div className="animate-fade-in-up">
                            <h3 className="text-lg font-bold text-white mb-2">How would you like to connect?</h3>
                            <p className="text-gray-400 text-sm mb-8">Choose your preferred channel. Wait times are currently lower than 2 minutes.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button onClick={() => handleChannelSelect('chat')} className="group p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#e6b325]/50 rounded-xl text-left transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <i className="fas fa-comments text-2xl text-blue-400 group-hover:text-white transition-colors"></i>
                                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold uppercase">Online</span>
                                    </div>
                                    <h4 className="font-bold text-white">Live Concierge</h4>
                                    <p className="text-xs text-gray-400 mt-1">Instant chat with a banking specialist.</p>
                                </button>

                                <button onClick={() => handleChannelSelect('voice')} className="group p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#e6b325]/50 rounded-xl text-left transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <i className="fas fa-phone-alt text-2xl text-purple-400 group-hover:text-white transition-colors"></i>
                                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-bold uppercase">Wait: 1 min</span>
                                    </div>
                                    <h4 className="font-bold text-white">Priority Voice</h4>
                                    <p className="text-xs text-gray-400 mt-1">Direct line to your relationship manager.</p>
                                </button>

                                <button onClick={() => handleChannelSelect('message')} className="group p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#e6b325]/50 rounded-xl text-left transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <i className="fas fa-envelope-open-text text-2xl text-yellow-400 group-hover:text-white transition-colors"></i>
                                        <span className="text-[10px] bg-gray-500/20 text-gray-400 px-2 py-1 rounded font-bold uppercase">24/7 Support</span>
                                    </div>
                                    <h4 className="font-bold text-white">Secure Message</h4>
                                    <p className="text-xs text-gray-400 mt-1">Submit detailed inquiries or documents.</p>
                                </button>

                                <button onClick={() => handleChannelSelect('callback')} className="group p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#e6b325]/50 rounded-xl text-left transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <i className="fas fa-calendar-alt text-2xl text-green-400 group-hover:text-white transition-colors"></i>
                                        <span className="text-[10px] bg-gray-500/20 text-gray-400 px-2 py-1 rounded font-bold uppercase">Schedule</span>
                                    </div>
                                    <h4 className="font-bold text-white">Request Callback</h4>
                                    <p className="text-xs text-gray-400 mt-1">We'll call you at a time that works for you.</p>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'form' && activeChannel === 'voice' && (
                        <div className="animate-fade-in-scale-up text-center py-8">
                            <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                                <i className="fas fa-phone-volume text-4xl text-purple-400 animate-pulse"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Priority Line</h3>
                            <p className="text-gray-400 text-sm mb-8">Please have your access PIN ready.</p>
                            
                            <div className="bg-black/30 rounded-xl p-6 border border-white/5 inline-block min-w-[300px]">
                                <p className="text-3xl font-mono font-bold text-white mb-2">+1 (212) 555-0199</p>
                                <p className="text-xs text-gray-500 uppercase tracking-widest">VIP Access Code: 8829</p>
                            </div>
                            
                            <div className="mt-8">
                                <button onClick={() => setStep('selection')} className="text-gray-400 hover:text-white text-sm">Go Back</button>
                            </div>
                        </div>
                    )}

                    {step === 'form' && activeChannel === 'message' && (
                        <form onSubmit={handleSubmit} className="animate-fade-in-up space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Topic</label>
                                <input 
                                    type="text" 
                                    value={topic} 
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#e6b325] focus:ring-1 focus:ring-[#e6b325] outline-none transition-colors"
                                    placeholder="e.g. Transaction Dispute"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message</label>
                                <textarea 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#e6b325] focus:ring-1 focus:ring-[#e6b325] outline-none transition-colors min-h-[150px]"
                                    placeholder="Please describe your issue in detail..."
                                    required
                                />
                            </div>
                            
                            <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-lg flex gap-3">
                                <i className="fas fa-info-circle text-blue-400 mt-0.5"></i>
                                <p className="text-xs text-blue-200">
                                    Your message will be encrypted and sent directly to our high-priority resolution team. Expected response time: &lt; 2 hours.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button type="button" onClick={() => setStep('selection')} className="flex-1 py-3 rounded-lg text-gray-400 hover:text-white font-bold transition-colors">Back</button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 rounded-lg bg-[#e6b325] hover:bg-[#d4a017] text-[#1a365d] font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                                    {isSubmitting ? 'Sending...' : 'Send Secure Message'}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 'success' && (
                        <div className="animate-fade-in-scale-up text-center py-8">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                                <i className="fas fa-check-circle text-4xl text-green-400"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Case Submitted</h3>
                            <p className="text-gray-400 text-sm mb-8">Your inquiry has been routed to our specialized team.</p>
                            
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-xs mx-auto mb-8">
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Case Reference ID</p>
                                <p className="text-xl font-mono font-bold text-[#e6b325]">{ticketId}</p>
                            </div>
                            
                            <button onClick={onClose} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors">
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerServiceModal;
