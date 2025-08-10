import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  CheckSquare, 
  RotateCcw, 
  Clock, 
  BarChart3,
  FileSpreadsheet,
  Settings
} from 'lucide-react';
import RequestManagement from './RequestManagement';
import InventoryManagement from './InventoryManagement';
import ReturnManagement from './ReturnManagement';
import RequestHistory from './RequestHistory';
import SystemOverview from './SystemOverview';
import ExportData from './ExportData';

const StaffDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
    { id: 'requests', label: 'Pending Requests', icon: CheckSquare, color: 'from-yellow-500 to-orange-500' },
    { id: 'returns', label: 'Returns', icon: RotateCcw, color: 'from-green-500 to-emerald-500' },
    { id: 'inventory', label: 'Inventory', icon: Package, color: 'from-purple-500 to-pink-500' },
    { id: 'history', label: 'History', icon: Clock, color: 'from-indigo-500 to-blue-500' },
    { id: 'export', label: 'Export Data', icon: FileSpreadsheet, color: 'from-green-500 to-emerald-500' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'requests':
        return <RequestManagement />;
      case 'returns':
        return <ReturnManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'history':
        return <RequestHistory />;
      case 'export':
        return <ExportData />;
      default:
        return <SystemOverview />;
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-peacock-200 bg-clip-text text-transparent mb-2">
          Staff Management Dashboard
        </h1>
        <p className="text-peacock-300 text-lg">Manage lab components, requests, and inventory</p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="overflow-x-auto"
      >
        <div className="flex gap-3 bg-dark-800/50 p-3 rounded-2xl backdrop-blur-xl border border-dark-700 min-w-max">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative overflow-hidden flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : 'text-peacock-300 hover:text-white hover:bg-dark-700/70'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeStaffTab"
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default StaffDashboard;