// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { PaginatedQueryResult } from "sandbox-commons/data/common-types.js";
import { GlobalConfigSchema } from "sandbox-commons/data/global-config/global-config.js";
import {
  MonitoredLease,
  MonitoredLeaseSchema,
} from "sandbox-commons/data/lease/lease.js";
import { SandboxAccountSchema } from "sandbox-commons/data/sandbox-account/sandbox-account.js";
import { Sandbox } from "sandbox-commons/innovation-sandbox.js";
import { generateSchemaData } from "sandbox-commons/test/generate-schema-data.js";
import {
  mockedAccountStore,
  mockedIdcService,
  mockedIsbEventBridge,
  mockedLeaseStore,
  mockedOrgsService,
} from "sandbox-commons/test/mocking/common-mocks.js";
import { createMockOf } from "sandbox-commons/test/mocking/mock-utils.js";
import {
  IsbUser,
  IsbUserSchema,
} from "sandbox-commons/types/isb-types.js";
import { Logger } from "@aws-lambda-powertools/logger";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { DateTime } from "luxon";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

function createMockContext() {
  return {
    leaseStore: mockedLeaseStore(),
    sandboxAccountStore: mockedAccountStore(),
    eventBridgeClient: mockedIsbEventBridge(),
    idcService: mockedIdcService(),
    orgsService: mockedOrgsService(),
    logger: createMockOf(Logger),
    tracer: new Tracer(),
    globalConfig: generateSchemaData(GlobalConfigSchema),
  };
}

const currentDateTime = DateTime.fromISO("2024-12-20T08:45:00.000Z", {
  zone: "utc",
}) as DateTime<true>;

describe("Sandbox.ejectAccount()", () => {
  let mockContext: ReturnType<typeof createMockContext>;
  let mockUser: IsbUser;

  beforeEach(() => {
    mockContext = createMockContext();
    mockUser = generateSchemaData(IsbUserSchema);

    mockContext.idcService.getUserFromEmail.mockImplementation(
      async (email) => {
        if (email === mockUser.email) {
          return mockUser;
        } else {
          throw new Error("Invalid ISB User.");
        }
      },
    );

    vi.useFakeTimers();
    vi.setSystemTime(currentDateTime.toJSDate());
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test("ejecting account from available", async () => {
    const mockAccount = generateSchemaData(SandboxAccountSchema, {
      status: "Available",
    });

    await Sandbox.ejectAccount(
      {
        sandboxAccount: mockAccount,
      },
      mockContext,
    );

    expect(
      mockContext.orgsService.performAccountMoveAction,
    ).toHaveBeenCalledWith(
      mockAccount.awsAccountId,
      mockAccount.status,
      "Exit",
    );
  });

  test("ejecting account that is part of an active lease", async () => {
    const mockAccount = generateSchemaData(SandboxAccountSchema, {
      status: "Active",
    });
    const activeLease = generateSchemaData(MonitoredLeaseSchema, {
      awsAccountId: mockAccount.awsAccountId,
      status: "Active",
      userEmail: mockUser.email,
    });

    mockContext.sandboxAccountStore.get.mockImplementation(
      async (accountId) => {
        return {
          result:
            accountId === mockAccount.awsAccountId ? mockAccount : undefined,
        };
      },
    );

    mockContext.leaseStore.findByStatusAndAccountID.mockResolvedValue({
      result: [activeLease],
      nextPageIdentifier: null,
    } as PaginatedQueryResult<MonitoredLease>);

    await Sandbox.ejectAccount(
      {
        sandboxAccount: mockAccount,
      },
      mockContext,
    );

    expect(mockContext.idcService.revokeAllUserAccess).toHaveBeenCalledWith(
      mockAccount.awsAccountId,
    );

    expect(mockContext.idcService.revokeGroupAccess).toHaveBeenCalledWith(
      mockAccount.awsAccountId,
      "Manager",
    );

    expect(mockContext.idcService.revokeGroupAccess).toHaveBeenCalledWith(
      mockAccount.awsAccountId,
      "Admin",
    );

    expect(mockContext.leaseStore.update).toHaveBeenCalledWith(
      expect.objectContaining({
        ...activeLease,
        status: "Ejected",
      }),
    );

    expect(
      mockContext.orgsService.performAccountMoveAction,
    ).toHaveBeenCalledWith(
      mockAccount.awsAccountId,
      mockAccount.status,
      "Exit",
    );
  });
});
