// src/data/publications.js
const publications = [
  {
    id: "teammedagents",
    title: "TeamMedAgents: Enhancing Medical Decision-Making of LLMs Through Teamwork",
    authors: ["Pranav Pushkar Mishra", "Mohammad Arvan", "Mohan Zalake"],
    abstract: "We present TeamMedAgents, a novel multi-agent approach that systematically integrates evidence-based teamwork components from human-human collaboration into medical decision-making with large language models (LLMs). Our approach validates an organizational psychology teamwork model from human collaboration to computational multi-agent medical systems by operationalizing six core teamwork components derived from Salas et al.'s \"Big Five\" model: team leadership, mutual performance monitoring, team orientation, shared mental models, closed-loop communication, and mutual trust. We implement and evaluate these components as modular, configurable mechanisms within an adaptive collaboration architecture while assessing the effect of the number of agents involved based on the task's requirements and domain. Systematic evaluation of computational implementations of teamwork behaviors across eight medical benchmarks (MedQA, MedMCQA, MMLU-Pro Medical, PubMedQA, DDXPlus, MedBullets, Path-VQA, and PMC-VQA) demonstrates consistent improvements across 7 out of 8 evaluated datasets. Controlled ablation studies conducted on 50 questions per configuration across 3 independent runs provide mechanistic insights into individual component contributions, revealing optimal teamwork configurations that vary by reasoning task complexity and domain-specific requirements. Our ablation analyses reveal dataset-specific optimal teamwork configurations, indicating that different medical reasoning modalities benefit from distinct collaborative patterns. TeamMedAgents represents an advancement in collaborative AI by providing a systematic translation of established teamwork theories from human collaboration into agentic collaboration, establishing a foundation for evidence-based multi-agent system design in critical decision-making domains.",
    conference: "AAAI Conference on Artificial Intelligence",
    venue: "AAAI 2026",
    status: "Under Review",
    researchDates: "2024 - 2025",
    publicationDate: "2026 (Expected)",
    doi: "https://arxiv.org/abs/2508.08115",
    pdfLink: "",
    codeLink: "https://github.com/PranavMishra17/Big5-Agents",
    projectLink: "",
    citationCount: 0,
    techStack: [
      "Python",
      "Multi-Agent Systems", 
      "Azure Cloud", 
      "Medical AI", 
      "LangChain",
      "Healthcare AI",
      "Organizational Psychology"
    ],
    tags: ["Multi-Agent Systems", "Medical AI", "Teamwork", "Healthcare"],
    category: "Medical AI",
    keywords: ["Multi-Agent Systems", "Medical Decision-Making", "Teamwork", "Large Language Models", "Healthcare AI"]
  },
  {
    id: "metarag",
    title: "MetaRAG: Enhancing Document Retrieval with LLM-Driven Metadata Enrichment",
    authors: ["Kranti Yeole", "Pranav Pushkar Mishra", "Ramyashree", "Sarayloo Fatemeh", "Mokshit Surana"],
    abstract: "The increasing volume of digital documents in organizational knowledge bases necessitates efficient retrieval mechanisms. This research introduces a metadata enrichment framework for Large Language Model (LLM)-based contextual annotation to enhance Retrieval-Augmented Generation (RAG) systems. Our methodology implements a systematic pipeline that dynamically generates structured metadata for document chunks, improving semantic representations. We empirically evaluate three chunking strategies—semantic, recursive, and naive—combined with Term Frequency-Inverse Document Frequency (TF-IDF) weighted embeddings and prefix-fusion techniques. The Snowflake Arctic-Embed model was selected for embedding for its superior performance on technical documentation. Experiments demonstrate that metadata-enriched approaches consistently outperform content-only baselines, with recursive chunking paired with TF-IDF weighted embeddings yielding an 82.5% precision rate compared to 73.3% for semantic content-only approaches. The naive chunking strategy with prefix-fusion achieved the highest Hit Rate@10 of 0.925. Our evaluation employs cross-encoder reranking for ground truth generation, enabling rigorous assessment via Hit Rate and Metadata Consistency metrics. Results confirm that LLM-generated metadata significantly enhances vector clustering quality while maintaining lower retrieval latency, establishing metadata enrichment as a critical optimization for RAG systems across knowledge domains.",
    conference: "Research Paper",
    venue: "In Progress",
    status: "In Preparation",
    researchDates: "2023 - 2024",
    publicationDate: "TBD",
    doi: "",
    pdfLink: "",
    codeLink: "https://github.com/PranavMishra17/Metadata-Enrichment-with-LLMs-for-RAGs-Internal-Knowledge-Retrieval",
    projectLink: "",
    citationCount: 0,
    techStack: [
      "LangChain", 
      "Pinecone",
      "Azure Cloud Services",
      "Vector Embeddings", 
      "TF-IDF",
      "Information Retrieval", 
      "Kubernetes",
      "Linux"
    ],
    tags: ["RAG Systems", "Information Retrieval", "LLM Applications", "Metadata"],
    category: "Information Retrieval",
    keywords: ["Retrieval-Augmented Generation", "Large Language Models", "Metadata Enrichment", "Information Retrieval", "Document Processing"]
  }
];

// Future publications placeholder for easy addition
const upcomingPublications = [];

// Publication statistics
const publicationStats = {
  totalPublications: publications.length,
  totalCitations: publications.reduce((sum, pub) => sum + (pub.citationCount || 0), 0),
  hIndex: 0, // Will be calculated as publications grow
  i10Index: 0, // Will be calculated as publications grow
  researchAreas: ["Machine Learning", "Multi-Agent Systems", "Healthcare AI", "Information Retrieval"],
  collaborators: ["University of Illinois Chicago", "Research Labs", "Industry Partners"]
};

// Export all publication-related data
export { publications, upcomingPublications, publicationStats };
export default publications;