// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

// Import npm css
import "react-toastify/dist/ReactToastify.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify/unstyled";

import { AppLayout } from "sandbox-frontend/components/AppLayout";
import { Authenticator } from "sandbox-frontend/components/Authenticator";
import { AddAccounts } from "sandbox-frontend/domains/accounts/pages/AddAccounts";
import { ListAccounts } from "sandbox-frontend/domains/accounts/pages/ListAccounts";
import { Home } from "sandbox-frontend/domains/home/pages/Home";
import { ApprovalDetails } from "sandbox-frontend/domains/leases/pages/ApprovalDetails";
import { ListApprovals } from "sandbox-frontend/domains/leases/pages/ListApprovals";
import { ListLeases } from "sandbox-frontend/domains/leases/pages/ListLeases";
import { RequestLease } from "sandbox-frontend/domains/leases/pages/RequestLease";
import { UpdateLease } from "sandbox-frontend/domains/leases/pages/UpdateLease";
import { AddLeaseTemplate } from "sandbox-frontend/domains/leaseTemplates/pages/AddLeaseTemplate";
import { ListLeaseTemplates } from "sandbox-frontend/domains/leaseTemplates/pages/ListLeaseTemplates";
import { UpdateLeaseTemplate } from "sandbox-frontend/domains/leaseTemplates/pages/UpdateLeaseTemplate";
import { Settings } from "sandbox-frontend/domains/settings/pages/Settings";
import { ModalProvider } from "sandbox-frontend/hooks/useModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Import local css
import { AssignLease } from "sandbox-frontend/domains/leases/pages/AssignLease";
import "./assets/styles/app.scss";

export const App = () => {
  const routes = [
    { path: "/", Element: Home },
    { path: "/request", Element: RequestLease },
    { path: "/assign", Element: AssignLease },
    { path: "/settings", Element: Settings },
    { path: "/lease_templates", Element: ListLeaseTemplates },
    { path: "/lease_templates/new", Element: AddLeaseTemplate },
    { path: "/lease_templates/edit/:uuid", Element: UpdateLeaseTemplate },
    { path: "/accounts", Element: ListAccounts },
    { path: "/accounts/new", Element: AddAccounts },
    { path: "/approvals", Element: ListApprovals },
    { path: "/approvals/:leaseId", Element: ApprovalDetails },
    { path: "/leases", Element: ListLeases },
    { path: "/leases/edit/:leaseId", Element: UpdateLease },
  ];

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Authenticator>
        <Router>
          <ModalProvider>
            <AppLayout>
              <Routes>
                {routes.map(({ path, Element }) => (
                  <Route key={path} path={path} element={<Element />} />
                ))}
              </Routes>
            </AppLayout>
          </ModalProvider>
        </Router>
        <ToastContainer />
      </Authenticator>
    </QueryClientProvider>
  );
};
