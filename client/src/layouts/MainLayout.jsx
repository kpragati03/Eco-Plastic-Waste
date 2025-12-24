import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ANIMATION_VARIANTS } from '../utils/constants';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      
      <motion.main 
        className="flex-1"
        variants={ANIMATION_VARIANTS.fadeIn}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Outlet />
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;