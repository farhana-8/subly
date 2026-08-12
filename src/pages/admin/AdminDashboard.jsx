import React from 'react';
import { Users, CreditCard, AlertCircle, Server } from 'lucide-react';

const AdminDashboard = () => {
  const adminStats = [
    { name: 'Total System Users', value: '1,204', icon: Users },
    { name: 'Total MRR', value: '$45,230', icon: CreditCard },
    { name: 'Active Alerts', value: '0', icon: AlertCircle },
    { name: 'System Health', value: '99.9%', icon: Server },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((item) => (
          <div key={item.name} className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gray-700 rounded-md p-3">
                  <item.icon className="h-6 w-6 text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-grow">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">{item.name}</dt>
                    <dd className="text-lg font-medium text-white">{item.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-medium leading-6 text-white mb-4">System Overview</h3>
        <div className="border-t border-gray-700 pt-4">
          <p className="text-gray-400 text-sm">All systems operational. No critical issues detected in the subscription processing pipeline.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
