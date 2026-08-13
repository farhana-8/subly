import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Calendar, CreditCard, RefreshCw, Pause, Play, XCircle, ArrowUpCircle, Clock } from 'lucide-react';
import subscriptionService from '../../services/subscriptionService';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const Subscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ show: false, type: '', title: '', message: '' });
  const { addToast } = useToast();

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.getCurrentSubscription();
      // Handle cases where data might be nested or direct
      const data = response.data?.data || response.data;
      setSubscription(data || null);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      // Only show error if it's not a 404 (which might mean no subscription)
      if (error.response?.status !== 404) {
        addToast('Failed to load subscription details', 'error');
      }
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleAction = async () => {
    const { type } = confirmModal;
    setConfirmModal({ ...confirmModal, show: false });
    setActionLoading(true);

    try {
      let response;
      switch (type) {
        case 'pause':
          response = await subscriptionService.pauseSubscription(subscription.id);
          addToast('Subscription paused successfully', 'success');
          break;
        case 'resume':
          response = await subscriptionService.resumeSubscription(subscription.id);
          addToast('Subscription resumed successfully', 'success');
          break;
        case 'cancel':
          response = await subscriptionService.cancelSubscription(subscription.id);
          addToast('Subscription cancelled successfully', 'success');
          break;
        default:
          break;
      }
      if (response) fetchSubscription();
    } catch (error) {
      addToast(error.response?.data?.message || `Failed to ${type} subscription`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const openConfirm = (type) => {
    const config = {
      pause: { title: 'Pause Subscription?', message: 'Your service will be suspended until you resume. You won\'t be charged during this period.' },
      resume: { title: 'Resume Subscription?', message: 'Your service will reactivate immediately and billing will resume.' },
      cancel: { title: 'Cancel Subscription?', message: 'This will stop all future renewals. You will still have access until the end of your current period.' }
    };
    setConfirmModal({ show: true, type, ...config[type] });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="h-10 w-64 bg-main/5 rounded-xl animate-pulse"></div>
        <div className="h-64 bg-bg-card border border-main rounded-[2.5rem] animate-pulse"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center space-y-8">
        <div className="bg-bg-card border border-main rounded-[2.5rem] p-12 md:p-20 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-violet/5 to-transparent"></div>
          <div className="relative z-10">
            <Shield className="h-20 w-20 text-muted/20 mx-auto mb-6" />
            <h3 className="text-3xl font-black text-main mb-4">No active subscription</h3>
            <p className="text-muted max-w-md mx-auto mb-10 text-lg">
              Unlock the full potential of Subly. Choose a plan that fits your business needs.
            </p>
            <motion.a 
              href="/plans"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-10 py-5 bg-primary-violet text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary-violet/20 hover:bg-primary-purple transition-all"
            >
              Explore Plans
              <ArrowUpCircle className="h-6 w-6" />
            </motion.a>
          </div>
        </div>
      </div>
    );
  }

  const statusColors = {
    ACTIVE: 'text-accent-lime bg-accent-lime/10 border-accent-lime/20',
    PAUSED: 'text-accent-orange bg-accent-orange/10 border-accent-orange/20',
    CANCELLED: 'text-red-500 bg-red-500/10 border-red-500/20',
    EXPIRED: 'text-muted bg-main/5 border-main/10'
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-main flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary-violet" />
            My Subscription
          </h2>
          <p className="text-muted mt-1">Manage your plan, billing, and status.</p>
        </div>
        <button 
          onClick={fetchSubscription}
          disabled={actionLoading}
          className="p-3 bg-bg-card border border-main rounded-2xl text-muted hover:text-main transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${actionLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-bg-card border border-main rounded-[2.5rem] p-8 md:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-violet/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border tracking-widest uppercase ${statusColors[subscription.status] || statusColors.EXPIRED}`}>
                    {subscription.status}
                  </span>
                  <h3 className="text-4xl font-black text-main mt-4 tracking-tighter">
                    {subscription.plan?.name || 'Pro Plan'}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-main">
                    {subscription.currency === 'INR' ? '₹' : '$'}{subscription.price || subscription.plan?.price}
                  </div>
                  <div className="text-sm font-bold text-muted uppercase tracking-widest">
                    per {subscription.billingInterval?.toLowerCase() || subscription.plan?.billingInterval?.toLowerCase() || 'month'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-main/10">
                <div>
                  <div className="flex items-center gap-2 text-muted mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Started</span>
                  </div>
                  <div className="text-main font-bold">
                    {subscription.startDate ? new Date(subscription.startDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Next Renewal</span>
                  </div>
                  <div className="text-main font-bold">
                    {subscription.nextRenewalDate ? new Date(subscription.nextRenewalDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <div className="flex items-center gap-2 text-muted mb-1">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Auto-Renew</span>
                  </div>
                  <div className={`text-main font-bold flex items-center gap-2`}>
                    <div className={`w-2 h-2 rounded-full ${subscription.autoRenew ? 'bg-accent-lime' : 'bg-red-500'}`}></div>
                    {subscription.autoRenew ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="bg-bg-card border border-main rounded-[2.5rem] p-8 shadow-xl">
            <h4 className="text-xl font-black text-main mb-6">Subscription Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subscription.status === 'ACTIVE' && (
                <button 
                  onClick={() => openConfirm('pause')}
                  className="flex items-center justify-between p-6 bg-accent-orange/5 border border-accent-orange/20 rounded-2xl group hover:bg-accent-orange/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent-orange/10 rounded-xl flex items-center justify-center">
                      <Pause className="h-6 w-6 text-accent-orange" />
                    </div>
                    <div className="text-left">
                      <div className="font-black text-main">Pause Service</div>
                      <div className="text-xs text-muted">Temporarily stop billing</div>
                    </div>
                  </div>
                </button>
              )}

              {subscription.status === 'PAUSED' && (
                <button 
                  onClick={() => openConfirm('resume')}
                  className="flex items-center justify-between p-6 bg-accent-lime/5 border border-accent-lime/20 rounded-2xl group hover:bg-accent-lime/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent-lime/10 rounded-xl flex items-center justify-center">
                      <Play className="h-6 w-6 text-accent-lime" />
                    </div>
                    <div className="text-left">
                      <div className="font-black text-main">Resume Service</div>
                      <div className="text-xs text-muted">Reactivate your plan</div>
                    </div>
                  </div>
                </button>
              )}

              <button 
                onClick={() => window.location.href = '/plans'}
                className="flex items-center justify-between p-6 bg-primary-violet/5 border border-primary-violet/20 rounded-2xl group hover:bg-primary-violet/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-violet/10 rounded-xl flex items-center justify-center">
                    <ArrowUpCircle className="h-6 w-6 text-primary-violet" />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-main">Upgrade Plan</div>
                    <div className="text-xs text-muted">Switch to a higher tier</div>
                  </div>
                </div>
              </button>

              {subscription.status !== 'CANCELLED' && (
                <button 
                  onClick={() => openConfirm('cancel')}
                  className="flex items-center justify-between p-6 bg-red-500/5 border border-red-500/20 rounded-2xl group hover:bg-red-500/10 transition-all md:col-span-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                      <XCircle className="h-6 w-6 text-red-500" />
                    </div>
                    <div className="text-left">
                      <div className="font-black text-main">Cancel Subscription</div>
                      <div className="text-xs text-muted">Stop all future renewals</div>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar/History Summary */}
        <div className="space-y-8">
          <div className="bg-bg-card border border-main rounded-[2.5rem] p-8 shadow-xl">
            <h4 className="text-xl font-black text-main mb-6">Quick History</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-main/5 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-muted" />
                </div>
                <div>
                  <div className="text-sm font-bold text-main">Last Updated</div>
                  <div className="text-xs text-muted">{subscription.updatedAt ? new Date(subscription.updatedAt).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>
              <button 
                onClick={() => window.location.href = '/payments'}
                className="w-full py-3 bg-main/5 hover:bg-main/10 text-main rounded-xl font-bold transition-all text-sm border border-main/10"
              >
                View Full History
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={confirmModal.show}
        onClose={() => setConfirmModal({ ...confirmModal, show: false })}
        onConfirm={handleAction}
        title={confirmModal.title}
        message={confirmModal.message}
        loading={actionLoading}
      />
    </div>
  );
};

export default Subscription;
