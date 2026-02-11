// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import { vi } from "vitest";

import { GlobalConfig } from "sandbox-commons/data/global-config/global-config.js";
import { ReportingConfig } from "sandbox-commons/data/reporting-config/reporting-config.js";
import yaml from "js-yaml";

export const bulkStubEnv = (envVars: Record<string, string>) => {
  for (let [key, value] of Object.entries(envVars)) {
    vi.stubEnv(key, value);
  }
};

export const mockAppConfigMiddleware = (
  globalConfig: GlobalConfig,
  reportingConfig?: ReportingConfig,
) => {
  global.fetch = vi.fn().mockImplementation((url: string) => {
    if (url.includes(process.env.REPORTING_CONFIG_PROFILE_ID || "Reporting")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(yaml.dump({ ...reportingConfig })),
      } as unknown as Response);
    } else {
      return Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(yaml.dump({ ...globalConfig })),
      } as unknown as Response);
    }
  });
};
