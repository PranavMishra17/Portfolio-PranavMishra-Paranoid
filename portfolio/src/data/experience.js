// src/data/experience.js
const experiences = [
  {
    id: "wheelprice-intern",
    company: "WheelPrice",
    title: "AI Engineer",
    duration: "July 2025 - March 2026",
    location: "Charlotte, NC",
    companyLogo: "assets/images/companies/wheelprice.jpg",
    description: [
      "Building end-to-end ML prototype for automotive part fitment prediction using PyTorch and computer vision models",
      "Deployed production-grade CMS blog system using React TypeScript with Node.js backend, MongoDB database, and RESTful APIs, scaling daily webapp viewership by 10-20k through enhanced content delivery and SEO implementation"
    ],
    techStack: ["PyTorch", "Computer Vision", "React", "TypeScript", "Node.js", "MongoDB", "RESTful APIs", "SEO"],
    links: {
      website: "https://wheelprice.com/"
    }
  },
  {
    id: "research-software-engineer-uic",
    company: "UIC: V-ARE Labs",
    title: "Research Software Engineer",
    duration: "Feb 2024 - Present",
    location: "Chicago, IL",
    companyLogo: "assets/images/companies/uic.jpg",
    description: [
      "Built virtual patient system using Unreal Engine and C++. Deployed REST APIs with Python backend for data analysis",
      "Deployed end-to-end audio ML pipeline with Flask backend comparing MFCC feature engineering and CNN architectures achieving 98.52% accuracy; deployed real-time inference system with VAD & robustness testing."
    ],
    techStack: ["Unreal Engine 5", "C++", "Python", "LangChain", "PostgreSQL", "Azure", "React", "JavaScript", "Cosmos DB"],
    links: {
      website: "https://www.uic.edu/",
      github: "https://github.com/PranavMishra17/EQUITY-VirtualPatient-UE5",
      demo: "https://github.com/PranavMishra17/MedRAG-Avatar-Platform-IVORY"
    }
  },
  {
    id: "bipolar-factory-intern",
    company: "Bipolar Factory",
    title: "Software Developer Intern",
    duration: "March 2023 - May 2023",
    location: "Bengaluru, Karnataka, India",
    companyLogo: "assets/images/companies/bpf.jpg",
    description: [
      "Developed data-driven streaming platform using MERN stack (MongoDB, Express.js, React, Node.js) with TypeScript. Established AWS cloud deployment pipeline following Agile methods, Jenkins CI/CD and Linux server management",
      "Built in-game chat feature using C#, Unity(10% retention increase), MongoDB & SQL optimization in Metawood"
    ],
    techStack: ["MERN Stack", "TypeScript", "AWS", "Jenkins", "Linux", "C#", "Unity", "MongoDB", "SQL"],
    links: {
      website: "https://www.bipolarfactory.com/products#Metawood"
    }
  }
];

// Get fallback image for company logos
export const getCompanyLogoWithFallback = (logoPath, companyName) => {
  if (!logoPath || logoPath === "" || logoPath.includes("undefined")) {
    return "/assets/images/web.png";
  }
  return logoPath.startsWith('/') ? logoPath : '/' + logoPath;
};

export default experiences;