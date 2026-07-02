"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

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
  proof_bar?: { label: string; href: string }[];
  availability?: string;
}

export function HeroSection({
  name,
  title,
  tagline,
  location,
  hero_cta,
  proof_bar,
  availability,
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
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl font-bold tracking-tighter text-foreground sm:text-7xl lg:text-8xl">
              {name}
            </h1>
            <div className="flex flex-col gap-6">
              <p className="text-xl font-mono text-muted-foreground sm:text-2xl">
                &gt; {title}
              </p>
            </div>
          </div>

          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {tagline}
          </p>
        </div>

        <div className="flex sm:flex-row flex-col flex-wrap gap-4">
          {hero_cta.map((cta, i) => (
            <Button
              asChild
              variant={i === 1 ? "outline" : "default"}
              key={cta.href}
              size="default"
              className=""
            >
              <Link href={cta.href}>
                {cta.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ))}
        </div>

        {proof_bar && proof_bar.length > 0 && (
          <div className="pt-8 border-t border-border/40">
            <ul className="flex flex-col gap-3 font-mono text-sm text-muted-foreground/80 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-3">
              {proof_bar.map((item, idx) => (
                <li key={item.href} className="flex items-center gap-2">
                  <Link
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http") ? "noreferrer" : undefined
                    }
                    className="group inline-flex items-center gap-1 text-muted-foreground/80 transition-colors hover:text-foreground"
                  >
                    {item.label}
                    <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                  {idx < proof_bar.length - 1 && (
                    <span
                      aria-hidden
                      className="hidden text-muted-foreground/30 sm:inline"
                    >
                      ·
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}
