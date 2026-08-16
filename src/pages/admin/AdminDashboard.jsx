import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, Shield, Activity, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: null,
    totalRevenue: null,
    totalPayments: null,
    activePlans: null,
    revenueCurrency: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError('');
        const results = await Promise.allSettled([
          adminService.getAllUsers(),
          adminService.getRevenue(),
          adminService.getAllPayments(),
          adminService.getAllPlans()
        ]);
        const [usersResult, revenueResult, paymentsResult, plansResult] = results;
        const readPayload = (result) => result.status === 'fulfilled'
          ? (result.value.data?.data || result.value.data)
          : null;
        const users = readPayload(usersResult);
        const payments = readPayload(paymentsResult);
        const plans = readPayload(plansResult);
        const revenuePayload = readPayload(revenueResult);
        const revenue = typeof revenuePayload === 'number' ? revenuePayload : revenuePayload?.totalRevenue;
        const partialFailure = results.some((result) => result.status === 'rejected');

        setStats({
          totalUsers: Array.isArray(users) ? users.length : null,
          totalRevenue: revenue === null || revenue === undefined ? null : Number(revenue),
          totalPayments: Array.isArray(payments) ? payments.length : null,
          activePlans: Array.isArray(plans) ? plans.filter((plan) => plan.active).length : null,
          revenueCurrency: revenuePayload?.currency || null
        });
        if (partialFailure) {
          setError('Some dashboard metrics could not be loaded. The unavailable values are not estimated.');
          addToast('Some dashboard metrics could not be loaded', 'error');
        }
      } catch (fetchError) {
        console.error('Failed to fetch admin stats:', fetchError);
        setError('Dashboard metrics are unavailable. Retry to request the live backend data again.');
        addToast('Failed to load dashboard metrics', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const displayCount = (value) => value === null || value === undefined ? '—' : value.toLocaleString();
  const displayRevenue = stats.totalRevenue === null || stats.totalRevenue === undefined
    ? '—'
    : `${stats.revenueCurrency === 'INR' ? '₹' : stats.revenueCurrency ? `${stats.revenueCurrency} ` : ''}${stats.totalRevenue.toLocaleString()}`;

  const statCards = [
    { 
      name: 'Total Users', 
      value: displayCount(stats.totalUsers), 
      icon: Users, 
      color: 'from-primary-violet to-primary-purple'
    },
    { 
      name: 'Total Revenue', 
      value: displayRevenue, 
      icon: CreditCard, 
      color: 'from-accent-lime to-emerald-500'
    },
    { 
      name: 'Total Payments', 
      value: displayCount(stats.totalPayments), 
      icon: Activity, 
      color: 'from-primary-magenta to-accent-coral'
    },
    { 
      name: 'Active Plans', 
      value: displayCount(stats.activePlans), 
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
      {error && (
        <div className="flex flex-col gap-3 rounded-2xl border border-accent-orange/30 bg-accent-orange/10 p-4 text-sm text-main sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>
          <button onClick={fetchStats} className="rounded-xl bg-primary-violet px-4 py-2 font-black text-white hover:bg-primary-purple">Retry</button>
        </div>
      )}
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
              <span className="text-sm font-black text-primary-violet">{displayCount(stats.totalUsers)}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-main bg-bg-deep p-4">
              <span className="text-sm font-bold text-main">Payment records loaded</span>
              <span className="text-sm font-black text-primary-violet">{displayCount(stats.totalPayments)}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-main bg-bg-deep p-4">
              <span className="text-sm font-bold text-main">Active plans loaded</span>
              <span className="text-sm font-black text-primary-violet">{displayCount(stats.activePlans)}</span>
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
