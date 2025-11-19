"use client";

import { about } from "@workspace/constants";
import {
  BlogSection,
  ContactSection,
  HighlightsSection,
  HeroSection,
  ProjectsSection,
  SkillsetSection,
} from "@/components/landing";

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-32 px-6 py-24 md:px-12 md:py-32">
        <HeroSection
          name={about.name}
          title={about.title}
          tagline={about.tagline}
          location={about.location}
          hero_cta={about.hero_cta}
        />

        <HighlightsSection highlights={about.highlights} />

        <ProjectsSection projects={about.featured_projects} />

        <SkillsetSection skillset={about.skillset} />

        <BlogSection blogs={about.blogs} />

        <ContactSection contact={about.contact} resume={about.resume} />
      </div>
    </div>
  );
}
