"use client";

import { motion } from "motion/react";

import { LandingSection } from "./landing-section";

interface AboutSectionProps {
  paragraphs: string[];
  personal: string;
}

const aboutVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function AboutSection({ paragraphs, personal }: AboutSectionProps) {
  return (
    <LandingSection heading="About" subheading="How I work" className="space-y-6">
      <motion.div
        variants={aboutVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-2xl space-y-6"
      >
        {paragraphs.map((text) => (
          <p key={text} className="text-lg leading-relaxed text-muted-foreground">
            {text}
          </p>
        ))}
        <p className="text-lg leading-relaxed text-foreground/80">{personal}</p>
      </motion.div>
    </LandingSection>
  );
}
