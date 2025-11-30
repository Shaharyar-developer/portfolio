import { Separator } from "@workspace/ui/components/separator";
import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import { Mermaid } from "./components/mdx/mermaid";
import { Code } from "./components/mdx/code";

const components: MDXComponents = {
  hr: (props) => (
    <Separator
      className="bg-linear-to-r via-15% via-border bg-transparent"
      {...props}
    />
  ),
  h1: (props) => (
    <h1 className="text-4xl font-mono font-bold mt-8 mb-4" {...props} />
  ),
  h2: (props) => (
    <h2 className="text-2xl font-mono font-bold mt-8 mb-4" {...props} />
  ),
  h3: (props) => (
    <h3 className="text-xl font-mono font-bold mt-8 mb-4" {...props} />
  ),
  h4: (props) => (
    <h4 className="text-lg font-mono font-bold mt-8 mb-4" {...props} />
  ),
  p: (props) => <p className="my-4 leading-relaxed" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="pl-6 py-1.5 italic my-4 border-0 border-l-border! rounded-3xl text-muted-foreground [&::before]:hidden [&::after]:hidden bg-linear-to-br from-card/80"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="list-disc marker:text-primary/75 pl-6 my-4 space-y-2"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="list-decimal marker:text-primary/75 pl-6 my-4 space-y-2"
      {...props}
    />
  ),
  li: (props) => {
    const children = props.children;
    const hasCheckbox =
      Array.isArray(children) &&
      children[0]?.type === "input" &&
      children[0]?.props?.type === "checkbox";

    return (
      <li
        className={`ml-2 leading-relaxed ${
          hasCheckbox ? "flex items-center gap-3 list-none" : ""
        }`}
        {...props}
      />
    );
  },

  a: (props) => (
    <Link
      className="text-primary underline underline-offset-2 hover:text-primary/50 transition"
      target="_blank"
      {...props}
    />
  ),
  img: (props) => <Image width={700} height={350} className="" {...props} />,
  table: (props) => (
    <table className="w-full my-4 table-auto border-collapse" {...props} />
  ),
  th: (props) => <th className=" px-4 py-2 font-mono text-left" {...props} />,
  td: (props) => (
    <td
      className="border first:border-l-0 border-b-0 last:border-r-0 border-border px-4 py-2"
      {...props}
    />
  ),
  pre: (props) => {
    // Extract the code element and its props
    const children = props.children;
    if (
      children &&
      typeof children === "object" &&
      "props" in children &&
      children.props?.className
    ) {
      // This is a code block, pass it to our Code component
      return <Code className="bg-transparent!" {...children.props} />;
    }
    // Fallback to regular pre
    return <pre className="bg-transparent!" {...props} />;
  },
  code: (props) => {
    // Handle inline code (no language class means inline)
    if (!props.className) {
      return (
        <code
          className="rounded bg-transparent! italic font-normal font-mono"
          {...props}
        />
      );
    }
    // For code blocks, this will be handled by pre
    return <code {...props} />;
  },
};

export function useMDXComponents(): MDXComponents {
  return {
    ...components,
    Mermaid,
  };
}
