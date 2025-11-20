
import React, { useState } from 'react';

interface EditIncomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentIncome: number;
    onSave: (newIncome: number) => void;
}

const EditIncomeModal: React.FC<EditIncomeModalProps> = ({ isOpen, onClose, currentIncome, onSave }) => {
    const [income, setIncome] = useState(currentIncome.toString());

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(parseFloat(income) || 0);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-[#1a365d]">Edit Monthly Income</h2>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <p className="text-gray-600 mb-6">Update your total monthly income to improve budget accuracy.</p>
                    
                    <div>
                        <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-1">Monthly Income</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                            <input
                                id="income"
                                type="number"
                                value={income}
                                onChange={(e) => setIncome(e.target.value)}
                                placeholder="0.00"
                                className="w-full border-gray-300 rounded-md shadow-sm pl-7 focus:ring-[#e6b325] focus:border-[#e6b325]"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-100">Cancel</button>
                        <button type="submit" className="px-6 py-2 rounded-md bg-[#e6b325] text-[#1a365d] font-semibold hover:bg-[#d19d1f]">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditIncomeModal;
