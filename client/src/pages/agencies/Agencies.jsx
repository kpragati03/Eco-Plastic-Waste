import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiMapPin, FiPhone, FiMail, FiStar, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { agencyService } from '../../services/agencyService';
import { ANIMATION_VARIANTS, AGENCY_TYPES } from '../../utils/constants';
import { getCategoryColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';

// Mock agencies data covering all types
const mockAgencies = [
  {
    _id: '1',
    name: 'GreenCycle Recycling Center',
    description: 'State-of-the-art plastic recycling facility accepting all types of plastic waste. We process over 500 tons of plastic monthly.',
    type: 'recycling_center',
    address: { city: 'Mumbai', state: 'Maharashtra', zipCode: '400001' },
    contact: { phone: '+91-22-1234-5678', email: 'info@greencycle.com' },
    services: ['plastic_collection', 'recycling', 'consultation'],
    acceptedMaterials: ['pet_bottles', 'plastic_bags', 'containers', 'all_plastics'],
    rating: { average: 4.5, count: 128 },
    operatingHours: 'Mon-Sat: 8AM-6PM',
    status: 'approved'
  },
  {
    _id: '2',
    name: 'EcoWarriors Foundation',
    description: 'Non-profit organization dedicated to plastic waste awareness and community education programs across India.',
    type: 'ngo',
    address: { city: 'Delhi', state: 'Delhi', zipCode: '110001' },
    contact: { phone: '+91-11-9876-5432', email: 'contact@ecowarriors.org' },
    services: ['awareness', 'education', 'plastic_collection'],
    acceptedMaterials: ['pet_bottles', 'plastic_bags'],
    rating: { average: 4.8, count: 95 },
    operatingHours: 'Mon-Fri: 9AM-5PM',
    status: 'approved'
  },
  {
    _id: '3',
    name: 'PlasticFree Solutions Pvt Ltd',
    description: 'Corporate plastic waste management solutions for businesses. Specializing in bulk plastic collection and processing.',
    type: 'business',
    address: { city: 'Bangalore', state: 'Karnataka', zipCode: '560001' },
    contact: { phone: '+91-80-5555-1234', email: 'business@plasticfree.com' },
    services: ['plastic_collection', 'recycling', 'consultation'],
    acceptedMaterials: ['containers', 'electronics', 'all_plastics'],
    rating: { average: 4.2, count: 67 },
    operatingHours: 'Mon-Sat: 7AM-7PM',
    status: 'approved'
  },
  {
    _id: '4',
    name: 'Municipal Waste Management Department',
    description: 'Government-run waste management facility providing free plastic collection services for residential areas.',
    type: 'government',
    address: { city: 'Chennai', state: 'Tamil Nadu', zipCode: '600001' },
    contact: { phone: '+91-44-2222-3333', email: 'waste@chennai.gov.in' },
    services: ['plastic_collection', 'awareness'],
    acceptedMaterials: ['pet_bottles', 'plastic_bags', 'containers'],
    rating: { average: 3.9, count: 203 },
    operatingHours: 'Mon-Sun: 6AM-8PM',
    status: 'approved'
  },
  {
    _id: '5',
    name: 'RecycleMax Industries',
    description: 'Advanced plastic recycling facility with cutting-edge technology for converting waste plastic into reusable materials.',
    type: 'recycling_center',
    address: { city: 'Pune', state: 'Maharashtra', zipCode: '411001' },
    contact: { phone: '+91-20-7777-8888', email: 'operations@recyclemax.in' },
    services: ['plastic_collection', 'recycling'],
    acceptedMaterials: ['pet_bottles', 'containers', 'all_plastics'],
    rating: { average: 4.6, count: 89 },
    operatingHours: 'Mon-Sat: 8AM-6PM',
    status: 'approved'
  },
  {
    _id: '6',
    name: 'Clean Earth Initiative',
    description: 'Community-driven NGO organizing plastic cleanup drives and educational workshops in schools and colleges.',
    type: 'ngo',
    address: { city: 'Hyderabad', state: 'Telangana', zipCode: '500001' },
    contact: { phone: '+91-40-4444-5555', email: 'hello@cleanearth.org' },
    services: ['awareness', 'education'],
    acceptedMaterials: ['plastic_bags', 'containers'],
    rating: { average: 4.7, count: 156 },
    operatingHours: 'Mon-Fri: 10AM-6PM',
    status: 'approved'
  },
  {
    _id: '7',
    name: 'WasteWise Corporate Services',
    description: 'B2B plastic waste management company serving offices, malls, and industrial complexes with comprehensive solutions.',
    type: 'business',
    address: { city: 'Kolkata', state: 'West Bengal', zipCode: '700001' },
    contact: { phone: '+91-33-6666-7777', email: 'corporate@wastewise.co.in' },
    services: ['plastic_collection', 'recycling', 'consultation'],
    acceptedMaterials: ['electronics', 'containers', 'all_plastics'],
    rating: { average: 4.3, count: 74 },
    operatingHours: 'Mon-Sat: 8AM-8PM',
    status: 'approved'
  },
  {
    _id: '8',
    name: 'State Pollution Control Board',
    description: 'Government regulatory body overseeing plastic waste management and providing guidelines for proper disposal.',
    type: 'government',
    address: { city: 'Jaipur', state: 'Rajasthan', zipCode: '302001' },
    contact: { phone: '+91-141-3333-4444', email: 'info@rajpcb.gov.in' },
    services: ['awareness', 'consultation'],
    acceptedMaterials: ['pet_bottles', 'plastic_bags'],
    rating: { average: 3.8, count: 92 },
    operatingHours: 'Mon-Fri: 9AM-5PM',
    status: 'approved'
  },
  {
    _id: '9',
    name: 'EcoRecycle Hub',
    description: 'Modern recycling center with automated sorting systems and transparent tracking of plastic waste processing.',
    type: 'recycling_center',
    address: { city: 'Ahmedabad', state: 'Gujarat', zipCode: '380001' },
    contact: { phone: '+91-79-8888-9999', email: 'hub@ecorecycle.com' },
    services: ['plastic_collection', 'recycling'],
    acceptedMaterials: ['pet_bottles', 'containers', 'all_plastics'],
    rating: { average: 4.4, count: 112 },
    operatingHours: 'Mon-Sat: 7AM-7PM',
    status: 'approved'
  },
  {
    _id: '10',
    name: 'Green Future Foundation',
    description: 'NGO focused on plastic-free lifestyle promotion through community engagement and sustainable living workshops.',
    type: 'ngo',
    address: { city: 'Kochi', state: 'Kerala', zipCode: '682001' },
    contact: { phone: '+91-484-1111-2222', email: 'info@greenfuture.org' },
    services: ['awareness', 'education'],
    acceptedMaterials: ['plastic_bags', 'pet_bottles'],
    rating: { average: 4.9, count: 187 },
    operatingHours: 'Mon-Fri: 9AM-6PM',
    status: 'approved'
  },
  {
    _id: '11',
    name: 'PlasticCare Business Solutions',
    description: 'Enterprise-level plastic waste management with custom solutions for manufacturing and retail industries.',
    type: 'business',
    address: { city: 'Indore', state: 'Madhya Pradesh', zipCode: '452001' },
    contact: { phone: '+91-731-5555-6666', email: 'solutions@plasticcare.biz' },
    services: ['plastic_collection', 'recycling', 'consultation'],
    acceptedMaterials: ['electronics', 'containers', 'all_plastics'],
    rating: { average: 4.1, count: 58 },
    operatingHours: 'Mon-Sat: 8AM-6PM',
    status: 'approved'
  },
  {
    _id: '12',
    name: 'Urban Development Authority',
    description: 'Government agency managing city-wide plastic waste collection and implementing plastic-free zone initiatives.',
    type: 'government',
    address: { city: 'Bhopal', state: 'Madhya Pradesh', zipCode: '462001' },
    contact: { phone: '+91-755-7777-8888', email: 'urban@bhopal.gov.in' },
    services: ['plastic_collection', 'awareness'],
    acceptedMaterials: ['pet_bottles', 'plastic_bags', 'containers'],
    rating: { average: 3.7, count: 145 },
    operatingHours: 'Mon-Sat: 8AM-6PM',
    status: 'approved'
  }
];

const Agencies = () => {
  const [agencies, setAgencies] = useState([]);
  const [filteredAgencies, setFilteredAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    city: '',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({});
  
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    filterAgencies();
  }, [filters]);

  const filterAgencies = async () => {
    try {
      setLoading(true);
      const response = await agencyService.getAgencies(filters);
      let filtered = response.data || [];

      if (filters.search) {
        filtered = filtered.filter(agency => 
          agency.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          agency.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      if (filters.type) {
        filtered = filtered.filter(agency => agency.type === filters.type);
      }

      if (filters.city) {
        filtered = filtered.filter(agency => 
          agency.address.city.toLowerCase().includes(filters.city.toLowerCase())
        );
      }

      setFilteredAgencies(filtered);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      setFilteredAgencies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const AgencyCard = ({ agency }) => (
    <motion.div
      variants={ANIMATION_VARIANTS.slideUp}
      className="card p-6 card-hover"
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(agency.type)}`}>
          {agency.type.replace('_', ' ')}
        </span>
        <div className="flex items-center">
          <FiStar className="text-yellow-400 mr-1" />
          <span className="text-sm">{agency.rating?.average?.toFixed(1) || 'N/A'}</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {agency.name}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {agency.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <FiMapPin className="mr-2" />
          {agency.address?.city}, {agency.address?.state}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <FiPhone className="mr-2" />
          {agency.contact?.phone}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <FiMail className="mr-2" />
          {agency.contact?.email}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {agency.services?.length || 0} services
        </div>
        <Link
          to={`/agencies/${agency._id}`}
          className="btn-primary text-sm"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Recycling Centers & Agencies
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Find nearby recycling centers and waste management facilities
              </p>
            </div>
            
            {isAuthenticated && (user?.role === 'content_proposer' || user?.role === 'admin') && (
              <Link
                to="/agencies/create"
                className="mt-4 md:mt-0 btn-primary flex items-center"
              >
                <FiPlus className="mr-2" />
                Add Agency
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search agencies..."
                className="form-input pl-10"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Type */}
            <select
              className="form-input"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              {AGENCY_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* City */}
            <input
              type="text"
              placeholder="City"
              className="form-input"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            />

            {/* Clear filters */}
            <button
              onClick={() => setFilters({
                search: '',
                type: '',
                city: '',
                page: 1,
                limit: 12
              })}
              className="btn-secondary flex items-center justify-center"
            >
              <FiFilter className="mr-2" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Agencies Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading agencies..." />
          </div>
        ) : filteredAgencies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No agencies found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or check back later for new agencies.
            </p>
          </div>
        ) : (
          <motion.div
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAgencies.map((agency, index) => (
              <motion.div
                key={agency._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AgencyCard agency={agency} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Agencies;