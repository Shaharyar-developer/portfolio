"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { LandingSection } from "./landing-section";

interface BlogSectionProps {
  blogs: { title: string; url: string }[];
}

const entryVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function BlogSection({ blogs }: BlogSectionProps) {
  return (
    <LandingSection
      heading="Writing"
      subheading="Thoughts on design and semantics"
    >
      <motion.ul
        className="space-y-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        transition={{ staggerChildren: 0.08 }}
      >
        {blogs.map((blog) => (
          <motion.li key={blog.title} variants={entryVariant}>
            <Link
              href={blog.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between border-b border-border/40 py-4 transition-colors hover:border-foreground/50"
            >
              <span className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                {blog.title}
              </span>
              <ArrowRight className="h-5 w-5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </LandingSection>
  );
}
