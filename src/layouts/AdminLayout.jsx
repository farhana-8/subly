import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Shield, LogOut, Users, Settings, Layout } from 'lucide-react';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-700">
          <Shield className="h-8 w-8 text-blue-400" />
          <span className="ml-2 text-xl font-bold">Subly Admin</span>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center space-x-3 text-gray-300 p-2 rounded-md hover:bg-gray-700">
            <Layout className="h-5 w-5" />
            <span>Overview</span>
          </Link>
          <Link to="/admin/users" className="flex items-center space-x-3 text-gray-300 p-2 rounded-md hover:bg-gray-700">
            <Users className="h-5 w-5" />
            <span>Manage Users</span>
          </Link>
          <Link to="/admin/settings" className="flex items-center space-x-3 text-gray-300 p-2 rounded-md hover:bg-gray-700">
            <Settings className="h-5 w-5" />
            <span>System Settings</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 text-red-400 p-2 w-full rounded-md hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col bg-gray-900">
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </header>
        <main className="p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
