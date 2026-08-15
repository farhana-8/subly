import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Calendar, CreditCard, RefreshCw, Pause, Play, XCircle } from 'lucide-react';

const SubscriptionCard = ({ subscription, onAction, actionLoading = false }) => {
  const navigate = useNavigate();

  if (!subscription) {
    return (
      <div className="bg-bg-card border border-main rounded-[2rem] p-8 text-center shadow-xl">
        <div className="w-16 h-16 bg-primary-violet/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Zap className="h-8 w-8 text-primary-violet" />
        </div>
        <h3 className="text-xl font-black text-main mb-2">No Active Subscription</h3>
        <p className="text-muted mb-8">You don't have an active plan. Subscribe now to unlock all features.</p>
        <button 
          onClick={() => navigate('/plans')}
          className="px-8 py-3 bg-primary-violet text-white rounded-full font-bold hover:bg-primary-purple transition-all shadow-lg shadow-primary-violet/20"
        >
          Explore Plans
        </button>
      </div>
    );
  }

  const { plan, status, nextRenewalDate, startDate, price, currency, interval } = subscription;

  const statusColors = {
    ACTIVE: 'text-accent-lime bg-accent-lime/10 border-accent-lime/20',
    PAUSED: 'text-accent-orange bg-accent-orange/10 border-accent-orange/20',
    CANCELLED: 'text-red-500 bg-red-500/10 border-red-500/20',
    EXPIRED: 'text-gray-500 bg-gray-500/10 border-gray-500/20'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-card border border-main rounded-[2rem] p-8 shadow-xl relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-black text-main">{plan?.name || 'Pro Plan'}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-black border ${statusColors[status] || statusColors.ACTIVE}`}>
              {status || 'ACTIVE'}
            </span>
          </div>
          <p className="text-muted text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Started on {startDate ? new Date(startDate).toLocaleDateString() : 'N/A'}
          </p>
        </div>
        <div className="text-left md:text-right">
          <div className="text-3xl font-black text-main mb-1">
            {currency === 'INR' ? '₹' : '$'}{price || plan?.price || '0'}
            <span className="text-sm text-muted font-bold">/{interval || plan?.billingInterval?.toLowerCase() || 'month'}</span>
          </div>
          <p className="text-xs text-muted font-bold uppercase tracking-widest">Current Billing Cycle</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-bg-deep border border-main rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-primary-violet/10 p-2 rounded-lg text-primary-violet">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted font-bold uppercase">Next Renewal</p>
            <p className="text-main font-bold">{nextRenewalDate ? new Date(nextRenewalDate).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
        <div className="bg-bg-deep border border-main rounded-2xl p-4 flex items-center gap-4">
          <div className="bg-primary-magenta/10 p-2 rounded-lg text-primary-magenta">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted font-bold uppercase">Billing Interval</p>
            <p className="text-main font-bold">{interval || plan?.billingInterval || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {status === 'ACTIVE' && (
          <>
            <button 
              onClick={() => onAction('pause')}
              disabled={actionLoading}
              className="px-6 py-2.5 bg-bg-deep border border-main text-main rounded-xl font-bold hover:bg-main/5 transition-all flex items-center gap-2"
            >
              <Pause className="h-4 w-4" /> Pause
            </button>
            <button 
              onClick={() => onAction('cancel')}
              disabled={actionLoading}
              className="px-6 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold hover:bg-red-500/20 transition-all flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" /> Cancel
            </button>
            <button 
              onClick={() => navigate('/plans')}
              className="px-6 py-2.5 bg-primary-violet text-white rounded-xl font-bold hover:bg-primary-purple transition-all shadow-lg shadow-primary-violet/20 ml-auto"
            >
              Upgrade Plan
            </button>
          </>
        )}
        {status === 'PAUSED' && (
          <>
            <button 
              onClick={() => onAction('resume')}
              disabled={actionLoading}
              className="px-6 py-2.5 bg-accent-lime text-white rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-2"
            >
              <Play className="h-4 w-4" /> Resume
            </button>
            <button 
              onClick={() => onAction('cancel')}
              disabled={actionLoading}
              className="px-6 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold hover:bg-red-500/20 transition-all flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" /> Cancel
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SubscriptionCard;
