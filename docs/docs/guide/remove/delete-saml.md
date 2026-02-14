---
id: delete-saml
title: Delete SAML Application
sidebar_label: Delete SAML
sidebar_position: 4
---

# Delete SAML Application

Remove the SAML application from IAM Identity Center to complete the solution removal.

:::caution
Complete these steps in the **management account** where AWS IAM Identity Center is configured.
:::

## Step 1: Remove Application Assignment

1. Sign in to the **management account**
2. Open the [IAM Identity Center console](https://console.aws.amazon.com/singlesignon/)
3. Navigate to **Applications** > **Customer managed**
4. Select the **Sandbox for AWS** application
5. Choose the **Assigned users and groups** tab
6. Select all assigned groups (`SandboxAdmins`, `SandboxManagers`, `SandboxUsers`)
7. Choose **Unassign**

## Step 2: Delete the SAML Application

1. Return to the **Application details** page
2. Choose **Actions** > **Delete application**
3. Type the application name to confirm
4. Choose **Delete**

## Step 3: Clean Up Identity Center Groups (Optional)

If the groups were created specifically for Sandbox for AWS:

1. Navigate to **Groups**
2. Delete these groups if no longer needed:

| Group | Purpose |
|-------|---------|
| `SandboxAdmins` | Platform administrators |
| `SandboxManagers` | Lease approval managers |
| `SandboxUsers` | End-users requesting sandboxes |

:::info
If you use an external Identity Provider (Okta, Entra ID), also remove the SCIM provisioning configuration for these groups in your IdP console.
:::

## Step 4: Clean Up Identity Center Users (Optional)

If users were created specifically for testing:

1. Navigate to **Users**
2. Select test users created for Sandbox for AWS
3. Choose **Delete user**

## Verification Checklist

| Check | Expected |
|-------|----------|
| SAML application | Deleted |
| Group assignments | Removed |
| CloudFormation stacks | All deleted (previous step) |
| Sandbox accounts | Closed or returned to pool |

## Removal Complete

The Sandbox for AWS solution has been fully removed from your environment. Summary of what was cleaned up:

- 4 CloudFormation stacks deleted
- SAML application removed
- Identity Center groups unassigned
- All sandbox account leases terminated
