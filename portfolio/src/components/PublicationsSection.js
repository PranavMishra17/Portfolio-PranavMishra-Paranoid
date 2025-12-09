// src/components/PublicationsSection.js
import React from 'react';
import PublicationCard from './PublicationCard';
import { publications, publicationStats, upcomingPublications } from '../data/publications';
import './PublicationCard.css';

const PublicationsSection = React.forwardRef((props, ref) => {
  return (
    <section id="research" className="publications-section" ref={ref}>
      <div className="container">
        <h2 className="section-title publications-title">Research Projects and Publications</h2>

        {/* Published/Accepted Publications */}
        {publications.length > 0 && (
          <div className="publications-group">
            <div className="publications-grid">
              {publications.map((publication) => (
                <PublicationCard
                  key={publication.id}
                  publication={publication}
                />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Publications */}
        {upcomingPublications.length > 0 && (
          <div className="publications-group">
            <h3 className="group-title">Work in Progress</h3>
            <div className="publications-grid">
              {upcomingPublications.map((publication) => (
                <PublicationCard 
                  key={publication.id}
                  publication={publication}
                />
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}

      </div>
    </section>
  );
});

export default PublicationsSection;