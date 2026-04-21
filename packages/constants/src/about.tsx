export const about = {
  name: "M. Shaharyar",
  title: "Software Engineer, Product Builder & Technical Advisor",
  tagline:
    "I build production software end-to-end, from contract engineering and product delivery to technical advisory for teams that need senior execution.",
  location: "Pakistan",
  availability:
    "Currently available for contract engineering, advisory & fractional CTO work",
  contact: {
    email: "shaharyar321321@gmail.com",
    website: "https://shaharyar.dev",
    "cal.com": "https://cal.com/shaharyar-dev",
    github: "https://github.com/Shaharyar-developer",
    linkedin: "https://www.linkedin.com/in/shaharyar-muhammad-bbb400298",
  },
  hero_cta: [
    {
      label: "Book a Strategy Call",
      href: "https://cal.com/shaharyar-dev",
    },
    {
      label: "View Services",
      href: "/services",
    },
  ],
  value_proposition: {
    headline: "Senior engineer who ships and leads",
    subheadline:
      "I work across strategy and execution: architecting systems, shipping features, and helping teams deliver reliably under real business constraints.",
    proof_points: [
      "Built a 250k LOC collaborative platform as a solo founder-engineer",
      "Designed and launched Kicklayer for structured client onboarding workflows",
      "1000+ beta users across real-time editing system",
      "Former contractor: INTERPOL (Operation Storm Makers II) anti-human trafficking data analysis",
      "3+ years leading technical operations for national conferences",
    ],
  },
  highlights: [
    "Built and shipped 250k+ LOC across production systems and developer tooling",
    "Contract-ready full-stack execution from architecture through deployment",
    "Designed real-time collaborative infrastructure using Operational Transformation",
    "Built Kicklayer, a live SaaS for structured client asset intake and delivery",
    "3+ years IT Director for national-level conferences (MUN)",
  ],
  experience: [
    {
      role: "Founder & Lead Engineer",
      organization: "Novus Atlas (NOVA)",
      period: "June 2024 - Present",
      type: "Startup",
      description: "Building next-generation collaborative writing platform",
      achievements: [
        "Architected and built 250k LOC platform solo",
        "1000+ authors in closed beta testing",
        "Custom Rust NLP engine for semantic content analysis",
        "Real-time collaborative editor with Operational Transformation",
        "Semantic discovery engine using vector embeddings (Qdrant)",
        "Branch-based version control system for creative content",
      ],
      tech: [
        "TypeScript",
        "Next.js",
        "Rust",
        "PostgreSQL",
        "Qdrant",
        "WebSockets",
      ],
    },
    {
      role: "Data Analysis Contractor",
      organization: "INTERPOL",
      period: "2023-2024",
      type: "Contract",
      description:
        "Anti-human trafficking operations support (Operation Storm Makers II)",
      achievements: [
        "Designed data analysis pipelines for international operations",
        "Processed and analyzed large-scale sensitive datasets",
        "Worked under strict security and confidentiality requirements",
        "Details classified under NDA",
      ],
      tech: ["Python", "Data Analysis", "Secure Systems"],
    },
    {
      role: "IT Director",
      organization: "National Model United Nations Conferences",
      period: "3+ Years",
      type: "Leadership",
      description: "Technical operations for large-scale international events",
      achievements: [
        "Led technical infrastructure for national-level conferences",
        "Managed systems supporting 5000+ participants",
        "Coordinated technical teams under high-pressure environments",
        "Delivered zero-downtime operations across multi-day events",
      ],
      tech: ["Systems Management", "Team Leadership", "Event Tech"],
    },
  ],
  featured_projects: [
    {
      id: "nova",
      name: "Novus Atlas (NOVA)",
      type: "Production Platform",
      tagline: "Collaborative writing platform built from scratch",
      description:
        "A complete creative writing ecosystem with real-time collaboration, AI-powered quality analysis, and semantic content discovery. Designed to replace platforms like Royal Road and Wattpad.",
      problem:
        "Writers need better tools for collaborative creation and discoverability",
      solution:
        "Built end-to-end platform combining real-time editing, semantic search, and worldbuilding knowledge graphs",
      impact: [
        "1000+ authors in closed beta",
        "250k+ lines of production code",
        "Custom Rust NLP engine processing large documents",
        "Real-time collaboration with offline-first architecture",
      ],
      tech: [
        "Next.js",
        "React",
        "TypeScript",
        "Rust (NLP core)",
        "PostgreSQL",
        "Qdrant",
        "WebSockets",
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
        "Kicklayer replaces fragmented email, Slack, and Drive handoffs with a structured, magic-link client portal for collecting validated assets, briefs, and credentials.",
      problem:
        "Agencies lose delivery time chasing incomplete assets and clarifying requirements across scattered channels.",
      solution:
        "Built a schema-driven intake workflow with passwordless client access, adaptive reminders, validation checks, and authenticated export packages.",
      impact: [
        "Production workflow from template definition to authenticated ZIP export",
        "Passwordless portal with autosave and drag-and-drop uploads",
        "AI-assisted asset quality checks and auto-generated project briefs",
        "Granular audit logs for views, uploads, rejections, and replacements",
      ],
      tech: [
        "TypeScript",
        "Next.js",
        "Workflow Automation",
        "Secure File Processing",
        "Audit Logging",
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
        "Production-ready OT framework that powers collaborative editing experiences like Google Docs. Built to be framework-agnostic with pluggable transport and storage layers.",
      tech: ["TypeScript", "WebSockets", "Operational Transformation"],
      links: {
        github: "https://github.com/Shaharyar-developer/open-ot",
        case_study: "/projects/open-ot",
      },
      status: "V1 in active development",
    },
  ],
  writing: [
    {
      title: "NOVA Design Philosophy",
      url: "https://codex.novusatlas.org/blog/nova-design-philosophy",
      description: "How I approached building a platform for creative writers",
    },
    {
      title: "A Technical Introspect to the Quality Checker",
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
    languages: ["TypeScript", "Rust", "Python", "SQL"],
    frameworks: ["Next.js", "React", "Hono", "Node.js", "Electron"],
    databases: ["PostgreSQL", "Qdrant (Vector DB)", "Redis", "MySQL"],
    specializations: [
      "Real-time collaborative systems (OT/CRDT)",
      "Semantic search & NLP pipelines",
      "AI integration (embeddings, quality analysis)",
      "High-performance backend architecture",
      "Product-focused UI/UX engineering",
    ],
    industries: [
      "Content & Publishing Platforms",
      "Collaborative Tools",
      "AI-Powered Applications",
      "Developer Tools",
    ],
  },
  testimonials: [
    // You'll add these as you get clients
    // {
    //   quote: "...",
    //   author: "...",
    //   role: "...",
    //   company: "..."
    // }
  ],
  cta: {
    headline: "Let's Build Something Great",
    subheadline:
      "Whether you need contract engineering, technical advisory, or product leadership, I can help you move from planning to shipped outcomes.",
    primary_action: {
      label: "Schedule a Call",
      href: "https://cal.com/shaharyar-dev",
    },
    secondary_action: {
      label: "View Case Studies",
      href: "#projects",
    },
  },
  resume: "/resume.pdf",
};

export const services = {
  headline: "Build With Me",
  intro:
    "I work as a senior individual contributor, contract partner, and technical advisor. Engagements are scoped around outcomes and delivery velocity, not fixed one-size-fits-all packages.",
  offerings: [
    {
      name: "Contract Engineering",
      tagline: "Hands-on product and platform delivery",
      category: "ongoing",
      engagement_model: "Flexible contract (part-time or full-time)",
      description:
        "I integrate with your team to design, build, and ship critical product work with production-grade quality.",
      what_you_get: [
        "Feature ownership from architecture through release",
        "System design and implementation for high-impact roadmap items",
        "Production hardening, observability, and performance tuning",
        "Clear async communication with practical technical documentation",
      ],
      time_commitment: "Weekly delivery cadence with async collaboration",
      best_for: [
        "Teams that need immediate senior engineering bandwidth",
        "Startups shipping ambitious roadmap milestones",
        "Products that need reliable execution under deadlines",
      ],
      button_text: "Discuss Contract Work",
      badge: "Most Requested",
    },
    {
      name: "Fractional CTO",
      tagline: "Part-time technical leadership",
      category: "ongoing",
      engagement_model: "Leadership support with hands-on oversight",
      description:
        "I help founders and teams make stronger technical decisions while improving execution quality and engineering alignment.",
      what_you_get: [
        "Architecture direction and technology strategy",
        "Delivery planning and technical risk management",
        "Hiring support, interviewing, and team mentorship",
        "Codebase standards, review quality, and engineering process improvements",
      ],
      time_commitment: "Structured weekly involvement",
      best_for: [
        "Teams scaling beyond initial MVP",
        "Founders needing senior technical leadership without a full-time executive",
        "Organizations preparing for faster engineering growth",
      ],
      button_text: "Discuss Fractional CTO Support",
    },
    {
      name: "Technical Advisory",
      tagline: "Focused strategic guidance",
      category: "ongoing",
      engagement_model: "Recurring advisory sessions",
      description:
        "A lean advisory model for teams that need senior judgment on architecture, delivery trade-offs, and execution priorities.",
      what_you_get: [
        "Architecture and roadmap reviews",
        "Technical decision support for product direction",
        "Risk identification and mitigation planning",
        "Actionable recommendations tied to near-term execution",
      ],
      time_commitment: "Lightweight, recurring cadence",
      best_for: [
        "Founders navigating critical technical decisions",
        "Teams with delivery risk but limited leadership bandwidth",
        "Products preparing for major architecture or scaling choices",
      ],
      button_text: "Book an Advisory Conversation",
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
        "Organizations that need trusted delivery without long-term hiring",
      ],
      button_text: "Plan a Build Sprint",
    },
    {
      name: "Technical Audit",
      tagline: "Architecture and delivery assessment",
      category: "project",
      engagement_model: "One-off deep technical review",
      description:
        "A focused review of architecture, code quality, and delivery risk with prioritized recommendations your team can execute immediately.",
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
      "Technical Advisory",
      "Fractional CTO",
    ],
    rows: [
      {
        feature: "Primary Outcome",
        values: [
          "Shipped software",
          "Higher-quality technical decisions",
          "Aligned engineering leadership",
        ],
      },
      {
        feature: "Hands-on Implementation",
        values: ["High", "Low", "Medium"],
      },
      {
        feature: "Architecture Direction",
        values: ["With delivery context", "Focused reviews", "Continuous ownership"],
      },
      {
        feature: "Team Support",
        values: ["Pairing and reviews", "Decision support", "Mentorship + process design"],
      },
      {
        feature: "Best Fit",
        values: [
          "Execution bottlenecks",
          "Critical decisions",
          "Scaling team and roadmap",
        ],
      },
    ],
  },

  process: [
    {
      step: 1,
      title: "Discovery Call",
      description: "Quick alignment on goals, constraints, and what success looks like",
    },
    {
      step: 2,
      title: "Scope & Plan",
      description: "Define delivery model, responsibilities, and execution cadence",
    },
    {
      step: 3,
      title: "Start Fast",
      description: "Kick off with clear priorities and immediate implementation momentum",
    },
  ],

  faq: [
    {
      q: "When should I choose contract engineering vs advisory?",
      a: "Choose contract engineering when you need features shipped quickly. Choose advisory when your team is executing but needs stronger technical direction on architecture and roadmap trade-offs.",
    },
    {
      q: "Do you work with existing teams and codebases?",
      a: "Yes. Most engagements involve integrating into active products, improving delivery quality, and unblocking roadmap work without disrupting current momentum.",
    },
    {
      q: "Can engagements start small and expand later?",
      a: "Absolutely. Many collaborations begin with a focused sprint or advisory scope, then expand into recurring contract engineering or fractional leadership.",
    },
    {
      q: "How do you handle timezone overlap and communication?",
      a: "I work remotely with teams across regions using structured async updates, clear ownership, and planned overlap windows for high-priority discussions.",
    },
  ],
};
