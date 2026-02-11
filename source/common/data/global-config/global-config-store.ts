// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import { GlobalConfig } from "sandbox-commons/data/global-config/global-config.js";

export abstract class GlobalConfigStore {
  abstract put(globalConfig: GlobalConfig): Promise<GlobalConfig>;

  abstract get(): Promise<GlobalConfig>;
}
