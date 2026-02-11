// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Badge } from "@cloudscape-design/components";

import { Lease } from "sandbox-commons/data/lease/lease";
import { getLeaseStatusDisplayName } from "sandbox-frontend/domains/leases/helpers";

const getBadgeColor = (status: string) => {
  if (status === "Active") {
    return "green";
  }

  if (status === "Frozen") {
    return "blue";
  }

  if (status === "PendingApproval") {
    return "severity-low";
  }

  // everything else is red
  return "red";
};

export const LeaseStatusBadge = ({ lease }: { lease: Lease }) => {
  return (
    <Badge color={getBadgeColor(lease.status)} data-badge>
      {getLeaseStatusDisplayName(lease.status)}
    </Badge>
  );
};
