import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Package, User, Phone, Calendar, Hash, CheckCircle, Mail } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Component, BorrowRequest } from '../types';

const StudentRequestForm: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [formData, setFormData] = useState({
    studentName: '',
    rollNo: '',
    email: '',
    mobile: '',
    componentId: '',
    quantity: 1,
    dueDate: '',
    purpose: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setComponents(dataService.getComponents());
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleRollNumberChange = (rollNo: string) => {
    setFormData(prev => ({ ...prev, rollNo }));
    const cleanRollNo = rollNo.toLowerCase().replace(/\s+/g, '.');
    if (cleanRollNo && !cleanRollNo.includes('@')) {
      setFormData(prev => ({ ...prev, email: cleanRollNo + '@issacasimov.in' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedComponent = components.find(c => c.id === formData.componentId);
      if (!selectedComponent) {
        throw new Error('Component not found');
      }

      if (formData.quantity > selectedComponent.availableQuantity) {
        throw new Error('Not enough components available');
      }

      const request: BorrowRequest = {
        id: `req-${Date.now()}`,
        studentId: `student-${Date.now()}`, // Generate temporary ID
        studentName: formData.studentName,
        rollNo: formData.rollNo,
        mobile: formData.mobile,
        componentId: selectedComponent.id,
        componentName: selectedComponent.name,
        quantity: formData.quantity,
        requestDate: new Date().toISOString(),
        dueDate: formData.dueDate,
        status: 'pending',
        notes: formData.purpose,
      };

      dataService.addRequest(request);

      setNotification({
        type: 'success',
        message: 'Request submitted successfully! Staff will review your request and contact you soon.',
      });

      // Reset form
      setFormData({
        studentName: '',
        rollNo: '',
        email: '',
        mobile: '',
        componentId: '',
        quantity: 1,
        dueDate: '',
        purpose: '',
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to submit request',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedComponent = components.find(c => c.id === formData.componentId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="relative overflow-hidden bg-dark-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-peacock-500/20 p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-peacock-500/5 to-blue-500/5"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-peacock-500 to-blue-500 rounded-2xl mb-6 shadow-lg animate-glow"
            >
              <Package className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-peacock-200 bg-clip-text text-transparent mb-3">
              Request Lab Components
            </h2>
            <p className="text-peacock-300 text-lg">Submit your component request for robotics projects</p>
          </motion.div>

          {/* Notification */}
          {notification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`mb-6 p-4 rounded-xl border backdrop-blur-sm ${
                notification.type === 'success'
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              <div className="flex items-center gap-3">
                {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                <span className="font-medium">{notification.message}</span>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label className="block text-peacock-300 text-sm font-semibold mb-2">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-5 h-5 group-focus-within:text-peacock-300 transition-colors" />
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                    className="w-full pl-10 pr-4 py-4 bg-dark-700/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 group-hover:border-dark-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-peacock-300 text-sm font-semibold mb-2">
                  Roll Number
                </label>
                <div className="relative group">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-5 h-5 group-focus-within:text-peacock-300 transition-colors" />
                  <input
                    type="text"
                    value={formData.rollNo}
                    onChange={(e) => handleRollNumberChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-dark-700/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 group-hover:border-dark-500"
                    placeholder="eg: 21CS001 or dilipkumar-ra-1015"
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label className="block text-peacock-300 text-sm font-semibold mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-5 h-5 group-focus-within:text-peacock-300 transition-colors" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-4 bg-dark-700/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 group-hover:border-dark-500"
                    placeholder="your.email@issacasimov.in"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-peacock-300 text-sm font-semibold mb-2">
                  Mobile Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-5 h-5 group-focus-within:text-peacock-300 transition-colors" />
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                    className="w-full pl-10 pr-4 py-4 bg-dark-700/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 group-hover:border-dark-500"
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Component Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <label className="block text-peacock-300 text-sm font-semibold mb-2">
                Component Required
              </label>
              <select
                value={formData.componentId}
                onChange={(e) => setFormData(prev => ({ ...prev, componentId: e.target.value }))}
                className="w-full px-4 py-4 bg-dark-700/50 border border-dark-600 rounded-xl text-white focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 hover:border-dark-500"
                required
              >
                <option value="">Select a component</option>
                {components.map(component => (
                  <option key={component.id} value={component.id}>
                    {component.name} (Available: {component.availableQuantity})
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Component Details */}
            {selectedComponent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-peacock-500/10 to-blue-500/10 p-6 rounded-xl border border-peacock-500/20"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-peacock-500/20 rounded-xl">
                    <Package className="w-6 h-6 text-peacock-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{selectedComponent.name}</h4>
                    <p className="text-peacock-300">{selectedComponent.category}</p>
                  </div>
                </div>
                <p className="text-peacock-200 text-sm mb-3">{selectedComponent.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-400 font-semibold">
                    ✅ Available: {selectedComponent.availableQuantity} units
                  </span>
                  <span className="text-peacock-300">
                    Total: {selectedComponent.totalQuantity} units
                  </span>
                </div>
              </motion.div>
            )}

            {/* Quantity, Due Date, and Purpose */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label className="block text-peacock-300 text-sm font-semibold mb-2">
                  Quantity Required
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedComponent?.availableQuantity || 1}
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                  className="w-full px-4 py-4 bg-dark-700/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 hover:border-dark-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-peacock-300 text-sm font-semibold mb-2">
                  Expected Return Date
                </label>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-5 h-5 group-focus-within:text-peacock-300 transition-colors" />
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-4 bg-dark-700/50 border border-dark-600 rounded-xl text-white focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 group-hover:border-dark-500"
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Purpose */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-2"
            >
              <label className="block text-peacock-300 text-sm font-semibold mb-2">
                Purpose / Project Description
              </label>
              <textarea
                value={formData.purpose}
                onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                rows={3}
                className="w-full px-4 py-4 bg-dark-700/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 hover:border-dark-500"
                placeholder="Briefly describe your project or purpose for requesting this component..."
                required
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0, 206, 209, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting || !formData.componentId}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-peacock-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-peacock-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center justify-center gap-3">
                <Send className="w-6 h-6 group-hover:animate-bounce" />
                {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
              </div>
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentRequestForm;