"use client";

import { services } from "@workspace/constants";
import { LandingSection } from "@/components/landing/landing-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ServicesPage() {
  const retainers = services.offerings.filter((o) => o.price_monthly);
  const projects = services.offerings.filter((o) => !o.price_monthly);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-32 px-6 py-24 md:px-12 md:pt-32 pb-0">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariant}
          className="space-y-8"
        >
          <div className="space-y-6">
            <motion.h1
              variants={itemVariant}
              className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl"
            >
              {services.headline}
            </motion.h1>
            <motion.p
              variants={itemVariant}
              className="max-w-2xl text-xl leading-relaxed text-muted-foreground"
            >
              {services.intro}
            </motion.p>
          </div>
          <motion.div variants={itemVariant}>
            <Button size="lg" asChild className="h-12 px-8 text-base">
              <Link href="https://cal.com/shaharyar-dev">
                Book a Discovery Call <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Retainers */}
        <LandingSection
          heading="Ongoing Partnership"
          subheading="Strategic leadership on your terms"
        >
          <div className="grid gap-8 lg:grid-cols-2">
            {retainers.map((offering) => (
              <div
                key={offering.name}
                className={`relative flex flex-col gap-8 rounded-2xl border p-8 transition-all ${
                  offering.badge
                    ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border/50 bg-background/50 hover:border-primary/20 hover:bg-muted/10"
                }`}
              >
                {offering.badge && (
                  <div className="absolute -top-4 left-8 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    {offering.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight">
                      {offering.name}
                    </h3>
                    <p className="text-base font-medium text-muted-foreground">
                      {offering.tagline}
                    </p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">
                      {offering.price_monthly}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {offering.price_note}
                    </span>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {offering.description}
                  </p>
                </div>

                <Separator className="bg-border/50" />

                <div className="flex-1 space-y-6">
                  <div className="space-y-4">
                    <p className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground/70">
                      Includes
                    </p>
                    <ul className="space-y-3">
                      {offering.what_you_get.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <span className="text-sm text-foreground/90">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <Button
                    className="w-full h-12 text-base"
                    variant={offering.badge ? "default" : "outline"}
                    asChild
                  >
                    <Link href="https://cal.com/shaharyar-dev">
                      {offering.button_text}
                    </Link>
                  </Button>
                  {offering.time_commitment && (
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      {offering.time_commitment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </LandingSection>

        {/* Projects */}
        <LandingSection
          heading="Fixed Scope"
          subheading="Project-based engagements"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((offering) => (
              <div
                key={offering.name}
                className="group flex flex-col gap-6 rounded-xl border border-border/40 bg-background/30 p-6 transition-colors hover:bg-muted/5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">{offering.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {offering.tagline}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-foreground">
                      {offering.price_project}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {offering.price_note}
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground">{offering.description}</p>

                <div className="flex-1">
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {offering.what_you_get.slice(0, 4).map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button variant="secondary" asChild className="w-full sm:w-auto">
                  <Link href="https://cal.com/shaharyar-dev">
                    {offering.button_text} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </LandingSection>

        {/* Comparison Table */}
        <LandingSection heading="Compare" subheading="Find the right fit">
          <div className="overflow-hidden rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    {services.comparison_table.headers.map((header, i) => (
                      <th
                        key={header}
                        className={`whitespace-nowrap p-5 font-semibold ${
                          i === 0 ? "text-foreground" : "text-muted-foreground"
                        } ${i === 2 ? "text-primary bg-primary/5" : ""}`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {services.comparison_table.rows.map((row) => (
                    <tr key={row.feature} className="group hover:bg-muted/5">
                      <td className="p-5 font-medium text-foreground">
                        {row.feature}
                      </td>
                      {row.values.map((value, i) => (
                        <td
                          key={i}
                          className={`p-5 ${
                            i === 1 ? "bg-primary/5 font-medium" : ""
                          }`}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </LandingSection>

        {/* Process */}
        <LandingSection heading="Process" subheading="How we work together">
          <div className="relative grid gap-8 md:grid-cols-3">
            <div className="absolute top-6 left-0 hidden h-0.5 w-full bg-gradient-to-r from-transparent via-border to-transparent md:block" />
            {services.process.map((step, idx) => (
              <div key={step.step} className="relative flex flex-col items-center text-center gap-4">
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background font-mono text-lg font-bold text-primary shadow-sm transition-transform hover:scale-110 hover:border-primary">
                  {step.step}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </LandingSection>

         {/* FAQ */}
        <LandingSection heading="FAQ" subheading="Common questions">
          <Accordion type="single" collapsible className="w-full">
            {services.faq.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left text-lg">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </LandingSection>
      </div>
    </div>
  );
}
