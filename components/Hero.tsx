import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { TESTIMONIALS, TRUST_LOGOS, FEATURES } from '../constants';
import DashboardPreview from './DashboardPreview';

const Section: React.FC<{ id: string; children: React.ReactNode; className?: string; }> = ({ id, children, className = '' }) => (
    <section id={id} className={`py-20 md:py-28 ${className} fade-in-section`}>
        {children}
    </section>
);

const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
        <div className="text-4xl text-yellow-400 mb-4">
            <i className={`fas ${icon}`}></i>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
    </div>
);

const heroImages = [
    "https://images.unsplash.com/photo-1600880292203-94266e50434c?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
];

const Hero: React.FC = () => {
    const { showLogin } = useContext(AppContext);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % heroImages.length);
        }, 6000); // Change image every 6 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-slate-900">
            {/* Hero Section */}
            <section id="home" className="relative h-screen flex items-center justify-center text-white text-center overflow-hidden">
                {heroImages.map((src, index) => (
                    <div
                        key={src}
                        className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out animate-kenburns-subtle ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                        style={{ backgroundImage: `url(${src})` }}
                    />
                ))}
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                <div className="container mx-auto px-4 relative z-20 animate-fade-in-scale-up">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-shadow-lg tracking-tight">
                        Clarity & Confidence.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
                        Your global financial partner, engineered for a complex world.
                    </p>
                    <button onClick={showLogin} className="bg-[#e6b325] text-[#1a365d] font-bold px-8 py-3.5 rounded-md hover:bg-[#d19d1f] transition duration-300 transform hover:scale-105 text-lg">
                        Open an Account
                    </button>
                </div>
            </section>

            {/* Payments Section */}
            <Section id="payments" className="bg-slate-900 text-white">
                 <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">Payments Without Borders.</h2>
                            <p className="text-gray-300 mb-8">
                                Instantly send money to anyone, anywhere. Pay bills, schedule transfers, and manage global transactions with institutional-grade speed and security.
                            </p>
                             <div className="space-y-4">
                                <p className="flex items-center gap-3"><i className="fas fa-paper-plane text-yellow-400"></i><span>Peer-to-Peer Transfers</span></p>
                                <p className="flex items-center gap-3"><i className="fas fa-file-invoice-dollar text-yellow-400"></i><span>Automated Bill Pay</span></p>
                                <p className="flex items-center gap-3"><i className="fas fa-globe text-yellow-400"></i><span>International Wire Service</span></p>
                            </div>
                        </div>
                        <div>
                           <img src="https://images.unsplash.com/photo-1554224155-8d04421cd67d?q=80&w=2070&auto=format&fit=crop" alt="Payments" className="rounded-2xl shadow-2xl-soft" />
                        </div>
                    </div>
                </div>
            </Section>
            
            <div className="section-divider bg-slate-900"></div>

             {/* Cards Section */}
            <Section id="cards" className="bg-slate-900 text-white">
                 <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                         <div className="relative h-96 flex items-center justify-center">
                            {/* Card 1 */}
                            <div className="absolute w-80 h-48 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl shadow-2xl p-4 text-white transform rotate-[-10deg] transition-transform duration-500 hover:rotate-[-5deg] hover:scale-105">
                                <p className="font-semibold text-2xl italic">Visa</p>
                                <div className="absolute bottom-4 left-4 font-mono tracking-wider">•••• 1234</div>
                            </div>
                             {/* Card 2 */}
                             <div className="absolute w-80 h-48 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl shadow-2xl p-4 text-black transform rotate-[5deg] transition-transform duration-500 hover:rotate-[2deg] hover:scale-105 z-10">
                                <p className="font-semibold text-2xl italic">Mastercard</p>
                                <div className="absolute bottom-4 left-4 font-mono tracking-wider">•••• 5678</div>
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">The Card, Redefined.</h2>
                            <p className="text-gray-300 mb-8">
                                Experience total control over your spending with our premium cards. Freeze instantly, set limits, and enjoy global acceptance with robust security.
                            </p>
                            <button onClick={showLogin} className="bg-white text-slate-900 font-bold px-8 py-3 rounded-md hover:bg-gray-200 transition">
                                Get Your Card
                            </button>
                        </div>
                    </div>
                </div>
            </Section>

            <div className="section-divider bg-slate-900"></div>

            {/* Investments & Crypto Section */}
            <Section id="investments" className="bg-slate-900 text-white">
                <div className="container mx-auto px-4 text-center">
                     <h2 className="text-4xl md:text-5xl font-bold mb-4">Build Your Financial Future.</h2>
                    <p className="max-w-3xl mx-auto text-gray-300 mb-12">
                        From traditional markets to the new frontier of digital assets, our platform provides the tools and insights you need to grow your wealth.
                    </p>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Investments */}
                        <div className="bg-cover bg-center p-8 rounded-2xl shadow-2xl-soft" style={{backgroundImage: "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop')"}}>
                             <div className="bg-black/50 p-6 rounded-xl backdrop-blur-sm">
                                <h3 className="text-3xl font-bold mb-2">Global Investments</h3>
                                <p className="mb-6">Access stocks, bonds, and ETFs from markets around the world.</p>
                                <button className="bg-yellow-400 text-black font-bold px-6 py-2.5 rounded-md hover:bg-yellow-300">Start Investing</button>
                            </div>
                        </div>
                         {/* Crypto */}
                        <div className="bg-cover bg-center p-8 rounded-2xl shadow-2xl-soft" style={{backgroundImage: "url('https://images.unsplash.com/photo-1641551624131-23d4e78a2846?q=80&w=2070&auto=format&fit=crop')"}}>
                            <div className="bg-black/50 p-6 rounded-xl backdrop-blur-sm">
                                <h3 className="text-3xl font-bold mb-2">Digital Assets</h3>
                                <p className="mb-6">Securely buy, sell, and hold top cryptocurrencies with ease.</p>
                                <button className="bg-white text-black font-bold px-6 py-2.5 rounded-md hover:bg-gray-200">Explore Crypto</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            <div className="section-divider bg-slate-900"></div>

            {/* Security Section */}
            <Section id="security" className="bg-slate-900 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Security You Can Bank On.</h2>
                    <p className="max-w-3xl mx-auto text-gray-300 mb-12">
                       Our multi-layered security protocols work 24/7 to protect your assets and data, so you can bank with absolute confidence.
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {FEATURES.slice(2, 5).map(feature => <FeatureCard key={feature.title} {...feature} />)}
                    </div>
                </div>
            </Section>
            
            {/* Trust Logos & Testimonials Section */}
            <Section id="testimonials" className="bg-white dark:bg-slate-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <p className="max-w-3xl mx-auto text-gray-600 dark:text-slate-300">
                            Praised by leading voices in finance and technology for our commitment to excellence.
                        </p>
                    </div>

                    {/* Trust Logos */}
                    <div className="flex justify-center items-center gap-x-12 gap-y-8 flex-wrap mb-20">
                        {TRUST_LOGOS.map(logo => (
                            <img 
                                key={logo.name} 
                                src={logo.logoUrl} 
                                alt={logo.name} 
                                className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all duration-300 dark:invert dark:opacity-70 dark:hover:opacity-100"
                                title={logo.name}
                            />
                        ))}
                    </div>

                    {/* Testimonials */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((testimonial, index) => (
                             <div key={index} className="bg-gray-50 dark:bg-slate-700/50 p-8 rounded-xl shadow-lg border border-gray-200/50 dark:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 transform flex flex-col">
                                <i className="fas fa-quote-left text-4xl text-yellow-400/50 mb-4"></i>
                                <p className="text-gray-600 dark:text-slate-300 mb-6 flex-grow">"{testimonial.quote}"</p>
                                <div className="flex items-center mt-auto">
                                    <img src={testimonial.author.avatarUrl} alt={testimonial.author.name} className="w-14 h-14 rounded-full mr-4 border-2 border-white dark:border-slate-500 shadow-md" />
                                    <div>
                                        <p className="font-bold text-[#1a365d] dark:text-white">{testimonial.author.name}</p>
                                        <p className="text-gray-500 dark:text-slate-400 text-sm">{testimonial.author.title}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default Hero;