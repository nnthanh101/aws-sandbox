// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { config } from "sandbox-frontend/helpers/config";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

import {
  GlobalConfigForUI,
  GlobalConfigForUISchema,
} from "sandbox-commons/data/global-config/global-config";
import { generateSchemaData } from "sandbox-commons/test/generate-schema-data";
import { BaseLayout } from "sandbox-frontend/components/AppLayout/BaseLayout";
import { server } from "sandbox-frontend/mocks/server";
import { renderWithQueryClient } from "sandbox-frontend/setupTests";
import { ApiResponse } from "sandbox-frontend/types";

vi.mock("sandbox-frontend/helpers/AuthService", () => ({
  AuthService: {
    getCurrentUser: vi.fn().mockResolvedValue({ email: "test@example.com" }),
    getAccessToken: vi.fn().mockReturnValue("mocked-access-token"),
  },
}));

describe("BaseLayout", () => {
  const renderComponent = () =>
    renderWithQueryClient(
      <Router>
        <BaseLayout>
          <div data-testid="child-content">Child Content</div>
        </BaseLayout>
      </Router>,
    );

  test("does not render maintenance banner when maintenance mode is disabled", () => {
    server.use(
      http.get(`${config.ApiUrl}/configurations`, () => {
        return HttpResponse.json({
          status: "success",
          data: generateSchemaData(GlobalConfigForUISchema, {
            maintenanceMode: false,
          }),
        } as ApiResponse<GlobalConfigForUI>);
      }),
    );

    renderComponent();

    expect(screen.queryByText("Maintenance Mode")).not.toBeInTheDocument();
  });

  test("renders maintenance banner when maintenance mode is enabled", async () => {
    server.use(
      http.get(`${config.ApiUrl}/configurations`, () => {
        return HttpResponse.json({
          status: "success",
          data: generateSchemaData(GlobalConfigForUISchema, {
            maintenanceMode: true,
          }),
        } as ApiResponse<GlobalConfigForUI>);
      }),
    );

    renderComponent();

    expect(await screen.findByText("Maintenance Mode")).toBeInTheDocument();
  });
});
