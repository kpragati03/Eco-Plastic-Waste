// Mock campaigns storage
let mockCampaigns = [
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
  }
];

export const campaignService = {
  getCampaigns: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockCampaigns };
  },

  getCampaign: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const campaign = mockCampaigns.find(c => c._id === id);
    return { data: campaign };
  },

  createCampaign: async (campaignData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newCampaign = {
      _id: Date.now().toString(),
      ...campaignData,
      status: 'active',
      organizer: { name: 'User Campaign' },
      participants: [],
      participantCount: 0,
      createdAt: new Date().toISOString()
    };
    
    mockCampaigns.unshift(newCampaign);
    return { data: newCampaign };
  }
};