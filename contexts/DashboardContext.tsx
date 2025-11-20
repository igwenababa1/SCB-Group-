import React, { createContext, useState, useCallback, useContext } from 'react';
import type { Receipt, ViewType } from '../types';
import { RECEIPTS as INITIAL_RECEIPTS } from '../constants';

interface DashboardContextType {
    receipts: Receipt[];
    newReceiptId: string | null;
    addReceiptAndNavigate: (receipt: Omit<Receipt, 'id'>, navigate: (view: ViewType) => void, targetView?: ViewType) => void;
    clearNewReceipt: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [receipts, setReceipts] = useState<Receipt[]>(INITIAL_RECEIPTS);
    const [newReceiptId, setNewReceiptId] = useState<string | null>(null);

    const addReceiptAndNavigate = useCallback((receiptData: Omit<Receipt, 'id'>, navigate: (view: ViewType) => void, targetView: ViewType = 'receipts') => {
        const newReceipt: Receipt = {
            ...receiptData,
            id: `rcpt-${Date.now()}`,
        };
        setReceipts(prev => [newReceipt, ...prev]);
        setNewReceiptId(newReceipt.id);
        navigate(targetView);
    }, []);
    
    const clearNewReceipt = useCallback(() => {
        setNewReceiptId(null);
    }, []);

    return (
        <DashboardContext.Provider value={{ receipts, newReceiptId, addReceiptAndNavigate, clearNewReceipt }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = (): DashboardContextType => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardContextProvider');
    }
    return context;
};