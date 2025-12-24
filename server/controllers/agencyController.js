const Agency = require('../models/Agency');
const User = require('../models/User');
const { ApiResponse, ApiError, asyncHandler } = require('../utils/ApiResponse');

// Get all agencies with filtering and pagination
const getAgencies = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    type,
    services,
    city,
    state,
    search,
    lat,
    lng,
    radius = 50, // km
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = {};
  
  if (type) filter.type = type;
  if (services) filter.services = { $in: services.split(',') };
  if (city) filter['address.city'] = { $regex: city, $options: 'i' };
  if (state) filter['address.state'] = { $regex: state, $options: 'i' };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'address.city': { $regex: search, $options: 'i' } },
      { 'address.state': { $regex: search, $options: 'i' } }
    ];
  }

  // For non-admin users, only show approved agencies
  if (!req.user || req.user.role !== 'admin') {
    filter.status = 'approved';
  }

  let query = Agency.find(filter);

  // Location-based search
  if (lat && lng) {
    query = Agency.find({
      ...filter,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    });
  } else {
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    query = query.sort(sort).skip(skip).limit(parseInt(limit));
  }

  const agencies = await query.populate('submittedBy', 'name email');
  
  let total;
  if (lat && lng) {
    total = agencies.length;
  } else {
    total = await Agency.countDocuments(filter);
  }

  res.json(
    new ApiResponse(200, {
      agencies,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    }, 'Agencies retrieved successfully')
  );
});

// Get single agency
const getAgency = asyncHandler(async (req, res) => {
  const agency = await Agency.findById(req.params.id)
    .populate('submittedBy', 'name email')
    .populate('reviews.user', 'name');

  if (!agency) {
    throw new ApiError(404, 'Agency not found');
  }

  // Check if user can view this agency
  if (agency.status !== 'approved' && 
      (!req.user || (req.user.role !== 'admin' && agency.submittedBy._id.toString() !== req.user.id))) {
    throw new ApiError(403, 'Access denied');
  }

  res.json(new ApiResponse(200, agency, 'Agency retrieved successfully'));
});

// Create agency
const createAgency = asyncHandler(async (req, res) => {
  const agencyData = {
    ...req.body,
    submittedBy: req.user.id
  };

  const agency = await Agency.create(agencyData);
  await agency.populate('submittedBy', 'name email');

  res.status(201).json(
    new ApiResponse(201, agency, 'Agency created successfully')
  );
});

// Update agency
const updateAgency = asyncHandler(async (req, res) => {
  const agency = await Agency.findById(req.params.id);

  if (!agency) {
    throw new ApiError(404, 'Agency not found');
  }

  // Check permissions
  if (req.user.role !== 'admin' && agency.submittedBy.toString() !== req.user.id) {
    throw new ApiError(403, 'Access denied');
  }

  // Don't allow updates to approved agencies by non-admin users
  if (agency.status === 'approved' && req.user.role !== 'admin') {
    throw new ApiError(403, 'Cannot update approved agency');
  }

  const updatedAgency = await Agency.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('submittedBy', 'name email');

  res.json(new ApiResponse(200, updatedAgency, 'Agency updated successfully'));
});

// Delete agency
const deleteAgency = asyncHandler(async (req, res) => {
  const agency = await Agency.findById(req.params.id);

  if (!agency) {
    throw new ApiError(404, 'Agency not found');
  }

  // Check permissions
  if (req.user.role !== 'admin' && agency.submittedBy.toString() !== req.user.id) {
    throw new ApiError(403, 'Access denied');
  }

  await Agency.findByIdAndDelete(req.params.id);

  res.json(new ApiResponse(200, null, 'Agency deleted successfully'));
});

// Add review to agency
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const agency = await Agency.findById(req.params.id);

  if (!agency) {
    throw new ApiError(404, 'Agency not found');
  }

  if (agency.status !== 'approved') {
    throw new ApiError(400, 'Agency is not approved');
  }

  // Check if user already reviewed
  const existingReview = agency.reviews.find(
    review => review.user.toString() === req.user.id
  );

  if (existingReview) {
    throw new ApiError(400, 'You have already reviewed this agency');
  }

  // Add review
  agency.reviews.push({
    user: req.user.id,
    rating,
    comment
  });

  // Update rating average
  const totalRating = agency.reviews.reduce((sum, review) => sum + review.rating, 0);
  agency.rating.average = totalRating / agency.reviews.length;
  agency.rating.count = agency.reviews.length;

  await agency.save();

  // Add to user activity
  await User.findByIdAndUpdate(req.user.id, {
    $push: {
      activityHistory: {
        action: 'reviewed_agency',
        resourceType: 'agency',
        resourceId: agency._id
      }
    }
  });

  res.json(new ApiResponse(200, agency, 'Review added successfully'));
});

// Get user's agencies
const getMyAgencies = asyncHandler(async (req, res) => {
  const agencies = await Agency.find({ submittedBy: req.user.id })
    .populate('submittedBy', 'name email')
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, agencies, 'Your agencies retrieved successfully'));
});

// Get nearby agencies
const getNearbyAgencies = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 10 } = req.query;

  if (!lat || !lng) {
    throw new ApiError(400, 'Latitude and longitude are required');
  }

  const agencies = await Agency.find({
    status: 'approved',
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: radius * 1000 // Convert km to meters
      }
    }
  }).populate('submittedBy', 'name email').limit(20);

  res.json(new ApiResponse(200, agencies, 'Nearby agencies retrieved successfully'));
});

// Get agency types
const getAgencyTypes = asyncHandler(async (req, res) => {
  const types = await Agency.aggregate([
    { $match: { status: 'approved' } },
    { $group: { _id: '$type', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.json(new ApiResponse(200, types, 'Agency types retrieved successfully'));
});

module.exports = {
  getAgencies,
  getAgency,
  createAgency,
  updateAgency,
  deleteAgency,
  addReview,
  getMyAgencies,
  getNearbyAgencies,
  getAgencyTypes
};