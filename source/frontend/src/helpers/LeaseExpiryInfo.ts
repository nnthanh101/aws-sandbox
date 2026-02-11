// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
  Lease,
  isApprovalDeniedLease,
  isExpiredLease,
  isMonitoredLease,
  isPendingLease,
} from "sandbox-commons/data/lease/lease";

export interface LeaseExpiryInfo {
  date?: Date | string;
  durationInHours?: number;
  expired?: boolean;
}

export const getLeaseExpiryInfo = (lease: Lease): LeaseExpiryInfo | null => {
  if (isPendingLease(lease) || isApprovalDeniedLease(lease)) {
    return {
      durationInHours: lease.leaseDurationInHours,
    };
  }

  if (isMonitoredLease(lease)) {
    return {
      date: lease.expirationDate,
    };
  }

  if (isExpiredLease(lease)) {
    return {
      date: lease.endDate,
      expired: true,
    };
  }

  return null;
};
