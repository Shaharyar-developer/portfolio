"use client";

import { Suspense, use, useEffect, useId, useState } from "react";
import { useTheme } from "next-themes";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function Mermaid({ chart }: { chart: string }) {
  return (
    <Suspense fallback={<Skeleton className="my-6 h-72 w-full" />}>
      <MermaidRaw chart={chart} />
    </Suspense>
  );
}

function MermaidRaw({ chart }: { chart: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <MermaidContent chart={chart} />;
}

const cache = new Map<string, Promise<unknown>>();

function cachePromise<T>(
  key: string,
  setPromise: () => Promise<T>
): Promise<T> {
  const cached = cache.get(key);
  if (cached) return cached as Promise<T>;

  const promise = setPromise();
  cache.set(key, promise);
  return promise;
}

function MermaidContent({ chart }: { chart: string }) {
  const id = useId();
  const previewId = `mermaid-${id.replace(/:/g, "")}`;
  const modalId = `${previewId}-modal`;
  const { resolvedTheme } = useTheme();
  const { default: mermaid } = use(
    cachePromise("mermaid", () => import("mermaid"))
  );

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    fontFamily: "inherit",
    themeCSS: "margin: 1.5rem auto;",
    theme: resolvedTheme === "dark" ? "dark" : "default",
  });

  const { svg: previewSvg, bindFunctions: bindPreview } = use(
    cachePromise(`${chart}-${resolvedTheme}-${previewId}`, () => {
      return mermaid.render(previewId, chart.replaceAll("\\n", "\n"));
    })
  );

  const { svg: modalSvg, bindFunctions: bindModal } = use(
    cachePromise(`${chart}-${resolvedTheme}-${modalId}`, () => {
      return mermaid.render(modalId, chart.replaceAll("\\n", "\n"));
    })
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="my-6 w-full cursor-zoom-in overflow-auto rounded-xl border border-fd-border bg-fd-card p-3 text-left text-fd-foreground transition hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-ring"
          ref={(container) => {
            if (container) bindPreview?.(container);
          }}
          dangerouslySetInnerHTML={{ __html: previewSvg }}
          aria-label="Open diagram"
        />
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-full max-w-[90svw]! overflow-auto">
        <DialogTitle className="sr-only">Diagram</DialogTitle>
        <div
          className="flex justify-center"
          ref={(container) => {
            if (container) bindModal?.(container);
          }}
          dangerouslySetInnerHTML={{ __html: modalSvg }}
        />
      </DialogContent>
    </Dialog>
  );
}
