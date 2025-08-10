import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Users, Wifi, WifiOff, Activity } from 'lucide-react';
import { dataService } from '../services/dataService';

interface HeaderProps {
  currentView: 'student' | 'staff';
  onViewChange: (view: 'student' | 'staff') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const [onlineCount, setOnlineCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [stats, setStats] = useState({ totalRequests: 0, pendingRequests: 0 });

  useEffect(() => {
    const updateStats = () => {
      const systemStats = dataService.getSystemStats();
      setStats({
        totalRequests: systemStats.totalRequests,
        pendingRequests: systemStats.pendingRequests
      });
      setOnlineCount(systemStats.onlineUsers);
    };
    
    updateStats();
    const interval = setInterval(updateStats, 30000); // Update every 30 seconds
    
    // Network status listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-dark-800/95 backdrop-blur-lg border-b border-dark-700/50 sticky top-0 z-40 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-peacock-500 to-blue-500 rounded-lg shadow-lg"
            >
              <Cpu className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-white font-bold text-lg">Isaac Asimov Lab</h1>
              <div className="flex items-center gap-2">
                <p className="text-peacock-300 text-sm">
                  {currentView === 'staff' ? 'Staff Management' : 'Component Request System'}
                </p>
                {/* Network Status Indicator */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    isOnline 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {isOnline ? 'Online' : 'Offline'}
                </motion.div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* System Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 px-3 py-2 rounded-full backdrop-blur-sm"
            >
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">
                {stats.pendingRequests} pending requests
              </span>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 px-3 py-2 rounded-full backdrop-blur-sm"
            >
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">
                {stats.totalRequests} total requests
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;