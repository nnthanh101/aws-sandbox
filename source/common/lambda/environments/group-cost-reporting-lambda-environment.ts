// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { z } from "zod";

import { BaseLambdaEnvironmentSchema } from "sandbox-commons/lambda/environments/base-lambda-environment.js";

export const GroupCostReportingLambdaEnvironmentSchema =
  BaseLambdaEnvironmentSchema.extend({
    LEASE_TABLE_NAME: z.string(),
    INTERMEDIATE_ROLE_ARN: z.string(),
    ORG_MGT_ROLE_ARN: z.string(),
    REPORT_BUCKET_NAME: z.string(),
    ISB_NAMESPACE: z.string(),
    ISB_EVENT_BUS: z.string(),
  });

export type GroupCostReportingLambdaEnvironment = z.infer<
  typeof GroupCostReportingLambdaEnvironmentSchema
>;
