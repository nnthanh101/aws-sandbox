---
id: regions
title: Supported AWS Regions
sidebar_label: Supported Regions
sidebar_position: 2
---

# Supported AWS Regions

Sandbox for AWS supports deployment in specific AWS regions based on service availability for IAM Identity Center, AWS Organizations, and the required compute services.

## Primary Region

| Setting | Value |
|---------|-------|
| **Default Home Region** | `ap-southeast-2` (Sydney) |
| **Region Override** | Set via CDK context parameter `homeRegion` |

:::info
All four CDK stacks **must** be deployed in the same region. Cross-region deployment is not supported.
:::

## Supported Regions

The following regions support all required AWS services (IAM Identity Center, Organizations, Step Functions, API Gateway, CloudFront, DynamoDB, Lambda, SES, EventBridge):

| Region Code | Region Name | IAM IdC | Supported |
|-------------|-------------|---------|-----------|
| `us-east-1` | N. Virginia | Yes | Yes |
| `us-east-2` | Ohio | Yes | Yes |
| `us-west-2` | Oregon | Yes | Yes |
| `eu-west-1` | Ireland | Yes | Yes |
| `eu-west-2` | London | Yes | Yes |
| `eu-central-1` | Frankfurt | Yes | Yes |
| `ap-southeast-1` | Singapore | Yes | Yes |
| `ap-southeast-2` | Sydney | Yes | **Yes (Default)** |
| `ap-northeast-1` | Tokyo | Yes | Yes |
| `ap-northeast-2` | Seoul | Yes | Yes |
| `ap-south-1` | Mumbai | Yes | Yes |
| `ca-central-1` | Canada | Yes | Yes |
| `sa-east-1` | Sao Paulo | Yes | Yes |

## Unsupported Regions

These regions lack one or more required services:

| Region Code | Region Name | Missing Service |
|-------------|-------------|----------------|
| `af-south-1` | Cape Town | IAM Identity Center |
| `ap-east-1` | Hong Kong | IAM Identity Center |
| `me-south-1` | Bahrain | Limited Step Functions |
| `eu-south-1` | Milan | Limited SES |

## Sandbox Account Region Restrictions

Sandbox accounts are restricted via Service Control Policies (SCPs) to approved regions only. By default, sandbox users can only create resources in:

- The home region (e.g., `ap-southeast-2`)
- `us-east-1` (required for global services like IAM, CloudFront, Route 53)

To modify the allowed regions, update the region restriction SCP. See [Administrator Guide](./use/administrator.md) for SCP configuration.

## Changing the Home Region

To deploy in a different region:

```bash
# Set home region via CDK context
npx cdk deploy --all --context homeRegion=eu-west-1

# Or set in cdk.json
{
  "context": {
    "homeRegion": "eu-west-1"
  }
}
```

:::warning
Changing the home region after initial deployment requires a complete redeployment. Existing data will not be migrated.
:::
