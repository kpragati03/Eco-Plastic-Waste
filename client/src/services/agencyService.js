import api from './api';

// Mock agencies storage
let mockAgencies = [
  {
    _id: '1',
    name: 'GreenCycle Recycling Center',
    description: 'State-of-the-art plastic recycling facility accepting all types of plastic waste.',
    type: 'recycling_center',
    address: { 
      street: '123 Industrial Area, Sector 15',
      city: 'Mumbai', 
      state: 'Maharashtra', 
      zipCode: '400001',
      country: 'India'
    },
    contact: { 
      phone: '+91-22-1234-5678', 
      email: 'info@greencycle.com',
      website: 'https://greencycle.com'
    },
    services: ['plastic_collection', 'recycling', 'consultation'],
    acceptedMaterials: ['pet_bottles', 'plastic_bags', 'containers', 'all_plastics'],
    rating: { average: 4.5, count: 128 },
    operatingHours: 'Mon-Sat: 8AM-6PM',
    status: 'approved'
  }
];

export const agencyService = {
  // Get all agencies
  getAgencies: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockAgencies };
  },

  // Get single agency
  getAgency: async (id) => {
    const response = await api.get(`/agencies/${id}`);
    return response.data;
  },

  // Create agency
  createAgency: async (agencyData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newAgency = {
      _id: Date.now().toString(),
      ...agencyData,
      rating: { average: 0, count: 0 },
      status: 'approved',
      reviews: [],
      createdAt: new Date().toISOString()
    };
    
    mockAgencies.unshift(newAgency);
    return { data: newAgency };
  },

  // Update agency
  updateAgency: async (id, agencyData) => {
    const response = await api.put(`/agencies/${id}`, agencyData);
    return response.data;
  },

  // Delete agency
  deleteAgency: async (id) => {
    const response = await api.delete(`/agencies/${id}`);
    return response.data;
  },

  // Add review
  addReview: async (id, reviewData) => {
    const response = await api.post(`/agencies/${id}/review`, reviewData);
    return response.data;
  },

  // Get user's agencies
  getMyAgencies: async () => {
    const response = await api.get('/agencies/my/agencies');
    return response.data;
  },

  // Get nearby agencies
  getNearbyAgencies: async (params) => {
    const response = await api.get('/agencies/nearby', { params });
    return response.data;
  },

  // Get agency types
  getAgencyTypes: async () => {
    const response = await api.get('/agencies/types');
    return response.data;
  }
};