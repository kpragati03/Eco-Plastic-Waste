import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookmark, FiTrash2, FiCalendar, FiMapPin, FiBookOpen } from 'react-icons/fi';
import { userService } from '../../services/userService';
import { ANIMATION_VARIANTS } from '../../utils/constants';
import { formatDate, getCategoryColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await userService.getBookmarks();
      setBookmarks(response.data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (resourceType, resourceId) => {
    try {
      await userService.removeBookmark({ resourceType, resourceId });
      setBookmarks(prev => prev.filter(b => b.resourceId._id !== resourceId));
      toast.success('Bookmark removed');
    } catch (error) {
      toast.error('Failed to remove bookmark');
    }
  };

  const BookmarkCard = ({ bookmark }) => {
    const resource = bookmark.resourceId;
    const type = bookmark.resourceType;
    
    return (
      <motion.div
        variants={ANIMATION_VARIANTS.slideUp}
        className="card p-6 card-hover"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            {type === 'campaign' && <FiCalendar className="text-blue-500" />}
            {type === 'resource' && <FiBookOpen className="text-green-500" />}
            {type === 'agency' && <FiMapPin className="text-purple-500" />}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category || resource.type)}`}>
              {type}
            </span>
          </div>
          <button
            onClick={() => removeBookmark(type, resource._id)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <FiTrash2 size={16} />
          </button>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {resource.title || resource.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {resource.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Saved {formatDate(bookmark.addedAt)}
          </span>
          <Link
            to={`/${type}s/${resource._id}`}
            className="btn-primary text-sm"
          >
            View
          </Link>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <FiBookmark className="text-primary-600 mr-3" size={32} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Bookmarks
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading bookmarks..." />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔖</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No bookmarks yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start bookmarking campaigns, resources, and agencies to see them here.
            </p>
            <Link to="/campaigns" className="btn-primary">
              Explore Campaigns
            </Link>
          </div>
        ) : (
          <motion.div
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {bookmarks.map((bookmark, index) => (
              <motion.div
                key={`${bookmark.resourceType}-${bookmark.resourceId._id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BookmarkCard bookmark={bookmark} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;