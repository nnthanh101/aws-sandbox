// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { SandboxAccountStatus } from "sandbox-commons/data/sandbox-account/sandbox-account";
import { getColor } from "sandbox-frontend/components/AccountsSummary/helpers";
import { Box, Icon, Popover } from "@cloudscape-design/components";
import { colorChartsStatusHigh } from "@cloudscape-design/design-tokens";
import moment from "moment";

interface AccountStatusIndicatorProps {
  status: SandboxAccountStatus;
  lastCleanupStartTime: string;
}

export const AccountStatusIndicator = ({
  status,
  lastCleanupStartTime,
}: AccountStatusIndicatorProps) => {
  switch (status) {
    case "Available":
      return (
        <span style={{ color: getColor(status) }}>
          <Icon name="status-positive" /> Available
        </span>
      );

    case "Active":
      return (
        <span style={{ color: getColor(status) }}>
          <Icon name="status-in-progress" /> Active
        </span>
      );

    case "Frozen":
      return (
        <span style={{ color: getColor(status) }}>
          <Icon name="status-stopped" /> Frozen
        </span>
      );

    case "CleanUp": {
      const hoursElapsed = moment().diff(moment(lastCleanupStartTime), "hours");
      const isStale = hoursElapsed >= 24;
      const message = isStale
        ? "The cleanup process may be stuck, please retry."
        : "This account is being cleaned up and will be ready to use soon.";
      const color = isStale ? colorChartsStatusHigh : getColor(status);

      return (
        <Popover
          position="top"
          size="large"
          dismissButton={false}
          content={
            <div style={{ color }}>
              {message}
              <Box color={"inherit"} fontWeight={"heavy"}>
                Cleanup initiated:{` ${moment(lastCleanupStartTime)}`}
              </Box>
            </div>
          }
        >
          <span
            style={{
              color,
            }}
          >
            <Icon name="remove" /> Clean Up
          </span>
        </Popover>
      );
    }

    case "Quarantine":
      return (
        <span style={{ color: getColor(status) }}>
          <Icon name="status-negative" /> Quarantine
        </span>
      );

    default:
      return null;
  }
};
