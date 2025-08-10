import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileSpreadsheet, Database, Calendar } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { excelService } from '../../services/excelService';

const ExportData: React.FC = () => {
  const handleExportExcel = () => {
    const data = dataService.getData();
    excelService.exportToExcel(data);
  };

  const handleExportCSV = () => {
    const csvContent = dataService.exportLoginSessionsCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `lab-data-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const stats = dataService.getSystemStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl border border-green-500/20 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
            <FileSpreadsheet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Export Lab Data</h2>
            <p className="text-green-200">Download comprehensive reports and data exports</p>
          </div>
        </div>
      </motion.div>

      {/* Data Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-800/50 backdrop-blur-xl rounded-2xl border border-peacock-500/20 p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-peacock-400" />
          Current Data Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-blue-400 font-semibold">Total Requests</p>
            <p className="text-white text-2xl font-bold">{stats.totalRequests}</p>
          </div>
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <p className="text-yellow-400 font-semibold">Pending Requests</p>
            <p className="text-white text-2xl font-bold">{stats.pendingRequests}</p>
          </div>
          <div className="p-4 bg-peacock-500/10 border border-peacock-500/20 rounded-xl">
            <p className="text-peacock-400 font-semibold">Components</p>
            <p className="text-white text-2xl font-bold">{stats.totalComponents}</p>
          </div>
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 font-semibold">Overdue Items</p>
            <p className="text-white text-2xl font-bold">{stats.overdueItems}</p>
          </div>
        </div>
      </motion.div>

      {/* Export Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Excel Export */}
        <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl border border-green-500/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">Professional Excel Report</h4>
              <p className="text-green-300 text-sm">Comprehensive multi-sheet workbook</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="text-sm text-peacock-300">
              <p className="font-semibold mb-2">📊 Includes 8 Professional Sheets:</p>
              <ul className="space-y-1 text-xs">
                <li>• Executive Dashboard & Analytics</li>
                <li>• Enhanced Component Tracking</li>
                <li>• Complete Request Details</li>
                <li>• Checked Out Components</li>
                <li>• Inventory Status & Management</li>
                <li>• User Activity Report</li>
                <li>• Login Sessions & Security</li>
                <li>• System Analytics & Performance</li>
              </ul>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportExcel}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-center gap-3">
              <Download className="w-5 h-5 group-hover:animate-bounce" />
              Download Excel Report
            </div>
          </motion.button>
        </div>

        {/* CSV Export */}
        <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Database className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">CSV Data Export</h4>
              <p className="text-blue-300 text-sm">Raw data for analysis</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="text-sm text-peacock-300">
              <p className="font-semibold mb-2">📋 CSV Export Contains:</p>
              <ul className="space-y-1 text-xs">
                <li>• All request records</li>
                <li>• Component inventory data</li>
                <li>• User activity logs</li>
                <li>• System timestamps</li>
                <li>• Status tracking</li>
                <li>• Compatible with Excel, Google Sheets</li>
              </ul>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportCSV}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-center gap-3">
              <Download className="w-5 h-5 group-hover:animate-bounce" />
              Download CSV Data
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Export Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-dark-800/50 backdrop-blur-xl rounded-2xl border border-peacock-500/20 p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-peacock-400" />
          Export Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="text-peacock-400 font-semibold mb-2">📊 Excel Report Features:</h4>
            <ul className="text-peacock-300 space-y-1">
              <li>• Professional formatting and styling</li>
              <li>• Multiple worksheets with different data views</li>
              <li>• Charts and visual analytics</li>
              <li>• Executive summary dashboard</li>
              <li>• Detailed component tracking</li>
              <li>• User activity analysis</li>
              <li>• Ready for presentations</li>
            </ul>
          </div>
          <div>
            <h4 className="text-peacock-400 font-semibold mb-2">📋 CSV Export Benefits:</h4>
            <ul className="text-peacock-300 space-y-1">
              <li>• Raw data for custom analysis</li>
              <li>• Compatible with all spreadsheet apps</li>
              <li>• Smaller file size</li>
              <li>• Easy to import into databases</li>
              <li>• Machine-readable format</li>
              <li>• Perfect for data processing</li>
              <li>• Universal compatibility</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-peacock-500/10 border border-peacock-500/20 rounded-lg">
          <p className="text-peacock-300 text-sm">
            <strong>Note:</strong> All exports include data as of {new Date().toLocaleString()}. 
            For the most current data, refresh the page before exporting.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ExportData;