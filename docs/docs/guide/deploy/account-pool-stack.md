---
id: account-pool-stack
title: Deploy AccountPool Stack
sidebar_label: AccountPool Stack
sidebar_position: 2
---

# Deploy the AccountPool Stack

The AccountPool stack is the first stack to deploy. It creates the foundation for sandbox account lifecycle management, including the DynamoDB table for account tracking and the organizational unit structure.

## What This Stack Creates

| Resource | Type | Purpose |
|----------|------|---------|
| Account Pool Table | DynamoDB | Tracks sandbox account status (available, leased, cleaning) |
| Pool OU | Organizations OU | Holds available sandbox accounts |
| Lease OU | Organizations OU | Holds accounts with active leases |
| Account Lifecycle Lambda | Lambda Function | Manages account state transitions |
| SCP Management | IAM Policies | Service Control Policies for sandbox guardrails |

## Stack Parameters

| Parameter | Required | Description | Default |
|-----------|----------|-------------|---------|
| `sandboxOuId` | Yes | The Sandbox OU ID from the prerequisites step | — |
| `hubAccountId` | Yes | The hub account ID where stacks are deployed | — |
| `managementAccountId` | Yes | The organization management account ID | — |
| `homeRegion` | No | AWS region for deployment | `ap-southeast-2` |

## Deploy via Console

1. Sign in to the **hub account**
2. Open the [CloudFormation console](https://console.aws.amazon.com/cloudformation/) in your home region
3. Choose **Create stack** → **With new resources (standard)**
4. Upload the synthesized template or use S3 URL
5. Enter the stack name: `Sandbox-AccountPool`
6. Fill in the parameters:
   - **SandboxOuId**: Your Sandbox OU ID (e.g., `ou-xxxx-xxxxxxxx`)
   - **HubAccountId**: Your hub account ID
   - **ManagementAccountId**: Your management account ID
7. Review and choose **Submit**

## Deploy via CDK

```bash
# Synthesize first to validate
npx cdk synth Sandbox-AccountPool

# Deploy
npx cdk deploy Sandbox-AccountPool \
  --parameters sandboxOuId=ou-xxxx-xxxxxxxx \
  --parameters hubAccountId=111111111111 \
  --parameters managementAccountId=222222222222 \
  --region ap-southeast-2
```

Or via Docker:

```bash
docker exec sandbox-dev npx cdk deploy Sandbox-AccountPool \
  --parameters sandboxOuId=ou-xxxx-xxxxxxxx \
  --region ap-southeast-2
```

## Verify Deployment

After the stack reaches `CREATE_COMPLETE`:

```bash
# Check stack status
aws cloudformation describe-stacks \
  --stack-name Sandbox-AccountPool \
  --region ap-southeast-2 \
  --query "Stacks[0].StackStatus"

# Verify DynamoDB table was created
aws dynamodb describe-table \
  --table-name Sandbox-AccountPool \
  --region ap-southeast-2 \
  --query "Table.TableStatus"

# Verify sub-OUs were created
aws organizations list-organizational-units-for-parent \
  --parent-id ou-xxxx-sandbox \
  --query "OrganizationalUnits[].{Id:Id,Name:Name}"
```

## Stack Outputs

Record these outputs — they're needed by subsequent stacks:

| Output | Description | Example |
|--------|-------------|---------|
| `PoolOuId` | Pool OU ID | `ou-xxxx-pool` |
| `LeaseOuId` | Lease OU ID | `ou-xxxx-lease` |
| `AccountTableName` | DynamoDB table name | `Sandbox-AccountPool` |

```bash
aws cloudformation describe-stacks \
  --stack-name Sandbox-AccountPool \
  --region ap-southeast-2 \
  --query "Stacks[0].Outputs"
```

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `AccessDenied` on Organizations API | Hub account not delegated admin | Run `register-delegated-administrator` from management account |
| OU creation failed | Parent OU doesn't exist | Verify `sandboxOuId` parameter is correct |
| Stack stuck in `CREATE_IN_PROGRESS` | Lambda timeout | Check CloudWatch Logs for the lifecycle Lambda |
