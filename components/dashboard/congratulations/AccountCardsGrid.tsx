import React from 'react';
import { ACCOUNTS } from '../../../constants';
import AccountCardDisplay from './AccountCardDisplay';

interface AccountCardsGridProps {
    isBalanceHidden: boolean;
}

const AccountCardsGrid: React.FC<AccountCardsGridProps> = ({ isBalanceHidden }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ACCOUNTS.map(account => (
                <AccountCardDisplay 
                    key={account.id}
                    account={account}
                    isBalanceHidden={isBalanceHidden}
                />
            ))}
        </div>
    );
};

export default AccountCardsGrid;
