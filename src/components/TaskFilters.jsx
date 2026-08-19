import React from 'react';
import { Search, Filter, XCircle } from 'lucide-react';

const TaskFilters = ({
    searchQuery,
    setSearchQuery,
    filterPriority,
    setFilterPriority,
    filterCategory,
    setFilterCategory,
    showFilters,
    setShowFilters
}) => {
    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Tasks
                </h2>

                {/* Search & Filter Controls */}
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tasks..."
                            className="pl-9 pr-8 py-1.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-32 sm:w-48 transition-all focus:w-40 sm:focus:w-52"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <XCircle size={14} />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2 rounded-xl border-2 transition-all ${showFilters || filterPriority !== 'all' || filterCategory !== 'all' ? 'bg-purple-100 border-purple-300 text-purple-600' : 'border-gray-200 text-gray-400 hover:text-purple-500'}`}
                        title="Filter Tasks"
                    >
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
                <div className="flex flex-wrap gap-3 mb-4 p-3 bg-gray-50 rounded-xl animate-fadeIn">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500">Priority:</span>
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
                        >
                            <option value="all">All</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500">Category:</span>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
                        >
                            <option value="all">All</option>
                            <option value="personal">Personal</option>
                            <option value="work">Work</option>
                            <option value="health">Health</option>
                            <option value="study">Study</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    {(filterPriority !== 'all' || filterCategory !== 'all') && (
                        <button
                            onClick={() => { setFilterPriority('all'); setFilterCategory('all'); }}
                            className="text-xs text-red-500 hover:underline ml-auto"
                        >
                            Clear
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskFilters;
