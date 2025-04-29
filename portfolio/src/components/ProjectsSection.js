// src/components/ProjectsSection.js

import React from 'react';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projects';

const GameDesignSection = () => {
  return (
    <section id="game-design" className="game-design-section">
      <div className="container">
        <h2 className="section-title game-title">Game Design Projects</h2>
        <div className="projects-grid">
          {projects.gameDesign.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              theme="game-design"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const AiMlSection = () => {
  return (
    <section id="ai-ml" className="ai-ml-section">
      <div className="container">
        <h2 className="section-title ai-title">Machine Learning Projects</h2>
        <div className="projects-grid">
          {projects.aiMl.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              theme="ai-ml"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const MiscSection = () => {
  return (
    <section id="misc" className="misc-section">
      <div className="container">
        <h2 className="section-title misc-title">Miscellaneous Projects</h2>
        <div className="projects-grid">
          {projects.misc.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              theme="misc"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { GameDesignSection, AiMlSection, MiscSection };