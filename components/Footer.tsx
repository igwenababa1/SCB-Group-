
import React, { useState } from 'react';
import { SOCIAL_LINKS } from '../constants';
import { useLanguage } from '../contexts/GlobalSettingsContext';
import { LANGUAGES } from '../i18n';
import ContentModal from './ContentModal';

const Footer: React.FC = () => {
    const [email, setEmail] = useState('');
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [isLangOpen, setIsLangOpen] = useState(false);
    const { language, setLanguage } = useLanguage();

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', category: '' });

    const handleLinkClick = (e: React.MouseEvent, title: string, category: string) => {
        e.preventDefault();
        setModalContent({ title, category });
        setModalOpen(true);
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setFormState('submitting');
        setTimeout(() => {
            setFormState('success');
            setTimeout(() => {
                setFormState('idle');
                setEmail('');
            }, 2000);
        }, 1500);
    };

    const stockTickerItems = [
        { symbol: 'SCB Group (STO)', price: '145.20', change: '+0.85%', up: true },
        { symbol: 'SCB (NYSE)', price: '14.12', change: '+1.10%', up: true },
        { symbol: 'SCB (LSE)', price: '11.05', change: '-0.20%', up: false },
        { symbol: 'EUR/USD', price: '1.0845', change: '+0.05%', up: true },
        { symbol: 'EUR/SEK', price: '11.230', change: '-0.15%', up: false },
        { symbol: 'Brent Crude', price: '82.40', change: '+0.45%', up: true },
        { symbol: 'Gold Spot', price: '2035.10', change: '-0.12%', up: false },
    ];

    const footerSections = [
        {
            title: "Private Banking",
            description: "Tailored financial solutions for high-net-worth individuals.",
            links: [
                "Exclusive Accounts", "Wealth Advisory", "Family Office Services", 
                "Mortgages & Real Estate", "Luxury Card Portfolio", "Legacy Planning",
                "International Banking"
            ]
        },
        {
            title: "Corporate & Inst.",
            description: "Driving growth for businesses and institutions globally.",
            links: [
                "Global Transaction Services", "Investment Banking", "Markets & Securities",
                "Trade & Supply Chain Finance", "Liquidity Management", "Corporate Lending",
                "Sustainable Finance"
            ]
        },
        {
            title: "About SCB",
            description: "Building a sustainable future since 1856.",
            links: [
                "Our Leadership", "Investor Relations", "Sustainability & ESG",
                "Careers & Culture", "Newsroom & Insights", "Global Presence",
                "Corporate Governance"
            ]
        },
        {
            title: "Client Support",
            description: "Dedicated assistance available 24/7.",
            links: [
                "Contact Us", "Lost or Stolen Card", "Fraud & Security Center",
                "Accessibility", "Find a Branch / ATM", "Make an Appointment",
                "Whistleblowing"
            ]
        }
    ];

    return (
        <footer className="relative bg-[#0b1120] text-white overflow-hidden font-sans border-t border-[#1e293b]">
            {/* Stock Ticker Strip */}
            <div className="bg-[#020617] border-b border-white/5 py-2 overflow-hidden relative z-20">
                <div className="container mx-auto px-4 flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-gray-400">
                    <span className="hidden md:flex items-center gap-2 font-bold text-blue-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Market Data Live
                    </span>
                    <div className="flex gap-8 animate-marquee whitespace-nowrap w-full md:w-auto">
                        {[...stockTickerItems, ...stockTickerItems].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <span className="text-white font-bold">{item.symbol}</span>
                                <span>{item.price}</span>
                                <span className={item.up ? 'text-green-500' : 'text-red-500'}>
                                    {item.up ? '▲' : '▼'} {item.change}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Background Visuals */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                    alt="Global Architecture"
                    className="w-full h-full object-cover opacity-[0.03] grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/95 to-[#0b1120]/80"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
            </div>

            <div className="container mx-auto px-6 lg:px-12 py-16 relative z-10">
                {/* Upper Section: Brand & Global Search/Newsletter */}
                <div className="flex flex-col lg:flex-row justify-between gap-12 pb-12 border-b border-white/10">
                    <div className="lg:w-1/3 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e6b325] to-[#b08d26] flex items-center justify-center shadow-lg shadow-yellow-500/10 border border-white/10">
                                <i className="fas fa-university text-[#1a365d] text-2xl"></i>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-white">SCB Group</h2>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Global Financial Engineering</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                            Headquartered in Stockholm, serving the world. We provide institutional-grade security, innovative wealth management, and sustainable banking solutions for the modern era.
                        </p>
                        
                        <div className="flex flex-wrap gap-4 pt-2">
                            <button onClick={(e) => handleLinkClick(e, 'App Store Download', 'Mobile App')} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                                <i className="fab fa-apple text-2xl text-gray-300 group-hover:text-white"></i>
                                <div className="text-left">
                                    <div className="text-[8px] text-gray-500 uppercase group-hover:text-gray-400">Download on the</div>
                                    <div className="text-xs font-bold text-gray-200 group-hover:text-white">App Store</div>
                                </div>
                            </button>
                            <button onClick={(e) => handleLinkClick(e, 'Play Store Download', 'Mobile App')} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                                <i className="fab fa-google-play text-xl text-gray-300 group-hover:text-white"></i>
                                <div className="text-left">
                                    <div className="text-[8px] text-gray-500 uppercase group-hover:text-gray-400">Get it on</div>
                                    <div className="text-xs font-bold text-gray-200 group-hover:text-white">Google Play</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="lg:w-2/3 bg-[#1e293b]/30 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-[#e6b325]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2 text-white">Executive Insights & Market Intelligence</h3>
                            <p className="text-gray-400 text-sm mb-6 max-w-2xl">
                                Join 250,000+ leaders receiving our weekly global economic outlook, wealth strategies, and industry analysis.
                            </p>
                            
                            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl">
                                <div className="flex-grow relative">
                                    <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                    <input
                                        type="email"
                                        placeholder="Enter your corporate email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-[#e6b325] focus:border-[#e6b325] transition-all outline-none text-sm"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={formState !== 'idle'}
                                    className="px-8 py-3.5 rounded-xl bg-[#e6b325] text-[#1a365d] font-bold hover:bg-[#d4a017] transition-all shadow-lg shadow-yellow-500/10 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] flex items-center justify-center gap-2"
                                >
                                    {formState === 'idle' && <span>Subscribe</span>}
                                    {formState === 'submitting' && <i className="fas fa-circle-notch fa-spin"></i>}
                                    {formState === 'success' && <span className="flex items-center gap-2"><i className="fas fa-check"></i> Joined</span>}
                                </button>
                            </form>
                            <p className="text-[10px] text-gray-500 mt-3">
                                Protected by reCAPTCHA. See our <button onClick={(e) => handleLinkClick(e, 'Privacy Policy', 'Legal')} className="text-gray-400 hover:text-white underline">Privacy Policy</button>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Links Grid - Expanded & Professional */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 py-16 border-b border-white/5">
                    {footerSections.map((section, idx) => (
                        <div key={idx} className="group">
                            <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                {section.title}
                            </h4>
                            <p className="text-xs text-gray-500 mb-6 h-8">{section.description}</p>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <button 
                                            onClick={(e) => handleLinkClick(e, link, section.title)} 
                                            className="text-sm text-gray-400 hover:text-[#e6b325] transition-colors flex items-center group/link w-full text-left"
                                        >
                                            <span className="w-1 h-1 rounded-full bg-gray-600 mr-3 group-hover/link:bg-[#e6b325] transition-colors"></span>
                                            <span className="group-hover/link:translate-x-1 transition-transform duration-300">{link}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Contact & Regional Info */}
                <div className="py-10 border-b border-white/5 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Global Headquarters</h5>
                        <div className="flex items-start gap-3 text-sm text-gray-400">
                            <i className="fas fa-map-marker-alt mt-1 text-[#e6b325]"></i>
                            <p>
                                123 Financial District, <br/>
                                SE-103 27 Stockholm, Sweden
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <i className="fas fa-phone-alt text-[#e6b325]"></i>
                            <p>+46 (0) 8 123 45 67</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Connect With Us</h5>
                        <div className="flex gap-4">
                            {SOCIAL_LINKS.map(link => (
                                <a 
                                    key={link.label} 
                                    href={link.href} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#e6b325] flex items-center justify-center text-gray-400 hover:text-[#1a365d] transition-all border border-white/5 hover:border-[#e6b325]"
                                    aria-label={link.label}
                                >
                                    <i className={link.icon}></i>
                                </a>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Follow our journey on social media for the latest updates.</p>
                    </div>

                    <div className="space-y-4">
                        <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Regional Settings</h5>
                        <div className="relative">
                            <button 
                                onClick={() => setIsLangOpen(!isLangOpen)} 
                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:border-white/20 transition-all"
                            >
                                <span className="flex items-center gap-2">
                                    <span className="text-lg">{language.flag}</span>
                                    <span>{language.name} (International)</span>
                                </span>
                                <i className={`fas fa-chevron-down text-xs transition-transform ${isLangOpen ? 'rotate-180' : ''}`}></i>
                            </button>
                            
                            {isLangOpen && (
                                <div className="absolute bottom-full right-0 left-0 mb-2 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in-scale-up z-30">
                                    {LANGUAGES.map(lang => (
                                        <button 
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang);
                                                setIsLangOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between text-sm text-gray-300 hover:text-white transition-colors border-b border-white/5 last:border-0"
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className="text-lg">{lang.flag}</span> {lang.name}
                                            </span>
                                            {language.code === lang.code && <i className="fas fa-check text-[#e6b325] text-xs"></i>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Legal & Regulatory */}
                <div className="pt-10 text-[10px] text-gray-500 leading-relaxed">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                        <div className="space-y-3">
                            <p>
                                <strong>Regulatory Information:</strong> Swedish Construction Bank AB (publ) is authorized by the Swedish Prudential Regulation Authority (Finansinspektionen) and regulated by the Financial Conduct Authority and the Prudential Regulation Authority for UK operations. Registered Office: 123 Financial District, Stockholm, Sweden. Registered in Sweden No. 556000-0000.
                            </p>
                            <p>
                                <strong>Investment Risk Warning:</strong> The value of investments and the income from them can go down as well as up and you may not get back the amount originally invested. Past performance is not a reliable indicator of future results.
                            </p>
                        </div>
                        <div className="space-y-3 md:text-right">
                            <div className="flex flex-wrap gap-2 md:justify-end mb-2">
                                <span className="px-2 py-1 border border-gray-800 rounded bg-white/5">Member FDIC Equivalent</span>
                                <span className="px-2 py-1 border border-gray-800 rounded bg-white/5">Equal Housing Lender</span>
                                <span className="px-2 py-1 border border-gray-800 rounded bg-white/5">FSCS Protected</span>
                            </div>
                            <p>
                                © {new Date().getFullYear()} Swedish Construction Bank AB (publ). All rights reserved.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 border-t border-white/5 pt-6">
                        <button onClick={(e) => handleLinkClick(e, 'Privacy Policy', 'Legal')} className="hover:text-[#e6b325] transition-colors">Privacy Policy</button>
                        <button onClick={(e) => handleLinkClick(e, 'Terms & Conditions', 'Legal')} className="hover:text-[#e6b325] transition-colors">Terms & Conditions</button>
                        <button onClick={(e) => handleLinkClick(e, 'Cookie Policy', 'Legal')} className="hover:text-[#e6b325] transition-colors">Cookie Policy</button>
                        <button onClick={(e) => handleLinkClick(e, 'Accessibility Statement', 'Legal')} className="hover:text-[#e6b325] transition-colors">Accessibility Statement</button>
                        <button onClick={(e) => handleLinkClick(e, 'Sitemap', 'Site')} className="hover:text-[#e6b325] transition-colors">Sitemap</button>
                        <button onClick={(e) => handleLinkClick(e, 'Security Center', 'Security')} className="hover:text-[#e6b325] transition-colors">Security Center</button>
                        <button onClick={(e) => handleLinkClick(e, 'Modern Slavery Statement', 'Legal')} className="hover:text-[#e6b325] transition-colors">Modern Slavery Statement</button>
                    </div>
                </div>
            </div>

            {/* Content Modal */}
            <ContentModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                title={modalContent.title} 
                category={modalContent.category} 
            />
        </footer>
    );
};

export default Footer;
