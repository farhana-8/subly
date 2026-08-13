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

  // Create a new payment record
  createPayment: async (paymentData) => {
    // paymentData = { subscriptionId, amount, currency, paymentMethod }
    return await api.post('/api/payments', paymentData);
  },

  // Verify Razorpay payment
  verifyRazorpayPayment: async (verificationData) => {
    // verificationData = { razorpayOrderId, razorpayPaymentId, razorpaySignature }
    return await api.post('/api/payments/verify-razorpay', verificationData);
  },

  // Mark payment as success
  markPaymentSuccess: async (id) => {
    return await api.post(`/api/payments/${id}/success`);
  },

  // Mark payment as fail
  markPaymentFail: async (id) => {
    return await api.post(`/api/payments/${id}/fail`);
  },

  // Refund a payment
  refundPayment: async (id) => {
    return await api.post(`/api/payments/${id}/refund`);
  }
};

export default paymentService;
