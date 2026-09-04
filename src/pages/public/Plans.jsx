import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, RefreshCw, Layout, CheckCircle2, ArrowRight, ShieldAlert, Sparkles, Zap, Crown, Rocket } from 'lucide-react';
import planService from '../../services/planService';
import subscriptionService from '../../services/subscriptionService';
import paymentService from '../../services/paymentService';
import { useToast } from '../../context/ToastContext';
import useAuth from '../../hooks/useAuth';
import { loadRazorpay } from '../../utils/razorpay';
import Modal from '../../components/common/Modal';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState(null);
  const [error, setError] = useState(null);
  const [successModal, setSuccessModal] = useState({ open: false, planName: '' });
  
  const { addToast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await planService.getPlans();
      let plansData = [];
      if (Array.isArray(response.data)) {
        plansData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        plansData = response.data.data;
      } else if (response.data?.content && Array.isArray(response.data.content)) {
        plansData = response.data.content;
      }

      plansData = plansData.filter((plan) => plan.active !== false);
      
      // Sort plans by price
      setPlans(plansData.sort((a, b) => Number(a.price) - Number(b.price)));
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

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentSubscription(null);
      return undefined;
    }

    let active = true;
    subscriptionService.getCurrentSubscription({ skipAuthRedirect: true })
      .then((response) => {
        if (active) setCurrentSubscription(response.data?.data || response.data || null);
      })
      .catch((err) => {
        if (active && err.response?.status === 404) setCurrentSubscription(null);
      });

    return () => { active = false; };
  }, [isAuthenticated]);

  const handleSubscribe = async (plan) => {
    if (processingPlanId !== null) return;
    if (!isAuthenticated) {
      addToast('Please login to subscribe', 'info');
      navigate('/login', { state: { from: location, planId: plan.id } });
      return;
    }

    if (currentSubscription && ['ACTIVE', 'PAUSED'].includes(currentSubscription.status)) {
      addToast('You already have a subscription. Manage it from the subscription page.', 'info');
      navigate('/subscription');
      return;
    }

    setProcessingPlanId(plan.id);
    try {
      const subResponse = await subscriptionService.createSubscription(plan.id);
      const subscription = subResponse.data?.data || subResponse.data;

      if (!subscription?.id) {
        throw new Error('Failed to create subscription record.');
      }

      const transactionId = `SUB-${subscription.id}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      const paymentResponse = await paymentService.createPayment({
        subscriptionId: subscription.id,
        amount: Number(plan.price),
        currency: 'INR',
        paymentMethod: 'RAZORPAY',
        transactionId
      });
      
      const paymentData = paymentResponse.data?.data || paymentResponse.data;

      if (!paymentData?.gatewayPaymentId || !paymentData?.razorpayKeyId) {
        throw new Error('Razorpay is not configured for this account. Please contact support.');
      }

      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        setProcessingPlanId(null);
        addToast('Razorpay SDK failed to load. Are you online?', 'error');
        return;
      }

      const options = {
        key: paymentData.razorpayKeyId,
        amount: Math.round(Number(paymentData.amount) * 100),
        currency: paymentData.currency || 'INR',
        name: 'Subly',
        description: `Subscription for ${plan.name}`,
        order_id: paymentData.gatewayPaymentId,
        handler: async (response) => {
          try {
            if (!response?.razorpay_order_id || !response?.razorpay_payment_id || !response?.razorpay_signature) {
              throw new Error('Razorpay returned an incomplete payment response.');
            }
            addToast('Verifying payment...', 'info');
            await paymentService.verifyRazorpayPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            const [subscriptionRefresh] = await Promise.all([
              subscriptionService.getCurrentSubscription(),
              paymentService.getPaymentHistory(),
            ]);
            setCurrentSubscription(subscriptionRefresh.data?.data || subscriptionRefresh.data || null);
            setSuccessModal({ open: true, planName: plan.name });
            addToast('Subscription active!', 'success');
          } catch (err) {
            addToast(err.response?.data?.message || 'Payment verification failed. Please contact support.', 'error');
          } finally {
            setProcessingPlanId(null);
          }
        },
        prefill: {
          name: user?.name || user?.firstName || '',
          email: user?.email || '',
        },
        theme: {
          color: '#8B5CF6',
        },
        modal: {
          ondismiss: () => {
            setProcessingPlanId(null);
            addToast('Payment checkout cancelled', 'info');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (failure) => {
        setProcessingPlanId(null);
        addToast(failure?.error?.description || 'Razorpay could not complete the payment.', 'error');
      });
      rzp.open();

    } catch (err) {
      console.error('Subscription error:', err);
      setProcessingPlanId(null);
      addToast(err.response?.data?.message || err.message || 'Failed to initiate subscription', 'error');
    }
  };

  const getPlanIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('pro') || lowerName.includes('premium')) return <Crown className="h-6 w-6 text-primary-magenta" />;
    if (lowerName.includes('business') || lowerName.includes('enterprise')) return <Rocket className="h-6 w-6 text-accent-coral" />;
    return <Zap className="h-6 w-6 text-primary-violet" />;
  };

  if (loading) {
    return (
      <div className="bg-bg-deep min-h-screen py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[600px] bg-bg-card border border-main rounded-[2.5rem] animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-deep min-h-screen py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary-violet rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-primary-magenta rounded-full blur-[120px] opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-violet/10 border border-primary-violet/20 text-primary-violet text-xs font-black uppercase tracking-widest mb-8"
          >
            <Sparkles className="h-3 w-3" />
            Pricing Plans
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black tracking-tighter text-main mb-8 leading-[0.9]"
          >
            Scale your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-violet via-primary-magenta to-accent-coral">
              billing engine.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-xl text-muted font-medium"
          >
            Simple, transparent pricing for teams of all sizes. <br className="hidden md:block" />
            No hidden fees, no complicated contracts.
          </motion.p>
        </div>

        {error ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto p-12 bg-bg-card border border-main rounded-[3rem] text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <ShieldAlert className="h-20 w-20 text-red-500/30 mx-auto mb-8 relative z-10" />
            <h3 className="text-2xl font-black text-main mb-4 relative z-10 tracking-tight">Something went wrong</h3>
            <p className="text-muted mb-10 relative z-10 text-lg leading-relaxed">{error}</p>
            <button 
              onClick={fetchPlans}
              className="px-10 py-5 bg-primary-violet text-white rounded-2xl font-black shadow-xl shadow-primary-violet/20 hover:bg-primary-purple transition-all flex items-center gap-3 mx-auto relative z-10 active:scale-95"
            >
              <RefreshCw className="h-5 w-5" />
              Try Again
            </button>
          </motion.div>
        ) : plans.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto p-16 md:p-24 bg-bg-card border border-main rounded-[3rem] text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-violet/5 rounded-full blur-[100px] -ml-32 -mt-32"></div>
            <div className="relative z-10">
              <Sparkles className="h-24 w-24 text-primary-violet/20 mx-auto mb-10" />
              <h3 className="text-4xl font-black text-main mb-6 tracking-tighter">New plans arriving soon</h3>
              <p className="text-muted mb-12 text-xl leading-relaxed font-medium">
                We're currently tailoring our plans to provide the best value. <br className="hidden md:block" />
                Check back in a few days or contact our support team.
              </p>
              <button 
                onClick={() => navigate('/')}
                className="px-12 py-6 bg-bg-deep border border-main text-main rounded-2xl font-black text-xl hover:bg-main/5 transition-all shadow-xl active:scale-95"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {plans.map((plan, index) => {
              const isPro = plan.name?.toLowerCase().includes('pro') || plan.name?.toLowerCase().includes('premium');
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -12 }}
                  className={`relative flex flex-col p-10 md:p-12 rounded-[3rem] transition-all shadow-2xl group ${
                    isPro 
                      ? 'bg-bg-card border-2 border-primary-violet shadow-primary-violet/10' 
                      : 'bg-bg-card border border-main hover:border-primary-violet/40'
                  }`}
                >
                  {isPro && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-violet to-primary-magenta text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="mb-10 flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-black text-main mb-3 tracking-tight">{plan.name}</h3>
                      <p className="text-muted text-sm font-medium leading-relaxed max-w-[200px]">
                        {plan.description || 'Enterprise-grade billing infrastructure for your scaling business.'}
                      </p>
                    </div>
                    <div className={`p-4 rounded-2xl ${isPro ? 'bg-primary-violet/10' : 'bg-main/5'}`}>
                      {getPlanIcon(plan.name)}
                    </div>
                  </div>

                  <div className="mb-10">
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-black text-main tracking-tighter">
                        ₹{plan.price}
                      </span>
                      <span className="text-muted font-bold text-lg">/{plan.billingInterval?.toLowerCase() || 'month'}</span>
                    </div>
                  </div>

                  <div className="mb-12 flex-grow">
                    <div className="text-xs font-black text-muted uppercase tracking-widest mb-6">What's included</div>
                    {Array.isArray(plan.features) && plan.features.length > 0 ? (
                      <ul className="space-y-5">
                        {plan.features.map((feature, idx) => (
                          <li key={`${plan.id}-feature-${idx}`} className="flex items-start gap-4 text-main/80 text-sm font-bold">
                            <div className="mt-1 bg-accent-lime/10 p-0.5 rounded-full">
                              <Check className="h-3.5 w-3.5 text-accent-lime" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm leading-relaxed text-muted font-medium italic">Standard platform features included.</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={processingPlanId !== null}
                    className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.97] ${
                      processingPlanId !== null ? 'opacity-70 cursor-not-allowed' : ''
                    } ${
                      isPro 
                        ? 'bg-gradient-to-r from-primary-violet to-primary-purple text-white hover:shadow-primary-violet/30' 
                        : 'bg-bg-deep border border-main text-main hover:bg-main/5'
                    }`}
                  >
                    {processingPlanId === plan.id ? (
                      <RefreshCw className="h-6 w-6 animate-spin" />
                    ) : currentSubscription && ['ACTIVE', 'PAUSED'].includes(currentSubscription.status) ? (
                      'Current Plan'
                    ) : (
                      <>
                        {isAuthenticated ? 'Get Started' : 'Sign Up Now'}
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Modal 
        isOpen={successModal.open} 
        onClose={() => {
          setSuccessModal({ ...successModal, open: false });
          navigate('/dashboard');
        }}
        title="Payment Successful!"
      >
        <div className="text-center py-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="w-24 h-24 bg-accent-lime/20 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 className="h-12 w-12 text-accent-lime" />
          </motion.div>
          <h3 className="text-3xl font-black text-main mb-4 tracking-tight">You're all set!</h3>
          <p className="text-muted mb-12 text-lg font-medium leading-relaxed">
            Congratulations! You are now subscribed to <span className="text-main font-bold">{successModal.planName}</span>.
            Your billing dashboard is now active.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-5 bg-primary-violet text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary-violet/20 hover:bg-primary-purple transition-all"
          >
            Go to Dashboard 
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Plans;
