import React, { useState, useEffect, useRef } from 'react';

interface Message {
    text: string;
    sender: 'user' | 'agent';
}

interface LiveChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LiveChatModal: React.FC<LiveChatModalProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hello! Thank you for contacting SCB Support. My name is Anna. How can I assist you today?", sender: 'agent' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);
    
    if (!isOpen) return null;

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        
        const userMessage: Message = { text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const agentResponse: Message = { text: "Thank you for your question. Let me look into that for you. One moment please...", sender: 'agent' };
            setMessages(prev => [...prev, agentResponse]);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-gray-800 border border-white/10 rounded-lg shadow-xl w-full max-w-md h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-lg">Live Chat Support</h2>
                        <p className="text-xs text-green-400">● Online</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><i className="fas fa-times text-xl"></i></button>
                </div>
                
                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {msg.sender === 'agent' && <i className="fas fa-headset text-2xl text-yellow-400 flex-shrink-0"></i>}
                            <p className={`max-w-xs px-4 py-2 rounded-xl ${msg.sender === 'agent' ? 'bg-gray-700' : 'bg-blue-600'}`}>
                                {msg.text}
                            </p>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-3">
                           <i className="fas fa-headset text-2xl text-yellow-400 flex-shrink-0"></i>
                            <div className="bg-gray-700 px-4 py-2 rounded-xl flex items-center gap-2">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 border-t border-white/10">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-grow bg-gray-900 border-gray-600 rounded-full py-2 px-4 text-white focus:ring-yellow-400 focus:border-yellow-400"
                        />
                        <button type="submit" className="w-10 h-10 rounded-full bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-300"><i className="fas fa-paper-plane"></i></button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LiveChatModal;