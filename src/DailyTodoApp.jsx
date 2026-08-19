import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthSection from './components/AuthSection';
import DateHeader from './components/DateHeader';
import TaskProgress from './components/TaskProgress';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';
import ExportImport from './components/ExportImport';
import InstallPrompt from './InstallPrompt';
import {
  signOutUser,
  saveTasks,
  getTasks
} from './firebase';

export default function DailyTodoApp({ user }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [showExportImport, setShowExportImport] = useState(false);
  const [syncStatus, setSyncStatus] = useState('syncing');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    if (user) {
      setSyncStatus('syncing');
      getTasks(user.uid).then((fetchedTasks) => {
        if (fetchedTasks) {
          setTasks(fetchedTasks);
        }
        setSyncStatus('synced');
      });
    }
  }, [user]);

  const saveAllTasks = async (newTasks) => {
    if (user) {
      setSyncStatus('syncing');
      await saveTasks(user.uid, newTasks);
      setSyncStatus('synced');
    }
  };

  const handlePrevDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleGoToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  };

  const handleAddTask = (taskData) => {
    if (selectedDate) {
      const updatedTasks = { ...tasks };
      if (!updatedTasks[selectedDate]) {
        updatedTasks[selectedDate] = [];
      }
      updatedTasks[selectedDate].push({
        id: Date.now(),
        ...taskData,
        completed: false,
        createdBy: user?.uid || 'local',
        createdAt: new Date().toISOString()
      });

      updatedTasks[selectedDate].sort((a, b) => {
        return a.time.localeCompare(b.time);
      });

      setTasks(updatedTasks);
      saveAllTasks(updatedTasks);
    }
  };

  const handleUpdateTask = (updatedTask) => {
    const updatedTasks = { ...tasks };
    updatedTasks[selectedDate] = updatedTasks[selectedDate].map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );

    // Sort again in case time changed
    updatedTasks[selectedDate].sort((a, b) => {
      return a.time.localeCompare(b.time);
    });

    setTasks(updatedTasks);
    saveAllTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = { ...tasks };
      updatedTasks[selectedDate] = updatedTasks[selectedDate].filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      saveAllTasks(updatedTasks);
    }
  };

  const handleToggleTask = (taskId) => {
    const updatedTasks = { ...tasks };
    const taskIndex = updatedTasks[selectedDate].findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
      const task = updatedTasks[selectedDate][taskIndex];
      const isNowCompleted = !task.completed;

      updatedTasks[selectedDate][taskIndex] = { ...task, completed: isNowCompleted };

      // Handle Recurrence
      if (isNowCompleted && task.recurrence && task.recurrence !== 'none') {
        const nextDate = new Date(selectedDate);
        if (task.recurrence === 'daily') nextDate.setDate(nextDate.getDate() + 1);
        if (task.recurrence === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
        if (task.recurrence === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);

        const nextDateStr = nextDate.toISOString().split('T')[0];

        if (!updatedTasks[nextDateStr]) {
          updatedTasks[nextDateStr] = [];
        }

        // Check duplication? (Simplified: just push)
        updatedTasks[nextDateStr].push({
          ...task,
          id: Date.now(),
          completed: false,
          createdAt: new Date().toISOString()
          // Recurrence is inherited
        });

        updatedTasks[nextDateStr].sort((a, b) => a.time.localeCompare(b.time));
      }
    }

    setTasks(updatedTasks);
    saveAllTasks(updatedTasks);
  };

  // Filter Logic
  const rawTasks = tasks[selectedDate] || [];
  const currentTasks = rawTasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;

    return matchesSearch && matchesPriority && matchesCategory;
  });

  const completedCount = currentTasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <AuthSection
          user={user}
          syncStatus={syncStatus}
          onSignOut={async () => {
            await signOutUser();
            navigate('/auth');
          }}
          onOpenExport={() => setShowExportImport(true)}
        />

        <DateHeader
          selectedDate={selectedDate}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
          onGoToday={handleGoToday}
        />

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
          <TaskProgress
            completedCount={completedCount}
            totalCount={currentTasks.length}
          />
          <TaskForm onAdd={handleAddTask} />
        </div>

        <TaskFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mt-4 sm:mt-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
            Tasks
          </h2>
          <TaskList
            currentTasks={currentTasks}
            onUpdate={handleUpdateTask}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        </div>
      </div>

      {showExportImport && (
        <ExportImport
          isOpen={showExportImport}
          onClose={() => setShowExportImport(false)}
          tasks={tasks}
          onImport={(imported) => {
            setTasks(imported);
            saveAllTasks(imported);
          }}
        />
      )}
      <InstallPrompt />
    </div>
  );
}