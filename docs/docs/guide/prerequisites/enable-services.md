---
id: enable-services
title: Enable Required Services
sidebar_label: Enable Services
sidebar_position: 5
---

# Enable Required Services

Several AWS services must be enabled and configured in the management account before deployment.

## Required Service Access

### 1. Enable Trusted Access for AWS Account Management

This allows the hub account to manage sandbox accounts:

1. Sign in to the **management account**
2. Open the [AWS Organizations console](https://console.aws.amazon.com/organizations/)
3. Navigate to **Services** → **AWS Account Management**
4. Choose **Enable trusted access**

```bash
aws organizations enable-aws-service-access \
  --service-principal account.amazonaws.com \
  --profile management-profile
```

### 2. Register Hub Account as Delegated Administrator

Register the hub account as a delegated administrator for account management:

```bash
aws organizations register-delegated-administrator \
  --account-id HUB_ACCOUNT_ID \
  --service-principal account.amazonaws.com \
  --profile management-profile
```

### 3. Enable IAM Identity Center

If not already enabled:

1. Sign in to the **management account**
2. Open the [IAM Identity Center console](https://console.aws.amazon.com/singlesignon/)
3. Choose **Enable** if prompted
4. Verify it's enabled in your home region (`ap-southeast-2`)

```bash
# Verify Identity Center is enabled
aws sso-admin list-instances --region ap-southeast-2 --profile management-profile
```

### 4. Enable Amazon SES (Hub Account)

The hub account needs SES for sending notifications (lease approvals, expiry alerts):

1. Sign in to the **hub account**
2. Open the [Amazon SES console](https://console.aws.amazon.com/ses/)
3. If in sandbox mode, verify at least one email address for testing

```bash
# Verify an email identity
aws ses verify-email-identity \
  --email-address admin@yourcompany.com \
  --region ap-southeast-2 \
  --profile hub-profile
```

:::tip SES Production Access
For production use, request SES production access to send emails to any address. In sandbox mode, you can only send to verified addresses.
:::

## Verification Checklist

Run these commands to verify all services are ready:

```bash
# 1. Organizations — trusted access enabled
aws organizations list-aws-service-access-for-organization \
  --profile management-profile \
  --query "EnabledServicePrincipals[?ServicePrincipal=='account.amazonaws.com']"

# 2. Delegated administrator registered
aws organizations list-delegated-administrators \
  --service-principal account.amazonaws.com \
  --profile management-profile

# 3. Identity Center enabled
aws sso-admin list-instances \
  --region ap-southeast-2 \
  --profile management-profile

# 4. SES verified (hub account)
aws ses list-identities \
  --region ap-southeast-2 \
  --profile hub-profile
```

All four commands should return non-empty results. If any return empty, revisit the corresponding step above.
