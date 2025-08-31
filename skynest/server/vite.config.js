import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

export default defineConfig({
  server: {
    port: 5000,
  },
  plugins: [
    ...VitePluginNode({
      adapter: "express", // or koa, fastify
      appPath: "./src/server.js", // your entry file
      exportName: "app", // the name of export in server.js
    }),
  ],
});
