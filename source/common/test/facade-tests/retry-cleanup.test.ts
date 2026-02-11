// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { SandboxAccountSchema } from "sandbox-commons/data/sandbox-account/sandbox-account.js";
import { CleanAccountRequest } from "sandbox-commons/events/clean-account-request.js";
import { Sandbox } from "sandbox-commons/innovation-sandbox.js";
import { generateSchemaData } from "sandbox-commons/test/generate-schema-data.js";
import {
  mockedAccountStore,
  mockedIsbEventBridge,
  mockedOrgsService,
} from "sandbox-commons/test/mocking/common-mocks.js";
import { createMockOf } from "sandbox-commons/test/mocking/mock-utils.js";
import { Logger } from "@aws-lambda-powertools/logger";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { DateTime } from "luxon";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

function createMockContext() {
  return {
    sandboxAccountStore: mockedAccountStore(),
    orgsService: mockedOrgsService(),
    eventBridgeClient: mockedIsbEventBridge(),
    logger: createMockOf(Logger),
    tracer: new Tracer(),
  };
}

const currentDateTime = DateTime.fromISO("2024-12-20T08:45:00.000Z", {
  zone: "utc",
}) as DateTime<true>;

describe("Sandbox.retryCleanup()", () => {
  let mockContext: ReturnType<typeof createMockContext>;

  beforeEach(() => {
    mockContext = createMockContext();
    vi.useFakeTimers();
    vi.setSystemTime(currentDateTime.toJSDate());
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test("HappyPath - RetryCleanup on account in Quarantine", async () => {
    const account = generateSchemaData(SandboxAccountSchema, {
      status: "Quarantine",
    });

    await Sandbox.retryCleanup(
      {
        sandboxAccount: account,
      },
      mockContext,
    );

    expect(mockContext.orgsService.moveAccount).toHaveBeenCalledWith(
      account,
      "Quarantine",
      "CleanUp",
    );

    expect(mockContext.eventBridgeClient.sendIsbEvents).toHaveBeenCalledWith(
      mockContext.tracer,
      new CleanAccountRequest({
        accountId: account.awsAccountId,
        reason: "Initiated by admin",
      }),
    );
  });

  test("HappyPath - RetryCleanup on account already in CleanUp OU", async () => {
    const account = generateSchemaData(SandboxAccountSchema, {
      status: "CleanUp",
    });

    await Sandbox.retryCleanup(
      {
        sandboxAccount: account,
      },
      mockContext,
    );

    expect(mockContext.orgsService.moveAccount).not.toHaveBeenCalled();

    expect(mockContext.eventBridgeClient.sendIsbEvents).toHaveBeenCalledWith(
      mockContext.tracer,
      new CleanAccountRequest({
        accountId: account.awsAccountId,
        reason: "Initiated by admin",
      }),
    );
  });
});
