import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, ArrowRight, User, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import authService from '../../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await authService.register(formData);
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-bg-deep relative overflow-hidden transition-colors duration-300">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-magenta/5 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-bg-card border border-main rounded-[2rem] p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="register-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <Link to="/" className="inline-flex items-center mb-6 group">
                    <div className="bg-gradient-to-br from-primary-magenta to-accent-coral p-2 rounded-xl">
                      <Layout className="h-6 w-6 text-white" />
                    </div>
                    <span className="ml-3 text-2xl font-black text-main uppercase tracking-tighter">Subly</span>
                  </Link>
                  <h2 className="text-3xl font-black text-main text-balance">Start your free trial</h2>
                  <p className="text-muted mt-2">No credit card required for 14 days</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <label className="text-sm font-bold text-muted ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary-magenta transition-colors" />
                        <input
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-bg-deep border border-main rounded-2xl py-3.5 pl-12 pr-4 text-main placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-magenta/50 focus:border-primary-magenta transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <label className="text-sm font-bold text-muted ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary-magenta transition-colors" />
                        <input
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-bg-deep border border-main rounded-2xl py-3.5 pl-12 pr-4 text-main placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-magenta/50 focus:border-primary-magenta transition-all"
                          placeholder="name@company.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted ml-1">Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary-magenta transition-colors" />
                        <input
                          name="password"
                          type="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full bg-bg-deep border border-main rounded-2xl py-3.5 pl-12 pr-4 text-main placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-magenta/50 focus:border-primary-magenta transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted ml-1">Confirm</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary-magenta transition-colors" />
                        <input
                          name="confirmPassword"
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full bg-bg-deep border border-main rounded-2xl py-3.5 pl-12 pr-4 text-main placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-magenta/50 focus:border-primary-magenta transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full bg-gradient-to-r from-primary-magenta to-accent-coral text-white rounded-2xl py-4 font-black text-lg shadow-lg shadow-primary-magenta/20 hover:shadow-primary-magenta/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {loading ? (
                        <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-muted text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-main font-black hover:text-primary-magenta transition-colors">
                      Sign In
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-accent-lime/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-accent-lime" />
                </div>
                <h2 className="text-3xl font-black text-main mb-4">Check your email</h2>
                <p className="text-muted mb-8 leading-relaxed">
                  We've sent a verification link to <span className="text-main font-bold">{formData.email}</span>. 
                  Please verify your email address to activate your account.
                </p>
                <Link 
                  to="/login" 
                  className="inline-flex items-center text-primary-magenta font-black hover:underline gap-2"
                >
                  Return to Login
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
