
import React, { useState } from 'react';
// FIX: Corrected import path
import { MONTHLY_SUMMARY, BUDGET_CATEGORIES, SAVINGS_GOALS } from '../../constants';
// FIX: Corrected import path
import type { BudgetCategory, SavingsGoal } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import IncomeVsExpenseChart from '../../components/dashboard/budgeting/IncomeVsExpenseChart';
import BudgetCategoryItem from '../../components/dashboard/budgeting/BudgetCategoryItem';
import EditBudgetModal from '../../components/dashboard/budgeting/EditBudgetModal';
import EditSavingsGoalModal from '../../components/dashboard/budgeting/EditSavingsGoalModal';
import EditIncomeModal from '../../components/dashboard/budgeting/EditIncomeModal';

const StatCard: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-slate-700">
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-3xl font-bold mt-1 ${color}`}>{formatCurrency(value)}</p>
    </div>
);

const SavingsGoalItem: React.FC<{ goal: SavingsGoal, onEdit: () => void }> = ({ goal, onEdit }) => {
    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    const isCompleted = progress >= 100;
    const isClose = progress >= 75;
    const remaining = goal.targetAmount - goal.currentAmount;
    
    return (
        <div className="relative overflow-hidden bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 group transition-all hover:shadow-xl hover:-translate-y-1">
            {/* Background decorative glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/10"></div>

            <div className="relative z-10 flex justify-between items-start mb-5">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-110 ${
                        isCompleted 
                            ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-green-500/30' 
                            : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 text-[#1a365d] dark:text-blue-300'
                    }`}>
                        <i className={`fas ${isCompleted ? 'fa-trophy' : 'fa-bullseye'} text-xl`}></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">{goal.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                isCompleted 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' 
                                    : isClose 
                                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' 
                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                            }`}>
                                {isCompleted ? 'Completed' : isClose ? 'Near Goal' : 'In Progress'}
                            </span>
                        </div>
                    </div>
                </div>
                <button onClick={onEdit} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                    <i className="fas fa-ellipsis-v text-sm"></i>
                </button>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex justify-between items-baseline">
                    <p className="text-3xl font-bold text-[#1a365d] dark:text-white">
                        {formatCurrency(goal.currentAmount)}
                    </p>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        <span className="text-xs uppercase mr-1">Target:</span>
                        {formatCurrency(goal.targetAmount)}
                    </p>
                </div>
                
                {/* Advanced Progress Bar */}
                <div className="relative h-4 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                    {/* Background stripes */}
                    <div className="absolute inset-0 opacity-30 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]"></div>
                    
                    {/* Fill */}
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out relative shadow-lg ${
                            isCompleted 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
                                : 'bg-gradient-to-r from-[#1a365d] via-blue-600 to-blue-400'
                        }`}
                        style={{ width: `${progress}%` }}
                    >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"></div>
                        {/* Animated shimmer */}
                        <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-slate-700/50">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {remaining <= 0 ? (
                        <span className="text-green-500 flex items-center gap-1">
                            <i className="fas fa-check-circle"></i> Target Reached
                        </span>
                    ) : (
                        <span><span className="text-gray-800 dark:text-gray-200 font-bold">{formatCurrency(remaining)}</span> remaining</span>
                    )}
                </div>
                <div className="text-sm font-bold text-right">
                    <span className={`${isCompleted ? 'text-green-500' : 'text-blue-600 dark:text-blue-400'}`}>{progress.toFixed(0)}%</span>
                </div>
            </div>
            
            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

const BudgetingView: React.FC = () => {
    const [monthlySummary, setMonthlySummary] = useState(MONTHLY_SUMMARY);
    const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(BUDGET_CATEGORIES);
    const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(SAVINGS_GOALS);

    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<BudgetCategory | null>(null);
    const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
    const [editingSavingsGoal, setEditingSavingsGoal] = useState<SavingsGoal | null>(null);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

    const handleOpenBudgetModal = (category: BudgetCategory) => {
        setEditingBudget(category);
        setIsBudgetModalOpen(true);
    };

    const handleSaveBudget = (updatedCategory: BudgetCategory) => {
        setBudgetCategories(cats => cats.map(c => c.id === updatedCategory.id ? updatedCategory : c));
        setIsBudgetModalOpen(false);
    };

    const handleOpenSavingsModal = (goal: SavingsGoal | null) => {
        setEditingSavingsGoal(goal);
        setIsSavingsModalOpen(true);
    };

    const handleSaveSavingsGoal = (goal: SavingsGoal) => {
        if (editingSavingsGoal) {
            setSavingsGoals(goals => goals.map(g => g.id === goal.id ? goal : g));
        } else {
            setSavingsGoals(goals => [...goals, { ...goal, id: `sg-${Date.now()}` }]);
        }
        setIsSavingsModalOpen(false);
    };
    
    const handleSaveIncome = (newIncome: number) => {
        setMonthlySummary(prev => ({ ...prev, income: newIncome }));
        setIsIncomeModalOpen(false);
    }

    return (
        <div className="p-8 space-y-8 min-h-screen bg-gray-50 dark:bg-slate-900">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                 <div>
                    <h1 className="text-3xl font-bold text-[#1a365d] dark:text-white">Budget & Savings</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track your cash flow and build your wealth.</p>
                </div>
                 <button onClick={() => setIsIncomeModalOpen(true)} className="mt-4 md:mt-0 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm transition-colors">
                    <i className="fas fa-pen mr-2"></i> Edit Monthly Income
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Monthly Income" value={monthlySummary.income} color="text-green-600 dark:text-green-400" />
                <StatCard label="Expenses this Month" value={monthlySummary.expenses} color="text-red-500 dark:text-red-400" />
                <StatCard label="Saved this Month" value={monthlySummary.savings} color="text-[#1a365d] dark:text-blue-400" />
            </div>

            <IncomeVsExpenseChart />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Budget Categories */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl text-[#1a365d] dark:text-white flex items-center gap-2">
                            <i className="fas fa-chart-pie text-yellow-500"></i> Budget Categories
                        </h3>
                    </div>
                    <div className="space-y-1">
                        {budgetCategories.map(cat => (
                            <BudgetCategoryItem key={cat.id} category={cat} onEdit={() => handleOpenBudgetModal(cat)} />
                        ))}
                    </div>
                </div>

                {/* Savings Goals */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl text-[#1a365d] dark:text-white flex items-center gap-2">
                             <i className="fas fa-bullseye text-red-500"></i> Savings Goals
                        </h3>
                        <button onClick={() => handleOpenSavingsModal(null)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#1a365d] hover:text-white dark:hover:bg-blue-500 transition-colors">
                            <i className="fas fa-plus"></i>
                        </button>
                    </div>
                    <div className="space-y-4 flex-grow">
                        {savingsGoals.length > 0 ? (
                            savingsGoals.map(goal => (
                                <SavingsGoalItem key={goal.id} goal={goal} onEdit={() => handleOpenSavingsModal(goal)} />
                            ))
                        ) : (
                             <div className="text-center py-10 text-gray-400">
                                <i className="fas fa-piggy-bank text-4xl mb-3 opacity-50"></i>
                                <p>No savings goals yet.</p>
                                <button onClick={() => handleOpenSavingsModal(null)} className="mt-2 text-sm text-blue-500 hover:underline">Create one now</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isBudgetModalOpen && editingBudget && (
                <EditBudgetModal
                    isOpen={isBudgetModalOpen}
                    onClose={() => setIsBudgetModalOpen(false)}
                    category={editingBudget}
                    onSave={handleSaveBudget}
                />
            )}

            {isSavingsModalOpen && (
                <EditSavingsGoalModal
                    isOpen={isSavingsModalOpen}
                    onClose={() => setIsSavingsModalOpen(false)}
                    goal={editingSavingsGoal}
                    onSave={handleSaveSavingsGoal}
                />
            )}
            
            {isIncomeModalOpen && (
                <EditIncomeModal
                    isOpen={isIncomeModalOpen}
                    onClose={() => setIsIncomeModalOpen(false)}
                    currentIncome={monthlySummary.income}
                    onSave={handleSaveIncome}
                />
            )}
        </div>
    );
};

export default BudgetingView;
