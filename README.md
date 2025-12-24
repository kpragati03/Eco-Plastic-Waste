# Plastic Waste Reduction and Awareness Portal

A comprehensive MERN stack web application designed to promote plastic waste reduction through awareness campaigns, educational resources, and recycling center locators.

## 🌟 Features

### Core Features
- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Awareness Campaigns** - Create, join, and manage environmental campaigns
- **Educational Resources** - Share and access tips, articles, videos, and research
- **Recycling Center Locator** - Find nearby recycling centers and waste management facilities
- **Admin Panel** - Comprehensive dashboard for content moderation and user management

### User Roles
- **End Users** - Browse content, join campaigns, bookmark resources
- **Content Proposers** - Create campaigns, submit resources and agencies
- **Administrators** - Full system management and content moderation

### Technical Features
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark/Light Mode** - Theme switching with system preference detection
- **Real-time Updates** - Live notifications and updates
- **Advanced Search & Filtering** - Comprehensive search across all content types
- **Pagination & Infinite Scroll** - Optimized content loading
- **File Upload Support** - Image and document upload capabilities

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **React Query** - Server state management
- **Axios** - HTTP client with interceptors

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Joi** - Data validation
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Eco-Plastic-Waste
```

### 2. Install Dependencies

#### Root Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd server
npm install
```

#### Frontend Dependencies
```bash
cd client
npm install
```

### 3. Environment Configuration

#### Backend Environment (.env)
```bash
cd server
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/plastic_portal

# JWT Secrets (Change these in production!)
JWT_ACCESS_SECRET=plastic_portal_access_secret_2024_dev_key
JWT_REFRESH_SECRET=plastic_portal_refresh_secret_2024_dev_key
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Admin Credentials
ADMIN_EMAIL=admin@plasticportal.com
ADMIN_PASSWORD=Admin@123

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Environment (.env)
```bash
cd client
cp .env.example .env
```

Update the `.env` file:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1

# App Configuration
VITE_APP_NAME=EcoPortal
VITE_APP_VERSION=1.0.0
```

### 4. Database Setup

Ensure MongoDB is running on your system:
```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# macOS (using Homebrew)
brew services start mongodb-community

# Linux (using systemd)
sudo systemctl start mongod
```

The application will automatically:
- Create the database and collections
- Set up indexes for optimal performance
- Create a default admin user

### 5. Start the Application

#### Development Mode (Recommended)
From the root directory:
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 5173) concurrently.

#### Individual Services
```bash
# Backend only
npm run server

# Frontend only
npm run client
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 👤 Default Admin Credentials

```
Email: admin@plasticportal.com
Password: Admin@123
```

**⚠️ Important**: Change these credentials in production!

## 📁 Project Structure

```
Eco-Plastic-Waste/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API service functions
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── layouts/        # Layout components
│   │   └── App.jsx         # Main app component
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── middleware/        # Custom middleware
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration files
│   ├── package.json
│   └── server.js          # Main server file
├── package.json           # Root package.json
└── README.md
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start backend server only
- `npm run client` - Start frontend development server only
- `npm run build` - Build frontend for production
- `npm start` - Start backend in production mode

### Backend (server/)
- `npm start` - Start server in production mode
- `npm run dev` - Start server with nodemon for development

### Frontend (client/)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🌐 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/profile` - Update user profile
- `PUT /api/v1/auth/change-password` - Change password

### Campaign Endpoints
- `GET /api/v1/campaigns` - Get all campaigns (with filters)
- `GET /api/v1/campaigns/:id` - Get single campaign
- `POST /api/v1/campaigns` - Create campaign (Content Proposer/Admin)
- `PUT /api/v1/campaigns/:id` - Update campaign
- `DELETE /api/v1/campaigns/:id` - Delete campaign
- `POST /api/v1/campaigns/:id/join` - Join campaign
- `POST /api/v1/campaigns/:id/leave` - Leave campaign

### Resource Endpoints
- `GET /api/v1/resources` - Get all resources (with filters)
- `GET /api/v1/resources/:id` - Get single resource
- `POST /api/v1/resources` - Create resource (Content Proposer/Admin)
- `PUT /api/v1/resources/:id` - Update resource
- `DELETE /api/v1/resources/:id` - Delete resource
- `POST /api/v1/resources/:id/like` - Like/unlike resource

### Agency Endpoints
- `GET /api/v1/agencies` - Get all agencies (with filters)
- `GET /api/v1/agencies/:id` - Get single agency
- `POST /api/v1/agencies` - Create agency (Content Proposer/Admin)
- `PUT /api/v1/agencies/:id` - Update agency
- `DELETE /api/v1/agencies/:id` - Delete agency
- `POST /api/v1/agencies/:id/review` - Add review to agency

### Admin Endpoints
- `GET /api/v1/admin/dashboard/stats` - Dashboard statistics
- `GET /api/v1/admin/users` - User management
- `GET /api/v1/admin/campaigns/pending` - Pending campaigns
- `GET /api/v1/admin/resources/pending` - Pending resources
- `GET /api/v1/admin/agencies/pending` - Pending agencies
- `GET /api/v1/admin/audit-logs` - Audit logs

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt for password security
- **Rate Limiting** - API endpoint protection
- **Helmet.js** - Security headers
- **Input Validation** - Joi schema validation
- **CORS Configuration** - Cross-origin request handling
- **Environment Variables** - Secure configuration management

## 🎨 UI/UX Features

- **Responsive Design** - Works on all device sizes
- **Dark/Light Mode** - Theme switching with persistence
- **Smooth Animations** - Framer Motion animations
- **Loading States** - Skeleton loaders and spinners
- **Toast Notifications** - User feedback system
- **Accessible Design** - ARIA compliance and keyboard navigation
- **Modern Design System** - Consistent styling with Tailwind CSS

## 🚀 Deployment

### Frontend Deployment
1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `dist` folder to your hosting service (Netlify, Vercel, etc.)

### Backend Deployment
1. Set production environment variables
2. Deploy to your hosting service (Heroku, Railway, DigitalOcean, etc.)
3. Ensure MongoDB is accessible from your production environment

### Environment Variables for Production
Update your production environment variables:
- Change JWT secrets to strong, unique values
- Update MONGODB_URI to your production database
- Set NODE_ENV to "production"
- Update CORS origins to your production domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include error messages, screenshots, and steps to reproduce

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the flexible database
- All contributors and the open-source community

---

**Built with ❤️ for a sustainable future** 🌱