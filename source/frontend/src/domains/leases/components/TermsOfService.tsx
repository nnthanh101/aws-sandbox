// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
  Alert,
  Box,
  Container,
  SpaceBetween,
} from "@cloudscape-design/components";

import { ErrorPanel } from "sandbox-frontend/components/ErrorPanel";
import { Loader } from "sandbox-frontend/components/Loader";
import { useGetConfigurations } from "sandbox-frontend/domains/settings/hooks";

export const TermsOfService = () => {
  const {
    data: config,
    isLoading,
    isError,
    refetch,
    error,
  } = useGetConfigurations();

  if (isLoading) {
    return <Loader label="Loading terms of service..." />;
  }

  if (isError) {
    return (
      <ErrorPanel
        description="Could not retrieve terms of service."
        retry={refetch}
        error={error as Error}
      />
    );
  }

  return (
    <SpaceBetween size="s">
      <Box variant="strong">
        Before continuing, please review the terms of service below.
      </Box>
      <Container>
        {config?.termsOfService ? (
          <pre>{config.termsOfService}</pre>
        ) : (
          <Alert
            type="warning"
            header="Terms of Service have not been configured yet."
          >
            Please contact your administrator!
          </Alert>
        )}
      </Container>
    </SpaceBetween>
  );
};
