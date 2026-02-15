---
id: data-flow
title: Data Flow Architecture
sidebar_label: Data Flow
sidebar_position: 5
---

# Data Flow Architecture

End-to-end data flow through the Sandbox for AWS platform: DynamoDB tables, S3 buckets, SES emails, and EventBridge events.

## System Data Flow

```mermaid
graph TB
    subgraph "Users"
        ADMIN[Administrator]
        MGR[Manager]
        USER[End-User]
    end

    subgraph "Frontend"
        CF[CloudFront CDN]
        S3W[S3 Web Assets]
        REACT[React + Cloudscape]
    end

    subgraph "API Layer"
        WAF[AWS WAF]
        APIGW[API Gateway REST]
        AUTH[SAML Auth Lambda]
    end

    subgraph "Compute"
        LAMBDAS[21 Lambda Functions]
        SF[Step Functions]
        EB[EventBridge Scheduler]
    end

    subgraph "Data Layer"
        DDB[(DynamoDB<br/>accounts, leases, lease-templates)]
        S3D[4 S3 Buckets]
        SES[SES Notifications]
        KMS[KMS Encryption]
    end

    subgraph "AWS Organizations"
        ORG[Organizations API]
        SCP[Service Control Policies]
        POOL[Sandbox Account Pool]
    end

    ADMIN & MGR & USER -->|HTTPS| CF
    CF --> S3W --> REACT
    REACT -->|REST API| WAF --> APIGW
    APIGW -->|Cognito/SAML| AUTH
    APIGW --> LAMBDAS
    LAMBDAS -->|CRUD| DDB
    LAMBDAS -->|orchestrate| SF
    SF -->|read/write| DDB
    SF -->|send email| SES
    SF -->|manage accounts| ORG
    EB -->|scheduled| LAMBDAS
    ORG --> SCP --> POOL
    DDB -.->|encrypted| KMS
    S3D -.->|encrypted| KMS
```

## DynamoDB Data Model

```mermaid
erDiagram
    ACCOUNTS {
        string accountId PK
        string status "AVAILABLE | LEASED | CLEANING | FROZEN"
        string accountEmail
        string ouId
        timestamp createdAt
        timestamp lastCleanedAt
    }
    LEASE_TEMPLATES {
        string templateId PK
        string templateName
        number defaultBudget
        number defaultDuration
        json policies
        timestamp createdAt
    }
    LEASES {
        string leaseId PK
        string accountId FK
        string templateId FK
        string userId
        string status "ACTIVE | EXPIRED | TERMINATED"
        number budgetAmount
        number currentSpend
        timestamp expiresAt
        timestamp createdAt
    }

    ACCOUNTS ||--o{ LEASES : "assigned to"
    LEASE_TEMPLATES ||--o{ LEASES : "instantiates"
```

## Lease Lifecycle Sequence

```mermaid
sequenceDiagram
    participant User
    participant Portal as Web Portal
    participant API as API Gateway
    participant SF as Step Functions
    participant DDB as DynamoDB
    participant ORG as Organizations
    participant SES as SES Email

    User->>Portal: Request sandbox
    Portal->>API: POST /leases
    API->>SF: StartExecution (lease-workflow)

    SF->>DDB: Query available accounts
    DDB-->>SF: Account list

    SF->>DDB: Create lease (status: PROVISIONING)
    SF->>ORG: MoveAccount (to user OU)
    ORG-->>SF: Success

    SF->>DDB: Update lease (status: ACTIVE)
    SF->>SES: Send welcome email
    SES-->>User: Sandbox ready notification

    Note over SF,DDB: Budget monitoring (EventBridge)

    SF->>DDB: Update lease (status: EXPIRED)
    SF->>ORG: MoveAccount (back to pool OU)
    SF->>SF: Start cleanup workflow
    SF->>SES: Send expiry notification
    SES-->>User: Lease expired
```

## Account Cleanup State Machine

```mermaid
stateDiagram-v2
    [*] --> Available: Initial provisioning

    Available --> Leased: Lease created
    Leased --> Expired: TTL reached
    Leased --> Terminated: Admin/user terminates
    Leased --> Frozen: Budget exceeded

    Expired --> Cleaning: Auto-cleanup triggered
    Terminated --> Cleaning: Cleanup workflow
    Frozen --> Cleaning: Admin unfreezes

    Cleaning --> Available: Cleanup complete
    Cleaning --> Quarantine: Cleanup failed

    Quarantine --> Cleaning: Retry
    Quarantine --> Decommissioned: Admin removes

    Decommissioned --> [*]
```

## S3 Data Flow

```mermaid
graph LR
    subgraph "S3 Buckets"
        WEB[Web Assets Bucket<br/>CloudFront origin]
        DATA[Data Bucket<br/>Artifacts + logs]
        ACCESS[Access Logs Bucket<br/>S3 server logs]
    end

    subgraph "Producers"
        BUILD[CDK Build] -->|deploy| WEB
        LAMBDA[Lambda Functions] -->|write| DATA
        S3LOGS[S3 Logging] -->|auto| ACCESS
    end

    subgraph "Consumers"
        CF[CloudFront] -->|serve| WEB
        AUDIT[Audit Lambda] -->|read| DATA
        COMPLIANCE[Compliance Check] -->|read| ACCESS
    end

    KMS[KMS Key] -.->|encrypts| WEB
    KMS -.->|encrypts| DATA
    KMS -.->|encrypts| ACCESS
```

## Event-Driven Architecture

```mermaid
graph LR
    subgraph "Event Sources"
        EB_SCHED[EventBridge<br/>Scheduled Rules]
        DDB_STREAM[DynamoDB<br/>Streams]
        SF_EVENT[Step Functions<br/>State Changes]
    end

    subgraph "Event Bus"
        BUS[EventBridge Bus<br/>sandbox-events]
    end

    subgraph "Event Targets"
        BUDGET[Budget Check<br/>Lambda]
        EXPIRY[Expiry Check<br/>Lambda]
        NOTIFY[Notification<br/>Lambda]
        AUDIT[Audit Log<br/>Lambda]
    end

    EB_SCHED -->|cron: hourly| BUS
    DDB_STREAM -->|record change| BUS
    SF_EVENT -->|state change| BUS

    BUS -->|budget.check| BUDGET
    BUS -->|lease.expiry| EXPIRY
    BUS -->|notification.*| NOTIFY
    BUS -->|audit.*| AUDIT
```
