export const about = {
  name: "M. Shaharyar",
  title: "Full-Stack AI & Web Engineer",
  tagline:
    "I build intelligent, collaborative web apps with Rust and TypeScript.",
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
    "100k+ line production platform solo-built in 8 months",
    "Real-time collaborative editing with OT/CRDT systems",
    "Semantic search pipelines using Rust + vector DBs",
    "Performance-first UI/UX work in React/Next.js",
  ],
  featured_projects: [
    {
      id: "nova",
      name: "Novus Atlas (NOVA)",
      type: "Content Publishing Platform",
      description:
        "Figma-grade real-time collaborative editor with semantic search and analytics.",
      tech: [
        "Next.js 13+",
        "React",
        "TypeScript",
        "Rust",
        "PostgreSQL",
        "Qdrant",
        "WebSockets",
      ],
      links: {
        case_study: "/projects/nova",
      },
      stats: {
        codebase_size: "100k+ lines",
        users: "Internal test group of authors",
      },
    },
    {
      id: "crdt-library",
      name: "OpenOT",
      type: "Realtime Collaboration Library",
      description:
        "Universal CRDT/OT abstraction layer for Tiptap, Lexical and custom editors.",
      tech: ["TypeScript", "WebSockets", "CRDT/OT"],
      links: {
        github: "https://github.com/Shaharyar-developer/open-ot",
        case_study: "/projects/open-ot",
      },
      status: "V1 UNDER DEVELOPMENT",
    },
    {
      id: "vad-wasm",
      name: "Voice Activity Detection",
      type: "ML/Audio Processing",
      description:
        "No-deps VAD with noise filtering using Mel spectrograms, planned as a WASM demo.",
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
    languages: ["TypeScript", "JavaScript", "Rust", "Python", "SQL"],
    frameworks: ["Next.js", "React", "Hono", "Express", "Electron"],
    databases: ["PostgreSQL", "Qdrant", "Redis", "MySQL"],
    specializations: [
      "Real-time collaboration",
      "Semantic embeddings",
      "AI-enhanced writing tools",
      "High-performance UI engineering",
    ],
  },
  resume: "/resume.pdf",
};
