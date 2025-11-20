
import React from 'react';
import { ACCOUNTS } from '../../../constants';
import AccountCardDisplay from '../congratulations/AccountCardDisplay';

const PremiumCardsCarousel: React.FC = () => {
    return (
        <div className="overflow-x-auto pb-8 -mx-8 px-8 md:mx-0 md:px-0 scrollbar-hide">
            <div className="flex gap-6 w-max">
                {ACCOUNTS.map(account => (
                    <div key={account.id} className="w-[85vw] md:w-[400px] flex-shrink-0 transform hover:-translate-y-2 transition-transform duration-300">
                        <div className="relative group">
                             <div className="absolute -inset-0.5 bg-gradient-to-r from-[#e6b325] to-[#1a365d] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                             <div className="relative">
                                <AccountCardDisplay account={account} isBalanceHidden={false} />
                             </div>
                        </div>
                    </div>
                ))}
                {/* Add New Card Placeholder */}
                <button className="w-[85vw] md:w-[100px] flex-shrink-0 rounded-xl border-2 border-dashed border-gray-400/30 hover:border-[#e6b325]/50 flex flex-col items-center justify-center text-gray-400 hover:text-[#e6b325] transition-all group">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#e6b325]/10 mb-2">
                         <i className="fas fa-plus text-xl"></i>
                    </div>
                    <span className="text-sm font-semibold">Add Card</span>
                </button>
            </div>
        </div>
    );
};

export default PremiumCardsCarousel;