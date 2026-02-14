---
id: administrator
title: Use as an Administrator
sidebar_label: Administrator
sidebar_position: 2
---

# Use as an Administrator

Administrators have full platform management access. This tutorial walks through common administration tasks.

## Administrator Capabilities

| Task | Description |
|------|-------------|
| Register accounts | Add new sandbox accounts to the pool |
| Manage SCPs | Configure Service Control Policies for sandbox guardrails |
| Monitor platform | View active leases, account utilization, and system health |
| Configure settings | Adjust lease durations, budgets, and notification settings |
| Force cleanup | Manually trigger account cleanup for stuck accounts |
| View audit logs | Review all actions taken through the platform |

## Sign In

1. Open the web portal URL (from Compute stack output)
2. Sign in via IAM Identity Center with an account in the `SandboxAdmins` group
3. You should see the **Administrator Dashboard**

## Register New Sandbox Accounts

To add more sandbox accounts to the pool:

1. Navigate to **Account Management**
2. Choose **Register Account**
3. Enter the AWS account ID
4. Optionally, enter a friendly name (e.g., `Sandbox-003`)
5. Choose **Register**

The system will:
- Move the account to the Pool OU
- Apply Service Control Policies
- Run an initial cleanup scan
- Mark the account as `available`

:::info
Account registration typically takes 2-5 minutes. Monitor progress in the **Account Management** view.
:::

## Configure Service Control Policies

SCPs restrict what actions users can perform in sandbox accounts.

1. Navigate to **Settings** → **Service Control Policies**
2. Review the default SCPs:
   - **Region Restriction**: Limits sandbox usage to approved regions
   - **Service Restriction**: Blocks high-cost or dangerous services
   - **IAM Restriction**: Prevents privilege escalation
3. Modify or add SCPs as needed

### Default SCP — Region Restriction

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyNonApprovedRegions",
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:RequestedRegion": ["ap-southeast-2", "us-east-1"]
        }
      }
    }
  ]
}
```

### Default SCP — Dangerous Service Restriction

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyDangerousServices",
      "Effect": "Deny",
      "Action": [
        "organizations:*",
        "account:*",
        "iam:CreateUser",
        "iam:CreateAccessKey"
      ],
      "Resource": "*"
    }
  ]
}
```

## Monitor Platform Health

The dashboard shows:

- **Active Leases**: How many sandbox accounts are currently in use
- **Available Accounts**: How many accounts are in the pool
- **Pending Requests**: Requests awaiting manager approval
- **Account Utilization**: Percentage of pool in active use

## Force Account Cleanup

If an account is stuck in `cleaning` status:

1. Navigate to **Account Management**
2. Find the stuck account
3. Choose **Actions** → **Force Cleanup**
4. Confirm the action

This reruns the cleanup state machine which will nuke all resources and return the account to the pool.
