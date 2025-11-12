// src/components/ExperienceSection.js
import React from 'react';
import ExperienceCard from './ExperienceCard';
import experiences from '../data/experience';
import './ExperienceCard.css';

const ExperienceSection = React.forwardRef((props, ref) => {
  return (
    <section id="experience" className="experience-section" ref={ref}>
      <div className="container">
        <div className="experience-grid">
          {experiences.map((experience, index) => (
            <ExperienceCard 
              key={experience.id}
              experience={experience}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

export default ExperienceSection;