// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
  ExpiredLease,
  ExpiredLeaseSchema,
  Lease,
  LeaseSchema,
  MonitoredLease,
  MonitoredLeaseSchema,
  PendingLease,
  PendingLeaseSchema,
} from "sandbox-commons/data/lease/lease.js";
import { generateSchemaData } from "sandbox-commons/test/generate-schema-data";

export function createLease(overrides?: Partial<Lease>): Lease {
  return generateSchemaData(LeaseSchema, overrides);
}

export function createActiveLease(
  overrides?: Partial<MonitoredLease>,
): MonitoredLease {
  return generateSchemaData(MonitoredLeaseSchema, {
    status: "Active",
    ...overrides,
  });
}

export function createPendingLease(
  overrides?: Partial<PendingLease>,
): PendingLease {
  return generateSchemaData(PendingLeaseSchema, {
    status: "PendingApproval",
    ...overrides,
  });
}

export function createExpiredLease(
  overrides?: Partial<ExpiredLease>,
): ExpiredLease {
  return generateSchemaData(ExpiredLeaseSchema, {
    status: "Expired",
    ...overrides,
  });
}
