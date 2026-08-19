import React from 'react';
import { Briefcase, Home, Activity, BookOpen, Layers } from 'lucide-react';

export const getCategoryIcon = (category) => {
    switch (category) {
        case 'work': return <Briefcase size={14} />;
        case 'personal': return <Home size={14} />;
        case 'health': return <Activity size={14} />;
        case 'study': return <BookOpen size={14} />;
        default: return <Layers size={14} />;
    }
};

export const getCategoryColor = (category) => {
    switch (category) {
        case 'work': return 'text-blue-600 bg-blue-100';
        case 'personal': return 'text-purple-600 bg-purple-100';
        case 'health': return 'text-rose-600 bg-rose-100';
        case 'study': return 'text-indigo-600 bg-indigo-100';
        default: return 'text-gray-600 bg-gray-100';
    }
};

export const getPriorityColor = (priority) => {
    switch (priority) {
        case 'high': return 'text-red-500 bg-red-50';
        case 'medium': return 'text-orange-500 bg-orange-50';
        case 'low': return 'text-green-500 bg-green-50';
        default: return 'text-gray-500 bg-gray-50';
    }
};
