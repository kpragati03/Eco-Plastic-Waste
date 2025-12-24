import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiMapPin, 
  FiUsers, 
  FiClock, 
  FiHeart,
  FiShare2,
  FiArrowLeft
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { campaignService } from '../../services/campaignService';
import { userService } from '../../services/userService';
import { ANIMATION_VARIANTS } from '../../utils/constants';
import { formatDate, getCategoryColor, getStatusColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

// Mock data for campaign details
const mockCampaigns = [
  {
    _id: '1',
    title: 'Beach Cleanup Drive Mumbai',
    description: 'Join us for a massive beach cleanup drive at Juhu Beach. Help us remove plastic waste and make our beaches cleaner for marine life. This comprehensive initiative includes organized cleanup activities, educational workshops about marine conservation, and community engagement programs.',
    category: 'cleanup',
    status: 'approved',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    location: 'Juhu Beach, Mumbai',
    organizer: { _id: 'org1', name: 'Ocean Warriors NGO', email: 'contact@oceanwarriors.org' },
    participants: Array(45).fill().map((_, i) => ({ 
      user: { _id: `user${i}`, name: `Volunteer ${i + 1}`, email: `volunteer${i + 1}@email.com` },
      joinedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    })),
    maxParticipants: 100,
    tags: ['beach', 'cleanup', 'marine', 'mumbai', 'plastic-free']
  },
  {
    _id: '2',
    title: 'Plastic-Free Schools Initiative',
    description: 'Educational campaign to make schools plastic-free. Teaching students about sustainable alternatives and organizing plastic-free lunch programs.',
    category: 'education',
    status: 'approved',
    startDate: '2024-01-10',
    endDate: '2024-03-10',
    location: 'Delhi NCR Schools',
    organizer: { _id: 'org2', name: 'Green Education Foundation', email: 'info@greeneducation.org' },
    participants: Array(120).fill().map((_, i) => ({ 
      user: { _id: `user${i + 100}`, name: `Teacher ${i + 1}`, email: `teacher${i + 1}@school.edu` },
      joinedAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000)
    })),
    maxParticipants: 200,
    tags: ['education', 'schools', 'students', 'delhi', 'awareness']
  },
  {
    _id: '3',
    title: 'Corporate Plastic Reduction Challenge',
    description: 'Challenge for businesses to reduce single-use plastic by 50% in 3 months. Includes workshops, audits, and sustainable alternatives.',
    category: 'business',
    status: 'approved',
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    location: 'Bangalore Tech Parks',
    organizer: { _id: 'org3', name: 'Sustainable Business Alliance', email: 'hello@sustainablebiz.com' },
    participants: Array(25).fill().map((_, i) => ({ 
      user: { _id: `user${i + 200}`, name: `Company ${i + 1}`, email: `company${i + 1}@business.com` },
      joinedAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000)
    })),
    maxParticipants: 50,
    tags: ['business', 'corporate', 'challenge', 'bangalore', 'sustainability']
  }
];

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const foundCampaign = mockCampaigns.find(c => c._id === id);
      if (foundCampaign) {
        setCampaign(foundCampaign);
      } else {
        toast.error('Campaign not found');
        navigate('/campaigns');
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
      toast.error('Campaign not found');
      navigate('/campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('Please login to like campaigns');
      return;
    }
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: campaign.title,
        text: campaign.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Campaign link copied to clipboard!');
    }
  };

  const handleJoinCampaign = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to join campaigns');
      navigate('/login');
      return;
    }

    try {
      setJoining(true);
      // Mock join functionality
      const updatedCampaign = {
        ...campaign,
        participants: [
          ...campaign.participants,
          {
            user: { _id: user.id, name: user.name, email: user.email },
            joinedAt: new Date()
          }
        ]
      };
      setCampaign(updatedCampaign);
      
      // Log activity
      await userService.logActivity('joined_campaign', 'campaign', campaign._id, campaign);
      
      toast.success('Successfully joined campaign!');
    } catch (error) {
      toast.error('Failed to join campaign');
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveCampaign = async () => {
    try {
      setJoining(true);
      // Mock leave functionality
      const updatedCampaign = {
        ...campaign,
        participants: campaign.participants.filter(
          participant => participant.user._id !== user.id
        )
      };
      setCampaign(updatedCampaign);
      toast.success('Successfully left campaign');
    } catch (error) {
      toast.error('Failed to leave campaign');
    } finally {
      setJoining(false);
    }
  };

  const isParticipant = campaign?.participants?.some(
    participant => participant.user._id === user?.id
  );

  const canJoin = campaign?.status === 'approved' && 
    (!campaign.maxParticipants || campaign.participants.length < campaign.maxParticipants);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading campaign..." />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Campaign not found
          </h2>
          <button
            onClick={() => navigate('/campaigns')}
            className="btn-primary"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/campaigns')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Campaigns
        </button>

        <motion.div
          variants={ANIMATION_VARIANTS.fadeIn}
          initial="initial"
          animate="animate"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          {/* Campaign image */}
          {campaign.image && (
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-64 object-cover"
            />
          )}

          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(campaign.category)}`}>
                    {campaign.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {campaign.title}
                </h1>

                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                  <span>Organized by {campaign.organizer?.name}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3 mt-4 md:mt-0">
                <button 
                  onClick={handleLike}
                  className={`p-2 rounded-lg border transition-colors ${
                    isLiked 
                      ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-600 dark:bg-red-900/20 dark:text-red-400'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Campaign info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center">
                <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <FiMapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Location</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {campaign.location}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <FiUsers className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Participants</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {campaign.participants.length}
                    {campaign.maxParticipants && ` / ${campaign.maxParticipants}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                About This Campaign
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {campaign.description}
              </p>
            </div>

            {/* Tags */}
            {campaign.tags && campaign.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {campaign.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Join/Leave button */}
            {campaign.status === 'approved' && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                {isAuthenticated ? (
                  isParticipant ? (
                    <button
                      onClick={handleLeaveCampaign}
                      disabled={joining}
                      className="btn-secondary w-full md:w-auto"
                    >
                      {joining ? <LoadingSpinner size="sm" /> : 'Leave Campaign'}
                    </button>
                  ) : canJoin ? (
                    <button
                      onClick={handleJoinCampaign}
                      disabled={joining}
                      className="btn-primary w-full md:w-auto"
                    >
                      {joining ? <LoadingSpinner size="sm" color="white" /> : 'Join Campaign'}
                    </button>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">
                      Campaign is full
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="btn-primary w-full md:w-auto"
                  >
                    Login to Join Campaign
                  </button>
                )}
              </div>
            )}

            {/* Participants list */}
            {campaign.participants.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Participants ({campaign.participants.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaign.participants.slice(0, 10).map((participant) => (
                    <div
                      key={participant.user._id}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {participant.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {participant.user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Joined {formatDate(participant.joinedAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {campaign.participants.length > 10 && (
                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    And {campaign.participants.length - 10} more participants...
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CampaignDetail;