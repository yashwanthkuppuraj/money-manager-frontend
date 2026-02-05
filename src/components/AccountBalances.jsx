import React from 'react';
import { useMoney } from '../context/MoneyContext';
import { Wallet, Building2, Banknote } from 'lucide-react';

const AccountBalances = () => {
    const { ACCOUNTS, accountBalances } = useMoney();

    const getIcon = (acc) => {
        if (acc === 'Cash') return <Banknote size={32} />;
        if (acc === 'Bank') return <Building2 size={32} />;
        return <Wallet size={32} />;
    };

    const getColor = (acc) => {
        if (acc === 'Cash') return 'bg-green-100 text-green-600';
        if (acc === 'Bank') return 'bg-blue-100 text-blue-600';
        return 'bg-purple-100 text-purple-600';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {ACCOUNTS.map(account => (
                <div key={account} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${getColor(account)}`}>
                        {getIcon(account)}
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">{account}</p>
                        <h3 className="text-2xl font-bold text-gray-900">
                            ₹{(accountBalances[account] || 0).toLocaleString()}
                        </h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AccountBalances;
