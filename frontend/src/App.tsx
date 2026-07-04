// src/App.tsx

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';
import Profile from './components/Auth/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import EventsPage from './components/Events/EventsPage';
import EventsDetailPage from './components/Events/EventsDetailPage';
import { useAuthStore } from './stores/authStore';

const App = () => {
  const initializeSession = useAuthStore((state) => state.initializeSession);

  useEffect(() => {
    void initializeSession();
  }, [initializeSession]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/events" element={<EventsPage />} />`r`n        <Route path="/events/:eventId" element={<EventsDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

