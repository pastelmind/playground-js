import { glob } from "glob";
import * as path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  base: "",
  build: {
    outDir: "../dist",
    rollupOptions: {
      // Input path must be converted to absolute path,
      // otherwise Vite will emit warning in dev mode.
      input: (
        await glob("**/*.html", {
          ignore: ["dist/**", "node_modules/**"],
        })
      ).map((filePath) => path.resolve(filePath)),
    },
    emptyOutDir: true,
  },
});
