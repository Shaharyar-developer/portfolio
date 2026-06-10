import type { ReactNode } from "react";
import { BookOpenText } from "lucide-react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

import { blog } from "@/lib/source";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={blog.getPageTree()}
      nav={{
        title: (
          <span className="inline-flex items-center gap-2">
            <BookOpenText className="size-4" aria-hidden />
            Codex
          </span>
        ),
        url: "/blog",
      }}
      links={[
        {
          type: "main",
          text: "Portfolio",
          url: "https://shaharyar.dev",
          external: true,
        },
      ]}
      sidebar={{
        collapsible: true,
        className: "bg-transparent border-r-0!",
      }}
      themeSwitch={{
        enabled: false,
      }}
    >
      {children}
    </DocsLayout>
  );
}
