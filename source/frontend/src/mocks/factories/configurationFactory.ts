// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
  GlobalConfigForUI,
  GlobalConfigForUISchema,
} from "sandbox-commons/data/global-config/global-config.js";
import { generateSchemaData } from "sandbox-commons/test/generate-schema-data.js";

export function createConfiguration(
  overrides?: Partial<GlobalConfigForUI>,
): GlobalConfigForUI {
  return generateSchemaData(GlobalConfigForUISchema, overrides);
}
