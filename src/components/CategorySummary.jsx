import React, { useMemo } from 'react';
import { useMoney } from '../context/MoneyContext';
import { PieChart } from 'lucide-react';

const CategorySummary = ({ transactions }) => {
    // const { transactions } = useMoney(); // Removed internal context call

    const categoryData = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense');
        const summary = {};
        let totalExpense = 0;

        expenses.forEach(t => {
            const amount = Number(t.amount);
            summary[t.category] = (summary[t.category] || 0) + amount;
            totalExpense += amount;
        });

        return Object.entries(summary)
            .map(([category, amount]) => ({
                category,
                amount,
                percentage: totalExpense ? Math.round((amount / totalExpense) * 100) : 0
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [transactions]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
            <div className="flex items-center space-x-2 mb-6">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <PieChart size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Category Expenses</h3>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {categoryData.length === 0 ? (
                    <p className="text-gray-500 text-sm">No expenses recorded yet.</p>
                ) : (
                    categoryData.map((item) => (
                        <div key={item.category}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-gray-700">{item.category}</span>
                                <span className="text-sm font-bold text-gray-900">₹{item.amount.toLocaleString()} ({item.percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${item.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CategorySummary;
