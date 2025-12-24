const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
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
} = require('../controllers/adminController');

const router = express.Router();

// All routes require admin authentication
router.use(authenticate, authorize('admin'));

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// User management
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Campaign management
router.get('/campaigns/pending', getPendingCampaigns);
router.put('/campaigns/:id/status', updateCampaignStatus);

// Resource management
router.get('/resources/pending', getPendingResources);
router.put('/resources/:id/status', updateResourceStatus);

// Agency management
router.get('/agencies/pending', getPendingAgencies);
router.put('/agencies/:id/status', updateAgencyStatus);

// Audit logs
router.get('/audit-logs', getAuditLogs);

module.exports = router;