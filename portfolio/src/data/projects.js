// src/data/projects.js - Updated with 2025 Industry Keywords
const projects = {
    gameDesign: [
      {
        id: "stellarium",
        title: "Stellarium: A Space Odyssey",
        category: "XR Application",
        description: "Immersive CAVE 2 VR application rendering 107,000+ astronomical objects with spatial computing interfaces. Optimized real-time performance for large-scale datasets using advanced culling algorithms and GPU instancing.",
        mainImage: "assets/images/game_design/stellarium.png",
        gallery: [
          "assets/images/game_design/st1.png",
          "assets/images/game_design/st2.png",
        ],
        techStack: ["Unity", "C#", "XR Development", "CAVE Integration", "Spatial Computing", "Real-Time Rendering", "Performance Optimization", "Data Visualization"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "https://youtu.be/EX0c-6E8iNc?si=iir4DZKA3nCSydL2",
        websiteLink: ""
      },
      {
        id: "mafia-agents",
        title: "AI Mafia Game",
        category: "Agentic AI Simulation",
        description: "Multi-agent system simulating social deduction gameplay with personality-driven AI agents. Features collaborative reasoning, real-time agent discussions, and emergent behavioral patterns through advanced prompt engineering.",
        mainImage: "assets/images/game_design/mafia.png",
        gallery: [
          "assets/images/game_design/mafia2.png",
        ],
        techStack: ["React", "Python", "LangChain", "Multi-Agent Systems", "Real-Time Systems", "Full-Stack Development", "Behavioral AI"],
        githubLink: "https://github.com/PranavMishra17/Mafia-Boardgame-via-Agents",
        demoLink: "",
        websiteLink: ""
      },

      {
  id: "snakeai-mlops",
  title: "SnakeAI-MLOps: Reinforcement Learning Game Agents",
  category: "Machine Learning & Game Development",
  description: "Multi-agent Snake game with 4 RL techniques (Q-Learning, DQN, PPO, Actor-Critic). C++/SFML gameplay, Python/PyTorch training, LibTorch inference. GPU-accelerated with performance analytics.",
  mainImage: "assets/images/ai_ml/snake.png",
  gallery: [
  ],
  techStack: [
    "C++", 
    "SFML", 
    "CICD Pipeline", 
    "Reinforcement Learning", 
    "MLOps", 
    "Docker", 
    "Python",
    "PyTorch",
    "LibTorch"
  ],
  githubLink: "https://github.com/PranavMishra17/SnakeAI-MLOps",
  demoLink: "https://pranavmishra17.github.io/SnakeAI-MLOps/",
  websiteLink: ""
},
      
      {
        id: "neon-bites",
        title: "Neon-Bites",
        category: "Cross-Platform Game",
        description: "Cyberpunk delivery game with advanced physics systems and procedural content generation. Implemented resource management, character progression, and real-time performance optimization for consistent frame rates.",
        mainImage: "assets/images/game_design/neon.png",
        gallery: [
          "assets/images/game_design/neon1.png",
          "assets/images/game_design/neon2.png",
          "assets/images/game_design/neon3.png",
        ],
        techStack: ["Unity", "C#", "Physics Optimization", "Cross-Platform Development", "Performance Profiling"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "https://youtu.be/PLVynmeGvsI?si=HAVRIjbQF0fDGlPN",
        websiteLink: ""
      },
      {
        id: "snaider-cut",
        title: "SnAIder-Cut",
        category: "Mixed Reality Application",
        description: "MIT XR Hackathon 2024 winner combining generative AI with real-time AR scene modification. Features spatial mapping, gesture recognition, and AI-driven content generation with optimized rendering pipeline.",
        mainImage: "assets/images/game_design/snaider.png",
        gallery: [
          "assets/images/game_design/mit.jpeg",
        ],
        techStack: ["Unity", "Mixed Reality", "Generative AI", "Computer Vision", "Spatial Mapping", "XR Development", "Real-Time Rendering"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "https://youtu.be/CZtGmnGYKp8?si=wTtNdhiYHRDgUKBi",
        websiteLink: ""
      },
      {
        id: "virtual-van-gogh",
        title: "Virtual Van Gogh",
        category: "Blockchain Integration",
        description: "Interactive NFT museum with Web3 integration and decentralized art transactions. Secured first place at HINT 5.0 with seamless blockchain-to-Unity data pipeline and cross-platform deployment.",
        mainImage: "assets/images/game_design/van gogh.jpg",
        gallery: [
          "assets/images/game_design/virtual van.png",
          "assets/images/game_design/virtual van3.png",
          "assets/images/game_design/virtual van2.png",
        ],
        techStack: ["Unity", "Web3 Integration", "Blockchain Technology", "Smart Contracts", "Decentralized Systems"],
        githubLink: "https://github.com/PranavMishra17/Nalleria",
        demoLink: "https://youtu.be/rz_NiIj-dic?si=2b2rN4SZ_qGJ1WQl",
        websiteLink: ""
      },
      {
        id: "equity-project",
        title: "EQUITY: Virtual Patient Research Application",
        category: "Medical Simulation",
        description: "UE5-powered medical simulation for bias research using MetaHuman technology. Features advanced facial animation systems, interactive dialogue trees, and optimized performance for healthcare applications.",
        mainImage: "assets/images/game_design/equity.png",
        gallery: [
          "assets/images/game_design/eq1.png",
          "assets/images/game_design/eq2.png",
        ],
        techStack: ["Unreal Engine 5", "MetaHuman", "C++", "Medical Simulation", "Real-Time Animation", "Healthcare Technology", "Performance Optimization"],
        githubLink: "https://github.com/PranavMishra17/EQUITY-VirtualPatient-UE5",
        demoLink: "https://youtu.be/WO2vVaD8WoE?si=D2-56CQtPhK3ju-v",
        websiteLink: ""
      },
      {
        id: "kill-motherboard",
        title: "Kill the Motherboard",
        category: "Multiplayer Architecture",
        description: "Networked multiplayer game with client-server architecture and real-time synchronization. Implemented custom networking protocols, lag compensation, and scalable backend systems for concurrent players.",
        mainImage: "assets/images/game_design/kil.png",
        gallery: [],
        techStack: ["Unity", "C#", "Network Programming", "Client-Server Architecture", "Real-Time Synchronization", "Multiplayer Systems"],
        githubLink: "https://github.com/PranavMishra17/cs426_Asgn2_Pranav_Mishra",
        demoLink: "https://youtu.be/5vNe2up7Gp0?si=TnH0RGUgdsZrpWxE",
        websiteLink: ""
      },
      {
        id: "sign-smash",
        title: "Sign Smash",
        category: "Mobile Optimization",
        description: "Android FPS with intelligent AI systems and advanced mobile optimization. Features dynamic difficulty scaling, memory-efficient asset streaming, and cross-platform performance profiling.",
        mainImage: "assets/images/game_design/sign.png",
        gallery: [],
        techStack: ["Unity", "Mobile Optimization", "Cross-Platform Development", "Memory Management", "Performance Profiling"],
        githubLink: "https://github.com/PranavMishra17/Sign_Bender",
        demoLink: "https://youtu.be/jIbRtXV8lk4?si=EvZ_Wfl_yykzTB4t",
        websiteLink: ""
      },
      {
        id: "upsurge",
        title: "Upsurge: Project Outlive",
        category: "Cloud-Integrated Gaming",
        description: "Mobile platformer with procedural level generation and cloud-based leaderboard systems. Implemented real-time analytics, achievement tracking, and scalable backend architecture.",
        mainImage: "assets/images/game_design/up.png",
        gallery: [],
        techStack: ["Unity", "C#", "Blender", "Real-Time Analytics", "Mobile Development", "Backend Systems"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "https://youtu.be/wFV3eJhN3Ts?si=aLhavIhSyhecAn-O",
        websiteLink: ""
      },
      {
        id: "cracking",
        title: "Cracking",
        category: "Mobile Platform Integration",
        description: "Android rail shooter with Google Play Store integration and cloud-based progression systems. Features optimized resource management, cross-platform compatibility, and real-time performance monitoring.",
        mainImage: "assets/images/game_design/cracking.png",
        gallery: [],
        techStack: ["Unity", "Google Play Integration", "Mobile Optimization", "Cross-Platform Development", "Performance Monitoring"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "https://youtu.be/Za-9WKnd1gA?si=neHw3qB2cejnxPNU",
        websiteLink: ""
      }
    ],
    aiMl: [
      {
        id: "auto-prompting",
        title: "Auto-Prompting for PaintSeg",
        category: "Computer Vision Pipeline",
        description: "Training-free object segmentation using k-means clustering and Dense Prediction Transformer. Automated mask generation pipeline with depth estimation for production-ready segmentation tasks.",
        mainImage: "assets/images/ai_ml/paint.png",
        gallery: [
          "assets/images/ai_ml/paint1.png",
        ],
        techStack: ["PyTorch", "Computer Vision", "Transformer Models", "Model Deployment", "Depth Estimation", "Production Pipeline"],
        githubLink: "https://github.com/PranavMishra17/Auto-Prompting-for-PaintSeg",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "big5-agents",
        title: "Big5: Agentic Medical Diagnosis System",
        category: "Multi-Agent Architecture",
        description: "Collaborative AI system implementing Big Five teamwork model for distributed medical diagnosis. Features dynamic agent recruitment, specialized role assignment, and MLOps integration for healthcare deployment.",
        mainImage: "assets/images/ai_ml/big5.png",
        gallery: [
          "assets/images/ai_ml/big51.png",
        ],
        techStack: ["Python", "Agentic AI", "Multi-Agent Systems", "Healthcare AI", "MLOps", "Distributed Architecture", "Medical Informatics"],
        githubLink: "https://github.com/PranavMishra17/Big5-Agents",
        demoLink: "",
        websiteLink: ""
      },
                 {
  id: "snakeai-mlops",
  title: "SnakeAI-MLOps: Reinforcement Learning Game Agents",
  category: "Machine Learning & Game Development",
  description: "Multi-agent Snake game with 4 RL techniques (Q-Learning, DQN, PPO, Actor-Critic). C++/SFML gameplay, Python/PyTorch training, LibTorch inference. GPU-accelerated with performance analytics.",
  mainImage: "assets/images/ai_ml/snake.png",
  gallery: [
  ],
  techStack: [
    "C++", 
    "SFML", 
    "CICD Pipeline", 
    "Reinforcement Learning", 
    "MLOps", 
    "Docker", 
    "Python",
    "PyTorch",
    "LibTorch"
  ],
  githubLink: "https://github.com/PranavMishra17/SnakeAI-MLOps",
  demoLink: "https://pranavmishra17.github.io/SnakeAI-MLOps/",
  websiteLink: ""
},
      {
        id: "ai-avatar",
        title: "MedRAG Avatar Platform - IVORY",
        category: "Production RAG System",
        description: "Developed IVORY, a production-grade RAG system enabling custom conversational avatars for healthcare education. Comprehensiive RAG architecture with document processing, Azure Speech Services integration, and scalable deployment pipeline.",
        mainImage: "assets/images/ai_ml/avatar.png",
        gallery: [
          "assets/images/ai_ml/av1.png",
          "assets/images/ai_ml/av2.png",
        ],
        techStack: ["Python", "Production RAG", "Azure AI Services", "Real-Time Systems", "Cloud Infrastructure", "MLOps", "Vector Databases"],
        githubLink: "https://github.com/PranavMishra17/Azure-Web-app-Python-for-VARE-website-UIC",
        demoLink: "https://youtu.be/tZ5aoUfyKgM",
        websiteLink: ""
      },


        {
        id: "metadata-enrichment",
        title: "MetaRAG: Enterprise Knowledge Retrieval",
        category: "Production RAG Framework",
        description: "Advanced RAG system with LLM-powered metadata enrichment for enterprise knowledge management. Vector embeddings optimization with comprehensive evaluation metrics and production deployment.",
        mainImage: "assets/images/ai_ml/arch1.jpeg",
        gallery: [
          "assets/images/ai_ml/arch.png",
        ],
        techStack: ["LangChain", "Vector Embeddings", "Production RAG", "ML Research", "Information Retrieval", "Model Evaluation", "Knowledge Management"],
        githubLink: "https://github.com/PranavMishra17/Metadata-Enrichment-with-LLMs-for-RAGs-Internal-Knowledge-Retrieval",
        demoLink: "",
        websiteLink: ""
      },

      {
        id: "realestate-ai",
        title: "KEYA - Agentic Real Estate Platform",
        category: "Enterprise AI Application",
        description: "Multilingual AI platform for real estate with hybrid LLM architecture. Features intelligent property search, geospatial analysis, and conversational interfaces with enterprise-grade scalability.",
        mainImage: "assets/images/ai_ml/keya.png",
        gallery: [
          "assets/images/ai_ml/keya1.png",
          "assets/images/ai_ml/keya2.png",
          "assets/images/ai_ml/keya3.png",
        ],
        techStack: ["React", "Agentic AI", "Hybrid LLM", "Geospatial Analysis", "Enterprise AI", "Full-Stack Development", "RAPID API"],
        githubLink: "https://github.com/Archit1706/cs532-project",
        demoLink: "",
        websiteLink: ""
      },

{
  id: "streaming-digit-classifier",
  title: "Streaming Digit Classifier",
  category: "Real-Time Audio ML Pipeline",
  tagline: "Real-time spoken digit recognition with comprehensive ML model comparison",
  description: "Advanced streaming audio classification system comparing MFCC+NN, CNN architectures, and transformer models for real-time digit recognition. Features Voice Activity Detection, robustness testing with noise injection, and comprehensive performance analytics. Achieves 98.52% accuracy with sub-2ms inference time using optimized feature engineering approach.",
  mainImage: "assets/images/ai_ml/streaming-digit.png",
  gallery: [
    "assets/images/ai_ml/Digit1.png",
    "assets/images/ai_ml/Digit2.png"
  ],
  techStack: ["Python", "TensorFlow", "Flask", "Audio Processing", "Real-Time Audio", "Voice Activity Detection", "Web Audio API", "Model Comparison"],
  githubLink: "https://github.com/PranavMishra17/Streaming-Digit-Detector",
  demoLink: "",
  websiteLink: ""
},


      {
        id: "voicepersona-dataset",
        title: "VoicePersona: Voice Character Dataset",
        category: "AI Voice Synthesis Dataset",
        tagline: "80K+ voice samples with detailed character profiles for consistent voice synthesis",
        description: "Comprehensive voice persona dataset combining 80,000+ voice samples from 4 major datasets with AI-generated character profiles. Features detailed voice characteristics, demographics, and personality traits for training character-consistent voice synthesis models. Powers the VoiceForge project for text-to-voice generation.",
        mainImage: "assets/images/ai_ml/voicepersona.png",
        gallery: [
        ],
        techStack: ["Qwen2-Audio", "HuggingFace Datasets", "Voice Analysis", "Audio Processing", "Character Profiling", "Multi-Modal AI", "Voice Synthesis", "Dataset Curation"],
        githubLink: "https://github.com/PranavMishra17/VoicePersona-Dataset",
        demoLink: "",
        websiteLink: "https://huggingface.co/datasets/Paranoiid/VoicePersona"
        },
      {
        id: "inbedder",
        title: "InBedder: Instruction-Following Embeddings",
        category: "NLP Research Implementation",
        description: "Instruction-aware text embedding system treating instructions as queries with encoded expected answers. Transformer-based architecture with production deployment capabilities and cross-task evaluation.",
        mainImage: "assets/images/ai_ml/inbedder.png",
        gallery: [
          "assets/images/ai_ml/in1.png",
          "assets/images/ai_ml/in2.png",
        ],
        techStack: ["PyTorch", "Transformer Models", "Vector Embeddings", "Model Deployment", "NLP Research"],
        githubLink: "https://github.com/Hjhirp/InBedder",
        demoLink: "",
        websiteLink: ""
      },

      {
  id: "youtube-comments-analysis",
  title: "Comments Probe AI",
  category: "Sentiment Analysis & Multi-Modal Search",
  description: "Production-grade comment analysis platform with semantic search, LLM-based categorization, and automated insight extraction. Features two-phase hybrid search algorithm combining semantic filtering with GPT-4o ranking, comprehensive analytics pipeline, and session persistence for reusable embeddings.",
  mainImage: "assets/images/ai_ml/sentiment.png",
  gallery: [],
  techStack: [
    "Python",
    "OpenAI API",
    "Semantic Search",
    "Multi-Agent Systems",
    "Vector Embeddings",
    "Production Pipeline",
    "Real-Time Analytics"
  ],
  githubLink: "https://github.com/PranavMishra17/comment-probe-ai",
  demoLink: "",
  websiteLink: ""
},
{
  id: "flow-planner",
  title: "Flow Planner: AI Workflow Documentation",
  category: "Multi-modal AI Agent System",
  description: "Autonomous workflow capture system using Browser Agents with Claude Sonnet 4.5 vision and Gemini planning. Features multi-tier authentication handling, persistent browser profiles, and real-time state capture. Deployed on Railway with comprehensive testing suite and CI/CD pipeline.",
  mainImage: "assets/images/ai_ml/flow.png",
  gallery: [],
  techStack: [
    "Python",
    "Browser Agents",
    "Claude Sonnet 4.5",
    "Google Gemini",
    "Playwright",
    "Railway Deployment",
    "WebSockets",
    "Autonomous Agents"
  ],
  githubLink: "https://github.com/PranavMishra17/Flow-Planner",
  demoLink: "",
  websiteLink: "https://flow-planner-production.up.railway.app"
},
{
  id: "clausecraft",
  title: "ClauseCraft: Agentic Document Editor",
  category: "AI-Powered Document Intelligence",
  description: "Intelligent document editor with conversational AI interface powered by Google Gemini Flash. Features line-based citations, multi-format parsing (DOCX/PDF/Markdown), document locking, and real-time collaborative editing with function calling architecture.",
  mainImage: "assets/images/ai_ml/clause.png",
  gallery: [],
  techStack: [
    "Next.js 14",
    "TypeScript",
    "Google Gemini API",
    "MCP Server",
    "Document Parsing",
    "Real-Time Editing",
    "Tailwind CSS",
    "Vercel Deployment"
  ],
  githubLink: "https://github.com/PranavMishra17/clausecraft",
  demoLink: "",
  websiteLink: "https://clause-craft-bay.vercel.app"
},

      {
        id: "resumecraft-optimizer",
        title: "ResumeCraft - Intelligent Document Optimizer",
        category: "Document Processing Pipeline",
        description: "LLM-powered LaTeX optimization with component-level analysis and keyword usage tracking. Features surgical document reconstruction, constraint solving, and ATS compatibility optimization.",
        mainImage: "assets/images/ai_ml/resume.png",
        gallery: [],
        techStack: ["Python", "LangChain", "Document Processing", "LaTeX Parsing", "Production Systems"],
        githubLink: "https://github.com/PranavMishra17/ResumeCraft-Latex-resume-optimizer",
        demoLink: "",
        websiteLink: ""
      },

      {
 id: "voiceforge-architecture",
 title: "VoiceForge: Text-to-Voice Synthesis",
 category: "AI Voice Generation System",
 tagline: "Generate consistent character voices from pure text descriptions",
 description: "Revolutionary text-to-voice architecture that creates character voices without audio samples or voice actors. Uses CharacterBERT embeddings and XTTS-v2 synthesis to generate consistent character voices from natural language descriptions. Features lightweight deployment, multi-speaker support, and game engine integration.",
 mainImage: "assets/images/ai_ml/voiceforge.png",
 gallery: [
 ],
 techStack: ["XTTS-v2", "CharacterBERT", "Coqui TTS", "Sentence Transformers", "PyTorch", "Voice Synthesis", "Neural Embeddings", "Real-time Audio"],
 githubLink: "https://github.com/PranavMishra17/VoiceForge--Forge-Character-Voices-from-Pure-Text",
 demoLink: "",
 websiteLink: ""
},


      {
 "id": "healthcare-automation-pipeline",
 "title": "Patient Care Automation",
 "category": "Healthcare AI Automation",
 "description": "HIPAA-compliant healthcare automation pipeline with AI-powered triage, specialist assignment, and real-time care coordination. Features PHI encryption, Slack bot integration, automated scheduling, and comprehensive medical reporting using n8n workflows.",
 "mainImage": "assets/images/ai_ml/n8n.png",
 "gallery": [ ],
 "techStack": [
   "n8n",
   "Docker",
   "PostgreSQL",
   "Redis",
   "Healthcare AI",
   "Slack API",
   "SendGrid",
   "Automation"
 ],
 "githubLink": "https://github.com/PranavMishra17/Patient-care-automation-system",
 "demoLink": "",
 "websiteLink": ""
},

      {
        id: "lunar-survival",
        title: "NASA Lunar Survival Challenge",
        category: "Collaborative AI Architecture",
        description: "Multi-agent system for space survival scenarios with paired collaborative reasoning. Distributed decision-making architecture enabling cross-team integration and comprehensive survival strategy development.",
        mainImage: "assets/images/ai_ml/moon.png",
        gallery: [
          "assets/images/ai_ml/moon1.png",
          "assets/images/ai_ml/moon2.png",
        ],
        techStack: ["Python", "Multi-Agent Systems", "Collaborative AI", "Distributed Architecture", "Decision Systems"],
        githubLink: "https://github.com/PranavMishra17/NASA-Survival-on-the-moon--via-Agents",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "transformer-nmt",
        title: "Transformer Neural Machine Translation",
        category: "Deep Learning Implementation",
        description: "From-scratch Transformer implementation for English-German translation following 'Attention Is All You Need'. Features multi-head attention, positional encoding, and production-ready training pipeline.",
        mainImage: "assets/images/ai_ml/transformer_nmt/main.jpg",
        gallery: [],
        techStack: ["PyTorch", "Transformer Architecture", "Neural Machine Translation", "Model Training", "Deep Learning", "Production Pipeline"],
        githubLink: "https://github.com/VasistP/Transformer",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "microscopy",
        title: "Medical Microscopy Segmentation",
        category: "Healthcare AI Application",
        description: "Deep learning pipeline for hippocampus electron microscopy segmentation using UNet architecture. Advanced medical imaging with performance optimization for clinical deployment scenarios.",
        mainImage: "assets/images/ai_ml/micro.png",
        gallery: [],
        techStack: ["TensorFlow", "UNet Architecture", "Medical Imaging", "Healthcare AI", "Computer Vision"],
        githubLink: "https://github.com/PranavMishra17/Microscopy_Seg_CVProjectFall23",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "market-volatility",
        title: "Market Volatility Prediction System",
        category: "Financial ML Pipeline",
        description: "Production ML system for trading volatility prediction with ensemble methods. MLOps implementation featuring model comparison, performance monitoring, and real-time inference capabilities.",
        mainImage: "assets/images/ai_ml/votal.png",
        gallery: [],
        techStack: ["Python", "Ensemble Methods", "MLOps", "Financial ML", "Model Evaluation", "Real-Time Inference"],
        githubLink: "https://github.com/PranavMishra17/Applied-AI-Projects-CS512-UIC",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "football-bayesian-analysis",
        title: "Sports Analytics Decision System",
        category: "Bayesian ML Application",
        description: "Probabilistic modeling for football performance prediction using Bayesian Networks. Expected Goals (xG) analysis with sigmoid functions for sports analytics and decision support systems.",
        mainImage: "assets/images/ai_ml/foot.png",
        gallery: [],
        techStack: ["Python", "Bayesian Networks", "Sports Analytics", "Probabilistic Modeling", "Decision Systems", "Data Science"],
        githubLink: "https://github.com/PranavMishra17/Applied-AI-Projects-CS512-UIC",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "unetplus",
        title: "UNet++ Oral Cancer Detection",
        category: "Medical AI Deployment",
        description: "Advanced segmentation system for oral cancer detection using U-Net++ with multiple backbone architectures. High-performance medical AI with IoU optimization and clinical deployment pipeline.",
        mainImage: "assets/images/ai_ml/unet.png",
        gallery: [],
        techStack: ["TensorFlow", "U-Net Architecture", "Medical AI", "Cancer Detection", "Performance Optimization"],
        githubLink: "https://github.com/PranavMishra17/UnetPLUS-OralCancer-image-segmenattion",
        demoLink: "",
        websiteLink: ""
      }
    ],
    misc: [
      {
        id: "pixel-punks",
        title: "Pixel Punks - Collaborative Blockchain Art",
        category: "Decentralized Application",
        description: "Real-time collaborative pixel art on Solana blockchain with optimized transaction batching. Distributed architecture enabling collective NFT creation with seamless Web3 integration.",
        mainImage: "assets/images/misc/pixel.png", 
        gallery: [],
        techStack: ["Solana", "Web3 Integration", "Blockchain Development", "Real-Time Systems", "Decentralized Architecture", "Smart Contracts"],
        githubLink: "https://github.com/PranavMishra17/pixel-punks",
        demoLink: "",
        websiteLink: ""
      },
      {
  id: "complaint-hub-pro",
  title: "Complaint Hub Pro",
  category: "Full-Stack Web Application",
  description: "Professional complaint management system with secure admin dashboard and public tracking. Features JWT authentication, role-based access control, rich text markdown support, threaded comments, and comprehensive security middleware with rate limiting and XSS protection.",
  mainImage: "assets/images/misc/complaint.png",
  gallery: [],
  techStack: [
    "React 18",
    "TypeScript",
    "Node.js",
    "Express",
    "Supabase",
    "PostgreSQL",
    "JWT Authentication",
    "Tailwind CSS",
    "bcrypt",
    "express-validator"
  ],
  githubLink: "https://github.com/PranavMishra17/complaint-hub-pro",
  demoLink: "https://youtu.be/GDowE43oYFM",
  websiteLink: ""
},
      {
        id: "portfolio-website",
        title: "Portfolio Website",
        category: "Full-Stack Development",
        description: "Modern responsive portfolio with performance optimization and cloud deployment. Features interactive elements, SEO optimization, dynamic content management, and cross-platform compatibility.",
        mainImage: "assets/images/misc/preview.png",
        gallery: [],
        techStack: ["React.js", "Modern CSS", "Performance Optimization", "Cloud Deployment", "SEO Optimization", "Full-Stack Development"],
        githubLink: "https://github.com/PranavMishra17/Portfolio-PranavMishra-Paranoid",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "rusty-ant",
        title: "Rusty ANT - Systems Programming Game",
        category: "Rust Development",
        description: "2D life simulation game built in Rust with memory-safe systems programming. Features ant evolution mechanics, procedural generation, and performance-optimized game loops using Rust's ownership model.",
        mainImage: "assets/images/game_design/rust.png",
        gallery: [],
        techStack: ["Rust", "Systems Programming", "Memory Safety", "Performance Optimization", "Game Engine Development", "Cargo Ecosystem"],
        githubLink: "https://github.com/PranavMishra17/Rust-yy-Ant",
        demoLink: "",
        websiteLink: ""
      }
    ]
  };
  
const contactInfo = {
  name: "Pranav Mishra",
  title: "AI Engineer & Game Developer",
  bio: "Computer Science graduate from University of Illinois at Chicago specializing in agentic AI and game development. Expert in multi-agent systems, reinforcement learning, and autonomous intelligence. Published researcher with proven success in AI deployments, from enterprise RAG systems to game AI agents. Driven to revolutionize interactive experiences through cutting-edge agentic architectures.",
  email: {
    personal: "pranavgamedev.17@gmail.com",
    academic: "pmishr23@uic.edu"
  },
  linkedin: "https://www.linkedin.com/in/pranavgamedev/",
  github: "https://github.com/PranavMishra17?tab=repositories",
  googleScholar: "https://scholar.google.com/citations?user=_Twn_owAAAAJ&hl=en", // Update with actual URL
  huggingFace: "https://huggingface.co/Paranoiid",
  resume: {
    ai: "resumes/ai/resume_ai.pdf",
    game: "resumes/game/resume_game.pdf",
    default: "ai" // AI resume as default
  },

  location: "Metuchen, NJ, USA",
  status: "Available for full-time opportunities"
};

// Social media icons with image paths
const socialIcons = {
    linkedin: {
      icon: "/assets/images/icons/linkedin.png",
      alt: "LinkedIn",
      title: "LinkedIn"
    },
    github: {
      icon: "/assets/images/icons/github.png",
      alt: "GitHub",
      title: "GitHub"
    },
    googleScholar: {
      icon: "/assets/images/icons/sc.png",
      alt: "Google Scholar",
      title: "Research Publications"
    },
    huggingFace: {
      icon: "/assets/images/icons/hf.png",
      alt: "Hugging Face",
      title: "Hugging Face"
    },
    orcid: {
      icon: "/assets/images/icons/orcid.png",
      alt: "ORCID",
      title: "Academic Identity"
    },
    resume: {
      icon: "/assets/images/icons/resume.png",
      alt: "Resume",
      title: "Resumes"
    },
    email: {
      icon: "/assets/images/icons/email.png",
      alt: "Email",
      title: "Get in Touch"
    }
  };

// Default images configuration
const defaultImages = {
    projectMain: "/assets/images/default/project_default.jpg",
    gameDesign: "/assets/images/default/game_design_default.jpg",
    aiMl: "/assets/images/default/ai_ml_default.jpg", 
    misc: "/assets/images/default/misc_default.jpg",
    profile: "/assets/images/default/profile_default.jpg"
  };
  
// Updated getImageWithFallback function
export const getImageWithFallback = (imagePath, category) => {
  if (!imagePath || imagePath === "" || imagePath.includes("undefined")) {
    if (category === "game-design") return "/assets/images/default/game_design_default.jpg";
    if (category === "ai-ml") return "/assets/images/default/ai_ml_default.jpg";
    if (category === "misc") return "/assets/images/default/misc_default.jpg";
    if (category === "profile") return "/assets/images/default/profile_default.jpg";
    return "/assets/images/default/project_default.jpg";
  }
  
  return imagePath.startsWith('/') ? imagePath : '/' + imagePath;
};

export { projects, contactInfo, defaultImages, socialIcons };