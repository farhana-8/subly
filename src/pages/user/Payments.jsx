import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, CheckCircle2, XCircle, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import paymentService from '../../services/paymentService';
import { useToast } from '../../context/ToastContext';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentService.getPaymentHistory({ skipAuthRedirect: true });
      // Robust parsing for different backend response structures
      const data = response.data?.data || response.data;
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      setError('Unable to load payment history. Please try again later.');
      addToast('Failed to load payment history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const formatDate = (value) => value ? new Date(value).toLocaleString() : 'N/A';
  const formatAmount = (payment) => {
    if (payment.amount === undefined || payment.amount === null) return '—';
    const prefix = payment.currency === 'INR' ? '₹' : payment.currency ? `${payment.currency} ` : '';
    return `${prefix}${payment.amount}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS':
      case 'CAPTURED':
        return <CheckCircle2 className="h-4 w-4 text-accent-lime" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'PENDING':
      case 'CREATED':
        return <Clock className="h-4 w-4 text-accent-orange" />;
      default:
        return <Clock className="h-4 w-4 text-muted" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'SUCCESS':
      case 'CAPTURED':
        return 'bg-accent-lime/10 text-accent-lime border-accent-lime/20';
      case 'FAILED':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'PENDING':
      case 'CREATED':
        return 'bg-accent-orange/10 text-accent-orange border-accent-orange/20';
      default:
        return 'bg-main/5 text-muted border-main/10';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-5xl mx-auto">
        <div className="h-10 w-48 bg-main/5 rounded-lg"></div>
        <div className="bg-bg-card border border-main rounded-[2.5rem] h-96"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-main flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary-violet" />
            Payments
          </h2>
          <p className="text-muted mt-1">Track your subscription payments and billing activity.</p>
        </div>
        <button 
          onClick={fetchPayments}
          className="p-3 bg-bg-card border border-main rounded-2xl text-muted hover:text-main transition-all"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {error ? (
        <div className="bg-bg-card border border-main rounded-[2.5rem] p-12 md:p-20 text-center shadow-xl">
          <AlertCircle className="h-16 w-16 text-red-500/50 mx-auto mb-6" />
          <h3 className="text-xl font-black text-main mb-2">Failed to load history</h3>
          <p className="text-muted mb-8">{error}</p>
          <button 
            onClick={fetchPayments}
            className="px-8 py-4 bg-primary-violet text-white rounded-2xl font-black shadow-lg hover:bg-primary-purple transition-all flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </button>
        </div>
      ) : (
        <div className="bg-bg-card border border-main rounded-[2.5rem] overflow-hidden shadow-xl">
          {payments.length === 0 ? (
            <div className="p-12 md:p-20 text-center">
              <div className="w-20 h-20 bg-main/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="h-10 w-10 text-muted opacity-20" />
              </div>
              <h3 className="text-2xl font-black text-main mb-4 tracking-tighter">No payments yet</h3>
              <p className="text-muted max-w-sm mx-auto">
                Your payment history will appear here after your first transaction.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-main bg-main/[0.02]">
                    <th className="px-6 py-5 text-xs font-black text-muted uppercase tracking-widest">Date</th>
                    <th className="px-6 py-5 text-xs font-black text-muted uppercase tracking-widest">Transaction ID</th>
                    <th className="px-6 py-5 text-xs font-black text-muted uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-5 text-xs font-black text-muted uppercase tracking-widest">Method</th>
                    <th className="px-6 py-5 text-xs font-black text-muted uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-main/5">
                  {payments.map((payment, idx) => (
                    <motion.tr 
                      key={payment.id || payment.gatewayPaymentId || payment.transactionId || `payment-${idx}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-main/[0.01] transition-colors"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-main font-bold">
                          <Calendar className="h-4 w-4 text-muted" />
                          {formatDate(payment.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-5 font-mono text-xs text-muted">
                        {payment.gatewayPaymentId || payment.transactionId || 'N/A'}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-main font-black">
                          {formatAmount(payment)}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-xs font-bold text-muted uppercase tracking-tighter">
                          {payment.paymentMethod || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border ${getStatusClass(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Payments;
