// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import {
  getGlobalConfigForUI,
  GlobalConfigSchema,
} from "sandbox-commons/data/global-config/global-config.js";
import { ReportingConfigSchema } from "sandbox-commons/data/reporting-config/reporting-config.js";
import { ConfigurationLambdaEnvironmentSchema } from "sandbox-commons/lambda/environments/config-lambda-environment.js";
import { generateSchemaData } from "sandbox-commons/test/generate-schema-data.js";
import {
  createAPIGatewayProxyEvent,
  createErrorResponseBody,
  isbAuthorizedUser,
  mockAuthorizedContext,
  responseHeaders,
} from "sandbox-commons/test/lambdas/fixtures.js";
import {
  bulkStubEnv,
  mockAppConfigMiddleware,
} from "sandbox-commons/test/lambdas/utils.js";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const testEnv = generateSchemaData(ConfigurationLambdaEnvironmentSchema);
const mockedGlobalConfig = generateSchemaData(GlobalConfigSchema);
const mockedReportingConfig = generateSchemaData(ReportingConfigSchema);
let handler: typeof import("sandbox-configurations/configurations-handler.js").handler;

beforeAll(async () => {
  bulkStubEnv(testEnv);

  handler = (
    await import(
      "sandbox-configurations/configurations-handler.js"
    )
  ).handler;
});

beforeEach(() => {
  bulkStubEnv(testEnv);
  mockAppConfigMiddleware(mockedGlobalConfig, mockedReportingConfig);
});

afterEach(() => {
  vi.resetAllMocks();
  vi.unstubAllEnvs();
});

describe("Configurations Handler", async () => {
  it("should return 500 response when environment variables are misconfigured", async () => {
    vi.unstubAllEnvs();

    const event = createAPIGatewayProxyEvent({
      httpMethod: "GET",
      path: "/configurations",
      headers: {
        Authorization: `Bearer ${isbAuthorizedUser.token}`,
      },
    });
    expect(await handler(event, mockAuthorizedContext(testEnv))).toEqual({
      statusCode: 500,
      body: createErrorResponseBody("An unexpected error occurred."),
      headers: responseHeaders,
    });
  });

  describe("GET /configurations", () => {
    it("should return 200 with all configurations", async () => {
      const event = createAPIGatewayProxyEvent({
        httpMethod: "GET",
        path: "/configurations",
        headers: {
          Authorization: `Bearer ${isbAuthorizedUser.token}`,
        },
      });
      const context = mockAuthorizedContext(testEnv);
      const expectedGlobalConfig = getGlobalConfigForUI(
        mockedGlobalConfig,
        context.env.ISB_MANAGED_REGIONS.split(","),
      );
      const expectedReportingConfig = mockedReportingConfig;
      expect(await handler(event, context)).toEqual({
        statusCode: 200,
        body: JSON.stringify({
          status: "success",
          data: {
            ...expectedGlobalConfig,
            ...expectedReportingConfig,
          },
        }),
        headers: responseHeaders,
      });
    });
  });
});
