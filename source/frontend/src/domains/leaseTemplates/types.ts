// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
  LeaseTemplate,
  Visibility,
} from "sandbox-commons/data/lease-template/lease-template";

export type LeaseTemplateFormData = LeaseTemplate & {
  maxBudgetEnabled?: boolean;
  maxDurationEnabled?: boolean;
  visibility: {
    label: string;
    value: Visibility;
  };
  costReportGroupEnabled?: boolean;
  selectedCostReportGroup?: {
    label: string;
    value: string;
  };
};

export type NewLeaseTemplate = Omit<LeaseTemplate, "uuid">;
