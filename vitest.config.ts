import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    reporters: "verbose",
    include: ["tests/**/*.spec.ts", "tests/**/*.test.ts"],
    exclude: [
      "node_modules",
      "dist",
      "tests/playwright/**",
    ],
  },
});
