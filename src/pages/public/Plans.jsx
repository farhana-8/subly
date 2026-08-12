import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, RefreshCw, Layout, CheckCircle2, ArrowRight } from 'lucide-react';
import planService from '../../services/planService';
import subscriptionService from '../../services/subscriptionService';
import paymentService from '../../services/paymentService';
import { useToast } from '../../context/ToastContext';
import useAuth from '../../hooks/useAuth';
import { loadRazorpay } from '../../utils/razorpay';
import Modal from '../../components/common/Modal';

const Plans = () => {
  const [plans, setPlans] = useState([]);
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

  const handleSubscribe = async (plan) => {
    if (!isAuthenticated) {
      addToast('Please login to subscribe', 'info');
      navigate('/login', { state: { from: location, planId: plan.id } });
      return;
    }

    setProcessingPlanId(plan.id);
    try {
      // 1. Create Subscription
      const subResponse = await subscriptionService.createSubscription(plan.id);
      const subscription = subResponse.data;

      // 2. Create Payment Record (to get Razorpay Order ID)
      const paymentResponse = await paymentService.createPayment({
        subscriptionId: subscription.id,
        amount: plan.price,
        currency: plan.currency || 'INR',
        paymentMethod: 'RAZORPAY',
        transactionId: `pending_${Date.now()}` // Temporary placeholder
      });
      
      const paymentData = paymentResponse.data;

      // 3. Load Razorpay Script
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        addToast('Razorpay SDK failed to load. Are you online?', 'error');
        return;
      }

      // 4. Open Razorpay Checkout
      const options = {
        key: paymentData.razorpayKeyId,
        amount: paymentData.amount * 100, // in smallest unit
        currency: paymentData.currency,
        name: 'Subly',
        description: `Subscription for ${plan.name}`,
        order_id: paymentData.gatewayPaymentId,
        handler: async (response) => {
          // 5. Verify Payment on Backend
          try {
            addToast('Verifying payment...', 'info');
            await paymentService.verifyRazorpayPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            
            setSuccessModal({ open: true, planName: plan.name });
            addToast('Subscription active!', 'success');
          } catch (err) {
            addToast('Payment verification failed. Please contact support.', 'error');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#8B5CF6',
        },
        modal: {
          ondismiss: () => {
            addToast('Payment checkout cancelled', 'info');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error('Subscription error:', err);
      addToast(err.response?.data?.message || 'Failed to initiate subscription', 'error');
    } finally {
      setProcessingPlanId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-bg-deep min-h-screen py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[500px] bg-bg-card border border-main rounded-[2.5rem] animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-deep min-h-screen py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-violet rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black tracking-tight text-main mb-6 leading-tight"
          >
            Ready to scale? <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-violet via-primary-magenta to-accent-coral">
              Pick your plan.
            </span>
          </motion.h1>
          <p className="max-w-2xl mx-auto text-lg text-muted">Join hundreds of teams managing their subscriptions with Subly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -10 }}
              className="relative flex flex-col p-8 md:p-10 rounded-[2.5rem] bg-bg-card border border-main hover:border-primary-violet/30 transition-all shadow-xl group"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-black text-main mb-2">{plan.name}</h3>
                <p className="text-muted text-sm leading-relaxed">{plan.description || 'Premium billing infrastructure.'}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-main">
                    {plan.currency === 'INR' ? '₹' : '$'}{plan.price}
                  </span>
                  <span className="text-muted font-bold">/{plan.billingInterval?.toLowerCase() || 'month'}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {['Unlimited Access', 'Secure Payments', 'Email Support', 'Dashboard Access'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted text-sm font-medium">
                    <Check className="h-4 w-4 text-primary-violet" /> {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={processingPlanId === plan.id}
                className={`w-full py-4 rounded-2xl font-black text-center transition-all flex items-center justify-center gap-2 ${
                  processingPlanId === plan.id ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'
                } ${
                  plan.name?.toLowerCase().includes('pro') 
                    ? 'bg-gradient-to-r from-primary-violet to-primary-purple text-white shadow-lg' 
                    : 'bg-bg-deep border border-main text-main hover:bg-main/5'
                }`}
              >
                {processingPlanId === plan.id ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  isAuthenticated ? 'Subscribe Now' : 'Login to Subscribe'
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={successModal.open} 
        onClose={() => {
          setSuccessModal({ ...successModal, open: false });
          navigate('/dashboard');
        }}
        title="Payment Successful!"
      >
        <div className="text-center py-4">
          <div className="w-20 h-20 bg-accent-lime/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-accent-lime" />
          </div>
          <p className="text-muted mb-8">
            Congratulations! You are now subscribed to the <span className="text-main font-bold">{successModal.planName}</span>.
            Your dashboard is now fully unlocked.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 bg-primary-violet text-white rounded-2xl font-black flex items-center justify-center gap-2"
          >
            Go to Dashboard <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Plans;
