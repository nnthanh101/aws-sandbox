---
id: maintenance-mode
title: Put Accounts in Maintenance Mode
sidebar_label: Maintenance Mode
sidebar_position: 1
---

# Put Accounts in Maintenance Mode

Before removing the solution, place all sandbox accounts into maintenance mode to prevent new leases and notify active users.

:::warning Prerequisite
You must be signed in as an **Administrator** in the Sandbox for AWS web portal.
:::

## Step 1: Disable New Lease Requests

1. Open the Sandbox for AWS web portal
2. Navigate to **Settings** > **Platform Configuration**
3. Set **Accept New Requests** to `Disabled`
4. Choose **Save**

This prevents end-users from requesting new sandbox accounts while you prepare for removal.

## Step 2: Notify Active Users

Send notification to all users with active leases:

1. Navigate to **Lease Management** > **Active Leases**
2. Note all active users and their lease expiry dates
3. Choose **Notify All** > **Platform Maintenance**
4. Set the maintenance window date and time

:::tip
Allow at least **48 hours** for users to save their work and export any resources they need from sandbox accounts.
:::

## Step 3: Set Lease Auto-Renewal to Disabled

```bash
# Verify no new leases can be created via API
aws dynamodb scan \
  --table-name Sandbox-Leases \
  --filter-expression "leaseStatus = :active" \
  --expression-attribute-values '{":active":{"S":"Active"}}' \
  --region ap-southeast-2 \
  --query "Count"
```

## Step 4: Verify Maintenance Mode

| Check | Expected | Command |
|-------|----------|---------|
| New requests blocked | 0 pending | Check portal **Pending Requests** = 0 |
| Users notified | All active users | Check notification log |
| Auto-renewal off | Disabled | Check **Settings** > **Lease Policy** |

## Next Step

Once all active leases have expired or been terminated, proceed to [End All Leases](./end-leases.md).
