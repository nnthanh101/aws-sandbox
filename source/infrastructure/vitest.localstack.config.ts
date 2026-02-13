import path from "path";
import { defineConfig } from "vitest/config";

/**
 * Tier 2 Integration Test Configuration — LocalStack
 *
 * Deploys CDK stacks to LocalStack and validates resources exist.
 * Cost: $0 | Duration: 30-60s | Coverage: +15-20%
 *
 * Usage: docker exec sandbox-dev npm run test:localstack
 * Requires: sandbox-localstack container running on port 4566
 */
export default defineConfig({
  test: {
    testTimeout: 120_000,
    root: path.resolve(__dirname),
    include: ["test/integration/**/*.test.ts"],
    coverage: {
      include: ["lib/**/*.ts"],
    },
  },
  resolve: {
    alias: {
      "sandbox-infrastructure": path.resolve(__dirname, "./lib"),
      "sandbox-infrastructure/test": path.resolve(__dirname, "./test"),
    },
  },
});
