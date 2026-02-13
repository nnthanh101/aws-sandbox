// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import fs from "fs";
import path from "path";

export interface SolutionManifest {
  name: string;
  id: string;
  version: string;
}

export function readManifest(): SolutionManifest {
  const pkgPath = path.join(__dirname, "..", "..", "..", "..", "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  return {
    name: pkg.name,
    id: "S101",
    version: pkg.version,
  };
}

export function getCustomUserAgent(): string {
  const manifest = readManifest();
  return `AwsSolution/${manifest.id}/${manifest.version}`;
}
