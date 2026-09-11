// The four projects from github.com/PranavMishra17 he kept that were not in projects.js. Same
// shape as projects.js so either file can feed the same components. Quorum has no screenshot
// yet: its mainImage is GitHub's own preview card until one is dropped in and the path changed.

const og = (repo) => `https://opengraph.githubassets.com/1/PranavMishra17/${repo}`;

export const githubProjects = {
  aiMl: [
    {
      id: 'quorum',
      title: 'Quorum: One AI Teammate in Every Room',
      category: 'Multi-Agent Chat',
      description:
        'A shared chat workspace of DMs and group rooms with a single AI teammate present everywhere. It decides for itself when a room needs it to speak, and it remembers things about the people it talks to without ever using what it learned in one room to answer in another where it does not belong. TypeScript end to end: Next.js on Vercel, Postgres on Supabase, Claude for the agent.',
      mainImage: og('quorum'),
      gallery: [],
      techStack: ['TypeScript', 'Next.js', 'Supabase', 'Postgres', 'Claude', 'Vercel'],
      githubLink: 'https://github.com/PranavMishra17/quorum',
      demoLink: '',
      websiteLink: 'https://quorum-rho.vercel.app',
    },
    {
      id: 'medbrief',
      title: 'MedBrief: Cited Medical Intelligence Briefings',
      category: 'Agentic Research',
      description:
        'Enter a medical condition and get a four-section research report with verified citations, streamed to the browser as it is written. A single Claude-powered orchestrator runs a multi-iteration research loop across ClinicalTrials.gov, PubMed, OpenFDA and web search, then synthesises standard of care, pipeline trials, approved therapies and the companies behind them.',
      mainImage: 'assets/images/ai_ml/medbrief.png',
      gallery: [],
      techStack: ['Python', 'Flask', 'Claude', 'Agents', 'PubMed', 'OpenFDA'],
      githubLink: 'https://github.com/PranavMishra17/InsightGlobal-Assesment',
      demoLink: '',
      websiteLink: '',
    },
    {
      id: 'autocallai',
      title: 'AutoCallAI: A Voice Agent That Improves Its Own Script',
      category: 'Voice AI',
      description:
        'A self-improving AI voice agent for medical appointment scheduling: a live voice interface with real-time transcripts, then an automated post-call loop that analyses the outcome and rewrites the prompt for the next call. FastAPI underneath, n8n for the workflow orchestration, and a multi-page web interface over it.',
      mainImage: 'assets/images/ai_ml/autocallai.png',
      gallery: [],
      techStack: ['Python', 'FastAPI', 'n8n', 'Voice AI', 'LLM'],
      githubLink: 'https://github.com/PranavMishra17/AutoCallAI',
      demoLink: '',
      websiteLink: '',
    },
  ],
  gameDesign: [
    {
      id: 'hoverhelp',
      title: 'HoverHelp: Immersive Support on the Line',
      category: 'XR',
      description:
        'Built at MIT Reality Hack 2026 for Galaxy XR and Android XR. Someone on a phone can see what you see in the headset and point at things in your actual kitchen while they talk you through a recipe. Unity, with direct access to the camera feed and websockets for the synchronised view.',
      mainImage: 'assets/images/game_design/hoverhelp.png',
      gallery: [],
      techStack: ['Unity', 'Android XR', 'C#', 'WebSockets'],
      githubLink: 'https://github.com/PranavMishra17/HoverHelp',
      demoLink: '',
      websiteLink: 'https://devpost.com/software/mooooooom',
    },
  ],
  misc: [
  ],
};

export default githubProjects;
