import React, { useState } from 'react';
import { Check, Edit2, Trash2, Save, X, Flag, Repeat, FileText } from 'lucide-react';
import { getCategoryIcon, getCategoryColor } from '../utils/helpers';

const TaskItem = ({ task, index, onUpdate, onToggle, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
    const [editTime, setEditTime] = useState(task.time);
    const [editPriority, setEditPriority] = useState(task.priority || 'medium');
    const [editCategory, setEditCategory] = useState(task.category || 'personal');
    const [editRecurrence, setEditRecurrence] = useState(task.recurrence || 'none');
    const [editNotes, setEditNotes] = useState(task.notes || '');

    const startEdit = () => {
        setEditText(task.text);
        setEditTime(task.time);
        setEditPriority(task.priority || 'medium');
        setEditCategory(task.category || 'personal');
        setEditRecurrence(task.recurrence || 'none');
        setEditNotes(task.notes || '');
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setIsEditing(false);
    };

    const saveEdit = () => {
        if (!editText.trim() || !editTime) return;

        onUpdate({
            ...task,
            text: editText,
            time: editTime,
            priority: editPriority,
            category: editCategory,
            recurrence: editRecurrence,
            notes: editNotes
        });
        setIsEditing(false);
    };

    const priorityColor = task.priority === 'high' ? 'border-red-500' :
        task.priority === 'low' ? 'border-green-500' :
            task.priority === 'medium' ? 'border-orange-500' : 'border-purple-300';

    const completedClass = task.completed
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400'
        : `bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 ${priorityColor}`;

    return (
        <div
            className={`group p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all hover:shadow-md border-l-4 ${completedClass}`}
            style={{
                animation: `fadeIn 0.3s ease-in ${index * 0.05}s both`
            }}
        >
            <div className="flex items-center gap-2 sm:gap-4">
                {isEditing ? (
                    // Edit Mode
                    <>
                        <input
                            type="time"
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value)}
                            className="px-2 sm:px-3 py-1 border-2 border-blue-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-20 sm:w-24"
                        />

                        {/* Edit Priority */}
                        <div className="relative flex-shrink-0">
                            <select
                                value={editPriority}
                                onChange={(e) => setEditPriority(e.target.value)}
                                className={`pl-1 pr-6 py-1 border-2 border-blue-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer
                 ${editPriority === 'high' ? 'text-red-600 font-medium' :
                                        editPriority === 'low' ? 'text-green-600 font-medium' : 'text-orange-600 font-medium'}`}
                            >
                                <option value="high">Hi</option>
                                <option value="medium">Md</option>
                                <option value="low">Lo</option>
                            </select>
                            <Flag className={`absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none w-3 h-3
               ${editPriority === 'high' ? 'text-red-600' :
                                    editPriority === 'low' ? 'text-green-600' : 'text-orange-600'}`}
                            />
                        </div>

                        {/* Edit Category */}
                        <div className="relative flex-shrink-0">
                            <select
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                                className="pl-6 pr-2 py-1 border-2 border-blue-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer w-20"
                            >
                                <option value="personal">Me</option>
                                <option value="work">Work</option>
                                <option value="health">Hlth</option>
                                <option value="study">Stdy</option>
                                <option value="other">Othr</option>
                            </select>
                            <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                                {getCategoryIcon(editCategory)}
                            </div>
                        </div>

                        {/* Edit Recurrence */}
                        <div className="relative flex-shrink-0">
                            <select
                                value={editRecurrence}
                                onChange={(e) => setEditRecurrence(e.target.value)}
                                className={`w-8 pl-0 pr-0 py-1 border-2 border-blue-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer text-transparent text-center`}
                                title={`Repeat: ${editRecurrence}`}
                            >
                                <option value="none">No</option>
                                <option value="daily">Dy</option>
                                <option value="weekly">Wk</option>
                                <option value="monthly">Mo</option>
                            </select>
                            <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none ${editRecurrence !== 'none' ? 'text-purple-600' : 'text-gray-400'}`}>
                                <Repeat size={14} />
                            </div>
                        </div>

                        <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 px-2 sm:px-3 py-1 border-2 border-blue-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                        <button
                            onClick={saveEdit}
                            className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all flex-shrink-0"
                            title="Save"
                        >
                            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                            onClick={cancelEdit}
                            className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all flex-shrink-0"
                            title="Cancel"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </>
                ) : (
                    // View Mode
                    <>
                        <button
                            onClick={() => onToggle(task.id)}
                            className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-lg border-2 flex items-center justify-center transition-all ${task.completed
                                ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-500 scale-110'
                                : 'border-purple-300 hover:border-purple-500 hover:scale-110'
                                }`}
                        >
                            {task.completed && <Check size={16} className="text-white sm:w-4.5 sm:h-4.5" strokeWidth={3} />}
                        </button>

                        {task.time && (
                            <span className={`text-xs sm:text-sm font-bold min-w-[55px] sm:min-w-[65px] px-2 sm:px-3 py-1 rounded-lg flex-shrink-0 ${task.completed
                                ? 'bg-green-100 text-green-700'
                                : 'bg-purple-200 text-purple-700'
                                }`}>
                                {task.time}
                            </span>
                        )}

                        <span
                            className={`flex-1 text-sm sm:text-base min-w-0 break-words ${task.completed
                                ? 'text-gray-400 line-through'
                                : 'text-gray-800 font-medium'
                                }`}
                        >
                            {task.text}
                            {task.priority && task.priority !== 'medium' && !task.completed && (
                                <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider ${task.priority === 'high' ? 'bg-red-100 text-red-600' :
                                    task.priority === 'low' ? 'bg-green-100 text-green-600' : ''
                                    }`}>
                                    {task.priority}
                                </span>
                            )}
                            {task.category && !task.completed && (
                                <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider flex items-center gap-1 inline-flex ${getCategoryColor(task.category)}`}>
                                    {getCategoryIcon(task.category)}
                                    <span className="hidden sm:inline">{task.category}</span>
                                </span>
                            )}
                            {task.recurrence && task.recurrence !== 'none' && !task.completed && (
                                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-50 text-purple-600" title={`Repeats ${task.recurrence}`}>
                                    <Repeat size={12} />
                                </span>
                            )}
                        </span>

                        {/* Edit Button */}
                        <button
                            onClick={startEdit}
                            className="opacity-100 sm:opacity-0 group-hover:opacity-100 p-1.5 sm:p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex-shrink-0"
                            title="Edit task"
                        >
                            <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        <button
                            onClick={() => onDelete(task.id)}
                            className="opacity-100 sm:opacity-0 group-hover:opacity-100 p-1.5 sm:p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                        >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </>
                )}
            </div>

            {/* Notes Display */}
            {isEditing ? (
                <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Task notes..."
                    className="w-full mt-3 px-3 py-2 border-2 border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
                />
            ) : task.notes && (
                <div className={`mt-2 pl-9 sm:pl-16 text-xs sm:text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="flex items-start gap-1.5">
                        <FileText size={14} className="mt-0.5 flex-shrink-0 opacity-50" />
                        <p className="whitespace-pre-wrap font-sans">{task.notes}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskItem;
