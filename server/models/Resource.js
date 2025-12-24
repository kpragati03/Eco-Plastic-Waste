const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Resource title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Resource description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Resource content is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['tips', 'articles', 'videos', 'infographics', 'research', 'guides']
  },
  type: {
    type: String,
    required: [true, 'Resource type is required'],
    enum: ['text', 'video', 'pdf', 'image', 'link']
  },
  url: {
    type: String,
    default: null
  },
  thumbnail: {
    type: String,
    default: null
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  tags: [String],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  readTime: {
    type: Number, // in minutes
    default: 5
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  adminNotes: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
resourceSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Index for better search performance
resourceSchema.index({ status: 1, category: 1 });
resourceSchema.index({ title: 'text', description: 'text', content: 'text' });

module.exports = mongoose.model('Resource', resourceSchema);