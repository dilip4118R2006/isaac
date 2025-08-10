import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Package, 
  Clock, 
  CheckSquare, 
  AlertTriangle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { SystemStats } from '../../types';

const SystemOverview: React.FC = () => {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalLogins: 0,
    onlineUsers: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalComponents: 0,
    overdueItems: 0
  });

  useEffect(() => {
    const loadStats = () => {
      setStats(dataService.getSystemStats());
    };
    
    loadStats();
    const interval = setInterval(loadStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const statsCards = [
    { 
      title: 'Total Requests', 
      value: stats.totalRequests, 
      icon: Activity, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      subtitle: 'All time requests'
    },
    { 
      title: 'Pending Requests', 
      value: stats.pendingRequests, 
      icon: Clock, 
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      subtitle: 'Needs attention'
    },
    { 
      title: 'Total Components', 
      value: stats.totalComponents, 
      icon: Package, 
      color: 'from-peacock-500 to-blue-500',
      bgColor: 'bg-peacock-500/10',
      borderColor: 'border-peacock-500/30',
      subtitle: 'In inventory'
    },
    { 
      title: 'Overdue Items', 
      value: stats.overdueItems, 
      icon: AlertTriangle, 
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      subtitle: 'Requires follow-up'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-peacock-600/20 via-blue-600/20 to-purple-600/20 rounded-3xl p-8 border border-peacock-500/30"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-peacock-500/10 to-blue-500/10 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="p-4 bg-gradient-to-br from-peacock-500 to-blue-500 rounded-2xl shadow-lg animate-glow">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Lab Management Overview</h2>
              <p className="text-peacock-200">Real-time insights into component requests and inventory status</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`relative overflow-hidden ${stat.bgColor} backdrop-blur-xl rounded-2xl border ${stat.borderColor} p-6 group hover:shadow-2xl transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg group-hover:animate-pulse`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="text-right"
                  >
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </motion.div>
                </div>
                <h3 className="text-peacock-200 font-medium mb-1">{stat.title}</h3>
                <p className="text-peacock-300 text-sm">{stat.subtitle}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-dark-800/50 backdrop-blur-xl rounded-2xl border border-peacock-500/20 p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-peacock-400" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <h4 className="text-yellow-400 font-semibold mb-2">Pending Requests</h4>
            <p className="text-yellow-300 text-sm">
              {stats.pendingRequests > 0 
                ? `${stats.pendingRequests} requests waiting for approval`
                : 'All requests have been processed'
              }
            </p>
          </div>
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <h4 className="text-red-400 font-semibold mb-2">Overdue Items</h4>
            <p className="text-red-300 text-sm">
              {stats.overdueItems > 0 
                ? `${stats.overdueItems} items are overdue for return`
                : 'No overdue items'
              }
            </p>
          </div>
          <div className="p-4 bg-peacock-500/10 border border-peacock-500/20 rounded-xl">
            <h4 className="text-peacock-400 font-semibold mb-2">Inventory Status</h4>
            <p className="text-peacock-300 text-sm">
              {stats.totalComponents} component types available
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SystemOverview;