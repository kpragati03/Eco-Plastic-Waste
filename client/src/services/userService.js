import api from './api';

// Mock bookmarks storage
let mockBookmarks = [];
let mockActivities = [];

const logActivity = (action, resourceType, resourceId, resourceDetails) => {
  const activity = {
    action,
    resourceType,
    resourceId,
    resourceDetails,
    timestamp: new Date().toISOString()
  };
  mockActivities.unshift(activity); // Add to beginning
  // Keep only last 100 activities
  if (mockActivities.length > 100) {
    mockActivities = mockActivities.slice(0, 100);
  }
};

export const userService = {
  // Bookmarks
  getBookmarks: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockBookmarks };
  },

  addBookmark: async (bookmarkData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if bookmark already exists
    const exists = mockBookmarks.find(
      b => b.resourceType === bookmarkData.resourceType && 
           b.resourceId._id === bookmarkData.resourceId
    );
    
    if (!exists) {
      const newBookmark = {
        resourceType: bookmarkData.resourceType,
        resourceId: { _id: bookmarkData.resourceId },
        addedAt: new Date().toISOString()
      };
      
      // Add mock resource data based on type
      if (bookmarkData.resourceType === 'resource') {
        const mockResources = [
          {
            _id: '1',
            title: '10 Simple Ways to Reduce Plastic Waste at Home',
            description: 'Practical tips for reducing single-use plastics in your daily routine.',
            category: 'tips'
          },
          {
            _id: '2',
            title: 'The Science Behind Plastic Pollution in Oceans',
            description: 'Comprehensive research article on how plastic waste affects marine ecosystems.',
            category: 'articles'
          },
          {
            _id: '3',
            title: 'How to Make Plastic-Free Cleaning Products',
            description: 'Step-by-step video guide to creating eco-friendly cleaning solutions.',
            category: 'videos'
          },
          {
            _id: '4',
            title: 'Plastic Waste Statistics Infographic 2024',
            description: 'Visual representation of global plastic waste data and recycling rates.',
            category: 'infographics'
          },
          {
            _id: '5',
            title: 'Microplastics in Food Chain: Latest Research',
            description: 'Academic research paper on microplastic contamination in food systems.',
            category: 'research'
          },
          {
            _id: '6',
            title: 'Complete Guide to Plastic-Free Living',
            description: 'Comprehensive guide covering all aspects of adopting a zero-waste lifestyle.',
            category: 'guides'
          }
        ];
        const resource = mockResources.find(r => r._id === bookmarkData.resourceId);
        if (resource) {
          newBookmark.resourceId = resource;
          logActivity('bookmarked_resource', 'resource', resource._id, resource);
        }
      } else if (bookmarkData.resourceType === 'agency') {
        const mockAgencies = [
          {
            _id: '1',
            name: 'GreenCycle Recycling Center',
            description: 'State-of-the-art plastic recycling facility accepting all types of plastic waste.',
            type: 'recycling_center'
          },
          {
            _id: '2',
            name: 'EcoWarriors Foundation',
            description: 'Non-profit organization dedicated to plastic waste awareness and community education.',
            type: 'ngo'
          },
          {
            _id: '3',
            name: 'PlasticFree Solutions Pvt Ltd',
            description: 'Corporate plastic waste management solutions for businesses.',
            type: 'business'
          },
          {
            _id: '4',
            name: 'Municipal Waste Management Department',
            description: 'Government-run waste management facility providing free plastic collection services.',
            type: 'government'
          }
        ];
        const agency = mockAgencies.find(a => a._id === bookmarkData.resourceId);
        if (agency) {
          newBookmark.resourceId = agency;
          logActivity('bookmarked_agency', 'agency', agency._id, agency);
        }
      } else if (bookmarkData.resourceType === 'campaign') {
        const mockCampaigns = [
          {
            _id: '1',
            title: 'Beach Cleanup Drive Mumbai',
            description: 'Join us for a massive beach cleanup drive at Juhu Beach.',
            category: 'cleanup'
          },
          {
            _id: '2',
            title: 'Plastic-Free Schools Initiative',
            description: 'Educational campaign to make schools plastic-free.',
            category: 'education'
          },
          {
            _id: '3',
            title: 'Corporate Plastic Reduction Challenge',
            description: 'Challenge for businesses to reduce single-use plastic by 50%.',
            category: 'business'
          }
        ];
        const campaign = mockCampaigns.find(c => c._id === bookmarkData.resourceId);
        if (campaign) {
          newBookmark.resourceId = campaign;
        }
      }
      
      mockBookmarks.push(newBookmark);
    }
    
    return { data: { message: 'Bookmark added successfully' } };
  },

  removeBookmark: async (bookmarkData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    mockBookmarks = mockBookmarks.filter(
      b => !(b.resourceType === bookmarkData.resourceType && 
             b.resourceId._id === bookmarkData.resourceId)
    );
    
    return { data: { message: 'Bookmark removed successfully' } };
  },

  // Activity
  getActivityHistory: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const { page = 1, limit = 20 } = params;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedActivities = mockActivities.slice(startIndex, endIndex);
    
    return {
      data: {
        activities: paginatedActivities,
        pagination: {
          current: page,
          pages: Math.ceil(mockActivities.length / limit),
          total: mockActivities.length
        }
      }
    };
  },

  clearActivityHistory: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockActivities = [];
    return { data: { message: 'Activity history cleared' } };
  },

  logActivity: async (action, resourceType, resourceId, resourceDetails) => {
    logActivity(action, resourceType, resourceId, resourceDetails);
    return { data: { message: 'Activity logged' } };
  },

  // User data
  getUserStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  getJoinedCampaigns: async () => {
    const response = await api.get('/users/campaigns/joined');
    return response.data;
  },

  updatePreferences: async (preferences) => {
    const response = await api.put('/users/preferences', { preferences });
    return response.data;
  }
};