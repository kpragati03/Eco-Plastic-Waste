import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiCalendar, FiMapPin, FiUsers, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { campaignService } from '../../services/campaignService';
import { ANIMATION_VARIANTS, CAMPAIGN_CATEGORIES, CAMPAIGN_STATUS_OPTIONS } from '../../utils/constants';
import { formatDate, getCategoryColor, getStatusColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';

// Mock data for campaigns
const mockCampaigns = [
  {
    _id: '1',
    title: 'Beach Cleanup Drive Mumbai',
    description: 'Join us for a massive beach cleanup drive at Juhu Beach. Help us remove plastic waste and make our beaches cleaner for marine life.',
    category: 'cleanup',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    location: 'Juhu Beach, Mumbai',
    organizer: { name: 'Ocean Warriors NGO' },
    participants: Array(45).fill().map((_, i) => ({ user: { _id: i } })),
    maxParticipants: 100,
    participantCount: 45
  },
  {
    _id: '2',
    title: 'Plastic-Free Schools Initiative',
    description: 'Educational campaign to make schools plastic-free. Teaching students about sustainable alternatives and organizing plastic-free lunch programs.',
    category: 'education',
    status: 'active',
    startDate: '2024-01-10',
    endDate: '2024-03-10',
    location: 'Delhi NCR Schools',
    organizer: { name: 'Green Education Foundation' },
    participants: Array(120).fill().map((_, i) => ({ user: { _id: i } })),
    maxParticipants: 200,
    participantCount: 120
  },
  {
    _id: '3',
    title: 'Corporate Plastic Reduction Challenge',
    description: 'Challenge for businesses to reduce single-use plastic by 50% in 3 months. Includes workshops, audits, and sustainable alternatives.',
    category: 'business',
    status: 'upcoming',
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    location: 'Bangalore Tech Parks',
    organizer: { name: 'Sustainable Business Alliance' },
    participants: Array(25).fill().map((_, i) => ({ user: { _id: i } })),
    maxParticipants: 50,
    participantCount: 25
  },
  {
    _id: '4',
    title: 'Community Recycling Awareness',
    description: 'Door-to-door awareness campaign about proper plastic waste segregation and recycling. Includes distribution of eco-friendly bags.',
    category: 'awareness',
    status: 'active',
    startDate: '2024-01-05',
    endDate: '2024-02-05',
    location: 'Pune Residential Areas',
    organizer: { name: 'EcoVolunteers Pune' },
    participants: Array(80).fill().map((_, i) => ({ user: { _id: i } })),
    maxParticipants: null,
    participantCount: 80
  },
  {
    _id: '5',
    title: 'River Cleanup & Plastic Collection',
    description: 'Large-scale cleanup of Yamuna River focusing on plastic waste removal. Includes boat cleanup and riverside waste collection.',
    category: 'cleanup',
    status: 'completed',
    startDate: '2023-12-01',
    endDate: '2023-12-15',
    location: 'Yamuna River, Delhi',
    organizer: { name: 'River Restoration Society' },
    participants: Array(200).fill().map((_, i) => ({ user: { _id: i } })),
    maxParticipants: 250,
    participantCount: 200
  },
  {
    _id: '6',
    title: 'Plastic-Free Wedding Campaign',
    description: 'Promoting eco-friendly weddings by eliminating single-use plastics. Providing sustainable decoration and catering alternatives.',
    category: 'awareness',
    status: 'upcoming',
    startDate: '2024-02-14',
    endDate: '2024-04-14',
    location: 'Chennai Wedding Venues',
    organizer: { name: 'Green Weddings India' },
    participants: Array(15).fill().map((_, i) => ({ user: { _id: i } })),
    maxParticipants: 30,
    participantCount: 15
  },
  {
    _id: '7',
    title: 'Recycling Center Setup Drive',
    description: 'Community initiative to establish local recycling centers in residential areas. Includes training for waste management.',
    category: 'recycling',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-06-01',
    location: 'Hyderabad Suburbs',
    organizer: { name: 'Waste Management Collective' },
    participants: Array(60).fill().map((_, i) => ({ user: { _id: i } })),
    maxParticipants: 100,
    participantCount: 60
  },
  {
    _id: '8',
    title: 'Student Plastic Research Project',
    description: 'University students researching innovative plastic alternatives and biodegradable materials. Includes lab work and field studies.',
    category: 'education',
    status: 'active',
    startDate: '2024-01-08',
    endDate: '2024-05-08',
    location: 'IIT Bombay',
    organizer: { name: 'Environmental Research Lab' },
    participants: Array(30).fill().map((_, i) => ({ user: { _id: i } })),
    maxParticipants: 40,
    participantCount: 30
  },
  {
    _id: '9',
    title: 'Zero Waste Lifestyle Workshop',
    description: 'Workshop series teaching families how to adopt zero-waste lifestyle. Includes DIY alternatives and sustainable living tips.',
    category: 'education',
    status: 'completed',
    startDate: '2023-11-15',
    endDate: '2023-12-15',
    location: 'Kolkata Community Centers',
    organizer: { name: 'Zero Waste Kolkata' },
    participants: Array(150).fill().map((_, i) => ({ user: { _id: i } })),
    maxParticipants: 200,
    participantCount: 150
  }
];

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({});
  
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchCampaigns();
  }, [filters]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignService.getCampaigns(filters);
      let filteredCampaigns = response.data || [];
      
      // Apply filters
      if (filters.search && filters.search.trim()) {
        const searchTerm = filters.search.toLowerCase().trim();
        filteredCampaigns = filteredCampaigns.filter(campaign => 
          (campaign.title && campaign.title.toLowerCase().includes(searchTerm)) ||
          (campaign.description && campaign.description.toLowerCase().includes(searchTerm)) ||
          (campaign.location && campaign.location.toLowerCase().includes(searchTerm))
        );
      }
      
      if (filters.category && filters.category !== '') {
        filteredCampaigns = filteredCampaigns.filter(campaign => 
          campaign.category === filters.category
        );
      }
      
      if (filters.status && filters.status !== '') {
        filteredCampaigns = filteredCampaigns.filter(campaign => 
          campaign.status === filters.status
        );
      }
      
      setCampaigns(filteredCampaigns || []);
      setPagination({
        current: 1,
        pages: Math.max(1, Math.ceil(filteredCampaigns.length / filters.limit)),
        total: filteredCampaigns.length
      });
      
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
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

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const CampaignCard = ({ campaign }) => (
    <motion.div
      variants={ANIMATION_VARIANTS.slideUp}
      className="card p-6 card-hover"
    >
      {campaign.image && (
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(campaign.category)}`}>
          {campaign.category}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
          {campaign.status}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {campaign.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {campaign.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <FiCalendar className="mr-2" />
          {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <FiMapPin className="mr-2" />
          {campaign.location}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <FiUsers className="mr-2" />
          {campaign.participantCount} participants
          {campaign.maxParticipants && ` / ${campaign.maxParticipants}`}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          by {campaign.organizer?.name}
        </div>
        <Link
          to={`/campaigns/${campaign._id}`}
          className="btn-primary text-sm"
        >
          View Details
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
                Awareness Campaigns
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Join impactful campaigns to reduce plastic waste in your community
              </p>
            </div>
            
            {isAuthenticated && (user?.role === 'content_proposer' || user?.role === 'admin') && (
              <Link
                to="/dashboard/campaigns/create"
                className="mt-4 md:mt-0 btn-primary flex items-center"
              >
                <FiPlus className="mr-2" />
                Create Campaign
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
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
              {CAMPAIGN_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              className="form-input"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              {CAMPAIGN_STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Clear filters */}
            <button
              onClick={() => setFilters({
                search: '',
                category: '',
                status: '',
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

        {/* Campaigns Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading campaigns..." />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or check back later for new campaigns.
            </p>
          </div>
        ) : (
          <>
            <motion.div
              variants={ANIMATION_VARIANTS.fadeIn}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {campaigns.map((campaign, index) => (
                <motion.div
                  key={campaign._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CampaignCard campaign={campaign} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        page === pagination.current
                          ? 'bg-primary-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
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

export default Campaigns;