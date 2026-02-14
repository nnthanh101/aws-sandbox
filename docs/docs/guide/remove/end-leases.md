---
id: end-leases
title: End All Active Leases
sidebar_label: End Leases
sidebar_position: 2
---

# End All Active Leases

Terminate all active sandbox leases to return accounts to the pool before stack deletion.

:::danger Data Loss Warning
Ending a lease triggers the cleanup state machine which **permanently deletes all resources** in the sandbox account. Ensure users have exported any needed data.
:::

## Step 1: List Active Leases

```bash
# List all active leases
aws dynamodb scan \
  --table-name Sandbox-Leases \
  --filter-expression "leaseStatus = :active" \
  --expression-attribute-values '{":active":{"S":"Active"}}' \
  --region ap-southeast-2 \
  --output table
```

## Step 2: Terminate Leases via Portal

1. Open the Sandbox for AWS web portal as **Administrator**
2. Navigate to **Lease Management** > **Active Leases**
3. For each active lease:
   - Select the lease
   - Choose **Actions** > **Terminate Lease**
   - Confirm the termination

## Step 3: Terminate Leases via CLI (Batch)

For large deployments, use the API to batch-terminate:

```bash
# Get all active lease IDs
LEASE_IDS=$(aws dynamodb scan \
  --table-name Sandbox-Leases \
  --filter-expression "leaseStatus = :active" \
  --expression-attribute-values '{":active":{"S":"Active"}}' \
  --projection-expression "leaseId" \
  --region ap-southeast-2 \
  --query "Items[].leaseId.S" \
  --output text)

echo "Active leases to terminate: $LEASE_IDS"
```

## Step 4: Wait for Cleanup Completion

The cleanup state machine processes each account:

1. Deletes all CloudFormation stacks in the sandbox account
2. Removes all IAM roles and policies (except service-linked)
3. Empties and deletes S3 buckets
4. Terminates EC2 instances and related resources

```bash
# Monitor cleanup progress
aws stepfunctions list-executions \
  --state-machine-arn arn:aws:states:ap-southeast-2:ACCOUNT_ID:stateMachine:Sandbox-AccountCleanup \
  --status-filter RUNNING \
  --region ap-southeast-2
```

## Step 5: Verify All Leases Ended

| Check | Expected |
|-------|----------|
| Active leases | 0 |
| Running cleanups | 0 |
| Account statuses | All `Available` or `NotRegistered` |

## Next Step

Once all leases are ended and cleanups complete, proceed to [Delete CloudFormation Stacks](./delete-stacks.md).
