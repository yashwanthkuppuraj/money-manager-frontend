import React from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    startOfWeek,
    endOfWeek,
    addDays
} from 'date-fns';

const CalendarView = ({ currentMonth, selectedDate, onDateSelect }) => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = [];
    let day = startDate;
    let formattedDate = "";

    // Generate days for grid
    while (day <= endDate) {
        days.push(day);
        day = addDays(day, 1);
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5E7C6]">
            <div className="grid grid-cols-7 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-[#222222]/50 uppercase tracking-wide">
                        {d}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {days.map((dayItem, i) => {
                    formattedDate = format(dayItem, dateFormat);
                    const isSelected = isSameDay(dayItem, selectedDate);
                    const isCurrentMonth = isSameMonth(dayItem, monthStart);
                    const isCurrentDay = isToday(dayItem);

                    return (
                        <div
                            key={i}
                            className={`
                                relative h-10 w-10 md:h-12 md:w-12 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-all duration-200
                                ${!isCurrentMonth ? 'text-gray-300 pointer-events-none' : 'text-[#222222] hover:bg-[#F5E7C6]/30'}
                                ${isSelected ? 'bg-[#FA8112] text-[#FAF3E1] shadow-md hover:bg-[#e0720f]' : ''}
                                ${isCurrentDay && !isSelected ? 'border-2 border-[#FA8112] text-[#FA8112]' : ''}
                            `}
                            onClick={() => onDateSelect(dayItem)}
                        >
                            <span className="text-sm font-medium">{formattedDate}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
