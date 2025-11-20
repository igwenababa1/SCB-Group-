import React, { useState, useRef, useEffect } from 'react';

const GREETING_RESPONSES = [
    "Hello! How can I help you navigate your financial future with SCB today?",
    "Welcome to Swedish Construction Bank! What can I assist you with?",
    "Hi there! Ask me anything about our services, accounts, or security features."
];

const SERVICES_RESPONSES = [
    "We offer a comprehensive suite of services, including Global Mobile Access, AI-powered Financial Insights, and Biometric Security. You can see a full list on our homepage!",
    "Our key services are designed for discerning clients. We focus on intelligent financial insights, tailored lending, and global investment opportunities. Is there a specific area you're interested in?"
];

const ACCOUNTS_RESPONSES = [
    "We provide premium Checking, Savings, and Investment accounts. Each is designed to meet different financial goals. To get started, simply click the 'Login' button and choose to open an account.",
    "Opening an account is simple and secure. We offer several types, including high-yield savings and global investment accounts. Which one interests you the most?"
];

const LOANS_RESPONSES = [
    "We offer personalized loan and mortgage solutions with competitive rates. Our team of experts can help tailor a solution to your specific needs.",
    "Whether you're looking for a personal loan, a business credit line, or a mortgage, we have tailored options. Would you like to be put in touch with a specialist?"
];

const SECURITY_RESPONSES = [
    "Your security is our top priority. We use cutting-edge technology, including biometric logins, real-time transaction monitoring, and an advanced Fraud Shield to protect your assets.",
    "We employ multi-layered security protocols to ensure your finances are always protected. This includes end-to-end encryption and proactive fraud detection systems."
];

const CONTACT_RESPONSES = [
    "You can reach our dedicated 24/7 concierge team via the 'Contact' section on our homepage. We're always here to help.",
    "For support, please navigate to the contact form on our website. For immediate assistance, our client hotline is available around the clock."
];

const FALLBACK_RESPONSES = [
    "I'm sorry, I'm not equipped to handle that specific query. I can provide information on our 'services', 'accounts', 'loans', 'security', or how to 'contact' us.",
    "That's a bit outside my area of expertise. Could I help with questions about our features, account types, or security measures instead?",
    "My apologies, I can only assist with general inquiries about our main offerings. For more detailed questions, I recommend using the 'Contact' section."
];


const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: 'Welcome to SCB! How can I assist you today? Feel free to ask about our services, accounts, or security.', sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const getRandomResponse = (responses: string[]) => {
        return responses[Math.floor(Math.random() * responses.length)];
    };

    const getBotResponse = (input: string): string => {
        const lowerInput = input.toLowerCase();
        
        if (/\b(hello|hi|hey)\b/.test(lowerInput)) return getRandomResponse(GREETING_RESPONSES);
        if (/\b(service|feature|offer)\b/.test(lowerInput)) return getRandomResponse(SERVICES_RESPONSES);
        if (/\b(account|open|checking|savings)\b/.test(lowerInput)) return getRandomResponse(ACCOUNTS_RESPONSES);
        if (/\b(loan|mortgage|borrow)\b/.test(lowerInput)) return getRandomResponse(LOANS_RESPONSES);
        if (/\b(security|safe|fraud)\b/.test(lowerInput)) return getRandomResponse(SECURITY_RESPONSES);
        if (/\b(contact|help|support|talk)\b/.test(lowerInput)) return getRandomResponse(CONTACT_RESPONSES);

        return getRandomResponse(FALLBACK_RESPONSES);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = { text: inputValue, sender: 'user' as 'user' | 'bot' };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            const botResponseText = getBotResponse(inputValue);
            const botMessage = { text: botResponseText, sender: 'bot' as 'user' | 'bot' };
            setIsTyping(false);
            setMessages(prevMessages => [...prevMessages, botMessage]);
        }, 1200);
    };


    return (
        <div className="fixed bottom-5 right-5 z-50">
            {isOpen && (
                <div className="w-80 h-96 bg-white rounded-xl shadow-xl flex flex-col animate-fade-in-scale-up">
                    <div className="bg-gradient-to-r from-[#1a365d] to-[#2d5c8a] p-4 text-white rounded-t-xl">
                        <h3 className="font-bold">SCB Assistant</h3>
                        <p className="text-xs opacity-80">How can we help you today?</p>
                    </div>
                    <div className="flex-grow p-4 text-sm text-gray-700 flex flex-col space-y-3 overflow-y-auto scrollbar-hide">
                        {messages.map((msg, index) => (
                             <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'bot' && <i className="fas fa-university text-xl text-gray-300 mb-1"></i>}
                                <p className={`max-w-[85%] px-3 py-2 rounded-lg ${msg.sender === 'bot' ? 'bg-gray-100' : 'bg-[#1a365d] text-white'}`}>
                                    {msg.text}
                                </p>
                            </div>
                        ))}
                        {isTyping && (
                             <div className="flex items-end gap-2 justify-start">
                                 <i className="fas fa-university text-xl text-gray-300 mb-1"></i>
                                 <div className="bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                                 </div>
                            </div>
                        )}
                         <div ref={messagesEndRef} />
                    </div>
                    <div className="p-2 border-t">
                        <form onSubmit={handleSendMessage}>
                            <input 
                                type="text" 
                                placeholder="Type a message..." 
                                className="w-full border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-[#e6b325] focus:border-[#e6b325]" 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </form>
                    </div>
                </div>
            )}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-[#e6b325] rounded-full text-white text-3xl flex items-center justify-center shadow-lg mt-4 hover:bg-[#d19d1f] transition-transform hover:scale-110"
                aria-label="Toggle chatbot"
            >
                {isOpen ? <i className="fas fa-times"></i> : <i className="fas fa-comment-dots"></i>}
            </button>
        </div>
    );
};

export default Chatbot;
