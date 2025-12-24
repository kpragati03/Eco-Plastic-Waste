const Joi = require('joi');

// User validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  role: Joi.string().valid('user', 'content_proposer').default('user')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Campaign validation schemas
const campaignSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  category: Joi.string().valid('awareness', 'cleanup', 'education', 'recycling', 'business').required(),
  startDate: Joi.date().min('now').required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required(),
  location: Joi.string().min(3).max(100).required(),
  maxParticipants: Joi.number().integer().min(1).optional(),
  tags: Joi.array().items(Joi.string().max(20)).max(10).optional()
});

// Resource validation schemas
const resourceSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  content: Joi.string().min(50).required(),
  category: Joi.string().valid('tips', 'articles', 'videos', 'infographics', 'research', 'guides').required(),
  type: Joi.string().valid('text', 'video', 'pdf', 'image', 'link').required(),
  url: Joi.string().uri().optional(),
  difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner'),
  readTime: Joi.number().integer().min(1).max(120).default(5),
  tags: Joi.array().items(Joi.string().max(20)).max(10).optional()
});

// Agency validation schemas
const agencySchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  type: Joi.string().valid('recycling_center', 'ngo', 'business', 'government').required(),
  contact: Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[+]?[\d\s\-\(\)]{10,15}$/).required(),
    website: Joi.string().uri().optional()
  }).required(),
  address: Joi.object({
    street: Joi.string().min(5).max(100).required(),
    city: Joi.string().min(2).max(50).required(),
    state: Joi.string().min(2).max(50).required(),
    zipCode: Joi.string().pattern(/^[\d\-\s]{3,10}$/).required(),
    country: Joi.string().min(2).max(50).default('India')
  }).required(),
  location: Joi.object({
    coordinates: Joi.array().items(Joi.number()).length(2).required()
  }).required(),
  services: Joi.array().items(
    Joi.string().valid('plastic_collection', 'recycling', 'awareness', 'education', 'consultation')
  ).min(1).required(),
  acceptedMaterials: Joi.array().items(
    Joi.string().valid('pet_bottles', 'plastic_bags', 'containers', 'electronics', 'all_plastics')
  ).min(1).required()
});

module.exports = {
  registerSchema,
  loginSchema,
  campaignSchema,
  resourceSchema,
  agencySchema
};