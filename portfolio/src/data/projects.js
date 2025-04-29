// src/data/projects.js
const projects = {
    gameDesign: [
      {
        id: "stellarium",
        title: "Stellarium: ASO",
        category: "VR Application",
        description: "A virtual reality project developed in Unity for the CAVE 2 system featuring over 107,000 stars and constellations. Users can navigate space, explore constellations, and observe stellar movements over time.",
        mainImage: "assets/images/game_design/stellarium/main.jpg",
        gallery: [
          "assets/images/game_design/stellarium/gallery1.jpg",
          "assets/images/game_design/stellarium/gallery2.jpg",
        ],
        techStack: ["Unity", "C#", "VR"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "virtual-van-gogh",
        title: "Virtual Van Gogh",
        category: "NFT Galleria",
        description: "An interactive NFT museum using Unity and Ethereum blockchain that allows dynamic viewing and transactions of digital art. Secured first place at HINT 5.0 (Hack in the North).",
        mainImage: "assets/images/game_design/virtual_van_gogh/main.jpg",
        gallery: [
          "assets/images/game_design/virtual_van_gogh/gallery1.jpg",
          "assets/images/game_design/virtual_van_gogh/gallery2.jpg",
        ],
        techStack: ["Unity", "Ethereum", "Web3"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "neon-bites",
        title: "Neon-Bites",
        category: "PC Game",
        description: "A thrilling cyberpunk food delivery game where players navigate a neon-lit city, avoiding obstacles and enemies to deliver orders on time while managing resources and upgrading their character.",
        mainImage: "assets/images/game_design/neon_bites/main.jpg",
        gallery: [
          "assets/images/game_design/neon_bites/gallery1.jpg",
          "assets/images/game_design/neon_bites/gallery2.jpg",
        ],
        techStack: ["Unity", "C#"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "snaider-cut",
        title: "SnAIder-Cut",
        category: "XR/VR Application",
        description: "Won Best Location AR at MIT XR Reality Hackathon 2024 by using Mixed Reality and Generative AI to visually generate and modify movie scenes in real-time.",
        mainImage: "assets/images/game_design/snaider_cut/main.jpg",
        gallery: [
          "assets/images/game_design/snaider_cut/gallery1.jpg",
          "assets/images/game_design/snaider_cut/gallery2.jpg",
        ],
        techStack: ["Unity", "AR", "OpenAI"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "sign-smash",
        title: "Sign Smash",
        category: "Android Game",
        description: "An action-packed FPS shooter game featuring basic AI enemies, traps, tricks, and a challenging final boss with multiple paths for attack and defense.",
        mainImage: "assets/images/game_design/sign_smash/main.jpg",
        gallery: [
          "assets/images/game_design/sign_smash/gallery1.jpg",
          "assets/images/game_design/sign_smash/gallery2.jpg",
        ],
        techStack: ["Unity", "Mobile", "C#"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "equity-project",
        title: "Equity Project",
        category: "Unreal Engine Application",
        description: "An Unreal Engine 5 application for UIC AHS supporting equity research in the medical field, featuring a dialogue tree and utilizing MetaHuman and Nvidia Omniverse.",
        mainImage: "assets/images/game_design/equity_project/main.jpg",
        gallery: [
          "assets/images/game_design/equity_project/gallery1.jpg",
          "assets/images/game_design/equity_project/gallery2.jpg",
        ],
        techStack: ["Unreal", "MetaHuman", "Omniverse"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "upsurge",
        title: "Upsurge: Project Outlive",
        category: "Android Game",
        description: "A mobile platformer game developed in Unity where players control a rocketship through challenging levels, featuring a leaderboard and in-game achievements.",
        mainImage: "assets/images/game_design/upsurge/main.jpg",
        gallery: [
          "assets/images/game_design/upsurge/gallery1.jpg",
        ],
        techStack: ["Unity", "Mobile", "C#"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "cracking",
        title: "Cracking",
        category: "Android Game",
        description: "A mobile rail shooter game developed in Unity with limited level running. Includes a leaderboard and in-game achievements integrated with the Google Play Store.",
        mainImage: "assets/images/game_design/cracking/main.jpg",
        gallery: [
          "assets/images/game_design/cracking/gallery1.jpg",
        ],
        techStack: ["Unity", "Mobile", "C#"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "",
        websiteLink: ""
      }
    ],
    aiMl: [
      {
        id: "auto-prompting",
        title: "Auto-Prompting for PaintSeg",
        category: "Research Project",
        description: "An innovative autoprompting system for training-free object segmentation. Leverages k-means clustering and Dense Prediction Transformer (DPT) to extract depth maps and create precise binary and bounding box masks.",
        mainImage: "assets/images/ai_ml/auto_prompting/main.jpg",
        gallery: [
          "assets/images/ai_ml/auto_prompting/gallery1.jpg",
          "assets/images/ai_ml/auto_prompting/gallery2.jpg",
        ],
        techStack: ["Python", "PyTorch", "DPT"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "microscopy",
        title: "Microscopy Image Segmentation",
        category: "Research Project",
        description: "Segmentation of a 5x5x5 um section of the CA1 hippocampus using Electron Microscopy Dataset. Implemented various techniques from histogram segmentation to deep learning with UNet.",
        mainImage: "assets/images/ai_ml/microscopy/main.jpg",
        gallery: [
          "assets/images/ai_ml/microscopy/gallery1.jpg",
          "assets/images/ai_ml/microscopy/gallery2.jpg",
        ],
        techStack: ["Python", "TensorFlow", "UNet"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "market-volatility",
        title: "Market Volatility Prediction",
        category: "Optiver Dataset Challenge",
        description: "Utilized various regression models to predict market volatility using the Optiver trading dataset. The Random Forest Regressor showed the best performance due to its ability to handle non-linear data.",
        mainImage: "assets/images/ai_ml/market_volatility/main.jpg",
        gallery: [
          "assets/images/ai_ml/market_volatility/gallery1.jpg",
        ],
        techStack: ["Python", "Scikit-learn", "LGBM"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "azure-avatar",
        title: "Azure Virtual Avatar",
        category: "Real-Time Project",
        description: "Implemented Azure's Text-to-Speech model to create a real-time talking avatar, leveraging Azure and OpenAI models for enhanced interactivity.",
        mainImage: "assets/images/ai_ml/azure_avatar/main.jpg",
        gallery: [
          "assets/images/ai_ml/azure_avatar/gallery1.jpg",
          "assets/images/ai_ml/azure_avatar/gallery2.jpg",
        ],
        techStack: ["Azure", "OpenAI", "JavaScript"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "unetplus",
        title: "UnetPlus",
        category: "Oral Cancer Image Segmentation",
        description: "Developed deep learning models using U-Net architecture with various pre-trained backbones for oral cancer image segmentation, achieving high performance using IoU metrics.",
        mainImage: "assets/images/ai_ml/unetplus/main.jpg",
        gallery: [
          "assets/images/ai_ml/unetplus/gallery1.jpg",
        ],
        techStack: ["Python", "TensorFlow", "ResNet"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "",
        websiteLink: ""
      }
    ],
    misc: [
      {
        id: "pixel-punks",
        title: "Pixel Punks",
        category: "Collaborative Pixel Art",
        description: "A collaborative pixel art project on the Solana blockchain where users collectively create a piece that would be minted as an NFT. Each pixel change involved a small Solana transaction.",
        mainImage: "assets/images/misc/pixel_punks/main.jpg", 
        gallery: [
          "assets/images/misc/pixel_punks/gallery1.jpg",
          "assets/images/misc/pixel_punks/gallery2.jpg",
        ],
        techStack: ["Solana", "JavaScript", "Blockchain"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "kill-motherboard",
        title: "Kill the Motherboard",
        category: "Unity Multiplayer Game",
        description: "A 3-player Unity game where players cooperatively overheat the CPU by delivering a power surge or stopping the fan. An educational game that teaches about motherboard function.",
        mainImage: "assets/images/misc/kill_motherboard/main.jpg",
        gallery: [
          "assets/images/misc/kill_motherboard/gallery1.jpg",
        ],
        techStack: ["Unity", "Multiplayer", "C#"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "",
        websiteLink: ""
      },
      {
        id: "unetplus-misc",
        title: "UnetPlus",
        category: "Oral Cancer Image Segmentation",
        description: "Developed deep learning models using U-Net architecture with various pre-trained backbones for oral cancer image segmentation, achieving high performance using IoU metrics.",
        mainImage: "assets/images/misc/unetplus_misc/main.jpg",
        gallery: [
          "assets/images/misc/unetplus_misc/gallery1.jpg",
        ],
        techStack: ["Python", "TensorFlow", "Healthcare"],
        githubLink: "https://github.com/PranavMishra17?tab=repositories",
        demoLink: "",
        websiteLink: ""
      }
    ]
  };
  
  const contactInfo = {
    name: "Pranav Pushkar Mishra",
    title: "Game Developer & ML Engineer",
    bio: "I'm a Computer Science graduate from the University of Illinois at Chicago, specializing in game development and machine learning, with hands-on experience in creating immersive applications and enhancing data-driven models.",
    email: {
      personal: "pranavgamedev.17@gmail.com",
      academic: "pmishr23@uic.edu"
    },
    linkedin: "https://www.linkedin.com/in/pranavgamedev/",
    github: "https://github.com/PranavMishra17?tab=repositories",
    resume: "assets/resume.pdf"
  };
  
// src/data/projects.js (partial update)
const defaultImages = {
    projectMain: "/assets/images/default/project_default.jpg",
    gameDesign: "/assets/images/default/game_design_default.jpg",
    aiMl: "/assets/images/default/ai_ml_default.jpg",
    misc: "/assets/images/default/misc_default.jpg",
    profile: "/assets/images/default/profile_default.jpg"
  };
  
  export const getImageWithFallback = (imagePath, category) => {
    if (!imagePath || imagePath === "") {
      if (category === "game-design") return defaultImages.gameDesign;
      if (category === "ai-ml") return defaultImages.aiMl;
      if (category === "misc") return defaultImages.misc;
      return defaultImages.projectMain;
    }
    return imagePath;
  };
  
  export { projects, contactInfo, defaultImages };