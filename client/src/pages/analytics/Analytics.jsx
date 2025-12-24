import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBarChart, FiTrendingUp, FiUsers, FiActivity, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { ANIMATION_VARIANTS } from '../../utils/constants';
import LoadingSpinner from '../../components/LoadingSpinner';

const Analytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalActivities: 0,
    campaignsJoined: 0,
    resourcesViewed: 0,
    bookmarksCount: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await userService.getActivityHistory({ limit: 100 });
      const activities = response.data.activities || [];
      
      const campaignsJoined = activities.filter(a => a.action === 'joined_campaign').length;
      const resourcesViewed = activities.filter(a => a.action === 'viewed_resource').length;
      const bookmarksCount = activities.filter(a => a.action.includes('bookmarked')).length;
      
      setAnalytics({
        totalActivities: activities.length,
        campaignsJoined,
        resourcesViewed,
        bookmarksCount,
        recentActivities: activities.slice(0, 10)
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      icon: FiActivity,
      label: 'Total Activities',
      value: analytics.totalActivities,
      color: 'text-blue-500'
    },
    {
      icon: FiUsers,
      label: 'Campaigns Joined',
      value: analytics.campaignsJoined,
      color: 'text-green-500'
    },
    {
      icon: FiBarChart,
      label: 'Resources Viewed',
      value: analytics.resourcesViewed,
      color: 'text-purple-500'
    },
    {
      icon: FiMapPin,
      label: 'Items Bookmarked',
      value: analytics.bookmarksCount,
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={ANIMATION_VARIANTS.fadeIn}
          initial="initial"
          animate="animate"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your environmental impact and engagement statistics
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading analytics..." />
            </div>
          ) : (
            <>
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
                      <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 mr-4">
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

              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Environmental Impact Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {analytics.campaignsJoined * 15}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      People Potentially Reached
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {analytics.campaignsJoined * 25}kg
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Estimated Plastic Reduced
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {analytics.resourcesViewed}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Educational Resources Consumed
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;