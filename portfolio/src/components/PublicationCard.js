// src/components/PublicationCard.js
import React, { useState } from 'react';
import TechStackBadge from './TechStackBadge';

const PublicationCard = ({ publication }) => {
  const [isAbstractExpanded, setIsAbstractExpanded] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      'Published': '#00c853',
      'Accepted': '#3d5afe',
      'Under Review': '#ff9800',
      'In Preparation': '#9e9e9e'
    };
    return colors[status] || '#9e9e9e';
  };

  const formatAuthors = (authors) => {
    if (authors.length <= 3) {
      return authors.join(', ');
    }
    return `${authors.slice(0, 3).join(', ')}, et al.`;
  };

  const truncateAbstract = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="publication-card">
      <div className="publication-header">
        <div className="publication-status">
          <span 
            className="status-badge"
            style={{ 
              backgroundColor: getStatusColor(publication.status),
              color: 'white'
            }}
          >
            {publication.status}
          </span>
        </div>
        
        <h3 className="publication-title">{publication.title}</h3>
        
        <div className="publication-authors">
          {formatAuthors(publication.authors)}
        </div>
        
        <div className="publication-venue">
          {publication.conference} ({publication.venue}) - {publication.publicationDate}
        </div>
      </div>

      <div className="publication-content">
        <div className="publication-abstract">
          <p className="abstract-text">
            {isAbstractExpanded ? publication.abstract : truncateAbstract(publication.abstract)}
            {publication.abstract.length > 200 && (
              <button 
                className="abstract-toggle"
                onClick={() => setIsAbstractExpanded(!isAbstractExpanded)}
              >
                {isAbstractExpanded ? 'Show Less' : 'Read More'}
              </button>
            )}
          </p>
        </div>

        {/* Tech Stack */}
        {publication.techStack && publication.techStack.length > 0 && (
          <div className="tech-stack">
            <div className="tech-badges">
              {publication.techStack.map((tech, i) => (
                <TechStackBadge key={i} tech={tech} theme="publication" />
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="publication-links">
          {publication.pdfLink && (
            <a href={publication.pdfLink} target="_blank" rel="noopener noreferrer" className="publication-link pdf">
              <img src="/assets/images/icons/pdf.png" alt="PDF" className="icon-img" />
              <span>PDF</span>
            </a>
          )}
          {publication.codeLink && (
            <a href={publication.codeLink} target="_blank" rel="noopener noreferrer" className="publication-link github">
              <img src="/assets/images/icons/github.png" alt="Code" className="icon-img" />
              <span>Code</span>
            </a>
          )}
          {publication.projectLink && (
            <a href={publication.projectLink} target="_blank" rel="noopener noreferrer" className="publication-link website">
              <img src="/assets/images/icons/website.png" alt="Project" className="icon-img" />
              <span>Project</span>
            </a>
          )}
          {publication.doi && (
            <a href={publication.doi} target="_blank" rel="noopener noreferrer" className="publication-link arxiv">
              <img src="/assets/images/arxiv.png" alt="arXiv" className="icon-img" />
              <span>arXiv</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicationCard;