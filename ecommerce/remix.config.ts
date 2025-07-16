import type { AppConfig } from "@remix-run/dev";

const config: AppConfig = {
  appDirectory: "app",
  tailwind:true,
  postcss:true,
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  server: "@remix-run/cloudflare",
  serverBuildPath: "build/server/index.js",
  serverModuleFormat: "esm",
  serverPlatform: "neutral",
};

export default config;
