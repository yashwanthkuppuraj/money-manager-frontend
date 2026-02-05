import React, { useState, useMemo } from 'react';
import { useMoney } from '../context/MoneyContext';
import { useAuth } from '../context/AuthContext';
import {
    startOfWeek, endOfWeek, startOfYear, endOfYear, startOfMonth, endOfMonth,
    eachDayOfInterval, eachMonthOfInterval,
    format, isSameDay, isSameMonth, subMonths
} from 'date-fns';
import { BarChart3, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

import AnalyticsDetails from './AnalyticsDetails';

const Analytics = () => {
    const { transactions } = useMoney();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Weekly');

    // Determine week start index (Sunday=0, Monday=1)
    const weekStartIndex = user?.settings?.weekStartDay === 'Sunday' ? 0 : 1;

    const data = useMemo(() => {
        const now = new Date();
        let stats = {
            income: 0,
            expense: 0,
            balance: 0,
            breakdown: [],
            topCategories: [],
            incomeList: [], // Added
            expenseList: [] // Added
        };

        const processStats = (filteredTrans) => {
            filteredTrans.forEach(t => {
                const amount = Number(t.amount);
                if (t.type === 'income') {
                    stats.income += amount;
                    stats.incomeList.push(t);
                }
                else if (t.type === 'expense') {
                    stats.expense += amount;
                    stats.expenseList.push(t);
                }
                // Exclude transfers
            });
            stats.balance = stats.income - stats.expense;

            // Sort lists by date desc
            stats.incomeList.sort((a, b) => new Date(b.date) - new Date(a.date));
            stats.expenseList.sort((a, b) => new Date(b.date) - new Date(a.date));
        };

        if (activeTab === 'Weekly') {
            // Sun - Sat or Mon - Sun based on setting
            const start = startOfWeek(now, { weekStartsOn: weekStartIndex });
            const end = endOfWeek(now, { weekStartsOn: weekStartIndex });
            const days = eachDayOfInterval({ start, end });

            // Strict weekly filter
            const strictWeeklyTrans = transactions.filter(t => new Date(t.date) >= start && new Date(t.date) <= end);

            processStats(strictWeeklyTrans);

            // Group by Day (Sun-Sat)
            stats.breakdown = days.map(day => {
                const dayExpense = strictWeeklyTrans
                    .filter(t => t.type === 'expense' && isSameDay(new Date(t.date), day))
                    .reduce((acc, curr) => acc + Number(curr.amount), 0);
                return { label: format(day, 'EEE'), value: dayExpense };
            });

        } else if (activeTab === 'Monthly') {
            const start = startOfMonth(now);
            const end = endOfMonth(now);
            const days = eachDayOfInterval({ start, end });

            const monthlyTrans = transactions.filter(t => isSameMonth(new Date(t.date), now));
            processStats(monthlyTrans);

            stats.breakdown = days.map(day => {
                const dayExpense = monthlyTrans
                    .filter(t => t.type === 'expense' && isSameDay(new Date(t.date), day))
                    .reduce((acc, curr) => acc + Number(curr.amount), 0);
                return { label: format(day, 'd'), value: dayExpense };
            });

        } else if (activeTab === 'Yearly') {
            const start = startOfYear(now);
            const end = endOfYear(now);
            const months = eachMonthOfInterval({ start, end });

            const yearlyTrans = transactions.filter(t => new Date(t.date) >= start && new Date(t.date) <= end);
            processStats(yearlyTrans);

            stats.breakdown = months.map(month => {
                const monthlyExpense = yearlyTrans
                    .filter(t => t.type === 'expense' && isSameMonth(new Date(t.date), month))
                    .reduce((acc, curr) => acc + Number(curr.amount), 0);
                return { label: format(month, 'MMM'), value: monthlyExpense };
            });
        }

        return stats;
    }, [activeTab, transactions]);

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-[#222222]">Analytics</h1>
                <div className="flex bg-[#F5E7C6] p-1 rounded-xl">
                    {['Weekly', 'Monthly', 'Yearly'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-[#FA8112] text-[#FAF3E1] shadow-md' : 'text-[#222222] hover:bg-[#FAF3E1]/50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#F5E7C6]">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg"><TrendingUp size={20} /></div>
                        <p className="text-sm font-medium text-gray-500">{activeTab} Income</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">₹{data.income.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#F5E7C6]">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg"><TrendingDown size={20} /></div>
                        <p className="text-sm font-medium text-gray-500">{activeTab} Expense</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">₹{data.expense.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#F5E7C6]">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><DollarSign size={20} /></div>
                        <p className="text-sm font-medium text-gray-500">{activeTab} Balance</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">₹{data.balance.toLocaleString()}</h3>
                </div>
            </div>

            {/* Chart Section (Custom Bar Chart) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#F5E7C6]">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <BarChart3 size={20} className="text-[#FA8112]" />
                    {activeTab} Breakdown
                </h3>
                <div className="h-64 flex items-end space-x-2 sm:space-x-4">
                    {data.breakdown.map((item, index) => {
                        const maxVal = Math.max(...data.breakdown.map(i => i.value), 1); // Only exclude income per requirements
                        const heightPercent = Math.max(Math.round((item.value / maxVal) * 100), 5); // Min 5% height
                        const totalExpense = data.expense || 1;
                        const percentage = ((item.value / totalExpense) * 100).toFixed(1);

                        return (
                            <div key={index} className="flex-1 flex flex-col items-center group relative h-full">
                                <div className="w-full bg-[#FAF3E1] rounded-t-lg relative flex items-end justify-center overflow-hidden h-full">
                                    {/* Bar */}
                                    <div
                                        className="w-full mx-1 bg-[#FA8112]/80 hover:bg-[#FA8112] transition-all duration-500 rounded-t-sm"
                                        style={{ height: `${heightPercent}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-500 mt-2 font-medium">{item.label}</span>
                                <div className="absolute -top-12 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 text-center">
                                    <div>₹{item.value.toLocaleString()}</div>
                                    <div className="text-[10px] text-gray-300">({percentage}%)</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detailed Transaction Lists */}
            <AnalyticsDetails
                incomeTransactions={data.incomeList}
                expenseTransactions={data.expenseList}
                activeTab={activeTab}
            />
        </div>
    );
};

export default Analytics;
