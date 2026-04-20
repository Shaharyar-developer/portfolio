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
      <div className="relative mx-auto flex max-w-5xl flex-col gap-32 px-6 py-24 md:px-12 md:py-32">
        <HeroSection
          name={about.name}
          title={about.title}
          tagline={about.tagline}
          location={about.location}
          hero_cta={about.hero_cta}
          proof_points={about.value_proposition.proof_points}
          availability={about.availability}
        />

        <HighlightsSection highlights={about.highlights} />

        <ProjectsSection projects={about.featured_projects} />

        <SkillsetSection skillset={about.technical_expertise} />

        <BlogSection blogs={about.writing} />

        <ContactSection contact={about.contact} resume={about.resume} />
      </div>
    </div>
  );
}
