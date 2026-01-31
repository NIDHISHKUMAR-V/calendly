import React, { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isBefore,
    startOfDay
} from 'date-fns';

const Calendar = ({ selectedDate, onDateSelect }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const onNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const onPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    const days = [];
    const dayList = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="w-full md:w-[360px] p-4 bg-white rounded-lg  md:border-r border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-secondary text-center flex-1">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <div className="flex gap-2">
                    <button onClick={onPrevMonth} className="p-1 hover:bg-gray-100 rounded-full text-primary">&lt;</button>
                    <button onClick={onNextMonth} className="p-1 hover:bg-gray-100 rounded-full text-primary">&gt;</button>
                </div>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 mb-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {weekDays.map(day => <div key={day}>{day}</div>)}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-2">
                {dayList.map((day, i) => {
                    const isBeforeToday = isBefore(day, startOfDay(new Date()));
                    const isSelected = isSameDay(day, selectedDate);

                    let className = "mx-auto w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors ";

                    if (!isSameMonth(day, monthStart)) {
                        className += "text-gray-300 pointer-events-none";
                    } else if (isBeforeToday) {
                        className += "text-gray-300 pointer-events-none";
                    } else if (isSelected) {
                        className += "bg-primary text-white shadow-md";
                    } else {
                        className += "bg-blue-50 text-secondary hover:bg-blue-100 cursor-pointer font-bold";
                    }

                    return (
                        <div key={day.toString()} onClick={() => !isBeforeToday && onDateSelect(day)}>
                            <div className={className}>
                                {format(day, dateFormat)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
