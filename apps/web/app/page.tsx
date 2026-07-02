"use client";

import { about } from "@workspace/constants";
import {
  AboutSection,
  BlogSection,
  ContactSection,
  HighlightsSection,
  HeroSection,
  ProjectsSection,
  ServicesSection,
  SkillsetSection,
  UiUxSection,
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
          proof_bar={about.proof_bar}
          availability={about.availability}
        />

        <HighlightsSection highlights={about.highlights} />

        <div id="projects">
          <ProjectsSection projects={about.featured_projects} />
        </div>

        <ServicesSection services={about.services_summary} />

        <UiUxSection />

        <SkillsetSection skillset={about.technical_expertise} />

        <AboutSection
          paragraphs={about.about_paragraphs}
          personal={about.about_personal}
        />

        <BlogSection blogs={about.writing} />

        <div id="contact">
          <ContactSection contact={about.contact} resume={about.resume} />
        </div>
      </div>
    </div>
  );
}
