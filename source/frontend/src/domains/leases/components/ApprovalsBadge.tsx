// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Badge } from "@cloudscape-design/components";

import { useGetPendingApprovals } from "sandbox-frontend/domains/leases/hooks";

export const ApprovalsBadge = () => {
  const { data: requests } = useGetPendingApprovals();

  if (requests && requests.length > 0) {
    return <Badge color="red">{requests.length}</Badge>;
  }

  return <></>;
};
