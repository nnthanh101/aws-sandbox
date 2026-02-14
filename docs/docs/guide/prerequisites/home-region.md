---
id: home-region
title: Select Your Home Region
sidebar_label: Home Region
sidebar_position: 3
---

# Select Your Home Region

Sandbox for AWS requires all stacks to deploy in a single **home region**. This region must match where IAM Identity Center is enabled.

## Region Requirements

| Requirement | Reason |
|------------|--------|
| IAM Identity Center must be enabled | The IDC stack integrates with Identity Center in this region |
| All 4 CDK stacks deploy here | Cross-region references are not supported |
| CloudFormation stack management | All stack operations happen in this region |

:::caution Critical
Once you choose a home region and deploy, you **cannot change it** without a full teardown and redeployment. Choose carefully.
:::

## Verify Your Identity Center Region

IAM Identity Center can only be enabled in one region per organization. Check which region it's in:

1. Sign in to the **management account**
2. Open the [IAM Identity Center console](https://console.aws.amazon.com/singlesignon/)
3. Note the **Region** in the top-right corner — this is your home region

```bash
# Or check via CLI (from management account)
aws sso-admin list-instances --region ap-southeast-2
```

If the command returns results, Identity Center is enabled in `ap-southeast-2`. If it returns empty, try other regions.

## Supported Regions

Sandbox for AWS can deploy in any region where all required services are available:

| Service | Required |
|---------|----------|
| IAM Identity Center | Yes |
| AWS Lambda | Yes |
| Amazon API Gateway | Yes |
| AWS Step Functions | Yes |
| Amazon DynamoDB | Yes |
| Amazon S3 | Yes |
| Amazon SES | Yes |
| AWS CloudFormation | Yes |

## Default Region

This project defaults to **`ap-southeast-2`** (Sydney). If you use a different region, update the configuration:

```bash
# In your CDK deployment
export CDK_DEFAULT_REGION=ap-southeast-2

# Or specify per command
npx cdk deploy --region ap-southeast-2
```

:::tip
Record your chosen region. You'll need it for every deployment and configuration step:
```
Home Region: ap-southeast-2
```
:::
