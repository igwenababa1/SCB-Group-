
import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import { AppContext } from '../App';

// --- Assets & Data ---
const HERO_SLIDES = [
    {
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
        title: "Architects of Global Wealth.",
        subtitle: "Institutional-grade banking infrastructure for the modern era.",
        align: "text-center"
    },
    {
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop",
        title: "Precision. Privacy. Power.",
        subtitle: "Experience the Swedish standard of financial engineering.",
        align: "text-left"
    },
    {
        image: "https://images.unsplash.com/photo-1600880292203-94266e50434c?q=80&w=2070&auto=format&fit=crop",
        title: "Your Legacy, Secured.",
        subtitle: "Multi-generational wealth preservation strategies.",
        align: "text-right"
    }
];

const MARKET_DATA = [
    { pair: "EUR/USD", value: "1.0845", change: "+0.12%" },
    { pair: "GBP/USD", value: "1.2630", change: "-0.05%" },
    { pair: "USD/JPY", value: "148.20", change: "+0.30%" },
    { pair: "BTC/USD", value: "66,934.00", change: "+2.45%" },
    { pair: "ETH/USD", value: "3,595.24", change: "+1.80%" },
    { pair: "GOLD", value: "2,165.50", change: "+0.65%" },
    { pair: "S&P 500", value: "5,175.20", change: "+0.90%" },
];

// --- Components ---

const MarketStrip = () => (
    <div className="bg-[#0f172a] border-b border-white/10 overflow-hidden py-3 relative z-20">
        <div className="flex animate-scroll-left w-max hover:[animation-play-state:paused]">
            {[...MARKET_DATA, ...MARKET_DATA, ...MARKET_DATA].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 px-8 border-r border-white/5">
                    <span className="text-xs font-bold text-gray-400 tracking-wider">{item.pair}</span>
                    <span className="text-sm font-mono text-white">{item.value}</span>
                    <span className={`text-xs font-bold ${item.change.includes('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {item.change}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

const HeroSection: React.FC<{ showOpenAccount: () => void }> = ({ showOpenAccount }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden bg-[#020617]">
            {HERO_SLIDES.map((slide, index) => (
                <div 
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    {/* Image with Ken Burns Effect */}
                    <div 
                        className={`absolute inset-0 w-full h-full bg-cover bg-center transform transition-transform duration-[20000ms] ease-out ${index === currentSlide ? 'scale-110' : 'scale-100'}`}
                        style={{ backgroundImage: `url('${slide.image}')` }}
                    ></div>
                    
                    {/* Premium Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617]/40 to-[#020617]"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto px-6 lg:px-12">
                            <div className={`max-w-4xl ${slide.align === 'text-center' ? 'mx-auto text-center' : slide.align === 'text-right' ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
                                <div className="overflow-hidden mb-4">
                                    <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight transition-transform duration-1000 delay-300 ${index === currentSlide ? 'translate-y-0' : 'translate-y-full'}`}>
                                        {slide.title}
                                    </h1>
                                </div>
                                <div className="overflow-hidden mb-10">
                                    <p className={`text-xl md:text-2xl text-gray-300 font-light tracking-wide transition-transform duration-1000 delay-500 ${index === currentSlide ? 'translate-y-0' : 'translate-y-full'}`}>
                                        {slide.subtitle}
                                    </p>
                                </div>
                                
                                <div className={`transition-opacity duration-1000 delay-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                                    <button 
                                        onClick={showOpenAccount}
                                        className="group relative px-8 py-4 bg-[#e6b325] text-[#0f172a] font-bold text-sm uppercase tracking-widest hover:bg-white transition-colors duration-300 overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Begin Journey <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {/* Slide Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-30">
                {HERO_SLIDES.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-16 bg-[#e6b325]' : 'w-8 bg-white/20 hover:bg-white/40'}`}
                    />
                ))}
            </div>
        </section>
    );
};

const FeatureCard: React.FC<{ title: string; desc: string; icon: string; delay: string }> = ({ title, desc, icon, delay }) => (
    <div className={`glass-panel p-8 rounded-none border-l-2 border-[#e6b325] hover:bg-white/5 transition-all duration-500 group fade-in-up ${delay}`}>
        <div className="w-14 h-14 mb-6 flex items-center justify-center border border-white/10 rounded-full group-hover:border-[#e6b325] transition-colors">
            <i className={`fas ${icon} text-2xl text-gray-300 group-hover:text-[#e6b325] transition-colors`}></i>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#e6b325] transition-colors">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
        <div className="mt-6 flex items-center gap-2 text-[#e6b325] text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
            Explore <i className="fas fa-chevron-right"></i>
        </div>
    </div>
);

const StatsSection = () => (
    <section className="py-24 bg-[#0f172a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                {[
                    { label: "Assets Managed", value: "$120B+" },
                    { label: "Global Markets", value: "42" },
                    { label: "Corporate Clients", value: "12k+" },
                    { label: "Years of Trust", value: "168" },
                ].map((stat, idx) => (
                    <div key={idx} className="group">
                        <p className="text-4xl md:text-6xl font-bold text-white mb-2 group-hover:text-[#e6b325] transition-colors">{stat.value}</p>
                        <p className="text-xs md:text-sm text-gray-500 uppercase tracking-widest font-bold">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const LandingPage: React.FC = () => {
    const { showLogin, showOpenAccount } = useContext(AppContext);

    return (
        <div className="bg-[#020617] min-h-screen flex flex-col">
            <MarketStrip />
            <Header />
            
            <main className="flex-grow">
                <HeroSection showOpenAccount={showOpenAccount} />
                
                {/* Services Grid */}
                <section className="py-32 bg-[#0b1120] relative">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                            <div className="max-w-2xl">
                                <span className="text-[#e6b325] font-bold tracking-widest uppercase text-xs mb-2 block">Our Expertise</span>
                                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                    Comprehensive financial solutions for the <span className="italic text-gray-400">world's builders</span>.
                                </h2>
                            </div>
                            <button onClick={showOpenAccount} className="mt-8 md:mt-0 text-white border-b border-[#e6b325] pb-1 hover:text-[#e6b325] transition-colors text-sm uppercase tracking-widest">
                                View All Services
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard 
                                title="Private Wealth" 
                                desc="Bespoke investment strategies and legacy planning for ultra-high-net-worth individuals and families." 
                                icon="fa-crown"
                                delay="delay-100"
                            />
                            <FeatureCard 
                                title="Corporate & Investment" 
                                desc="Capital raising, M&A advisory, and treasury services driving growth for global enterprises." 
                                icon="fa-building"
                                delay="delay-200"
                            />
                            <FeatureCard 
                                title="Global Markets" 
                                desc="24/7 access to FX, commodities, and equities with institutional-grade execution and liquidity." 
                                icon="fa-globe-americas"
                                delay="delay-300"
                            />
                        </div>
                    </div>
                </section>

                <StatsSection />

                {/* CTA Section */}
                <section className="relative py-32 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[#1a365d]">
                        <img 
                            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
                            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                        />
                    </div>
                    <div className="relative z-10 text-center max-w-3xl px-6">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to elevate your portfolio?</h2>
                        <p className="text-xl text-blue-100 mb-10 font-light">Join the financial institution defining the future of global construction and commerce.</p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button onClick={showOpenAccount} className="px-10 py-4 bg-[#e6b325] text-[#0f172a] font-bold text-sm uppercase tracking-widest hover:bg-white transition-colors shadow-2xl">
                                Open an Account
                            </button>
                            <button className="px-10 py-4 border border-white text-white font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-[#0f172a] transition-colors">
                                Contact Concierge
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            
            <Footer />
            <Chatbot />
        </div>
    );
};

export default LandingPage;
