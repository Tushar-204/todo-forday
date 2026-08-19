import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const DateHeader = ({ selectedDate, onPrevDay, onNextDay, onGoToday }) => {
    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString + 'T00:00:00');
        return {
            full: date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            day: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            weekday: date.toLocaleDateString('en-US', { weekday: 'short' })
        };
    };

    const dateInfo = formatDate(selectedDate);

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                        My Tasks
                    </h1>
                    <p className="text-gray-500 font-medium flex items-center gap-2 text-sm sm:text-base">
                        <Calendar size={18} className="text-purple-500" />
                        {dateInfo ? dateInfo.full : 'Loading...'}
                    </p>
                </div>
                <button
                    onClick={onGoToday}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-purple-100 text-purple-700 rounded-xl font-semibold hover:bg-purple-200 transition-all text-sm sm:text-base shadow-sm hover:shadow"
                >
                    Jump to Today
                </button>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2 sm:p-3 shadow-inner">
                <button
                    onClick={onPrevDay}
                    className="p-2 sm:p-3 hover:bg-white rounded-xl transition-all hover:shadow-md text-gray-600 hover:text-purple-600"
                >
                    <ChevronLeft size={24} className="sm:w-8 sm:h-8" />
                </button>
                <div className="text-center">
                    <span className="block text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">
                        {dateInfo ? dateInfo.weekday : ''}
                    </span>
                    <span className="block text-2xl sm:text-4xl font-black bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {dateInfo ? dateInfo.month : ''} {dateInfo ? dateInfo.day : ''}
                    </span>
                </div>
                <button
                    onClick={onNextDay}
                    className="p-2 sm:p-3 hover:bg-white rounded-xl transition-all hover:shadow-md text-gray-600 hover:text-purple-600"
                >
                    <ChevronRight size={24} className="sm:w-8 sm:h-8" />
                </button>
            </div>
        </div>
    );
};

export default DateHeader;
