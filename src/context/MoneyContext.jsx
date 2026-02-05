import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import * as api from '../services/api';
import { useAuth } from './AuthContext';

const MoneyContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useMoney = () => useContext(MoneyContext);

export const MoneyProvider = ({ children }) => {
    // Transaction structure: 
    // { id, type: 'income'|'expense'|'transfer', amount, date (ISO), description, category, division, accountId, fromAccountId, toAccountId, createdAt }

    // eslint-disable-next-line no-unused-vars
    const ACCOUNTS = ['Cash', 'Bank', 'Wallet'];
    const [transactions, setTransactions] = useState([]);
    const { user } = useAuth();

    // Fetch Transactions on Mount
    useEffect(() => {
        const loadTransactions = async () => {
            if (user) {
                // Logged In: Fetch from API
                try {
                    const { data } = await api.fetchTransactions();
                    setTransactions(data);
                } catch (error) {
                    console.error("Failed to fetch transactions", error);
                }
            } else {
                // Demo Mode: Mock Data (Hackathon)
                const today = new Date();
                const demoData = [
                    { _id: '1', type: 'income', amount: 50000, date: today.toISOString(), createdAt: today.toISOString(), description: 'Salary', category: 'Salary', account: 'Bank' },
                    { _id: '2', type: 'expense', amount: 1500, date: new Date(today.getTime() - 86400000).toISOString(), createdAt: new Date(today.getTime() - 86400000).toISOString(), description: 'Grocery Shopping', category: 'Food', account: 'Cash' },
                    { _id: '3', type: 'expense', amount: 2000, date: new Date(today.getTime() - 172800000).toISOString(), createdAt: new Date(today.getTime() - 172800000).toISOString(), description: 'Uber Ride', category: 'Travel', account: 'Wallet' },
                    { _id: '4', type: 'transfer', amount: 5000, date: new Date(today.getTime() - 200000000).toISOString(), createdAt: new Date(today.getTime() - 200000000).toISOString(), description: 'Savings', fromAccount: 'Bank', toAccount: 'Cash' },
                    { _id: '5', type: 'income', amount: 12000, date: new Date(today.getTime() - 10000000).toISOString(), createdAt: new Date(today.getTime() - 10000000).toISOString(), description: 'Freelance Project', category: 'Side Hustle', account: 'Bank' },
                ];
                setTransactions(demoData);
            }
        };
        loadTransactions();
    }, [user]);

    // Derived Account Balances (Strict Implementation)
    const accountBalances = useMemo(() => {
        const balances = {
            Cash: 0,
            Bank: 0,
            Wallet: 0
        };

        transactions.forEach(t => {
            const amt = Number(t.amount) || 0;
            const type = t.type;

            // Normalize fields (handle legacy data)
            let account = t.account || t.accountId;
            let fromAccount = t.fromAccount || t.fromAccountId;
            let toAccount = t.toAccount || t.toAccountId;

            // Helper to title case (e.g. "cash" -> "Cash")
            const toTitleCase = (str) => {
                if (!str) return null;
                return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            };

            account = toTitleCase(account);
            fromAccount = toTitleCase(fromAccount);
            toAccount = toTitleCase(toAccount);

            if (type === 'income') {
                if (balances[account] !== undefined) {
                    balances[account] += amt;
                }
            }

            if (type === 'expense') {
                if (balances[account] !== undefined) {
                    balances[account] -= amt;
                }
            }

            if (type === 'transfer') {
                // SPECIAL CASE: Bank -> Bank (External Transfer)
                if (fromAccount === 'Bank' && toAccount === 'Bank') {
                    if (balances['Bank'] !== undefined) balances['Bank'] -= amt;
                    // Do NOT credit 'toAccount' (it's external)
                }
                // Normal Transfer
                else {
                    if (balances[fromAccount] !== undefined) balances[fromAccount] -= amt;
                    if (balances[toAccount] !== undefined) balances[toAccount] += amt;
                }
            }
        });

        console.log("Calculated Balances:", balances);
        return balances;
    }, [transactions]);

    // CRUD Operations with Demo Mode Support
    const addTransaction = async (transaction) => {
        if (user) {
            // Authenticated: Use API
            try {
                const { data } = await api.createTransaction(transaction);
                setTransactions(prev => [data, ...prev]);
            } catch (error) {
                console.error("Failed to add transaction", error);
                alert("Error adding transaction");
            }
        } else {
            // Demo Mode: Local State
            const newTx = {
                ...transaction,
                _id: Date.now().toString(), // Temp ID
                createdAt: new Date().toISOString(),
                date: transaction.date || new Date().toISOString()
            };
            setTransactions(prev => [newTx, ...prev]);
        }
    };

    const updateTransaction = async (id, updatedData) => {
        if (user) {
            // Authenticated: Use API
            try {
                const { data } = await api.updateTransaction(id, updatedData);
                setTransactions(prev => prev.map(t => t._id === id ? data : t));
            } catch (error) {
                console.error("Failed to update transaction", error);
                alert(error.response?.data?.message || "Error updating transaction");
            }
        } else {
            // Demo Mode: Local State
            setTransactions(prev => prev.map(t => {
                if (t._id === id) {
                    // Enforce 12-hour restriction in Demo Mode
                    const createdAt = new Date(t.createdAt);
                    const now = new Date();
                    const hoursDiff = (now - createdAt) / (1000 * 60 * 60);

                    if (hoursDiff > 12) {
                        alert("Edit window expired. Demo restriction.");
                        return t;
                    }
                    return { ...t, ...updatedData };
                }
                return t;
            }));
        }
    };

    const deleteTransaction = async (id) => {
        if (user) {
            // Authenticated: Use API
            try {
                await api.deleteTransaction(id);
                setTransactions(prev => prev.filter(t => t._id !== id));
            } catch (error) {
                console.error("Failed to delete transaction", error);
                alert("Error deleting transaction");
            }
        } else {
            // Demo Mode: Local State
            setTransactions(prev => prev.filter(t => t._id !== id));
        }
    };

    const value = {
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        ACCOUNTS,
        accountBalances
    };

    return (
        <MoneyContext.Provider value={value}>
            {children}
        </MoneyContext.Provider>
    );
};
