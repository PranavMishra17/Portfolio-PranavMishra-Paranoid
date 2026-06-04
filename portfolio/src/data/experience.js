// src/data/experience.js
//
// `heroColor` is the company's brand tint used for the hero strip
// gradient when no `heroImage` is provided. Drop a 1600x600 workplace
// photo into public/assets/images/companies/heros/<id>.jpg and set
// `heroImage` to that path to replace the gradient with the photo.
const experiences = [
  {
    id: "alfred-founding-llm",
    company: "Alfred_",
    title: "Founding LLM Engineer",
    duration: "April 2026 - Present",
    location: "New York City, NY",
    country: "us",
    isCurrent: true,
    companyLogo: "assets/images/companies/alfred.svg",
    heroImage: "assets/images/companies/heros/alfred-founding-llm.jpg",
    heroColor: "#6c5ce7",
    employmentType: "Full-time",
    workMode: "Hybrid",
    companyDescription: "Early-stage consumer AI startup building an AI executive assistant that runs entirely over SMS. Users text to manage email, calendar, tasks, and scheduling; alfred_ acts autonomously on their behalf. Multi-agent system routing requests to specialized agents across email triage, calendar management, and task coordination.",
    description: [
      "Built evaluation, regression-testing, and reliability infrastructure for production LLM agents — automated validation of multi-turn workflows, tool execution, and cross-platform integrations.",
      "Shipped AI-powered automation features and developed production-failure monitoring systems that transformed real user failures into actionable debugging insights and long-term regression coverage."
    ],
    techStack: [
      "TypeScript", "Deno", "Supabase", "Postgres", "pg_cron",
      "React", "Tailwind", "LangGraph",
      "LLM Evaluation", "Agentic Systems", "Multi-Agent Systems",
      "Google Calendar API", "Microsoft Graph", "Anthropic API",
      "Production Monitoring"
    ],
    links: {
      website: "https://get-alfred.ai/"
    }
  },
  {
    id: "wheelprice-intern",
    company: "WheelPrice",
    title: "Artificial Intelligence Engineer",
    duration: "July 2025 - March 2026",
    location: "Charlotte, NC",
    country: "us",
    employmentType: "Full-time",
    workMode: "Remote",
    companyLogo: "assets/images/companies/wheelprice.jpg",
    heroImage: "assets/images/companies/heros/wheelprice-intern.jpg",
    heroColor: "#f97316",
    companyDescription: "Techstars-backed automotive marketplace based out of Charlotte, NC, on a mission to make wheel and parts discovery effortless — building intelligent fitment technology that connects car enthusiasts and everyday drivers to the right parts, fast.",
    description: [
      "Built end-to-end ML prototype for automotive part fitment prediction using PyTorch and computer vision models.",
      "Deployed production-grade CMS blog system using React TypeScript with Node.js backend, MongoDB database, and RESTful APIs, scaling daily webapp viewership by 10–20k through enhanced content delivery and SEO implementation.",
      "Held full-stack responsibilities, contributing to the blogs system deployment as well as shipping the OTP verification system to production."
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
    country: "us",
    employmentType: "Full-time",
    workMode: "Hybrid",
    companyLogo: "assets/images/companies/uic.jpg",
    heroImage: "assets/images/companies/heros/research-software-engineer-uic.jpg",
    heroColor: "#d40028",
    companyDescription: "Research lab at the University of Illinois Chicago focused on virtual and augmented reality applications in healthcare, working directly with medical professionals and clinical teams.",
    description: [
      "Built virtual patient system using Unreal Engine and C++. Deployed REST APIs with a Python backend for data analysis.",
      "Deployed end-to-end audio ML pipeline with Flask backend comparing MFCC feature engineering, CNN architectures, and Transformer models — 98.52% accuracy; deployed real-time inference with VAD and robustness testing."
    ],
    projects: [
      {
        name: "TeamMedAgents — Medical Decision Making with SLMs through Teamwork",
        bullets: [
          "Engineered a modular multi-agent system using Google ADK with prompt engineering for medical QA across 8 benchmarks.",
          "Achieved 77.63% accuracy on LLMs and 3.1× inference speedup on 4B models through collaborative deliberation, trust-weighted voting, and structured multi-turn reasoning with comprehensive evaluation frameworks."
        ]
      }
    ],
    techStack: ["Unreal Engine 5", "C++", "Python", "Flask", "PyTorch", "Transformer Models", "Google ADK", "Multi-Agent Systems", "LangChain", "PostgreSQL", "Azure", "React", "Cosmos DB"],
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
    location: "Bengaluru, India",
    country: "in",
    employmentType: "Internship",
    workMode: "On-site",
    companyLogo: "assets/images/companies/bpf.jpg",
    heroImage: "assets/images/companies/heros/bipolar-factory-intern.jpg",
    heroColor: "#14b8a6",
    companyDescription: "Indie product studio building game, Web3, and AR/VR experiences — including Metawood, a community streaming platform for film and game enthusiasts.",
    description: [
      "Developed a data-driven streaming platform using the MERN stack with TypeScript. Established AWS cloud deployment pipeline following Agile methods, Jenkins CI/CD, and Linux server management.",
      "Built an in-game chat feature using C# and Unity (10% retention increase), with MongoDB and SQL optimization, in Metawood."
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