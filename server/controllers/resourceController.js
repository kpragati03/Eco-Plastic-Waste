const Resource = require('../models/Resource');
const User = require('../models/User');
const { ApiResponse, ApiError, asyncHandler } = require('../utils/ApiResponse');

// Get all resources with filtering and pagination
const getResources = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    type,
    difficulty,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = {};
  
  if (category) filter.category = category;
  if (type) filter.type = type;
  if (difficulty) filter.difficulty = difficulty;
  if (search) {
    filter.$text = { $search: search };
  }

  // For non-admin users, only show approved resources
  if (!req.user || req.user.role !== 'admin') {
    filter.status = 'approved';
  }

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const resources = await Resource.find(filter)
    .populate('author', 'name email')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Resource.countDocuments(filter);

  res.json(
    new ApiResponse(200, {
      resources,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    }, 'Resources retrieved successfully')
  );
});

// Get single resource
const getResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id)
    .populate('author', 'name email')
    .populate('likes.user', 'name');

  if (!resource) {
    throw new ApiError(404, 'Resource not found');
  }

  // Check if user can view this resource
  if (resource.status !== 'approved' && 
      (!req.user || (req.user.role !== 'admin' && resource.author._id.toString() !== req.user.id))) {
    throw new ApiError(403, 'Access denied');
  }

  // Increment view count
  resource.views += 1;
  await resource.save();

  // Add to user activity if authenticated
  if (req.user) {
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        activityHistory: {
          action: 'viewed_resource',
          resourceType: 'resource',
          resourceId: resource._id
        }
      }
    });
  }

  res.json(new ApiResponse(200, resource, 'Resource retrieved successfully'));
});

// Create resource
const createResource = asyncHandler(async (req, res) => {
  const resourceData = {
    ...req.body,
    author: req.user.id
  };

  const resource = await Resource.create(resourceData);
  await resource.populate('author', 'name email');

  res.status(201).json(
    new ApiResponse(201, resource, 'Resource created successfully')
  );
});

// Update resource
const updateResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    throw new ApiError(404, 'Resource not found');
  }

  // Check permissions
  if (req.user.role !== 'admin' && resource.author.toString() !== req.user.id) {
    throw new ApiError(403, 'Access denied');
  }

  // Don't allow updates to approved resources by non-admin users
  if (resource.status === 'approved' && req.user.role !== 'admin') {
    throw new ApiError(403, 'Cannot update approved resource');
  }

  const updatedResource = await Resource.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('author', 'name email');

  res.json(new ApiResponse(200, updatedResource, 'Resource updated successfully'));
});

// Delete resource
const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    throw new ApiError(404, 'Resource not found');
  }

  // Check permissions
  if (req.user.role !== 'admin' && resource.author.toString() !== req.user.id) {
    throw new ApiError(403, 'Access denied');
  }

  await Resource.findByIdAndDelete(req.params.id);

  res.json(new ApiResponse(200, null, 'Resource deleted successfully'));
});

// Like/Unlike resource
const toggleLike = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    throw new ApiError(404, 'Resource not found');
  }

  if (resource.status !== 'approved') {
    throw new ApiError(400, 'Resource is not approved');
  }

  const existingLike = resource.likes.find(
    like => like.user.toString() === req.user.id
  );

  if (existingLike) {
    // Unlike
    resource.likes = resource.likes.filter(
      like => like.user.toString() !== req.user.id
    );
  } else {
    // Like
    resource.likes.push({ user: req.user.id });
  }

  await resource.save();

  // Add to user activity
  await User.findByIdAndUpdate(req.user.id, {
    $push: {
      activityHistory: {
        action: existingLike ? 'unliked_resource' : 'liked_resource',
        resourceType: 'resource',
        resourceId: resource._id
      }
    }
  });

  res.json(new ApiResponse(200, {
    liked: !existingLike,
    likeCount: resource.likes.length
  }, existingLike ? 'Resource unliked' : 'Resource liked'));
});

// Get user's resources
const getMyResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({ author: req.user.id })
    .populate('author', 'name email')
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, resources, 'Your resources retrieved successfully'));
});

// Get popular resources
const getPopularResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({ status: 'approved' })
    .populate('author', 'name email')
    .sort({ views: -1, likeCount: -1 })
    .limit(10);

  res.json(new ApiResponse(200, resources, 'Popular resources retrieved successfully'));
});

// Get resource categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Resource.aggregate([
    { $match: { status: 'approved' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.json(new ApiResponse(200, categories, 'Resource categories retrieved successfully'));
});

module.exports = {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  toggleLike,
  getMyResources,
  getPopularResources,
  getCategories
};