import React, { useState, useEffect, useRef } from 'react';
import ParticleBackground from './components/ParticleBackground';
import PixelText from './components/PixelText';
import ThemeSwitch from './components/ThemeSwitch';
import TechStackBadge from './components/TechStackBadge';
import ProjectGallery from './components/ProjectGallery';
import AnimatedSkillBar from './components/AnimatedSkillBar';
import ProjectTabs from './components/ProjectTabs';
import './App.css';

// Main App Component
function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [menuOpen, setMenuOpen] = useState(false);
  const sectionsRef = useRef({});

  // Handle smooth scrolling
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 60,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
      setMenuOpen(false);
    }
  };

  // Handle scroll events to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      const sections = Object.keys(sectionsRef.current);

      for (const section of sections) {
        const element = sectionsRef.current[section];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Register section refs
  const registerSection = (id, element) => {
    sectionsRef.current[id] = element;
  };

  return (
    <div className="portfolio-app">
      {/* Theme Switch */}
      <ThemeSwitch />
      
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span>Pranav Pushkar Mishra</span>
        </div>
        <div className={`mobile-menu-button ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li className={activeSection === 'about' ? 'active' : ''}>
              <button onClick={() => scrollToSection('about')}>About Me</button>
            </li>
            <li className={activeSection === 'game-design' ? 'active' : ''}>
              <button onClick={() => scrollToSection('game-design')}>Game Design</button>
            </li>
            <li className={activeSection === 'ai-ml' ? 'active' : ''}>
              <button onClick={() => scrollToSection('ai-ml')}>AI / ML</button>
            </li>
            <li className={activeSection === 'misc' ? 'active' : ''}>
              <button onClick={() => scrollToSection('misc')}>Misc</button>
            </li>
            <li className={activeSection === 'contact' ? 'active' : ''}>
              <button onClick={() => scrollToSection('contact')}>Connect</button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {/* About Section */}
        <section 
          id="about" 
          className="about-section"
          ref={(el) => registerSection('about', el)}
        >
          <ParticleBackground />
          <div className="container">
            <div className="about-content">
              <div className="profile-image">
                <div className="profile-img-container">
                  <img src="/api/placeholder/400/400" alt="Pranav Pushkar Mishra" />
                </div>
              </div>
              <div className="about-text">
                <h1 className="fade-in">Pranav Pushkar Mishra</h1>
                <h2 className="fade-in delay-1">Game Developer & ML Engineer</h2>
                <p className="fade-in delay-2">
                  I'm a Computer Science graduate from the University of Illinois at Chicago, 
                  specializing in game development and machine learning, with hands-on experience 
                  in creating immersive applications and enhancing data-driven models.
                </p>
                
                {/* Skills */}
                <div className="skills-container fade-in delay-3">
                  <AnimatedSkillBar skill="Unity Development" percentage={90} color="#ff2d55" />
                  <AnimatedSkillBar skill="Machine Learning" percentage={85} color="#3d5afe" />
                  <AnimatedSkillBar skill="Unreal Engine" percentage={75} color="#ff2d55" />
                  <AnimatedSkillBar skill="Data Visualization" percentage={80} color="#3d5afe" />
                </div>
                
                <div className="cta-buttons fade-in delay-4">
                  <button className="primary-btn" onClick={() => scrollToSection('game-design')}>
                    View Projects
                  </button>
                  <button className="secondary-btn" onClick={() => scrollToSection('contact')}>
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="scroll-indicator" onClick={() => scrollToSection('game-design')}>
            <div className="mouse">
              <div className="wheel"></div>
            </div>
            <div>
              <span className="scroll-arrow"></span>
            </div>
          </div>
        </section>

        {/* Project Navigation Tabs */}
        <div className="projects-navigation-section">
          <div className="container">
            <ProjectTabs
              activeTab={activeSection}
              onTabChange={(tabId) => scrollToSection(tabId)}
            />
          </div>
        </div>

        {/* Game Design Projects Section */}
        <section 
          id="game-design" 
          className="game-design-section"
          ref={(el) => registerSection('game-design', el)}
        >
          <div className="container">
            <h2 className="section-title game-title">
              <PixelText text="Game Design Projects" color="#ff2d55" />
            </h2>
            <div className="projects-grid">
              {gameProjects.map((project, index) => (
                <EnhancedProjectCard 
                  key={index}
                  project={project}
                  index={index}
                  theme="game"
                />
              ))}
            </div>
          </div>
        </section>

        {/* AI/ML Projects Section */}
        <section 
          id="ai-ml" 
          className="ai-ml-section"
          ref={(el) => registerSection('ai-ml', el)}
        >
          <div className="container">
            <h2 className="section-title ai-title">Machine Learning Projects</h2>
            <div className="projects-grid">
              {aiProjects.map((project, index) => (
                <EnhancedProjectCard 
                  key={index}
                  project={project}
                  index={index}
                  theme="ai"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Miscellaneous Projects Section */}
        <section 
          id="misc" 
          className="misc-section"
          ref={(el) => registerSection('misc', el)}
        >
          <div className="container">
            <h2 className="section-title misc-title">Miscellaneous Projects</h2>
            <div className="projects-grid">
              {miscProjects.map((project, index) => (
                <EnhancedProjectCard 
                  key={index}
                  project={project}
                  index={index}
                  theme="misc"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section 
          id="contact" 
          className="contact-section"
          ref={(el) => registerSection('contact', el)}
        >
          <div className="container">
            <h2 className="section-title">Connect With Me</h2>
            <div className="contact-links">
              <a href="https://linkedin.com/in/example" className="contact-item linkedin">
                <div className="icon-container">
                  <i className="icon linkedin-icon"></i>
                </div>
                <span>LinkedIn</span>
              </a>
              <a href="https://github.com/example" className="contact-item github">
                <div className="icon-container">
                  <i className="icon github-icon"></i>
                </div>
                <span>GitHub</span>
              </a>
              <a href="/resume.pdf" className="contact-item resume">
                <div className="icon-container">
                  <i className="icon resume-icon"></i>
                </div>
                <span>Resume</span>
              </a>
              <a href="mailto:example@email.com" className="contact-item email">
                <div className="icon-container">
                  <i className="icon email-icon"></i>
                </div>
                <span>Email</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Pranav Pushkar Mishra. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Enhanced Project Card Component
const EnhancedProjectCard = ({ project, index, theme }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div 
      className={`project-card ${theme}-card fade-in delay-${index % 4 + 1}`}
      style={{ 
        animationDelay: `${0.2 * (index % 4 + 1)}s`,
        opacity: 0
      }}
    >
      <div className="project-image">
        <img src={project.image} alt={project.title} />
        <div className="project-links">
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-link github">
              <i className="icon github-icon"></i>
            </a>
          )}
          {project.demoLink && (
            <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="project-link demo">
              <i className="icon demo-icon"></i>
            </a>
          )}
          {project.gallery && project.gallery.length > 0 && (
            <button onClick={toggleExpand} className="project-link gallery">
              <i className="icon gallery-icon"></i>
            </button>
          )}
        </div>
      </div>
      <div className="project-info">
        <h3 className="project-title">{project.title}</h3>
        <span className="project-category">{project.category}</span>
        
        {/* Tech Stack */}
        <div className="tech-stack">
          {project.techStack && project.techStack.map((tech, i) => (
            <TechStackBadge key={i} tech={tech} theme={theme} />
          ))}
        </div>
        
        <p className="project-description">{project.description}</p>
        
        {/* Expanded Gallery View */}
        {isExpanded && project.gallery && (
          <div className="expanded-view">
            <ProjectGallery images={project.gallery} />
            <button className="close-gallery" onClick={toggleExpand}>
              Close Gallery
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Project Data
const gameProjects = [
  {
    title: "Stellarium: ASO",
    category: "VR Application",
    description: "A virtual reality project developed in Unity for the CAVE 2 system featuring over 107,000 stars and constellations. Users can navigate space, explore constellations, and observe stellar movements over time.",
    image: "/api/placeholder/400/250",
    githubLink: "https://github.com/example/stellarium",
    demoLink: "https://example.com/stellarium-demo",
    techStack: ["Unity", "C#", "VR"],
    gallery: [
      "/api/placeholder/800/500",
      "/api/placeholder/800/500",
      "/api/placeholder/800/500"
    ]
  },
  {
    title: "Virtual Van Gogh",
    category: "NFT Galleria",
    description: "An interactive NFT museum using Unity and Ethereum blockchain that allows dynamic viewing and transactions of digital art. Secured first place at HINT 5.0 (Hack in the North).",
    image: "/api/placeholder/400/250",
    githubLink: "https://github.com/example/virtual-van-gogh",
    demoLink: "https://example.com/vvg-demo",
    techStack: ["Unity", "Ethereum", "Web3"],
    gallery: [
      "/api/placeholder/800/500",
      "/api/placeholder/800/500"
    ]
  },
  {
    title: "Neon-Bites",
    category: "PC Game",
    description: "A thrilling cyberpunk food delivery game where players navigate a neon-lit city, avoiding obstacles and enemies to deliver orders on time while managing resources and upgrading their character.",
    image: "/api/placeholder/400/250",
    githubLink: "https://github.com/example/neon-bites",
    demoLink: "https://example.com/neon-bites-demo",
    techStack: ["Unity", "C#"],
    gallery: [
      "/api/placeholder/800/500",
      "/api/placeholder/800/500",
      "/api/placeholder/800/500"
    ]
  },
  {
    title: "SnAIder-Cut",
    category: "XR/VR Application",
    description: "Won Best Location AR at MIT XR Reality Hackathon 2024 by using Mixed Reality and Generative AI to visually generate and modify movie scenes in real-time.",
    image: "/api/placeholder/400/250",
    githubLink: "https://github.com/example/snaider-cut",
    demoLink: "https://example.com/snaider-demo",
    techStack: ["Unity", "AR", "OpenAI"],
    gallery: [
      "/api/placeholder/800/500",
      "/api/placeholder/800/500"
    ]
  },
  {
    title: "Sign Smash",
    category: "Android Game",
    description: "An action-packed FPS shooter game featuring basic AI enemies, traps, tricks, and a challenging final boss with multiple paths for attack and defense.",
    image: "/api/placeholder/400/250",
    githubLink: "https://github.com/example/sign-smash",
    demoLink: "https://play.google.com/store",
    techStack: ["Unity", "Mobile", "C#"],
    gallery: [
      "/api/placeholder/800/500",
      "/api/placeholder/800/500"
    ]
  },
  {
    title: "Equity Project",
    category: "Unreal Engine Application",
    description: "An Unreal Engine 5 application for UIC AHS supporting equity research in the medical field, featuring a dialogue tree and utilizing MetaHuman and Nvidia Omniverse.",
    image: "/api/placeholder/400/250",
    githubLink: "https://github.com/example/equity-project",
    techStack: ["Unreal", "MetaHuman", "Omniverse"],
    gallery: [
      "/api/placeholder/800/500",
      "/api/placeholder/800/500"
    ]
  },
  {
    title: "Upsurge: Project Outlive",
    category: "Android Game",
    description: "A mobile platformer game developed in Unity where players control a rocketship through challenging levels, featuring a leaderboard and in-game achievements.",
    image: "/api/placeholder/400/250",
    githubLink: "https://github.com/example/upsurge",
    demoLink: "https://play.google.com/store",
    techStack: ["Unity", "Mobile", "C#"],
    gallery: [
      "/api/placeholder/800/500"
    ]
  },
  {
    title: "Cracking",
    category: "Android Game",
    description: "A mobile rail shooter game developed in Unity with limited level running. Includes a leaderboard and in-game achievements integrated with the Google Play Store.",
    image: "/api/placeholder/400/250",
    githubLink: "https://github.com/example/cracking",
    demoLink: "https://play.google.com/store",
    techStack: ["Unity", "Mobile", "C#"],
    gallery: [
      "/api/placeholder/800/500"
    ]
  }
];

const aiProjects = [
  {
    title: "Auto-Prompting for PaintSeg",
    category: "Research Project",
    description: "An innovative autoprompting system for training-free object segmentation. Leverages k-means clustering and Dense Prediction Transformer (DPT) to extract depth maps and create precise binary and bounding box masks.",
    image: "/api/placeholder/400/250",
    githubLink: "https://github.com/example/auto-prompting",
    techStack: ["Python", "PyTorch", "DPT"],
    gallery: [
      "/api/placeholder/800/500",
      "/api/placeholder/800/500"
    ]
  },
  {
    title: "Microscopy Image Segmentation",
    category: "Research Project",
    description: "Segmentation of a 5x5x5 um section of the CA1 hippocampus using Electron Microscopy Dataset. Implemented various techniques from histogram segmentation to deep learning with UNet.",
    image: "/api/placeholder/400/250",
    githubLink: "https://github.com/example/microscopy-segmentation",
    techStack: ["Python", "TensorFlow", "UNet"],
    gallery: [
      "/api/placeholder/800/500",
      "/api/placeholder/800/500"
    ]
  },
  {
    title: "Market Volatility Prediction",
    category: "Optiver Dataset Challenge",
    description: "Utilized various regression models to predict market volatility using the Optiver trading dataset. The Random Forest Regressor showed the best performance due to its ability to handle non-linear data.",
    image: "/api/placeholder/400/250",
    githubLink: "https://github.com/example/market-volatility",
    techStack: ["Python", "Scikit-learn", "LGBM"],
    gallery: [
      "/api/placeholder/800/500"
    ]
  },
  {
    title: "Azure Virtual Avatar",
    category: "Real-Time Project",
    description: "Implemented Azure's Text-to-Speech model to create a real-time talking avatar, leveraging Azure and OpenAI models for enhanced interactivity.",
    image: "/api/placeholder/400/250",
    githubLink: "https://github.com/example/azure-avatar",
    demoLink: "https://example.com/azure-avatar-demo",
    techStack: ["Azure", "OpenAI", "JavaScript"],
    gallery: [
      "/api/placeholder/800/500",
      "/api/placeholder/800/500"
    ]
  },
  {
    title: "UnetPlus",
    category: "Oral Cancer Image Segmentation",
    description: "Developed deep learning models using U-Net architecture with various pre-trained backbones for oral cancer image segmentation, achieving high performance using IoU metrics.",
    image: "/api/placeholder/400/250",
    githubLink: "https://github.com/example/unetplus",
    techStack: ["Python", "TensorFlow", "ResNet"],
    gallery: [
      "/api/placeholder/800/500"
    ]
  }
];

const miscProjects = [
  {
    title: "Pixel Punks",
    category: "Collaborative Pixel Art",
    description: "A collaborative pixel art project on the Solana blockchain where users collectively create a piece that would be minted as an NFT. Each pixel change involved a small Solana transaction.",
    image: "/api/placeholder/400/250",
    githubLink: "https://github.com/example/pixel-punks",
    demoLink: "https://example.com/pixel-punks",
    techStack: ["Solana", "JavaScript", "Blockchain"],
    gallery: [
      "/api/placeholder/800/500",
      "/api/placeholder/800/500"
    ]
  },
  {
    title: "Kill the Motherboard",
    category: "Unity Multiplayer Game",
    description: "A 3-player Unity game where players cooperatively overheat the CPU by delivering a power surge or stopping the fan. An educational game that teaches about motherboard function.",
    image: "/api/placeholder/400/250",
    githubLink: "https://github.com/example/kill-motherboard",
    demoLink: "https://example.com/motherboard-demo",
    techStack: ["Unity", "Multiplayer", "C#"],
    gallery: [
      "/api/placeholder/800/500"
    ]
  },
  {
    title: "UnetPlus",
    category: "Oral Cancer Image Segmentation",
    description: "Developed deep learning models using U-Net architecture with various pre-trained backbones for oral cancer image segmentation, achieving high performance using IoU metrics.",
    image: "/api/placeholder/400/250",
    githubLink: "https://github.com/example/unetplus-misc",
    techStack: ["Python", "TensorFlow", "Healthcare"],
    gallery: [
      "/api/placeholder/800/500"
    ]
  }
];

export default App;