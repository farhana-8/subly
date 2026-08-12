import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, AlertCircle, RefreshCw, Layout } from 'lucide-react';
import planService from '../../services/planService';
import { useToast } from '../../context/ToastContext';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await planService.getPlans();
      // Expecting array of plans from backend
      setPlans(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
      setError('Unable to load subscription plans. Please try again later.');
      addToast('Failed to load plans', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="bg-bg-deep min-h-screen py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-8 w-32 bg-main/5 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-12 w-3/4 max-w-2xl bg-main/5 rounded-xl mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 w-1/2 max-w-lg bg-main/5 rounded-lg mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[500px] bg-bg-card border border-main rounded-[2rem] animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-bg-deep min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-main mb-4">Oops! Something went wrong</h2>
          <p className="text-muted mb-8">{error}</p>
          <button 
            onClick={fetchPlans}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-violet text-white rounded-full font-black hover:bg-primary-purple transition-all shadow-lg shadow-primary-violet/20"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-deep min-h-screen py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-violet rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-primary-magenta rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-bg-card border border-main text-primary-violet text-sm font-bold mb-6"
          >
            Simple & Transparent
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-main mb-6 leading-tight"
          >
            Choose the right plan <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-violet via-primary-magenta to-accent-coral">
              for your business.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-lg text-muted leading-relaxed"
          >
            Scale your SaaS infrastructure with enterprise-grade billing. All plans include our core subscription management features.
          </motion.p>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-20 bg-bg-card border border-main rounded-[3rem] shadow-xl">
            <Layout className="h-16 w-16 text-muted mx-auto mb-6 opacity-20" />
            <h3 className="text-2xl font-black text-main mb-2">No plans available</h3>
            <p className="text-muted">We're currently updating our pricing tiers. Please check back soon.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className={`relative flex flex-col p-8 md:p-10 rounded-[2.5rem] bg-bg-card border border-main hover:border-primary-violet/30 transition-all shadow-xl group overflow-hidden`}
              >
                {/* Accent decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-violet/10 to-transparent rounded-bl-[100px] pointer-events-none"></div>

                <div className="mb-8">
                  <h3 className="text-2xl font-black text-main mb-2">{plan.name}</h3>
                  <p className="text-muted text-sm leading-relaxed">{plan.description || 'Enterprise-grade billing features for your growing SaaS.'}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-main">
                      {plan.currency === 'INR' ? '₹' : '$'}
                      {plan.price}
                    </span>
                    <span className="text-muted font-bold">/{plan.interval || 'month'}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {/* Features would ideally come from the API, but if not we show standard ones */}
                  {(plan.features || [
                    'Unlimited Subscriptions',
                    'Razorpay Integration',
                    'Automated Renewals',
                    'Email Notifications',
                    'Admin Dashboard'
                  ]).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 bg-primary-violet/10 rounded-full p-0.5">
                        <Check className="h-4 w-4 text-primary-violet" />
                      </div>
                      <span className="text-muted text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  state={{ planId: plan.id }}
                  className={`w-full py-4 rounded-2xl font-black text-center transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-[0.98] ${
                    plan.name?.toLowerCase().includes('pro') || plan.name?.toLowerCase().includes('popular')
                      ? 'bg-gradient-to-r from-primary-violet to-primary-purple text-white shadow-lg shadow-primary-violet/20'
                      : 'bg-bg-deep border border-main text-main hover:bg-main/5'
                  }`}
                >
                  Start Free Trial
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Trust Footer */}
        <div className="mt-24 text-center">
          <p className="text-muted text-sm font-bold uppercase tracking-widest mb-8">Trusted by enterprise teams</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale invert dark:invert-0">
            {/* Logos would go here */}
            <div className="h-8 w-24 bg-main/20 rounded-lg"></div>
            <div className="h-8 w-24 bg-main/20 rounded-lg"></div>
            <div className="h-8 w-24 bg-main/20 rounded-lg"></div>
            <div className="h-8 w-24 bg-main/20 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
