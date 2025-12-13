"use client";

import { LandingSection } from "./landing-section";

interface SkillsetSectionProps {
  skillset: {
    languages?: string[];
    frameworks?: string[];
    databases?: string[];
    specializations?: string[];
    industries?: string[];
  };
}

const skillGroups = [
  { title: "Languages", key: "languages" },
  { title: "Frameworks", key: "frameworks" },
  { title: "Databases", key: "databases" },
  { title: "Specializations", key: "specializations" },
  { title: "Industries", key: "industries" },
];

export function SkillsetSection({ skillset }: SkillsetSectionProps) {
  return (
    <LandingSection
      heading="Expertise"
      subheading="Technical proficiency & domain knowledge"
      className="space-y-12"
    >
      <div className="flex flex-col divide-y divide-border/40 border-y border-border/40">
        {skillGroups.map((group) => {
          const items = skillset[group.key as keyof typeof skillset] ?? [];
          if (items.length === 0) return null;
          
          return (
            <div
              key={group.key}
              className="group flex flex-col gap-4 py-6 transition-colors hover:bg-muted/5 md:flex-row md:gap-12 md:py-8"
            >
              <div className="w-48 shrink-0">
                <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                  {group.title}
                </h3>
              </div>
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {items.map((skill) => (
                  <li
                    key={skill}
                    className="text-base font-medium text-foreground/80 transition-colors group-hover:text-foreground"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </LandingSection>
  );
}
