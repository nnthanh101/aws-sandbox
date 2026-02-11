// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useGetConfigurations } from "sandbox-frontend/domains/settings/hooks";
import { Alert, Box, Link } from "@cloudscape-design/components";

export const MaintenanceBanner = () => {
  const { data: config } = useGetConfigurations();

  if (config?.maintenanceMode) {
    return (
      <Box margin={{ bottom: "l" }}>
        <Alert type="warning" header="Maintenance Mode" dismissible={false}>
          Innovation Sandbox on AWS is currently in maintenance mode. Access to
          the web application is limited to admin users. To disable maintenance
          mode, admins need to go to{" "}
          <Link
            external
            href="https://console.aws.amazon.com/systems-manager/appconfig/applications"
          >
            AWS AppConfig
          </Link>
          .
        </Alert>
      </Box>
    );
  }
};
