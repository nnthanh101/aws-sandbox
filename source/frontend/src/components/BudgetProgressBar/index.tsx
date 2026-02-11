// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { StatusIndicator } from "@cloudscape-design/components";

import { formatCurrency } from "sandbox-frontend/helpers/util";

import styles from "./styles.module.scss";

interface BudgetProgressBarProps {
  currentValue: number;
  maxValue?: number;
}

export const BudgetProgressBar = ({
  currentValue,
  maxValue,
}: BudgetProgressBarProps) => {
  return (
    <>
      {maxValue && (
        <div className={styles.container}>
          <div className={styles.bar}>
            <div
              className={styles.progress}
              style={{ width: `${(currentValue / maxValue) * 100}%` }}
            />
          </div>
          <div className={styles.label}>${maxValue}</div>
        </div>
      )}
      {!maxValue && (
        <StatusIndicator data-small type="warning">
          No max budget
        </StatusIndicator>
      )}
      <div className={styles.label}>{formatCurrency(currentValue ?? 0)}</div>
    </>
  );
};
