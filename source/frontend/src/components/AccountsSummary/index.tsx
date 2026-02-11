// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Container, Grid, Header } from "@cloudscape-design/components";

import {
  SandboxAccount,
  SandboxAccountStatus,
} from "sandbox-commons/data/sandbox-account/sandbox-account";
import { AccountsLoading } from "sandbox-frontend/components/AccountsSummary/components/AccountsLoading";
import { AccountsPieChart } from "sandbox-frontend/components/AccountsSummary/components/AccountsPieChart";
import { AccountsSummaryTable } from "sandbox-frontend/components/AccountsSummary/components/AccountsSummaryTable";
import { NoAccounts } from "sandbox-frontend/components/AccountsSummary/components/NoAccounts";
import Animate from "sandbox-frontend/components/Animate";

interface AccountsSummaryProps {
  accounts?: SandboxAccount[];
  filter?: SandboxAccountStatus;
  isLoading?: boolean;
  onFilterUpdated?: (status?: SandboxAccountStatus) => void;
}

export const AccountsSummary = ({
  accounts,
  filter,
  isLoading = false,
  onFilterUpdated,
}: AccountsSummaryProps) => {
  if (isLoading) {
    return <AccountsLoading />;
  }

  if (!accounts || accounts.length === 0) {
    return <NoAccounts />;
  }

  return (
    <Animate>
      <Grid
        gridDefinition={[
          { colspan: { xs: 5, xxs: 12 } },
          { colspan: { xs: 7, xxs: 12 } },
        ]}
      >
        <Container
          header={<Header variant="h3">Account Pool Summary</Header>}
          fitHeight
        >
          <AccountsSummaryTable
            accounts={accounts}
            filter={filter}
            onClick={
              onFilterUpdated
                ? (item) => {
                    onFilterUpdated(item?.status);
                  }
                : undefined
            }
          />
        </Container>
        <Container>
          <AccountsPieChart accounts={accounts} />
        </Container>
      </Grid>
    </Animate>
  );
};
