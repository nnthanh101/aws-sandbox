// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
  Box,
  ColumnLayout,
  Container,
  FormField,
  Header,
  SpaceBetween,
  StatusIndicator,
} from "@cloudscape-design/components";

import {
  isExpiredLease,
  isMonitoredLease,
  LeaseWithLeaseId,
} from "sandbox-commons/data/lease/lease";
import { AccountLoginLink } from "sandbox-frontend/components/AccountLoginLink";
import { BudgetProgressBar } from "sandbox-frontend/components/BudgetProgressBar";
import { Divider } from "sandbox-frontend/components/Divider";
import { DurationStatus } from "sandbox-frontend/components/DurationStatus";
import { LeaseStatusBadge } from "sandbox-frontend/domains/leases/components/LeaseStatusBadge";
import { getLeaseExpiryInfo } from "sandbox-frontend/helpers/LeaseExpiryInfo";

interface LeasePanelProps {
  lease: LeaseWithLeaseId;
}

export const LeasePanel = ({ lease }: LeasePanelProps) => {
  return (
    <Container data-shadow>
      <SpaceBetween size="l">
        <Header
          variant="h3"
          actions={
            <>
              {lease.status === "Active" && (
                <AccountLoginLink
                  accountId={lease.awsAccountId}
                  variant="normal"
                />
              )}

              {lease.status === "PendingApproval" && (
                <StatusIndicator type="info">
                  Your account is pending approval
                </StatusIndicator>
              )}
            </>
          }
          description={<LeaseStatusBadge lease={lease} />}
        >
          {lease.originalLeaseTemplateName || `Lease ${lease.uuid}`}
        </Header>
        <Divider marginBottom="s" />
        <ColumnLayout columns={4} variant="text-grid">
          <Box>
            <FormField label="AWS Account ID" />
            {isMonitoredLease(lease) ? (
              lease.awsAccountId
            ) : (
              <StatusIndicator type="warning">
                No account assigned{" "}
                {lease.status === "PendingApproval" && "yet"}
              </StatusIndicator>
            )}
          </Box>

          <Box>
            <FormField label="Expiry" />
            <DurationStatus {...getLeaseExpiryInfo(lease)} />
          </Box>

          <Box>
            <FormField label="Budget" />
            <SpaceBetween size="m">
              <BudgetProgressBar
                currentValue={
                  isMonitoredLease(lease) || isExpiredLease(lease)
                    ? lease.totalCostAccrued
                    : 0
                }
                maxValue={lease.maxSpend}
              />
            </SpaceBetween>
          </Box>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
};
