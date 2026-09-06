import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import notificationService from '../services/notificationService';
import useAuth from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { Layout, LogOut, User, Home, CreditCard, Bell, Shield, Settings, Sun, Moon } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    let active = true;
    notificationService.getUnreadNotifications({ skipAuthRedirect: true })
      .then((res) => {
        if (active) {
          const list = res.data?.data || res.data || [];
          setHasUnread(Array.isArray(list) ? list.length > 0 : Boolean(list));
        }
      })
      .catch(() => {
        if (active) setHasUnread(false);
      });
    return () => { active = false; };
  }, [location.pathname]);

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

  if (isAdmin) {
    navItems.push({ name: 'Admin Panel', path: '/admin/dashboard', icon: Settings });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-bg-deep text-main flex transition-colors duration-300 overflow-x-hidden">
      <aside className="w-72 shrink-0 bg-bg-card border-r border-main hidden md:flex flex-col">
        <div className="h-20 flex items-center px-8 border-b border-main">
          <div className="bg-gradient-to-br from-primary-violet to-primary-magenta p-1.5 rounded-lg mr-2">
            <Layout className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black text-main uppercase tracking-tighter">Subly</span>
        </div>

        <nav className="flex-grow p-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 p-4 rounded-2xl font-bold transition-all ${
                isActive(item.path)
                  ? 'bg-primary-violet text-white shadow-lg shadow-primary-violet/20'
                  : 'text-muted hover:bg-main/5 hover:text-main'
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </Link>
          ))}
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

      <div className="flex-grow flex flex-col min-w-0 min-h-screen overflow-hidden">
        <header className="h-16 md:h-20 shrink-0 bg-bg-card/80 backdrop-blur-md border-b border-main flex items-center justify-between px-4 sm:px-6 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="md:hidden bg-gradient-to-br from-primary-violet to-primary-magenta p-1.5 rounded-lg shrink-0">
              <Layout className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-base sm:text-lg font-black text-main truncate">
              {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl bg-bg-deep border border-main text-muted hover:text-main transition-all"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>

            <Link to="/notifications" className="relative p-2 text-muted hover:text-primary-violet transition-colors" aria-label="Notifications">
              <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
              {hasUnread && <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-primary-magenta ring-2 ring-bg-card" />}
            </Link>

            <div className="hidden sm:flex flex-col items-end max-w-[150px]">
              <span className="text-sm font-black text-main truncate max-w-full">{user?.name || user?.firstName || 'User'}</span>
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{user?.role || 'Member'}</span>
            </div>

            <Link to="/profile" className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full bg-gradient-to-br from-primary-violet to-primary-magenta flex items-center justify-center text-white font-black hover:scale-105 transition-all shadow-lg" aria-label="Profile">
              {(user?.name || user?.firstName || 'U')[0]}
            </Link>
          </div>
        </header>

        <main className="p-4 sm:p-6 md:p-8 pb-24 md:pb-8 flex-grow min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-bg-card/95 backdrop-blur-xl border-t border-main px-1 pb-[env(safe-area-inset-bottom)] shadow-2xl">
        <div className="grid grid-cols-5 max-w-xl mx-auto">
          {navItems.slice(0, 5).map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex flex-col items-center justify-center gap-1 min-h-[64px] px-1 py-2 text-[10px] font-bold transition-colors ${active ? 'text-primary-violet' : 'text-muted'}`}
              >
                <span className={`relative rounded-xl p-1.5 ${active ? 'bg-primary-violet/10' : ''}`}>
                  <item.icon className="h-5 w-5" />
                  {item.name === 'Notifications' && hasUnread && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary-magenta ring-2 ring-bg-card" />}
                </span>
                <span className="truncate max-w-full">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default DashboardLayout;
