import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImage from '../assets/hero-diet.png';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-emerald-50 px-4">
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Section with Animation */}
        <motion.div
          className="space-y-6 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl font-extrabold text-emerald-700 leading-tight"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Transform Your Health <br />
            with <span className="text-emerald-500">Smart Diet Planning</span>
          </motion.h1>

          <motion.p
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Personalized meal plans, calorie tracking, and progress monitoring – all in one place.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link
              to="/signup"
              className="px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:scale-105 hover:bg-emerald-700 transition-transform duration-300"
            >
              ✨ Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-full border border-emerald-600 text-emerald-600 font-semibold hover:scale-105 hover:bg-emerald-100 transition-transform duration-300"
            >
              🚪 Login
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Image with Hover Bounce */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img
            src={heroImage}
            alt="Healthy lifestyle"
            className="w-full max-w-md rounded-xl shadow-xl"
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          />
        </motion.div>

      </div>
    </div>
  );
}
