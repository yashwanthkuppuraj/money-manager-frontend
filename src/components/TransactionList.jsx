import React, { useState, useMemo } from 'react';
import { useMoney } from '../context/MoneyContext';
import { Edit2, Ban, Trash2 } from 'lucide-react';
import { format, differenceInHours, parseISO } from 'date-fns';

const ResultTimeLimit = 12; // Hours

const TransactionList = ({ transactions, updateTransaction, deleteTransaction, onEdit }) => {
    // const { transactions, updateTransaction } = useMoney(); // Removed internal context call

    const [filters, setFilters] = useState({
        category: '',
        division: '',
        dateFrom: '',
        dateTo: ''
    });

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            // Category Filter
            if (filters.category && t.category !== filters.category) return false;
            // Division Filter
            if (filters.division && t.division !== filters.division) return false;
            // Date Range Filter
            if (filters.dateFrom && new Date(t.date) < new Date(filters.dateFrom)) return false;
            if (filters.dateTo) {
                // End of day logic could be applied, but sticking to simple compare for now or end of selected day
                const d = new Date(filters.dateTo);
                d.setHours(23, 59, 59);
                if (new Date(t.date) > d) return false;
            }
            return true;
        }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
    }, [transactions, filters]);

    // Use a stable reference time for the render to avoid purity errors
    const [now, setNow] = useState(null);
    React.useEffect(() => {
        setNow(Date.now());
    }, []);

    const canEdit = (createdAt) => {
        if (!now) return false;
        const hoursDiff = differenceInHours(now, createdAt);
        return hoursDiff <= ResultTimeLimit;
    };

    const handleEdit = (t) => {
        if (!canEdit(t.createdAt)) {
            // This case is already handled by UI (disabled button), but good as a safety check
            return;
        }
        if (onEdit) {
            onEdit(t);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction History</h3>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <select
                        className="p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                        value={filters.category}
                        onChange={e => setFilters({ ...filters, category: e.target.value })}
                    >
                        <option value="">All Categories</option>
                        {['Fuel', 'Food', 'Movie', 'Loan', 'Medical', 'Others'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select
                        className="p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                        value={filters.division}
                        onChange={e => setFilters({ ...filters, division: e.target.value })}
                    >
                        <option value="">All Divisions</option>
                        <option value="Office">Office</option>
                        <option value="Personal">Personal</option>
                    </select>

                    <input
                        type={filters.dateFrom ? 'date' : 'text'}
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => !e.target.value && (e.target.type = 'text')}
                        className="p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                        value={filters.dateFrom}
                        onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
                        placeholder="Start Date"
                    />

                    <input
                        type={filters.dateTo ? 'date' : 'text'}
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => !e.target.value && (e.target.type = 'text')}
                        className="p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                        value={filters.dateTo}
                        onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
                        placeholder="End Date"
                    />
                </div>
            </div>

            <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse relative">
                    <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <th className="p-4 font-medium">Type</th>
                            <th className="p-4 font-medium">Amount</th>
                            <th className="p-4 font-medium">Category</th>
                            <th className="p-4 font-medium">Division</th>
                            <th className="p-4 font-medium">Date & Time</th>
                            <th className="p-4 font-medium">Description</th>
                            <th className="p-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="p-8 text-center text-gray-500">No transactions found</td>
                            </tr>
                        ) : (
                            filteredTransactions.map(t => {
                                const editable = canEdit(t.createdAt);
                                return (
                                    <tr key={t._id || t.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.type === 'income' ? 'bg-green-100 text-green-800' :
                                                t.type === 'expense' ? 'bg-red-100 text-red-800' :
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                {t.type === 'income' ? 'Income' : t.type === 'expense' ? 'Expense' : 'Transfer'}
                                            </span>
                                        </td>
                                        <td className={`p-4 font-medium ${t.type === 'income' ? 'text-green-600' :
                                            t.type === 'expense' ? 'text-red-600' :
                                                'text-gray-900'
                                            }`}>
                                            ₹{t.amount.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {t.type === 'transfer' ? '-' : t.category}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {t.type === 'transfer' ? (
                                                <span className="flex items-center gap-1 text-xs">
                                                    {t.fromAccount} &rarr; {t.toAccount}
                                                </span>
                                            ) : (
                                                t.account || t.division
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-500">{format(parseISO(t.date), 'MMM d, yyyy h:mm a')}</td>
                                        <td className="p-4 text-gray-900 font-medium">{t.description}</td>
                                        <td className="p-4">
                                            {editable ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(t)}
                                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors flex items-center gap-1 group"
                                                        title="Edit Transaction"
                                                    >
                                                        <Edit2 size={16} />
                                                        <span className="text-xs group-hover:underline">Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm("Are you sure you want to delete this transaction?")) {
                                                                deleteTransaction(t._id || t.id);
                                                            }
                                                        }}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1 group"
                                                        title="Delete Transaction"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-gray-400 gap-1 cursor-not-allowed" title="Edit window expired (>12 hr)">
                                                    <Ban size={16} />
                                                    <span className="text-xs">Expired</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionList;
