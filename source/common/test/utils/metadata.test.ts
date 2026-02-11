// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
  Lease,
  LeaseSchema,
  LeaseSchemaVersion,
} from "sandbox-commons/data/lease/lease.js";
import {
  validateItem,
  withMetadata,
} from "sandbox-commons/data/utils.js";
import { generateSchemaData } from "sandbox-commons/test/generate-schema-data.js";
import { describe, expect, test } from "vitest";

class TestClass {
  @validateItem(LeaseSchema)
  @withMetadata(LeaseSchemaVersion)
  public static metaEnhancedFunction(lease: Lease): Lease {
    return lease;
  }
}

describe("meta decorators", () => {
  test("applies meta to lease", () => {
    const lease = generateSchemaData(LeaseSchema, {
      status: "PendingApproval",
      meta: undefined,
    });

    const updatedLease = TestClass.metaEnhancedFunction(lease);

    expect(lease.meta).toBeUndefined;
    expect(updatedLease.meta).not.toBeUndefined;
  });
});
