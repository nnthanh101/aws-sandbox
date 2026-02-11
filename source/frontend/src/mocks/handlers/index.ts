// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { accountHandlers } from "sandbox-frontend/mocks/handlers/accountHandlers";
import { authHandlers } from "sandbox-frontend/mocks/handlers/authHandlers";
import { configurationHandlers } from "sandbox-frontend/mocks/handlers/configurationHandlers";
import { leaseHandlers } from "sandbox-frontend/mocks/handlers/leaseHandlers";
import { leaseTemplateHandlers } from "sandbox-frontend/mocks/handlers/leaseTemplateHandlers";

export const handlers = [
  ...authHandlers,
  ...leaseHandlers,
  ...leaseTemplateHandlers,
  ...configurationHandlers,
  ...accountHandlers,
];
