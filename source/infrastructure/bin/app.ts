#!/usr/bin/env node
// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import * as cdk from "aws-cdk-lib";

import { getSolutionContext } from "sandbox-infrastructure/helpers/cdk-context";
import { IsbAccountPoolStack } from "sandbox-infrastructure/isb-account-pool-stack";
import { IsbComputeStack } from "sandbox-infrastructure/isb-compute-stack";
import { IsbDataStack } from "sandbox-infrastructure/isb-data-stack";
import { IsbIdcStack } from "sandbox-infrastructure/isb-idc-stack";
import { SolutionsEngineeringSynthesizer } from "sandbox-infrastructure/stack-synthesizers/solutions-engineering-synthesizer";

const app = new cdk.App();

const context = getSolutionContext(app.node);

// Enterprise Cost Allocation Tags (FOCUS 1.2+ compatible, multi-cloud AWS/Azure)
// Ref: enterprise tagging standard v1.1.10 (Tier 1-2), FinOps FOCUS Tags column
cdk.Tags.of(app).add("CostCenter", "sandbox");
cdk.Tags.of(app).add("Environment", context.deploymentMode);
cdk.Tags.of(app).add("Project", context.solutionName);
cdk.Tags.of(app).add("Owner", "platform-team");
cdk.Tags.of(app).add("ManagedBy", "cdk");
cdk.Tags.of(app).add("DataClassification", "internal");

const synthesizer = new SolutionsEngineeringSynthesizer({
  generateBootstrapVersionRule: false,
  fileAssetsBucketName:
    context.distOutputBucket && `${context.distOutputBucket}-\${AWS::Region}`,
  bucketPrefix: context.bucketPrefix,
  outdir: app.outdir,
});

new IsbAccountPoolStack(app, "Sandbox-AccountPool", {
  description: `(${context.solutionId}) ${context.solutionName} ${context.version}`,
  synthesizer: synthesizer,
});

new IsbIdcStack(app, "Sandbox-IDC", {
  description: `(${context.solutionId}-IdcStack) ${context.solutionName} ${context.version}`,
  synthesizer: synthesizer,
});

new IsbDataStack(app, "Sandbox-Data", {
  description: `(${context.solutionId}-DataStack) ${context.solutionName} ${context.version}`,
  synthesizer: synthesizer,
});

new IsbComputeStack(app, "Sandbox-Compute", {
  description: `(${context.solutionId}-ComputeStack) ${context.solutionName} ${context.version}`,
  synthesizer: synthesizer,
});
