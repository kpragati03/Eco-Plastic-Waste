import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiClock, FiHeart, FiBookmark, FiShare2, FiEye } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { resourceService } from '../../services/resourceService';
import { userService } from '../../services/userService';
import { ANIMATION_VARIANTS } from '../../utils/constants';
import { formatDate, getCategoryColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

// Same mock data as in Resources.jsx
const mockResources = [
  {
    _id: '1',
    title: '10 Simple Ways to Reduce Plastic Waste at Home',
    description: 'Practical tips for reducing single-use plastics in your daily routine. Learn easy swaps and sustainable alternatives.',
    content: 'Discover simple yet effective ways to minimize plastic consumption in your household. Start with these actionable tips:\n\n1. Replace plastic water bottles with reusable glass or stainless steel bottles\n2. Use cloth shopping bags instead of plastic bags\n3. Choose products with minimal packaging\n4. Make your own cleaning products using natural ingredients\n5. Use beeswax wraps instead of plastic wrap\n6. Buy in bulk to reduce packaging waste\n7. Choose bamboo toothbrushes over plastic ones\n8. Use refillable containers for food storage\n9. Avoid single-use plastic utensils and straws\n10. Support brands that use sustainable packaging',
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
    content: 'Marine plastic pollution has become one of the most pressing environmental issues of our time. Every year, millions of tons of plastic waste enter our oceans, creating devastating effects on marine life and ecosystems.\n\nThe Great Pacific Garbage Patch, a collection of marine debris in the North Pacific Ocean, is now twice the size of Texas. This massive accumulation of plastic waste is just one example of how human activities are impacting our oceans.\n\nMicroplastics, tiny plastic particles less than 5mm in size, are particularly concerning. They are consumed by marine animals and enter the food chain, eventually reaching human consumers. Studies have found microplastics in seafood, salt, and even drinking water.\n\nThe impact on marine life is severe. Sea turtles mistake plastic bags for jellyfish, seabirds feed plastic to their chicks, and marine mammals become entangled in plastic debris. It is estimated that over 1 million marine animals die each year due to plastic pollution.',
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
    content: 'Learn to make effective cleaning products without harmful chemicals or plastic packaging. This comprehensive guide covers:\n\nAll-Purpose Cleaner:\n- 1 cup white vinegar\n- 1 cup water\n- 10 drops essential oil\nMix in a glass spray bottle for a powerful, natural cleaner.\n\nBaking Soda Scrub:\n- 1/2 cup baking soda\n- 2 tablespoons liquid castile soap\n- 10 drops tea tree oil\nPerfect for tough stains and grime.\n\nGlass Cleaner:\n- 2 cups water\n- 1/2 cup white vinegar\n- 1/4 cup rubbing alcohol\nLeaves windows streak-free and sparkling.\n\nThese natural alternatives are not only better for the environment but also safer for your family and pets.',
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
    content: 'This comprehensive infographic shows the latest statistics on plastic production and waste management worldwide.\n\nKey Statistics:\n• 380 million tons of plastic waste generated annually\n• Only 9% of plastic waste is recycled globally\n• 12% is incinerated for energy recovery\n• 79% ends up in landfills or the environment\n\nPlastic Production by Type:\n• Packaging: 36%\n• Building & Construction: 16%\n• Textiles: 14%\n• Consumer Products: 10%\n• Transportation: 7%\n• Other: 17%\n\nTop Plastic Polluting Countries:\n1. China - 60 million tons\n2. United States - 38 million tons\n3. Germany - 14.5 million tons\n4. Brazil - 11.3 million tons\n5. Japan - 7.8 million tons',
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
    content: 'Recent studies have revealed alarming levels of microplastics in our food supply chain, raising serious concerns about human health implications.\n\nResearch Findings:\nMicroplastics have been detected in:\n• 90% of table salt samples worldwide\n• 83% of tap water samples\n• 57% of seafood samples\n• 72% of honey samples\n• 94% of beer samples\n\nHealth Implications:\nWhile research is ongoing, potential health effects include:\n• Inflammatory responses\n• Cellular damage\n• Endocrine disruption\n• Potential carcinogenic effects\n\nSources of Contamination:\n• Plastic packaging breakdown\n• Atmospheric deposition\n• Wastewater treatment plant discharge\n• Agricultural runoff\n• Tire wear particles\n\nThis research highlights the urgent need for comprehensive plastic waste management and reduction strategies.',
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
    content: 'This complete guide will walk you through every step of transitioning to plastic-free living, from beginner tips to advanced strategies.\n\nGetting Started:\n• Audit your current plastic usage\n• Identify easy swaps you can make immediately\n• Set realistic goals and timelines\n• Find local zero-waste stores\n\nKitchen Essentials:\n• Glass food storage containers\n• Stainless steel water bottles\n• Bamboo utensils and cutting boards\n• Cloth produce bags\n• Beeswax food wraps\n\nBathroom Swaps:\n• Bamboo toothbrushes\n• Shampoo bars\n• Safety razors\n• Menstrual cups\n• Refillable containers\n\nShopping Tips:\n• Bring your own bags and containers\n• Shop at farmers markets\n• Buy in bulk when possible\n• Choose products with minimal packaging\n• Support plastic-free brands\n\nAdvanced Strategies:\n• Make your own cleaning products\n• Grow your own food\n• Repair instead of replace\n• Join local zero-waste communities',
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

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetchResource();
    checkBookmarkStatus();
  }, [id]);

  const checkBookmarkStatus = async () => {
    if (isAuthenticated) {
      try {
        const response = await userService.getBookmarks();
        const isBookmarked = response.data.some(
          bookmark => bookmark.resourceType === 'resource' && 
                     bookmark.resourceId._id === id
        );
        setIsBookmarked(isBookmarked);
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    }
  };

  const fetchResource = async () => {
    try {
      setLoading(true);
      const foundResource = mockResources.find(r => r._id === id);
      if (foundResource) {
        setResource(foundResource);
        if (isAuthenticated && user) {
          setIsLiked(foundResource.likes?.some(like => like.user._id === user.id));
          // Log view activity
          await userService.logActivity('viewed_resource', 'resource', foundResource._id, foundResource);
        }
      } else {
        toast.error('Resource not found');
        navigate('/resources');
      }
    } catch (error) {
      console.error('Error fetching resource:', error);
      toast.error('Resource not found');
      navigate('/resources');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like resources');
      return;
    }

    setIsLiked(!isLiked);
    setResource(prev => ({
      ...prev,
      likeCount: isLiked ? prev.likeCount - 1 : prev.likeCount + 1
    }));
    
    // Log activity
    try {
      await userService.logActivity(isLiked ? 'unliked_resource' : 'liked_resource', 'resource', resource._id, resource);
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
    
    toast.success(isLiked ? 'Like removed' : 'Resource liked');
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark resources');
      return;
    }

    try {
      if (isBookmarked) {
        await userService.removeBookmark({ resourceType: 'resource', resourceId: resource._id });
        setIsBookmarked(false);
        toast.success('Bookmark removed');
      } else {
        await userService.addBookmark({ resourceType: 'resource', resourceId: resource._id });
        setIsBookmarked(true);
        toast.success('Resource bookmarked');
      }
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading resource..." />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Resource not found
          </h2>
          <button onClick={() => navigate('/resources')} className="btn-primary">
            Back to Resources
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/resources')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Resources
        </button>

        <motion.article
          variants={ANIMATION_VARIANTS.fadeIn}
          initial="initial"
          animate="animate"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          {resource.thumbnail && (
            <img
              src={resource.thumbnail}
              alt={resource.title}
              className="w-full h-64 object-cover"
            />
          )}

          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(resource.category)}`}>
                  {resource.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(resource.difficulty)}`}>
                  {resource.difficulty}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
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
                  onClick={handleBookmark}
                  className={`p-2 rounded-lg border transition-colors ${
                    isBookmarked
                      ? 'border-blue-300 bg-blue-50 text-blue-600 dark:border-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FiBookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {resource.title}
            </h1>

            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <div className="flex items-center">
                <FiClock className="mr-1" />
                {resource.readTime} min read
              </div>
              <div className="flex items-center">
                <FiEye className="mr-1" />
                {resource.views} views
              </div>
              <div className="flex items-center">
                <FiHeart className="mr-1" />
                {resource.likeCount} likes
              </div>
              <span>By {resource.author?.name}</span>
              <span>{formatDate(resource.createdAt)}</span>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                {resource.description}
              </p>
              
              <div className="whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed">
                {resource.content}
              </div>
            </div>

            {resource.url && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  External Link
                </h3>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Visit Resource →
                </a>
              </div>
            )}

            {resource.tags && resource.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, index) => (
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
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default ResourceDetail;