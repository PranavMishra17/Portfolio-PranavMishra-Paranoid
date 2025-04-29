// src/components/ContactSection.js

import React from 'react';
import { contactInfo } from '../data/projects';

const ContactSection = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="section-title">Connect With Me</h2>
        <div className="contact-links">
          <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="contact-item linkedin">
            <div className="icon-container">
              <i className="icon linkedin-icon"></i>
            </div>
            <span>LinkedIn</span>
          </a>
          <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="contact-item github">
            <div className="icon-container">
              <i className="icon github-icon"></i>
            </div>
            <span>GitHub</span>
          </a>
          <a href={contactInfo.resume} target="_blank" rel="noopener noreferrer" className="contact-item resume">
            <div className="icon-container">
              <i className="icon resume-icon"></i>
            </div>
            <span>Resume</span>
          </a>
          <a href={`mailto:${contactInfo.email.personal}`} className="contact-item email">
            <div className="icon-container">
              <i className="icon email-icon"></i>
            </div>
            <span>Email</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;