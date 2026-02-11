// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import { CfnResource } from "aws-cdk-lib";
import type { IConstruct } from "constructs";

export function addCfnGuardSuppression(
  construct: IConstruct,
  suppressions: string[],
) {
  const cfnResource = construct.node.defaultChild as CfnResource;
  if (!cfnResource?.cfnOptions) {
    throw new Error(
      `Resource ${cfnResource?.logicalId} has no cfnOptions, unable to add cfn-guard suppression`,
    );
  }
  const existingSuppressions: string[] =
    cfnResource.cfnOptions.metadata?.guard?.SuppressedRules;
  if (existingSuppressions) {
    existingSuppressions.push(...suppressions);
  } else {
    cfnResource.cfnOptions.metadata = {
      ...cfnResource.cfnOptions.metadata,
      guard: {
        SuppressedRules: [...suppressions],
      },
    };
  }
}
