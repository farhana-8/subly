import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Calendar,
  CreditCard,
  RefreshCw,
  Pause,
  Play,
  XCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const SubscriptionCard = ({
  subscription,
  onAction,
  actionLoading = false
}) => {
  const navigate = useNavigate();

  /**
   * No subscription at all.
   */
  if (!subscription) {
    return (
      <div className="bg-bg-card border border-main rounded-[2rem] p-8 text-center shadow-xl">

        <div className="w-16 h-16 bg-primary-violet/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Zap className="h-8 w-8 text-primary-violet" />
        </div>

        <h3 className="text-xl font-black text-main mb-2">
          No Subscription
        </h3>

        <p className="text-muted mb-8">
          You don't have a subscription. Subscribe now to unlock all features.
        </p>

        <button
          onClick={() => navigate('/plans')}
          className="px-8 py-3 bg-primary-violet text-white rounded-full font-bold hover:bg-primary-purple transition-all shadow-lg shadow-primary-violet/20"
        >
          Explore Plans
        </button>

      </div>
    );
  }

  const {
    id,
    plan,
    status,
    startDate,
    endDate,
    autoRenew
  } = subscription;

  const price = plan?.price ?? 0;

  const billingInterval =
    plan?.billingInterval?.toLowerCase() || 'month';

  const statusColors = {
    ACTIVE:
      'text-accent-lime bg-accent-lime/10 border-accent-lime/20',

    PAUSED:
      'text-accent-orange bg-accent-orange/10 border-accent-orange/20',

    CANCELLED:
      'text-red-500 bg-red-500/10 border-red-500/20',

    EXPIRED:
      'text-muted bg-main/5 border-main/10'
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="bg-bg-card border border-main rounded-[2rem] p-8 shadow-xl relative overflow-hidden"
    >

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">

        <div>

          <div className="flex items-center gap-3 mb-2">

            <h3 className="text-2xl font-black text-main">
              {plan?.name || 'Subscription Plan'}
            </h3>

            <span
              className={`px-3 py-1 rounded-full text-xs font-black border ${
                statusColors[status] ||
                statusColors.EXPIRED
              }`}
            >
              {status}
            </span>

          </div>

          <p className="text-muted text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />

            Started on{' '}

            {startDate
              ? new Date(
                  startDate
                ).toLocaleDateString()
              : 'N/A'}
          </p>

        </div>

        {/* Price */}
        <div className="text-left md:text-right">

          <div className="text-3xl font-black text-main mb-1">

            ₹{price}

            <span className="text-sm text-muted font-bold">
              /{billingInterval}
            </span>

          </div>

          <p className="text-xs text-muted font-bold uppercase tracking-widest">
            Current Billing Cycle
          </p>

        </div>

      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* End date */}
        <div className="bg-bg-deep border border-main rounded-2xl p-4 flex items-center gap-4">

          <div className="bg-primary-violet/10 p-2 rounded-lg text-primary-violet">
            <RefreshCw className="h-5 w-5" />
          </div>

          <div>

            <p className="text-xs text-muted font-bold uppercase">
              {status === 'ACTIVE'
                ? 'Next Renewal'
                : 'End Date'}
            </p>

            <p className="text-main font-bold">
              {endDate
                ? new Date(
                    endDate
                  ).toLocaleDateString()
                : 'N/A'}
            </p>

          </div>

        </div>

        {/* Billing */}
        <div className="bg-bg-deep border border-main rounded-2xl p-4 flex items-center gap-4">

          <div className="bg-primary-magenta/10 p-2 rounded-lg text-primary-magenta">
            <CreditCard className="h-5 w-5" />
          </div>

          <div>

            <p className="text-xs text-muted font-bold uppercase">
              Auto-Renew
            </p>

            <p className="text-main font-bold">
              {autoRenew
                ? 'Enabled'
                : 'Disabled'}
            </p>

          </div>

        </div>

      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">

        {/* ACTIVE */}
        {status === 'ACTIVE' && (
          <>
            <button
              onClick={() => onAction('pause', id)}
              disabled={actionLoading}
              className="px-6 py-2.5 bg-bg-deep border border-main text-main rounded-xl font-bold hover:bg-main/5 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Pause className="h-4 w-4" />
              Pause
            </button>

            <button
              onClick={() => onAction('cancel', id)}
              disabled={actionLoading}
              className="px-6 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold hover:bg-red-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </button>

            <button
              onClick={() => navigate('/plans')}
              className="px-6 py-2.5 bg-primary-violet text-white rounded-xl font-bold hover:bg-primary-purple transition-all shadow-lg shadow-primary-violet/20 ml-auto"
            >
              Upgrade Plan
            </button>
          </>
        )}

        {/* PAUSED */}
        {status === 'PAUSED' && (
          <>
            <button
              onClick={() => onAction('resume', id)}
              disabled={actionLoading}
              className="px-6 py-2.5 bg-accent-lime text-white rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              Resume
            </button>

            <button
              onClick={() => onAction('cancel', id)}
              disabled={actionLoading}
              className="px-6 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold hover:bg-red-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </button>
          </>
        )}

        {/* CANCELLED */}
        {status === 'CANCELLED' && (
          <>
            <div className="flex items-center gap-2 text-red-500 font-bold text-sm">

              <XCircle className="h-4 w-4" />

              Subscription Cancelled

            </div>

            <button
              onClick={() => navigate('/plans')}
              className="px-6 py-2.5 bg-primary-violet text-white rounded-xl font-bold hover:bg-primary-purple transition-all shadow-lg shadow-primary-violet/20 ml-auto flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Subscribe Again
            </button>
          </>
        )}

        {/* EXPIRED */}
        {status === 'EXPIRED' && (
          <>
            <div className="flex items-center gap-2 text-muted font-bold text-sm">

              <AlertCircle className="h-4 w-4" />

              Subscription Expired

            </div>

            <button
              onClick={() => navigate('/plans')}
              className="px-6 py-2.5 bg-primary-violet text-white rounded-xl font-bold hover:bg-primary-purple transition-all shadow-lg shadow-primary-violet/20 ml-auto"
            >
              Choose New Plan
            </button>
          </>
        )}

      </div>
    </motion.div>
  );
};

export default SubscriptionCard;