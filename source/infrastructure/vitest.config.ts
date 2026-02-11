// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 300_000,
    coverage: {
      include: ["*.ts"],
    },
  },
  resolve: {
    alias: {
      "sandbox-infrastructure": path.resolve(
        __dirname,
        "./lib",
      ),
      "sandbox-infrastructure/test": path.resolve(
        __dirname,
        "./test",
      ),
      "sandbox-lambda/account-lifecycle-management":
        path.resolve(
          __dirname,
          "../lambdas/account-management/account-lifecycle-management/src",
        ),
      "sandbox-lambda/email-notification": path.resolve(
        __dirname,
        "../lambdas/notification/email-notification/src",
      ),
    },
  },
});
