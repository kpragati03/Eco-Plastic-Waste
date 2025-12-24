import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiBookOpen, 
  FiMapPin,
  FiArrowRight,
  FiPlay,
  FiStar,
  FiHeart,
  FiRefreshCw,
  FiRepeat,
  FiMinus
} from 'react-icons/fi';
import { ANIMATION_VARIANTS } from '../utils/constants';

// Professional 3Rs Component with expert-level design
const ThreeRsSymbol = () => {
  const [activeR, setActiveR] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setActiveR((prev) => (prev + 1) % 3);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const rData = [
    { 
      title: 'REDUCE', 
      subtitle: 'Minimize Consumption',
      icon: '🔻',
      color: 'from-rose-500 via-pink-500 to-red-500',
      shadowColor: 'shadow-rose-500/30',
      process: [
        { emoji: '🛍️', label: 'Shopping' },
        { emoji: '🤔', label: 'Think' },
        { emoji: '✋', label: 'Refuse' },
        { emoji: '🌱', label: 'Save' }
      ],
      stats: '40% Less Waste',
      tip: 'Say no to single-use plastics'
    },
    { 
      title: 'REUSE', 
      subtitle: 'Creative Repurposing',
      icon: '🔄',
      color: 'from-blue-500 via-cyan-500 to-teal-500',
      shadowColor: 'shadow-blue-500/30',
      process: [
        { emoji: '📦', label: 'Collect' },
        { emoji: '💡', label: 'Ideate' },
        { emoji: '🔨', label: 'Create' },
        { emoji: '✨', label: 'Enjoy' }
      ],
      stats: '3x Longer Life',
      tip: 'Transform waste into treasures'
    },
    { 
      title: 'RECYCLE', 
      subtitle: 'Circular Economy',
      icon: '♻️',
      color: 'from-emerald-500 via-green-500 to-lime-500',
      shadowColor: 'shadow-emerald-500/30',
      process: [
        { emoji: '🗂️', label: 'Sort' },
        { emoji: '🚛', label: 'Collect' },
        { emoji: '🏭', label: 'Process' },
        { emoji: '📦', label: 'Remake' }
      ],
      stats: '90% Recovery',
      tip: 'Close the material loop'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* Header Animation */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 px-8 py-4 rounded-full mb-6">
          <motion.span 
            className="text-4xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            ♻️
          </motion.span>
          <span className="text-2xl font-bold text-gradient-primary">The 3Rs Journey</span>
          <motion.span 
            className="text-4xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🌍
          </motion.span>
        </div>
      </motion.div>

      {/* Main 3Rs Cards */}
      <div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {rData.map((r, index) => {
          const isActive = activeR === index;
          
          return (
            <motion.div
              key={r.title}
              className={`relative group cursor-pointer`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              onClick={() => setActiveR(index)}
            >
              {/* Card Background */}
              <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${r.color} p-8 h-full transition-all duration-500 ${isActive ? `scale-105 ${r.shadowColor} shadow-2xl` : 'shadow-lg hover:shadow-xl'}`}>
                
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <motion.div 
                    className="absolute inset-0"
                    animate={{ 
                      backgroundPosition: isActive ? ['0% 0%', '100% 100%'] : '0% 0%'
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }}
                  />
                </div>

                {/* Header */}
                <div className="relative z-10 text-center mb-6">
                  <motion.div 
                    className="text-7xl mb-4"
                    animate={{
                      scale: isActive ? [1, 1.3, 1] : 1,
                      rotate: isActive ? [0, 360] : 0
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  >
                    {r.icon}
                  </motion.div>
                  
                  <h3 className="text-3xl font-black text-white mb-2 tracking-wide">
                    {r.title}
                  </h3>
                  
                  <p className="text-white/90 text-lg font-medium">
                    {r.subtitle}
                  </p>
                </div>

                {/* Animated Process Flow */}
                <div className="relative z-10 mb-6">
                  <div className="flex justify-between items-center">
                    {r.process.map((step, stepIndex) => (
                      <motion.div
                        key={stepIndex}
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: isActive ? stepIndex * 0.2 : 0
                        }}
                      >
                        <motion.div 
                          className="text-3xl mb-2 bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center"
                          animate={{
                            y: isActive ? [0, -5, 0] : 0,
                            scale: isActive ? [1, 1.1, 1] : 1
                          }}
                          transition={{ 
                            duration: 1.5, 
                            delay: stepIndex * 0.3,
                            repeat: isActive ? Infinity : 0
                          }}
                        >
                          {step.emoji}
                        </motion.div>
                        
                        <span className="text-white/80 text-xs font-semibold">
                          {step.label}
                        </span>
                        
                        {stepIndex < r.process.length - 1 && (
                          <motion.div 
                            className="absolute top-8 text-white/60 text-xl"
                            style={{ left: `${25 + stepIndex * 25}%` }}
                            animate={{
                              x: isActive ? [0, 10, 0] : 0,
                              opacity: isActive ? [0.6, 1, 0.6] : 0.6
                            }}
                            transition={{ 
                              duration: 1, 
                              delay: stepIndex * 0.2,
                              repeat: isActive ? Infinity : 0
                            }}
                          >
                            →
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Stats & Tip */}
                <div className="relative z-10 space-y-4">
                  <motion.div 
                    className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center"
                    animate={{
                      scale: isActive ? [1, 1.05, 1] : 1
                    }}
                    transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                  >
                    <div className="text-2xl font-bold text-white mb-1">
                      {r.stats}
                    </div>
                    <div className="text-white/80 text-sm">
                      Impact Potential
                    </div>
                  </motion.div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                    <p className="text-white text-sm font-medium">
                      💡 {r.tip}
                    </p>
                  </div>
                </div>

                {/* Active Glow Effect */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-3xl bg-white/10"
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Flow Visualization */}
      <motion.div 
        className="flex justify-center items-center space-x-8 mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.div 
          className="flex items-center space-x-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 px-8 py-4 rounded-full shadow-lg"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.span 
            className="text-3xl"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🌱
          </motion.span>
          
          <motion.span 
            className="text-2xl text-primary-600 dark:text-primary-400"
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
          
          <motion.span 
            className="text-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            🌍
          </motion.span>
          
          <motion.span 
            className="text-2xl text-primary-600 dark:text-primary-400"
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          >
            →
          </motion.span>
          
          <motion.span 
            className="text-3xl"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            💚
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Progress Dots */}
      <div className="flex justify-center space-x-3">
        {rData.map((_, index) => (
          <motion.button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeR === index 
                ? 'bg-primary-500 scale-125 shadow-lg' 
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary-300'
            }`}
            onClick={() => setActiveR(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const stats = [
    { icon: FiUsers, label: 'Active Users', value: '10,000+' },
    { icon: FiTrendingUp, label: 'Campaigns', value: '500+' },
    { icon: FiBookOpen, label: 'Resources', value: '1,200+' },
    { icon: FiMapPin, label: 'Recycling Centers', value: '300+' },
  ];

  const features = [
    {
      icon: FiTrendingUp,
      title: 'Awareness Campaigns',
      description: 'Join impactful campaigns to reduce plastic waste in your community.',
      link: '/campaigns',
      color: 'bg-blue-500'
    },
    {
      icon: FiBookOpen,
      title: 'Educational Resources',
      description: 'Access tips, guides, and research on plastic waste reduction.',
      link: '/resources',
      color: 'bg-green-500'
    },
    {
      icon: FiMapPin,
      title: 'Recycling Centers',
      description: 'Find nearby recycling centers and waste management facilities.',
      link: '/agencies',
      color: 'bg-purple-500'
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Environmental Activist',
      content: 'EcoPortal has been instrumental in organizing our community cleanup campaigns.',
      avatar: '👩‍🦰'
    },
    {
      name: 'Mike Chen',
      role: 'Business Owner',
      content: 'The resources here helped us reduce plastic usage in our restaurant by 80%.',
      avatar: '👨‍💼'
    },
    {
      name: 'Dr. Emily Davis',
      role: 'Researcher',
      content: 'A comprehensive platform for sharing and accessing plastic waste research.',
      avatar: '👩‍🔬'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-gradient overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20"></div>
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary-400/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={ANIMATION_VARIANTS.slideLeft}
              initial="initial"
              animate="animate"
              className="text-center lg:text-left"
            >
              <motion.h1 
                className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-gradient-primary">Reduce Plastic Waste,</span>
                <br />
                <span className="text-gray-800 dark:text-white">Save Our Planet</span>
              </motion.h1>
              <motion.p 
                className="text-xl lg:text-2xl mb-8 text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Join thousands of eco-warriors in the fight against plastic pollution. 
                Discover campaigns, resources, and recycling centers near you.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link
                  to="/campaigns"
                  className="btn-primary group glow-hover"
                >
                  Explore Campaigns
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/resources"
                  className="btn-outline group"
                >
                  <FiPlay className="mr-2" />
                  Learn More
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={ANIMATION_VARIANTS.slideRight}
              initial="initial"
              animate="animate"
              className="relative"
            >
              <div className="relative z-10 glass rounded-3xl p-8 card-glow">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 100 }}
                      className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl hover:scale-105 transition-transform duration-300"
                    >
                      <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                      <div className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full blur-xl opacity-60 animate-pulse"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3Rs Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              The Power of <span className="text-gradient-primary">3Rs</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              The foundation of sustainable living lies in three simple yet powerful principles.
              Watch them work together to create a cleaner, greener future.
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex justify-center mb-16"
          >
            <ThreeRsSymbol />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: 'Reduce Consumption',
                description: 'Start by minimizing your plastic usage. Choose reusable alternatives and buy only what you need.',
                icon: '🔻',
                stats: '40% less waste'
              },
              {
                title: 'Reuse Creatively',
                description: 'Give plastic items a second life through creative reuse and repurposing projects.',
                icon: '🔄',
                stats: '60% extended lifespan'
              },
              {
                title: 'Recycle Properly',
                description: 'Ensure proper disposal and recycling to transform waste into new valuable resources.',
                icon: '♻️',
                stats: '80% material recovery'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card card-hover p-8 text-center group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/10 dark:to-secondary-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-6xl mb-4 animate-bounce-gentle group-hover:animate-wiggle">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
                  <div className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold">
                    {item.stats}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Make a Difference
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform provides comprehensive tools and resources to help individuals, 
              businesses, and organizations reduce plastic waste effectively.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={ANIMATION_VARIANTS.slideUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card card-hover p-8 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {feature.description}
                  </p>
                  <Link
                    to={feature.link}
                    className="inline-flex items-center text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 group/link"
                  >
                    Learn More
                    <FiArrowRight className="ml-2 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-white">
              Together, We're Making a Real Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { value: '2.5M', label: 'Plastic Items Recycled' },
                { value: '150+', label: 'Cities Reached' },
                { value: '50K', label: 'Trees Saved' },
                { value: '95%', label: 'User Satisfaction' }
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className="text-center p-6 glass rounded-2xl hover:scale-105 transition-transform duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl font-bold mb-2 text-white">{stat.value}</div>
                  <div className="text-primary-100">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Real stories from people making a difference
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={ANIMATION_VARIANTS.slideUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card card-hover p-8 text-center group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/10 dark:to-secondary-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4 animate-bounce-gentle">{testimonial.avatar}</div>
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <FiStar className="w-5 h-5 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 italic text-lg">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-secondary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join our community today and start your journey towards a plastic-free future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary bg-white text-secondary-700 hover:bg-gray-100 group glow-hover"
              >
                <FiHeart className="mr-2" />
                Join the Movement
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/campaigns"
                className="btn-outline border-white text-white hover:bg-white hover:text-secondary-700"
              >
                Browse Campaigns
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;