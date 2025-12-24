const Campaign = require('../models/Campaign');
const User = require('../models/User');
const { ApiResponse, ApiError, asyncHandler } = require('../utils/ApiResponse');

// Get all campaigns with filtering and pagination
const getCampaigns = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    status,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = {};
  
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } }
    ];
  }

  // For non-admin users, only show approved campaigns
  if (!req.user || req.user.role !== 'admin') {
    filter.status = 'approved';
  }

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const campaigns = await Campaign.find(filter)
    .populate('organizer', 'name email')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Campaign.countDocuments(filter);

  res.json(
    new ApiResponse(200, {
      campaigns,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    }, 'Campaigns retrieved successfully')
  );
});

// Get single campaign
const getCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id)
    .populate('organizer', 'name email')
    .populate('participants.user', 'name email');

  if (!campaign) {
    throw new ApiError(404, 'Campaign not found');
  }

  // Check if user can view this campaign
  if (campaign.status !== 'approved' && 
      (!req.user || (req.user.role !== 'admin' && campaign.organizer._id.toString() !== req.user.id))) {
    throw new ApiError(403, 'Access denied');
  }

  res.json(new ApiResponse(200, campaign, 'Campaign retrieved successfully'));
});

// Create campaign
const createCampaign = asyncHandler(async (req, res) => {
  const campaignData = {
    ...req.body,
    organizer: req.user.id
  };

  const campaign = await Campaign.create(campaignData);
  await campaign.populate('organizer', 'name email');

  res.status(201).json(
    new ApiResponse(201, campaign, 'Campaign created successfully')
  );
});

// Update campaign
const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    throw new ApiError(404, 'Campaign not found');
  }

  // Check permissions
  if (req.user.role !== 'admin' && campaign.organizer.toString() !== req.user.id) {
    throw new ApiError(403, 'Access denied');
  }

  // Don't allow updates to approved campaigns by non-admin users
  if (campaign.status === 'approved' && req.user.role !== 'admin') {
    throw new ApiError(403, 'Cannot update approved campaign');
  }

  const updatedCampaign = await Campaign.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('organizer', 'name email');

  res.json(new ApiResponse(200, updatedCampaign, 'Campaign updated successfully'));
});

// Delete campaign
const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    throw new ApiError(404, 'Campaign not found');
  }

  // Check permissions
  if (req.user.role !== 'admin' && campaign.organizer.toString() !== req.user.id) {
    throw new ApiError(403, 'Access denied');
  }

  await Campaign.findByIdAndDelete(req.params.id);

  res.json(new ApiResponse(200, null, 'Campaign deleted successfully'));
});

// Join campaign
const joinCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    throw new ApiError(404, 'Campaign not found');
  }

  if (campaign.status !== 'approved') {
    throw new ApiError(400, 'Campaign is not approved');
  }

  // Check if already joined
  const alreadyJoined = campaign.participants.some(
    participant => participant.user.toString() === req.user.id
  );

  if (alreadyJoined) {
    throw new ApiError(400, 'Already joined this campaign');
  }

  // Check max participants
  if (campaign.maxParticipants && campaign.participants.length >= campaign.maxParticipants) {
    throw new ApiError(400, 'Campaign is full');
  }

  campaign.participants.push({ user: req.user.id });
  await campaign.save();

  // Add to user activity
  await User.findByIdAndUpdate(req.user.id, {
    $push: {
      activityHistory: {
        action: 'joined_campaign',
        resourceType: 'campaign',
        resourceId: campaign._id
      }
    }
  });

  res.json(new ApiResponse(200, null, 'Successfully joined campaign'));
});

// Leave campaign
const leaveCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    throw new ApiError(404, 'Campaign not found');
  }

  campaign.participants = campaign.participants.filter(
    participant => participant.user.toString() !== req.user.id
  );

  await campaign.save();

  res.json(new ApiResponse(200, null, 'Successfully left campaign'));
});

// Get user's campaigns
const getMyCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({ organizer: req.user.id })
    .populate('organizer', 'name email')
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, campaigns, 'Your campaigns retrieved successfully'));
});

module.exports = {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  joinCampaign,
  leaveCampaign,
  getMyCampaigns
};