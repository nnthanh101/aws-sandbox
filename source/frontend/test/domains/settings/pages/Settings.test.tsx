// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

import {
  testErrorState,
  testLoadingState,
  testRefetchOnError,
} from "sandbox-frontend-test/utils/settingsTestUtils";
import { Settings } from "sandbox-frontend/domains/settings/pages/Settings";
import { renderWithQueryClient } from "sandbox-frontend/setupTests";

const mockSetBreadcrumb = vi.fn();

vi.mock("sandbox-frontend/hooks/useBreadcrumb", () => ({
  useBreadcrumb: () => mockSetBreadcrumb,
}));

describe("Settings", () => {
  const renderComponent = () =>
    renderWithQueryClient(
      <Router>
        <Settings />
      </Router>,
    );

  test("renders Settings page correctly", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(
        screen.getByText("Manage global settings here."),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("tab", { name: "General Settings" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Lease Settings" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Clean Up Settings" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Cost Reporting Settings" }),
    ).toBeInTheDocument();
  });

  test("sets breadcrumb correctly", () => {
    renderComponent();

    expect(mockSetBreadcrumb).toHaveBeenCalledWith([
      { text: "Home", href: "/" },
      { text: "Settings", href: "/settings" },
    ]);
  });

  test("switches between tabs", async () => {
    renderComponent();
    const user = userEvent.setup();

    await waitFor(() => {
      expect(
        screen.getByRole("tab", { name: "General Settings" }),
      ).toBeInTheDocument();
    });

    // Check if General Settings tab is active by default
    expect(
      screen.getByRole("tab", { name: "General Settings", selected: true }),
    ).toBeInTheDocument();

    // Switch to Lease Settings tab
    await user.click(screen.getByRole("tab", { name: "Lease Settings" }));
    expect(
      screen.getByRole("tab", { name: "Lease Settings", selected: true }),
    ).toBeInTheDocument();

    // Switch to Clean Up Settings tab
    await user.click(screen.getByRole("tab", { name: "Clean Up Settings" }));
    expect(
      screen.getByRole("tab", { name: "Clean Up Settings", selected: true }),
    ).toBeInTheDocument();

    // Switch to Cost Reporting Settings tab
    await user.click(
      screen.getByRole("tab", { name: "Cost Reporting Settings" }),
    );
    expect(
      screen.getByRole("tab", {
        name: "Cost Reporting Settings",
        selected: true,
      }),
    ).toBeInTheDocument();
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
});
