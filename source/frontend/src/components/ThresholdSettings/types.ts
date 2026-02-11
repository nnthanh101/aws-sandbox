// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { ThresholdAction } from "sandbox-commons/data/lease-template/lease-template";

export interface Threshold {
  value?: number;
  action?: ThresholdAction;
}
