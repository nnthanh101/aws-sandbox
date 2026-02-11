// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { MonitoredLease } from "sandbox-commons/data/lease/lease";
import { createActiveLease } from "sandbox-frontend/mocks/factories/leaseFactory";
import { mockLeaseApi } from "sandbox-frontend/mocks/mockApi";

export const mockLease: MonitoredLease = createActiveLease();
mockLeaseApi.returns([mockLease]);

export const leaseHandlers = [
  mockLeaseApi.getHandler(),
  mockLeaseApi.getHandler("/:id"),
  mockLeaseApi.patchHandler("/:id"),
  mockLeaseApi.postHandler("/request"),
  mockLeaseApi.reviewHandler("/review"),
];
