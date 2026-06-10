import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  PageLastUpdate,
} from "fumadocs-ui/layouts/docs/page";

import { mdxComponents } from "@/mdx-components";
import { blog, getPosts, isVisiblePost } from "@/lib/source";

type PageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((post) => ({
    slug: post.slugs,
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const page = blog.getPage(slug);

  if (!page || !isVisiblePost(page)) {
    notFound();
  }

  return {
    title: page.data.title ?? titleFromSlug(page.slugs.at(-1)),
    description: page.data.description,
    alternates: {
      canonical: page.url,
    },
    openGraph: {
      title: page.data.title ?? titleFromSlug(page.slugs.at(-1)),
      description: page.data.description,
      type: "article",
      publishedTime: normalizeDate(page.data.date).toISOString(),
      authors: [page.data.author],
      tags: page.data.tags,
      url: page.url,
    },
  };
}

export default async function Page(props: PageProps) {
  const { slug } = await props.params;
  const page = blog.getPage(slug);

  if (!page || !isVisiblePost(page)) {
    notFound();
  }

  const Mdx = page.data.body;
  const date = normalizeDate(page.data.date);

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title ?? titleFromSlug(page.slugs.at(-1))}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-fd-muted-foreground">
        <time dateTime={date.toISOString()}>{formatDate(date)}</time>
        <span aria-hidden>·</span>
        <span>{page.data.author}</span>
      </div>
      <DocsBody>
        <Mdx components={mdxComponents} />
      </DocsBody>
      <PageLastUpdate date={date} />
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
