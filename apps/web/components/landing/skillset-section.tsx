"use client";

import { Badge } from "@workspace/ui/components/badge";
import { LandingSection } from "./landing-section";

interface SkillsetSectionProps {
  skillset: {
    languages?: string[];
    frameworks?: string[];
    databases?: string[];
    specializations?: string[];
  };
}

const skillGroups = [
  { title: "Languages", key: "languages" },
  { title: "Frameworks", key: "frameworks" },
  { title: "Databases", key: "databases" },
  { title: "Specializations", key: "specializations" },
];

export function SkillsetSection({ skillset }: SkillsetSectionProps) {
  return (
    <LandingSection
      heading="Toolbelt"
      subheading="Languages, frameworks, and focus areas"
      className="space-y-12"
    >
      <div className="grid gap-0.5 overflow-hidden  sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group) => {
          const items = skillset[group.key as keyof typeof skillset] ?? [];
          return (
            <div
              key={group.key}
              className="group border border-border/50 hover:border-border/100 relative flex flex-col gap-4 bg-background p-6 hover:bg-muted/50 transition-colors first:rounded-l-lg last:rounded-r-lg bg-muted/10"
            >
              <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {items.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-2 text-sm font-medium text-foreground"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
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
