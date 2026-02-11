// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { GlobalConfigForUI } from "sandbox-commons/data/global-config/global-config.js";
import { createConfiguration } from "sandbox-frontend/mocks/factories/configurationFactory";
import { mockConfigurationApi } from "sandbox-frontend/mocks/mockApi";

export const mockConfiguration: GlobalConfigForUI = createConfiguration({
  isbManagedRegions: ["us-east-1", "us-west-2"],
});
mockConfigurationApi.returns(mockConfiguration);

export const configurationHandlers = [mockConfigurationApi.getHandler()];
