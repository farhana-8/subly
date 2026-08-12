import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Users, CreditCard, RefreshCw } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import subscriptionService from '../../services/subscriptionService';
import SubscriptionCard from '../../components/user/SubscriptionCard';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ open: false, type: '', title: '', message: '' });

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const response = await subscriptionService.getCurrentSubscription();
      setSubscription(response.data);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      // Don't show toast for 404 if no subscription exists
      if (error.response?.status !== 404) {
        addToast('Failed to load subscription data', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleAction = (type) => {
    if (type === 'cancel') {
      setConfirmModal({
        open: true,
        type: 'cancel',
        title: 'Cancel Subscription',
        message: 'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing cycle.'
      });
    } else if (type === 'pause') {
      setConfirmModal({
        open: true,
        type: 'pause',
        title: 'Pause Subscription',
        message: 'Temporarily pause your subscription? You can resume it at any time.'
      });
    } else if (type === 'resume') {
      handleConfirmAction('resume');
    } else if (type === 'upgrade') {
      window.location.href = '/plans';
    }
  };

  const handleConfirmAction = async (type) => {
    try {
      if (type === 'cancel') {
        await subscriptionService.cancelSubscription(subscription.id);
        addToast('Subscription cancelled successfully', 'success');
      } else if (type === 'pause') {
        await subscriptionService.pauseSubscription(subscription.id);
        addToast('Subscription paused', 'success');
      } else if (type === 'resume') {
        await subscriptionService.resumeSubscription(subscription.id);
        addToast('Subscription resumed', 'success');
      }
      fetchSubscription();
    } catch (error) {
      addToast(`Failed to ${type} subscription`, 'error');
    }
  };

  const stats = [
    { name: 'Active Subscriptions', value: subscription ? '1' : '0', icon: Zap, color: 'text-primary-violet', bg: 'bg-primary-violet/10' },
    { name: 'Total Spent', value: subscription ? `${subscription.currency === 'INR' ? '₹' : '$'}${subscription.price}` : '$0', icon: TrendingUp, color: 'text-accent-lime', bg: 'bg-accent-lime/10' },
    { name: 'Team Members', value: '1', icon: Users, color: 'text-primary-magenta', bg: 'bg-primary-magenta/10' },
    { name: 'Next Invoice', value: subscription?.nextRenewalDate ? new Date(subscription.nextRenewalDate).toLocaleDateString() : 'N/A', icon: CreditCard, color: 'text-accent-orange', bg: 'bg-accent-orange/10' },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-main/5 rounded-lg mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-bg-card border border-main rounded-[2rem]"></div>)}
        </div>
        <div className="h-64 bg-bg-card border border-main rounded-[2rem]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 transition-colors duration-300">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-black text-main">Welcome back, {user?.name || user?.firstName || 'User'}</h2>
          <p className="text-muted mt-1">Here's what's happening with your account today.</p>
        </div>
        <button 
          onClick={fetchSubscription}
          className="p-3 bg-bg-card border border-main rounded-2xl text-muted hover:text-main transition-all"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, idx) => (
          <motion.div 
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-bg-card border border-main rounded-[2rem] p-6 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className={`flex-shrink-0 rounded-2xl p-4 ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <div>
                <dt className="text-xs font-bold text-muted uppercase tracking-widest mb-1">{item.name}</dt>
                <dd className="text-2xl font-black text-main">{item.value}</dd>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="text-xl font-black text-main mb-6 flex items-center gap-2">
            Current Subscription
          </h3>
          <SubscriptionCard 
            subscription={subscription} 
            onAction={handleAction} 
          />
        </div>
        
        <div className="space-y-6">
          <h3 className="text-xl font-black text-main mb-6">Quick Actions</h3>
          <div className="bg-bg-card border border-main rounded-[2rem] p-6 shadow-lg space-y-3">
            <button className="w-full py-4 px-6 bg-bg-deep border border-main rounded-2xl text-main font-bold text-left hover:bg-main/5 transition-all flex justify-between items-center group">
              View Billing History
              <TrendingUp className="h-5 w-5 text-muted group-hover:text-primary-violet transition-colors" />
            </button>
            <button className="w-full py-4 px-6 bg-bg-deep border border-main rounded-2xl text-main font-bold text-left hover:bg-main/5 transition-all flex justify-between items-center group">
              Manage Team
              <Users className="h-5 w-5 text-muted group-hover:text-primary-magenta transition-colors" />
            </button>
            <button className="w-full py-4 px-6 bg-bg-deep border border-main rounded-2xl text-main font-bold text-left hover:bg-main/5 transition-all flex justify-between items-center group">
              Account Settings
              <CreditCard className="h-5 w-5 text-muted group-hover:text-accent-orange transition-colors" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ ...confirmModal, open: false })}
        onConfirm={() => handleConfirmAction(confirmModal.type)}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </div>
  );
};

export default Dashboard;
