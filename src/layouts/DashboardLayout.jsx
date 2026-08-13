import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Layout, LogOut, User, Home, CreditCard, Bell, Shield, Settings } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ADMIN' || user?.roles?.includes('ADMIN');

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Subscription', path: '/subscription', icon: Shield },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  // Add Admin Dashboard link if user is admin
  if (isAdmin) {
    navItems.push({ name: 'Admin Panel', path: '/admin/dashboard', icon: Settings });
  }

  return (
    <div className="min-h-screen bg-bg-deep text-main flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-72 bg-bg-card border-r border-main hidden md:flex flex-col">
        <div className="h-20 flex items-center px-8 border-b border-main">
          <div className="bg-gradient-to-br from-primary-violet to-primary-magenta p-1.5 rounded-lg mr-2">
            <Layout className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black text-main uppercase tracking-tighter">Subly</span>
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

        <div className="p-6 border-t border-main">
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
            {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
          </h1>
          
          <div className="flex items-center gap-6">
            <Link to="/notifications" className="relative p-2 text-muted hover:text-primary-violet transition-colors">
              <Bell className="h-6 w-6" />
              <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary-violet rounded-full border-2 border-bg-card"></div>
            </Link>

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-black text-main">{user?.name || user?.firstName || 'User'}</span>
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{user?.role || 'Member'}</span>
            </div>
            <Link to="/profile" className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-violet to-primary-magenta flex items-center justify-center text-white font-black hover:scale-105 transition-all shadow-lg">
              {(user?.name || user?.firstName || 'U')[0]}
            </Link>
          </div>
        </header>
        
        <main className="p-8 flex-grow overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
