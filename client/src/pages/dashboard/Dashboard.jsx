import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBarChart, FiUsers, FiTrendingUp, FiMapPin, FiPlus, FiBookOpen, FiActivity } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { ANIMATION_VARIANTS } from '../../utils/constants';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { icon: FiTrendingUp, label: 'My Campaigns', value: '5', color: 'text-blue-500' },
    { icon: FiUsers, label: 'Total Participants', value: '127', color: 'text-green-500' },
    { icon: FiBarChart, label: 'Resources Created', value: '12', color: 'text-purple-500' },
    { icon: FiMapPin, label: 'Agencies Added', value: '3', color: 'text-orange-500' },
  ];

  const recentActivity = [
    { action: 'Created campaign "Beach Cleanup Drive"', time: '2 hours ago' },
    { action: 'Published resource "10 Ways to Reduce Plastic"', time: '1 day ago' },
    { action: 'Added recycling center "EcoCenter Mumbai"', time: '3 days ago' },
    { action: 'Updated campaign "Plastic Free Schools"', time: '1 week ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={ANIMATION_VARIANTS.fadeIn}
          initial="initial"
          animate="animate"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your campaigns, resources, and track your environmental impact.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={ANIMATION_VARIANTS.slideUp}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700 mr-4`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <Link to="/campaigns/create" className="w-full btn-primary text-left flex items-center">
                  <FiPlus className="mr-2" />
                  Create New Campaign
                </Link>
                <Link to="/resources/create" className="w-full btn-secondary text-left flex items-center">
                  <FiBookOpen className="mr-2" />
                  Add Educational Resource
                </Link>
                <Link to="/agencies/create" className="w-full btn-secondary text-left flex items-center">
                  <FiMapPin className="mr-2" />
                  Submit Recycling Center
                </Link>
                <Link to="/analytics" className="w-full btn-secondary text-left flex items-center">
                  <FiActivity className="mr-2" />
                  View Analytics
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Impact Summary */}
          <div className="card p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Your Environmental Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">2.5K</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">People Reached</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">150kg</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Plastic Reduced</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">25</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Campaigns</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;