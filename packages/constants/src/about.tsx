import {Check, X} from "lucide-react"
export const about = {
  name: "M. Shaharyar",
  title: "Technical Founder & Advisor",
  tagline:
    "I help early-stage startups build the right product. Former INTERPOL contractor, built a 150k LOC platform solo in 6 months.",
  location: "Pakistan",
  availability: "Available for technical advisory & fractional CTO work",
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
    headline: "Technical founder who's been in the trenches",
    subheadline: "I've built production systems handling 1000+ users, worked on classified data pipelines, and led technical operations for national-level organizations. Now I help founders avoid the mistakes I've already made.",
    proof_points: [
      "Built 150k LOC collaborative platform in 6 months (solo)",
      "1000+ beta users across real-time editing system",
      "Former contractor: INTERPOL (Operation Storm Makers II) anti-human trafficking data analysis",
      "3+ years leading technical operations for national conferences",
    ]
  },
  highlights: [
    "Architected production systems handling 1000+ concurrent users",
    "Built custom Rust NLP engine for semantic analysis at scale",
    "Designed real-time collaborative editor using Operational Transformation",
    "Former INTERPOL contractor: classified data analysis pipelines",
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
        "Architected and built 150k LOC platform solo in 6 months",
        "1000+ authors in closed beta testing",
        "Custom Rust NLP engine for semantic content analysis",
        "Real-time collaborative editor with Operational Transformation",
        "Semantic discovery engine using vector embeddings (Qdrant)",
        "Branch-based version control system for creative content",
      ],
      tech: ["TypeScript", "Next.js", "Rust", "PostgreSQL", "Qdrant", "WebSockets"],
    },
    {
      role: "Data Analysis Contractor",
      organization: "INTERPOL",
      period: "2023-2024",
      type: "Contract",
      description: "Anti-human trafficking operations support (Operation Storm Makers II)",
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
        "Managed systems supporting 500+ participants",
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
      problem: "Writers need better tools for collaborative creation and discoverability",
      solution: "Built end-to-end platform combining real-time editing, semantic search, and worldbuilding knowledge graphs",
      impact: [
        "1000+ authors in closed beta",
        "150k+ lines of production code",
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
        "How to architect systems that scale without over-engineering",
        "Building real-time features that work reliably at scale",
        "Balancing performance with developer experience",
        "Solo founder execution strategies",
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
    {
      id: "vad-wasm",
      name: "Voice Activity Detection",
      type: "ML/Audio Processing",
      description:
        "High-performance voice activity detection using Mel spectrograms and FFT analysis. Designed for browser deployment via WebAssembly.",
      tech: ["Rust", "FFmpeg", "WebAssembly", "DSP"],
      links: {},
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
      url: "#",
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
    subheadline: "Whether you need strategic guidance or hands-on execution, I can help you make the right technical decisions for your startup.",
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
  headline: "Work With Me",
  intro: "I help early-stage startups make the right technical decisions. Whether you need strategic guidance or hands-on execution, here's how we can work together:",
  offerings: [
  {
    name: "Advisory",
    tagline: "Strategic Guidance",
    price_monthly: "$750/month",
    price_note: "Month-to-month, cancel anytime",
    description: "Perfect for founders who need technical judgment without full-time commitment",
    what_you_get: [
      "2 strategy calls/month (45 min each)",
      "Architecture & technical roadmap review",
      "Async support via Slack/email",
      "Tool & stack recommendations",
      "Technical hiring guidance",
    ],
    time_commitment: "~5 hours/month",
    best_for: [
      "Pre-MVP validation stage",
      "Making initial tech stack decisions",
      "Need ongoing technical advice",
    ],
    button_text: "Book Discovery Call",
  },
  {
    name: "Advisory + Execution",
    tagline: "Strategy + Hands-On",
    price_monthly: "$1,500/month",
    price_note: "Month-to-month, cancel anytime",
    description: "Strategic guidance plus tactical execution for critical work",
    what_you_get: [
      "Everything in Advisory tier",
      "Weekly 1-hour calls",
      "10 hours/month hands-on development",
      "Code reviews & architecture audits",
      "Priority async support (24hr response)",
    ],
    time_commitment: "~15 hours/month",
    best_for: [
      "Building MVP or early product",
      "Need both strategy and implementation",
      "Want technical partner without full-time hire",
    ],
    button_text: "Book Discovery Call",
    badge: "Most Popular",
  },
  {
    name: "MVP Build",
    tagline: "Full Product Development",
    price_project: "$8,000",
    price_note: "One-time project fee",
    description: "Complete product build from concept to deployment",
    what_you_get: [
      "Technical architecture & design",
      "Full-stack development",
      "Production-ready codebase",
      "Deployment & infrastructure",
      "4-6 week delivery",
      "1 month post-launch support",
    ],
    time_commitment: "4-6 weeks full build",
    best_for: [
      "Non-technical founders",
      "Ready to launch in 6 weeks",
      "Need complete product built",
    ],
    button_text: "Book Discovery Call",
  },
    {
      name: "Technical Audit",
      tagline: "One-Time Review",
      price_project: "$500",
      price_note: "One-time fee",
      description: "Get a comprehensive technical review of your product or idea",
      what_you_get: [
        "1-hour deep-dive call",
        "Written technical assessment (10-15 pages)",
        "Architecture recommendations",
        "Tech stack evaluation",
        "Roadmap priorities",
        "Risk assessment & mitigation strategies",
      ],
      time_commitment: "Delivered within 5 business days",
      best_for: [
        "Founders who need clarity on their technical approach",
      ],
      button_text: "Get Your Audit",
      upsell: "Many audit clients transition to ongoing advisory",
    }
  ],
  comparison_table: {
    headers: ["Feature", "Advisory", "Advisory + Execution", "MVP Build"],
    rows: [
      {
        feature: "Strategy Calls",
        values: ["2x / month", "Weekly", "Weekly"]
      },
      {
        feature: "Hands-on Code",
        values: [<X className="text-destructive"/>, "10 hrs / month", "Full Build"]
      },
      {
        feature: "Architecture Review",
        values: [<Check className="text-green-500! size-5"/>, <Check className="text-green-500! size-5"/>, <Check className="text-green-500! size-5"/>]
      },
      {
        feature: "Async Support",
        values: ["Standard", "Priority (24hr)", "Priority"]
      },
      {
        feature: "Hiring Support",
        values: [<Check className="text-green-500! size-5"/>, <Check className="text-green-500! size-5"/>, <X className="text-destructive"/>]
      },
      {
        feature: "Code Review",
        values: [<X className="text-destructive"/>, <Check className="text-green-500! size-5"/>, "N/A"]
      },
      {
        feature: "Ideal Stage",
        values: ["Pre-Seed / Idea", "Seed / Early Build", "Ready to Launch"]
      }
    ]
  },
  
  process: [
    {
      step: 1,
      title: "Discovery Call",
      description: "30-minute chat to understand your needs (free)"
    },
    {
      step: 2,
      title: "Proposal",
      description: "I'll send a clear proposal with scope and pricing"
    },
    {
      step: 3,
      title: "Start Fast",
      description: "We can begin within 48 hours of agreement"
    }
  ],
  
  faq: [
    {
      q: "Why should I hire an advisor vs a full-time CTO?",
      a: "A senior CTO costs $150k-250k/year + equity. I provide the same strategic guidance at a fraction of the cost, perfect for pre-seed/seed stage."
    },
    {
      q: "What if I need more hours than advisory includes?",
      a: "We can upgrade to Fractional CTO or discuss custom arrangements. I'm flexible based on your stage."
    },
    {
      q: "Do you take equity?",
      a: "For the right opportunity, yes. Let's discuss on our call."
    },
    {
      q: "What's your availability?",
      a: "I'm in Pakistan (GMT+5), which means I work when US/Europe sleeps. Faster turnaround for async work."
    }
  ]
}