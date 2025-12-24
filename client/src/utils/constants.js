// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  CAMPAIGNS: {
    BASE: '/campaigns',
    MY: '/campaigns/my/campaigns',
    JOIN: (id) => `/campaigns/${id}/join`,
    LEAVE: (id) => `/campaigns/${id}/leave`,
  },
  RESOURCES: {
    BASE: '/resources',
    MY: '/resources/my/resources',
    POPULAR: '/resources/popular',
    CATEGORIES: '/resources/categories',
    LIKE: (id) => `/resources/${id}/like`,
  },
  AGENCIES: {
    BASE: '/agencies',
    MY: '/agencies/my/agencies',
    NEARBY: '/agencies/nearby',
    TYPES: '/agencies/types',
    REVIEW: (id) => `/agencies/${id}/review`,
  },
  USERS: {
    BOOKMARKS: '/users/bookmarks',
    ACTIVITY: '/users/activity',
    STATS: '/users/stats',
    JOINED_CAMPAIGNS: '/users/campaigns/joined',
    PREFERENCES: '/users/preferences',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard/stats',
    USERS: '/admin/users',
    PENDING_CAMPAIGNS: '/admin/campaigns/pending',
    PENDING_RESOURCES: '/admin/resources/pending',
    PENDING_AGENCIES: '/admin/agencies/pending',
    AUDIT_LOGS: '/admin/audit-logs',
  },
};

// User roles
export const USER_ROLES = {
  USER: 'user',
  CONTENT_PROPOSER: 'content_proposer',
  ADMIN: 'admin',
};

// Campaign categories
export const CAMPAIGN_CATEGORIES = [
  { value: 'awareness', label: 'Awareness' },
  { value: 'cleanup', label: 'Cleanup' },
  { value: 'education', label: 'Education' },
  { value: 'recycling', label: 'Recycling' },
  { value: 'business', label: 'Business' },
];

// Resource categories
export const RESOURCE_CATEGORIES = [
  { value: 'tips', label: 'Tips' },
  { value: 'articles', label: 'Articles' },
  { value: 'videos', label: 'Videos' },
  { value: 'infographics', label: 'Infographics' },
  { value: 'research', label: 'Research' },
  { value: 'guides', label: 'Guides' },
];

// Resource types
export const RESOURCE_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'video', label: 'Video' },
  { value: 'pdf', label: 'PDF' },
  { value: 'image', label: 'Image' },
  { value: 'link', label: 'Link' },
];

// Resource difficulty levels
export const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

// Agency types
export const AGENCY_TYPES = [
  { value: 'recycling_center', label: 'Recycling Center' },
  { value: 'ngo', label: 'NGO' },
  { value: 'business', label: 'Business' },
  { value: 'government', label: 'Government' },
];

// Agency services
export const AGENCY_SERVICES = [
  { value: 'plastic_collection', label: 'Plastic Collection' },
  { value: 'recycling', label: 'Recycling' },
  { value: 'awareness', label: 'Awareness' },
  { value: 'education', label: 'Education' },
  { value: 'consultation', label: 'Consultation' },
];

// Accepted materials
export const ACCEPTED_MATERIALS = [
  { value: 'pet_bottles', label: 'PET Bottles' },
  { value: 'plastic_bags', label: 'Plastic Bags' },
  { value: 'containers', label: 'Containers' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'all_plastics', label: 'All Plastics' },
];

// Status options
export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

// Campaign status options (specific for campaigns)
export const CAMPAIGN_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

// Sort options
export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'title', label: 'Title' },
  { value: 'name', label: 'Name' },
  { value: 'views', label: 'Views' },
  { value: 'likes', label: 'Likes' },
  { value: 'rating', label: 'Rating' },
];

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMITS: [5, 10, 20, 50],
};

// File upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
};

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  PREFERENCES: 'preferences',
};

// Toast messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful!',
    REGISTER: 'Registration successful!',
    LOGOUT: 'Logged out successfully',
    PROFILE_UPDATED: 'Profile updated successfully!',
    PASSWORD_CHANGED: 'Password changed successfully!',
    CAMPAIGN_CREATED: 'Campaign created successfully!',
    CAMPAIGN_UPDATED: 'Campaign updated successfully!',
    CAMPAIGN_DELETED: 'Campaign deleted successfully!',
    RESOURCE_CREATED: 'Resource created successfully!',
    RESOURCE_UPDATED: 'Resource updated successfully!',
    RESOURCE_DELETED: 'Resource deleted successfully!',
    AGENCY_CREATED: 'Agency created successfully!',
    AGENCY_UPDATED: 'Agency updated successfully!',
    AGENCY_DELETED: 'Agency deleted successfully!',
    BOOKMARK_ADDED: 'Bookmark added successfully!',
    BOOKMARK_REMOVED: 'Bookmark removed successfully!',
  },
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    VALIDATION: 'Please check your input and try again.',
    NOT_FOUND: 'The requested resource was not found.',
  },
};

// Animation variants for Framer Motion
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};