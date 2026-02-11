// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { setupServer } from "msw/node";

import { handlers } from "sandbox-frontend/mocks/handlers";

export const server = setupServer(...handlers);
