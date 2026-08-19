import React, { useState } from 'react';
import { Plus, Clock, Flag, FileText, Repeat } from 'lucide-react';
import { getCategoryIcon } from '../utils/helpers';

const TaskForm = ({ onAdd }) => {
    const [newTask, setNewTask] = useState('');
    const [taskTime, setTaskTime] = useState('');
    const [taskPriority, setTaskPriority] = useState('medium');
    const [taskCategory, setTaskCategory] = useState('personal');
    const [taskRecurrence, setTaskRecurrence] = useState('none');
    const [newTaskNotes, setNewTaskNotes] = useState('');
    const [showNotesInput, setShowNotesInput] = useState(false);

    const handleSubmit = () => {
        if (!newTask.trim() || !taskTime) return;

        onAdd({
            text: newTask,
            time: taskTime,
            priority: taskPriority,
            category: taskCategory,
            recurrence: taskRecurrence,
            notes: newTaskNotes
        });

        setNewTask('');
        setTaskTime('');
        setTaskPriority('medium');
        setTaskCategory('personal');
        setTaskRecurrence('none');
        setNewTaskNotes('');
        setShowNotesInput(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 items-stretch sm:items-center">
                {/* Time Input */}
                <div className="relative flex-shrink-0">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="time"
                        value={taskTime}
                        onChange={(e) => setTaskTime(e.target.value)}
                        required
                        className="w-full sm:w-auto pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                {/* Priority Selector */}
                <div className="relative flex-shrink-0">
                    <select
                        value={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value)}
                        className={`w-full sm:w-auto pl-3 pr-8 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-white cursor-pointer
               ${taskPriority === 'high' ? 'text-red-600 font-medium bg-red-50 border-red-200' :
                                taskPriority === 'low' ? 'text-green-600 font-medium bg-green-50 border-green-200' : 'text-orange-600 font-medium bg-orange-50 border-orange-200'}`}
                    >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                    <Flag className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none w-4 h-4
             ${taskPriority === 'high' ? 'text-red-600' :
                            taskPriority === 'low' ? 'text-green-600' : 'text-orange-600'}`}
                    />
                </div>

                {/* Category Selector */}
                <div className="relative flex-shrink-0">
                    <select
                        value={taskCategory}
                        onChange={(e) => setTaskCategory(e.target.value)}
                        className="w-28 sm:w-auto pl-9 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-white cursor-pointer"
                    >
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                        <option value="health">Health</option>
                        <option value="study">Study</option>
                        <option value="other">Other</option>
                    </select>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                        {getCategoryIcon(taskCategory)}
                    </div>
                </div>

                {/* Recurrence Selector */}
                <div className="relative flex-shrink-0">
                    <select
                        value={taskRecurrence}
                        onChange={(e) => setTaskRecurrence(e.target.value)}
                        className={`w-max sm:w-auto pl-9 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-white cursor-pointer hover:bg-gray-50 ${taskRecurrence !== 'none' ? 'text-purple-600 font-medium border-purple-200 bg-purple-50' : 'text-gray-500'}`}
                        title="Repeat Task"
                    >
                        <option value="none">No Repeat</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                    <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${taskRecurrence !== 'none' ? 'text-purple-600' : 'text-gray-400'}`}>
                        <Repeat size={18} />
                    </div>
                </div>

                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="What do you want to accomplish?"
                    className="flex-1 min-w-[200px] px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />

                <button
                    onClick={() => setShowNotesInput(!showNotesInput)}
                    className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all flex-shrink-0 ${showNotesInput ? 'bg-purple-100 border-purple-300 text-purple-600' : 'border-gray-200 text-gray-400 hover:text-purple-500 hover:bg-gray-50'}`}
                    title={showNotesInput ? "Hide Notes" : "Add Notes"}
                >
                    <FileText size={20} />
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={!taskTime || !newTask.trim()}
                    title={!taskTime ? "Please enter the time first" : !newTask.trim() ? "Please enter a task" : "Add task"}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={18} className="sm:w-5 sm:h-5" />
                    Add
                </button>
            </div>

            {showNotesInput && (
                <div className="mt-3 relative animate-fadeIn">
                    <textarea
                        value={newTaskNotes}
                        onChange={(e) => setNewTaskNotes(e.target.value)}
                        placeholder="Add details, notes, links..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                    />
                </div>
            )}
        </div>
    );
};

export default TaskForm;
