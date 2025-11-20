import React from 'react';
import { useCurrency } from '../../contexts/GlobalSettingsContext';
import { CURRENCIES } from '../../i18n';

interface CurrencySelectorDropdownProps {
    onClose: () => void;
}

const CurrencySelectorDropdown: React.FC<CurrencySelectorDropdownProps> = ({ onClose }) => {
    const { currency, setCurrency } = useCurrency();
    
    return (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-lg shadow-lg border dark:border-slate-600 z-40">
            <div className="p-3 border-b dark:border-slate-600">
                <h3 className="font-bold text-gray-800 dark:text-white">Select Currency</h3>
            </div>
            <div>
                {CURRENCIES.map(c => (
                     <button 
                        key={c.code}
                        onClick={() => {
                            setCurrency(c);
                            onClose();
                        }}
                        className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-slate-600 flex items-center justify-between text-gray-700 dark:text-gray-200"
                    >
                        <span>{c.flag} {c.name} ({c.code})</span>
                        {currency.code === c.code && <i className="fas fa-check text-blue-600"></i>}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CurrencySelectorDropdown;