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
    id: "slm-teammedagents",
    title: "SLM-TeamMedAgents: Multi-Modal Multi-Agent Medical Reasoning with Small Language Models",
    authors: ["Pranav Pushkar Mishra", "Mohammad Arvan", "Mohan Zalake"],
    abstract: "We present SLM-TeamMedAgents, a multi-modal multi-agent framework demonstrating that collaborative Small Language Models (500M-27B parameters) can match the performance of 100B+ parameter models while reducing computational costs by orders of magnitude. Our system implements five independently toggleable teamwork components—Shared Mental Model, Leadership, Team Orientation, Trust Network, and Mutual Monitoring—as modular mechanisms within a three-round deliberation architecture. Built on Google's Agent Development Kit with Gemma and MedGemma models, the framework supports 2-4 dynamically recruited specialist agents with multi-modal reasoning capabilities across text and vision tasks. Systematic evaluation across 8 medical benchmarks (6 text-based: MedQA, MedMCQA, PubMedQA, MMLU-Pro Medical, DDXPlus, MedBullets; 2 vision-based: PMC-VQA, Path-VQA) demonstrates competitive performance with frontier models on text datasets and substantial improvements on vision-based medical tasks. Our hierarchical role specialization combined with trust-based weighted voting enables effective knowledge integration from resource-efficient SLMs. Controlled ablation studies reveal that collaborative multi-agent architectures unlock emergent reasoning capabilities in smaller models, particularly excelling in multi-modal medical image analysis where visual grounding enhances diagnostic accuracy. The modular design enables systematic evaluation of individual teamwork components, establishing SLM-based multi-agent systems as a viable, cost-effective alternative to monolithic large models for production healthcare AI deployment in resource-constrained environments.",
    conference: "Pacific-Asia Conference on Knowledge Discovery and Data Mining",
    venue: "PAKDD 2026",
    status: "Under Review",
    researchDates: "2024 - 2025",
    publicationDate: "2026 (Expected)",
    doi: "",
    pdfLink: "",
    codeLink: "https://github.com/PranavMishra17/SLM-TeamMedAgents",
    projectLink: "",
    citationCount: 0,
    techStack: [
      "Python",
      "Google ADK",
      "Gemma Models",
      "MedGemma",
      "Multi-Agent Systems",
      "Small Language Models",
      "Multi-Modal AI",
      "Medical Vision",
      "Cost-Efficient AI",
      "Healthcare AI"
    ],
    tags: ["Multi-Agent Systems", "Small Language Models", "Multi-Modal AI", "Medical Vision", "Cost Efficiency", "Healthcare"],
    category: "Medical AI",
    keywords: ["Multi-Agent Systems", "Small Language Models", "Multi-Modal Reasoning", "Medical Decision-Making", "Vision-Language Models", "Cost-Efficient AI", "Healthcare AI", "Collaborative Intelligence"]
  },
  {
    id: "metarag",
    title: "MetaRAG: Enhancing Document Retrieval with LLM-Driven Metadata Enrichment",
    authors: ["Kranti Yeole", "Pranav Pushkar Mishra", "Ramyashree", "Sarayloo Fatemeh", "Mokshit Surana"],
    abstract: "The increasing volume of digital documents in organizational knowledge bases necessitates efficient retrieval mechanisms. This research introduces a metadata enrichment framework for Large Language Model (LLM)-based contextual annotation to enhance Retrieval-Augmented Generation (RAG) systems. Our methodology implements a systematic pipeline that dynamically generates structured metadata for document chunks, improving semantic representations. We empirically evaluate three chunking strategies—semantic, recursive, and naive—combined with Term Frequency-Inverse Document Frequency (TF-IDF) weighted embeddings and prefix-fusion techniques. The Snowflake Arctic-Embed model was selected for embedding for its superior performance on technical documentation. Experiments demonstrate that metadata-enriched approaches consistently outperform content-only baselines, with recursive chunking paired with TF-IDF weighted embeddings yielding an 82.5% precision rate compared to 73.3% for semantic content-only approaches. The naive chunking strategy with prefix-fusion achieved the highest Hit Rate@10 of 0.925. Our evaluation employs cross-encoder reranking for ground truth generation, enabling rigorous assessment via Hit Rate and Metadata Consistency metrics. Results confirm that LLM-generated metadata significantly enhances vector clustering quality while maintaining lower retrieval latency, establishing metadata enrichment as a critical optimization for RAG systems across knowledge domains.",
    conference: "IEEE International Conference on Big Data",
    venue: "In Progress",
    status: "In Preparation",
    researchDates: "2023 - 2025",
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