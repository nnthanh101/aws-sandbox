// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from "react";

import Animate from "sandbox-frontend/components/Animate";
import { FullPageLoader } from "sandbox-frontend/components/FullPageLoader";
import { AuthService } from "sandbox-frontend/helpers/AuthService";
import { useUser } from "sandbox-frontend/hooks/useUser";

interface AuthenticatorProps {
  children: React.ReactNode;
}

export const Authenticator = ({ children }: AuthenticatorProps) => {
  const { user: currentUser, isLoading } = useUser();

  useEffect(() => {
    if (currentUser) {
      // Remove the token from the URL without reloading the page
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [currentUser]);

  if (isLoading) {
    return <FullPageLoader label="Authenticating..." />;
  }

  if (currentUser) {
    return <Animate>{children}</Animate>;
  }

  if (!currentUser) {
    // redirect to login page if user is not logged in
    // warning: could result in endless loop if IDC/auth is not configured correctly
    AuthService.login();
    return <FullPageLoader label="Redirecting..." />;
  }
};
