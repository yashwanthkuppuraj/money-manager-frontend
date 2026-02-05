import React, { useState, useMemo } from 'react';
import { useMoney } from '../context/MoneyContext';
import SummaryCards from './SummaryCards';
import TransactionList from './TransactionList';
import CategorySummary from './CategorySummary';
import CalendarView from './CalendarView';
import AccountBalances from './AccountBalances';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { startOfMonth, endOfMonth, addMonths, subMonths, format, isSameMonth, isAfter, isBefore } from 'date-fns';

const Dashboard = ({ onOpenAddModal, setSelectedDateForModal, onEditTransaction }) => {
    const { transactions, updateTransaction, deleteTransaction } = useMoney();

    // State
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Navigation Handlers
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        // Also ensure currentMonth follows if user clicks a greyed out date from prev/next month?
        // CalendarView handles greyed out dates as pointer-events-none usually, so no worry.
        // But if we want to allow skipping:
        if (!isSameMonth(date, currentMonth)) {
            setCurrentMonth(date);
        }
    };

    const handleOpenAdd = () => {
        setSelectedDateForModal(selectedDate);
        onOpenAddModal();
    };

    // Filter Transactions for Selected Month
    const monthTransactions = useMemo(() => {
        return transactions.filter(t => isSameMonth(new Date(t.date), currentMonth));
    }, [transactions, currentMonth]);

    // Calculate Summary based on Month Data
    const { income, expense, balance } = useMemo(() => {
        let inc = 0, exp = 0;
        monthTransactions.forEach(t => {
            if (t.type === 'income') inc += Number(t.amount);
            else if (t.type === 'expense') exp += Number(t.amount);
            // Transfers are ignored for Income/Expense totals
        });
        return { income: inc, expense: exp, balance: inc - exp };
    }, [monthTransactions]);


    return (
        <div className="space-y-6">
            {/* Header: Month Selector */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#222222] tracking-tight">Dashboard</h1>
                    <p className="text-[#222222]/60 text-sm">Overview for {format(currentMonth, 'MMMM yyyy')}</p>
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

            {/* Top Grid: Calendar & Summary */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Left Column: Calendar & Button */}
                <div className="xl:col-span-1 flex flex-col gap-4">
                    <CalendarView
                        currentMonth={currentMonth}
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                    />

                    <button
                        onClick={handleOpenAdd}
                        className="w-full flex items-center justify-center space-x-2 bg-[#FA8112] hover:bg-[#e0720f] text-[#FAF3E1] font-medium py-3 px-5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Add for {format(selectedDate, 'MMM d')}</span>
                    </button>
                </div>

                {/* Right Column: Balances & Summary (Distributed Height) */}
                <div className="xl:col-span-2 flex flex-col gap-4 justify-between h-full">
                    <div className="flex-1">
                        <AccountBalances />
                    </div>
                    <div className="flex-1">
                        <SummaryCards income={income} expense={expense} balance={balance} />
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Category & Transactions (Aligned Top & Bottom) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Left: Category */}
                <div className="xl:col-span-1 h-full">
                    <CategorySummary transactions={monthTransactions} />
                </div>

                {/* Right: Transactions */}
                <div className="xl:col-span-2 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-[#222222]">Transactions for {format(currentMonth, 'MMMM')}</h3>
                    </div>
                    <div className="flex-1">
                        <TransactionList
                            transactions={monthTransactions}
                            updateTransaction={updateTransaction}
                            deleteTransaction={deleteTransaction}
                            onEdit={onEditTransaction}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
