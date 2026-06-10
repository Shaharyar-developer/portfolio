import { join } from "path";
import process from "process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: join(process.cwd(), "../../"),
  },
};

export default nextConfig;
