import React from 'react';
import { format } from 'date-fns';
import { ArrowDownLeft, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';

const AnalyticsDetails = ({ incomeTransactions = [], expenseTransactions = [], activeTab }) => {

    // Calculate Income Totals
    const totalIncome = incomeTransactions.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const incomeCount = incomeTransactions.length;

    // Helper to format date based on tab
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        if (activeTab === 'Yearly') return format(date, 'MMM d, yyyy');
        return format(date, 'EEE, MMM d');
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-[#222222]">Detailed Breakdown ({activeTab})</h3>

            {/* Income Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#F5E7C6] overflow-hidden">
                <div className="p-4 bg-green-50 border-b border-green-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-green-700">
                        <TrendingUp size={20} />
                        <h4 className="font-bold">Income Summary</h4>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-green-600 font-medium">Count: {incomeCount}</p>
                        <p className="text-lg font-bold text-green-800">₹{totalIncome.toLocaleString()}</p>
                    </div>
                </div>

                {incomeTransactions.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Account</th>
                                    <th className="px-4 py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {incomeTransactions.map(t => (
                                    <tr key={t._id} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{formatDate(t.date)}</td>
                                        <td className="px-4 py-3 text-gray-600">
                                            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                                {t.account || t.accountId}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-green-600 font-bold">+₹{Number(t.amount).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-400 text-sm">No income records for this period</div>
                )}
            </div>

            {/* Expense Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#F5E7C6] overflow-hidden">
                <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-2 text-red-700">
                    <TrendingDown size={20} />
                    <h4 className="font-bold">Expense List</h4>
                </div>

                {expenseTransactions.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Category</th>
                                    <th className="px-4 py-2">Account</th>
                                    <th className="px-4 py-2">Division</th>
                                    <th className="px-4 py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {expenseTransactions.map(t => (
                                    <tr key={t._id} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{formatDate(t.date)}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 text-xs">{t.account || t.accountId}</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">{t.division}</td>
                                        <td className="px-4 py-3 text-right text-red-600 font-bold">-₹{Number(t.amount).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-400 text-sm">No expenses for this period</div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsDetails;
