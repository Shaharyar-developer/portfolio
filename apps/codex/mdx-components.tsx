import type { MDXComponents } from "mdx/types";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import defaultMdxComponents from "fumadocs-ui/mdx";

import { Aside, Callout, Figure } from "@/components/mdx/blocks";
import { Mermaid } from "@/components/mdx/mermaid";

export const mdxComponents: MDXComponents = {
  ...defaultMdxComponents,
  pre: ({ children, ...props }) => {
    if (isMermaidCode(children)) {
      return <Mermaid chart={String(children.props.children).trim()} />;
    }

    const Pre = defaultMdxComponents.pre;
    return <Pre {...props}>{children}</Pre>;
  },
  Aside,
  Callout,
  Figure,
  Mermaid,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}

type MermaidCodeProps = {
  className?: string;
  children?: ReactNode;
};

function isMermaidCode(
  value: ReactNode
): value is ReactElement<MermaidCodeProps> {
  return (
    isValidElement<MermaidCodeProps>(value) &&
    value.props.className === "language-mermaid"
  );
}
