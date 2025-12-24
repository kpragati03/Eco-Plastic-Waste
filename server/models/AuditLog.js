const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: [
      'user_created', 'user_updated', 'user_deleted', 'user_blocked', 'user_unblocked',
      'campaign_approved', 'campaign_rejected', 'campaign_deleted',
      'resource_approved', 'resource_rejected', 'resource_deleted',
      'agency_approved', 'agency_rejected', 'agency_deleted',
      'admin_login', 'admin_logout', 'settings_updated'
    ]
  },
  targetType: {
    type: String,
    enum: ['User', 'Campaign', 'Resource', 'Agency', 'System'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
auditLogSchema.index({ admin: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);