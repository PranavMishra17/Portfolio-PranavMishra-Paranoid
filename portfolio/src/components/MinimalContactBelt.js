// src/components/MinimalContactBelt.js
import React from 'react';
import { Link } from 'react-router-dom';
import { contactInfo, socialIcons } from '../data/projects';
import './MinimalContactBelt.css';

const MinimalContactBelt = React.forwardRef((props, ref) => {
  const contactItems = [
    {
      id: 'github',
      label: 'GitHub',
      icon: socialIcons.github.icon,
      link: contactInfo.github,
      external: true
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: socialIcons.linkedin.icon,
      link: contactInfo.linkedin,
      external: true
    },
    {
      id: 'googleScholar',
      label: 'Research publications',
      icon: socialIcons.googleScholar.icon,
      link: contactInfo.googleScholar,
      external: true
    },
    {
      id: 'huggingFace',
      label: 'Models and datasets',
      icon: socialIcons.huggingFace.icon,
      link: contactInfo.huggingFace,
      external: true
    },
    {
      id: 'resume',
      label: 'Download my CV',
      icon: socialIcons.resume.icon,
      link: '/resume',
      external: false
    },
    {
      id: 'email',
      label: 'Get in touch',
      icon: socialIcons.email.icon,
      link: `mailto:${contactInfo.email.academic}`,
      external: true
    }
  ];

  return (
    <section id="contact" className="minimal-contact-section" ref={ref}>
      <div className="container">
        <h2 className="section-title">Connect</h2>
        
        <div className="contact-belt">
          {contactItems.map((item) => (
            <ContactIcon key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
});

const ContactIcon = ({ label, icon, link, external, id }) => {
  const IconContent = () => (
    <div className={`contact-icon ${id}`}>
      <img 
        src={icon} 
        alt={label}
        onError={(e) => {
          e.target.src = '/assets/images/default/icon_default.png';
        }}
      />
      <span className="contact-label">{label}</span>
    </div>
  );

  if (external) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="contact-link">
        <IconContent />
      </a>
    );
  } else {
    return (
      <Link to={link} className="contact-link">
        <IconContent />
      </Link>
    );
  }
};

export default MinimalContactBelt;