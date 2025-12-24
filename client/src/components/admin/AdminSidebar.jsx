import React from 'react';

const AdminSidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-white text-xl font-bold">Admin Panel</span>
      </div>
      <nav className="mt-8">
        <div className="px-4 py-2 text-gray-400 text-sm font-medium uppercase tracking-wider">
          Navigation
        </div>
        <a href="/admin" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">
          Dashboard
        </a>
        <a href="/admin/users" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">
          Users
        </a>
        <a href="/admin/campaigns" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">
          Campaigns
        </a>
        <a href="/admin/resources" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">
          Resources
        </a>
        <a href="/admin/agencies" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">
          Agencies
        </a>
      </nav>
    </div>
  );
};

export default AdminSidebar;