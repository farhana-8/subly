import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { Shield, LogOut, Users, Settings, Layout, CreditCard, BarChart3, Home, Sun, Moon } from 'lucide-react';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: Layout },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Plans', path: '/admin/plans', icon: Settings },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-bg-deep text-main flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-72 bg-bg-card border-r border-main hidden md:flex flex-col">
        <div className="h-20 flex items-center px-8 border-b border-main">
          <div className="bg-gradient-to-br from-primary-violet to-primary-magenta p-1.5 rounded-lg mr-2">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black text-main uppercase tracking-tighter">Subly Admin</span>
        </div>
        
        <nav className="flex-grow p-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name}
                to={item.path} 
                className={`flex items-center space-x-3 p-4 rounded-2xl font-bold transition-all ${
                  isActive 
                    ? 'bg-primary-violet text-white shadow-lg shadow-primary-violet/20' 
                    : 'text-muted hover:bg-main/5 hover:text-main'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-main space-y-2">
          <Link 
            to="/dashboard"
            className="flex items-center space-x-3 text-muted p-4 w-full rounded-2xl font-bold hover:bg-main/5 hover:text-main transition-all"
          >
            <Home className="h-5 w-5" />
            <span>User View</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 text-red-500 p-4 w-full rounded-2xl font-bold hover:bg-red-500/10 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-h-screen overflow-hidden">
        <header className="h-20 bg-bg-card/50 backdrop-blur-md border-b border-main flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-black text-main">
            {navItems.find(item => item.path === location.pathname)?.name || 'Admin Panel'}
          </h1>
          
          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-bg-deep border border-main text-muted hover:text-main transition-all"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-black text-main">{user?.name || user?.firstName || 'Admin'}</span>
              <span className="text-[10px] font-bold text-primary-violet uppercase tracking-widest">System Administrator</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-violet to-primary-magenta flex items-center justify-center text-white font-black">
              {(user?.name || user?.firstName || 'A')[0]}
            </div>
          </div>
        </header>
        
        <main className="p-8 flex-grow overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
