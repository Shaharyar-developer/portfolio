# Codex

Technical blog app for `codex.shaharyar.dev`.

## Writing

Add posts under `content/blog` as MDX files with frontmatter:

```mdx
---
title: "Post title"
description: "Short summary"
date: "2026-06-07"
author: "Shaharyar"
tags: ["typescript"]
---
```

Posts render at `/blog/[slug]`. Nested files are supported through the catch-all
blog route.

## MDX Features

- Mermaid diagrams through fenced `mermaid` code blocks.
- LaTeX math through `remark-math` and `rehype-katex`.
- Syntax-highlighted code blocks.
- Custom components: `Callout`, `Aside`, `Figure`, and `Mermaid`.

## Commands

Use Bun:

```bash
bun run --filter codex dev
bun run --filter codex build
bun run --filter codex typecheck
```
