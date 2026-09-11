// Projects pulled from github.com/PranavMishra17 on 11 Sep 2026 that were not yet in
// projects.js. Same shape as projects.js so either file can feed the same components.
//
// Images: where the repo carried one it is saved under public/assets/images/. Where it did not,
// mainImage is GitHub's own preview card for the repo (an absolute URL), which renders fine but
// is a placeholder until a real screenshot is dropped in and the path changed here.

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
      id: 'alaap',
      title: 'Alaap: Text-to-Voice Design',
      category: 'Speech Synthesis',
      description:
        'A natural-language character description becomes a persistent, reusable voice identity, and any dialogue can then be rendered in that voice. English through Qwen3-TTS; Hindi, Bengali and Tamil through Indic-Mio and MioCodec. Watermarked output with a game-engine manifest, fourteen recorded experiments each stating what was not established, and 114 invariant tests. Runs on a 6 GB laptop GPU.',
      mainImage: og('alaap'),
      gallery: [],
      techStack: ['Python', 'TTS', 'Voice Cloning', 'Indic NLP', 'PyTorch'],
      githubLink: 'https://github.com/PranavMishra17/alaap',
      demoLink: '',
      websiteLink: '',
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
    {
      id: 'patient-care',
      title: 'Patient Care Coordination Pipeline',
      category: 'Healthcare Automation',
      description:
        'Automated patient intake and care coordination: AI triage, specialist matching, encrypted data handling and multi-channel notifications, built as an n8n workflow over Postgres and Redis with Azure OpenAI for the judgement calls. Designed with HIPAA in mind from the schema up.',
      mainImage: 'assets/images/ai_ml/patient-care.png',
      gallery: [],
      techStack: ['n8n', 'PostgreSQL', 'Redis', 'Azure OpenAI', 'Docker'],
      githubLink: 'https://github.com/PranavMishra17/Patient-care-automation-system',
      demoLink: '',
      websiteLink: '',
    },
    {
      id: 'fitment-assistant',
      title: 'Agentic Fitment Assistant',
      category: 'Applied LLM',
      description:
        'The proof of concept behind the WheelPrice fitment assistant: a white-label chat widget for wheel and tyre retailers, embedded with two lines, with multi-tenant configuration, an analytics dashboard and MCP integration. The agent answers fitment questions only through its tools, never from memory.',
      mainImage: og('Agentic-fitment-assistant-POC'),
      gallery: [],
      techStack: ['JavaScript', 'LLM Agents', 'MCP', 'Cloudflare Pages'],
      githubLink: 'https://github.com/PranavMishra17/Agentic-fitment-assistant-POC',
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
    {
      id: 'world-is-burning',
      title: 'World Is Burning',
      category: 'VR Multiplayer',
      description:
        'A VR multiplayer game for Meta Quest 3, built for the StanfordXR RamenVR track.',
      mainImage: og('World-is-Burning'),
      gallery: [],
      techStack: ['Unity', 'C#', 'Meta Quest 3', 'Multiplayer'],
      githubLink: 'https://github.com/PranavMishra17/World-is-Burning',
      demoLink: '',
      websiteLink: '',
    },
    {
      id: 'pongpong',
      title: 'PongPong',
      category: 'Physics',
      description: 'A table tennis game in Unity, chasing realistic ball physics.',
      mainImage: og('PongPong'),
      gallery: [],
      techStack: ['Unity', 'C#'],
      githubLink: 'https://github.com/PranavMishra17/PongPong',
      demoLink: '',
      websiteLink: '',
    },
  ],
  misc: [
    {
      id: 'cli-treasure-hunt',
      title: 'CLI Treasure Hunt',
      category: 'AI Agents',
      description:
        'Hide-and-seek for CLI agents. Organiser agents hide five four-letter words across logs, JSON, images, source code and mock network data; player agents have to find them through log analysis, steganography, pattern recognition and forensic work. Built with Gemini CLI at the AI Tinkerers NYC buildathon.',
      mainImage: 'assets/images/misc/cli-treasure-hunt.png',
      gallery: [],
      techStack: ['Gemini CLI', 'Claude Code', 'Shell', 'AI Agents'],
      githubLink: 'https://github.com/PranavMishra17/CLI-Treasure-Hunt',
      demoLink: '',
      websiteLink: '',
    },
    {
      id: 'skill-check',
      title: 'skill-check: A Job Hunt You Drive From Claude Code',
      category: 'Tooling',
      description:
        'Three slash commands inside Claude Code: find AI and LLM roles posted in the last N days, find the people hiring for them with a verified email each, and auto-fill applications on the common ATSs through your own browser. Every result is scored against your profile and appended to a static dashboard on GitHub Pages. Disco Elysium aesthetic.',
      mainImage: 'assets/images/misc/skill-check.png',
      gallery: [],
      techStack: ['Claude Code', 'JavaScript', 'Apify', 'GitHub Pages'],
      githubLink: 'https://github.com/PranavMishra17/skill-check-JobSearch',
      demoLink: '',
      websiteLink: 'https://pranavmishra17.github.io/skill-check-JobSearch/',
    },
    {
      id: 'claude-setup',
      title: 'claude-setup',
      category: 'Tooling',
      description:
        'A reusable Claude Code configuration for agentic development: a planning agent that turns a goal into an ordered feature list, a zero-context feature builder, commands for commit summaries and session handoff, and hooks that block destructive commands and check syntax on write. Drop it into any new project.',
      mainImage: og('Claude-setup'),
      gallery: [],
      techStack: ['Claude Code', 'Agents', 'Hooks'],
      githubLink: 'https://github.com/PranavMishra17/Claude-setup',
      demoLink: '',
      websiteLink: '',
    },
    {
      id: 'storywheel',
      title: 'StoryWheel',
      category: 'Content',
      description: 'A blog platform on Create React App and Sanity: the content layer that gave WheelPrice a page for its search traffic to land on.',
      mainImage: og('StoryWheel'),
      gallery: [],
      techStack: ['React', 'Sanity', 'JavaScript'],
      githubLink: 'https://github.com/PranavMishra17/StoryWheel',
      demoLink: '',
      websiteLink: '',
    },
  ],
};

export default githubProjects;
