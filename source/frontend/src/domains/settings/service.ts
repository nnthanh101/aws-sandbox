// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { GlobalConfigForUI } from "sandbox-commons/data/global-config/global-config.js";
import { ReportingConfig } from "sandbox-commons/data/reporting-config/reporting-config.js";
import {
  ApiProxy,
  IApiProxy,
} from "sandbox-frontend/helpers/ApiProxy";

export class SettingService {
  private api: IApiProxy;

  constructor(apiProxy?: IApiProxy) {
    this.api = apiProxy ?? new ApiProxy();
  }

  async getConfigurations(): Promise<GlobalConfigForUI & ReportingConfig> {
    return this.api.get<GlobalConfigForUI & ReportingConfig>("/configurations");
  }
}
