import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Mail, Shield, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      // Robust parsing for admin users list
      const data = response.data?.data || response.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      addToast('Failed to load users list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-main flex items-center gap-3">
            <Users className="h-8 w-8 text-primary-violet" />
            User Management
          </h2>
          <p className="text-muted mt-1">View and manage all registered users.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-bg-card border border-main rounded-2xl text-main focus:outline-none focus:border-primary-violet transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={fetchUsers}
            className="p-3 bg-bg-card border border-main rounded-2xl text-muted hover:text-main transition-all"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-bg-card border border-main rounded-[2.5rem] overflow-hidden shadow-xl">
        {loading && users.length === 0 ? (
          <div className="p-20 text-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary-violet border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted font-bold">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-20 text-center">
            <Users className="h-16 w-16 text-muted/20 mx-auto mb-6" />
            <h3 className="text-xl font-black text-main mb-2">No users found</h3>
            <p className="text-muted">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-main bg-main/[0.02]">
                  <th className="px-8 py-6 text-xs font-black text-muted uppercase tracking-widest">User</th>
                  <th className="px-8 py-6 text-xs font-black text-muted uppercase tracking-widest">Role</th>
                  <th className="px-8 py-6 text-xs font-black text-muted uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-xs font-black text-muted uppercase tracking-widest">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-main/5">
                {filteredUsers.map((user, idx) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-main/[0.01] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-violet/10 to-primary-magenta/10 flex items-center justify-center text-primary-violet font-black text-lg border border-primary-violet/20 shadow-sm">
                          {(user.firstName || user.name || 'U')[0]}
                        </div>
                        <div>
                          <div className="text-main font-black">{user.firstName} {user.lastName}</div>
                          <div className="text-xs text-muted font-bold flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${
                        user.role === 'ADMIN' ? 'bg-primary-violet/10 text-primary-violet border-primary-violet/20' : 'bg-bg-deep border-main text-muted'
                      }`}>
                        <Shield className="h-3 w-3" />
                        {user.role}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${
                        user.emailVerified ? 'bg-accent-lime/10 text-accent-lime border-accent-lime/20' : 'bg-accent-orange/10 text-accent-orange border-accent-orange/20'
                      }`}>
                        {user.emailVerified ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {user.emailVerified ? 'Verified' : 'Pending'}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-muted">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
