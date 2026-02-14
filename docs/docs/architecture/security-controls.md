---
id: security-controls
title: Security Controls
sidebar_label: Security Controls
sidebar_position: 3
---

# Security Controls

Sandbox for AWS implements defense-in-depth security across multiple layers.

## Security Layers

```mermaid
graph TD
    subgraph "Layer 1: Network"
        WAF[AWS WAF]
        CF[CloudFront]
    end

    subgraph "Layer 2: Identity"
        IDC[IAM Identity Center]
        SAML[SAML 2.0]
        PERMS[Permission Sets]
    end

    subgraph "Layer 3: Authorization"
        IAM[IAM Policies]
        SCP[Service Control Policies]
        RBAC[Role-Based Access]
    end

    subgraph "Layer 4: Data Protection"
        KMS[KMS Encryption]
        S3E[S3 Bucket Policies]
        DDE[DynamoDB Encryption]
    end

    subgraph "Layer 5: Monitoring"
        CT[CloudTrail]
        CW[CloudWatch]
        AUDIT[Audit Logs]
    end

    WAF --> IDC --> IAM --> KMS --> CT
```

## Service Control Policies

SCPs applied to the Sandbox OU restrict user actions:

### Region Restriction

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyOutsideHomeRegion",
    "Effect": "Deny",
    "Action": "*",
    "Resource": "*",
    "Condition": {
      "StringNotEquals": {
        "aws:RequestedRegion": ["ap-southeast-2"]
      },
      "ArnNotLike": {
        "aws:PrincipalARN": "arn:aws:iam::*:role/Sandbox-*"
      }
    }
  }]
}
```

### Deny Dangerous Actions

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyDangerousActions",
    "Effect": "Deny",
    "Action": [
      "organizations:LeaveOrganization",
      "account:CloseAccount",
      "iam:CreateUser",
      "iam:CreateAccessKey"
    ],
    "Resource": "*"
  }]
}
```

## KMS Encryption

All data at rest is encrypted with KMS keys:

| Resource | Encryption |
|----------|-----------|
| DynamoDB tables | AWS-managed KMS |
| S3 buckets | Customer-managed KMS (SSE-KMS) |
| CloudWatch Logs | KMS encryption |
| SES | TLS in transit |

## IAM Least Privilege

Each Lambda function has its own IAM role with minimum required permissions. No function has `*` resource access.
