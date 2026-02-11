// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import { Construct } from "constructs";

import { DeploymentSummaryLambda } from "sandbox-infrastructure/components/observability/deployment-summary-lambda";
import { LogMetricsSubscriber } from "sandbox-infrastructure/components/observability/log-subscription-lambda";

export type AnonymizedMetricsProps = {
  namespace: string;
  metricsUrl: string;
  solutionId: string;
  solutionVersion: string;
  deploymentUUID: string;
  hubAccountId: string;
  orgManagementAccountId: string;
  isStableTaggingEnabled: string;
};

export class AnonymizedMetricsReporting extends Construct {
  constructor(scope: Construct, id: string, props: AnonymizedMetricsProps) {
    super(scope, id);

    new DeploymentSummaryLambda(this, "HeartbeatMetrics", props);
    new LogMetricsSubscriber(this, "LogMetrics", props);
  }
}
