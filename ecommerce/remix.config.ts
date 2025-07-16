// remix.config.ts
import type { AppConfig } from "@remix-run/dev";

const config: AppConfig = {
  appDirectory: "app",
  tailwind: true,
  postcss: true,
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildPath: "build/worker/index.js",
  serverModuleFormat: "esm",
  serverPlatform: "neutral",
  server: "@remix-run/cloudflare",
};

export default config;
