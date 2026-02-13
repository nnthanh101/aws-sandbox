// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { CfnResource, Tags } from "aws-cdk-lib";
import { IConstruct } from "constructs";

export const isbTagName = "aws-solutions:isb-id";
export const isbTagValueSuffix = "_isb";

/**
 * Enterprise cost allocation tag keys (FOCUS 1.2+ compatible, multi-cloud AWS/Azure).
 * Ref: enterprise tagging standard v1.1.10, FinOps FOCUS 1.2 Tags column.
 */
export const focusCostAllocationTagKeys = [
  "CostCenter",
  "Environment",
  "Project",
  "Owner",
  "ManagedBy",
  "DataClassification",
] as const;

export type FocusCostAllocationTagKey = (typeof focusCostAllocationTagKeys)[number];

export function applyIsbTag(scope: IConstruct, namespace: string) {
  tagAll(scope, {
    tagName: isbTagName,
    tagValue: `${getIsbTagValue(namespace)}`,
  });
}

/**
 * Tags all resources within a scope
 * Using Aspects or Tag.of on the stack results in
 * We detected an Aspect was added via another Aspect, and will not be applied [ack: @aws-cdk/core:ignoredAspect]
 */
export function tagAll(
  scope: IConstruct,
  options: {
    tagName: string;
    tagValue: string;
    excludeResourceTypes?: string[];
  },
) {
  scope.node.findAll().forEach((node: IConstruct) => {
    if (node instanceof CfnResource) {
      const shouldExclude = options.excludeResourceTypes?.includes(
        node.cfnResourceType,
      );
      if (!shouldExclude) {
        Tags.of(node).add(options.tagName, options.tagValue);
      }
    }
  });
}

export function getIsbTagValue(namespace: string) {
  return `${namespace}${isbTagValueSuffix}`;
}
