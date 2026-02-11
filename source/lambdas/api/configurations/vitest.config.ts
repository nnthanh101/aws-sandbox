// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["*.ts"],
    },
  },
  resolve: {
    alias: {
      "sandbox-configurations": path.resolve(
        __dirname,
        "./src",
      ),
      "sandbox-configurations/test": path.resolve(
        __dirname,
        "./test",
      ),
    },
  },
});
