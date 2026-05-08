"use client";

import Image from "next/image";
import { easeOut, motion } from "motion/react";
import { Maximize2 } from "lucide-react";

import { LandingSection } from "./landing-section";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@workspace/ui/components/dialog";

const gallery = [
  {
    src: "/architect-hero.png",
    title: "Architect Engine",
    category: "Cinematic",
    description: "Immersive interface system with deep spatial hierarchy, high-contrast dark mode, and ambient visual elements.",
  },
  {
    src: "/nova-hero.png",
    title: "NOVA Editorial",
    category: "Typography",
    description: "Editorial layout with precision typography pairing, serene contrast, and meticulous reading experience.",
  },
  {
    src: "/kicklayer-hero.png",
    title: "Kicklayer Pro",
    category: "SaaS Utility",
    description: "Professional aesthetic focusing on crisp structure, high data density execution, and absolute clarity.",
  },
];

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: easeOut }
  },
};

export function UiUxSection() {
  return (
    <LandingSection
      heading="UI / UX"
      subheading="Interface craft & presence"
      className="space-y-12"
    >
      <div className="max-w-2xl">
        <p className="text-lg leading-relaxed text-muted-foreground">
          Production-grade systems designed across NOVA, Kicklayer, and experimental tools. 
          Each layout balances hierarchy, typography, and atmosphere to communicate product intent clearly.
        </p>
      </div>

      <motion.div
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariant}
      >
        {gallery.map((item) => (
          <Dialog key={item.src}>
            <DialogTrigger asChild>
              <motion.button
                variants={itemVariant}
                className="group flex flex-col text-left focus:outline-none"
              >
                <div className="relative w-full overflow-hidden rounded-2xl border border-border/40 bg-muted/20 aspect-video shadow-sm transition-shadow group-hover:shadow-md">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    quality={90}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md shadow-lg">
                      <Maximize2 className="h-5 w-5" />
                    </span>
                  </div>
                </div>
                <div className="mt-5 space-y-2 px-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </motion.button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-6xl border-none bg-transparent p-0 shadow-none flex items-center justify-center" showCloseButton={false}>
              <DialogTitle className="sr-only">{item.title}</DialogTitle>
              <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black/50 ring-1 ring-white/10">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  quality={100}
                  unoptimized
                  className="object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </motion.div>
    </LandingSection>
  );
}
