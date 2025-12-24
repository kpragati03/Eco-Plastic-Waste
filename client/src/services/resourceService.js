import api from './api';

// Mock resources storage
let mockResources = [
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
  }
];

export const resourceService = {
  // Get all resources
  getResources: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockResources };
  },

  // Get single resource
  getResource: async (id) => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },

  // Create resource
  createResource: async (resourceData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newResource = {
      _id: Date.now().toString(),
      ...resourceData,
      views: 0,
      likes: [],
      likeCount: 0,
      author: { name: 'User Resource', email: 'user@example.com' },
      readTime: Math.ceil(resourceData.content.length / 200),
      createdAt: new Date().toISOString()
    };
    
    mockResources.unshift(newResource);
    return { data: newResource };
  },

  // Update resource
  updateResource: async (id, resourceData) => {
    const response = await api.put(`/resources/${id}`, resourceData);
    return response.data;
  },

  // Delete resource
  deleteResource: async (id) => {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  },

  // Toggle like
  toggleLike: async (id) => {
    const response = await api.post(`/resources/${id}/like`);
    return response.data;
  },

  // Get user's resources
  getMyResources: async () => {
    const response = await api.get('/resources/my/resources');
    return response.data;
  },

  // Get popular resources
  getPopularResources: async () => {
    const response = await api.get('/resources/popular');
    return response.data;
  },

  // Get resource categories
  getCategories: async () => {
    const response = await api.get('/resources/categories');
    return response.data;
  }
};