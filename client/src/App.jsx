import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Campaigns from './pages/campaigns/Campaigns';
import CampaignDetail from './pages/campaigns/CampaignDetail';
import CreateCampaign from './pages/campaigns/CreateCampaign';
import CreateResource from './pages/resources/CreateResource';
import CreateAgency from './pages/agencies/CreateAgency';
import Analytics from './pages/analytics/Analytics';
import Resources from './pages/resources/Resources';
import ResourceDetail from './pages/resources/ResourceDetail';
import Agencies from './pages/agencies/Agencies';
import AgencyDetail from './pages/agencies/AgencyDetail';
import Profile from './pages/user/Profile';
import Bookmarks from './pages/user/Bookmarks';
import Activity from './pages/user/Activity';
import Dashboard from './pages/dashboard/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import About from './pages/About';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="campaigns" element={<Campaigns />} />
                  <Route path="campaigns/create" element={
                    <ProtectedRoute>
                      <CreateCampaign />
                    </ProtectedRoute>
                  } />
                  <Route path="campaigns/:id" element={<CampaignDetail />} />
                  <Route path="resources" element={<Resources />} />
                  <Route path="resources/create" element={
                    <ProtectedRoute>
                      <CreateResource />
                    </ProtectedRoute>
                  } />
                  <Route path="resources/:id" element={<ResourceDetail />} />
                  <Route path="agencies" element={<Agencies />} />
                  <Route path="agencies/create" element={
                    <ProtectedRoute>
                      <CreateAgency />
                    </ProtectedRoute>
                  } />
                  <Route path="agencies/:id" element={<AgencyDetail />} />
                  <Route path="about" element={<About />} />
                  
                  {/* Protected user routes */}
                  <Route path="profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="bookmarks" element={
                    <ProtectedRoute>
                      <Bookmarks />
                    </ProtectedRoute>
                  } />
                  <Route path="activity" element={
                    <ProtectedRoute>
                      <Activity />
                    </ProtectedRoute>
                  } />
                  <Route path="analytics" element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  } />
                  
                  {/* Protected dashboard routes */}
                  <Route path="dashboard/*" element={
                    <ProtectedRoute roles={['content_proposer', 'admin']}>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                </Route>

                {/* Admin routes */}
                <Route path="/admin" element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<div>Users Management</div>} />
                  <Route path="campaigns" element={<div>Campaign Management</div>} />
                  <Route path="resources" element={<div>Resource Management</div>} />
                  <Route path="agencies" element={<div>Agency Management</div>} />
                  <Route path="audit-logs" element={<div>Audit Logs</div>} />
                </Route>

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              {/* Global components */}
              <Toaster
                position="top-right"
                containerStyle={{
                  top: '80px',
                }}
                toastOptions={{
                  duration: 4000,
                  className: '',
                  style: {
                    background: '#374151',
                    color: '#f9fafb',
                    border: '1px solid #4b5563',
                  },
                  success: {
                    style: {
                      background: '#065f46',
                      color: '#ecfdf5',
                      border: '1px solid #10b981',
                    },
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#ffffff',
                    },
                  },
                  error: {
                    style: {
                      background: '#7f1d1d',
                      color: '#fef2f2',
                      border: '1px solid #ef4444',
                    },
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#ffffff',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;