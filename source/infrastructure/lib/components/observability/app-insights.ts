// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { AppInsightsLogPatterns } from "sandbox-commons/observability/logging";
import {
  getIsbTagValue,
  isbTagName,
} from "sandbox-infrastructure/helpers/tagging-helper";
import { CfnApplication } from "aws-cdk-lib/aws-applicationinsights";
import { CfnGroup } from "aws-cdk-lib/aws-resourcegroups";
import { Construct } from "constructs";

export class ApplicationInsights extends Construct {
  constructor(scope: Construct, id: string, props: { namespace: string }) {
    super(scope, id);

    const resourceGroupTags = new CfnGroup(this, `IsbTaggedResourceGroup`, {
      name: "IsbTaggedResourceGroup",
      resourceQuery: {
        query: {
          resourceTypeFilters: ["AWS::AllSupported"],
          tagFilters: [
            {
              key: isbTagName,
              values: [`${getIsbTagValue(props.namespace)}`],
            },
          ],
        },
        type: "TAG_FILTERS_1_0",
      },
    });

    const logPatternSets = [
      {
        patternSetName:
          AppInsightsLogPatterns.DataValidationWarning.patternName,
        logPatterns: [
          {
            patternName:
              AppInsightsLogPatterns.DataValidationWarning.patternName,
            pattern: AppInsightsLogPatterns.DataValidationWarning.pattern,
            rank: 1,
          },
        ],
      },
      {
        patternSetName: AppInsightsLogPatterns.EmailSendingError.patternName,
        logPatterns: [
          {
            patternName: AppInsightsLogPatterns.EmailSendingError.patternName,
            pattern: AppInsightsLogPatterns.EmailSendingError.pattern,
            rank: 3,
          },
        ],
      },
      {
        patternSetName: AppInsightsLogPatterns.AccountDrift.patternName,
        logPatterns: [
          {
            patternName: AppInsightsLogPatterns.AccountDrift.patternName,
            pattern: AppInsightsLogPatterns.EmailSendingError.pattern,
            rank: 2,
          },
        ],
      },
    ];

    new CfnApplication(this, `IsbTaggedApplication`, {
      resourceGroupName: resourceGroupTags.name,
      autoConfigurationEnabled: true,
      cweMonitorEnabled: true,
      opsCenterEnabled: false,
      logPatternSets: logPatternSets,
    });
  }
}
