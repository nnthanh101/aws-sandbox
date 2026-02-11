// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { IsbRole } from "sandbox-commons/types/isb-types";
import { useUser } from "sandbox-frontend/hooks/useUser";
import { createQueryClientWrapper } from "sandbox-frontend/setupTests";

// Mock AuthService
vi.mock("sandbox-frontend/helpers/AuthService", () => ({
  AuthService: {
    getCurrentUser: vi.fn(),
  },
}));

describe("useUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns correct role flags for Admin role", async () => {
    const mockUser = {
      email: "admin@example.com",
      roles: ["Admin" as IsbRole],
    };

    const { AuthService } = await import(
      "sandbox-frontend/helpers/AuthService"
    );
    vi.mocked(AuthService.getCurrentUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUser(), {
      wrapper: createQueryClientWrapper(),
    });

    // Wait for the query to resolve
    await vi.waitFor(() => {
      expect(result.current.isAdmin).toBe(true);
      expect(result.current.isManager).toBe(false);
      expect(result.current.isUser).toBe(false);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.roles).toEqual(["Admin"]);
    });
  });

  it("returns correct role flags for Manager role", async () => {
    const mockUser = {
      email: "manager@example.com",
      roles: ["Manager" as IsbRole],
    };

    const { AuthService } = await import(
      "sandbox-frontend/helpers/AuthService"
    );
    vi.mocked(AuthService.getCurrentUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUser(), {
      wrapper: createQueryClientWrapper(),
    });

    await vi.waitFor(() => {
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.isManager).toBe(true);
      expect(result.current.isUser).toBe(false);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.roles).toEqual(["Manager"]);
    });
  });

  it("returns correct role flags for User role", async () => {
    const mockUser = {
      email: "user@example.com",
      roles: ["User" as IsbRole],
    };

    const { AuthService } = await import(
      "sandbox-frontend/helpers/AuthService"
    );
    vi.mocked(AuthService.getCurrentUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUser(), {
      wrapper: createQueryClientWrapper(),
    });

    await vi.waitFor(() => {
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.isManager).toBe(false);
      expect(result.current.isUser).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.roles).toEqual(["User"]);
    });
  });

  it("handles user with no roles", async () => {
    const mockUser = {
      email: "user@example.com",
      roles: undefined,
    };

    const { AuthService } = await import(
      "sandbox-frontend/helpers/AuthService"
    );
    vi.mocked(AuthService.getCurrentUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUser(), {
      wrapper: createQueryClientWrapper(),
    });

    await vi.waitFor(() => {
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.isManager).toBe(false);
      expect(result.current.isUser).toBe(false);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.roles).toEqual([]);
    });
  });

  it("handles loading and error states", async () => {
    const { AuthService } = await import(
      "sandbox-frontend/helpers/AuthService"
    );
    vi.mocked(AuthService.getCurrentUser).mockImplementation(
      () => new Promise(() => {}),
    ); // Never resolves

    const { result } = renderHook(() => useUser(), {
      wrapper: createQueryClientWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeUndefined();
    expect(result.current.roles).toEqual([]);
  });
});
