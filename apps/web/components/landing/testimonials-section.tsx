"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";

import { LandingSection } from "./landing-section";

interface Testimonial {
  quote: string;
  author: string;
  context?: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const testimonialVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <LandingSection
      heading="In use"
      subheading="What people say"
      className="space-y-8"
    >
      <motion.div
        className="grid gap-6 md:grid-cols-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {testimonials.map((t) => (
          <motion.figure
            key={t.quote}
            variants={testimonialVariant}
            className="flex flex-col gap-4 rounded-2xl border border-border/40 bg-card/30 p-6"
          >
            <Quote className="h-5 w-5 text-primary/60" />
            <blockquote className="text-lg leading-relaxed text-foreground/90">
              {t.quote}
            </blockquote>
            <figcaption className="font-mono text-sm text-muted-foreground">
              {t.author}
              {t.context && (
                <span className="text-muted-foreground/60"> · {t.context}</span>
              )}
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </LandingSection>
  );
}
