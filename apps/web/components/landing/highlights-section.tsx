"use client";

import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

import { LandingSection } from "./landing-section";

const highlightVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

interface HighlightsSectionProps {
  highlights: string[];
}

export function HighlightsSection({ highlights }: HighlightsSectionProps) {
  return (
    <LandingSection
      heading="Highlights"
      subheading="Engineering focus"
      className="space-y-8"
    >
      <motion.div
        className="grid gap-6 md:grid-cols-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {highlights.map((text) => (
          <motion.div 
            key={text} 
            variants={highlightVariant}
            className="flex items-start gap-4"
          >
            <div className="mt-1 rounded-full bg-primary/10 p-1 text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="text-lg font-medium leading-relaxed text-foreground/90">
              {text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </LandingSection>
  );
}
