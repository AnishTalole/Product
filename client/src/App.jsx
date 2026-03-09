import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateProfile from './pages/CreateProfile';
import DigitalCard from './pages/DigitalCard';
import EditProfile from './pages/EditProfile';
import Login from './pages/Login';
import Register from './pages/Register';

/**
 * ProtectedRoute Wrapper
 * Redirects to /register if the user is not authenticated.
 */
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/register" replace />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans antialiased">
        <Routes>
          {/* --- Authentication Routes --- */}
          {/* First page users see when visiting the app */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* --- Protected Admin Routes --- */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/create" 
            element={
              <ProtectedRoute>
                <CreateProfile />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/edit/:id" 
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } 
          />

          {/* --- Public Access Route --- */}
          {/* Patients scan the QR to visit this link; no login required. */}
          <Route path="/card/:slug" element={<DigitalCard />} />

          {/* --- Fallback Navigation --- */}
          {/* Any undefined URL redirects to the registration entry point */}
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;