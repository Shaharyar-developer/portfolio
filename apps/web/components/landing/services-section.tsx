"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { LandingSection } from "./landing-section";

interface ServicesSectionProps {
  services: {
    heading: string;
    items: string[];
    engagement: string;
  };
}

const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <LandingSection
      heading="Services"
      subheading={services.heading}
      className="space-y-10"
    >
      <motion.ul
        className="grid gap-x-12 gap-y-6 sm:grid-cols-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.08 }}
      >
        {services.items.map((item) => (
          <motion.li
            key={item}
            variants={itemVariant}
            className="flex items-start gap-3 text-lg leading-relaxed text-foreground/90"
          >
            <ArrowRight className="mt-1.5 h-4 w-4 shrink-0 text-primary/70" />
            {item}
          </motion.li>
        ))}
      </motion.ul>

      <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
        {services.engagement}
      </p>
    </LandingSection>
  );
}
