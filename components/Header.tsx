
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { useLanguage, useTheme } from '../contexts/GlobalSettingsContext';
import ContentModal from './ContentModal';

const Header: React.FC = () => {
    const { showLogin, showOpenAccount } = useContext(AppContext);
    const { t, language } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', category: '' });

    // Handle Scroll Effect for Glassmorphism
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleContentClick = (e: React.MouseEvent, title: string, category: string) => {
        e.preventDefault();
        setModalContent({ title, category });
        setModalOpen(true);
    };

    const NavLink: React.FC<{ children: React.ReactNode; badge?: string; onClick: () => void }> = ({ children, badge, onClick }) => (
        <button 
            onClick={onClick} 
            className="group relative flex items-center h-full px-2 font-medium text-sm text-gray-200 hover:text-white transition-colors duration-300"
        >
            <span>{children}</span>
            {badge && (
                <span className="ml-2 px-1.5 py-0.5 rounded-[4px] bg-[#e6b325] text-[#1a365d] text-[9px] font-bold uppercase tracking-wider">
                    {badge}
                </span>
            )}
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e6b325] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
        </button>
    );

    const TopBarLink: React.FC<{ label: string; title: string; category: string; active?: boolean }> = ({ label, title, category, active }) => (
        <button 
            onClick={(e) => handleContentClick(e, title, category)}
            className={`text-[11px] font-bold uppercase tracking-wider hover:text-[#e6b325] transition-colors ${active ? 'text-white border-b-2 border-[#e6b325] pb-3' : 'text-gray-400 pb-3 border-b-2 border-transparent'}`}
        >
            {label}
        </button>
    );

    return (
        <>
            <header 
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    scrolled 
                        ? 'bg-[#0f172a]/90 backdrop-blur-xl shadow-2xl border-b border-white/10 py-0' 
                        : 'bg-gradient-to-b from-black/80 to-transparent py-2 border-b border-white/5'
                }`}
            >
                {/* Top Utility Bar (Desktop Only) */}
                <div className={`container mx-auto px-6 hidden lg:flex justify-between items-center border-b border-white/10 transition-all duration-300 ${scrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-10 opacity-100'}`}>
                    <div className="flex gap-6 items-end h-full">
                        <TopBarLink label="Private" title="Private Banking" category="Private Banking" active />
                        <TopBarLink label="Business" title="Business Banking" category="Corporate & Inst." />
                        <TopBarLink label="Corporate & Inst." title="Corporate Solutions" category="Corporate & Inst." />
                        <TopBarLink label="Wealth" title="Wealth Management" category="Private Banking" />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            System Operational
                        </span>
                        <div className="h-3 w-px bg-white/20"></div>
                        <button onClick={(e) => handleContentClick(e, 'Careers at SCB', 'About SCB')} className="hover:text-white transition-colors">Careers</button>
                        <button onClick={(e) => handleContentClick(e, 'Investor Relations', 'About SCB')} className="hover:text-white transition-colors">Investor Relations</button>
                        <div className="h-3 w-px bg-white/20"></div>
                        <button className="flex items-center gap-1 hover:text-white transition-colors">
                            <i className="fas fa-globe"></i> {language.name}
                        </button>
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="container mx-auto px-6">
                    <div className={`flex justify-between items-center transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'}`}>
                        
                        {/* Logo Section */}
                        <a href="#home" className="flex items-center gap-3 group">
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#e6b325] to-[#b08d26] rounded-lg transform rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-yellow-500/20"></div>
                                <div className="absolute inset-0 bg-[#1a365d] rounded-lg transform -rotate-3 group-hover:-rotate-6 transition-transform duration-300 opacity-90"></div>
                                <i className="fas fa-university text-xl text-[#e6b325] relative z-10"></i>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-white leading-tight tracking-tight">SCB</span>
                                <span className="text-[9px] font-medium text-gray-400 uppercase tracking-[0.2em] group-hover:text-[#e6b325] transition-colors">Global Banking</span>
                            </div>
                        </a>

                        {/* Desktop Menu */}
                        <nav className="hidden lg:flex items-center gap-8 h-full">
                            <NavLink onClick={() => handleContentClick({ preventDefault: () => {} } as any, 'Global Payments', 'Payments')}>Payments</NavLink>
                            <NavLink onClick={() => handleContentClick({ preventDefault: () => {} } as any, 'Premium Cards', 'Cards')}>Cards</NavLink>
                            <NavLink onClick={() => handleContentClick({ preventDefault: () => {} } as any, 'Wealth & Investing', 'Investments')} badge="Hot">Investments</NavLink>
                            <NavLink onClick={() => handleContentClick({ preventDefault: () => {} } as any, 'Lending Solutions', 'Lending')}>Lending</NavLink>
                            <NavLink onClick={() => handleContentClick({ preventDefault: () => {} } as any, 'Cybersecurity Center', 'Security')}>Security</NavLink>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <button 
                                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                aria-label="Search"
                            >
                                <i className="fas fa-search"></i>
                            </button>

                            <button
                                onClick={toggleTheme}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-yellow-400 hover:bg-white/10 transition-all"
                                aria-label="Toggle theme"
                            >
                                {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
                            </button>

                            <button 
                                onClick={showOpenAccount}
                                className="hidden md:block text-sm font-bold text-gray-300 hover:text-white transition-colors mr-2"
                            >
                                Open Account
                            </button>

                            <button 
                                onClick={showLogin}
                                className="relative overflow-hidden group bg-gradient-to-r from-[#e6b325] to-[#d4a017] text-[#1a365d] px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <i className="fas fa-lock text-xs"></i> {t('login')}
                                </span>
                                <div className="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></div>
                            </button>

                            {/* Mobile Menu Toggle */}
                            <button 
                                className="lg:hidden text-white text-2xl ml-2"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0f172a] border-t border-white/10 p-6 shadow-2xl animate-fade-in-section">
                        <nav className="flex flex-col gap-4">
                            <button onClick={() => handleContentClick({ preventDefault: () => {} } as any, 'Global Payments', 'Payments')} className="text-gray-300 hover:text-[#e6b325] font-medium py-2 border-b border-white/5 text-left">Payments</button>
                            <button onClick={() => handleContentClick({ preventDefault: () => {} } as any, 'Premium Cards', 'Cards')} className="text-gray-300 hover:text-[#e6b325] font-medium py-2 border-b border-white/5 text-left">Cards</button>
                            <button onClick={() => handleContentClick({ preventDefault: () => {} } as any, 'Wealth & Investing', 'Investments')} className="text-gray-300 hover:text-[#e6b325] font-medium py-2 border-b border-white/5 text-left">Investments</button>
                            <button onClick={() => handleContentClick({ preventDefault: () => {} } as any, 'Cybersecurity Center', 'Security')} className="text-gray-300 hover:text-[#e6b325] font-medium py-2 border-b border-white/5 text-left">Security</button>
                            <div className="pt-4 flex flex-col gap-3">
                                 <button onClick={showOpenAccount} className="w-full py-3 rounded-lg bg-white/5 text-white border border-white/10 font-bold text-sm">Open Account</button>
                                 <button onClick={showLogin} className="w-full py-3 rounded-lg bg-[#e6b325] text-[#1a365d] font-bold text-sm">Login</button>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Content Modal */}
            <ContentModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                title={modalContent.title} 
                category={modalContent.category} 
            />
        </>
    );
};

export default Header;
