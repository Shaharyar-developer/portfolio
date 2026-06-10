"use client";

import { Button } from "@workspace/ui/components/button";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
] as const;

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="inline-flex h-9 items-center rounded-lg border border-border bg-background p-1">
      {themes.map(({ value, label, icon: Icon }) => {
        const active = mounted ? theme === value : value === "system";

        return (
          <Button
            key={value}
            type="button"
            size="icon"
            variant={active ? "secondary" : "ghost"}
            className="size-7 rounded-md"
            title={`${label} theme`}
            aria-label={`${label} theme`}
            onClick={() => setTheme(value)}
          >
            <Icon aria-hidden className="size-4" />
          </Button>
        );
      })}
    </div>
  );
}
