// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import { z } from "zod";

import { BaseLambdaEnvironmentSchema } from "sandbox-commons/lambda/environments/base-lambda-environment.js";

export const CostAllocationTagActivatorEnvironmentSchema =
  BaseLambdaEnvironmentSchema.extend({
    ISB_TAG_NAME: z.string(),
    FOCUS_TAG_NAMES: z.string().optional().default(""),
  });

export type CostAllocationTagActivatorEnvironment = z.infer<
  typeof CostAllocationTagActivatorEnvironmentSchema
>;
