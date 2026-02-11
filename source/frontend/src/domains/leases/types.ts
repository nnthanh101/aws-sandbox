// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
  LeaseWithLeaseId,
  MonitoredLease,
} from "sandbox-commons/data/lease/lease";

export type NewLeaseRequest = {
  leaseTemplateUuid: string;
  comments?: string;
  userEmail?: string;
};

export type LeasePatchRequest = {
  leaseId: LeaseWithLeaseId["leaseId"];
  maxSpend?: MonitoredLease["maxSpend"] | null;
  budgetThresholds?: MonitoredLease["budgetThresholds"];
  expirationDate?: MonitoredLease["expirationDate"] | null;
  durationThresholds?: MonitoredLease["durationThresholds"];
  costReportGroup?: MonitoredLease["costReportGroup"] | null;
};

export type LeaseFormData = LeasePatchRequest & {
  maxBudgetEnabled?: boolean;
  maxDurationEnabled?: boolean;
};

export type MonitoredLeaseWithLeaseId = MonitoredLease & LeaseWithLeaseId;
