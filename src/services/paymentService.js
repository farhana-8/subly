import api from '../api/axios';

const paymentService = {
  getPaymentHistory: async (config = {}) => {
    return await api.get('/api/payments', config);
  },

  getPayment: async (paymentId, config = {}) => {
    return await api.get(`/api/payments/${paymentId}`, config);
  },

  createPayment: async (paymentData, config = {}) => {
    return await api.post('/api/payments', paymentData, config);
  },

  verifyRazorpayPayment: async (verificationData, config = {}) => {
    return await api.post('/api/payments/verify-razorpay', verificationData, config);
  },

  markPaymentSuccess: async (id, config = {}) => {
    return await api.post(`/api/payments/${id}/success`, {}, config);
  },

  markPaymentFail: async (id, config = {}) => {
    return await api.post(`/api/payments/${id}/fail`, {}, config);
  },

  refundPayment: async (id, config = {}) => {
    return await api.post(`/api/payments/${id}/refund`, {}, config);
  },

  downloadInvoice: async (paymentId, config = {}) => {
    return await api.get(`/api/payments/${paymentId}/invoice`, {
      ...config,
      responseType: 'blob'
    });
  }
};

export default paymentService;
