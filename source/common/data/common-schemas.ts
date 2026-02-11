// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import z from "zod";

export const FreeTextSchema = z.string().max(1000);

export const AwsAccountIdSchema = z.string().regex(/^\d{12}$/, {
  message: "AWS Account ID must be exactly 12 digits",
});
