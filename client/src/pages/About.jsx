import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiUsers, FiTarget, FiAward, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { ANIMATION_VARIANTS } from '../utils/constants';

const About = () => {
  const stats = [
    { icon: FiUsers, label: 'Active Users', value: '10,000+', color: 'text-blue-500' },
    { icon: FiTarget, label: 'Campaigns Completed', value: '500+', color: 'text-green-500' },
    { icon: FiHeart, label: 'Plastic Reduced (kg)', value: '25,000+', color: 'text-red-500' },
    { icon: FiAward, label: 'Partner Organizations', value: '150+', color: 'text-purple-500' },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Environmental scientist passionate about sustainable solutions.',
      avatar: '👩‍🔬'
    },
    {
      name: 'Mike Chen',
      role: 'CTO',
      bio: 'Tech leader building scalable platforms for environmental impact.',
      avatar: '👨‍💻'
    },
    {
      name: 'Dr. Emily Davis',
      role: 'Head of Research',
      bio: 'Marine biologist researching plastic pollution solutions.',
      avatar: '👩‍🔬'
    },
  ];

  const values = [
    {
      title: 'Sustainability',
      description: 'We believe in creating lasting solutions that protect our planet for future generations.',
      icon: '🌱'
    },
    {
      title: 'Community',
      description: 'Together we can achieve more. We foster collaboration and collective action.',
      icon: '🤝'
    },
    {
      title: 'Innovation',
      description: 'We embrace technology and creative thinking to solve environmental challenges.',
      icon: '💡'
    },
    {
      title: 'Transparency',
      description: 'We operate with openness and accountability in all our initiatives.',
      icon: '🔍'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="initial"
            animate="animate"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About EcoPortal
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 mb-8">
              Empowering communities worldwide to reduce plastic waste through 
              awareness, education, and collective action.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={ANIMATION_VARIANTS.slideUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              EcoPortal was founded with a simple yet powerful mission: to create a world where 
              plastic waste is minimized through community-driven initiatives, education, and 
              sustainable practices. We believe that every individual has the power to make a 
              difference, and together, we can create lasting environmental change.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Together, we're making a real difference in the fight against plastic pollution.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={ANIMATION_VARIANTS.slideUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              The principles that guide everything we do.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                variants={ANIMATION_VARIANTS.slideUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-8 text-center"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Passionate individuals working towards a sustainable future.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                variants={ANIMATION_VARIANTS.slideUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-8 text-center"
              >
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Have questions or want to partner with us? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 mb-4">
                <FiMail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-400">info@ecoportal.com</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 mb-4">
                <FiPhone className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Phone</h3>
              <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 mb-4">
                <FiMapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Address</h3>
              <p className="text-gray-600 dark:text-gray-400">123 Green Street, Eco City</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;