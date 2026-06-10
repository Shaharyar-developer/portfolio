import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import "fumadocs-ui/style.css";
import "fumadocs-ui/css/black.css";
import "katex/dist/katex.min.css";

import { Providers } from "@/components/providers";

const fontSans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://codex.shaharyar.dev"),
  title: {
    default: "Codex",
    template: "%s | Codex",
  },
  description: "Technical essays and notes by Shaharyar.",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} flex min-h-screen flex-col bg-fd-background font-sans text-fd-foreground antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
