// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from "react";

import { AppContext } from "sandbox-frontend/components/AppContext";
import { BaseLayout } from "sandbox-frontend/components/AppLayout/BaseLayout";

export interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <AppContext>
      <BaseLayout>{children}</BaseLayout>
    </AppContext>
  );
};
