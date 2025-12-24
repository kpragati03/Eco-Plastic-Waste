import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiTrash2, FiCalendar, FiBookOpen, FiMapPin, FiHeart, FiUserPlus } from 'react-icons/fi';
import { userService } from '../../services/userService';
import { ANIMATION_VARIANTS } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchActivity();
  }, [page]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const response = await userService.getActivityHistory({ page, limit: 20 });
      setActivities(response.data.activities);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your activity history?')) {
      try {
        await userService.clearActivityHistory();
        setActivities([]);
        toast.success('Activity history cleared');
      } catch (error) {
        toast.error('Failed to clear activity history');
      }
    }
  };

  const getActivityIcon = (action) => {
    switch (action) {
      case 'joined_campaign': return <FiUserPlus className="text-blue-500" />;
      case 'liked_resource': return <FiHeart className="text-red-500" />;
      case 'unliked_resource': return <FiHeart className="text-gray-500" />;
      case 'viewed_resource': return <FiBookOpen className="text-green-500" />;
      case 'bookmarked_resource': return <FiBookOpen className="text-blue-500" />;
      case 'bookmarked_agency': return <FiMapPin className="text-blue-500" />;
      default: return <FiActivity className="text-gray-500" />;
    }
  };

  const getActivityText = (activity) => {
    const resourceName = activity.resourceDetails?.title || activity.resourceDetails?.name || 'Unknown';
    
    switch (activity.action) {
      case 'joined_campaign': return `Joined campaign "${resourceName}"`;
      case 'liked_resource': return `Liked resource "${resourceName}"`;
      case 'unliked_resource': return `Unliked resource "${resourceName}"`;
      case 'viewed_resource': return `Viewed resource "${resourceName}"`;
      case 'bookmarked_resource': return `Bookmarked resource "${resourceName}"`;
      case 'bookmarked_agency': return `Bookmarked agency "${resourceName}"`;
      default: return `${activity.action.replace('_', ' ')} ${activity.resourceType}`;
    }
  };

  const ActivityItem = ({ activity }) => (
    <motion.div
      variants={ANIMATION_VARIANTS.slideUp}
      className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
    >
      <div className="flex-shrink-0 mt-1">
        {getActivityIcon(activity.action)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 dark:text-white">
          {getActivityText(activity)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formatRelativeTime(activity.timestamp)}
        </p>
      </div>
      {activity.resourceDetails?.status && (
        <span className={`px-2 py-1 rounded-full text-xs ${
          activity.resourceDetails.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {activity.resourceDetails.status}
        </span>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <FiActivity className="text-primary-600 mr-3" size={32} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Activity History
            </h1>
          </div>
          {activities.length > 0 && (
            <button
              onClick={clearHistory}
              className="btn-secondary flex items-center text-red-600 hover:text-red-700"
            >
              <FiTrash2 className="mr-2" />
              Clear History
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading activity..." />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No activity yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your activity will appear here as you interact with campaigns, resources, and agencies.
            </p>
          </div>
        ) : (
          <>
            <motion.div
              variants={ANIMATION_VARIANTS.fadeIn}
              initial="initial"
              animate="animate"
              className="space-y-4"
            >
              {activities.map((activity, index) => (
                <motion.div
                  key={`${activity.action}-${activity.timestamp}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ActivityItem activity={activity} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        pageNum === pagination.current
                          ? 'bg-primary-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Activity;