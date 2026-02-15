---
id: multi-cloud
title: Multi-Cloud Architecture
sidebar_label: Multi-Cloud
sidebar_position: 6
---

# Multi-Cloud Architecture

Sandbox for AWS supports multi-cloud enterprise patterns: AWS (CDK) + Azure (Terraform) + local Docker development.

## Decision Framework

```mermaid
quadrantChart
    title IaC Tool Selection
    x-axis Low Maturity --> High Maturity
    y-axis Low Complexity --> High Complexity
    quadrant-1 CDK (TypeScript)
    quadrant-2 Pulumi
    quadrant-3 Terraform (HCL)
    quadrant-4 CloudFormation
    AWS CDK v2: [0.8, 0.75]
    Terraform: [0.85, 0.5]
    Pulumi: [0.5, 0.7]
    CloudFormation: [0.9, 0.3]
    ARM Templates: [0.6, 0.4]
    Bicep: [0.55, 0.55]
```

## CDK vs Terraform Decision Tree

```mermaid
graph TD
    START{New Infrastructure<br/>Component?}

    START -->|AWS-only| AWS_Q{Complex Logic?<br/>Loops, conditionals}
    START -->|Multi-cloud| TF[Terraform HCL]
    START -->|Azure-only| TF

    AWS_Q -->|Yes| CDK[AWS CDK v2<br/>TypeScript]
    AWS_Q -->|No, simple| CFN_Q{Team Expertise?}

    CFN_Q -->|TypeScript| CDK
    CFN_Q -->|HCL/Ops| TF
    CFN_Q -->|Neither| CDK

    CDK --> SYNTH[cdk synth → CFN]
    TF --> PLAN[terraform plan → State]

    SYNTH --> TEST_CDK[Tier 1: Vitest Snapshots<br/>Tier 2: LocalStack]
    PLAN --> TEST_TF[Tier 1: terraform validate<br/>Tier 2: LocalStack]

    style CDK fill:#f9f,stroke:#333,stroke-width:2px
    style TF fill:#bbf,stroke:#333,stroke-width:2px
```

## AWS CDK Architecture (Current)

```mermaid
graph TB
    subgraph "CDK Application"
        APP[CDK App<br/>bin/sandbox-app.ts]

        subgraph "4 Stacks"
            S1[Sandbox-AccountPool<br/>Organizations + Pool]
            S2[Sandbox-IDC<br/>Identity Center + SAML]
            S3[Sandbox-Data<br/>DynamoDB + S3 + SES + KMS]
            S4[Sandbox-Compute<br/>Lambda + API GW + Step Functions + CloudFront]
        end
    end

    subgraph "Testing"
        T1[Tier 1: Vitest Snapshots<br/>82 suites, 721 tests]
        T2[Tier 2: LocalStack<br/>Integration tests]
        T3[Tier 3: AWS<br/>Real deployment]
    end

    subgraph "Output"
        CFN[CloudFormation<br/>~85 resources]
        ASSETS[CDK Assets<br/>Lambda bundles + S3]
    end

    APP --> S1 & S2 & S3 & S4
    S4 -.->|depends on| S1 & S2 & S3
    S1 & S2 & S3 & S4 --> CFN
    S4 --> ASSETS
    CFN --> T1 & T2 & T3
```

## Azure Terraform Migration Path

For organizations extending to Azure, the infrastructure pattern maps as follows:

```mermaid
graph LR
    subgraph "AWS (CDK v2)"
        A_ORG[Organizations]
        A_IDC[Identity Center]
        A_DDB[DynamoDB]
        A_S3[S3]
        A_LAMBDA[Lambda]
        A_APIGW[API Gateway]
        A_SF[Step Functions]
        A_CF[CloudFront]
    end

    subgraph "Azure (Terraform)"
        Z_MG[Management Groups]
        Z_AAD[Entra ID]
        Z_COSMOS[Cosmos DB]
        Z_BLOB[Blob Storage]
        Z_FUNC[Azure Functions]
        Z_APIM[API Management]
        Z_LOGIC[Logic Apps]
        Z_CDN[Azure CDN]
    end

    A_ORG -.-> Z_MG
    A_IDC -.-> Z_AAD
    A_DDB -.-> Z_COSMOS
    A_S3 -.-> Z_BLOB
    A_LAMBDA -.-> Z_FUNC
    A_APIGW -.-> Z_APIM
    A_SF -.-> Z_LOGIC
    A_CF -.-> Z_CDN
```

## AWS-to-Azure Service Mapping

| AWS Service | Azure Equivalent | IaC Tool | Notes |
|-------------|-----------------|----------|-------|
| Organizations | Management Groups | Terraform | Multi-tenant hierarchy |
| IAM Identity Center | Entra ID (Azure AD) | Terraform | SAML/OIDC SSO |
| DynamoDB | Cosmos DB | Terraform | Serverless NoSQL |
| S3 | Blob Storage | Terraform | Object storage |
| Lambda | Azure Functions | Terraform | Serverless compute |
| API Gateway | API Management | Terraform | REST API facade |
| Step Functions | Logic Apps / Durable Functions | Terraform | Workflow orchestration |
| CloudFront | Azure CDN / Front Door | Terraform | CDN + WAF |
| KMS | Azure Key Vault | Terraform | Encryption keys |
| SES | SendGrid / Communication Services | Terraform | Email delivery |
| EventBridge | Event Grid | Terraform | Event routing |
| CloudWatch | Azure Monitor | Terraform | Observability |

## Deployment Patterns

```mermaid
graph TB
    subgraph "Development (Local)"
        DOCKER[Docker Compose<br/>SSOT Pattern]
        LS[LocalStack<br/>AWS Emulation]
        DEV[sandbox-dev<br/>CDK + Terraform]
    end

    subgraph "Staging (AWS)"
        AWS_STG[AWS Sandbox Account<br/>CDK Deploy]
    end

    subgraph "Staging (Azure)"
        AZ_STG[Azure Subscription<br/>Terraform Apply]
    end

    subgraph "Production"
        AWS_PROD[AWS Hub Account<br/>CDK Deploy]
        AZ_PROD[Azure Tenant<br/>Terraform Apply]
    end

    DEV -->|Tier 1+2| DOCKER --> LS
    DEV -->|Tier 3| AWS_STG
    DEV -->|Tier 3| AZ_STG
    AWS_STG -->|promoted| AWS_PROD
    AZ_STG -->|promoted| AZ_PROD
```

## Key Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary IaC | CDK v2 (TypeScript) | Type-safe, 4 stacks, 85 resources, existing codebase |
| Secondary IaC | Terraform (HCL) | Multi-cloud, Azure support, broader ecosystem |
| Package Manager | npm (Node.js) + uv (Python) | CDK is TypeScript-native; diagrams uses Python |
| Testing | Vitest (CDK) + terraform test (HCL) | Native testing per tool |
| Documentation | Docusaurus + MkDocs | GitHub Pages / Cloudflare deploy |
