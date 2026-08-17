import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layout, Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const PublicLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-bg-deep text-main font-sans selection:bg-primary-violet/30 transition-colors duration-300">
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-bg-deep/80 backdrop-blur-md border-b border-main py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="bg-gradient-to-br from-primary-violet to-primary-magenta p-1.5 rounded-lg mr-2 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all">
                  <Layout className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-main uppercase">Subly</span>
              </Link>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                {['Features', 'Pricing', 'Security'].map((item) => (
                  <Link 
                    key={item} 
                    to={`/${item.toLowerCase()}`} 
                    className="text-muted hover:text-main transition-colors text-sm font-medium"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-main/5 text-muted hover:text-main transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Link to="/login" className="text-muted hover:text-main transition-colors text-sm font-medium">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-primary-violet to-primary-purple hover:from-primary-purple hover:to-primary-violet px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all shadow-lg hover:shadow-primary-violet/20"
              >
                Get Started
              </Link>
            </div>

            <div className="md:hidden flex items-center space-x-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-main/5 text-muted hover:text-main transition-all"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-muted hover:text-main">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-bg-dark border-b border-main overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                <div className="flex items-center justify-between px-3 py-4 border-b border-main/5">
                  <span className="text-sm font-bold text-muted uppercase tracking-widest">Theme</span>
                  <button 
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-4 py-2 bg-bg-deep border border-main rounded-xl text-xs font-black text-main"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {theme === 'dark' ? 'LIGHT' : 'DARK'}
                  </button>
                </div>
                {['Features', 'Plans', 'Security', 'Login'].map((item) => (
                  <Link 
                    key={item}
                    to={`/${item.toLowerCase()}`}
                    className="block px-3 py-4 text-base font-medium text-muted hover:text-main hover:bg-main/5 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                <Link 
                  to="/register"
                  className="block w-full text-center mt-4 bg-primary-violet text-white py-3 rounded-lg font-bold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      <footer className="bg-bg-dark border-t border-main py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center mb-6">
                <Layout className="h-8 w-8 text-primary-violet" />
                <span className="ml-2 text-2xl font-bold text-main uppercase tracking-tighter">Subly</span>
              </Link>
              <p className="text-muted max-w-xs text-sm leading-relaxed">
                The enterprise-grade subscription billing infrastructure designed for modern SaaS companies.
              </p>
            </div>
            <div>
              <h4 className="text-main font-bold mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="/features" className="hover:text-primary-violet transition-colors">Features</Link></li>
                <li><Link to="/plans" className="hover:text-primary-violet transition-colors">Pricing</Link></li>
                <li><Link to="/security" className="hover:text-primary-violet transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-main font-bold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="/features" className="hover:text-primary-violet transition-colors">About</Link></li>
                <li><Link to="/features" className="hover:text-primary-violet transition-colors">Careers</Link></li>
                <li><Link to="/features" className="hover:text-primary-violet transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-main font-bold mb-4 text-sm">Support</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="/plans" className="hover:text-primary-violet transition-colors">Help Center</Link></li>
                <li><Link to="/features" className="hover:text-primary-violet transition-colors">API Docs</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary-violet transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-main flex flex-col md:flex-row justify-between items-center text-xs text-muted">
            <p>&copy; {new Date().getFullYear()} Subly Inc. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/security" className="hover:text-main transition-colors">Privacy Policy</Link>
              <Link to="/security" className="hover:text-main transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
