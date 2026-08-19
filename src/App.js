import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOutUser } from './firebase';
import DailyTodoApp from './DailyTodoApp';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import './mockStorage';

// Inactivity timeout duration: 2 hours (in milliseconds)
const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimerRef = useRef(null);

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Set new timer only if user is authenticated
    if (user) {
      inactivityTimerRef.current = setTimeout(async () => {
        console.log('User inactive for 2 hours, logging out...');
        await signOutUser();
      }, INACTIVITY_TIMEOUT);
    }
  }, [user]);

  // Track user activity
  useEffect(() => {
    if (!user) return;

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    // Reset timer on any activity
    const handleActivity = () => {
      resetInactivityTimer();
    };

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Start initial timer
    resetInactivityTimer();

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [user, resetInactivityTimer]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Auth Page */}
        <Route
          path="/auth"
          element={
            user ? <Navigate to="/" replace /> : <AuthPage />
          }
        />

        {/* Profile Page */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <ProfilePage user={user} />
            </ProtectedRoute>
          }
        />

        {/* Protected Main App */}
        <Route
          path="/"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <DailyTodoApp user={user} />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;