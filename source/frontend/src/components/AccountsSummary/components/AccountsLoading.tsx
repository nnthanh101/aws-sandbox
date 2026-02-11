// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Container } from "@cloudscape-design/components";

import styles from "sandbox-frontend/components/AccountsSummary/styles.module.scss";
import { Loader } from "sandbox-frontend/components/Loader";

export const AccountsLoading = () => {
  return (
    <Container>
      <div className={styles.container}>
        <div className={styles.middle}>
          <Loader label="Loading account info..." />
        </div>
      </div>
    </Container>
  );
};
