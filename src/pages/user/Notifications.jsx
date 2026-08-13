import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2, Circle, Clock, Trash2, CheckSquare, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import notificationService from '../../services/notificationService';
import { useToast } from '../../context/ToastContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationService.getNotifications();
      // Robust parsing for different backend response structures
      const data = response.data?.data || response.data;
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setError('Unable to load notifications. Please try again later.');
      addToast('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      addToast('Notification marked as read', 'success');
    } catch (error) {
      addToast('Failed to mark notification as read', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      addToast('All notifications marked as read', 'success');
    } catch (error) {
      addToast('Failed to mark all as read', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-main/5 rounded-xl"></div>
        <div className="h-64 bg-bg-card border border-main rounded-[2.5rem]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-main mb-2">Notifications</h1>
          <p className="text-muted font-bold">Stay updated with your account activity</p>
        </div>
        <div className="flex items-center gap-3">
          {notifications.some(n => !n.read) && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-bg-deep border border-main rounded-xl text-sm font-black text-main hover:bg-main hover:text-bg-deep transition-all"
            >
              <CheckSquare className="w-4 h-4" />
              Mark all as read
            </button>
          )}
          <button 
            onClick={fetchNotifications}
            className="p-2.5 bg-bg-card border border-main rounded-xl text-muted hover:text-main transition-all"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-bg-card border border-main rounded-[2.5rem] p-12 md:p-20 text-center shadow-xl">
          <AlertCircle className="h-16 w-16 text-red-500/50 mx-auto mb-6" />
          <h3 className="text-xl font-black text-main mb-2">Failed to load notifications</h3>
          <p className="text-muted mb-8">{error}</p>
          <button 
            onClick={fetchNotifications}
            className="px-8 py-4 bg-primary-violet text-white rounded-2xl font-black shadow-lg hover:bg-primary-purple transition-all flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </button>
        </div>
      ) : (
        <div className="bg-bg-card border border-main rounded-[2.5rem] overflow-hidden shadow-xl">
          {notifications.length === 0 ? (
            <div className="p-12 md:p-20 text-center">
              <Sparkles className="w-16 h-16 text-primary-violet/20 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-main mb-4 tracking-tighter">You're all caught up</h3>
              <p className="text-muted max-w-sm mx-auto">
                No notifications yet. We'll notify you when something important happens.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-main/5">
              {notifications.map((notification, idx) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-6 flex gap-4 hover:bg-primary-violet/[0.02] transition-colors ${!notification.read ? 'bg-primary-violet/[0.02]' : ''}`}
                >
                  <div className={`mt-1 p-2.5 rounded-xl flex-shrink-0 ${!notification.read ? 'bg-primary-violet text-white shadow-lg shadow-primary-violet/20' : 'bg-bg-deep text-muted border border-main'}`}>
                    {notification.read ? <CheckCircle2 className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-black text-main ${!notification.read ? 'text-lg' : ''}`}>
                        {notification.title}
                      </h3>
                      <span className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted font-medium text-sm leading-relaxed">
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="mt-3 text-xs font-black text-primary-violet hover:underline flex items-center gap-1"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
