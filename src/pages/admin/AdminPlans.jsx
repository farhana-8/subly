import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Plus, Edit2, Trash2, CheckCircle2, XCircle, DollarSign, Clock, RefreshCw } from 'lucide-react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Modal from '../../components/common/Modal';

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    billingInterval: 'MONTHLY',
    active: true
  });
  
  const { addToast } = useToast();

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminService.getAllPlans();
      // Robust parsing for admin plans list
      const data = response.data?.data || response.data || [];
      setPlans(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      console.error('Failed to fetch plans:', fetchError);
      setError('Plans are unavailable. Retry to request the live backend data again.');
      addToast('Failed to load plans', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        description: plan.description,
        price: plan.price,
        billingInterval: plan.billingInterval,
        active: plan.active
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        billingInterval: 'MONTHLY',
        active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (actionLoading) return;

    const numericPrice = Number(formData.price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      addToast('Please enter a valid price', 'error');
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: numericPrice,
        billingInterval: formData.billingInterval,
        active: formData.active
      };

      if (editingPlan) {
        await adminService.updatePlan(editingPlan.id, payload);
        addToast('Plan updated successfully', 'success');
      } else {
        await adminService.createPlan(payload);
        addToast('Plan created successfully', 'success');
      }
      setIsModalOpen(false);
      fetchPlans();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to save plan', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (actionLoading) return;
    try {
      setActionLoading(true);
      await adminService.deletePlan(confirmDelete.id);
      addToast('Plan deactivated successfully', 'success');
      setConfirmDelete({ open: false, id: null });
      fetchPlans();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to deactivate plan', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-main flex items-center gap-3">
            <Zap className="h-8 w-8 text-primary-violet" />
            Plan Management
          </h2>
          <p className="text-muted mt-1">Configure your subscription tiers.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchPlans}
            className="p-3 bg-bg-card border border-main rounded-2xl text-muted hover:text-main transition-all"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-primary-violet text-white rounded-2xl font-black shadow-lg shadow-primary-violet/20 hover:scale-105 transition-all"
          >
            <Plus className="h-5 w-5" />
            Create New Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && plans.length === 0 ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-bg-card border border-main rounded-[2.5rem] animate-pulse"></div>
          ))
        ) : plans.length === 0 ? (
          <div className="col-span-full p-20 text-center bg-bg-card border border-main rounded-[2.5rem] shadow-xl">
            <Zap className="h-16 w-16 text-muted/20 mx-auto mb-6" />
            <h3 className="text-xl font-black text-main mb-2">No plans configured</h3>
            <p className="text-muted">Start by creating your first subscription tier.</p>
          </div>
        ) : (
          plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-bg-card border border-main rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group hover:border-primary-violet/30 transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${
                  plan.active ? 'bg-accent-lime/10 text-accent-lime border-accent-lime/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>
                  {plan.active ? 'Active' : 'Inactive'}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(plan)} className="p-2 bg-bg-deep border border-main rounded-xl text-muted hover:text-primary-violet transition-all">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setConfirmDelete({ open: true, id: plan.id })} className="p-2 bg-bg-deep border border-main rounded-xl text-muted hover:text-red-500 transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-black text-main mb-2">{plan.name}</h3>
              <p className="text-muted text-sm font-medium mb-8 line-clamp-2">{plan.description || 'No description provided.'}</p>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl font-black text-main">₹{plan.price}</span>
                <span className="text-xs font-bold text-muted uppercase tracking-widest">/ {plan.billingInterval?.toLowerCase() || 'monthly'}</span>
              </div>

              <div className="pt-6 border-t border-main/10 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-bold text-muted">
                  <DollarSign className="h-4 w-4" />
                  INR
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted">
                  <Clock className="h-4 w-4" />
                  {plan.billingInterval}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingPlan ? 'Edit Plan' : 'Create New Plan'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-muted uppercase tracking-widest">Plan Name</label>
            <input 
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 bg-bg-deep border border-main rounded-xl text-main focus:outline-none focus:border-primary-violet transition-all"
              placeholder="e.g. Pro Monthly"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-muted uppercase tracking-widest">Description</label>
            <textarea 
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 bg-bg-deep border border-main rounded-xl text-main focus:outline-none focus:border-primary-violet h-24 resize-none transition-all"
              placeholder="What's included in this plan?"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-muted uppercase tracking-widest">Price</label>
              <input 
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-4 py-3 bg-bg-deep border border-main rounded-xl text-main focus:outline-none focus:border-primary-violet transition-all"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-muted uppercase tracking-widest">Billing Interval</label>
              <select 
                value={formData.billingInterval}
                onChange={(e) => setFormData({...formData, billingInterval: e.target.value})}
                className="w-full px-4 py-3 bg-bg-deep border border-main rounded-xl text-main focus:outline-none focus:border-primary-violet transition-all"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({...formData, active: e.target.checked})}
              className="w-5 h-5 rounded-lg border-main text-primary-violet focus:ring-primary-violet"
            />
            <label htmlFor="active" className="text-sm font-bold text-main">Active and visible to users</label>
          </div>
            <button 
            type="submit"
            disabled={actionLoading}
            className="w-full py-4 bg-primary-violet text-white rounded-2xl font-black shadow-lg shadow-primary-violet/20 hover:bg-primary-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading ? 'Saving...' : (editingPlan ? 'Save Changes' : 'Create Plan')}
          </button>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Deactivate Plan?"
        message="Are you sure you want to deactivate this plan? Users will no longer be able to subscribe to it."
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminPlans;
