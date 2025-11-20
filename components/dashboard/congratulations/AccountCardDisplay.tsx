
import React from 'react';
import type { Account } from '../../../types';
import { USER_SETTINGS } from '../../../constants';
import { formatCurrency } from '../../../utils/formatters';
import { useCurrency } from '../../../contexts/GlobalSettingsContext';

interface AccountCardDisplayProps {
    account: Account;
    isBalanceHidden: boolean;
}

const cardDesigns: Record<Account['type'], { bgImage: string; cardType: 'Visa' | 'Mastercard', cardTypeIcon: string; gradient: string; tier: string }> = {
    Checking: {
        bgImage: 'https://images.unsplash.com/photo-1601597111158-2fceff2926d9?q=80&w=2564&auto=format&fit=crop',
        cardType: 'Visa',
        cardTypeIcon: 'fab fa-cc-visa',
        gradient: 'from-slate-900/60 via-blue-900/40 to-transparent',
        tier: 'INFINITE DEBIT'
    },
    Savings: {
        bgImage: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop',
        cardType: 'Mastercard',
        cardTypeIcon: 'fab fa-cc-mastercard',
        gradient: 'from-emerald-900/80 via-emerald-800/50 to-transparent',
        tier: 'WEALTH SAVER'
    },
    Investment: {
        bgImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop',
        cardType: 'Visa',
        cardTypeIcon: 'fab fa-cc-visa',
        gradient: 'from-indigo-900/70 via-blue-900/50 to-transparent',
        tier: 'PORTFOLIO ELITE'
    },
    Credit: {
        bgImage: 'https://images.unsplash.com/photo-1634117622592-114e3024ff27?q=80&w=2532&auto=format&fit=crop',
        cardType: 'Mastercard',
        cardTypeIcon: 'fab fa-cc-mastercard',
        gradient: 'from-black/90 via-gray-900/70 to-black/50',
        tier: 'BLACK WORLD ELITE'
    }
};

const EMVChip = () => (
    <div className="w-11 h-8 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-md border border-yellow-600/50 shadow-sm flex items-center justify-center overflow-hidden relative mx-1">
        <div className="absolute w-full h-[1px] bg-yellow-700/40 top-1/3"></div>
        <div className="absolute w-full h-[1px] bg-yellow-700/40 bottom-1/3"></div>
        <div className="absolute h-full w-[1px] bg-yellow-700/40 left-1/3"></div>
        <div className="absolute h-full w-[1px] bg-yellow-700/40 right-1/3"></div>
        <div className="w-5 h-4 border border-yellow-700/40 rounded-[2px]"></div>
    </div>
);

const AccountCardDisplay: React.FC<AccountCardDisplayProps> = ({ account, isBalanceHidden }) => {
    const { currency, exchangeRate, language } = useCurrency();
    const ownerName = USER_SETTINGS.profile.fullName;
    const design = cardDesigns[account.type];

    const convertedBalance = account.balance * exchangeRate;
    const isNegative = convertedBalance < 0;

    return (
        <div className="relative w-full aspect-[1.586] mx-auto rounded-xl shadow-2xl-soft text-white overflow-hidden transform hover:scale-[1.02] transition-transform duration-500 group">
            {/* Background */}
            <img src={design.bgImage} alt={`${account.type} card background`} className="absolute inset-0 w-full h-full object-cover" />
            
            {/* Premium Overlay Effects */}
            <div className={`absolute inset-0 bg-gradient-to-br ${design.gradient}`}></div>
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
            
            {/* Holographic Shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col justify-between h-full p-6">
                {/* Top Row */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                            <i className="fas fa-university text-sm text-white"></i>
                         </div>
                         <span className="font-bold tracking-wider text-sm uppercase text-shadow-sm opacity-90">SCB Group</span>
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-80 text-shadow bg-black/20 px-2 py-1 rounded backdrop-blur-sm border border-white/10">{design.tier}</span>
                </div>

                {/* Middle Section - Chip and Balance */}
                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-3">
                        <EMVChip />
                        <i className="fas fa-wifi rotate-90 text-white/70 text-2xl ml-2"></i>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] text-gray-300 font-medium tracking-wider uppercase mb-1 text-shadow">Available Balance</p>
                        <p className={`text-2xl font-mono font-bold tracking-tight text-shadow-md ${isNegative ? 'text-red-300' : 'text-white'}`}>
                            {isBalanceHidden ? '••••••' : formatCurrency(convertedBalance, currency.code, language.code)}
                        </p>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-auto">
                    <p className="font-mono text-xl tracking-widest text-shadow-md mb-4 opacity-95 flex gap-3">
                        <span>{account.number.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || account.number}</span>
                    </p>
                    
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[9px] text-gray-300 uppercase tracking-widest mb-0.5 opacity-80">Cardholder Name</p>
                            <p className="font-medium uppercase tracking-wider text-sm text-shadow">{ownerName}</p>
                        </div>
                        <div className="flex items-end gap-4">
                            <div>
                                <p className="text-[8px] text-gray-300 uppercase text-center tracking-wider mb-0.5 opacity-80">Valid Thru</p>
                                <p className="font-mono font-medium tracking-wider text-sm text-shadow">12/28</p>
                            </div>
                            <i className={`${design.cardTypeIcon} text-4xl text-white/90 drop-shadow-lg`}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountCardDisplay;
