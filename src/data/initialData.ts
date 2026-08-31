import { ResumeData, ResumeBranch, ResumeVersion, JobApplication, JobDescriptionAnalysis } from '../types/resume';

export const INITIAL_PROFILE = {
  fullName: "Alex M. Rivera",
  title: "Senior Full-Stack & Systems Engineer",
  email: "alex.rivera@example.com",
  phone: "+1 (555) 389-2041",
  location: "San Francisco, CA (Open to Remote)",
  website: "https://alexrivera.dev",
  github: "https://github.com/alexrivera",
  linkedin: "https://linkedin.com/in/alex-rivera-systems",
  customLinks: [
    { label: "Blog", url: "https://alexrivera.dev/writing" },
    { label: "Google Scholar", url: "https://scholar.google.com/citations?user=alexrivera" }
  ]
};

// Master Canonical Resume Data (v3)
export const MASTER_RESUME_DATA: ResumeData = {
  id: "resume-canonical",
  versionId: "v3",
  branchId: "main",
  profile: INITIAL_PROFILE,
  summary: {
    text: "Versatile Software Engineer with 4+ years of experience designing scalable distributed microservices, low-latency API architectures, and applied machine learning pipelines. Strong foundation in event-driven systems (Kafka, gRPC), container orchestration (Kubernetes), and relational database optimization.",
    toneFocus: "General Systems & Full-Stack",
    highlights: ["High-throughput distributed systems", "Applied ML & LLM pipelines", "Cloud architecture (AWS/GCP)"]
  },
  experience: [
    {
      id: "exp-101",
      company: "Apex Cloud Technologies",
      role: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2023-01",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected and deployed a multi-tenant event ingestion pipeline using Go, Kafka, and PostgreSQL, processing 45,000+ events/sec with sub-50ms p99 latency.",
        "Engineered automated failover and distributed rate-limiting across 12 microservices, improving platform availability from 99.9% to 99.99%.",
        "Mentored 4 junior engineers, instituted RFC design doc workflows, and led weekly systems architecture reviews."
      ],
      techStack: ["Go", "Kafka", "PostgreSQL", "Kubernetes", "Redis", "Docker"],
      domain: "Distributed Systems & Cloud Ingestion"
    },
    {
      id: "exp-102",
      company: "Nexus Labs",
      role: "Software Engineer — Backend & Systems",
      location: "San Jose, CA",
      startDate: "2021-06",
      endDate: "2022-12",
      current: false,
      bullets: [
        "Developed high-throughput gRPC and RESTful services in Python (FastAPI) and Java (Spring Boot) for financial ledger reconciliations.",
        "Refactored complex PostgreSQL query execution plans and introduced composite indexing, reducing average ledger audit query time by 64%.",
        "Constructed comprehensive CI/CD pipelines via GitHub Actions and Terraform for zero-downtime blue/green deployments on AWS ECS."
      ],
      techStack: ["Python", "FastAPI", "Java", "Spring Boot", "PostgreSQL", "AWS ECS", "Terraform"],
      domain: "FinTech & Transaction Systems"
    },
    {
      id: "exp-103",
      company: "Veritas AI",
      role: "Machine Learning Engineering Intern",
      location: "Berkeley, CA",
      startDate: "2020-05",
      endDate: "2020-08",
      current: false,
      bullets: [
        "Built distributed data preprocessing workers using Ray and PySpark, decreasing training data staging time by 40%.",
        "Fine-tuned Transformer models (BERT/RoBERTa) for semantic document classification with PyTorch, achieving 94.2% F1 score."
      ],
      techStack: ["Python", "PyTorch", "Transformers", "Ray", "Docker"],
      domain: "Machine Learning & NLP"
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science in Computer Science",
      fieldOfStudy: "Computer Science (Systems & Intelligent Machines)",
      location: "Berkeley, CA",
      startDate: "2017-08",
      endDate: "2021-05",
      gpa: "3.84 / 4.00",
      honors: ["Dean's Honors List (6 semesters)", "Upsilon Pi Epsilon Honor Society"],
      coursework: ["Distributed Systems (CS162)", "Database Systems (CS186)", "Algorithms & Complexity (CS170)", "Machine Learning (CS189)", "Computer Security (CS161)"]
    }
  ],
  projects: [
    {
      id: "proj-101",
      name: "ChronosDB — Distributed Raft-Based Key-Value Store",
      tagline: "Lightweight distributed consensus storage engine written in Go",
      role: "Creator & Lead Developer",
      url: "https://chronosdb.dev",
      githubUrl: "https://github.com/alexrivera/chronos-db",
      startDate: "2023-04",
      endDate: "2023-11",
      bullets: [
        "Implemented the complete Raft consensus algorithm in Go including leader election, log replication, and dynamic cluster membership changes.",
        "Built a write-ahead log (WAL) and memory-mapped LSM storage layer capable of sustaining 120k read QPS with ACID durability guarantees.",
        "Tested under harsh network partitions and Byzantine node failure simulations using Jepsen-style automated chaos testing suites."
      ],
      techStack: ["Go", "Raft", "LSM-Tree", "gRPC", "Protobuf", "Docker"],
      metrics: ["120k Read QPS", "99.999% consistency under network splits"]
    },
    {
      id: "proj-102",
      name: "VectorFlow — Approximate Nearest Neighbor Search Engine",
      tagline: "High-performance vector indexing library with HNSW graph indexing",
      role: "Lead Author",
      url: "https://vectorflow.io",
      githubUrl: "https://github.com/alexrivera/vector-flow",
      startDate: "2023-09",
      endDate: "2024-02",
      bullets: [
        "Developed an HNSW vector indexing algorithm in C++ and Python bindings with SIMD AVX-512 acceleration.",
        "Benchmarked against Faiss and Annoy; achieved 98.6% recall at 1,400 queries per second across 1M 768-dimensional embeddings.",
        "Integrated FastAPI serving endpoint with asynchronous batching for production embedding retrieval."
      ],
      techStack: ["C++20", "Python", "SIMD AVX-512", "FastAPI", "HNSW", "PyTorch"],
      metrics: ["98.6% recall", "1.4k QPS @ 1M embeddings"]
    },
    {
      id: "proj-103",
      name: "ResumeFlow — Semantic Document Evolution Engine",
      tagline: "Structured version-control framework for professional document evolution",
      role: "Creator",
      url: "https://resumeflow.dev",
      githubUrl: "https://github.com/alexrivera/resumeflow",
      startDate: "2024-03",
      endDate: "Present",
      bullets: [
        "Devised a graph-based semantic diff algorithm identifying 4 distinct levels of professional document evolution.",
        "Integrated LLM grounding verification with zero-hallucination guardrails for explainable incremental CV optimization."
      ],
      techStack: ["TypeScript", "React", "Node.js", "Express", "Tailwind CSS", "Gemini API"],
      metrics: ["4-level semantic diffing", "100% grounded suggestions"]
    }
  ],
  skillCategories: [
    {
      id: "skills-lang",
      categoryName: "Programming Languages",
      skills: [
        { name: "Go", level: "Expert", verifiedEvidence: "Apex Cloud ingestion engine (exp-101), ChronosDB (proj-101)" },
        { name: "Python", level: "Expert", verifiedEvidence: "Nexus Labs (exp-102), VectorFlow (proj-102), Veritas AI (exp-103)" },
        { name: "TypeScript / JavaScript", level: "Proficient", verifiedEvidence: "ResumeFlow (proj-103)" },
        { name: "Java", level: "Proficient", verifiedEvidence: "Nexus Labs financial ledger (exp-102)" },
        { name: "C++", level: "Familiar", verifiedEvidence: "VectorFlow SIMD kernels (proj-102)" },
        { name: "SQL", level: "Expert", verifiedEvidence: "PostgreSQL query plan optimization across exp-101, exp-102" }
      ]
    },
    {
      id: "skills-backend",
      categoryName: "Backend & Systems Infrastructure",
      skills: [
        { name: "Distributed Systems & Raft", level: "Expert", verifiedEvidence: "ChronosDB (proj-101)" },
        { name: "Apache Kafka", level: "Expert", verifiedEvidence: "Apex Cloud 45k events/sec pipeline (exp-101)" },
        { name: "PostgreSQL & Redis", level: "Expert", verifiedEvidence: "Apex Cloud (exp-101), Nexus Labs (exp-102)" },
        { name: "gRPC & Protocol Buffers", level: "Expert", verifiedEvidence: "Nexus Labs (exp-102), ChronosDB (proj-101)" },
        { name: "RESTful API Design", level: "Expert", verifiedEvidence: "Nexus Labs (exp-102)" },
        { name: "Docker & Kubernetes", level: "Proficient", verifiedEvidence: "Apex Cloud (exp-101), ChronosDB (proj-101)" }
      ]
    },
    {
      id: "skills-ai",
      categoryName: "AI, Machine Learning & Search",
      skills: [
        { name: "PyTorch & Transformers", level: "Proficient", verifiedEvidence: "Veritas AI (exp-103)" },
        { name: "Vector Databases & HNSW", level: "Proficient", verifiedEvidence: "VectorFlow (proj-102)" },
        { name: "LLM Orchestration & Prompting", level: "Proficient", verifiedEvidence: "ResumeFlow (proj-103)" },
        { name: "Ray Distributed Compute", level: "Familiar", verifiedEvidence: "Veritas AI (exp-103)" }
      ]
    },
    {
      id: "skills-cloud",
      categoryName: "Cloud & DevOps",
      skills: [
        { name: "AWS (ECS, S3, RDS, CloudWatch)", level: "Proficient", verifiedEvidence: "Nexus Labs (exp-102)" },
        { name: "Terraform (IaC)", level: "Proficient", verifiedEvidence: "Nexus Labs (exp-102)" },
        { name: "CI/CD (GitHub Actions)", level: "Expert", verifiedEvidence: "Apex Cloud & Nexus Labs" }
      ]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      issueDate: "2023-08",
      expiryDate: "2026-08",
      credentialId: "AWS-SAA-839210",
      credentialUrl: "https://aws.amazon.com/verification"
    },
    {
      id: "cert-2",
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "Cloud Native Computing Foundation (CNCF)",
      issueDate: "2023-11",
      expiryDate: "2026-11",
      credentialId: "CKA-994821"
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "1st Place – CalHacks 8.0 (Distributed Infrastructure Track)",
      description: "Built decentralized checkpoint sync protocol across 250 test nodes under 36 hours.",
      date: "2021-11",
      metric: "Top 1 / 400+ teams"
    },
    {
      id: "ach-2",
      title: "Apex Cloud Engineering Excellence Award",
      description: "Recognized for zero-outage migration of Kafka streaming cluster with zero data loss.",
      date: "2023-12"
    }
  ],
  publications: [
    {
      id: "pub-1",
      title: "Empirical Analysis of SIMD Vectorization in Hierarchical Navigable Small World Graphs",
      publisher: "IEEE High-Performance Systems Workshop (Poster)",
      date: "2024-01",
      url: "https://doi.org/10.1109/HPSW.2024.1029",
      authors: ["Alex M. Rivera", "Elena Rostova", "Prof. David Chen"]
    }
  ],
  sectionOrder: ["summary", "experience", "projects", "skills", "education", "certifications", "achievements", "publications"],
  visibleSections: {
    summary: true,
    experience: true,
    projects: true,
    skills: true,
    education: true,
    certifications: true,
    achievements: true,
    publications: true
  }
};

// Specialized Backend Branch Resume Data (v4-backend)
export const BACKEND_RESUME_DATA: ResumeData = {
  ...MASTER_RESUME_DATA,
  branchId: "backend-eng",
  versionId: "v4-backend",
  summary: {
    text: "Backend & Systems Infrastructure Engineer with 4+ years building mission-critical distributed services, Raft consensus engines, and real-time Kafka pipelines. Specialized in sub-millisecond p99 latency optimization, fault-tolerant concurrency in Go/Python, and deep PostgreSQL internals.",
    toneFocus: "Distributed Systems & Backend Heavy",
    highlights: ["45k event/sec Kafka pipelines", "Raft consensus implementation in Go", "PostgreSQL query tuning (-64% latency)"]
  },
  experience: [
    {
      ...MASTER_RESUME_DATA.experience[0],
      bullets: [
        "Architected and deployed a multi-tenant event ingestion pipeline using Go, Kafka, and PostgreSQL, processing 45,000+ events/sec with sub-50ms p99 latency.",
        "Engineered distributed rate-limiting using Redis token buckets and dynamic backpressure, eliminating downstream cascading outages.",
        "Built automated failover with health-probe routing across 12 Kubernetes microservices, achieving 99.99% system SLA."
      ]
    },
    {
      ...MASTER_RESUME_DATA.experience[1],
      bullets: [
        "Developed high-throughput gRPC and RESTful services in Python (FastAPI) and Java (Spring Boot) for real-time ledger settlement.",
        "Refactored complex PostgreSQL query execution plans, partitioned historical transaction tables, and introduced composite indexes, reducing audit query time by 64%.",
        "Created blue/green zero-downtime deployment pipelines using Terraform and AWS ECS with automated rollbacks."
      ]
    },
    MASTER_RESUME_DATA.experience[2]
  ],
  projects: [
    MASTER_RESUME_DATA.projects[0], // ChronosDB first
    {
      ...MASTER_RESUME_DATA.projects[1],
      tagline: "High-performance vector retrieval engine with C++ SIMD AVX-512 kernels and gRPC microservice",
      bullets: [
        "Engineered multi-threaded C++ vector index with AVX-512 vectorization, achieving 1,400 QPS at 98.6% recall.",
        "Designed asynchronous gRPC RPC interface with zero-copy buffer serialization for backend query clients."
      ]
    },
    MASTER_RESUME_DATA.projects[2]
  ]
};

// Specialized AI/ML Branch Resume Data (v5-aiml)
export const AIML_RESUME_DATA: ResumeData = {
  ...MASTER_RESUME_DATA,
  branchId: "aiml-specialist",
  versionId: "v5-aiml",
  summary: {
    text: "Applied AI & ML Infrastructure Engineer with expertise in Transformer fine-tuning, large-scale vector search (HNSW/SIMD), and low-latency LLM serving pipelines. Proven track record deploying PyTorch models, embedding retrievers, and evaluation frameworks for production systems.",
    toneFocus: "Applied AI, LLMs & Vector Retrieval",
    highlights: ["HNSW vector index (1.4k QPS @ 1M embeddings)", "Transformer fine-tuning (94.2% F1)", "Explainable AI & Grounding validation"]
  },
  projects: [
    MASTER_RESUME_DATA.projects[1], // VectorFlow first
    MASTER_RESUME_DATA.projects[2], // ResumeFlow second
    MASTER_RESUME_DATA.projects[0]  // ChronosDB third
  ],
  experience: [
    {
      ...MASTER_RESUME_DATA.experience[2], // Put ML Intern at top or enriched
      role: "Applied Machine Learning Engineer (Contract & Research)",
      bullets: [
        "Engineered distributed model training workflows using PyTorch, Ray, and Transformers; reduced pipeline runtime by 40%.",
        "Fine-tuned Transformer models (BERT/RoBERTa) for multi-label semantic document classification with 94.2% F1 score.",
        "Implemented vector quantization techniques reducing model embedding memory footprint by 50% with <1% accuracy loss."
      ]
    },
    MASTER_RESUME_DATA.experience[0],
    MASTER_RESUME_DATA.experience[1]
  ]
};

// Initial Branches
export const INITIAL_BRANCHES: ResumeBranch[] = [
  {
    id: "main",
    name: "main",
    displayName: "Master (Canonical)",
    color: "#6366f1", // Indigo
    description: "The single source of truth containing all verified skills, projects, and work history.",
    targetRole: "Full-Stack & Distributed Systems",
    headVersionId: "v3",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-02-15T14:30:00Z",
    isDefault: true
  },
  {
    id: "backend-eng",
    name: "backend-eng",
    displayName: "Backend & Systems",
    color: "#06b6d4", // Cyan
    description: "Tailored for distributed systems, Go/Kafka pipelines, concurrency, and database engineering roles.",
    targetRole: "Staff / Senior Backend Engineer",
    baseBranchId: "main",
    headVersionId: "v4-backend",
    createdAt: "2026-01-18T10:15:00Z",
    updatedAt: "2026-02-20T16:45:00Z"
  },
  {
    id: "aiml-specialist",
    name: "aiml-specialist",
    displayName: "AI / ML Infrastructure",
    color: "#ec4899", // Pink / Fuchsia
    description: "Emphasizes vector search (HNSW/SIMD), PyTorch, Transformer fine-tuning, and LLM orchestration.",
    targetRole: "Machine Learning & AI Platform Engineer",
    baseBranchId: "main",
    headVersionId: "v5-aiml",
    createdAt: "2026-01-22T11:00:00Z",
    updatedAt: "2026-02-24T09:20:00Z"
  },
  {
    id: "data-platform",
    name: "data-platform",
    displayName: "Data Platform & Cloud",
    color: "#10b981", // Emerald
    description: "Focuses on big data streaming, Kafka event buses, Raft consensus, and cloud orchestration.",
    targetRole: "Data Infrastructure Engineer",
    baseBranchId: "main",
    headVersionId: "v3",
    createdAt: "2026-02-01T14:00:00Z",
    updatedAt: "2026-02-10T12:00:00Z"
  }
];

// Initial Version History Graph Commits
export const INITIAL_VERSIONS: ResumeVersion[] = [
  {
    id: "v1",
    branchId: "main",
    parentVersionIds: [],
    timestamp: "2026-01-10T08:00:00Z",
    author: "Alex Rivera",
    commitMessage: "Initial commit of canonical master resume",
    changeSummary: ["Created baseline structured schema", "Added education at UC Berkeley", "Added Nexus Labs work history"],
    changeCategory: "initial",
    resumeData: MASTER_RESUME_DATA,
    tags: ["baseline"]
  },
  {
    id: "v2",
    branchId: "main",
    parentVersionIds: ["v1"],
    timestamp: "2026-01-25T17:20:00Z",
    author: "Alex Rivera",
    commitMessage: "Add Apex Cloud senior engineer experience & ChronosDB project",
    changeSummary: ["Added Apex Cloud Senior Engineer role", "Added ChronosDB Raft project (proj-101)", "Added Go and Kafka skills"],
    changeCategory: "feat",
    resumeData: MASTER_RESUME_DATA,
    tags: []
  },
  {
    id: "v3",
    branchId: "main",
    parentVersionIds: ["v2"],
    timestamp: "2026-02-15T14:30:00Z",
    author: "Alex Rivera",
    commitMessage: "Add CKA certification and VectorFlow HNSW publication",
    changeSummary: ["Added CKA Kubernetes Certification", "Added IEEE HNSW Vector Index publication (pub-1)", "Updated skill evidence anchors"],
    changeCategory: "feat",
    resumeData: MASTER_RESUME_DATA,
    tags: ["v3-release", "stable"]
  },
  {
    id: "v4-backend",
    branchId: "backend-eng",
    parentVersionIds: ["v2"],
    timestamp: "2026-02-20T16:45:00Z",
    author: "Alex Rivera",
    commitMessage: "Tune summary and bullet points for high-throughput backend roles",
    changeSummary: ["Rewrote summary emphasizing Raft & sub-ms latency", "Enriched Apex Cloud bullets with Redis rate-limiting metrics", "Prioritized ChronosDB over VectorFlow"],
    changeCategory: "refactor",
    resumeData: BACKEND_RESUME_DATA,
    tags: ["backend-v1"]
  },
  {
    id: "v5-aiml",
    branchId: "aiml-specialist",
    parentVersionIds: ["v3"],
    timestamp: "2026-02-24T09:20:00Z",
    author: "Alex Rivera",
    commitMessage: "AI-assisted optimization for ML platform roles (HNSW & Transformers)",
    changeSummary: ["Promoted Veritas AI experience with Ray/PyTorch details", "Prioritized VectorFlow HNSW engine at top of projects", "Updated summary for applied AI & vector search"],
    changeCategory: "ai-opt",
    resumeData: AIML_RESUME_DATA,
    tags: ["aiml-v1"]
  }
];

// Preloaded Sample Job Descriptions for instant ATS testing
export const SAMPLE_JOB_DESCRIPTIONS = [
  {
    id: "jd-stripe",
    company: "Stripe",
    title: "Senior Infrastructure Engineer — Distributed Data & Kafka",
    location: "San Francisco / Remote",
    experienceLevel: "Senior (4+ years)",
    rawText: `About the Role:
Stripe builds economic infrastructure for the internet. We are seeking a Senior Infrastructure Engineer to design, scale, and operate our distributed streaming and transactional data systems.

Responsibilities:
- Scale our mission-critical Apache Kafka and event streaming pipelines handling millions of financial events per second.
- Build fault-tolerant distributed consensus layers, partitioned databases, and zero-downtime ledger services.
- Optimize sub-millisecond p99 latencies across our Go and gRPC microservice ecosystem.
- Collaborate with database engineers on PostgreSQL query optimization, connection pooling, and multi-region replication.
- Lead architecture design reviews and champion reliability engineering practices.

Requirements:
- 4+ years of professional experience building high-throughput distributed systems.
- Strong proficiency in Go, Java, or C++ with deep understanding of concurrency, memory management, and asynchronous I/O.
- Hands-on expertise with Apache Kafka, distributed consensus algorithms (Raft, Paxos), and event-driven architectures.
- Experience tuning relational databases like PostgreSQL (indexing, query execution plans, vacuuming).
- Familiarity with Kubernetes, Docker, and infrastructure-as-code (Terraform).
- Passion for zero-downtime deployments and resilience engineering.`
  },
  {
    id: "jd-anthropic",
    company: "Anthropic",
    title: "AI Platform Engineer — LLM Infrastructure & Retrieval",
    location: "San Francisco, CA",
    experienceLevel: "Mid-Senior (3+ years)",
    rawText: `About Anthropic:
Anthropic is an AI safety and research company building reliable, beneficial AI systems like Claude.

The Role:
We are looking for an AI Platform Engineer to build scalable model serving, vector retrieval, and inference acceleration infrastructure for next-generation foundation models.

Key Responsibilities:
- Build low-latency vector search indices and retrieval systems utilizing HNSW, SIMD vectorization, and distributed caching.
- Optimize model evaluation pipelines and training data preprocessing using PyTorch and Ray.
- Design resilient API gateways and streaming LLM endpoints with grounding validation and safety verification.
- Benchmark and tune Transformer model inference across CPU/GPU clusters.

Qualifications:
- Solid experience in Python and C++ / Rust for performance-critical ML infrastructure.
- In-depth understanding of vector search algorithms (HNSW, Annoy, Faiss) and embedding spaces.
- Hands-on experience with PyTorch, Hugging Face Transformers, and distributed compute frameworks (Ray, Spark).
- Knowledge of LLM orchestration, prompt engineering, and semantic document analysis.
- B.S. or M.S. in Computer Science, Machine Learning, or related technical field.`
  },
  {
    id: "jd-linear",
    company: "Linear",
    title: "Full-Stack Product Systems Engineer",
    location: "Remote (Global)",
    experienceLevel: "Mid-Senior",
    rawText: `About Linear:
Linear is a purpose-built tool for planning and building products. We value craftsmanship, incredible speed, and thoughtful developer tooling.

What you'll do:
- Design real-time collaborative workspace features with local-first syncing and offline state persistence.
- Build sleek, high-performance web applications using React, TypeScript, Tailwind CSS, and WebSockets.
- Develop robust backend API services in Node.js and Go with PostgreSQL data modeling.
- Own features end-to-end from conceptualization to deployment with attention to UI nuance and developer experience.

Requirements:
- Strong experience with modern TypeScript, React, and server-side APIs (Node.js/Go).
- Experience designing responsive, accessible, and fast user interfaces.
- Familiarity with database schema migrations, caching, and state synchronization.
- An eye for detail and high standards for software craftsmanship.`
  }
];

// Preloaded Applications for Tracker
export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: "app-1",
    company: "Stripe",
    role: "Senior Infrastructure Engineer",
    location: "San Francisco, CA",
    salaryRange: "$195,000 - $235,000",
    jobDescriptionId: "jd-stripe",
    resumeBranchId: "backend-eng",
    resumeVersionId: "v4-backend",
    appliedDate: "2026-02-21",
    status: "Interview",
    notes: "Completed Technical Screen on Kafka partition rebalancing; invited to Virtual Onsite focusing on Raft consensus & distributed systems design.",
    matchScore: 94,
    timeline: [
      { status: "Applied", date: "2026-02-21", note: "Submitted customized backend-eng (v4) resume." },
      { status: "Screening", date: "2026-02-23", note: "Recruiter screen passed; highlighted ChronosDB project." },
      { status: "Interview", date: "2026-02-27", note: "Technical architecture round scheduled." }
    ]
  },
  {
    id: "app-2",
    company: "Anthropic",
    role: "AI Platform Engineer",
    location: "San Francisco, CA",
    salaryRange: "$200,000 - $250,000",
    jobDescriptionId: "jd-anthropic",
    resumeBranchId: "aiml-specialist",
    resumeVersionId: "v5-aiml",
    appliedDate: "2026-02-24",
    status: "Online Assessment",
    notes: "VectorFlow HNSW project directly aligned with their vector retrieval team requirements. Received systems coding challenge.",
    matchScore: 91,
    timeline: [
      { status: "Applied", date: "2026-02-24", note: "Submitted aiml-specialist (v5) resume with HNSW SIMD research." },
      { status: "Online Assessment", date: "2026-02-26", note: "Received 90-min systems algorithm assessment." }
    ]
  },
  {
    id: "app-3",
    company: "Datadog",
    role: "Distributed Ingestion Engineer",
    location: "New York / Remote",
    salaryRange: "$180,000 - $215,000",
    resumeBranchId: "backend-eng",
    resumeVersionId: "v4-backend",
    appliedDate: "2026-02-18",
    status: "Offer",
    notes: "Received official written offer ($210k base + equity). Outstanding feedback on the 45k event/sec Kafka ingestion architecture.",
    matchScore: 89,
    timeline: [
      { status: "Applied", date: "2026-02-18", note: "Applied with Backend branch." },
      { status: "Screening", date: "2026-02-19", note: "Phone screening." },
      { status: "Interview", date: "2026-02-23", note: "Onsite technical panel completed." },
      { status: "Offer", date: "2026-02-26", note: "Offer extended! Decision deadline March 8." }
    ]
  },
  {
    id: "app-4",
    company: "Linear",
    role: "Full-Stack Product Systems Engineer",
    location: "Remote",
    salaryRange: "$175,000 - $210,000",
    jobDescriptionId: "jd-linear",
    resumeBranchId: "main",
    resumeVersionId: "v3",
    appliedDate: "2026-02-16",
    status: "Screening",
    notes: "Applied with Master Canonical resume highlighting TypeScript & Go craftsmanship.",
    matchScore: 87,
    timeline: [
      { status: "Applied", date: "2026-02-16", note: "Applied via referral." },
      { status: "Screening", date: "2026-02-22", note: "Founder chat scheduled." }
    ]
  }
];
