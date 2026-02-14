---
id: cost-management
title: Cost Management
sidebar_label: Cost Management
sidebar_position: 1
---

# Cost Management

Sandbox for AWS integrates with AWS cost management tools and supports FOCUS 1.2+ allocation tags.

## Cost Components

| Component | Estimated Cost | Notes |
|-----------|---------------|-------|
| Platform (hub account) | $36-149/month | Lambda, DynamoDB, API GW, S3 |
| Per sandbox account | Variable | Depends on user activity |
| IAM Identity Center | Free | Included with AWS Organizations |

## FOCUS Cost Allocation Tags

Enterprise cost allocation tags follow the FOCUS 1.2+ standard:

| Tag Key | Example Value | Purpose |
|---------|--------------|---------|
| `focus:ServiceName` | `sandbox-for-aws` | Service identification |
| `focus:ServiceCategory` | `Platform` | Category classification |
| `focus:ChargeCategory` | `Usage` | Charge type |
| `CostCenter` | `IT-Platform-001` | Business cost center |
| `Environment` | `sandbox` | Environment type |
| `Owner` | `platform-team` | Responsible team |

## Infracost Shift-Left Estimation

Estimate costs before deployment using Infracost:

```bash
# Estimate all stacks
task cost:estimate

# Estimate a single stack
task cost:estimate:stack -- Sandbox-Compute
```

## Budget Controls

Each sandbox account can have budget limits:
- Default per-account budget: $50/month
- Budget alerts at 50%, 80%, 100%
- Automatic freeze at 100% (configurable)

## Monitoring Costs

```bash
# View sandbox account costs
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=TAG,Key=Environment \
  --filter '{"Tags": {"Key": "Environment", "Values": ["sandbox"]}}' \
  --region ap-southeast-2
```
