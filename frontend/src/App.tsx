import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { MudFormulator } from './components/MudFormulator';
import AvailableProductList from './components/AvailableProductList';
import SavedFormulations from './components/SavedFormulations';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './services/auth';

const AppContent: React.FC = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showNavbar && <Navbar />}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MudFormulator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/available-products"
            element={
              <ProtectedRoute>
                <AvailableProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-formulations"
            element={
              <ProtectedRoute>
                <SavedFormulations />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App; 