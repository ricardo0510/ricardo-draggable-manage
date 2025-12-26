import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";

export default defineConfig({
  plugins: [pluginReact(), pluginSass()],
  source: {
    alias: {
      "@": "./src",
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  output: {
    distPath: {
      root: "dist",
    },
  },
});
