---
id: manager
title: Use as a Manager
sidebar_label: Manager
sidebar_position: 3
---

# Use as a Manager

Managers approve or deny sandbox requests and manage active leases. This tutorial walks through the manager workflow.

## Manager Capabilities

| Task | Description |
|------|-------------|
| Review requests | See pending sandbox requests from end-users |
| Approve/deny | Grant or reject sandbox access |
| Extend leases | Give users more time in their sandbox |
| Terminate leases | End a lease early and trigger cleanup |
| View reports | See usage patterns and cost summaries |

## Sign In

1. Open the web portal URL
2. Sign in via IAM Identity Center with an account in the `SandboxManagers` group
3. You should see the **Manager Dashboard** with pending requests highlighted

## Approve a Sandbox Request

When an end-user submits a sandbox request:

1. You receive an **email notification** (via SES)
2. Navigate to **Requests** → **Pending** tab
3. Review the request details:
   - **Requester**: Who is asking
   - **Justification**: Why they need a sandbox
   - **Duration**: How long they need it
   - **Budget**: Requested budget limit
4. Choose **Approve** or **Deny**

If approved:
- The system provisions a sandbox account from the pool
- The requester receives an email with access instructions
- The lease timer starts

If denied:
- The requester receives an email explaining the denial
- No account is provisioned

## Extend a Lease

If a user needs more time:

1. Navigate to **Leases** → **Active** tab
2. Find the lease to extend
3. Choose **Actions** → **Extend Lease**
4. Enter the extension duration (hours)
5. Choose **Confirm**

:::info
Extensions cannot exceed the maximum lease duration configured by the administrator.
:::

## Terminate a Lease Early

To end a lease before it expires:

1. Navigate to **Leases** → **Active** tab
2. Find the lease to terminate
3. Choose **Actions** → **Terminate**
4. Enter a reason (sent to the user)
5. Choose **Confirm**

The system will:
- Notify the user via email
- Start the cleanup process
- Return the account to the pool after cleanup

## View Usage Reports

1. Navigate to **Reports**
2. Available views:
   - **Active Leases**: Current sandbox usage
   - **Historical**: Past lease activity
   - **Cost Summary**: Spend per sandbox account
   - **User Activity**: Requests per user

## Notification Settings

Managers receive notifications for:
- New sandbox requests (immediate)
- Lease expiry warnings (configurable: 24h, 4h, 1h before)
- Budget threshold alerts (at 50%, 80%, 100% of budget)

Configure notification preferences in **Settings** → **Notifications**.
