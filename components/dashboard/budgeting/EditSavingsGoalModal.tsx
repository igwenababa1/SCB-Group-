
import React, { useState, useEffect } from 'react';
// FIX: Corrected import path
import type { SavingsGoal } from '../../../types';

interface EditSavingsGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    goal: SavingsGoal | null;
    onSave: (goal: SavingsGoal) => void;
}

const EditSavingsGoalModal: React.FC<EditSavingsGoalModalProps> = ({ isOpen, onClose, goal, onSave }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');

    useEffect(() => {
        if (goal) {
            setName(goal.name);
            setTargetAmount(goal.targetAmount.toString());
            setCurrentAmount(goal.currentAmount.toString());
        } else {
            setName('');
            setTargetAmount('');
            setCurrentAmount('0');
        }
    }, [goal, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: goal?.id || '',
            name,
            targetAmount: parseFloat(targetAmount) || 0,
            currentAmount: parseFloat(currentAmount) || 0,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#1a365d]">{goal ? 'Edit' : 'Create'} Savings Goal</h2>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                             <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Goal Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#e6b325] focus:border-[#e6b325]" required />
                        </div>
                        <div>
                            <label htmlFor="target" className="block text-sm font-medium text-gray-700">Target Amount</label>
                            <input type="number" id="target" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#e6b325] focus:border-[#e6b325]" required />
                        </div>
                         <div>
                            <label htmlFor="current" className="block text-sm font-medium text-gray-700">Current Amount</label>
                            <input type="number" id="current" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#e6b325] focus:border-[#e6b325]" required />
                        </div>
                    </div>

                     <div className="mt-8 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-100">Cancel</button>
                        <button type="submit" className="px-6 py-2 rounded-md bg-[#e6b325] text-[#1a365d] font-semibold hover:bg-[#d19d1f]">Save Goal</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSavingsGoalModal;
