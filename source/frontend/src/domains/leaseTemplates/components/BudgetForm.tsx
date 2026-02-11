// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { componentTypes } from "@aws-northstar/ui";

import { LeaseTemplate } from "sandbox-commons/data/lease-template/lease-template";
import { Form } from "sandbox-frontend/components/Form";
import { thresholdValidator } from "sandbox-frontend/components/ThresholdSettings/validator";
import { budgetFields } from "sandbox-frontend/domains/leaseTemplates/formFields/budget";

type BudgetFormProps = {
  maxSpend: LeaseTemplate["maxSpend"];
  budgetThresholds: LeaseTemplate["budgetThresholds"];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isUpdating?: boolean;
  globalMaxBudget?: number;
};

export type BudgetFormData = {
  maxSpend: LeaseTemplate["maxSpend"];
  budgetThresholds: LeaseTemplate["budgetThresholds"];
  maxBudgetEnabled: boolean;
};

export const BudgetForm = ({
  maxSpend,
  budgetThresholds,
  onSubmit,
  onCancel,
  isUpdating,
  globalMaxBudget,
}: BudgetFormProps) => {
  return (
    <Form
      insideTab
      isSubmitting={isUpdating}
      onCancel={onCancel}
      onSubmit={onSubmit}
      initialValues={{
        maxSpend,
        budgetThresholds,
        maxBudgetEnabled: maxSpend === undefined ? false : maxSpend > 0,
      }}
      validate={(data) => {
        const formValues = data as BudgetFormData;
        const validateBudget = thresholdValidator("budget");

        const budgetError = validateBudget(
          formValues.budgetThresholds,
          formValues,
        );

        if (budgetError) {
          return {
            budgetThresholds: budgetError,
          };
        }
      }}
      schema={{
        submitLabel: "Update Budget Settings",
        fields: [
          {
            component: componentTypes.SUB_FORM,
            ...budgetFields({
              alwaysShowValidationErrors: true,
              globalMaxBudget,
            }),
          },
        ],
      }}
    />
  );
};
