
import React from 'react';
// FIX: Corrected import path
import type { BudgetCategory } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';

interface BudgetCategoryItemProps {
    category: BudgetCategory;
    onEdit: () => void;
}

const BudgetCategoryItem: React.FC<BudgetCategoryItemProps> = ({ category, onEdit }) => {
    const progress = (category.spent / category.allocated) * 100;
    const isOverBudget = progress > 100;
    const remaining = category.allocated - category.spent;
    
    return (
        <div className="border-b last:border-0 py-3">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
                        <i className={`fas ${category.icon} text-gray-500`}></i>
                    </div>
                    <span className="font-semibold text-gray-800">{category.name}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`font-semibold ${isOverBudget ? 'text-red-500' : 'text-gray-700'}`}>
                        {formatCurrency(category.spent)}
                    </span>
                    <span className="text-sm text-gray-500">/ {formatCurrency(category.allocated)}</span>
                    <button onClick={onEdit} className="text-xs font-semibold text-[#1a365d] hover:underline">Edit</button>
                </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className={`${isOverBudget ? 'bg-red-500' : category.color} h-2 rounded-full`} 
                    style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
            </div>
            <p className={`text-xs mt-1 text-right ${remaining < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                {remaining >= 0 ? `${formatCurrency(remaining)} left` : `${formatCurrency(Math.abs(remaining))} over`}
            </p>
        </div>
    );
};

export default BudgetCategoryItem;
