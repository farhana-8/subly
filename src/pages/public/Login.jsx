import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout, ArrowRight, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login({ email, password });
      
      // Extract user role from response
      const user = data.user || data.data?.user;
      const isAdmin = user?.role === 'ADMIN' || user?.roles?.includes('ADMIN');
      
      // Determine redirection target
      let target = location.state?.from?.pathname;
      
      if (!target || target === '/') {
        target = isAdmin ? '/admin/dashboard' : '/dashboard';
      }
      
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-bg-deep relative overflow-hidden transition-colors duration-300">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-violet/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-bg-card border border-main rounded-[2rem] p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center mb-6 group">
              <div className="bg-gradient-to-br from-primary-violet to-primary-magenta p-2 rounded-xl">
                <Layout className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-black text-main uppercase tracking-tighter">Subly</span>
            </Link>
            <h2 className="text-3xl font-black text-main">Welcome back</h2>
            <p className="text-muted mt-2">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-start gap-3 text-sm"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-muted ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary-violet transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-bg-deep border border-main rounded-2xl py-4 pl-12 pr-4 text-main placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-violet/50 focus:border-primary-violet transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-muted">Password</label>
                <Link to="/forgot-password" title="Forgot Password" className="text-xs text-primary-violet hover:text-primary-magenta font-bold transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary-violet transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg-deep border border-main rounded-2xl py-4 pl-12 pr-12 text-main placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-violet/50 focus:border-primary-violet transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-main transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-primary-violet to-primary-purple text-white rounded-2xl py-4 font-black text-lg shadow-lg shadow-primary-violet/20 hover:shadow-primary-violet/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-muted text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-main font-black hover:text-primary-violet transition-colors">
                Start 14-day free trial
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
