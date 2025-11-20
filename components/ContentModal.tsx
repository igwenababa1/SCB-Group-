
import React, { useEffect, useState } from 'react';

interface ContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    category: string;
}

const ContentModal: React.FC<ContentModalProps> = ({ isOpen, onClose, title, category }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            const timer = setTimeout(() => setLoading(false), 800);
            return () => clearTimeout(timer);
        }
    }, [isOpen, title]);

    if (!isOpen) return null;

    // Dynamic content generation based on category or specific title keywords
    const getCategoryDetails = () => {
        const lowerTitle = title.toLowerCase();
        const lowerCategory = category.toLowerCase();

        if (lowerCategory === 'payments' || lowerTitle.includes('payment')) {
            return {
                image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=2070&auto=format&fit=crop',
                subtitle: 'Global Transaction Services',
                description: 'Experience frictionless capital movement with our institutional-grade payment infrastructure. We support real-time settlement, multi-currency accounts, and SWIFT gpi tracking for absolute transparency.',
                features: ['Instant SEPA & ACH Settlement', 'Cross-Border Liquidity Management', 'ISO 20022 Compliance', 'Automated FX Hedging']
            };
        }
        
        if (lowerCategory === 'cards' || lowerTitle.includes('card')) {
            return {
                image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
                subtitle: 'The World Elite Portfolio',
                description: 'Crafted from aerospace-grade metal, our cards offer more than just purchasing power. They are your key to exclusive airport lounges, 24/7 concierge services, and comprehensive travel insurance.',
                features: ['No Foreign Transaction Fees', 'Unlimited Airport Lounge Access', 'Purchase Protection & Warranty', 'Bespoke Concierge Service']
            };
        }

        if (lowerCategory === 'investments' || lowerTitle.includes('invest')) {
            return {
                image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop',
                subtitle: 'Global Market Access',
                description: 'Trade equities, derivatives, and commodities across 42 global exchanges. Our platform provides AI-driven sentiment analysis, advanced charting, and direct access to our wealth advisory desk.',
                features: ['Real-Time Market Data', 'Algorithmic Trading Tools', 'Private Equity Opportunities', 'Tax-Loss Harvesting']
            };
        }

        if (lowerCategory === 'lending' || lowerTitle.includes('loan')) {
             return {
                image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2070&auto=format&fit=crop',
                subtitle: 'Strategic Financing',
                description: 'Unlock liquidity without liquidating assets. We offer bespoke financing solutions including securities-backed lending, luxury asset financing, and tailored residential mortgages.',
                features: ['Lombard Lending', 'Multi-Currency Mortgages', 'Business Lines of Credit', 'Aircraft & Yacht Financing']
            };
        }

        if (lowerCategory === 'security' || lowerTitle.includes('security')) {
             return {
                image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop',
                subtitle: 'Fortress Security Protocol',
                description: 'Your security is paramount. We employ military-grade encryption, continuous biometric authentication, and AI-driven fraud detection to ensure your assets are protected 24/7.',
                features: ['Biometric FIDO2 Auth', '24/7 Fraud Monitoring', 'Zero-Liability Protection', 'Secure Enclave Architecture']
            };
        }

        switch (category) {
            case 'Private Banking':
                return {
                    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop',
                    subtitle: 'Exclusive Wealth Management',
                    description: 'Our Private Banking division offers bespoke financial strategies for ultra-high-net-worth individuals. From legacy planning to exclusive investment opportunities, we provide a sanctuary for your wealth.',
                    features: ['Dedicated Relationship Manager', 'Family Office Solutions', 'Cross-Border Tax Advisory', 'Art & Aircraft Financing']
                };
            case 'Corporate & Inst.':
                return {
                    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
                    subtitle: 'Global Enterprise Solutions',
                    description: 'Driving growth for the world\'s most ambitious companies. We offer institutional-grade execution, liquidity management, and capital market access tailored to your corporate strategy.',
                    features: ['Global Trade Finance', 'M&A Advisory', 'Treasury Services', 'Institutional Sales & Trading']
                };
            case 'About SCB':
                return {
                    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
                    subtitle: 'Building the Future',
                    description: 'Since 1856, Swedish Construction Bank has been a pillar of stability and innovation. We are committed to sustainable banking and engineering a better financial future for all.',
                    features: ['Sustainability & ESG', 'Investor Relations', 'Corporate Governance', 'Careers at SCB']
                };
            case 'Client Support':
                return {
                    image: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2069&auto=format&fit=crop',
                    subtitle: '24/7 Global Assistance',
                    description: 'Our dedicated support team is always available to assist you. Whether you need help with a transaction, security concerns, or general inquiries, we are here to serve.',
                    features: ['Fraud Protection Center', 'Lost Card Assistance', 'Dispute Resolution', 'Accessibility Services']
                };
            default:
                return {
                    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
                    subtitle: 'Global Financial Services',
                    description: 'Explore our comprehensive range of financial products and services designed to meet your unique needs.',
                    features: ['Global Access', 'Secure Banking', 'Innovation', 'Trust']
                };
        }
    };

    const details = getCategoryDetails();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"></div>
            
            <div 
                className="relative w-full max-w-4xl bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors border border-white/10">
                    <i className="fas fa-times"></i>
                </button>

                {/* Left Side: Image & Overlay */}
                <div className="relative w-full md:w-2/5 h-48 md:h-auto overflow-hidden">
                    <img src={details.image} alt={category} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 z-10">
                        <p className="text-[#e6b325] text-xs font-bold uppercase tracking-widest mb-1">{category}</p>
                        <h2 className="text-3xl font-bold text-white leading-tight">{title}</h2>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col">
                    {loading ? (
                        <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                            <div className="w-12 h-12 border-4 border-[#e6b325]/30 border-t-[#e6b325] rounded-full animate-spin"></div>
                            <p className="text-gray-400 text-sm animate-pulse">Retrieving secure content...</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-4">{details.subtitle}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">{details.description}</p>
                            </div>

                            <div className="flex-grow">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Key Features</h4>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {details.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
                                            <i className="fas fa-check-circle text-[#e6b325] mt-0.5 text-xs"></i>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10 flex gap-4">
                                <button className="flex-1 py-3 rounded-xl bg-[#e6b325] text-[#1a365d] font-bold hover:bg-[#d4a017] transition-colors shadow-lg shadow-yellow-500/20">
                                    Explore Solutions
                                </button>
                                <button onClick={onClose} className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors">
                                    Close
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentModal;
