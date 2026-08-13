import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Layout } from 'lucide-react';
import authService from '../../services/authService';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing.');
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-bg-deep relative overflow-hidden transition-colors duration-300">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-violet/5 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-bg-card border border-main rounded-[2rem] p-8 md:p-10 shadow-2xl backdrop-blur-xl text-center">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center group">
              <div className="bg-gradient-to-br from-primary-violet to-primary-magenta p-2 rounded-xl">
                <Layout className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-black text-main uppercase tracking-tighter">Subly</span>
            </Link>
          </div>

          {status === 'loading' && (
            <div className="py-10">
              <Loader2 className="h-16 w-16 text-primary-violet animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-black text-main mb-2">Verifying your email</h2>
              <p className="text-muted">Please wait while we confirm your account...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-10">
              <div className="w-20 h-20 bg-accent-lime/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-accent-lime" />
              </div>
              <h2 className="text-3xl font-black text-main mb-4">Email Verified!</h2>
              <p className="text-muted mb-8 leading-relaxed">{message}</p>
              <Link 
                to="/login" 
                className="w-full py-4 bg-primary-violet text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-primary-violet/20 hover:shadow-primary-violet/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Continue to Login
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="py-10">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-3xl font-black text-main mb-4">Verification Failed</h2>
              <p className="text-muted mb-8 leading-relaxed">{message}</p>
              <div className="space-y-4">
                <Link 
                  to="/register" 
                  className="w-full py-4 bg-bg-deep border border-main text-main rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-main/5 transition-all"
                >
                  Try Registering Again
                </Link>
                <Link to="/login" className="block text-primary-violet font-black hover:underline">
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
