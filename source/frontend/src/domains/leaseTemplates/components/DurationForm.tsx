// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { componentTypes } from "@aws-northstar/ui";

import { LeaseTemplate } from "sandbox-commons/data/lease-template/lease-template";
import { Form } from "sandbox-frontend/components/Form";
import { thresholdValidator } from "sandbox-frontend/components/ThresholdSettings/validator";
import { durationFields } from "sandbox-frontend/domains/leaseTemplates/formFields/duration";

type DurationFormProps = {
  leaseDurationInHours: LeaseTemplate["leaseDurationInHours"];
  durationThresholds: LeaseTemplate["durationThresholds"];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isUpdating?: boolean;
  globalMaxDuration?: number;
};

export type DurationFormData = {
  leaseDurationInHours: LeaseTemplate["leaseDurationInHours"];
  durationThresholds: LeaseTemplate["durationThresholds"];
  maxDurationEnabled: boolean;
};
export const DurationForm = ({
  leaseDurationInHours,
  durationThresholds,
  onSubmit,
  onCancel,
  isUpdating,
  globalMaxDuration,
}: DurationFormProps) => {
  return (
    <Form
      insideTab
      isSubmitting={isUpdating}
      onCancel={onCancel}
      onSubmit={onSubmit}
      initialValues={{
        leaseDurationInHours,
        durationThresholds,
        maxDurationEnabled:
          leaseDurationInHours === undefined ? false : leaseDurationInHours > 0,
      }}
      validate={(data) => {
        const formValues = data as DurationFormData;
        const validateDuration = thresholdValidator("duration");

        const durationError = validateDuration(
          formValues.durationThresholds,
          formValues,
        );

        if (durationError) {
          return {
            durationThresholds: durationError,
          };
        }
      }}
      schema={{
        submitLabel: "Update Duration Settings",
        fields: [
          {
            component: componentTypes.SUB_FORM,
            ...durationFields({
              alwaysShowValidationErrors: true,
              globalMaxDuration,
            }),
          },
        ],
      }}
    />
  );
};
