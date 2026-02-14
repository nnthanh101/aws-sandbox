---
id: quotas
title: Service Quotas & Limits
sidebar_label: Quotas & Limits
sidebar_position: 4
---

# Service Quotas & Limits

Key AWS service quotas that affect Sandbox for AWS deployment and operation.

## Account-Level Quotas

| Service | Quota | Default Limit | Impact |
|---------|-------|--------------|--------|
| **AWS Organizations** | Accounts per organization | 10 | Limits total sandbox accounts |
| **AWS Organizations** | OUs per organization | 1,000 | Not typically a constraint |
| **IAM Identity Center** | Applications per instance | 500 | One used by Sandbox for AWS |
| **IAM Identity Center** | Groups per instance | 100,000 | Three used (Admins, Managers, Users) |

:::tip Increase Organization Account Limit
For production deployments, request an increase to the **accounts per organization** quota:
1. Open [Service Quotas console](https://console.aws.amazon.com/servicequotas/)
2. Search for **AWS Organizations**
3. Select **Maximum number of accounts in an organization**
4. Choose **Request increase**
:::

## Hub Account Quotas

| Service | Quota | Default Limit | Sandbox Usage |
|---------|-------|--------------|---------------|
| **Lambda** | Concurrent executions | 1,000 | ~50-100 per active lease operation |
| **DynamoDB** | Tables per region | 2,500 | 4-6 tables |
| **API Gateway** | REST APIs per region | 600 | 1 API |
| **Step Functions** | State machines per region | 10,000 | 2-3 state machines |
| **S3** | Buckets per account | 100 | 3-5 buckets |
| **SES** | Emails per day (sandbox) | 200 | Lease notifications |
| **EventBridge** | Rules per event bus | 300 | 5-10 rules |
| **CloudFront** | Distributions per account | 200 | 1 distribution |

## Sandbox Account Quotas

Each sandbox account inherits the default AWS quota limits. Common limits that sandbox users may encounter:

| Service | Quota | Default Limit | Request Increase? |
|---------|-------|--------------|-------------------|
| **EC2** | On-Demand instances | 5-20 (varies by type) | No (SCP controlled) |
| **VPC** | VPCs per region | 5 | No |
| **EBS** | Volume storage (GiB) | 50,000 | No |
| **RDS** | DB instances | 40 | No |
| **S3** | Buckets per account | 100 | No |

:::info
Sandbox accounts should NOT have quota increases requested. The default limits serve as natural guardrails. If users need higher limits, they should use a non-sandbox environment.
:::

## Budget Limits

| Setting | Default | Configurable |
|---------|---------|-------------|
| **Per-lease budget** | $50 USD | Yes (per-role) |
| **Manager lease budget** | $200 USD | Yes |
| **Admin lease budget** | $500 USD | Yes |
| **Budget alert threshold** | 80% | Yes |
| **Budget exceeded action** | Terminate lease | Yes |

## Monitoring Quotas

Track quota utilization in the hub account:

```bash
# Check Lambda concurrent executions
aws service-quotas get-service-quota \
  --service-code lambda \
  --quota-code L-B99A9384 \
  --region ap-southeast-2

# Check Organizations account limit
aws service-quotas get-service-quota \
  --service-code organizations \
  --quota-code L-29A0C5DF \
  --region us-east-1
```
