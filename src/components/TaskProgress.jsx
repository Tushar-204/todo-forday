import React from 'react';

const TaskProgress = ({ completedCount, totalCount }) => {
    if (totalCount === 0) return null;

    const percentage = Math.round((completedCount / totalCount) * 100);

    return (
        <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-semibold text-gray-600">Progress</span>
                <span className="text-xs sm:text-sm font-bold text-purple-600">
                    {completedCount}/{totalCount} completed
                </span>
            </div>
            <div className="h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default TaskProgress;
