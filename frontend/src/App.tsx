// src/App.tsx


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';
import Profile from './components/Auth/Profile';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
<Route path="/" element={<Navigate to="/login" replace />} />
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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
