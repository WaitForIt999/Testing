import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.test.*", "**/*.spec.*"],
    exclude: ["node_modules", "dist", "tests/playwright/**"],
  },
});
