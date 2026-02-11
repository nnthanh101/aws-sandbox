// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Link } from "@cloudscape-design/components";
import { ReactNode } from "react";

import { TextLink } from "sandbox-frontend/components/TextLink";

interface MarkdownLinkProps {
  href?: string;
  children?: ReactNode;
}

export const MarkdownLink = ({ href, children }: MarkdownLinkProps) => {
  if (!href) {
    return children;
  }

  const isInternal = href.startsWith("/") || href.startsWith("#");

  if (isInternal) {
    return <TextLink to={href}>{children}</TextLink>;
  }

  return (
    <Link external variant="primary" href={href}>
      {children}
    </Link>
  );
};
