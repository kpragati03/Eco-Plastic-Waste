import React from 'react';
import { FiMenu } from 'react-icons/fi';

const AdminHeader = ({ onMenuClick }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        >
          <FiMenu className="h-6 w-6" />
        </button>
        
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 dark:text-gray-300">Admin Panel</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;