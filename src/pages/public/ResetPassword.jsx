import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout, ArrowRight, Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import authService from '../../services/authService';
import { useToast } from '../../context/ToastContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Reset token is missing.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword({ token, password });
      setIsSuccess(true);
      addToast('Password reset successfully!', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.');
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
            <h2 className="text-3xl font-black text-main">New Password</h2>
            <p className="text-muted mt-2">Create a secure password for your account</p>
          </div>

          {isSuccess ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-accent-lime/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-accent-lime" />
              </div>
              <h3 className="text-xl font-black text-main mb-2">Password Updated</h3>
              <p className="text-muted mb-8 leading-relaxed">
                Your password has been successfully reset. You can now log in with your new credentials.
              </p>
              <Link 
                to="/login" 
                className="w-full py-4 bg-primary-violet text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-primary-violet/20 hover:shadow-primary-violet/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Go to Login
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {!token && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-start gap-3 text-sm mb-4">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>Invalid reset link. Please request a new one.</span>
                </div>
              )}

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
                <label className="text-sm font-bold text-muted ml-1">New Password</label>
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

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted ml-1">Confirm New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary-violet transition-colors" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-bg-deep border border-main rounded-2xl py-4 pl-12 pr-4 text-main placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-violet/50 focus:border-primary-violet transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className={`w-full bg-gradient-to-r from-primary-violet to-primary-purple text-white rounded-2xl py-4 font-black text-lg shadow-lg shadow-primary-violet/20 hover:shadow-primary-violet/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${loading || !token ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-muted hover:text-main text-sm font-bold transition-colors">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
