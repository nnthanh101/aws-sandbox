---
id: idc-stack
title: Deploy IDC Stack
sidebar_label: IDC Stack
sidebar_position: 3
---

# Deploy the IDC Stack

The IDC (Identity Center) stack configures AWS IAM Identity Center integration, enabling SSO-based access to sandbox accounts through SAML 2.0 federation.

## Prerequisites

- **Sandbox-AccountPool** stack deployed successfully
- IAM Identity Center enabled in your home region
- Management account access for Identity Center API calls

## What This Stack Creates

| Resource | Type | Purpose |
|----------|------|---------|
| SAML Provider | IAM SAML Provider | Federation trust between Identity Center and hub account |
| Permission Sets | SSO Permission Sets | Access levels for sandbox users |
| Assignment Lambda | Lambda Function | Automates SSO assignment when leases are approved |
| Identity Store Lookup | Lambda Function | Resolves user/group IDs from Identity Center |

## Stack Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `identityCenterInstanceArn` | Yes | ARN of your IAM Identity Center instance |
| `identityCenterRegion` | Yes | Region where Identity Center is enabled |
| `accountPoolTableName` | Yes | From AccountPool stack outputs |

## Deploy

```bash
# Get Identity Center instance ARN
aws sso-admin list-instances \
  --region ap-southeast-2 \
  --query "Instances[0].InstanceArn" --output text

# Deploy the IDC stack
npx cdk deploy Sandbox-IDC \
  --parameters identityCenterInstanceArn=arn:aws:sso:::instance/ssoins-xxxxxxxxxx \
  --region ap-southeast-2
```

Or via Docker:

```bash
docker exec sandbox-dev npx cdk deploy Sandbox-IDC \
  --parameters identityCenterInstanceArn=arn:aws:sso:::instance/ssoins-xxxxxxxxxx \
  --region ap-southeast-2
```

## Verify Deployment

```bash
# Check stack status
aws cloudformation describe-stacks \
  --stack-name Sandbox-IDC \
  --region ap-southeast-2 \
  --query "Stacks[0].StackStatus"

# Verify SAML provider
aws iam list-saml-providers \
  --query "SAMLProviderList[?contains(Arn, 'Sandbox')]"
```

## Stack Outputs

| Output | Description |
|--------|-------------|
| `SamlProviderArn` | ARN of the SAML identity provider |
| `AssignmentLambdaArn` | Lambda for SSO assignments |
| `AcsUrl` | Assertion Consumer Service URL for SAML configuration |
| `EntityId` | SAML Entity ID for the hub account |

Record the **ACS URL** and **Entity ID** — you'll need them when [configuring the SAML application](/docs/guide/configure/saml-application).

```bash
aws cloudformation describe-stacks \
  --stack-name Sandbox-IDC \
  --region ap-southeast-2 \
  --query "Stacks[0].Outputs"
```

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Identity Center instance not found | Wrong region or not enabled | Verify Identity Center is enabled in `ap-southeast-2` |
| Permission denied on SSO Admin API | Missing delegated admin | Register hub account as delegated admin for SSO |
| SAML provider creation failed | Duplicate provider name | Check if a SAML provider already exists and remove it |
