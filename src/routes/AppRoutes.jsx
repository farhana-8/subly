import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';

// Pages
import Landing from '../pages/public/Landing';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import VerifyEmail from '../pages/public/VerifyEmail';
import Plans from '../pages/public/Plans';
import Dashboard from '../pages/user/Dashboard';
import Payments from '../pages/user/Payments';
import Subscription from '../pages/user/Subscription';
import Notifications from '../pages/user/Notifications';
import Profile from '../pages/user/Profile';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminPlans from '../pages/admin/AdminPlans';
import AdminPayments from '../pages/admin/AdminPayments';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/features" element={<Landing />} />
        <Route path="/pricing" element={<Plans />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/security" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>

      {/* User Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>

      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Subscription />} />
        <Route path="history" element={<Payments />} />
      </Route>

      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Payments />} />
      </Route>

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Notifications />} />
      </Route>

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Profile />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="plans" element={<AdminPlans />} />
        <Route path="payments" element={<AdminPayments />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
