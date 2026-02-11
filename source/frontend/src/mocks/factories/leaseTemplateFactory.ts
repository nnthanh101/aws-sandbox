// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
  LeaseTemplate,
  LeaseTemplateSchema,
} from "sandbox-commons/data/lease-template/lease-template.js";
import { generateSchemaData } from "sandbox-commons/test/generate-schema-data.js";

export function createLeaseTemplate(
  overrides?: Partial<LeaseTemplate>,
): LeaseTemplate {
  return generateSchemaData(LeaseTemplateSchema, {
    requiresApproval: false,
    ...overrides,
  });
}

export function createAdvancedLeaseTemplate(
  overrides?: Partial<LeaseTemplate>,
): LeaseTemplate {
  return generateSchemaData(LeaseTemplateSchema, {
    requiresApproval: true,
    budgetThresholds: [{ dollarsSpent: 250, action: "ALERT" }],
    durationThresholds: [{ hoursRemaining: 24, action: "ALERT" }],
    ...overrides,
  });
}
