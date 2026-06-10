"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  ArrowRight,
  FlaskConical,
  Sparkles,
  Database,
  Mail,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { motion, type Variants } from "motion/react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function LabsHomePage() {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden selection:bg-primary/20">
      {/* Background ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <header className="mx-auto max-w-6xl px-6 py-6 md:px-12 flex items-center justify-between border-b border-border/40 backdrop-blur-sm relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
            <FlaskConical className="size-4 text-primary animate-pulse" />
          </div>
          <span className="font-semibold tracking-tight text-foreground">
            Shaharyar Labs
          </span>
        </div>
        <ModeToggle />
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid gap-5 mb-16"
        >
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3" />
            <span>Developer Workbench</span>
          </div>
          <div className="grid gap-4">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-[4rem] leading-[1.1]">
              Small, sharp apps for{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[size:200%_auto] bg-clip-text text-transparent animate-gradient">
                recurring work.
              </span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              A shared platform for Shaharyar&apos;s utility tools, running on
              unified authentication, billing, and database infrastructure.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Active App: SheetDue */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/50 p-6 shadow-sm backdrop-blur-md transition-all hover:border-primary/40 hover:shadow-md dark:bg-card/25"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full group-hover:bg-primary/10 transition-colors pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <Activity className="size-5" />
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-none hover:bg-emerald-500/10 rounded-full text-xs font-semibold px-2.5 py-0.5 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Active
                </Badge>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                SheetDue
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                Send automated email reminders from Google Sheets before, on, or
                after deadlines. Never miss a client document or invoice
                follow-up.
              </p>
            </div>
            <Button
              asChild
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
            >
              <Link href="/sheetdue">
                Open App
                <ArrowRight className="size-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          {/* Planned App 1: FormSync */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/40 bg-card/20 p-6 shadow-sm backdrop-blur-md transition-all hover:border-border dark:bg-card/10 opacity-80"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-muted border border-border text-muted-foreground">
                  <Database className="size-5" />
                </div>
                <Badge
                  variant="outline"
                  className="border-border text-muted-foreground rounded-full text-xs px-2.5 py-0.5"
                >
                  Planned
                </Badge>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                FormSync
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                Instantly connect static HTML forms to Google Sheets or Notion
                databases. Capture contacts, feedback, and surveys with zero
                backend.
              </p>
            </div>
            <div className="text-xs text-muted-foreground font-medium pt-2 border-t border-border/30 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-muted-foreground/40" />
              Core API design underway
            </div>
          </motion.div>

          {/* Planned App 2: MailFlow */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/40 bg-card/20 p-6 shadow-sm backdrop-blur-md transition-all hover:border-border dark:bg-card/10 opacity-80"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-muted border border-border text-muted-foreground">
                  <Mail className="size-5" />
                </div>
                <Badge
                  variant="outline"
                  className="border-border text-muted-foreground rounded-full text-xs px-2.5 py-0.5"
                >
                  Planned
                </Badge>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                MailFlow
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                Trigger transactional emails dynamically via simple webhooks.
                Highly-customizable markdown template editor with instant
                delivery logs.
              </p>
            </div>
            <div className="text-xs text-muted-foreground font-medium pt-2 border-t border-border/30 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-muted-foreground/40" />
              Awaiting backend workspace core
            </div>
          </motion.div>
        </motion.div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-12 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 text-xs text-muted-foreground relative z-10">
        <p>© {new Date().getFullYear()} Shaharyar. All rights reserved.</p>
        <div className="flex gap-6">
          <Link
            href="/sheetdue"
            className="hover:text-foreground transition-colors"
          >
            SheetDue
          </Link>
          <span className="text-border">|</span>
          <span className="cursor-not-allowed">FormSync</span>
          <span className="text-border">|</span>
          <span className="cursor-not-allowed">MailFlow</span>
        </div>
      </footer>
    </main>
  );
}
