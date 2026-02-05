import React, { useState, useEffect } from 'react';
import { useMoney } from '../context/MoneyContext';
import { useAuth } from '../context/AuthContext';
import { X, ArrowRightLeft } from 'lucide-react';

const CATEGORIES = ['Fuel', 'Food', 'Movie', 'Loan', 'Medical', 'Others'];
const DIVISIONS = ['Office', 'Personal'];

const AddTransactionModal = ({ isOpen, onClose, defaultDate, transactionToEdit }) => {
    const { addTransaction, updateTransaction, ACCOUNTS } = useMoney();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState(user?.settings?.defaultTransactionType || 'expense');

    const [formData, setFormData] = useState({
        amount: '',
        date: '',
        description: '',
        category: '',
        division: 'Personal',
        accountId: 'Cash',
        fromAccount: 'Bank',
        toAccount: 'Cash'
    });

    useEffect(() => {
        if (transactionToEdit) {
            // Edit Mode: Pre-fill data
            setActiveTab(transactionToEdit.type);
            const d = new Date(transactionToEdit.date);
            const localIso = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

            setFormData({
                amount: transactionToEdit.amount,
                date: localIso,
                description: transactionToEdit.description,
                category: transactionToEdit.category || '',
                division: transactionToEdit.division || 'Personal',
                accountId: transactionToEdit.account || 'Cash',
                fromAccount: transactionToEdit.fromAccount || 'Bank',
                toAccount: transactionToEdit.toAccount || 'Cash'
            });
        } else if (defaultDate) {
            // Add Mode with default date
            const d = new Date(defaultDate);
            const localIso = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
            setFormData(prev => ({ ...prev, date: localIso }));
            // Reset other fields on open if not editing
            setFormData(prev => ({
                ...prev,
                amount: '',
                description: '',
                category: ''
            }));
            // Apply default setting when opening fresh
            if (user?.settings?.defaultTransactionType) {
                setActiveTab(user.settings.defaultTransactionType);
            }
        }
    }, [defaultDate, isOpen, transactionToEdit]);

    useEffect(() => {
        // Reset category if switching to transfer
        if (transactionToEdit) return; // Don't reset if editing and just opened

        if (activeTab === 'transfer') {
            setFormData(prev => ({
                ...prev,
                category: 'Transfer',
                description: prev.description === '' ? 'Transfer' : prev.description
            }));
        } else {
            // Only reset if empty to avoid wiping user input when switching tabs during creation
            if (formData.category === 'Transfer') {
                setFormData(prev => ({ ...prev, category: '', description: '' }));
            }
        }
    }, [activeTab]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.date) return;

        // Validation for Transfer
        // Allow Bank -> Bank, but block other same-account transfers
        const isBankToBank = formData.fromAccount === 'Bank' && formData.toAccount === 'Bank';

        if (activeTab === 'transfer' && formData.fromAccount === formData.toAccount && !isBankToBank) {
            alert("From and To accounts cannot be the same (except for Bank Transfer)!");
            return;
        }

        // Description required for Bank -> Bank
        if (isBankToBank && !formData.description.trim()) {
            alert("Description is required for Bank-to-Bank transfers (e.g., 'To Ravi')");
            return;
        }

        // CONFIRMATION SETTING
        if (activeTab === 'transfer' && user?.settings?.confirmBeforeTransfer) {
            const confirmMsg = `Transfer ₹${formData.amount} from ${formData.fromAccount} to ${formData.toAccount}?`;
            if (!window.confirm(confirmMsg)) {
                return;
            }
        }

        const baseData = {
            amount: parseFloat(formData.amount),
            date: new Date(formData.date).toISOString(),
            description: formData.description,
            type: activeTab
        };

        let transactionData;

        if (activeTab === 'transfer') {
            transactionData = {
                ...baseData,
                fromAccount: formData.fromAccount,
                toAccount: formData.toAccount,
                category: 'Transfer',
                division: 'Personal'
            };
        } else {
            transactionData = {
                ...baseData,
                category: formData.category || 'Others',
                division: formData.division,
                account: formData.accountId // State is still called accountId locally, mapping to 'account'
            };
        }

        if (transactionToEdit) {
            updateTransaction(transactionToEdit._id || transactionToEdit.id, transactionData);
        } else {
            addTransaction(transactionData);
        }

        onClose();
    };

    const tabClass = (tab, colorClass) => `flex-1 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === tab ? colorClass : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
        }`;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">{transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex p-4 gap-2">
                    <button onClick={() => setActiveTab('income')} className={tabClass('income', 'bg-green-100 text-green-700 shadow-sm')}>
                        Income
                    </button>
                    <button onClick={() => setActiveTab('expense')} className={tabClass('expense', 'bg-red-100 text-red-700 shadow-sm')}>
                        Expense
                    </button>
                    <button onClick={() => setActiveTab('transfer')} className={tabClass('transfer', 'bg-blue-100 text-blue-700 shadow-sm')}>
                        <ArrowRightLeft size={14} /> Transfer
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full rounded-lg border-gray-300 border p-2.5 pl-8 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                        <input
                            type="datetime-local"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                        />
                    </div>

                    {/* Conditional Fields based on Type */}
                    {activeTab === 'transfer' ? (
                        <>
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">From</label>
                                    <select
                                        value={formData.fromAccount}
                                        onChange={(e) => setFormData({ ...formData, fromAccount: e.target.value })}
                                        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 outline-none bg-white font-medium"
                                    >
                                        {ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">To</label>
                                    <select
                                        value={formData.toAccount}
                                        onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
                                        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 outline-none bg-white font-medium"
                                    >
                                        {ACCOUNTS.map(a => (
                                            // If From is NOT Bank, hide the same account from To list (standard behavior)
                                            // If From IS Bank, show Bank (to allow Bank->Bank)
                                            (formData.fromAccount !== 'Bank' && a === formData.fromAccount) ? null : <option key={a} value={a}>{a}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {formData.fromAccount === 'Bank' && formData.toAccount === 'Bank' && (
                                <p className="text-xs text-blue-600 mt-2 font-medium">
                                    * External Bank Transfer: Amount will be deducted from Bank, but not credited to any internal account.
                                </p>
                            )}

                            {/* Description Field for Transfer */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 outline-none transition-shadow"
                                    placeholder="Transfer details (optional)"
                                />
                            </div>
                        </>
                    ) : (
                        // Income / Expense Fields
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
                                <select
                                    value={formData.accountId}
                                    onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 outline-none bg-white"
                                >
                                    {ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="" disabled>Select</option>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                                    <select
                                        value={formData.division}
                                        onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                                        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 outline-none transition-shadow"
                                    placeholder="Note (optional)"
                                />
                            </div>
                        </>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            className={`w-full py-3 px-4 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all active:scale-95 ${activeTab === 'income' ? 'bg-green-600 hover:bg-green-700' :
                                activeTab === 'expense' ? 'bg-red-600 hover:bg-red-700' :
                                    'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {transactionToEdit ? 'Update Transaction' : (activeTab === 'transfer' ? 'Transfer Funds' : `Add ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`)}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;
