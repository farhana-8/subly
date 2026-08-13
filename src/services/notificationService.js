import api from '../api/axios';

const notificationService = {
  // Get all notifications for current user
  getNotifications: async () => {
    return await api.get('/api/notifications');
  },

  // Get unread notifications count/list
  getUnreadNotifications: async () => {
    return await api.get('/api/notifications/unread');
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return await api.put('/api/notifications/read-all');
  },

  // Mark a specific notification as read
  markAsRead: async (id) => {
    return await api.put(`/api/notifications/${id}/read`);
  }
};

export default notificationService;
