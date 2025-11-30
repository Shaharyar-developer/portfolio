import createMDX from "@next/mdx";
import { join } from "path";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const __dirname = process.cwd();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
  experimental: {
    mdxRs: {
      mdxType: "gfm",
    },
  },
  turbopack: {
    root: join(__dirname, "../../"),
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "codex.novusatlas.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "codex.novusatlas.org",
        pathname: "/**",
      },
    ],
  },
};

const mdxOptions = {
  remarkPlugins: ["remark-math"],
  rehypePlugins: [["rehype-katex", { strict: false }]],
};

const withMDX = createMDX({
  options: mdxOptions,
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
