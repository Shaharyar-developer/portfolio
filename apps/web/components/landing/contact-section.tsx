"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { LandingSection } from "./landing-section";
import { Separator } from "@workspace/ui/components/separator";

interface ContactSectionProps {
  contact: {
    email: string;
    website: string;
    "cal.com": string;
    github: string;
    linkedin: string;
  };
  resume: string;
}

const contactVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ContactSection({ contact, resume }: ContactSectionProps) {
  return (
    <LandingSection
      heading="Let’s collaborate"
      subheading="Open for consulting, partnerships, and advisory"
    >
      <motion.div
        variants={contactVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="space-y-8"
      >
        <p className="max-w-2xl text-xl leading-relaxed text-muted-foreground">
          Reach out via email, schedule a call, or review the latest resume to
          get a sense of how I architect collaborative AI products.
        </p>

        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg" className="h-14 px-8 text-lg">
            <Link href={contact["cal.com"]} target="_blank" rel="noreferrer">
              Book a Call
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-8 text-lg"
            asChild
          >
            <Link href={resume} target="_blank" rel="noreferrer">
              View Resume
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="h-14 px-8 text-lg"
            asChild
          >
            <Link href={`mailto:${contact.email}`}>
              <Mail className="mr-2 h-5 w-5" />
              Email
            </Link>
          </Button>
        </div>
        <Separator className="via-15%" />
        <div className="px-4 border-border/40">
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <Link
              href={contact.github}
              target="_blank"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
            <Link
              href={contact.linkedin}
              target="_blank"
              className="hover:text-foreground transition-colors"
            >
              LinkedIn
            </Link>
            <Link
              href={contact.website}
              target="_blank"
              className="hover:text-foreground transition-colors"
            >
              {contact.website.replace("https://", "")}
            </Link>
          </div>
        </div>
      </motion.div>
    </LandingSection>
  );
}
