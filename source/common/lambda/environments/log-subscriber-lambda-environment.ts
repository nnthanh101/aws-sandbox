// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import { z } from "zod";

import { BaseLambdaEnvironmentSchema } from "sandbox-commons/lambda/environments/base-lambda-environment.js";

export const LogSubscriberLambdaEnvironmentSchema =
  BaseLambdaEnvironmentSchema.extend({
    METRICS_URL: z.string(),
    SOLUTION_ID: z.string(),
    SOLUTION_VERSION: z.string(),
    METRICS_UUID: z.string(),
    HUB_ACCOUNT_ID: z.string(),
  });

export type LogSubscriberLambdaEnvironment = z.infer<
  typeof LogSubscriberLambdaEnvironmentSchema
>;
