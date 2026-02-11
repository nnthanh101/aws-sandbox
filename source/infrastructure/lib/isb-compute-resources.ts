// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import { Aws, CfnOutput } from "aws-cdk-lib";
import { ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

import { AccountCleaner } from "sandbox-infrastructure/components/account-cleaner/account-cleaner";
import { RestApi } from "sandbox-infrastructure/components/api/rest-api-all";
import { CloudfrontUiApi } from "sandbox-infrastructure/components/cloudfront/cloudfront-ui-api";
import { DeploymentUUID } from "sandbox-infrastructure/components/custom-resources/deployment-uuid";
import { IsbInternalCore } from "sandbox-infrastructure/components/events/isb-internal-core";
import { IsbKmsKeys } from "sandbox-infrastructure/components/kms";
import { AnonymizedMetricsReporting } from "sandbox-infrastructure/components/observability/anonymized-metrics-reporting";
import { CostReportingLambda } from "sandbox-infrastructure/components/observability/cost-reporting-lambda";
import { LogArchiving } from "sandbox-infrastructure/components/observability/log-archiving";
import { IsbLogGroups } from "sandbox-infrastructure/components/observability/log-groups";
import { LogInsightsQueries } from "sandbox-infrastructure/components/observability/log-insights-queries";
import { getContextFromMapping } from "sandbox-infrastructure/helpers/cdk-context";
import { addCfnGuardSuppression } from "sandbox-infrastructure/helpers/cfn-guard";
import { YesNoParameter } from "sandbox-infrastructure/helpers/cfn-utils";
import { IntermediateRole } from "sandbox-infrastructure/helpers/isb-roles";
import { GroupCostReportingLambda } from "./components/observability/group-cost-reporting-lambda";

export interface IsbComputeResourcesProps {
  namespace: string;
  orgMgtAccountId: string;
  idcAccountId: string;
  allowListedCidr: string[];
  useStableTaggingParameter: YesNoParameter;
}

export class IsbComputeResources {
  public static namespace: string;
  public static globalLogGroup: LogGroup;
  public static cleanupLogGroup: LogGroup;

  constructor(scope: Construct, props: IsbComputeResourcesProps) {
    //init global log group for use by rest of solution
    const kmsKey = IsbKmsKeys.get(scope, props.namespace);
    kmsKey.grantEncryptDecrypt(
      new ServicePrincipal("logs.amazonaws.com", { region: Aws.REGION }),
    );

    IsbComputeResources.namespace = props.namespace;
    IsbComputeResources.globalLogGroup = IsbLogGroups.globalLogGroup(
      scope,
      props.namespace,
    );
    IsbComputeResources.cleanupLogGroup = IsbLogGroups.cleanupLogGroup(
      scope,
      props.namespace,
    );

    kmsKey.grantEncryptDecrypt(new ServicePrincipal("events.amazonaws.com"));
    //log group initialized

    const deploymentUUID = new DeploymentUUID(scope, "DeploymentUUID", {
      namespace: props.namespace,
    });

    const intermediateRole = IntermediateRole.getInstance(scope, {
      namespace: props.namespace,
      idcAccountId: props.idcAccountId,
      orgMgtAccountId: props.orgMgtAccountId,
    });

    addCfnGuardSuppression(intermediateRole, [
      "CFN_NO_EXPLICIT_RESOURCE_NAMES",
    ]);

    const isbInternalCore = new IsbInternalCore(scope, {
      namespace: props.namespace,
      kmsKey,
      orgMgtAccountId: props.orgMgtAccountId,
      idcAccountId: props.idcAccountId,
    });

    new AccountCleaner(scope, "AccountCleaner", {
      eventBus: isbInternalCore.eventBus,
      namespace: props.namespace,
      orgMgtAccountId: props.orgMgtAccountId,
      idcAccountId: props.idcAccountId,
      useStableTaggingCondition: props.useStableTaggingParameter.getCondition(),
    });

    const restApi = new RestApi(scope, "IsbRestApi", {
      intermediateRole: intermediateRole,
      namespace: props.namespace,
      idcAccountId: props.idcAccountId,
      orgMgtAccountId: props.orgMgtAccountId,
      isbEventBus: isbInternalCore.eventBus,
      allowListedCidr: props.allowListedCidr,
    });

    new CloudfrontUiApi(scope, "CloudFrontUiApi", {
      restApi,
      namespace: props.namespace,
    });

    new LogInsightsQueries(scope, "LogInsightsQueries", {
      namespace: props.namespace,
    });

    new AnonymizedMetricsReporting(scope, "AnonymizedMetrics", {
      metricsUrl: "https://metrics.awssolutionsbuilder.com/generic",
      solutionId: getContextFromMapping(scope, "solutionId"),
      solutionVersion: getContextFromMapping(scope, "version"),
      deploymentUUID: deploymentUUID.deploymentUUID,
      namespace: props.namespace,
      hubAccountId: props.orgMgtAccountId,
      orgManagementAccountId: props.orgMgtAccountId,
      isStableTaggingEnabled: props.useStableTaggingParameter.valueAsString,
    });

    new CostReportingLambda(scope, "CostReportingLambda", {
      namespace: props.namespace,
      orgMgtAccountId: props.orgMgtAccountId,
      idcAccountId: props.idcAccountId,
    });

    new GroupCostReportingLambda(scope, "GroupCostReportingLambda", {
      namespace: props.namespace,
      orgMgtAccountId: props.orgMgtAccountId,
      isbEventBus: isbInternalCore.eventBus,
    });

    new LogArchiving(scope, "LogArchiving", {
      namespace: props.namespace,
    });

    new CfnOutput(scope, "DeploymentUUIDOutput", {
      value: deploymentUUID.deploymentUUID,
    });
  }
}
