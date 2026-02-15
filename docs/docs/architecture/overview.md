---
id: architecture-overview
title: Architecture Overview
sidebar_label: Overview
sidebar_position: 1
slug: /architecture/overview
---

# Architecture Overview

Sandbox for AWS is a multi-account management platform built on AWS CDK v2.

## High-Level Architecture

```mermaid
graph TB
    subgraph "Users"
        ADMIN[Administrator]
        MGR[Manager]
        USER[End-User]
    end

    subgraph "Frontend"
        CF[CloudFront]
        S3W[S3 - Web Assets]
        REACT[React + Cloudscape UI]
    end

    subgraph "API Layer"
        APIGW[API Gateway]
        WAF[AWS WAF]
        LAMBDA[Lambda Functions]
    end

    subgraph "Orchestration"
        SF[Step Functions]
        EB[EventBridge]
    end

    subgraph "Data Layer"
        DDB[DynamoDB]
        S3D[S3 - Artifacts]
        SES[SES - Notifications]
        KMS[KMS - Encryption]
    end

    subgraph "Identity"
        IDC[IAM Identity Center]
        SAML[SAML 2.0]
    end

    subgraph "Organizations"
        ORG[AWS Organizations]
        SCP[Service Control Policies]
        OU[Sandbox OU]
    end

    ADMIN & MGR & USER --> CF
    CF --> S3W
    S3W --> REACT
    REACT --> APIGW
    WAF --> APIGW
    APIGW --> LAMBDA
    LAMBDA --> SF
    SF --> EB
    LAMBDA --> DDB
    SF --> DDB
    SF --> SES
    DDB --> KMS
    S3D --> KMS
    IDC --> SAML
    SAML --> REACT
    SF --> ORG
    ORG --> SCP
    SCP --> OU
```

## Design Principles

| Principle | Implementation |
|-----------|---------------|
| **Least Privilege** | IAM roles with minimum permissions per function |
| **Defense in Depth** | WAF + SCPs + IAM + KMS encryption |
| **Serverless-First** | Lambda, DynamoDB, Step Functions (no EC2) |
| **Event-Driven** | EventBridge for decoupled communication |
| **Infrastructure as Code** | CDK v2 with TypeScript |

## Component Interaction

```mermaid
sequenceDiagram
    participant User
    participant Portal as Web Portal
    participant API as API Gateway
    participant SF as Step Functions
    participant DDB as DynamoDB
    participant ORG as Organizations

    User->>Portal: Request sandbox
    Portal->>API: POST /leases
    API->>SF: Start lease workflow
    SF->>DDB: Create lease record
    SF->>ORG: Assign account to user
    SF->>DDB: Update status ACTIVE
    SF-->>User: Email notification
```

## Generated Architecture Diagrams

Enterprise architecture with AWS cloud icons (generated via `task diagrams:generate`):

![Enterprise Architecture](/diagrams/enterprise_architecture.png)

![Sandbox Components](/diagrams/sandbox_components.png)

## Reference Diagrams (Legacy)

The following DrawIO diagrams from the upstream project are available in `/static/diagrams/architecture/`:

- `high-level.drawio.svg` — Original high-level architecture
- `in-depth.drawio.svg` — Detailed component diagram
- `stack-dependencies.drawio.svg` — Stack dependency graph
- `stack-relationships.drawio.svg` — Inter-stack relationships
