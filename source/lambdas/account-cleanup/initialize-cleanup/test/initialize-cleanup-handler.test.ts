// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { GlobalConfigSchema } from "sandbox-commons/data/global-config/global-config.js";
import { DynamoSandboxAccountStore } from "sandbox-commons/data/sandbox-account/dynamo-sandbox-account-store.js";
import { SandboxAccountSchema } from "sandbox-commons/data/sandbox-account/sandbox-account.js";
import { InitializeCleanupLambdaEnvironmentSchema } from "sandbox-commons/lambda/environments/initialize-cleanup-lambda-environment.js";
import { EnvironmentValidatorError } from "sandbox-commons/lambda/middleware/environment-validator.js";
import { generateSchemaData } from "sandbox-commons/test/generate-schema-data.js";
import { mockContext } from "sandbox-commons/test/lambdas/fixtures.js";
import {
  bulkStubEnv,
  mockAppConfigMiddleware,
} from "sandbox-commons/test/lambdas/utils.js";
import { InitializeCleanupLambdaEvent } from "sandbox-initialize-cleanup/initialize-cleanup-handler.js";
import {
  DescribeExecutionCommand,
  ExecutionDoesNotExist,
  SFNClient,
} from "@aws-sdk/client-sfn";
import { mockClient } from "aws-sdk-client-mock";

const testEnv = generateSchemaData(InitializeCleanupLambdaEnvironmentSchema);
let handler: typeof import("sandbox-initialize-cleanup/initialize-cleanup-handler.js").handler;
const sfnClient = mockClient(SFNClient);
const mockedGlobalConfig = generateSchemaData(GlobalConfigSchema);

beforeAll(async () => {
  bulkStubEnv(testEnv);

  handler = (
    await import(
      "sandbox-initialize-cleanup/initialize-cleanup-handler.js"
    )
  ).handler;
});

beforeEach(() => {
  bulkStubEnv(testEnv);
  mockAppConfigMiddleware(mockedGlobalConfig);
});

afterEach(() => {
  sfnClient.reset();
  vi.resetAllMocks();
  vi.unstubAllEnvs();
});

describe("InitializeCleanup Handler", async () => {
  it("should throw error when environment variables are misconfigured", async () => {
    const event: InitializeCleanupLambdaEvent = {
      accountId: "000000000000",
      cleanupExecutionContext: {
        stateMachineExecutionArn:
          "arn:aws:states:us-east-1:000000000000:execution:00000000-0000-0000-0000-000000000000:00000000-0000-0000-0000-000000000000",
        stateMachineExecutionStartTime: "2024-01-01T00:00:00.000Z",
      },
    };

    vi.unstubAllEnvs();

    await expect(
      handler(event, mockContext(testEnv, mockedGlobalConfig)),
    ).rejects.toThrow(EnvironmentValidatorError);
  });

  it("should update account with execution data if no cleanup execution is in progress", async () => {
    const mockedAccount = generateSchemaData(SandboxAccountSchema, {
      status: "CleanUp",
      cleanupExecutionContext: undefined,
    });

    const event: InitializeCleanupLambdaEvent = {
      accountId: mockedAccount.awsAccountId,
      cleanupExecutionContext: {
        stateMachineExecutionArn:
          "arn:aws:states:us-east-1:000000000000:execution:00000000-0000-0000-0000-000000000000:00000000-0000-0000-0000-000000000000",
        stateMachineExecutionStartTime: "2024-01-01T00:00:00.000Z",
      },
    };

    const getAccountSpy = vi
      .spyOn(DynamoSandboxAccountStore.prototype, "get")
      .mockResolvedValue({
        result: mockedAccount,
      });

    const putAccountSpy = vi
      .spyOn(DynamoSandboxAccountStore.prototype, "put")
      .mockResolvedValue({
        newItem: {
          ...mockedAccount,
          cleanupExecutionContext: {
            stateMachineExecutionArn:
              event.cleanupExecutionContext.stateMachineExecutionArn,
            stateMachineExecutionStartTime:
              event.cleanupExecutionContext.stateMachineExecutionStartTime,
          },
        },
        oldItem: mockedAccount,
      });

    sfnClient.on(DescribeExecutionCommand).resolves({ status: "SUCCEEDED" });

    expect(
      await handler(event, mockContext(testEnv, mockedGlobalConfig)),
    ).toEqual({
      cleanupAlreadyInProgress: false,
      globalConfig: mockedGlobalConfig,
    });

    expect(getAccountSpy).toHaveBeenCalledOnce();
    expect(putAccountSpy).toHaveBeenCalledOnce();
  });

  it("should detect inprogress execution", async () => {
    const mockedAccount = generateSchemaData(SandboxAccountSchema, {
      status: "CleanUp",
    });

    const event: InitializeCleanupLambdaEvent = {
      accountId: mockedAccount.awsAccountId,
      cleanupExecutionContext: {
        stateMachineExecutionArn:
          "arn:aws:states:us-east-1:000000000000:execution:00000000-0000-0000-0000-000000000000:00000000-0000-0000-0000-000000000000",
        stateMachineExecutionStartTime: "2024-01-01T00:00:00.000Z",
      },
    };

    const getAccountSpy = vi
      .spyOn(DynamoSandboxAccountStore.prototype, "get")
      .mockResolvedValue({
        result: mockedAccount,
      });

    sfnClient.on(DescribeExecutionCommand).resolves({ status: "RUNNING" });

    expect(
      await handler(event, mockContext(testEnv, mockedGlobalConfig)),
    ).toEqual({ cleanupAlreadyInProgress: true });

    expect(getAccountSpy).toHaveBeenCalledOnce();
  });

  it("should proceed with cleanup when execution no longer exists (ExecutionDoesNotExist error)", async () => {
    const mockedAccount = generateSchemaData(SandboxAccountSchema, {
      status: "CleanUp",
      cleanupExecutionContext: {
        stateMachineExecutionArn:
          "arn:aws:states:us-east-1:000000000000:execution:00000000-0000-0000-0000-000000000000:old-execution-id",
        stateMachineExecutionStartTime: "2024-01-01T00:00:00.000Z",
      },
    });

    const event: InitializeCleanupLambdaEvent = {
      accountId: mockedAccount.awsAccountId,
      cleanupExecutionContext: mockedAccount.cleanupExecutionContext!,
    };

    const getAccountSpy = vi
      .spyOn(DynamoSandboxAccountStore.prototype, "get")
      .mockResolvedValue({
        result: mockedAccount,
      });

    const putAccountSpy = vi
      .spyOn(DynamoSandboxAccountStore.prototype, "put")
      .mockResolvedValue({
        newItem: {
          ...mockedAccount,
          cleanupExecutionContext: event.cleanupExecutionContext,
        },
        oldItem: mockedAccount,
      });

    // Simulate ExecutionDoesNotExist error (execution history deleted after 90 days)
    sfnClient.on(DescribeExecutionCommand).rejects(
      new ExecutionDoesNotExist({
        message: "Execution does not exist",
        $metadata: {},
      }),
    );

    expect(
      await handler(event, mockContext(testEnv, mockedGlobalConfig)),
    ).toEqual({
      cleanupAlreadyInProgress: false,
      globalConfig: mockedGlobalConfig,
    });

    expect(getAccountSpy).toHaveBeenCalledOnce();
    expect(putAccountSpy).toHaveBeenCalledOnce();
  });

  it.each([
    { accountId: testEnv.ORG_MGT_ACCOUNT_ID },
    { accountId: testEnv.IDC_ACCOUNT_ID },
    { accountId: testEnv.HUB_ACCOUNT_ID },
  ])(
    "should throw error when a control plane account is provided to the account cleaner",
    async ({ accountId }) => {
      const mockedAccount = generateSchemaData(SandboxAccountSchema, {
        awsAccountId: accountId,
        status: "CleanUp",
        cleanupExecutionContext: undefined,
      });

      const event: InitializeCleanupLambdaEvent = {
        accountId: mockedAccount.awsAccountId,
        cleanupExecutionContext: {
          stateMachineExecutionArn:
            "arn:aws:states:us-east-1:000000000000:execution:00000000-0000-0000-0000-000000000000:00000000-0000-0000-0000-000000000000",
          stateMachineExecutionStartTime: "2024-01-01T00:00:00.000Z",
        },
      };

      const getAccountSpy = vi
        .spyOn(DynamoSandboxAccountStore.prototype, "get")
        .mockResolvedValue({
          result: mockedAccount,
        });

      const putAccountSpy = vi
        .spyOn(DynamoSandboxAccountStore.prototype, "put")
        .mockResolvedValue({
          newItem: {
            ...mockedAccount,
            cleanupExecutionContext: {
              stateMachineExecutionArn:
                event.cleanupExecutionContext.stateMachineExecutionArn,
              stateMachineExecutionStartTime:
                event.cleanupExecutionContext.stateMachineExecutionStartTime,
            },
          },
          oldItem: mockedAccount,
        });

      sfnClient.on(DescribeExecutionCommand).resolves({ status: "SUCCEEDED" });

      await expect(
        handler(event, mockContext(testEnv, mockedGlobalConfig)),
      ).rejects.toThrow(
        `Account ${event.accountId} is an ISB administration account. Aborting cleanup.`,
      );

      expect(getAccountSpy).not.toHaveBeenCalled();
      expect(putAccountSpy).not.toHaveBeenCalled();
      expect(sfnClient.calls()).toHaveLength(0);
    },
  );
});
