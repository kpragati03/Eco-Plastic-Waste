const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
  getBookmarks,
  addBookmark,
  removeBookmark,
  getActivityHistory,
  clearActivityHistory,
  getUserStats,
  getJoinedCampaigns,
  updatePreferences
} = require('../controllers/userController');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Bookmark routes
router.get('/bookmarks', getBookmarks);
router.post('/bookmarks', addBookmark);
router.delete('/bookmarks', removeBookmark);

// Activity routes
router.get('/activity', getActivityHistory);
router.delete('/activity', clearActivityHistory);

// User data routes
router.get('/stats', getUserStats);
router.get('/campaigns/joined', getJoinedCampaigns);
router.put('/preferences', updatePreferences);

module.exports = router;