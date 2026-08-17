import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Key, ArrowUpCircle, AlertCircle, RefreshCw, ArrowLeft, CheckCircle2 } from 'lucide-react';
import userService from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import useAuth from '../../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user || null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getCurrentUser();
      const data = response.data?.data || response.data;
      
      if (data) {
        setProfile(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      if (error.response?.status === 401) {
        const cachedUser = user || JSON.parse(localStorage.getItem('user') || 'null');
        if (cachedUser) {
          setProfile(cachedUser);
          setFormData({
            firstName: cachedUser.firstName || '',
            lastName: cachedUser.lastName || '',
            email: cachedUser.email || ''
          });
          setError(null);
        } else {
          setError('Unable to load your profile at this time.');
        }
      } else {
        setError(error.response?.data?.message || 'Unable to load your profile at this time.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await userService.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      const updated = response.data?.data || response.data;
      if (updated) {
        setProfile(updated);
      }
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-main/5 rounded-xl"></div>
        <div className="h-96 bg-bg-card border border-main rounded-[2.5rem]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-bg-card border border-main rounded-[2.5rem] p-12 md:p-20 text-center shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <AlertCircle className="h-20 w-20 text-red-500/50 mx-auto mb-6" />
            <h3 className="text-3xl font-black text-main mb-4 tracking-tighter">Unable to load your profile</h3>
            <p className="text-muted max-w-md mx-auto mb-10 text-lg">{error}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={fetchProfile}
                className="px-10 py-5 bg-primary-violet text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary-violet/20 hover:bg-primary-purple transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-6 w-6" />
                Retry
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black text-main flex items-center gap-3">
          <User className="h-8 w-8 text-primary-violet" />
          Account Settings
        </h2>
        <p className="text-muted mt-1">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-card border border-main rounded-[2.5rem] p-8 md:p-10 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-violet/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="space-y-2 flex-1">
                  <label className="text-xs font-black text-muted uppercase tracking-widest">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <input 
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-bg-deep border border-main rounded-xl text-main focus:outline-none focus:border-primary-violet transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <label className="text-xs font-black text-muted uppercase tracking-widest">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                    <input 
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-bg-deep border border-main rounded-xl text-main focus:outline-none focus:border-primary-violet transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-muted uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input 
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full pl-12 pr-4 py-3 bg-bg-deep/50 border border-main rounded-xl text-muted cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-muted font-bold italic">Email cannot be changed.</p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-8 py-4 bg-primary-violet text-white rounded-2xl font-black text-sm shadow-xl shadow-primary-violet/20 hover:bg-primary-purple transition-all flex items-center justify-center gap-2"
              >
                {saving ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        <div className="space-y-6">
          <div className="bg-bg-card border border-main rounded-[2.5rem] p-8 shadow-xl text-center">
            <div className="relative inline-block mb-6">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary-violet to-primary-magenta flex items-center justify-center text-white text-3xl font-black border-4 border-bg-card shadow-xl">
                {(formData.firstName || 'U')[0]}
              </div>
            </div>
            <h3 className="text-xl font-black text-main">{formData.firstName} {formData.lastName}</h3>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full text-[10px] font-black border uppercase tracking-widest bg-primary-violet/10 text-primary-violet border-primary-violet/20">
              <Shield className="h-3 w-3" />
              {profile?.role || user?.role || 'Member'}
            </div>
          </div>

          <div className="bg-bg-card border border-main rounded-[2.5rem] p-8 shadow-xl">
            <h4 className="text-sm font-black text-main uppercase tracking-widest mb-4">Security</h4>
            <Link 
              to="/forgot-password"
              className="w-full flex items-center justify-between p-4 bg-bg-deep border border-main rounded-2xl hover:border-primary-violet transition-all group"
            >
              <div className="flex items-center gap-3">
                <Key className="h-4 w-4 text-muted group-hover:text-primary-violet" />
                <span className="text-xs font-black text-main">Change Password</span>
              </div>
              <ArrowUpCircle className="h-4 w-4 text-muted rotate-90" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
