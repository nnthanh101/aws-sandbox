// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from "react";

import { useAppContext } from "sandbox-frontend/components/AppContext/context";

export interface Breadcrumb {
  text: string;
  href: string;
}

export const useBreadcrumb = () => {
  const { setBreadcrumb } = useAppContext();

  const updateBreadcrumb = useCallback(
    (newBreadcrumb: Breadcrumb[]) => {
      setBreadcrumb(newBreadcrumb);
    },
    [setBreadcrumb],
  );

  return updateBreadcrumb;
};
