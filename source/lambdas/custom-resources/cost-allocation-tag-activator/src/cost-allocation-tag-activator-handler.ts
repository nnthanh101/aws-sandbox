// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import { Logger } from "@aws-lambda-powertools/logger";
import { Tracer } from "@aws-lambda-powertools/tracer";
import type {
  CdkCustomResourceEvent,
  CdkCustomResourceResponse,
  CloudFormationCustomResourceCreateEvent,
  CloudFormationCustomResourceDeleteEvent,
  CloudFormationCustomResourceUpdateEvent,
  Context,
} from "aws-lambda";

import {
  CostAllocationTagActivatorEnvironment,
  CostAllocationTagActivatorEnvironmentSchema,
} from "sandbox-commons/lambda/environments/cost-allocation-tag-activator-environment.js";
import baseMiddlewareBundle from "sandbox-commons/lambda/middleware/base-middleware-bundle.js";
import { ValidatedEnvironment } from "sandbox-commons/lambda/middleware/environment-validator.js";
import { IsbClients } from "sandbox-commons/sdk-clients/index.js";
import { UpdateCostAllocationTagsStatusCommand } from "@aws-sdk/client-cost-explorer";

type CostAllocationTagActivatorContext = Context &
  ValidatedEnvironment<CostAllocationTagActivatorEnvironment>;

const tracer = new Tracer();
const logger = new Logger();

const onCreateOrUpdate = async (
  event:
    | CloudFormationCustomResourceCreateEvent
    | CloudFormationCustomResourceUpdateEvent,
  context: CostAllocationTagActivatorContext,
): Promise<CdkCustomResourceResponse> => {
  let successStatus = "";
  try {
    const ceClient = IsbClients.costExplorer(context.env);
    const focusTagNames = context.env.FOCUS_TAG_NAMES
      ? context.env.FOCUS_TAG_NAMES.split(",").filter(Boolean)
      : [];
    const allTagKeys = [context.env.ISB_TAG_NAME, ...focusTagNames];
    const command = new UpdateCostAllocationTagsStatusCommand({
      CostAllocationTagsStatus: allTagKeys.map((tagKey) => ({
        TagKey: tagKey,
        Status: "Active",
      })),
    });
    await ceClient.send(command);
    successStatus = "success";
  } catch (error) {
    logger.warn("Error activating cost allocation tags", error as Error);
    successStatus = "failed";
  }
  return {
    Data: {
      status: successStatus,
    },
    PhysicalResourceId:
      (event as any).PhysicalResourceId ?? "IsbCostAllocationTagActivator",
  };
};

const onDelete = async (
  event: CloudFormationCustomResourceDeleteEvent,
  context: CostAllocationTagActivatorContext,
): Promise<CdkCustomResourceResponse> => {
  let successStatus = "";
  try {
    const ceClient = IsbClients.costExplorer(context.env);
    const focusTagNames = context.env.FOCUS_TAG_NAMES
      ? context.env.FOCUS_TAG_NAMES.split(",").filter(Boolean)
      : [];
    const allTagKeys = [context.env.ISB_TAG_NAME, ...focusTagNames];
    const command = new UpdateCostAllocationTagsStatusCommand({
      CostAllocationTagsStatus: allTagKeys.map((tagKey) => ({
        TagKey: tagKey,
        Status: "Inactive",
      })),
    });
    await ceClient.send(command);
    successStatus = "success";
  } catch (error) {
    logger.warn("Error deactivating cost allocation tags", error as Error);
    successStatus = "failed";
  }
  return {
    Data: {
      status: successStatus,
    },
    PhysicalResourceId: event.PhysicalResourceId,
  };
};

const lambdaHandler = async (
  event: CdkCustomResourceEvent,
  context: CostAllocationTagActivatorContext,
): Promise<CdkCustomResourceResponse> => {
  switch (event.RequestType) {
    case "Create":
    case "Update":
      logger.info("Isb CostAllocation Tag Activator on Create / Update");
      return onCreateOrUpdate(event, context);
    case "Delete":
      logger.info("Isb Cost Allocation Tag Activator on Delete");
      return onDelete(event, context);
  }
};

export const handler = baseMiddlewareBundle({
  logger,
  tracer,
  environmentSchema: CostAllocationTagActivatorEnvironmentSchema,
  moduleName: "cost-allocation-tag-activator",
}).handler(lambdaHandler);
