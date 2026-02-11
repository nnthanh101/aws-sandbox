// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import { z } from "zod";

import { BaseLambdaEnvironmentSchema } from "sandbox-commons/lambda/environments/base-lambda-environment.js";

export const GetRootOuIdLambdaEnvironmentSchema =
  BaseLambdaEnvironmentSchema.extend({});

export type GetRootOuIdLambdaEnvironment = z.infer<
  typeof GetRootOuIdLambdaEnvironmentSchema
>;
