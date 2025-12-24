const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Resource = require('../models/Resource');
const Agency = require('../models/Agency');
const AuditLog = require('../models/AuditLog');
const { ApiResponse, ApiError, asyncHandler } = require('../utils/ApiResponse');

// Dashboard analytics
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalCampaigns,
    totalResources,
    totalAgencies,
    pendingCampaigns,
    pendingResources,
    pendingAgencies,
    recentUsers,
    campaignsByCategory,
    usersByRole
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: 'admin' } }),
    Campaign.countDocuments(),
    Resource.countDocuments(),
    Agency.countDocuments(),
    Campaign.countDocuments({ status: 'pending' }),
    Resource.countDocuments({ status: 'pending' }),
    Agency.countDocuments({ status: 'pending' }),
    User.find({ role: { $ne: 'admin' } })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt'),
    Campaign.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]),
    User.aggregate([
      { $match: { role: { $ne: 'admin' } } },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ])
  ]);

  const stats = {
    overview: {
      totalUsers,
      totalCampaigns,
      totalResources,
      totalAgencies
    },
    pending: {
      campaigns: pendingCampaigns,
      resources: pendingResources,
      agencies: pendingAgencies
    },
    recentUsers,
    charts: {
      campaignsByCategory: campaignsByCategory.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    }
  };

  res.json(new ApiResponse(200, stats, 'Dashboard stats retrieved successfully'));
});

// User management
const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, search, status } = req.query;

  const filter = { role: { $ne: 'admin' } };
  if (role) filter.role = role;
  if (status) filter.isActive = status === 'active';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments(filter);

  res.json(
    new ApiResponse(200, {
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    }, 'Users retrieved successfully')
  );
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role === 'admin') {
    throw new ApiError(403, 'Cannot modify admin user');
  }

  user.isActive = isActive;
  await user.save();

  // Log action
  await AuditLog.create({
    admin: req.user.id,
    action: isActive ? 'user_unblocked' : 'user_blocked',
    targetType: 'User',
    targetId: user._id,
    details: { previousStatus: !isActive, newStatus: isActive },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json(new ApiResponse(200, user, `User ${isActive ? 'activated' : 'deactivated'} successfully`));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role === 'admin') {
    throw new ApiError(403, 'Cannot delete admin user');
  }

  await User.findByIdAndDelete(id);

  // Log action
  await AuditLog.create({
    admin: req.user.id,
    action: 'user_deleted',
    targetType: 'User',
    targetId: user._id,
    details: { deletedUser: { name: user.name, email: user.email, role: user.role } },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json(new ApiResponse(200, null, 'User deleted successfully'));
});

// Campaign management
const getPendingCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({ status: 'pending' })
    .populate('organizer', 'name email')
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, campaigns, 'Pending campaigns retrieved successfully'));
});

const updateCampaignStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const campaign = await Campaign.findByIdAndUpdate(
    id,
    { status, adminNotes },
    { new: true, runValidators: true }
  ).populate('organizer', 'name email');

  if (!campaign) {
    throw new ApiError(404, 'Campaign not found');
  }

  // Log action
  await AuditLog.create({
    admin: req.user.id,
    action: `campaign_${status}`,
    targetType: 'Campaign',
    targetId: campaign._id,
    details: { title: campaign.title, organizer: campaign.organizer.name, adminNotes },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json(new ApiResponse(200, campaign, `Campaign ${status} successfully`));
});

// Resource management
const getPendingResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({ status: 'pending' })
    .populate('author', 'name email')
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, resources, 'Pending resources retrieved successfully'));
});

const updateResourceStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const resource = await Resource.findByIdAndUpdate(
    id,
    { status, adminNotes },
    { new: true, runValidators: true }
  ).populate('author', 'name email');

  if (!resource) {
    throw new ApiError(404, 'Resource not found');
  }

  // Log action
  await AuditLog.create({
    admin: req.user.id,
    action: `resource_${status}`,
    targetType: 'Resource',
    targetId: resource._id,
    details: { title: resource.title, author: resource.author.name, adminNotes },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json(new ApiResponse(200, resource, `Resource ${status} successfully`));
});

// Agency management
const getPendingAgencies = asyncHandler(async (req, res) => {
  const agencies = await Agency.find({ status: 'pending' })
    .populate('submittedBy', 'name email')
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, agencies, 'Pending agencies retrieved successfully'));
});

const updateAgencyStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const agency = await Agency.findByIdAndUpdate(
    id,
    { status, adminNotes },
    { new: true, runValidators: true }
  ).populate('submittedBy', 'name email');

  if (!agency) {
    throw new ApiError(404, 'Agency not found');
  }

  // Log action
  await AuditLog.create({
    admin: req.user.id,
    action: `agency_${status}`,
    targetType: 'Agency',
    targetId: agency._id,
    details: { name: agency.name, submittedBy: agency.submittedBy.name, adminNotes },
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json(new ApiResponse(200, agency, `Agency ${status} successfully`));
});

// Audit logs
const getAuditLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, action, admin } = req.query;

  const filter = {};
  if (action) filter.action = action;
  if (admin) filter.admin = admin;

  const skip = (page - 1) * limit;

  const logs = await AuditLog.find(filter)
    .populate('admin', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await AuditLog.countDocuments(filter);

  res.json(
    new ApiResponse(200, {
      logs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    }, 'Audit logs retrieved successfully')
  );
});

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  deleteUser,
  getPendingCampaigns,
  updateCampaignStatus,
  getPendingResources,
  updateResourceStatus,
  getPendingAgencies,
  updateAgencyStatus,
  getAuditLogs
};