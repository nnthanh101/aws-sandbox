---
id: identity-center
title: Configure IAM Identity Center Users
sidebar_label: Identity Center Users
sidebar_position: 3
---

# Configure IAM Identity Center Users

Create users and groups in IAM Identity Center and assign them to the Sandbox for AWS application with appropriate roles.

:::caution
Complete these steps in the **management account** where AWS IAM Identity Center is configured.
:::

## Role Model

Sandbox for AWS uses three roles, mapped to Identity Center groups:

| Group Name | Portal Role | Capabilities |
|-----------|-------------|-------------|
| `SandboxAdmins` | Administrator | Full platform management, account registration, SCP config |
| `SandboxManagers` | Manager | Approve/deny requests, extend leases, view reports |
| `SandboxUsers` | End-User | Request sandbox accounts, view lease status |

## Step 1: Create Groups

1. Open the [IAM Identity Center console](https://console.aws.amazon.com/singlesignon/)
2. Navigate to **Groups**
3. Create three groups:

| Group name | Description |
|-----------|-------------|
| `SandboxAdmins` | Administrators who manage the sandbox platform |
| `SandboxManagers` | Managers who approve sandbox requests |
| `SandboxUsers` | End-users who request sandbox accounts |

## Step 2: Create Users (or Sync from External IdP)

If using Identity Center's built-in directory:

1. Navigate to **Users** → **Add user**
2. For each user, enter:
   - **Username** (email address recommended)
   - **Email address**
   - **First name** and **Last name**
3. Choose **Next** → Assign to appropriate group(s) → **Add user**

:::info External Identity Provider
If you're using an external identity provider (Okta, Azure AD, Google Workspace), configure SCIM provisioning to sync users and groups automatically. See [AWS documentation on external IdP integration](https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-idp.html).
:::

## Step 3: Assign Groups to the SAML Application

1. Navigate to **Applications** → Select `Sandbox for AWS`
2. Choose **Assigned users** tab → **Assign users and groups**
3. Select the **Groups** tab
4. Assign all three groups: `SandboxAdmins`, `SandboxManagers`, `SandboxUsers`
5. Choose **Assign users and groups**

## Step 4: Configure Group-to-Role Mapping

The Sandbox for AWS application maps Identity Center groups to portal roles via the `groups` SAML attribute. Ensure the attribute mapping from the [SAML Application](/docs/guide/configure/saml-application) step includes the `groups` attribute.

The mapping is:

```
SandboxAdmins  → Administrator role
SandboxManagers → Manager role
SandboxUsers   → End-User role
```

## Verification

1. Open the IAM Identity Center **User portal URL**
2. Sign in as a test user from each group
3. Verify the `Sandbox for AWS` application is visible
4. Click the application — it should redirect to the web portal (configured in the next step)

```bash
# List users in Identity Center
aws identitystore list-users \
  --identity-store-id d-xxxxxxxxxx \
  --region ap-southeast-2

# List groups
aws identitystore list-groups \
  --identity-store-id d-xxxxxxxxxx \
  --region ap-southeast-2
```

:::tip
The Identity Store ID is found in IAM Identity Center → Settings → Identity source.
:::
