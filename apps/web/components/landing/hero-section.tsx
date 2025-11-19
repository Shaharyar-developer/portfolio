"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Mail, FileText } from "lucide-react";

import { Button } from "@workspace/ui/components/button";

const heroVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface HeroSectionProps {
  name: string;
  title: string;
  tagline: string;
  location: string;
  hero_cta: { label: string; href: string }[];
}

export function HeroSection({
  name,
  title,
  tagline,
  location,
  hero_cta,
}: HeroSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      variants={heroVariant}
      className="flex flex-col justify-center"
    >
      <div className="space-y-10">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-mono font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            AVAILABLE_FOR_WORK
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-5xl font-bold tracking-tighter text-foreground sm:text-7xl lg:text-8xl">
              {name}
            </h1>
            <div className="flex flex-col gap-6">
              <p className="text-xl font-mono text-muted-foreground sm:text-2xl">
                &gt; {title}
              </p>

              <ul className="flex flex-col gap-2 font-mono text-sm sm:text-base text-muted-foreground/80">
                <li className="flex items-center gap-3">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-primary/60" />
                  Real-time collaboration + OT/CRDT
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-primary/60" />
                  AI/Embeddings/Search
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-primary/60" />
                  Full-stack TS + Rust execution
                </li>
              </ul>
            </div>
          </div>

          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {tagline}
            <span className="block mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground/60">
              // Based in '{location}'
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          {hero_cta.map((cta) => (
            <Button asChild key={cta.href} size="lg" className="">
              <Link href={cta.href}>
                {cta.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ))}
          <Button
            variant="outline"
            size="lg"
            className="bg-transparent backdrop-blur"
            asChild
          >
            <Link href="mailto:shaharyar321321@gmail.com">
              Email Me <Mail className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="bg-transparent backdrop-blur"
            asChild
          >
            <Link href="/resume.pdf" target="_blank">
              View Resume <FileText className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="pt-8 border-t border-border/40">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60">
            Trusted by universities, startups & early-author platforms
          </p>
        </div>
      </div>
    </motion.div>
  );
}
