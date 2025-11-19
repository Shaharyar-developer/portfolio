"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import { LandingSection } from "./landing-section";

const projectVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface FeaturedProject {
  id: string;
  name: string;
  type: string;
  description: string;
  tech?: string[];
  links?: Record<string, string | undefined>;
  stats?: Record<string, string>;
  status?: string;
}

interface ProjectsSectionProps {
  projects: FeaturedProject[];
}

function ProjectItem({ project }: { project: FeaturedProject }) {
  const linkEntries = Object.entries(project.links ?? {}).filter(([, href]) =>
    Boolean(href)
  ) as [string, string][];

  return (
    <motion.div
      variants={projectVariant}
      className="group/item relative py-12 transition-all duration-500 lg:hover:!opacity-100 lg:group-hover/list:opacity-40"
    >
      <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-16">
        {/* Left Column: Meta Info */}
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h3 className="text-3xl font-bold tracking-tight text-foreground group-hover/item:text-primary transition-colors">
              {project.name}
            </h3>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {project.type}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(project.tech ?? []).map((stack) => (
              <span
                key={stack}
                className="font-mono text-xs text-muted-foreground/80"
              >
                [{stack}]
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="space-y-8">
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground group-hover/item:text-foreground transition-colors">
            {project.description}
          </p>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            {project.stats && (
              <div className="flex gap-8">
                {Object.entries(project.stats).map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
                      {label.replace("_", " ")}
                    </span>
                    <span className="font-mono text-sm font-medium text-foreground">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              {linkEntries.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span className="relative">
                    {label.replace("_", " ")}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all group-hover/link:w-full" />
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </Link>
              ))}
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground/60">
              {project.status}
            </span>
          </div>
        </div>
      </div>

      {/* Separator line */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-border/40 group-hover/item:bg-primary/20 transition-colors" />
    </motion.div>
  );
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <LandingSection
      heading="Selected Work"
      subheading="Engineering & Product"
      className="space-y-12"
    >
      <motion.div
        className="group/list flex flex-col"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {projects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </motion.div>
    </LandingSection>
  );
}
