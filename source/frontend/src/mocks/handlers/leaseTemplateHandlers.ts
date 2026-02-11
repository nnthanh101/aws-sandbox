// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
  createAdvancedLeaseTemplate,
  createLeaseTemplate,
} from "sandbox-frontend/mocks/factories/leaseTemplateFactory";
import { mockLeaseTemplateApi } from "sandbox-frontend/mocks/mockApi";

export const mockBasicLeaseTemplate = createLeaseTemplate();
export const mockAdvancedLeaseTemplate = createAdvancedLeaseTemplate();
export const mockLeaseTemplates = [
  mockBasicLeaseTemplate,
  mockAdvancedLeaseTemplate,
];

mockLeaseTemplateApi.returns(mockLeaseTemplates);

export const leaseTemplateHandlers = [
  mockLeaseTemplateApi.getHandler(),
  mockLeaseTemplateApi.getHandler("/:id"),
  mockLeaseTemplateApi.postHandler(),
  mockLeaseTemplateApi.deleteHandler("/:id"),
  mockLeaseTemplateApi.putHandler("/:id"),
];
