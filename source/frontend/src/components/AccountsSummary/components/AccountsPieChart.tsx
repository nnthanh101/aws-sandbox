// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from "react";

import {
  SandboxAccount,
  SandboxAccountStatus,
} from "sandbox-commons/data/sandbox-account/sandbox-account";
import { convertAccountsToSummary } from "sandbox-frontend/components/AccountsSummary/helpers";
import { PieChart } from "@cloudscape-design/components";

interface AccountsPieChartProps {
  accounts: SandboxAccount[];
  filter?: SandboxAccountStatus;
  onClick?: (status?: SandboxAccountStatus) => void;
}

export const AccountsPieChart = ({ accounts }: AccountsPieChartProps) => {
  const summary = useMemo(() => {
    return convertAccountsToSummary(accounts).filter((item) => item.value > 0);
  }, [accounts]);

  return (
    <PieChart
      data={summary}
      variant="donut"
      segmentDescription={(datum, sum) =>
        `${datum.value} accounts, ${((datum.value / sum) * 100).toFixed(0)}%`
      }
      hideFilter={true}
      hideLegend
    />
  );
};
