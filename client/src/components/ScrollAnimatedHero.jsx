import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowDown, FiArrowRight } from 'react-icons/fi';

const ScrollAnimatedHero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Optimized transform values
  const pollutionOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const actionOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const cleanOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);
  const finalOpacity = useTransform(scrollYProgress, [0.6, 1], [0, 1]);
  
  const skyColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#374151", "#64748b", "#0ea5e9"]
  );
  const groundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#1f2937", "#475569", "#10b981"]
  );

  return (
    <div className="relative">
      {/* Hide navbar on this page */}
      <style>{`
        nav { display: none !important; }
        main { padding-top: 0 !important; }
      `}</style>
      
      <div ref={containerRef} className="relative h-[300vh] overflow-hidden">
        {/* Sky Background */}
        <motion.div
          className="fixed inset-0 w-full h-full will-change-auto"
          style={{ backgroundColor: skyColor }}
        />

        {/* Ground */}
        <motion.div
          className="fixed bottom-0 w-full h-1/3 will-change-auto"
          style={{ backgroundColor: groundColor }}
        />

        {/* Stage 1: Pollution */}
        <motion.div
          className="fixed inset-0 will-change-opacity"
          style={{ opacity: pollutionOpacity }}
        >
          <div className="absolute inset-0 bg-gray-900/30" />
          
          {/* Factories */}
          <div className="absolute bottom-1/3 left-10 text-8xl">🏭</div>
          <div className="absolute bottom-1/3 right-20 text-6xl">🏭</div>
          
          {/* Plastic waste - reduced count */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div
              key={`waste-${i}`}
              className="absolute text-4xl"
              style={{
                left: `${20 + i * 12}%`,
                top: `${65 + (i % 2) * 8}%`
              }}
            >
              {['🍶', '🥤', '🛍️', '🥡', '🧴', '📦'][i]}
            </div>
          ))}
          
          {/* Fact box */}
          <div className="absolute top-20 left-10 bg-red-900/90 backdrop-blur-sm rounded-xl p-4 text-white max-w-sm">
            <h3 className="text-xl font-bold mb-2">😰 The Crisis</h3>
            <p>8 million tons of plastic enter oceans yearly</p>
          </div>
        </motion.div>

        {/* Stage 2: Action */}
        <motion.div
          className="fixed inset-0 will-change-opacity"
          style={{ opacity: actionOpacity }}
        >
          <div className="absolute inset-0 bg-blue-900/20" />
          
          {/* Recycling facilities */}
          <div className="absolute bottom-1/3 left-1/4 text-6xl">♻️</div>
          <div className="absolute bottom-1/3 right-1/4 text-6xl">♻️</div>
          
          {/* Workers */}
          <div className="absolute bottom-1/2 left-1/3 text-4xl">👷♂️</div>
          <div className="absolute bottom-1/2 right-1/3 text-4xl">👷♀️</div>
          
          {/* Reduced waste */}
          {[0, 1, 2].map(i => (
            <div
              key={`action-waste-${i}`}
              className="absolute text-3xl opacity-60"
              style={{
                left: `${30 + i * 20}%`,
                top: `${70 + i * 3}%`
              }}
            >
              🍶
            </div>
          ))}
          
          {/* Fact box */}
          <div className="absolute top-32 right-10 bg-blue-800/90 backdrop-blur-sm rounded-xl p-4 text-white max-w-sm">
            <h3 className="text-xl font-bold mb-2">💪 Taking Action</h3>
            <p>Recycling 1 ton saves 7.4 cubic yards of landfill</p>
          </div>
        </motion.div>

        {/* Stage 3: Clean Environment */}
        <motion.div
          className="fixed inset-0 will-change-opacity"
          style={{ opacity: cleanOpacity }}
        >
          {/* Nature elements */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div
              key={`nature-${i}`}
              className="absolute text-4xl"
              style={{
                left: `${15 + i * 12}%`,
                top: `${60 + (i % 2) * 10}%`
              }}
            >
              {['🌱', '🌿', '🌳', '🌸', '🦋', '🌺'][i]}
            </div>
          ))}
          
          {/* Clean water */}
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-blue-400/50 to-transparent" />
          
          {/* Fact box */}
          <div className="absolute top-44 left-1/4 bg-green-800/90 backdrop-blur-sm rounded-xl p-4 text-white max-w-sm">
            <h3 className="text-xl font-bold mb-2">🌱 Progress</h3>
            <p>Every bottle recycled becomes new product in 60 days</p>
          </div>
        </motion.div>

        {/* Stage 4: Thriving World */}
        <motion.div
          className="fixed inset-0 will-change-opacity"
          style={{ opacity: finalOpacity }}
        >
          {/* Abundant nature */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <div
              key={`final-${i}`}
              className="absolute text-5xl"
              style={{
                left: `${10 + i * 10}%`,
                top: `${50 + (i % 3) * 12}%`
              }}
            >
              {['🌳', '🌺', '🌻', '🦋', '🌿', '🌸', '🌱', '🍃'][i]}
            </div>
          ))}
          
          {/* Clean energy */}
          <div className="absolute bottom-1/3 left-10 text-8xl">🌞</div>
          <div className="absolute bottom-1/3 right-20 text-6xl">💨</div>
          
          {/* Success fact */}
          <div className="absolute top-56 left-1/3 bg-green-600/95 backdrop-blur-sm rounded-xl p-6 text-white max-w-md">
            <h3 className="text-2xl font-bold mb-3">🎉 Success!</h3>
            <p className="text-lg">Plastic-free world saves 1M marine animals annually</p>
          </div>
        </motion.div>

        {/* Sun transition */}
        <motion.div
          className="fixed top-16 right-16 text-6xl will-change-opacity"
          style={{ opacity: pollutionOpacity }}
        >
          🌫️
        </motion.div>
        <motion.div
          className="fixed top-16 right-16 text-8xl will-change-opacity"
          style={{ opacity: finalOpacity }}
        >
          ☀️
        </motion.div>

        {/* Hero Content */}
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white max-w-4xl px-6">
            <motion.h1
              className="text-5xl lg:text-7xl font-bold mb-6"
              style={{ opacity: pollutionOpacity }}
            >
              Our Planet is Dying
            </motion.h1>
            
            <motion.h1
              className="text-5xl lg:text-7xl font-bold mb-6 text-blue-400"
              style={{ opacity: actionOpacity }}
            >
              We Can Change This
            </motion.h1>
            
            <motion.h1
              className="text-5xl lg:text-7xl font-bold mb-6 text-green-400"
              style={{ opacity: cleanOpacity }}
            >
              Nature is Healing
            </motion.h1>
            
            <motion.h1
              className="text-5xl lg:text-7xl font-bold mb-6 text-green-300"
              style={{ opacity: finalOpacity }}
            >
              Together We Thrive
            </motion.h1>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              style={{ opacity: finalOpacity }}
            >
              <Link
                to="/home"
                className="btn-primary text-lg px-6 py-3 group"
              >
                Start Your Journey
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/campaigns"
                className="btn-outline border-white text-white hover:bg-white hover:text-gray-900 text-lg px-6 py-3"
              >
                Join Campaigns
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center z-10"
          style={{ opacity: pollutionOpacity }}
        >
          <p className="text-sm mb-2">Scroll to witness transformation</p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FiArrowDown className="mx-auto text-2xl" />
          </motion.div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-red-500 via-blue-500 to-green-500 z-20 will-change-transform"
          style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
        />
      </div>
    </div>
  );
};

export default ScrollAnimatedHero;