// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { CostAllocationTagActivatorEnvironmentSchema } from "sandbox-commons/lambda/environments/cost-allocation-tag-activator-environment";
import { IsbLambdaFunctionCustomResource } from "sandbox-infrastructure/components/isb-lambda-function-custom-resource";
import { isbTagName, focusCostAllocationTagKeys } from "sandbox-infrastructure/helpers/tagging-helper";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import path from "path";

export interface CostAllocationTagActivatorProps {
  namespace: string;
}

export class CostAllocationTagActivator extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: CostAllocationTagActivatorProps,
  ) {
    super(scope, id);

    const costAllocationCR = new IsbLambdaFunctionCustomResource(
      this,
      "CostAllocationTagActivator",
      {
        description:
          "Custom resource lambda that activates the cost allocation tag",
        entry: path.join(
          __dirname,
          "..",
          "..",
          "..",
          "..",
          "lambdas",
          "custom-resources",
          "cost-allocation-tag-activator",
          "src",
          "cost-allocation-tag-activator-handler.ts",
        ),
        handler: "handler",
        namespace: props.namespace,
        environment: {
          ISB_TAG_NAME: isbTagName,
          FOCUS_TAG_NAMES: focusCostAllocationTagKeys.join(","),
        },
        envSchema: CostAllocationTagActivatorEnvironmentSchema,
        customResourceType: "Custom::CostAllocationTag",
      },
    );

    costAllocationCR.lambdaFunction.addToRolePolicy(
      new PolicyStatement({
        actions: ["ce:UpdateCostAllocationTagsStatus"],
        resources: ["*"],
      }),
    );
  }
}
