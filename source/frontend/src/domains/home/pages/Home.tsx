// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
  Button,
  ContentLayout,
  Header,
  SpaceBetween,
} from "@cloudscape-design/components";
import { useNavigate } from "react-router-dom";

import { Divider } from "sandbox-frontend/components/Divider";
import { InfoLink } from "sandbox-frontend/components/InfoLink";
import { Markdown } from "sandbox-frontend/components/Markdown";
import { AccountsPanel } from "sandbox-frontend/domains/home/components/AccountsPanel";
import { ApprovalsPanel } from "sandbox-frontend/domains/home/components/ApprovalsPanel";
import { MyLeases } from "sandbox-frontend/domains/home/components/MyLeases";
import { useBreadcrumb } from "sandbox-frontend/hooks/useBreadcrumb";
import { useUser } from "sandbox-frontend/hooks/useUser";
import { useAppLayoutContext } from "@aws-northstar/ui/components/AppLayout";
import { useEffect } from "react";

export const Home = () => {
  const navigate = useNavigate();
  const setBreadcrumb = useBreadcrumb();
  const { setTools } = useAppLayoutContext();
  const { user, isAdmin, isManager } = useUser();

  useEffect(() => {
    setBreadcrumb([{ text: "Home", href: "/" }]);
    setTools(<Markdown file={"home"} />);
  }, []);

  const body = () => {
    if (user?.roles?.includes("Admin")) {
      return (
        <SpaceBetween size="m">
          <Divider />
          <ApprovalsPanel />
          <Divider />
          <AccountsPanel />
          <Divider />
          <MyLeases />
        </SpaceBetween>
      );
    }

    if (user?.roles?.includes("Manager")) {
      return (
        <SpaceBetween size="m">
          <Divider />
          <ApprovalsPanel />
          <Divider />
          <MyLeases />
        </SpaceBetween>
      );
    }

    return (
      <SpaceBetween size="m">
        <Divider />
        <MyLeases />
      </SpaceBetween>
    );
  };

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => navigate("/request")} variant="primary">
                Request lease
              </Button>
              {(isAdmin || isManager) && (
                <Button onClick={() => navigate("/assign")} variant="normal">
                  Assign lease
                </Button>
              )}
            </SpaceBetween>
          }
          info={<InfoLink markdown="home" />}
        >
          Welcome to Innovation Sandbox on AWS
        </Header>
      }
    >
      {body()}
    </ContentLayout>
  );
};
