import React, { useState, useEffect, useMemo } from 'react';
import { useMoney } from '../context/MoneyContext';
import * as api from '../services/api';
import { format, addMonths, subMonths, isSameMonth, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Receipt, AlertCircle, Edit2, Trash2, X, Check } from 'lucide-react';

const CATEGORIES = ['Fuel', 'Food', 'Movie', 'Loan', 'Medical', 'Others'];
const DIVISIONS = ['Office', 'Personal'];

const BudgetPlanner = () => {
    const { transactions } = useMoney();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [budgets, setBudgets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [formData, setFormData] = useState({
        category: CATEGORIES[0],
        division: 'Personal',
        budgetAmount: ''
    });

    const currentMonthStr = format(currentMonth, 'yyyy-MM');

    // Fetch Budgets
    const loadBudgets = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.fetchBudgets(currentMonthStr);
            setBudgets(data);
        } catch (error) {
            console.error("Failed to load budgets", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadBudgets();
    }, [currentMonthStr]);

    // Calculate Spending
    const spendingMap = useMemo(() => {
        const map = {};
        transactions.forEach(t => {
            const d = new Date(t.date);
            if (isSameMonth(d, currentMonth) && t.type === 'expense') {
                const key = `${t.category}-${t.division || 'Personal'}`;
                map[key] = (map[key] || 0) + Number(t.amount);
            }
        });
        return map;
    }, [transactions, currentMonth]);

    // Modal Handlers
    const openAddModal = () => {
        setEditingBudget(null);
        setFormData({ category: CATEGORIES[0], division: 'Personal', budgetAmount: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (budget) => {
        setEditingBudget(budget);
        setFormData({
            category: budget.category,
            division: budget.division,
            budgetAmount: budget.budgetAmount
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                month: currentMonthStr,
                category: formData.category,
                division: formData.division,
                budgetAmount: Number(formData.budgetAmount)
            };

            if (editingBudget) {
                await api.updateBudget(editingBudget._id, payload);
            } else {
                await api.createBudget(payload);
            }
            setIsModalOpen(false);
            loadBudgets();
        } catch (error) {
            alert("Error saving budget");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this budget?")) return;
        try {
            await api.deleteBudget(id);
            loadBudgets();
        } catch (error) {
            alert("Error deleting budget");
        }
    };

    // Navigation
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#222222] tracking-tight">Budget Planner</h1>
                    <p className="text-[#222222]/60 text-sm">Manage monthly spending limits</p>
                </div>

                <div className="flex items-center space-x-6 bg-white p-2 rounded-xl border border-[#F5E7C6] shadow-sm">
                    <button onClick={prevMonth} className="p-2 hover:bg-[#F5E7C6] rounded-lg transition-colors text-[#FA8112]">
                        <ChevronLeft size={24} />
                    </button>
                    <span className="text-lg font-bold text-[#222222] min-w-[140px] text-center">
                        {format(currentMonth, 'MMMM yyyy')}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-[#F5E7C6] rounded-lg transition-colors text-[#FA8112]">
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Create Button */}
            <button
                onClick={openAddModal}
                className="flex items-center space-x-2 bg-[#FA8112] hover:bg-[#e0720f] text-[#FAF3E1] font-medium py-3 px-5 rounded-xl transition-all duration-200 shadow-md active:scale-95"
            >
                <Plus size={20} />
                <span>Create Budget</span>
            </button>

            {/* Budget Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                    <p>Loading budgets...</p>
                ) : budgets.length === 0 ? (
                    <div className="col-span-full text-center py-10 bg-white/50 rounded-2xl border border-dashed border-gray-300">
                        <Receipt size={48} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500">No budgets set for this month</p>
                    </div>
                ) : (
                    budgets.map(b => {
                        const spent = spendingMap[`${b.category}-${b.division}`] || 0;
                        const total = b.budgetAmount;
                        const percent = Math.min((spent / total) * 100, 100);
                        const isExceeded = spent > total;

                        // Color Logic
                        let progressColor = 'bg-green-500';
                        if (percent > 90) progressColor = 'bg-red-500';
                        else if (percent > 70) progressColor = 'bg-yellow-500';

                        return (
                            <div key={b._id} className="bg-white p-6 rounded-2xl shadow-sm border border-[#F5E7C6] relative group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg text-gray-800">{b.category}</h3>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">{b.division}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Spent <span className={`font-semibold ${isExceeded ? 'text-red-600' : 'text-gray-900'}`}>₹{spent.toLocaleString()}</span> of ₹{total.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(b)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(b._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                    </div>
                                </div>

                                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${progressColor} transition-all duration-500`}
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>

                                {isExceeded ? (
                                    <div className="mt-3 flex items-center gap-2 text-red-600 text-sm font-medium">
                                        <AlertCircle size={16} />
                                        <span>Exceeded by ₹{(spent - total).toLocaleString()}</span>
                                    </div>
                                ) : (
                                    <div className="mt-3 flex items-center gap-2 text-green-600 text-sm font-medium">
                                        <Check size={16} />
                                        <span>₹{(total - spent).toLocaleString()} remaining</span>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingBudget ? 'Edit Budget' : 'New Budget'}</h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 ring-orange-200"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                                <select
                                    className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 ring-orange-200"
                                    value={formData.division}
                                    onChange={e => setFormData({ ...formData, division: e.target.value })}
                                >
                                    {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        className="w-full border rounded-lg p-2.5 pl-8 outline-none focus:ring-2 ring-orange-200"
                                        value={formData.budgetAmount}
                                        onChange={e => setFormData({ ...formData, budgetAmount: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-[#FA8112] text-white py-3 rounded-xl font-medium mt-2">Save Budget</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BudgetPlanner;
