const express = require('express');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { resourceSchema } = require('../utils/validation');
const {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  toggleLike,
  getMyResources,
  getPopularResources,
  getCategories
} = require('../controllers/resourceController');

const router = express.Router();

// Public routes (with optional auth for personalization)
router.get('/', optionalAuth, getResources);
router.get('/popular', getPopularResources);
router.get('/categories', getCategories);
router.get('/:id', optionalAuth, getResource);

// Protected routes
router.use(authenticate);

// Content proposer and admin routes
router.post('/', authorize('content_proposer', 'admin'), validate(resourceSchema), createResource);
router.put('/:id', authorize('content_proposer', 'admin'), updateResource);
router.delete('/:id', authorize('content_proposer', 'admin'), deleteResource);
router.get('/my/resources', authorize('content_proposer', 'admin'), getMyResources);

// User interaction routes
router.post('/:id/like', toggleLike);

module.exports = router;