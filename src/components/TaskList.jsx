import React from 'react';
import { Calendar } from 'lucide-react';
import TaskItem from './TaskItem';

const TaskList = ({ currentTasks, onUpdate, onToggle, onDelete }) => {
    if (currentTasks.length === 0) {
        return (
            <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Calendar size={32} className="text-purple-400 sm:w-10 sm:h-10" />
                </div>
                <p className="text-gray-400 text-base sm:text-lg">No tasks for this day</p>
                <p className="text-gray-300 text-xs sm:text-sm mt-2">Add a task to get started!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {currentTasks.map((task, index) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    index={index}
                    onUpdate={onUpdate}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default TaskList;
