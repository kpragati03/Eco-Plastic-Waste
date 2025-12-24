const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Resource = require('../models/Resource');
const Agency = require('../models/Agency');
const { ApiResponse, ApiError, asyncHandler } = require('../utils/ApiResponse');

// Get user bookmarks
const getBookmarks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate([
    {
      path: 'bookmarks.resourceId',
      select: 'title description category status createdAt',
      populate: {
        path: 'organizer author submittedBy',
        select: 'name email'
      }
    }
  ]);

  const bookmarks = user.bookmarks.filter(bookmark => bookmark.resourceId);

  res.json(new ApiResponse(200, bookmarks, 'Bookmarks retrieved successfully'));
});

// Add bookmark
const addBookmark = asyncHandler(async (req, res) => {
  const { resourceType, resourceId } = req.body;

  // Validate resource type
  if (!['campaign', 'resource', 'agency'].includes(resourceType)) {
    throw new ApiError(400, 'Invalid resource type');
  }

  // Check if resource exists
  let resource;
  switch (resourceType) {
    case 'campaign':
      resource = await Campaign.findById(resourceId);
      break;
    case 'resource':
      resource = await Resource.findById(resourceId);
      break;
    case 'agency':
      resource = await Agency.findById(resourceId);
      break;
  }

  if (!resource) {
    throw new ApiError(404, 'Resource not found');
  }

  // Check if already bookmarked
  const user = await User.findById(req.user.id);
  const existingBookmark = user.bookmarks.find(
    bookmark => bookmark.resourceId.toString() === resourceId && bookmark.resourceType === resourceType
  );

  if (existingBookmark) {
    throw new ApiError(400, 'Resource already bookmarked');
  }

  // Add bookmark
  user.bookmarks.push({ resourceType, resourceId });
  await user.save();

  res.json(new ApiResponse(200, null, 'Bookmark added successfully'));
});

// Remove bookmark
const removeBookmark = asyncHandler(async (req, res) => {
  const { resourceType, resourceId } = req.body;

  const user = await User.findById(req.user.id);
  user.bookmarks = user.bookmarks.filter(
    bookmark => !(bookmark.resourceId.toString() === resourceId && bookmark.resourceType === resourceType)
  );

  await user.save();

  res.json(new ApiResponse(200, null, 'Bookmark removed successfully'));
});

// Get user activity history
const getActivityHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const user = await User.findById(req.user.id);
  const skip = (page - 1) * limit;

  const activities = user.activityHistory
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(skip, skip + parseInt(limit));

  // Populate resource details
  const populatedActivities = await Promise.all(
    activities.map(async (activity) => {
      let resourceDetails = null;
      
      try {
        switch (activity.resourceType) {
          case 'campaign':
            resourceDetails = await Campaign.findById(activity.resourceId).select('title status');
            break;
          case 'resource':
            resourceDetails = await Resource.findById(activity.resourceId).select('title status');
            break;
          case 'agency':
            resourceDetails = await Agency.findById(activity.resourceId).select('name status');
            break;
        }
      } catch (error) {
        // Resource might have been deleted
      }

      return {
        ...activity.toObject(),
        resourceDetails
      };
    })
  );

  res.json(
    new ApiResponse(200, {
      activities: populatedActivities,
      pagination: {
        current: parseInt(page),
        total: user.activityHistory.length,
        pages: Math.ceil(user.activityHistory.length / limit)
      }
    }, 'Activity history retrieved successfully')
  );
});

// Clear activity history
const clearActivityHistory = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    $set: { activityHistory: [] }
  });

  res.json(new ApiResponse(200, null, 'Activity history cleared successfully'));
});

// Get user statistics
const getUserStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [
    campaignsCreated,
    campaignsJoined,
    resourcesCreated,
    agenciesSubmitted,
    bookmarksCount
  ] = await Promise.all([
    Campaign.countDocuments({ organizer: userId }),
    Campaign.countDocuments({ 'participants.user': userId }),
    Resource.countDocuments({ author: userId }),
    Agency.countDocuments({ submittedBy: userId }),
    User.findById(userId).then(user => user.bookmarks.length)
  ]);

  const stats = {
    campaignsCreated,
    campaignsJoined,
    resourcesCreated,
    agenciesSubmitted,
    bookmarksCount
  };

  res.json(new ApiResponse(200, stats, 'User statistics retrieved successfully'));
});

// Get user's joined campaigns
const getJoinedCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({
    'participants.user': req.user.id,
    status: 'approved'
  })
    .populate('organizer', 'name email')
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, campaigns, 'Joined campaigns retrieved successfully'));
});

// Update user preferences
const updatePreferences = asyncHandler(async (req, res) => {
  const { preferences } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { preferences },
    { new: true, runValidators: true }
  );

  res.json(new ApiResponse(200, user, 'Preferences updated successfully'));
});

module.exports = {
  getBookmarks,
  addBookmark,
  removeBookmark,
  getActivityHistory,
  clearActivityHistory,
  getUserStats,
  getJoinedCampaigns,
  updatePreferences
};