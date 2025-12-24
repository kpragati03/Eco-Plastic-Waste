import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiBookOpen, FiPlay, FiClock, FiHeart, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { resourceService } from '../../services/resourceService';
import { ANIMATION_VARIANTS, RESOURCE_CATEGORIES } from '../../utils/constants';
import { formatDate, getCategoryColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';

// Mock data for resources
const mockResources = [
  {
    _id: '1',
    title: '10 Simple Ways to Reduce Plastic Waste at Home',
    description: 'Practical tips for reducing single-use plastics in your daily routine. Learn easy swaps and sustainable alternatives.',
    content: 'Discover simple yet effective ways to minimize plastic consumption in your household...',
    category: 'tips',
    type: 'text',
    difficulty: 'beginner',
    readTime: 5,
    views: 1250,
    likes: [{ user: { _id: 'user1' } }, { user: { _id: 'user2' } }],
    likeCount: 2,
    author: { name: 'Sarah Green', email: 'sarah@ecotips.com' },
    tags: ['home', 'daily-life', 'beginner'],
    createdAt: '2024-01-10'
  },
  {
    _id: '2',
    title: 'The Science Behind Plastic Pollution in Oceans',
    description: 'Comprehensive research article on how plastic waste affects marine ecosystems and food chains.',
    content: 'Marine plastic pollution has become one of the most pressing environmental issues...',
    category: 'articles',
    type: 'text',
    difficulty: 'intermediate',
    readTime: 12,
    views: 890,
    likes: [{ user: { _id: 'user3' } }],
    likeCount: 1,
    author: { name: 'Dr. Ocean Research', email: 'research@marine.org' },
    tags: ['ocean', 'research', 'marine-life'],
    createdAt: '2024-01-08'
  },
  {
    _id: '3',
    title: 'How to Make Plastic-Free Cleaning Products',
    description: 'Step-by-step video guide to creating eco-friendly cleaning solutions using natural ingredients.',
    content: 'Learn to make effective cleaning products without harmful chemicals or plastic packaging...',
    category: 'videos',
    type: 'video',
    url: 'https://youtube.com/watch?v=example',
    difficulty: 'beginner',
    readTime: 8,
    views: 2100,
    likes: [{ user: { _id: 'user4' } }, { user: { _id: 'user5' } }, { user: { _id: 'user6' } }],
    likeCount: 3,
    author: { name: 'EcoHome Channel', email: 'info@ecohome.com' },
    tags: ['diy', 'cleaning', 'natural'],
    createdAt: '2024-01-12'
  },
  {
    _id: '4',
    title: 'Plastic Waste Statistics Infographic 2024',
    description: 'Visual representation of global plastic waste data, recycling rates, and environmental impact.',
    content: 'This comprehensive infographic shows the latest statistics on plastic production and waste...',
    category: 'infographics',
    type: 'image',
    thumbnail: '/images/plastic-stats-infographic.jpg',
    difficulty: 'beginner',
    readTime: 3,
    views: 3200,
    likes: [{ user: { _id: 'user7' } }, { user: { _id: 'user8' } }],
    likeCount: 2,
    author: { name: 'Data Viz Studio', email: 'contact@dataviz.com' },
    tags: ['statistics', 'data', 'global'],
    createdAt: '2024-01-15'
  },
  {
    _id: '5',
    title: 'Microplastics in Food Chain: Latest Research',
    description: 'Academic research paper on microplastic contamination in food systems and health implications.',
    content: 'Recent studies have revealed alarming levels of microplastics in our food supply...',
    category: 'research',
    type: 'pdf',
    url: 'https://research.org/microplastics-study.pdf',
    difficulty: 'advanced',
    readTime: 25,
    views: 650,
    likes: [{ user: { _id: 'user9' } }],
    likeCount: 1,
    author: { name: 'Environmental Research Institute', email: 'publish@envresearch.org' },
    tags: ['microplastics', 'health', 'food-safety'],
    createdAt: '2024-01-05'
  },
  {
    _id: '6',
    title: 'Complete Guide to Plastic-Free Living',
    description: 'Comprehensive guide covering all aspects of adopting a zero-waste, plastic-free lifestyle.',
    content: 'This complete guide will walk you through every step of transitioning to plastic-free living...',
    category: 'guides',
    type: 'text',
    difficulty: 'intermediate',
    readTime: 18,
    views: 1800,
    likes: [{ user: { _id: 'user10' } }, { user: { _id: 'user11' } }, { user: { _id: 'user12' } }, { user: { _id: 'user13' } }],
    likeCount: 4,
    author: { name: 'Zero Waste Expert', email: 'guide@zerowaste.com' },
    tags: ['lifestyle', 'zero-waste', 'comprehensive'],
    createdAt: '2024-01-03'
  }
];

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({});
  
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchResources();
  }, [filters]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await resourceService.getResources(filters);
      let filteredResources = response.data || [];
      
      // Apply filters
      if (filters.search && filters.search.trim()) {
        const searchTerm = filters.search.toLowerCase().trim();
        filteredResources = filteredResources.filter(resource => 
          (resource.title && resource.title.toLowerCase().includes(searchTerm)) ||
          (resource.description && resource.description.toLowerCase().includes(searchTerm)) ||
          (resource.content && resource.content.toLowerCase().includes(searchTerm))
        );
      }
      
      if (filters.category && filters.category !== '') {
        filteredResources = filteredResources.filter(resource => 
          resource.category === filters.category
        );
      }
      
      setResources(filteredResources || []);
      setPagination({
        current: 1,
        pages: Math.max(1, Math.ceil(filteredResources.length / filters.limit)),
        total: filteredResources.length
      });
      
    } catch (error) {
      console.error('Error fetching resources:', error);
      setResources([]);
      setPagination({ current: 1, pages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const ResourceCard = ({ resource }) => (
    <motion.div
      variants={ANIMATION_VARIANTS.slideUp}
      className="card p-6 card-hover h-full flex flex-col"
    >
      {resource.thumbnail && (
        <img
          src={resource.thumbnail}
          alt={resource.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
          {resource.category}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {resource.readTime} min read
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {resource.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
        {resource.description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <FiHeart className="mr-1" />
            {resource.likeCount || 0}
          </div>
          <div className="flex items-center">
            <FiBookOpen className="mr-1" />
            {resource.views || 0}
          </div>
        </div>
        <Link
          to={`/resources/${resource._id}`}
          className="btn-primary text-sm"
        >
          Read More
        </Link>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Educational Resources
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Discover tips, guides, and research on plastic waste reduction
              </p>
            </div>
            
            {isAuthenticated && (user?.role === 'content_proposer' || user?.role === 'admin') && (
              <Link
                to="/dashboard/resources/create"
                className="mt-4 md:mt-0 btn-primary flex items-center"
              >
                <FiPlus className="mr-2" />
                Add Resource
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                className="form-input pl-10"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Category */}
            <select
              className="form-input"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {RESOURCE_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Clear filters */}
            <button
              onClick={() => setFilters({
                search: '',
                category: '',
                page: 1,
                limit: 12
              })}
              className="btn-secondary flex items-center justify-center"
            >
              <FiFilter className="mr-2" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading resources..." />
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No resources found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or check back later for new resources.
            </p>
          </div>
        ) : (
          <motion.div
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {resources.map((resource, index) => (
              <motion.div
                key={resource._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ResourceCard resource={resource} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Resources;