const express = require('express');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { campaignSchema } = require('../utils/validation');
const {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  joinCampaign,
  leaveCampaign,
  getMyCampaigns
} = require('../controllers/campaignController');

const router = express.Router();

// Public routes (with optional auth for personalization)
router.get('/', optionalAuth, getCampaigns);
router.get('/:id', optionalAuth, getCampaign);

// Protected routes
router.use(authenticate);

// Content proposer and admin routes
router.post('/', authorize('content_proposer', 'admin'), validate(campaignSchema), createCampaign);
router.put('/:id', authorize('content_proposer', 'admin'), updateCampaign);
router.delete('/:id', authorize('content_proposer', 'admin'), deleteCampaign);
router.get('/my/campaigns', authorize('content_proposer', 'admin'), getMyCampaigns);

// User participation routes
router.post('/:id/join', joinCampaign);
router.post('/:id/leave', leaveCampaign);

module.exports = router;