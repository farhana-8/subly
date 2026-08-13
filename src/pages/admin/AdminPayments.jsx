import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Search, RotateCcw, CheckCircle2, XCircle, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmRefund, setConfirmRefund] = useState({ open: false, id: null });
  const [actionLoading, setActionLoading] = useState(false);
  
  const { addToast } = useToast();

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllPayments();
      // Robust parsing for admin payments list
      const data = response.data?.data || response.data || [];
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      addToast('Failed to load payments list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRefund = async () => {
    try {
      setActionLoading(true);
      await adminService.refundPayment(confirmRefund.id);
      addToast('Refund initiated successfully', 'success');
      setConfirmRefund({ open: false, id: null });
      fetchPayments();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to initiate refund', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => 
    payment.gatewayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors = {
    SUCCESS: 'bg-accent-lime/10 text-accent-lime border-accent-lime/20',
    CAPTURED: 'bg-accent-lime/10 text-accent-lime border-accent-lime/20',
    FAILED: 'bg-red-500/10 text-red-500 border-red-500/20',
    PENDING: 'bg-accent-orange/10 text-accent-orange border-accent-orange/20',
    CREATED: 'bg-accent-orange/10 text-accent-orange border-accent-orange/20',
    REFUNDED: 'bg-primary-violet/10 text-primary-violet border-primary-violet/20'
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-main flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary-violet" />
            Payment History
          </h2>
          <p className="text-muted mt-1">Monitor all system transactions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <input 
              type="text"
              placeholder="Search by ID, name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-bg-card border border-main rounded-2xl text-main focus:outline-none focus:border-primary-violet transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={fetchPayments}
            className="p-3 bg-bg-card border border-main rounded-2xl text-muted hover:text-main transition-all"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-bg-card border border-main rounded-[2.5rem] overflow-hidden shadow-xl">
        {loading && payments.length === 0 ? (
          <div className="p-20 text-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary-violet border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted font-bold">Loading payments...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-20 text-center">
            <CreditCard className="h-16 w-16 text-muted/20 mx-auto mb-6" />
            <h3 className="text-xl font-black text-main mb-2">No payments found</h3>
            <p className="text-muted">No transactions match your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-main bg-main/[0.02]">
                  <th className="px-8 py-6 text-xs font-black text-muted uppercase tracking-widest">Transaction</th>
                  <th className="px-8 py-6 text-xs font-black text-muted uppercase tracking-widest">User</th>
                  <th className="px-8 py-6 text-xs font-black text-muted uppercase tracking-widest text-right">Amount</th>
                  <th className="px-8 py-6 text-xs font-black text-muted uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-xs font-black text-muted uppercase tracking-widest">Date</th>
                  <th className="px-8 py-6 text-xs font-black text-muted uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-main/5">
                {filteredPayments.map((payment, idx) => (
                  <motion.tr 
                    key={payment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-main/[0.01] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="text-main font-black flex items-center gap-2">
                        {payment.gatewayPaymentId || payment.transactionId || 'N/A'}
                        <ExternalLink className="h-3 w-3 text-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                      </div>
                      <div className="text-[10px] text-muted font-bold uppercase tracking-wider">{payment.paymentMethod || 'RAZORPAY'}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-main font-bold">{payment.userName || 'Unknown'}</div>
                      <div className="text-xs text-muted font-medium">{payment.userEmail || 'N/A'}</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="text-main font-black">{payment.currency === 'INR' ? '₹' : '$'}{payment.amount}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${
                        statusColors[payment.status] || 'bg-bg-deep border-main text-muted'
                      }`}>
                        {payment.status === 'SUCCESS' || payment.status === 'CAPTURED' ? <CheckCircle2 className="h-3 w-3" /> : 
                         payment.status === 'FAILED' ? <XCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {payment.status}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-muted">
                      {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-8 py-6 text-right">
                      {(payment.status === 'SUCCESS' || payment.status === 'CAPTURED') && (
                        <button 
                          onClick={() => setConfirmRefund({ open: true, id: payment.id })}
                          className="p-2 bg-bg-deep border border-main rounded-xl text-muted hover:text-primary-violet transition-all group/btn shadow-sm"
                          title="Refund Payment"
                        >
                          <RotateCcw className="h-4 w-4 group-hover/btn:rotate-[-45deg] transition-transform" />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog 
        isOpen={confirmRefund.open}
        onClose={() => setConfirmRefund({ open: false, id: null })}
        onConfirm={handleRefund}
        title="Refund Payment?"
        message="Are you sure you want to refund this payment? This will notify the user and update the subscription status."
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminPayments;
