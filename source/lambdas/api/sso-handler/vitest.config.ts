// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import path from "path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["*.ts"],
    },
    exclude: [...configDefaults.exclude, "build/**"],
  },
  resolve: {
    alias: {
      "sandbox-sso-handler": path.resolve(__dirname, "./src"),
      "sandbox-sso-handler/test": path.resolve(
        __dirname,
        "./test",
      ),
    },
  },
});
