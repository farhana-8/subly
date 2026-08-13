import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2, Circle, Clock, Trash2, CheckSquare } from 'lucide-react';
import notificationService from '../../services/notificationService';
import { useToast } from '../../context/ToastContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications();
      setNotifications(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-main mb-2">Notifications</h1>
          <p className="text-muted font-bold">Stay updated with your account activity</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-bg-deep border border-main rounded-xl text-sm font-black text-main hover:bg-main hover:text-bg-deep transition-all"
          >
            <CheckSquare className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-bg-card border border-main rounded-[2rem] overflow-hidden shadow-neo">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-violet border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted font-bold">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-muted/30 mx-auto mb-4" />
            <p className="text-muted font-bold text-lg">No notifications yet</p>
            <p className="text-muted/60 text-sm">We'll notify you when something important happens.</p>
          </div>
        ) : (
          <div className="divide-y divide-main">
            {notifications.map((notification, idx) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-6 flex gap-4 hover:bg-primary-violet/5 transition-colors ${!notification.read ? 'bg-primary-violet/5' : ''}`}
              >
                <div className={`mt-1 p-2 rounded-lg ${!notification.read ? 'bg-primary-violet text-white' : 'bg-bg-deep text-muted'}`}>
                  {notification.read ? <CheckCircle2 className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-black text-main ${!notification.read ? 'text-lg' : ''}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs font-bold text-muted flex items-center gap-1">
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
                      className="mt-2 text-xs font-black text-primary-violet hover:underline flex items-center gap-1"
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
    </div>
  );
};

export default Notifications;
