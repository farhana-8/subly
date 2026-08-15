import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, Shield, Activity, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalPayments: 0,
    activePlans: 0,
    revenueCurrency: 'INR'
  });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [usersRes, revenueRes, paymentsRes, plansRes] = await Promise.all([
          adminService.getAllUsers(),
          adminService.getRevenue(),
          adminService.getAllPayments(),
          adminService.getAllPlans()
        ]);

        // Robust parsing for admin stats
        const users = usersRes.data?.data || usersRes.data || [];
        const payments = paymentsRes.data?.data || paymentsRes.data || [];
        const plans = plansRes.data?.data || plansRes.data || [];
        const revenuePayload = revenueRes.data?.data || revenueRes.data || {};
        const revenue = typeof revenuePayload === 'number' ? revenuePayload : revenuePayload.totalRevenue;

        setStats({
          totalUsers: Array.isArray(users) ? users.length : 0,
          totalRevenue: Number(revenue || 0),
          totalPayments: Array.isArray(payments) ? payments.length : 0,
          activePlans: Array.isArray(plans) ? plans.filter(p => p.active).length : 0,
          revenueCurrency: typeof revenuePayload === 'object' ? (revenuePayload.currency || 'INR') : 'INR'
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        addToast('Failed to load dashboard metrics', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      name: 'Total Users', 
      value: stats.totalUsers.toLocaleString(), 
      icon: Users, 
      color: 'from-primary-violet to-primary-purple'
    },
    { 
      name: 'Total Revenue', 
      value: `${stats.revenueCurrency === 'INR' ? '₹' : stats.revenueCurrency ? `${stats.revenueCurrency} ` : ''}${stats.totalRevenue.toLocaleString()}`, 
      icon: CreditCard, 
      color: 'from-accent-lime to-emerald-500'
    },
    { 
      name: 'Total Payments', 
      value: stats.totalPayments.toLocaleString(), 
      icon: Activity, 
      color: 'from-primary-magenta to-accent-coral'
    },
    { 
      name: 'Active Plans', 
      value: stats.activePlans.toLocaleString(), 
      icon: Zap, 
      color: 'from-accent-cyan to-primary-violet'
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-40 bg-bg-card border border-main rounded-[2rem]"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((item, idx) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-bg-card border border-main rounded-[2rem] p-6 shadow-xl relative overflow-hidden group hover:border-primary-violet/30 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-main/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary-violet/5 transition-all"></div>
            
            <div className="relative z-10 space-y-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg shadow-black/20`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
              
              <div>
                <p className="text-xs font-black text-muted uppercase tracking-widest">{item.name}</p>
                <h3 className="text-3xl font-black text-main mt-1">{item.value}</h3>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Live System Data</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-bg-card border border-main rounded-[2.5rem] p-8 shadow-xl">
          <h3 className="text-xl font-black text-main mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary-violet" />
            Data Snapshot
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-main bg-bg-deep p-4">
              <span className="text-sm font-bold text-main">User records loaded</span>
              <span className="text-sm font-black text-primary-violet">{stats.totalUsers}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-main bg-bg-deep p-4">
              <span className="text-sm font-bold text-main">Payment records loaded</span>
              <span className="text-sm font-black text-primary-violet">{stats.totalPayments}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-main bg-bg-deep p-4">
              <span className="text-sm font-bold text-main">Active plans loaded</span>
              <span className="text-sm font-black text-primary-violet">{stats.activePlans}</span>
            </div>
          </div>
        </div>

        <div className="bg-bg-card border border-main rounded-[2.5rem] p-8 shadow-xl">
          <h3 className="text-xl font-black text-main mb-6 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary-magenta" />
            Admin Quick Links
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/users" className="p-4 bg-bg-deep border border-main rounded-2xl text-center hover:border-primary-violet transition-all group">
              <Users className="h-6 w-6 mx-auto mb-2 text-muted group-hover:text-primary-violet" />
              <span className="text-xs font-black text-main">Manage Users</span>
            </Link>
            <Link to="/admin/plans" className="p-4 bg-bg-deep border border-main rounded-2xl text-center hover:border-primary-violet transition-all group">
              <Zap className="h-6 w-6 mx-auto mb-2 text-muted group-hover:text-primary-violet" />
              <span className="text-xs font-black text-main">Manage Plans</span>
            </Link>
            <Link to="/admin/payments" className="p-4 bg-bg-deep border border-main rounded-2xl text-center hover:border-primary-violet transition-all group">
              <CreditCard className="h-6 w-6 mx-auto mb-2 text-muted group-hover:text-primary-violet" />
              <span className="text-xs font-black text-main">Review Payments</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
