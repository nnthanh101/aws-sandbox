// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, expect, test } from "vitest";

import {
  testErrorState,
  testLoadingState,
  testRefetchOnError,
} from "sandbox-frontend-test/utils/settingsTestUtils";
import { CostReportingSettings } from "sandbox-frontend/domains/settings/components/CostReportingSettings";
import { config } from "sandbox-frontend/helpers/config";
import { mockConfiguration } from "sandbox-frontend/mocks/handlers/configurationHandlers";
import { server } from "sandbox-frontend/mocks/server";
import { renderWithQueryClient } from "sandbox-frontend/setupTests";

describe("CostReportingSettings", () => {
  const renderComponent = () =>
    renderWithQueryClient(
      <Router>
        <CostReportingSettings />
      </Router>,
    );

  test("renders cost reporting settings correctly", async () => {
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("Require Cost Report Groups"),
      ).toBeInTheDocument();
      expect(screen.getByText("Cost Report Groups")).toBeInTheDocument();
    });
  });

  test("handles loading state", async () => {
    await testLoadingState(renderComponent);
  });

  test("handles error state", async () => {
    await testErrorState(renderComponent);
  });

  test("refetches data on error retry", async () => {
    await testRefetchOnError(renderComponent);
  });

  test("displays when cost report group is required", async () => {
    server.use(
      http.get(`${config.ApiUrl}/configurations`, () => {
        return HttpResponse.json({
          status: "success",
          data: { ...mockConfiguration, requireCostReportGroup: true },
        });
      }),
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("Cost report group is required"),
      ).toBeInTheDocument();
    });
  });

  test("displays when cost report group is not required", async () => {
    server.use(
      http.get(`${config.ApiUrl}/configurations`, () => {
        return HttpResponse.json({
          status: "success",
          data: { ...mockConfiguration, requireCostReportGroup: false },
        });
      }),
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("Cost report group is not required"),
      ).toBeInTheDocument();
    });
  });

  test("displays cost report groups when available", async () => {
    const testGroups = ["group1", "group2", "group3"];
    server.use(
      http.get(`${config.ApiUrl}/configurations`, () => {
        return HttpResponse.json({
          status: "success",
          data: { ...mockConfiguration, costReportGroups: testGroups },
        });
      }),
    );

    renderComponent();

    await waitFor(() => {
      testGroups.forEach((group) => {
        expect(screen.getByText(group)).toBeInTheDocument();
      });
    });
  });

  test("displays warning when no cost report groups are set", async () => {
    server.use(
      http.get(`${config.ApiUrl}/configurations`, () => {
        return HttpResponse.json({
          status: "success",
          data: { ...mockConfiguration, costReportGroups: [] },
        });
      }),
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Not set")).toBeInTheDocument();
    });
  });
});
