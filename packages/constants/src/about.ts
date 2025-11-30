export const about = {
  name: "M. Shaharyar",
  title: "Full-Stack Product Engineer",
  tagline:
    "I build creative platforms: real-time collaboration, semantic intelligence, exceptional UX.",
  location: "Pakistan",
  contact: {
    email: "shaharyar321321@gmail.com",
    website: "https://shaharyar.dev",
    "cal.com": "https://cal.com/shaharyar-dev",
    github: "https://github.com/Shaharyar-developer",
    linkedin: "https://www.linkedin.com/in/shaharyar-muhammad-bbb400298",
  },
  hero_cta: [
    {
      label: "Book a Call",
      href: "https://cal.com/shaharyar-dev",
    },
  ],
  highlights: [
    "Founder & architect of a ~100k LOC production platform (solo-built)",
    "Deep expertise in real-time OT systems powering collaborative editing",
    "Semantic search pipelines using Rust NLP + vector indexing",
    "Product-focused UI engineering with Next.js and clean design principles",
  ],
  featured_projects: [
    {
      id: "nova",
      name: "Novus Atlas (NOVA)",
      type: "Creator Platform",
      description:
        "A next-gen writing ecosystem: multiplayer editor, semantic discovery, and worldbuilding knowledge graph.",
      tech: [
        "Next.js 14",
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
      stats: {
        codebase_size: "100k+ lines",
        phase: "Late beta (author testing group)",
      },
    },
    {
      id: "open-ot",
      name: "OpenOT",
      type: "Operational Transform Engine",
      description:
        "Production-ready OT framework powering real-time collaboration with pluggable transport + storage.",
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
        "Noise-resistant VAD algorithm using Mel spectrograms and audio heuristics. WASM port in progress.",
      tech: ["Rust", "FFmpeg", "WebAssembly (planned)"],
      links: {},
    },
  ],
  blogs: [
    {
      title: "NOVA Design Philosophy",
      url: "https://codex.novusatlas.org/blog/nova-design-philosophy",
    },
    {
      title: "A Technical Introspect to the Quality Checker",
      url: "https://codex.novusatlas.org/blog/a-technical-introspect-to-the-quality-checker",
    },
  ],
  skillset: {
    languages: ["TypeScript", "Rust", "Python", "SQL"],
    frameworks: ["Next.js", "React", "Hono", "Express", "Electron"],
    databases: ["PostgreSQL", "Qdrant", "Redis", "MySQL"],
    specializations: [
      "Real-time infrastructure",
      "Semantic embeddings & NLP",
      "Creator tools & publishing platforms",
      "High-performance, accessible UI/UX",
    ],
  },
  resume: "/resume.pdf",
};
