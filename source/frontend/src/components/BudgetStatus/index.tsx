// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { StatusIndicator } from "@cloudscape-design/components";

import { formatCurrency } from "sandbox-frontend/helpers/util";

interface BudgetStatusProps {
  maxSpend?: number;
}

export const BudgetStatus = ({ maxSpend }: BudgetStatusProps) => {
  return (
    <>
      {maxSpend ? (
        formatCurrency(maxSpend)
      ) : (
        <StatusIndicator type="info">No max budget</StatusIndicator>
      )}
    </>
  );
};
