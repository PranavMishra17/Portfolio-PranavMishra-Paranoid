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
    description: [
      "Built the team's behavioral-outcomes evaluation platform for an LLM-driven calendar/inbox agent — mock-provider layer (Gmail, Google Calendar, Microsoft Graph, messaging gateway), state-diff assertions over response text, multi-account multi-turn pass@k production-realism tier. Primary regression-protection layer for every agent change.",
      "Shipped a 3-stage production-failure scanner (response-content classifiers, tool-trace detectors, silent-failure heuristics) on a recurring cron chain — auto-promotes high-confidence failures into a lifecycle-tracked triage queue, posts chunked Slack digests, drives a documented failure → root cause → fix → regression-test cycle weekly.",
      "Owned an end-to-end calendar-change SMS pipeline (Google + Microsoft): per-minute diff with severity ladder, three-gate rollout (per-user opt-in, global kill switch, per-calendar opt-out), idempotent dispatch, latency halved via per-user cadence, burst-batching, sender-note extraction. Live for the internal cohort.",
      "Closed multi-account / multi-timezone correctness gaps once live: self-create suppression across linked emails, all-day event rendering on the right calendar date, SMS↔web-chat formatting parity via a shared validator with a contract test, and Microsoft's personal-account identifier substitution. Each fix pinned by regression tests.",
      "Bridged the agent platform's v5 → v6 transition on the eval side — built the web-adapter so eval coverage follows the agent across architecture versions without forking test cases; production-failure scanner reads detectors per version."
    ],
    techStack: [
      "TypeScript", "Deno", "Supabase", "Postgres", "pg_cron",
      "React", "Tailwind", "LangGraph",
      "LLM Evaluation", "Behavioral Eval", "Agentic Systems", "Multi-Agent Systems",
      "Google Calendar API", "Microsoft Graph", "Anthropic API",
      "Production Monitoring", "Cron Pipelines"
    ],
    links: {
      website: "https://get-alfred.ai/"
    }
  },
  {
    id: "wheelprice-intern",
    company: "WheelPrice",
    title: "AI Engineer",
    duration: "July 2025 - March 2026",
    location: "Charlotte, NC",
    country: "us",
    companyLogo: "assets/images/companies/wheelprice.jpg",
    heroImage: "assets/images/companies/heros/wheelprice-intern.jpg",
    heroColor: "#f97316",
    description: [
      "Built end-to-end ML prototype for automotive part fitment prediction using PyTorch and computer vision models",
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
    country: "us",
    companyLogo: "assets/images/companies/uic.jpg",
    heroImage: "assets/images/companies/heros/research-software-engineer-uic.jpg",
    heroColor: "#d40028",
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
    country: "in",
    companyLogo: "assets/images/companies/bpf.jpg",
    heroImage: "assets/images/companies/heros/bipolar-factory-intern.jpg",
    heroColor: "#14b8a6",
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