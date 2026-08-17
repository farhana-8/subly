import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, TrendingUp, CreditCard, RefreshCw, Bell, ArrowRight, Settings, Compass } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import subscriptionService from '../../services/subscriptionService';
import notificationService from '../../services/notificationService';
import SubscriptionCard from '../../components/user/SubscriptionCard';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, type: '', title: '', message: '' });

  const fetchData = async () => {
    setLoading(true);
    setDataError(null);
    const [subscriptionResult, notificationResult] = await Promise.allSettled([
      subscriptionService.getCurrentSubscription({ skipAuthRedirect: true }),
      notificationService.getNotifications({ skipAuthRedirect: true }),
    ]);

    if (subscriptionResult.status === 'fulfilled') {
      setSubscription(subscriptionResult.value.data?.data || subscriptionResult.value.data || null);
    } else if (subscriptionResult.reason?.response?.status === 404) {
      setSubscription(null);
    } else {
      console.error('Failed to fetch subscription:', subscriptionResult.reason);
      setSubscription(null);
      setDataError('Your subscription details could not be loaded.');
    }

    if (notificationResult.status === 'fulfilled') {
      const notificationsData = notificationResult.value.data?.data || notificationResult.value.data;
      setNotifications(Array.isArray(notificationsData) ? notificationsData.slice(0, 3) : []);
    } else {
      console.error('Failed to fetch notifications:', notificationResult.reason);
      setNotifications([]);
      setDataError((currentError) => currentError || 'Recent notifications could not be loaded.');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
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
      navigate('/plans');
    }
  };

  const handleConfirmAction = async (type) => {
    if (!subscription || actionLoading) return;
    setActionLoading(true);
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
      fetchData();
    } catch (error) {
      addToast(error.response?.data?.message || `Failed to ${type} subscription`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const stats = [
    { name: 'Active Subscriptions', value: subscription ? '1' : '0', icon: Zap, color: 'text-primary-violet', bg: 'bg-primary-violet/10' },
    { name: 'Current Plan Price', value: subscription ? `${subscription.currency === 'INR' ? '₹' : subscription.currency ? `${subscription.currency} ` : ''}${subscription.price ?? subscription.plan?.price ?? '—'}` : '—', icon: TrendingUp, color: 'text-accent-lime', bg: 'bg-accent-lime/10' },
    { name: 'Next Invoice', value: subscription?.nextRenewalDate ? new Date(subscription.nextRenewalDate).toLocaleDateString() : 'N/A', icon: CreditCard, color: 'text-accent-orange', bg: 'bg-accent-orange/10' },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-main/5 rounded-lg mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-bg-card border border-main rounded-[2rem]"></div>)}
        </div>
        <div className="h-64 bg-bg-card border border-main rounded-[2rem]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 transition-colors duration-300">
      {dataError && (
        <div className="flex flex-col gap-3 rounded-2xl border border-accent-orange/20 bg-accent-orange/10 p-4 text-sm text-main sm:flex-row sm:items-center sm:justify-between">
          <span>{dataError}</span>
          <button onClick={fetchData} className="inline-flex items-center gap-2 font-black text-primary-violet hover:text-primary-magenta">
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      )}

      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-black text-main">Welcome back, {user?.name || user?.firstName || 'User'}</h2>
          <p className="text-muted mt-1">Here's what's happening with your account today.</p>
        </div>
        <button 
          onClick={fetchData}
          className="p-3 bg-bg-card border border-main rounded-2xl text-muted hover:text-main transition-all"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="text-xl font-black text-main mb-6 flex items-center gap-2">
              Current Subscription
            </h3>
            <SubscriptionCard 
              subscription={subscription}
              onAction={handleAction}
              actionLoading={actionLoading}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-main flex items-center gap-2">
                Recent Notifications
              </h3>
              <Link to="/notifications" className="text-sm font-black text-primary-violet hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="bg-bg-card border border-main border-dashed rounded-[2rem] p-10 text-center">
                  <p className="text-muted text-sm font-bold">No new notifications</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="bg-bg-card border border-main rounded-2xl p-4 flex gap-4 items-center">
                    <div className="w-10 h-10 bg-primary-violet/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Bell className="h-5 w-5 text-primary-violet" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-main">{n.title}</div>
                      <div className="text-xs text-muted truncate max-w-[200px] md:max-w-md">{n.message}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-xl font-black text-main mb-6">Quick Actions</h3>
          <div className="bg-bg-card border border-main rounded-[2rem] p-6 shadow-lg space-y-3">
            <Link to="/plans" className="w-full py-4 px-6 bg-bg-deep border border-main rounded-2xl text-main font-bold text-left hover:bg-main/5 transition-all flex justify-between items-center group">
              Explore Plans
              <Compass className="h-5 w-5 text-muted group-hover:text-primary-violet transition-colors" />
            </Link>
            <Link to="/payments" className="w-full py-4 px-6 bg-bg-deep border border-main rounded-2xl text-main font-bold text-left hover:bg-main/5 transition-all flex justify-between items-center group">
              View Billing History
              <TrendingUp className="h-5 w-5 text-muted group-hover:text-primary-violet transition-colors" />
            </Link>
            <Link to="/subscription" className="w-full py-4 px-6 bg-bg-deep border border-main rounded-2xl text-main font-bold text-left hover:bg-main/5 transition-all flex justify-between items-center group">
              Manage Subscription
              <Zap className="h-5 w-5 text-muted group-hover:text-primary-magenta transition-colors" />
            </Link>
            <Link to="/notifications" className="w-full py-4 px-6 bg-bg-deep border border-main rounded-2xl text-main font-bold text-left hover:bg-main/5 transition-all flex justify-between items-center group">
              Notifications
              <Bell className="h-5 w-5 text-muted group-hover:text-primary-magenta transition-colors" />
            </Link>
            <Link to="/profile" className="w-full py-4 px-6 bg-bg-deep border border-main rounded-2xl text-main font-bold text-left hover:bg-main/5 transition-all flex justify-between items-center group">
              Account Settings
              <Settings className="h-5 w-5 text-muted group-hover:text-accent-orange transition-colors" />
            </Link>
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
