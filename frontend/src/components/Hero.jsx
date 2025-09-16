import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="landing-container">
      <div className="landing-wrapper">

        <motion.div
          className="text-section"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="landing-title">
            Discover Inspiring Stories and Fresh Ideas
          </h1>
          <p className="landing-subtitle">
            Fresh perspectives, insightful stories, and ideas that inspire.
            Welcome to your new favorite blog.
          </p>

          <div className="button-group">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/signup" className="btn primary-btn">
                Get Started
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/about" className="btn secondary-btn">
                Learn More
              </Link>
            </motion.div>
          </div>

          <motion.ul
            className="highlights"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            <li>✨ Daily Fresh Content</li>
            <li>💡 Creative Insights</li>
            <li>🌍 Stories from Around the World</li>
          </motion.ul>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
