import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

const SummaryCards = ({ income, expense, balance }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {/* Total Income */}
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex items-center space-x-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                    <ArrowUpCircle size={32} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Total Income</p>
                    <h3 className="text-2xl font-bold text-gray-900">₹{income.toLocaleString()}</h3>
                </div>
            </div>

            {/* Total Expense */}
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex items-center space-x-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-full">
                    <ArrowDownCircle size={32} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Total Expense</p>
                    <h3 className="text-2xl font-bold text-gray-900">₹{expense.toLocaleString()}</h3>
                </div>
            </div>

            {/* Total Balance */}
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex items-center space-x-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <Wallet size={32} />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Total Balance</p>
                    <h3 className="text-2xl font-bold text-gray-900">₹{balance.toLocaleString()}</h3>
                </div>
            </div>
        </div>
    );
};

export default SummaryCards;
