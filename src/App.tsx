import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StudentRequestForm from './components/StudentRequestForm';
import StaffDashboard from './components/staff/StaffDashboard';
import Header from './components/Header';
import { Users, UserCheck } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<'student' | 'staff'>('student');

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-peacock-900">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-center"
        >
          <div className="flex gap-2 bg-dark-800/50 p-2 rounded-xl backdrop-blur-sm">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView('student')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                currentView === 'student'
                  ? 'bg-gradient-to-r from-peacock-500 to-blue-500 text-white shadow-lg'
                  : 'text-peacock-300 hover:text-white hover:bg-dark-700/50'
              }`}
            >
              <Users className="w-5 h-5" />
              Student Request
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView('staff')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                currentView === 'staff'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-peacock-300 hover:text-white hover:bg-dark-700/50'
              }`}
            >
              <UserCheck className="w-5 h-5" />
              Staff Management
            </motion.button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {currentView === 'student' ? <StudentRequestForm /> : <StaffDashboard />}
        </motion.div>
      </div>
    </div>
  );
}

export default App;