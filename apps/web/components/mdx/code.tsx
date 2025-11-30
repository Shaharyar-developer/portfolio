"use client";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import rust from "react-syntax-highlighter/dist/cjs/languages/prism/rust";
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";
import {
  oneDark,
  vsDark,
} from "react-syntax-highlighter/dist/cjs/styles/prism";

import { cn } from "@workspace/ui/lib/utils";
import { Mermaid } from "./mermaid";

SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("rust", rust);
SyntaxHighlighter.registerLanguage("markdown", markdown);

type CodeProps = React.HTMLAttributes<HTMLElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function Code({ className, children, ...props }: CodeProps) {
  const match = /language-(\w+)/.exec(className || "");

  // Inline code
  if (!match) {
    return (
      <code
        {...props}
        className={cn(
          "rounded-md px-1.5 py-0.5 font-mono text-[0.9em]",
          className
        )}
      >
        {children}
      </code>
    );
  }

  // Block code
  const language = match[1];
  const content = String(children).trim();

  // Render mermaid diagrams
  if (language === "mermaid") {
    return <Mermaid chart={content} />;
  }

  return (
    <div className="my-6 overflow-hidden bg-transparent! rounded-2xl">
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers
        codeTagProps={{
          style: {
            backgroundColor: "transparent",
          },
        }}
        customStyle={{
          backgroundColor: "transparent",
          margin: 0,
          padding: "1.25rem",
          fontSize: "0.9rem",
          fontFamily: "var(--font-mono)",
        }}
        lineNumberStyle={{
          color: "rgba(255,255,255,0.25)",
          marginRight: "1rem",
        }}
        wrapLines
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
}
