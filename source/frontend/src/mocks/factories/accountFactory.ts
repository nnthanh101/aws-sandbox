// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
  SandboxAccount,
  SandboxAccountSchema,
} from "sandbox-commons/data/sandbox-account/sandbox-account.js";
import { generateSchemaData } from "sandbox-commons/test/generate-schema-data.js";
import { UnregisteredAccount } from "sandbox-frontend/domains/accounts/types";

export function createSandboxAccount(
  overrides?: Partial<SandboxAccount>,
): SandboxAccount {
  return generateSchemaData(SandboxAccountSchema, overrides);
}

export const mockAvailableAccount = createSandboxAccount({
  status: "Available",
});
export const mockActiveAccount = createSandboxAccount({ status: "Active" });
export const mockQuarantineAccount = createSandboxAccount({
  status: "Quarantine",
});
export const mockCleanUpAccount = createSandboxAccount({
  status: "CleanUp",
});

export const mockUnregisteredAccounts: UnregisteredAccount[] = [
  {
    Id: "123456789012",
    Email: "test1@example.com",
    Name: "Test Account 1",
  },
  {
    Id: "210987654321",
    Email: "test2@example.com",
    Name: "Test Account 2",
  },
];
