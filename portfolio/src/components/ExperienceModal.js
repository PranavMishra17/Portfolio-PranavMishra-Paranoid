// src/components/ExperienceModal.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExperienceSection from './ExperienceSection';
import './ExperienceModal.css';

const ExperienceModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="experience-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="experience-modal"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ 
              duration: 0.4, 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
          >
            <div className="experience-modal-header">
              <h2>Professional Experience</h2>
              <button 
                className="experience-modal-close"
                onClick={onClose}
                aria-label="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="experience-modal-content">
              <ExperienceSection />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExperienceModal;