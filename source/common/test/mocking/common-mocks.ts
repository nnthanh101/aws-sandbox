// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
  PaginatedQueryResult,
  PutResult,
} from "sandbox-commons/data/common-types.js";
import { LeaseTemplateStore } from "sandbox-commons/data/lease-template/lease-template-store.js";
import { LeaseStore } from "sandbox-commons/data/lease/lease-store.js";
import { Lease } from "sandbox-commons/data/lease/lease.js";
import { SandboxAccountStore } from "sandbox-commons/data/sandbox-account/sandbox-account-store.js";
import { SandboxAccount } from "sandbox-commons/data/sandbox-account/sandbox-account.js";
import { IdcService } from "sandbox-commons/isb-services/idc-service.js";
import { SandboxOuService } from "sandbox-commons/isb-services/sandbox-ou-service.js";
import { IsbEventBridgeClient } from "sandbox-commons/sdk-clients/event-bridge-client.js";
import { createMockOf } from "sandbox-commons/test/mocking/mock-utils.js";
import { Transaction } from "sandbox-commons/utils/transactions.js";
import { MockProxy } from "vitest-mock-extended";

export function mockedLeaseStore() {
  const mockLeaseStore: MockProxy<LeaseStore> = createMockOf(LeaseStore, {
    usingRealFunctions: ["transactionalUpdate"],
  });

  mockLeaseStore.create.mockImplementation(async (lease: Lease) => {
    return lease;
  });

  mockLeaseStore.update.mockImplementation(async (lease: Lease) => {
    return {
      newItem: lease,
    } as PutResult<Lease>;
  });

  mockLeaseStore.findByUserEmail.mockImplementation(
    async () =>
      ({
        result: [] as Lease[],
        nextPageIdentifier: null,
      }) as PaginatedQueryResult<Lease>,
  );

  mockLeaseStore.findByStatusAndAccountID.mockImplementation(
    async () =>
      ({
        result: [] as Lease[],
        nextPageIdentifier: null,
      }) as PaginatedQueryResult<Lease>,
  );

  return mockLeaseStore;
}

export function mockedAccountStore() {
  const mockAccountStore = createMockOf(SandboxAccountStore, {
    usingRealFunctions: ["transactionalPut"],
  });

  mockAccountStore.put.mockImplementation(async (account: SandboxAccount) => {
    return {
      newItem: account,
    } as PutResult<SandboxAccount>;
  });

  return mockAccountStore;
}

export function mockedLeaseTemplateStore() {
  return createMockOf(LeaseTemplateStore, {
    usingRealFunctions: ["transactionalUpdate"],
  });
}

export function mockedOrgsService() {
  const mockOrgService = createMockOf(SandboxOuService, {
    usingRealFunctions: ["transactionalMoveAccount", "moveAccount"],
    withObjects: {
      sandboxAccountStore: mockedAccountStore(),
    },
  });

  return mockOrgService;
}

export function mockedIdcService() {
  return createMockOf(IdcService, {
    usingRealFunctions: [
      "transactionalAssignGroupAccess",
      "transactionalRevokeGroupAccess",
      "transactionalGrantUserAccess",
    ],
  });
}

export function mockedIsbEventBridge() {
  return createMockOf(IsbEventBridgeClient, {
    usingRealFunctions: ["sendIsbEvents"],
  });
}

export function mockTransaction<T>(returnValue: T): Transaction<T> {
  return new Transaction<T>({
    beginTransaction: async () => returnValue,
    rollbackTransaction: async () => {},
  });
}
