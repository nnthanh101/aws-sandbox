// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
  IsbLambdaFunction,
  IsbLambdaFunctionProps,
} from "sandbox-infrastructure/components/isb-lambda-function";
import { IsbLogGroups } from "sandbox-infrastructure/components/observability/log-groups";
import { addCfnGuardSuppression } from "sandbox-infrastructure/helpers/cfn-guard";
import { CustomResource } from "aws-cdk-lib";
import { Provider } from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
import { z } from "zod";

interface IsbLambdaFunctionCRProps<T extends z.ZodSchema<any>>
  extends IsbLambdaFunctionProps<T> {
  customResourceType: `Custom::${string}`;
  customResourceProperties?: { [p: string]: any };
}

export class IsbLambdaFunctionCustomResource<
  T extends z.ZodSchema<any>,
> extends IsbLambdaFunction<T> {
  readonly provider: Provider;
  readonly customResource: CustomResource;

  constructor(
    scope: Construct,
    id: string,
    props: IsbLambdaFunctionCRProps<T>,
  ) {
    if (!props.logGroup) {
      props.logGroup = IsbLogGroups.customResourceLogGroup(
        scope,
        props.namespace,
      );
    }
    super(scope, id, props);

    this.provider = new Provider(this, "IsbProvider", {
      onEventHandler: this.lambdaFunction,
      logGroup: IsbLogGroups.customResourceLogGroup(scope, props.namespace),
    });

    this.customResource = new CustomResource(this, "IsbCustomResource", {
      resourceType: props.customResourceType,
      serviceToken: this.provider.serviceToken,
      properties: props.customResourceProperties,
    });

    addCfnGuardSuppression(this.provider.node.findChild("framework-onEvent"), [
      "LAMBDA_INSIDE_VPC",
      "LAMBDA_CONCURRENCY_CHECK",
    ]);
  }
}
