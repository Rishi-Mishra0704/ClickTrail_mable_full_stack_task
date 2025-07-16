import type { AppConfig } from "@remix-run/dev";

const config: AppConfig = {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverModuleFormat: "esm",
  serverPlatform: "node",
  tailwind:true,
  postcss:true
};

export default config;
