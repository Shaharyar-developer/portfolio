export const about = {
  name: "M. Shaharyar",
  title:
    "Founding Engineer | Real-Time Systems, Applied AI & Product Architecture",
  tagline:
    "I build technically demanding products end to end, from real-time collaboration and semantic search to AI-native SaaS workflows and developer infrastructure.",
  location: "Pakistan",
  availability:
    "Available for remote founding engineer, product engineer, applied AI, and contract-to-hire roles",
  contact: {
    email: "shaharyar321321@gmail.com",
    website: "https://shaharyar.dev",
    "cal.com": "https://cal.com/shaharyar-dev",
    github: "https://github.com/Shaharyar-developer",
    linkedin: "https://www.linkedin.com/in/rm-shaharyar/",
  },
  hero_cta: [
    {
      label: "View Resume",
      href: "/resume.pdf",
    },
  ],
  value_proposition: {
    headline: "Founding engineer who ships complex systems",
    subheadline:
      "I work across product, architecture, backend systems, infrastructure, and UX to turn ambiguous requirements into reliable shipped software.",
    proof_points: [
      "Built Novus Atlas, a collaborative writing platform serving 1,000+ beta users",
      "Engineered an OT-based editor supporting 500+ concurrent collaborators at <80 ms p95 sync latency",
      "Designed Rust-powered semantic search infrastructure indexing 5M+ searchable chunks",
      "Built Kicklayer, a multi-tenant SaaS for structured onboarding, secure credential exchange, and AI-assisted workflows",
    ],
  },
  highlights: [
    "Built and operated production platforms end to end as a sole engineer",
    "Designed real-time collaborative infrastructure using Operational Transformation",
    "Built semantic search and content-analysis pipelines with Rust, Qdrant, PostgreSQL, and embeddings",
    "Shipped multi-tenant SaaS workflows with authentication, audit trails, secure file handling, billing, and automation",
    "Created OpenOT, an open-source Operational Transformation framework for collaborative editors",
  ],
  experience: [
    {
      role: "Founder & Lead Engineer",
      organization: "Novus Atlas (NOVA)",
      period: "June 2024 - Present",
      type: "Startup",
      description:
        "Built and operated a collaborative writing platform for long-form fiction writers, combining real-time editing, semantic discovery, and branch-based content workflows.",
      achievements: [
        "Served 1,000+ beta users as the sole engineer responsible for architecture, implementation, infrastructure, deployment, and technical documentation",
        "Engineered real-time collaborative editing with Operational Transformation, WebSockets, presence, autosave, optimistic sync, and offline-resilient recovery",
        "Sustained 500+ concurrent collaborators at <80 ms p95 synchronization latency",
        "Designed Rust-powered semantic search and content-analysis pipelines using Qdrant, PostgreSQL, vector embeddings, and LLM-assisted processing",
        "Indexed 5M+ searchable content chunks with <150 ms p95 retrieval latency",
        "Created Git-style branch-based version control for fiction and collaborative revision workflows",
      ],
      tech: [
        "TypeScript",
        "Next.js",
        "Rust",
        "PostgreSQL",
        "Redis",
        "Qdrant",
        "BullMQ",
        "Socket.IO",
        "WebSockets",
        "Cloudflare R2",
      ],
    },
    {
      role: "Founder & Lead Engineer",
      organization: "Kicklayer",
      period: "2026 - Present",
      type: "SaaS",
      description:
        "Built a multi-tenant client-onboarding platform for agencies, replacing scattered email, chat, and Drive handoffs with structured workflows.",
      achievements: [
        "Designed schema-driven onboarding with conditional logic, progress tracking, file validation, version history, reminders, exports, and audit trails",
        "Built secure client infrastructure with passwordless authentication, AES-256-GCM credential storage, secret detection, token revocation, and access logs",
        "Integrated AI-assisted asset verification, onboarding analysis, project brief generation, and delay-risk detection",
        "Implemented subscription enforcement, usage metering, feature gating, and billing workflows",
        "Reduced onboarding follow-up workload by 61% and shortened asset-collection timelines by 54%",
      ],
      tech: [
        "TypeScript",
        "Next.js",
        "PostgreSQL",
        "Workflow Automation",
        "Secure File Processing",
        "AES-256-GCM",
        "AI Workflows",
        "Audit Logging",
      ],
    },
  ],
  featured_projects: [
    {
      id: "nova",
      name: "Novus Atlas (NOVA)",
      type: "Production Platform",
      tagline: "Collaborative writing platform built from scratch",
      description:
        "A collaborative writing ecosystem with real-time editing, branch-based story versioning, semantic content discovery, and AI-assisted analysis.",
      problem:
        "Long-form fiction writers need better tools for collaboration, versioning, search, and large-project navigation.",
      solution:
        "Built an end-to-end platform combining Operational Transformation, semantic search, Rust-powered analysis pipelines, and product-specific authoring workflows.",
      impact: [
        "1,000+ beta users",
        "500+ concurrent collaborators sustained at <80 ms p95 sync latency",
        "5M+ searchable content chunks indexed",
        "Rust-powered semantic analysis and vector search infrastructure",
      ],
      tech: [
        "Next.js",
        "React",
        "TypeScript",
        "Rust",
        "PostgreSQL",
        "Redis",
        "Qdrant",
        "WebSockets",
        "Socket.IO",
      ],
      links: {
        case_study: "/projects/nova",
      },
      lessons_learned: [
        "I scoped the platform into independently deployable modules to keep solo delivery fast without sacrificing reliability.",
        "I designed collaboration flows to degrade gracefully under latency spikes and reconnect scenarios.",
        "I balanced shipping velocity with maintainability by enforcing typed contracts and operational observability from day one.",
        "I validated roadmap decisions with live author feedback loops to avoid over-building features no one needed.",
      ],
    },
    {
      id: "kicklayer",
      name: "Kicklayer",
      type: "Commercial SaaS",
      tagline: "Client onboarding and asset collection platform for agencies",
      description:
        "A structured client-onboarding platform for collecting assets, credentials, briefs, and approvals through secure magic-link portals.",
      problem:
        "Agencies lose delivery time chasing incomplete files, missing credentials, unclear requirements, and scattered client communication.",
      solution:
        "Built a schema-driven intake workflow with passwordless client access, autosave, adaptive reminders, validation checks, secure credential collection, and authenticated export packages.",
      impact: [
        "Reduced onboarding follow-up workload by 61%",
        "Shortened asset-collection timelines by 54%",
        "Passwordless portal with autosave and drag-and-drop uploads",
        "AI-assisted asset checks and auto-generated project briefs",
        "Granular audit logs for views, uploads, rejections, replacements, and exports",
      ],
      tech: [
        "TypeScript",
        "Next.js",
        "PostgreSQL",
        "Workflow Automation",
        "Secure File Processing",
        "AES-256-GCM",
        "Audit Logging",
        "AI Workflows",
      ],
      links: {
        website: "https://kicklayer.com",
      },
      lessons_learned: [
        "Reducing client friction at the point of submission drives more value than adding configuration complexity too early.",
        "Structured intake schemas outperform free-form requests for downstream design and engineering quality.",
        "Auditability and visible status tracking eliminate avoidable coordination loops between teams and clients.",
      ],
    },
    {
      id: "open-ot",
      name: "OpenOT",
      type: "Open Source Library",
      tagline: "Operational Transformation engine for real-time collaboration",
      description:
        "Framework-agnostic OT engine for collaborative editors, built with state-machine transforms, pluggable transports, storage adapters, and React/Lexical integration paths.",
      tech: [
        "TypeScript",
        "WebSockets",
        "SSE",
        "Operational Transformation",
        "React",
        "Lexical",
      ],
      links: {
        github: "https://github.com/Shaharyar-developer/open-ot",
        case_study: "/projects/open-ot",
      },
      status: "Active development",
    },
    {
      id: "architect",
      name: "The Architect Engine",
      type: "AI-Native Product",
      tagline:
        "Structured narrative engine with model routing and persistent state",
      description:
        "An AI-native interactive narrative platform featuring adaptive story interviews, typed structured generation, branching scenarios, persistent chronicles, retry pipelines, and model routing.",
      tech: [
        "TypeScript",
        "LLM Orchestration",
        "Structured Generation",
        "Model Routing",
        "Prompt Architecture",
        "Persistent State",
      ],
      links: {
        website: "https://architect.novusatlas.org",
      },
      status: "Implemented",
    },
  ],
  writing: [
    {
      title: "NOVA Design Philosophy",
      url: "https://codex.novusatlas.org/blog/nova-design-philosophy",
      description: "How I approached building a platform for creative writers",
    },
    {
      title: "A Technical Introspect into the Quality Checker",
      url: "https://codex.novusatlas.org/blog/a-technical-introspect-to-the-quality-checker",
      description: "Deep dive into AI-powered content quality analysis",
    },
    {
      title: "Core Concepts of Operational Transformations",
      url: "https://open-ot.shaharyar.dev/docs/concepts",
      description: "Understanding the theory behind real-time collaboration",
    },
  ],
  technical_expertise: {
    languages: ["TypeScript", "JavaScript", "Rust", "Python", "SQL"],
    frameworks: ["Next.js", "React", "Hono", "Node.js", "tRPC", "oRPC"],
    databases: ["PostgreSQL", "Qdrant", "Redis", "MySQL"],
    specializations: [
      "Real-time collaborative systems",
      "Operational Transformation",
      "Distributed synchronization",
      "Semantic search and vector embeddings",
      "AI-native workflows and LLM orchestration",
      "Rust-powered NLP and content-analysis pipelines",
      "Secure multi-tenant SaaS architecture",
      "Product-focused full-stack engineering",
    ],
    industries: [
      "AI Infrastructure",
      "Collaborative Tools",
      "Developer Tools",
      "Workflow Automation",
      "Content and Publishing Platforms",
      "B2B SaaS",
    ],
  },
  testimonials: [],
  cta: {
    headline: "Need an engineer who can own hard problems?",
    subheadline:
      "I am available for remote founding engineer, product engineering, applied AI, and contract-to-hire roles where technical ownership matters.",
    primary_action: {
      label: "View Resume",
      href: "/resume.pdf",
    },
    secondary_action: {
      label: "View Case Studies",
      href: "#projects",
    },
  },
  resume: "/resume.pdf",
};

export const services = {
  headline: "Work With Me",
  intro:
    "I work with startups and technical teams that need high-ownership engineering across product, backend architecture, AI workflows, and production delivery.",
  offerings: [
    {
      name: "Contract Product Engineering",
      tagline: "Hands-on product and platform delivery",
      category: "ongoing",
      engagement_model: "Flexible contract or contract-to-hire",
      description:
        "I integrate with your team to design, build, and ship critical product work across frontend, backend, infrastructure, and AI workflows.",
      what_you_get: [
        "Feature ownership from architecture through release",
        "System design and implementation for high-impact roadmap items",
        "Backend, frontend, and infrastructure delivery",
        "Production hardening, observability, and performance tuning",
        "Clear async communication with practical technical documentation",
      ],
      time_commitment: "Weekly delivery cadence with async collaboration",
      best_for: [
        "Startups that need immediate engineering bandwidth",
        "Teams shipping technically complex roadmap milestones",
        "Products that need reliable execution without long hiring cycles",
      ],
      button_text: "Discuss Contract Work",
      badge: "Most Relevant",
    },
    {
      name: "Applied AI Implementation",
      tagline: "LLM workflows that ship as product features",
      category: "project",
      engagement_model: "Scoped implementation or ongoing build support",
      description:
        "I design and implement AI-assisted workflows, structured generation systems, model-routing logic, semantic search, and production-ready LLM integrations.",
      what_you_get: [
        "Prompt architecture and typed output contracts",
        "Model routing, retries, fallbacks, and validation pipelines",
        "Semantic search and retrieval workflows",
        "Cost and latency optimization for AI features",
        "Integration into existing product and backend systems",
      ],
      time_commitment: "Scoped by product surface",
      best_for: [
        "Teams adding AI features to real products",
        "Founders who need practical implementation rather than prototypes",
        "Products where reliability, cost, and UX matter",
      ],
      button_text: "Discuss AI Implementation",
    },
    {
      name: "Real-Time Systems & Collaboration",
      tagline: "Collaborative features, synchronization, and live workflows",
      category: "project",
      engagement_model: "Scoped build or architecture support",
      description:
        "I help teams design and implement real-time collaboration, WebSocket systems, presence, syncing, offline recovery, and editor infrastructure.",
      what_you_get: [
        "Architecture for live collaboration and synchronization",
        "Operational Transformation or related collaboration logic",
        "Presence, cursors, autosave, reconnect, and recovery flows",
        "Performance testing and correctness validation",
        "Integration with existing frontend and backend systems",
      ],
      time_commitment: "Project-based or ongoing",
      best_for: [
        "Products adding collaborative editing or live workflows",
        "Teams struggling with sync correctness or latency",
        "Developer tools, editors, dashboards, and multiplayer workspaces",
      ],
      button_text: "Discuss Real-Time Systems",
    },
    {
      name: "Build Sprint",
      tagline: "Milestone-based product delivery",
      category: "project",
      engagement_model: "Fixed-scope sprint with clear deliverables",
      description:
        "I take ownership of a clearly scoped product milestone and deliver production-ready output with implementation handoff.",
      what_you_get: [
        "Technical scoping and implementation plan",
        "End-to-end build of agreed sprint deliverables",
        "Deployment support and production-readiness checklist",
        "Post-delivery handoff with documentation and walkthrough",
      ],
      time_commitment: "Defined sprint timeline based on scope",
      best_for: [
        "Teams that need a major feature shipped quickly",
        "Founders moving from concept to working product",
        "Products that need implementation velocity without a full-time hire",
      ],
      button_text: "Plan a Build Sprint",
    },
    {
      name: "Technical Audit",
      tagline: "Architecture and delivery assessment",
      category: "project",
      engagement_model: "One-off technical review",
      description:
        "A focused review of architecture, code quality, performance, and delivery risk with prioritized recommendations your team can execute immediately.",
      what_you_get: [
        "Current-state architecture and codebase review",
        "Delivery bottleneck analysis and remediation plan",
        "Risk assessment with priority-ranked actions",
        "Clear implementation guidance for the next execution cycle",
      ],
      time_commitment: "Short, focused engagement",
      best_for: [
        "Teams inheriting complex codebases",
        "Founders who need a second opinion before scaling",
        "Products experiencing recurring delivery friction",
      ],
      button_text: "Request a Technical Audit",
    },
  ],
  comparison_table: {
    headers: [
      "Capability",
      "Contract Engineering",
      "Applied AI Implementation",
      "Real-Time Systems",
    ],
    rows: [
      {
        feature: "Primary Outcome",
        values: [
          "Shipped product work",
          "Reliable AI-powered workflows",
          "Live collaboration and synchronization",
        ],
      },
      {
        feature: "Hands-on Implementation",
        values: ["High", "High", "High"],
      },
      {
        feature: "Architecture Direction",
        values: [
          "With delivery ownership",
          "Prompt, model, data, and backend design",
          "Sync, latency, correctness, and recovery design",
        ],
      },
      {
        feature: "Best Fit",
        values: [
          "Execution bottlenecks",
          "AI features that must work in production",
          "Collaborative products and live workflows",
        ],
      },
    ],
  },
  process: [
    {
      step: 1,
      title: "Problem Review",
      description:
        "Quick alignment on the product problem, constraints, existing system, and success criteria",
    },
    {
      step: 2,
      title: "Scope & Architecture",
      description:
        "Define the implementation path, tradeoffs, milestones, and delivery cadence",
    },
    {
      step: 3,
      title: "Build & Ship",
      description:
        "Execute with clear updates, practical documentation, and production-focused delivery",
    },
  ],
  faq: [
    {
      q: "Are you looking for full-time roles or contract work?",
      a: "Both. I am open to remote full-time roles, contract-to-hire, and scoped contract work where the technical ownership is meaningful.",
    },
    {
      q: "Do you work with existing teams and codebases?",
      a: "Yes. I can integrate into active products, understand the current system, and take ownership of specific product or infrastructure areas.",
    },
    {
      q: "What kind of work is the strongest fit?",
      a: "Real-time systems, applied AI workflows, semantic search, developer tools, workflow automation, SaaS architecture, and product engineering with end-to-end ownership.",
    },
    {
      q: "How do you handle timezone overlap and communication?",
      a: "I work remotely with structured async updates, clear ownership, and planned overlap windows for high-priority discussions.",
    },
  ],
};
