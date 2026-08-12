import api from '../api/axios';

const paymentService = {
  // Get payment history for current user
  getPaymentHistory: async () => {
    return await api.get('/api/payments');
  },
  
  // Get a single payment detail
  getPayment: async (paymentId) => {
    return await api.get(`/api/payments/${paymentId}`);
  },

  // Create a new pending payment record
  createPayment: async (paymentData) => {
    // paymentData = { subscriptionId, amount, currency, paymentMethod, transactionId }
    return await api.post('/api/payments', paymentData);
  },

  // Verify Razorpay payment
  verifyRazorpayPayment: async (verificationData) => {
    // verificationData = { razorpayOrderId, razorpayPaymentId, razorpaySignature }
    return await api.post('/api/payments/verify-razorpay', verificationData);
  }
};

export default paymentService;
