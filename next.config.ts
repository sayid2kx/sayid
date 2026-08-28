import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // For username.github.io root repo, no basePath needed.
  // If you later deploy to /repo-name, set basePath: "/repo-name"
};

export default nextConfig;
