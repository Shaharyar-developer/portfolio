import Link from "next/link";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";

import { getPosts } from "@/lib/source";

export default function BlogPage() {
  const posts = getPosts();

  return (
    <DocsPage tableOfContent={{ enabled: true }}>
      <DocsTitle>Codex</DocsTitle>
      <DocsDescription>
        Technical essays, implementation notes, and small design decisions.
      </DocsDescription>
      <DocsBody>
        <div className="not-prose mt-8 space-y-2">
          {posts.map((post) => {
            const date = normalizeDate(post.data.date);

            return (
              <Link
                key={post.url}
                href={post.url}
                className="group block rounded-xl border border-fd-border bg-fd-card/40 px-4 py-3 transition-colors hover:bg-fd-accent/50"
              >
                <p className="text-sm font-medium text-fd-foreground">
                  {post.data.title ?? titleFromSlug(post.slugs.at(-1))}
                </p>
                <p className="mt-1 font-mono text-xs text-fd-muted-foreground">
                  {formatDate(date)}
                </p>
              </Link>
            );
          })}
        </div>
      </DocsBody>
    </DocsPage>
  );
}

function normalizeDate(value: string | Date) {
  return value instanceof Date ? value : new Date(value);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(date);
}

function titleFromSlug(value = "entry") {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`)
    .join(" ");
}
