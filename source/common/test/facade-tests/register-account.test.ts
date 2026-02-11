// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { CleanAccountRequest } from "sandbox-commons/events/clean-account-request.js";
import {
  CouldNotFindAccountError,
  Sandbox,
} from "sandbox-commons/innovation-sandbox.js";
import { IsbEventBridgeClient } from "sandbox-commons/sdk-clients/event-bridge-client.js";
import {
  mockedIdcService,
  mockedOrgsService,
} from "sandbox-commons/test/mocking/common-mocks.js";
import { createMockOf } from "sandbox-commons/test/mocking/mock-utils.js";
import { Logger } from "@aws-lambda-powertools/logger";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

function createMockContext() {
  return {
    eventBridgeClient: createMockOf(IsbEventBridgeClient),
    orgsService: mockedOrgsService(),
    idcService: mockedIdcService(),
    logger: new Logger(),
    tracer: new Tracer(),
  };
}

describe("Sandbox.registerAccount()", () => {
  let mockContext: ReturnType<typeof createMockContext>;

  const account = {
    accountId: "111122223333",
    name: "myAccountName",
    email: "someEmail@invalid.com",
  };

  beforeEach(() => {
    mockContext = createMockContext();
    vi.useFakeTimers();

    //account exists in Entry OU
    mockContext.orgsService.describeAccount.mockResolvedValue(account);
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // ------------ Begin Tests ----------//
  test("Happy Path Successful Registration", async () => {
    await Sandbox.registerAccount(account.accountId, mockContext);

    //assert
    expect(mockContext.orgsService.moveAccount).toHaveBeenCalledWith(
      expect.objectContaining({
        awsAccountId: account.accountId,
        email: account.email,
        name: account.name,
      }),
      "Entry", //from Entry
      "CleanUp", //to CleanUp
    );
    expect(mockContext.idcService.assignGroupAccess).toHaveBeenCalledWith(
      account.accountId,
      "Manager",
    );
    expect(mockContext.idcService.assignGroupAccess).toHaveBeenCalledWith(
      account.accountId,
      "Admin",
    );
    expect(mockContext.eventBridgeClient.sendIsbEvents).toHaveBeenCalledWith(
      mockContext.tracer,
      new CleanAccountRequest({
        accountId: account.accountId,
        reason: "account onboarding",
      }),
    );
  });

  test("Fails gracefully when account does not exist in cleanup OU", async () => {
    mockContext.orgsService.describeAccount.mockResolvedValueOnce(undefined);

    await expect(
      Sandbox.registerAccount("111122223333", mockContext),
    ).rejects.toThrow(CouldNotFindAccountError);
  });

  test("Fails gracefully when moveAccount action fails", async () => {
    mockContext.orgsService.moveAccount.mockImplementationOnce(() => {
      throw new Error("Unable to Move Account.");
    });

    await expect(
      Sandbox.registerAccount("111122223333", mockContext),
    ).rejects.toThrow("Transaction Failed: Error: Unable to Move Account");

    expect(mockContext.eventBridgeClient.sendIsbEvents).not.toHaveBeenCalled();
  });

  test("rolls back moveAccount when IDC group assignment fails", async () => {
    mockContext.idcService.assignGroupAccess.mockImplementationOnce(() => {
      throw new Error("IDC Service Offline.");
    });

    await expect(
      Sandbox.registerAccount("111122223333", mockContext),
    ).rejects.toThrow("Transaction Failed: Error: IDC Service Offline");

    expect(mockContext.eventBridgeClient.sendIsbEvents).not.toHaveBeenCalled();
  });
});
