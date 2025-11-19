"use client";

import { type ReactNode } from "react";

import { cn } from "@workspace/ui/lib/utils";

interface LandingSectionProps {
  heading?: string;
  subheading?: string;
  className?: string;
  children: ReactNode;
}

export function LandingSection({
  heading,
  subheading,
  className,
  children,
}: LandingSectionProps) {
  return (
    <section className={cn("space-y-6", className)}>
      {(heading || subheading) && (
        <div className="space-y-1">
          {heading && (
            <p className="text-xs uppercase tracking-[0.4em] text-primary/80">
              {heading}
            </p>
          )}
          {subheading && (
            <h2 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
              {subheading}
            </h2>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
