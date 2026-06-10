import { createMDX } from "fumadocs-mdx/next";
import { join } from "path";
import process from "process";

/** @type {import("next").NextConfig} */
const nextConfig = {
  turbopack: {
    root: join(process.cwd(), "../../"),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "codex.shaharyar.dev",
        pathname: "/**",
      },
    ],
  },
};

const withMDX = createMDX({
  configPath: "source.config.ts",
});

export default withMDX(nextConfig);
