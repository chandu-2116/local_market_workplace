/**
 * UrbanFix – Local Services Marketplace Main Application Entry
 * Full React Router DOM setup, global context providers, and responsive layouts.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { MarketplaceProvider } from './context/MarketplaceContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';

import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import ProviderDashboard from './pages/ProviderDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AuthPage from './pages/AuthPage.jsx';

// Protected Route Wrapper
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If provider tries to view admin or customer, route them to their own dashboard
    if (role === 'provider') return <Navigate to="/provider/dashboard" replace />;
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/customer/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Customer Dashboard */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Provider Dashboard */}
          <Route
            path="/provider/dashboard"
            element={
              <ProtectedRoute allowedRoles={['provider', 'admin']}>
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <MarketplaceProvider>
          <NotificationProvider>
            <Toaster position="top-right" />
            <AppRoutes />
          </NotificationProvider>
        </MarketplaceProvider>
      </AuthProvider>
    </Router>
  );
}
