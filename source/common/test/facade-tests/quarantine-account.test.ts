// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { PaginatedQueryResult } from "sandbox-commons/data/common-types.js";
import { GlobalConfigSchema } from "sandbox-commons/data/global-config/global-config.js";
import {
  Lease,
  MonitoredLease,
  MonitoredLeaseSchema,
} from "sandbox-commons/data/lease/lease.js";
import { SandboxAccountSchema } from "sandbox-commons/data/sandbox-account/sandbox-account.js";
import { AccountQuarantinedEvent } from "sandbox-commons/events/account-quarantined-event.js";
import { CleanAccountRequest } from "sandbox-commons/events/clean-account-request.js";
import { EventDetailTypes } from "sandbox-commons/events/index.js";
import { LeaseTerminatedEvent } from "sandbox-commons/events/lease-terminated-event.js";
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
    idcService: mockedIdcService(),
    orgsService: mockedOrgsService(),
    eventBridgeClient: mockedIsbEventBridge(),
    logger: createMockOf(Logger),
    tracer: new Tracer(),
    globalConfig: generateSchemaData(GlobalConfigSchema, {
      leases: generateSchemaData(GlobalConfigSchema.shape.leases, {
        ttl: 30,
      }),
    }),
  };
}

const currentDateTime = DateTime.fromISO("2024-12-20T08:45:00.000Z", {
  zone: "utc",
}) as DateTime<true>;

describe("Sandbox.quarantineAccount()", () => {
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

  test("quarantine an account without an attached lease", async () => {
    const mockAccount = generateSchemaData(SandboxAccountSchema, {
      status: "Frozen", //expected to be frozen, but was found in available OU
    });

    mockContext.sandboxAccountStore.get.mockImplementation(
      async (_accountId) => {
        return {
          result: mockAccount,
        };
      },
    );
    await Sandbox.quarantineAccount(
      {
        accountId: mockAccount.awsAccountId,
        currentOu: "Available",
        reason: "Test Quarantine",
      },
      mockContext,
    );

    //moved to quarantine
    expect(mockContext.orgsService.moveAccount).toHaveBeenCalledWith(
      mockAccount,
      "Available",
      "Quarantine",
    );

    expect(mockContext.eventBridgeClient.sendIsbEvent).toHaveBeenCalledWith(
      mockContext.tracer,
      expect.objectContaining({
        DetailType: EventDetailTypes.AccountQuarantined,
        Detail: {
          awsAccountId: mockAccount.awsAccountId,
          reason: "Test Quarantine",
        },
      } satisfies Partial<AccountQuarantinedEvent>),
    );
  });

  test("quarantine an account with an attached active lease", async () => {
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
      nextPageIdentifier: null,
      result: [activeLease],
    } as PaginatedQueryResult<MonitoredLease>);

    await Sandbox.quarantineAccount(
      {
        accountId: mockAccount.awsAccountId,
        currentOu: "Active",
        reason: "Test Quarantine",
      },
      mockContext,
    );

    //moved to quarantine
    expect(mockContext.orgsService.moveAccount).toHaveBeenCalledWith(
      mockAccount,
      "Active",
      "Quarantine",
    );

    //user access revoked
    expect(mockContext.idcService.revokeAllUserAccess).toHaveBeenCalledWith(
      mockAccount.awsAccountId,
    );

    expect(mockContext.leaseStore.update).toHaveBeenCalledWith({
      ...activeLease,
      ttl: Math.floor(currentDateTime.plus({ days: 30 }).valueOf() / 1000),
      status: "AccountQuarantined",
      endDate: currentDateTime.toISO(),
    } satisfies Partial<Lease>);

    expect(mockContext.eventBridgeClient.sendIsbEvent).toHaveBeenCalledWith(
      mockContext.tracer,
      expect.objectContaining({
        DetailType: EventDetailTypes.AccountQuarantined,
        Detail: {
          awsAccountId: mockAccount.awsAccountId,
          reason: "Test Quarantine",
        },
      } satisfies Partial<AccountQuarantinedEvent>),
    );

    expect(mockContext.eventBridgeClient.sendIsbEvent).toHaveBeenCalledWith(
      mockContext.tracer,
      expect.objectContaining({
        DetailType: EventDetailTypes.LeaseTerminated,
        Detail: expect.objectContaining({
          accountId: mockAccount.awsAccountId,
        }),
      } satisfies Partial<LeaseTerminatedEvent>),
    );

    //no cleanup action issued
    expect(mockContext.eventBridgeClient.sendIsbEvent).not.toHaveBeenCalledWith(
      mockContext.tracer,
      expect.any(CleanAccountRequest),
    );
  });
});
