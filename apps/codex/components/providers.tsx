"use client";

import { RootProvider } from "fumadocs-ui/provider/next";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider
      search={{
        links: [["Latest entry", "/blog/hello-codex"]],
        options: {
          type: "static",
          api: "/api/search",
        },
      }}
      theme={{
        defaultTheme: "dark",
        enableSystem: false,
      }}
    >
      {children}
    </RootProvider>
  );
}
