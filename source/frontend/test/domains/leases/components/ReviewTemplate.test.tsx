// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { screen, waitFor } from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, expect, test } from "vitest";

import { LeaseTemplate } from "sandbox-commons/data/lease-template/lease-template.js";
import { ReviewStep } from "sandbox-frontend/domains/leases/components/wizard-steps/ReviewStep";
import { config } from "sandbox-frontend/helpers/config";
import { mockBasicLeaseTemplate } from "sandbox-frontend/mocks/handlers/leaseTemplateHandlers";
import { server } from "sandbox-frontend/mocks/server";
import { renderWithQueryClient } from "sandbox-frontend/setupTests";
import { ApiResponse } from "sandbox-frontend/types";

describe("ReviewTemplate", () => {
  const mockNewLeaseRequest = {
    leaseTemplateUuid: mockBasicLeaseTemplate.uuid,
  };

  const renderComponent = () =>
    renderWithQueryClient(
      <Router>
        <ReviewStep data={mockNewLeaseRequest} />
      </Router>,
    );

  test("renders lease template details when data is fetched successfully", async () => {
    server.use(
      http.get(
        `${config.ApiUrl}/leaseTemplates/${mockNewLeaseRequest.leaseTemplateUuid}`,
        () => {
          return HttpResponse.json({
            status: "success",
            data: mockBasicLeaseTemplate,
          } as ApiResponse<LeaseTemplate>);
        },
      ),
    );
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(mockBasicLeaseTemplate.name)).toBeInTheDocument();
      expect(screen.getByText(`after approval`)).toBeInTheDocument();
      expect(
        screen.getByText(`$${mockBasicLeaseTemplate.maxSpend}`),
      ).toBeInTheDocument();
      expect(screen.getByText("No approval required")).toBeInTheDocument();
    });
  });

  test("shows loading state with a specific delay", async () => {
    server.use(
      http.get(
        `${config.ApiUrl}/leaseTemplates/${mockNewLeaseRequest.leaseTemplateUuid}`,
        async () => {
          await delay(1000);
          return HttpResponse.json({
            status: "success",
            data: mockBasicLeaseTemplate,
          } as ApiResponse<LeaseTemplate>);
        },
      ),
    );

    renderComponent();

    await waitFor(
      () => {
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  test("shows error message when fetching fails", async () => {
    server.use(
      http.get(
        `${config.ApiUrl}/leaseTemplates/${mockNewLeaseRequest.leaseTemplateUuid}`,
        () => {
          return HttpResponse.json(
            { status: "error", message: "Failed to fetch lease template" },
            { status: 500 },
          );
        },
      ),
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(/Error loading lease template/i),
      ).toBeInTheDocument();
    });
  });
});
