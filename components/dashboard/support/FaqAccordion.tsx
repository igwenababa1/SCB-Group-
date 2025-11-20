import React, { useState } from 'react';
import type { FaqItem } from '../../../types';

interface FaqAccordionProps {
    items: FaqItem[];
}

const AccordionItem: React.FC<{ item: FaqItem, isOpen: boolean, onClick: () => void }> = ({ item, isOpen, onClick }) => {
    return (
        <div className="border-b border-white/10">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center text-left py-4"
            >
                <span className="font-semibold">{item.question}</span>
                <i className={`fas fa-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div 
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <p className="text-gray-400 pb-4">
                        {item.answer}
                    </p>
                </div>
            </div>
        </div>
    );
};

const FaqAccordion: React.FC<FaqAccordionProps> = ({ items }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-2">
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    item={item}
                    isOpen={openIndex === index}
                    onClick={() => handleClick(index)}
                />
            ))}
        </div>
    );
};

export default FaqAccordion;