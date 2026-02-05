import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import * as api from '../services/api';

const MoneyContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useMoney = () => useContext(MoneyContext);

export const MoneyProvider = ({ children }) => {
    // Transaction structure: 
    // { id, type: 'income'|'expense'|'transfer', amount, date (ISO), description, category, division, accountId, fromAccountId, toAccountId, createdAt }

    // eslint-disable-next-line no-unused-vars
    const ACCOUNTS = ['Cash', 'Bank', 'Wallet'];
    const [transactions, setTransactions] = useState([]);

    // Fetch Transactions on Mount
    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const { data } = await api.fetchTransactions();
                setTransactions(data);
            } catch (error) {
                console.error("Failed to fetch transactions", error);
            }
        };
        loadTransactions();
    }, []);

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

            // Debug Log
            // console.log(`Txn: ${type} | Amt: ${amt} | Acc: ${account} | From: ${fromAccount} | To: ${toAccount}`);

            if (type === 'income') {
                // Check case-insensitive match if needed, but for now strict
                if (balances[account] !== undefined) {
                    balances[account] += amt;
                } else {
                    console.warn(`[MoneyContext] Income ignored. Unknown account: ${account}`);
                }
            }

            if (type === 'expense') {
                if (balances[account] !== undefined) {
                    balances[account] -= amt;
                } else {
                    console.warn(`[MoneyContext] Expense ignored. Unknown account: ${account}`);
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



    const addTransaction = async (transaction) => {
        try {
            const { data } = await api.createTransaction(transaction);
            setTransactions(prev => [data, ...prev]);
        } catch (error) {
            console.error("Failed to add transaction", error);
            alert("Error adding transaction");
        }
    };

    const updateTransaction = async (id, updatedData) => {
        try {
            const { data } = await api.updateTransaction(id, updatedData);
            setTransactions(prev => prev.map(t => t._id === id ? data : t)); // MongoDB uses _id
        } catch (error) {
            console.error("Failed to update transaction", error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message); // Show backend error (e.g. 12hr limit)
            } else {
                alert("Error updating transaction");
            }
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await api.deleteTransaction(id);
            setTransactions(prev => prev.filter(t => t._id !== id));
        } catch (error) {
            console.error("Failed to delete transaction", error);
            alert("Error deleting transaction");
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
